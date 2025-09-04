const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function createTables() {
  try {
    console.log('Creating database tables...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'create-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    await prisma.$executeRawUnsafe(sql);
    
    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTables();
