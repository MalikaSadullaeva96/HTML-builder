const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const filePath = path.join(__dirname, 'text.txt');

// Clear the text.txt file before each run
fs.writeFileSync(filePath, '');

stdout.write('Hi! Please enter text\n');

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

stdin.on('data', data => {
  const input = data.toString().trim();
  if (input === 'exit') {
    stdout.write('Goodbye!\n');
    process.exit();
  } else {
    writeStream.write(input + '\n');
    stdout.write('Hi! Please enter text:\n');
  }
});
process.on('SIGINT', function() {
  console.log('\nGoodbye!\n');
  process.exit();
});