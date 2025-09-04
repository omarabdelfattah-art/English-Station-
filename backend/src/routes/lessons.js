const express = require('express');
const router = express.Router();
const { prisma } = require('../db');

// Get all lessons
router.get('/', async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        vocabulary: true,
        quizzes: {
          include: {
            questions: {
              include: {
                answers: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
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
    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(id) },
      include: {
        vocabulary: true,
        quizzes: {
          include: {
            questions: {
              include: {
                answers: true
              }
            }
          }
        }
      }
    });

    if (!lesson) {
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
    const { title, description, content } = req.body;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        content
      }
    });

    res.status(201).json(lesson);
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

// Update a lesson
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content } = req.body;

    const lesson = await prisma.lesson.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        content
      }
    });

    res.json(lesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// Delete a lesson
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.lesson.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

module.exports = router;
