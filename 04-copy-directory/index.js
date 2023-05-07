const fs = require('fs/promises');
const path = require('path');


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


function copyFile (sourceDir = 'files', folderName = 'files-copy' ){


  const dirPath = path.join(__dirname, sourceDir); // source folder
  const dirName = path.join(__dirname, folderName);



  fs.mkdir(dirName, { recursive: true })
    .then(() => {
      console.log(`${dirName} directory created successfully!`);
    })
    .catch((err) => {
      console.error(`Error creating ${dirName} directory:`, err);
    });

  
  fs.readdir(dirPath)
    .then(async (files) => {
      for (const file of files) {
        const sourcePath = path.join(dirPath, file);
        const destinationPath = path.join(dirName, file);
        await copyRecursive(sourcePath, destinationPath);
      }
    })
    .catch((err) => {
      console.error(`Error reading files in ${dirPath} directory:`, err);
    });

}
copyFile();
module.exports = copyFile;
