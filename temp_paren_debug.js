const fs = require('fs');
const c = fs.readFileSync('src/b-app1.jsx', 'utf-8');
let d = 0;
let inStr = false;
let strCh = '';
let inRgx = false;
let inBC = false;
let lineNum = 1;
// Track depth at each line around the problem area
const lines = c.split('\n');
for (let ln = 2690; ln <= 2710; ln++) {
    const line = lines[ln - 1];
    // Count parens in this line manually, ignoring strings and regex
    let lineD = 0;
    let localStr = false;
    let localStrCh = '';
    let localRgx = false;
    for (let j = 0; j < line.length; j++) {
        const ch = line[j];
        const nx = line[j + 1] || '';
        if (localStr) { if (ch === '\\') j++; else if (ch === localStrCh) localStr = false; continue; }
        if (localRgx) { if (ch === '/' && line[j - 1] !== '\\') localRgx = false; continue; }
        if (ch === '/' && nx === '/') break;
        if (ch === "'" || ch === '"' || ch === '`') { localStr = true; localStrCh = ch; continue; }
        if (ch === '/' && j > 0 && ' (=&|!,;{}[]?'.includes(line[j - 1])) { localRgx = true; continue; }
        if (ch === '(') lineD++;
        if (ch === ')') lineD--;
    }
    console.log('L' + ln + ' d=' + lineD + ': ' + line.trim());
}
