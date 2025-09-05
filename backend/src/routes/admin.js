const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, isAdmin, level, progress, streak, isOnboarded, placementTestCompleted, created_at, updated_at');
    
    if (error) {
      throw error;
    }
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Promote user to admin
router.put('/users/:id/promote', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: user, error } = await supabase
      .from('users')
      .update({ isAdmin: true })
      .eq('id', id)
      .select();
    
    if (error) {
      throw error;
    }
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to promote user' });
  }
});

// Demote user from admin
router.put('/users/:id/demote', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: user, error } = await supabase
      .from('users')
      .update({ isAdmin: false })
      .eq('id', id)
      .select();
    
    if (error) {
      throw error;
    }
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to demote user' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get all lessons
router.get('/lessons', async (req, res) => {
  try {
    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// Create new lesson
router.post('/lessons', async (req, res) => {
  try {
    const { title, description, level } = req.body;
    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert([{ title, description, level, completed: false }])
      .select();
    
    if (error) {
      throw error;
    }
    
    res.json(lesson[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

// Update lesson
router.put('/lessons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, level, completed } = req.body;
    const { data: lesson, error } = await supabase
      .from('lessons')
      .update({ title, description, level, completed })
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
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// Delete lesson
router.delete('/lessons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

// Get system settings
router.get('/settings', async (req, res) => {
  try {
    // For now, return default settings
    // In a real app, you would have a settings table in the database
    res.json({
      siteName: 'English Station',
      supportEmail: 'support@englishstation.com',
      maintenanceMode: false,
      allowRegistration: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update system settings
router.put('/settings', async (req, res) => {
  try {
    // For now, just return success
    // In a real app, you would update a settings table in the database
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
