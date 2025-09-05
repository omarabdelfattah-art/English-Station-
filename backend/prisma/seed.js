const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    // Create initial lessons
    const { error: lessonsError } = await supabase
      .from('lessons')
      .insert([
        {
          title: "Introduction to English",
          description: "Basic introduction to the English language",
          content: "Welcome to your first English lesson! In this lesson, we'll cover the basics of English grammar and vocabulary.",
          level: "A1"
        },
        {
          title: "Basic Grammar",
          description: "Learn fundamental English grammar rules",
          content: "In this lesson, we'll explore the basic building blocks of English grammar including nouns, verbs, and adjectives.",
          level: "A1"
        },
        {
          title: "Common Vocabulary",
          description: "Essential English words and phrases",
          content: "Expand your vocabulary with these commonly used English words and phrases that will help you in everyday conversations.",
          level: "A1"
        },
        {
          title: "Present Tense",
          description: "Master the present simple and continuous tenses",
          content: "Learn how to use the present simple and present continuous tenses correctly in various contexts.",
          level: "A2"
        },
        {
          title: "Past Tense",
          description: "Understanding past simple and past continuous",
          content: "This lesson covers how to talk about past events using the past simple and past continuous tenses.",
          level: "A2"
        }
      ]);

    if (lessonsError) {
      throw lessonsError;
    }

    // Create initial settings (only if they don't exist)
    try {
      const { error: settingsError } = await supabase
        .from('settings')
        .insert([
          { key: "app_name", value: "English Learning Platform" },
          { key: "app_version", value: "1.0.0" },
          { key: "max_lesson_length", value: "30" },
          { key: "default_language_level", value: "A1" }
        ]);

      if (settingsError) {
        console.log("Settings already exist or other error:", settingsError.message);
      }
    } catch (error) {
      console.log("Error creating settings:", error.message);
    }

    // Create a default user for testing
    // Check if user already exists first
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'test@example.com')
      .single();

    if (!existingUser) {
      // Generate a simple UUID for the user ID
      const userId = 'user-' + Math.random().toString(36).substr(2, 9);

      const { error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            email: "test@example.com",
            username: "testuser",
            password: "password123"
          }
        ]);

      if (userError) {
        throw userError;
      }

      console.log("Default user created successfully!");
    } else {
      console.log("Default user already exists");
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

main();
