const fs = require('fs');
const content = fs.readFileSync('.env.local', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
    console.log(`${i + 1}: ${line}`);
});
