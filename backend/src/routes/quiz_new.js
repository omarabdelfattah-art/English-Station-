const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        lesson:lessons(*),
        questions:quiz_questions(
          *,
          answers:quiz_answers(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// Get a single quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        lesson:lessons(*),
        questions:quiz_questions(
          *,
          answers:quiz_answers(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// Create a new quiz
router.post('/', async (req, res) => {
  try {
    const { title, description, lessonId, timeLimit, questions } = req.body;

    // Create the quiz
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert([{ 
        title, 
        description, 
        lesson_id: parseInt(lessonId), 
        time_limit: timeLimit ? parseInt(timeLimit) : null 
      }])
      .select()
      .single();

    if (quizError) {
      throw quizError;
    }

    // Create questions and answers
    for (const q of questions) {
      // Create the question
      const { data: question, error: questionError } = await supabase
        .from('quiz_questions')
        .insert([{ 
          content: q.content, 
          type: q.type, 
          quiz_id: quiz.id 
        }])
        .select()
        .single();

      if (questionError) {
        throw questionError;
      }

      // Create answers for this question
      const answersToInsert = q.answers.map(a => ({
        content: a.content,
        is_correct: a.isCorrect,
        question_id: question.id
      }));

      const { error: answersError } = await supabase
        .from('quiz_answers')
        .insert(answersToInsert);

      if (answersError) {
        throw answersError;
      }
    }

    // Get the complete quiz with all relations
    const { data: completeQuiz, error: fetchError } = await supabase
      .from('quizzes')
      .select(`
        *,
        lesson:lessons(*),
        questions:quiz_questions(
          *,
          answers:quiz_answers(*)
        )
      `)
      .eq('id', quiz.id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    res.status(201).json(completeQuiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// Update a quiz
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, lessonId, timeLimit, questions } = req.body;

    // First, delete existing questions and answers
    const { error: deleteQuestionsError } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('quiz_id', id);

    if (deleteQuestionsError) {
      throw deleteQuestionsError;
    }

    // Update the quiz
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .update({ 
        title, 
        description, 
        lesson_id: parseInt(lessonId), 
        time_limit: timeLimit ? parseInt(timeLimit) : null 
      })
      .eq('id', id)
      .select()
      .single();

    if (quizError) {
      throw quizError;
    }

    // Create new questions and answers
    for (const q of questions) {
      // Create the question
      const { data: question, error: questionError } = await supabase
        .from('quiz_questions')
        .insert([{ 
          content: q.content, 
          type: q.type, 
          quiz_id: quiz.id 
        }])
        .select()
        .single();

      if (questionError) {
        throw questionError;
      }

      // Create answers for this question
      const answersToInsert = q.answers.map(a => ({
        content: a.content,
        is_correct: a.isCorrect,
        question_id: question.id
      }));

      const { error: answersError } = await supabase
        .from('quiz_answers')
        .insert(answersToInsert);

      if (answersError) {
        throw answersError;
      }
    }

    // Get the complete quiz with all relations
    const { data: completeQuiz, error: fetchError } = await supabase
      .from('quizzes')
      .select(`
        *,
        lesson:lessons(*),
        questions:quiz_questions(
          *,
          answers:quiz_answers(*)
        )
      `)
      .eq('id', quiz.id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    res.json(completeQuiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ error: 'Failed to update quiz' });
  }
});

// Delete a quiz
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // First, delete related questions and answers
    const { error: deleteQuestionsError } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('quiz_id', id);

    if (deleteQuestionsError) {
      throw deleteQuestionsError;
    }

    // Then delete the quiz
    const { error: deleteQuizError } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', id);

    if (deleteQuizError) {
      throw deleteQuizError;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

// Submit quiz answers and calculate score
router.post('/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, answers } = req.body;

    // Get the quiz with all questions and correct answers
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select(`
        *,
        questions:quiz_questions(
          *,
          answers:quiz_answers(
            *
          )
        )
      `)
      .eq('id', id)
      .single();

    if (quizError || !quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;

    // Filter to get only correct answers
    quiz.questions.forEach(question => {
      question.correctAnswers = question.answers.filter(answer => answer.is_correct);
    });

    // Check each answer
    answers.forEach(userAnswer => {
      const question = quiz.questions.find(q => q.id === userAnswer.questionId);
      if (question && question.correctAnswers.length > 0) {
        const correctAnswer = question.correctAnswers[0];
        if (correctAnswer && userAnswer.answerId === correctAnswer.id) {
          correctAnswers++;
        }
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Save the quiz result
    const { data: quizResult, error: resultError } = await supabase
      .from('quiz_results')
      .insert([{ 
        user_id: userId, 
        quiz_id: parseInt(id), 
        score, 
        answers 
      }])
      .select()
      .single();

    if (resultError) {
      throw resultError;
    }

    res.json({ score, totalQuestions, correctAnswers, quizResult });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// Get quiz results for a user
router.get('/results/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data: results, error } = await supabase
      .from('quiz_results')
      .select(`
        *,
        quiz:quizzes(
          *,
          lesson:lessons(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(results);
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ error: 'Failed to fetch quiz results' });
  }
});

module.exports = router;