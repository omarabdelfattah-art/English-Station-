const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Test the database connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Connected to the database successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

module.exports = { prisma, testConnection };
