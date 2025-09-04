const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Check if users already exist
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log('Seed data already exists. Skipping seeding.');
    return;
  }

  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      username: 'johndoe',
      password: 'password123', // In a real application, this should be hashed
      progress: {
        create: []
      },
      quizResults: {
        create: []
      }
    }
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      username: 'janesmith',
      password: 'password123', // In a real application, this should be hashed
      progress: {
        create: []
      },
      quizResults: {
        create: []
      }
    }
  });

  // Create lessons
  const lesson1 = await prisma.lesson.create({
    data: {
      title: 'Basic Greetings',
      description: 'Learn essential greetings and introductions',
      content: 'Content for basic greetings lesson...',
      vocabulary: {
        create: []
      },
      quizzes: {
        create: []
      }
    }
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      title: 'Family Members',
      description: 'Vocabulary for family relationships',
      content: 'Content for family members lesson...',
      vocabulary: {
        create: []
      },
      quizzes: {
        create: []
      }
    }
  });

  const lesson3 = await prisma.lesson.create({
    data: {
      title: 'Present Simple Tense',
      description: 'Master the present simple tense',
      content: 'Content for present simple tense lesson...',
      vocabulary: {
        create: []
      },
      quizzes: {
        create: []
      }
    }
  });

  const lesson4 = await prisma.lesson.create({
    data: {
      title: 'Past Tense',
      description: 'Learn to talk about past events',
      content: 'Content for past tense lesson...',
      vocabulary: {
        create: []
      },
      quizzes: {
        create: []
      }
    }
  });

  const lesson5 = await prisma.lesson.create({
    data: {
      title: 'Future Plans',
      description: 'Express future intentions and plans',
      content: 'Content for future plans lesson...',
      vocabulary: {
        create: []
      },
      quizzes: {
        create: []
      }
    }
  });

  const lesson6 = await prisma.lesson.create({
    data: {
      title: 'Conditional Sentences',
      description: 'Master conditional structures',
      content: 'Content for conditional sentences lesson...',
      vocabulary: {
        create: []
      },
      quizzes: {
        create: []
      }
    }
  });

  // Create quizzes
  const quiz1 = await prisma.quiz.create({
    data: {
      title: 'Greetings Quiz',
      lessonId: lesson1.id,
      questions: {
        create: []
      },
      quizResults: {
        create: []
      }
    }
  });

  const quiz2 = await prisma.quiz.create({
    data: {
      title: 'Family Quiz',
      lessonId: lesson2.id,
      questions: {
        create: []
      },
      quizResults: {
        create: []
      }
    }
  });

  const quiz3 = await prisma.quiz.create({
    data: {
      title: 'Grammar Quiz',
      lessonId: lesson3.id,
      questions: {
        create: []
      },
      quizResults: {
        create: []
      }
    }
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });