const fs = require('fs');
const path = require('path');

// Function to replace a file with another
function replaceFile(originalPath, newPath) {
  try {
    // Read the new file content
    const newContent = fs.readFileSync(newPath, 'utf8');

    // Write the new content to the original file
    fs.writeFileSync(originalPath, newContent, 'utf8');

    console.log(`Successfully replaced ${originalPath} with ${newPath}`);
  } catch (error) {
    console.error(`Error replacing ${originalPath}:`, error);
  }
}

// Define the base directory
const baseDir = path.join(__dirname, 'src', 'routes');

// Replace the files
replaceFile(path.join(baseDir, 'users.js'), path.join(baseDir, 'users_new.js'));
replaceFile(path.join(baseDir, 'progress.js'), path.join(baseDir, 'progress_new.js'));
replaceFile(path.join(baseDir, 'quiz.js'), path.join(baseDir, 'quiz_new.js'));
replaceFile(path.join(baseDir, 'settings.js'), path.join(baseDir, 'settings_new.js'));

console.log('All files have been replaced successfully!');
