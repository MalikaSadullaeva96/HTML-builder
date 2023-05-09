const fs = require('fs/promises');
const path = require('path');

async function emptyDirectory(directory) {
  const files = await fs.readdir(directory);
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = await fs.stat(filePath);
    if (stat.isFile()) {
      await fs.unlink(filePath);
    } else if (stat.isDirectory()) {
      await emptyDirectory(filePath);
      await fs.rmdir(filePath);
    }
  }
}

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

async function copyFile(sourceDir = 'files', folderName = 'files-copy') {
  const dirPath = path.join(__dirname, sourceDir); // source folder
  const dirName = path.join(__dirname, folderName); // destination folder

  try {
    await fs.mkdir(dirName, { recursive: true });
    console.log(`${dirName} directory created successfully!`);

    await emptyDirectory(dirName);
    console.log(`${dirName} directory emptied successfully!`);

    const files = await fs.readdir(dirPath);
    for (const file of files) {
      const sourcePath = path.join(dirPath, file);
      const destinationPath = path.join(dirName, file);
      await copyRecursive(sourcePath, destinationPath);
    }
    console.log(`Files copied successfully from ${dirPath} to ${dirName}!`);
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.error(`Error creating ${dirName} directory: Directory already exists.`);
    } else {
      console.error(`Error:`, err);
    }
  }
}

copyFile();
module.exports = copyFile;
