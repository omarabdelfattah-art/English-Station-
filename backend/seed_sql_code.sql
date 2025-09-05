-- Insert initial lessons
INSERT INTO lessons (title, description, content, level) VALUES
('Introduction to English', 'Basic introduction to the English language', 'Welcome to your first English lesson! In this lesson, we''ll cover the basics of English grammar and vocabulary.', 'A1'),
('Basic Grammar', 'Learn fundamental English grammar rules', 'In this lesson, we''ll explore the basic building blocks of English grammar including nouns, verbs, and adjectives.', 'A1'),
('Common Vocabulary', 'Essential English words and phrases', 'Expand your vocabulary with these commonly used English words and phrases that will help you in everyday conversations.', 'A1'),
('Present Tense', 'Master the present simple and continuous tenses', 'Learn how to use the present simple and present continuous tenses correctly in various contexts.', 'A2'),
('Past Tense', 'Understanding past simple and past continuous', 'This lesson covers how to talk about past events using the past simple and past continuous tenses.', 'A2');

-- Insert initial settings (note: "key" is a reserved word, so we quote it)
INSERT INTO settings ("key", value) VALUES
('app_name', 'English Learning Platform'),
('app_version', '1.0.0'),
('max_lesson_length', '30'),
('default_language_level', 'A1');

cd "c:\Users\omara\Pictures\eng l\backend"
node src\index.js
