// MAIN FILE TO RUN LEXICAL ANALYZER
const fs = require('fs');

const filePath = process.argv[2] || 'SCW_Examples/Ex1.txt';
const data = fs.readFileSync(filePath, 'utf-8');
const found_tokens = get_all_tokens(data);

for (const t of found_tokens) {
    console.log(t);
}
