const fs = require('fs/promises');
const path = require('path');

const dirPath = path.join(__dirname,'files');
const copyPath = path.join(__dirname, 'files-copy');

fs.mkdir(copyPath, { recursive: true })
  .then(() => {
    console.log(`${copyPath} directory created successfully!`);
  })
  .catch((err) => {
    console.error(`Error creating ${copyPath} directory:`, err);
  });

  fs.readdir(dirPath)
  .then(async (files) => {
    for (const file of files) {
      const sourcePath = path.join(dirPath, file);
      const destinationPath = path.join(copyPath, file);
      await fs.copyFile(sourcePath, destinationPath);
    }
  })
  .catch((err) => {
    console.error(`Error reading files in ${dirPath} directory:`, err);
  });

  