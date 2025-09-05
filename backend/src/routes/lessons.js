const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all lessons
router.get('/', async (req, res) => {
  try {
    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*')
      .order('createdat', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    res.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// Get a single lesson by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: lesson, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// Create a new lesson
router.post('/', async (req, res) => {
  try {
    const { title, description, content, level } = req.body;

    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert([{ title, description, content, level }])
      .select();

    if (error) {
      throw error;
    }

    res.status(201).json(lesson[0]);
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

// Update a lesson
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, level } = req.body;

    const { data: lesson, error } = await supabase
      .from('lessons')
      .update({ title, description, content, level })
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    if (lesson.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json(lesson[0]);
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// Delete a lesson
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

module.exports = router;
