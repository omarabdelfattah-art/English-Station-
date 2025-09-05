const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all progress records
router.get('/', async (req, res) => {
  try {
    const { data: progress, error } = await supabase
      .from('progress')
      .select(`
        *,
        user:users(id, username),
        lesson:lessons(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Get progress for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data: progress, error } = await supabase
      .from('progress')
      .select(`
        *,
        lesson:lessons(*)
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(progress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ error: 'Failed to fetch user progress' });
  }
});

// Get progress for a specific lesson
router.get('/lesson/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { data: progress, error } = await supabase
      .from('progress')
      .select(`
        *,
        user:users(id, username)
      `)
      .eq('lesson_id', lessonId)
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(progress);
  } catch (error) {
    console.error('Error fetching lesson progress:', error);
    res.status(500).json({ error: 'Failed to fetch lesson progress' });
  }
});

// Create or update progress for a user in a lesson
router.post('/', async (req, res) => {
  try {
    const { userId, lessonId, completed, progress } = req.body;

    // Check if progress record already exists
    const { data: existingProgress } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single();

    if (existingProgress) {
      // Update existing progress
      const { data: updatedProgress, error: updateError } = await supabase
        .from('progress')
        .update({ completed, progress })
        .eq('id', existingProgress.id)
        .select();

      if (updateError) {
        throw updateError;
      }

      res.json(updatedProgress[0]);
    } else {
      // Create new progress record
      const { data: newProgress, error: insertError } = await supabase
        .from('progress')
        .insert([{ 
          user_id: userId, 
          lesson_id: parseInt(lessonId), 
          completed, 
          progress 
        }])
        .select();

      if (insertError) {
        throw insertError;
      }

      res.status(201).json(newProgress[0]);
    }
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Delete a progress record
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('progress')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting progress:', error);
    res.status(500).json({ error: 'Failed to delete progress' });
  }
});

module.exports = router;