const fs = require('fs/promises');
const path = require('path');

const dirPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');

fs.mkdir(copyPath, { recursive: true })
  .then(() => {
    console.log(`${copyPath} directory created successfully!`);
  })
  .catch((err) => {
    console.error(`Error creating ${copyPath} directory:`, err);
  });


async function copyRecursive(source, destination) {
  const stat = await fs.stat(source);
  if (stat.isFile()) {
    await fs.copyFile(source, destination);
  } else if (stat.isDirectory()) {
    await fs.mkdir(destination, { recursive: true });
    const files = await fs.readdir(source);
    for (const file of files) {
      const sourcePath = path.join(source, file);
      const destinationPath = path.join(destination, file);
      await copyRecursive(sourcePath, destinationPath);
    }
  }
}

fs.readdir(dirPath)
  .then(async (files) => {
    for (const file of files) {
      const sourcePath = path.join(dirPath, file);
      const destinationPath = path.join(copyPath, file);
      await copyRecursive(sourcePath, destinationPath);
    }
  })
  .catch((err) => {
    console.error(`Error reading files in ${dirPath} directory:`, err);
  });
