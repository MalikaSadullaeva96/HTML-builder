const  fs = require('fs/promises');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath)
    .then((files) => {
        files.forEach(async (file) => {
            const fPath = path.join(dirPath,file);
            const stat = await fs.stat(fPath);
            const index = `${file}`.indexOf(".");
            const result = `${file}`.slice(0, index);
            if (stat.isFile()) {
                const ext = path.extname(file);
                const size = stat.size;
                console.log(`${result} - ${ext.slice(1)} - ${size / 1024}kb`);
            }
        });
    })
    .catch((err) => console.error(err));