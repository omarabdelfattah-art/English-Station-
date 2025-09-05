const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all users
router.get('/', async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, username, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get a single user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user progress with lesson details
    const { data: progress, error: progressError } = await supabase
      .from('progress')
      .select(`
        *,
        lesson:lessons(*)
      `)
      .eq('user_id', id);

    if (progressError) {
      throw progressError;
    }

    // Get user quiz results with quiz details
    const { data: quizResults, error: quizError } = await supabase
      .from('quiz_results')
      .select(`
        *,
        quiz:quizzes(*)
      `)
      .eq('user_id', id);

    if (quizError) {
      throw quizError;
    }

    // Combine all data
    const userData = {
      ...user,
      progress,
      quizResults
    };

    res.json(userData);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Refresh token
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Find user with the refresh token
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('refresh_token', refreshToken)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new tokens
    const token = 'sample-jwt-token';
    const newRefreshToken = 'sample-refresh-token';

    // Update user with new refresh token
    const { error: updateError } = await supabase
      .from('users')
      .update({ refresh_token: newRefreshToken })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    // Return new tokens
    res.json({
      token,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens (in a real app, you would use JWT)
    const token = 'sample-jwt-token';
    const refreshToken = 'sample-refresh-token';

    // Update user with refresh token
    const { error: updateError } = await supabase
      .from('users')
      .update({ refresh_token: refreshToken })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    // Return user data with tokens
    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      token,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${email},username.eq.${username}`)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .insert([{ email, username, password }])
      .select();

    if (error) {
      throw error;
    }

    res.status(201).json(user[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, username, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({ email, username, password })
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
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;