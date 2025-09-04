const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const lessonsRoutes = require('./routes/lessons');
const usersRoutes = require('./routes/users');
const progressRoutes = require('./routes/progress');
const quizRoutes = require('./routes/quiz');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/lessons', lessonsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quiz', quizRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
