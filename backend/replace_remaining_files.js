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

// Replace the files
replaceFile(path.join(baseDir, 'test-connection.js'), path.join(baseDir, 'test-connection-new.js'));
replaceFile(path.join(baseDir, 'prisma', 'seed.js'), path.join(baseDir, 'prisma', 'seed_new.js'));

console.log('All remaining files have been replaced successfully!');
