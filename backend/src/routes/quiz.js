const express = require('express');
const router = express.Router();
const { prisma } = require('../db');

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        lesson: true,
        questions: {
          include: {
            answers: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
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
    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(id) },
      include: {
        lesson: true,
        questions: {
          include: {
            answers: true
          }
        }
      }
    });

    if (!quiz) {
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

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        lessonId: parseInt(lessonId),
        timeLimit: timeLimit ? parseInt(timeLimit) : null,
        questions: {
          create: questions.map(q => ({
            content: q.content,
            type: q.type,
            answers: {
              create: q.answers.map(a => ({
                content: a.content,
                isCorrect: a.isCorrect
              }))
            }
          }))
        }
      },
      include: {
        questions: {
          include: {
            answers: true
          }
        }
      }
    });

    res.status(201).json(quiz);
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
    await prisma.question.deleteMany({
      where: { quizId: parseInt(id) }
    });

    // Create the updated quiz with new questions
    const quiz = await prisma.quiz.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        lessonId: parseInt(lessonId),
        timeLimit: timeLimit ? parseInt(timeLimit) : null,
        questions: {
          create: questions.map(q => ({
            content: q.content,
            type: q.type,
            answers: {
              create: q.answers.map(a => ({
                content: a.content,
                isCorrect: a.isCorrect
              }))
            }
          }))
        }
      },
      include: {
        questions: {
          include: {
            answers: true
          }
        }
      }
    });

    res.json(quiz);
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
    await prisma.question.deleteMany({
      where: { quizId: parseInt(id) }
    });

    // Then delete the quiz
    await prisma.quiz.delete({
      where: { id: parseInt(id) }
    });

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
    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(id) },
      include: {
        questions: {
          include: {
            answers: {
              where: { isCorrect: true }
            }
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;

    // Check each answer
    answers.forEach(userAnswer => {
      const question = quiz.questions.find(q => q.id === userAnswer.questionId);
      if (question) {
        const correctAnswer = question.answers[0];
        if (correctAnswer && userAnswer.answerId === correctAnswer.id) {
          correctAnswers++;
        }
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Save the quiz result
    const quizResult = await prisma.quizResult.create({
      data: {
        userId,
        quizId: parseInt(id),
        score,
        answers
      }
    });

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
    const results = await prisma.quizResult.findMany({
      where: { userId },
      include: {
        quiz: {
          include: {
            lesson: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(results);
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ error: 'Failed to fetch quiz results' });
  }
});

module.exports = router;
