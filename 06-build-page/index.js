const fs = require('fs/promises');
const path = require('path');
const joinCss = require('../05-merge-styles/index.js');
const copyFile = require('../04-copy-directory/index.js');

const regex = /{{(.+?)}}/g;
const comp = path.join(__dirname, 'components');
const destPath = path.join(__dirname, 'project-dist');
const tempPath = path.join(__dirname, 'template.html');


fs.mkdir(destPath, { recursive: true })
  .then(() => {
    console.log('Directory created successfully');
  })
  .catch((err) => {
    console.log('Creating path err', err);
  });

fs.readdir(comp)
  .then(async (files) => {
    for (const file of files) {
      const basename = path.basename(file, path.extname(file));
      const content = await fs.readFile(path.join(comp, file), 'utf-8');
      this[basename] = content;
    }
    const template = await fs.readFile(tempPath, 'utf-8');
    const result = template.replace(regex, (match, p1) => {
      const content = this[p1];
      return content ? content : '';
    });
    await fs.writeFile(path.join(destPath, 'index.html'), result, 'utf-8');
    console.log('File written successfully');
  })
  .catch((err) => {
    console.log('Error reading components directory', err);
  });

joinCss('../06-build-page/styles','../06-build-page/project-dist','../project-dist/style.css');
copyFile('../06-build-page/assets', '../06-build-page/project-dist/assets');