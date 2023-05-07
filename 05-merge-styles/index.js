const fs = require('fs/promises');
const fsp = require('fs');
const path = require('path');


function joinCss (initialDir ='styles', destDir='project-dist', fileName = 'bundle.css') {

  const dirPath = path.join(__dirname, initialDir); // initial dir
  const targetPath = path.join(__dirname, destDir); //dest dir
  const tPath = path.join(targetPath, fileName); // file name in dest dir
  let data = [];

  fs.readdir(dirPath)
    .then(async (files) => {
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const extension = path.extname(filePath);
        if (extension === '.css') {
          const stream = fsp.createReadStream(filePath, 'utf-8');
          const readStreamPromise = new Promise((resolve) => {
            let fileData = '';
            stream.on('data', chunk => {
              fileData += chunk;
            });
            stream.on('end', () => {
              data.push(fileData);
              resolve();
            });
          });
          await readStreamPromise;
        }
      }
      const writeStream = fsp.createWriteStream(tPath, { flags: 'a' });
      writeStream.write(data.join(''), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('CSS data has been written to bundle.css');
        }
      });
    })
    .catch((err) => console.error(err));
}
joinCss();
module.exports = joinCss;