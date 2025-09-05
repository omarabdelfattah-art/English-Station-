const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const { testConnection } = require('./supabase');

// Import routes
const lessonsRoutes = require('./routes/lessons');
const usersRoutes = require('./routes/users');
const progressRoutes = require('./routes/progress');
const quizRoutes = require('./routes/quiz');
const adminRoutes = require('./routes/admin');
const settingsRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/lessons', lessonsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection as part of health check
    const { data, error } = await testConnection();
    
    if (error) {
      return res.status(503).json({ 
        status: 'ERROR', 
        message: 'Database connection failed',
        error: error.message 
      });
    }
    
    res.status(200).json({ 
      status: 'OK', 
      message: 'API is running',
      database: 'Connected' 
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'ERROR', 
      message: 'Service unavailable',
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`❌ Error at ${req.path}:`, err.message);
  
  // Handle specific errors
  if (err.message.includes('ECONNREFUSED')) {
    return res.status(503).json({ 
      error: 'Database connection refused. Please try again later.' 
    });
  }
  
  if (err.code === 'auth/invalid-api-key') {
    return res.status(401).json({ 
      error: 'Invalid API key. Please check your configuration.' 
    });
  }
  
  // Default error response
  res.status(500).json({ 
    error: 'Something went wrong!',
    path: req.path
  });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API endpoint ${req.path} not found` });
});

// Start the server
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}/api`);
  
  // Test database connection
  try {
    await testConnection();
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
});
