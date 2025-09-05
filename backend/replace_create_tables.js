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
const baseDir = path.join(__dirname);

// Replace the file
replaceFile(path.join(baseDir, 'create-tables.js'), path.join(baseDir, 'create-tables-new.js'));

console.log('File has been replaced successfully!');
