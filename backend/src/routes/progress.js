const express = require('express');
const router = express.Router();
const { prisma } = require('../db');

// Get all progress records
router.get('/', async (req, res) => {
  try {
    const progress = await prisma.progress.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        },
        lesson: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
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
    const progress = await prisma.progress.findMany({
      where: { userId },
      include: {
        lesson: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
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
    const progress = await prisma.progress.findMany({
      where: { lessonId: parseInt(lessonId) },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
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
    const existingProgress = await prisma.progress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId: parseInt(lessonId)
        }
      }
    });

    if (existingProgress) {
      // Update existing progress
      const updatedProgress = await prisma.progress.update({
        where: {
          userId_lessonId: {
            userId,
            lessonId: parseInt(lessonId)
          }
        },
        data: {
          completed,
          progress
        }
      });

      res.json(updatedProgress);
    } else {
      // Create new progress record
      const newProgress = await prisma.progress.create({
        data: {
          userId,
          lessonId: parseInt(lessonId),
          completed,
          progress
        }
      });

      res.status(201).json(newProgress);
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

    await prisma.progress.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting progress:', error);
    res.status(500).json({ error: 'Failed to delete progress' });
  }
});

module.exports = router;
