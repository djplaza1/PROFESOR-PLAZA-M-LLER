const fs = require('fs');
const c = fs.readFileSync('src/b-app1.jsx', 'utf-8');
let d = 0;
let inStr = false;
let strCh = '';
let inRgx = false;
let inBC = false;
let lineNum = 1;
let colNum = 0;
for (let i = 0; i < c.length; i++) {
    const ch = c[i];
    const nx = c[i + 1] || '';
    colNum++;
    if (ch === '\n') { lineNum++; colNum = 0; continue; }
    if (inBC) { if (ch === '*' && nx === '/') { inBC = false; i++; } continue; }
    if (inStr) { if (ch === '\\') { i++; } else if (ch === strCh) inStr = false; continue; }
    if (inRgx) { if (ch === '/' && c[i - 1] !== '\\') inRgx = false; continue; }
    if (ch === '/' && nx === '/') { while (i < c.length && c[i] !== '\n') i++; continue; }
    if (ch === '/' && nx === '*') { inBC = true; i++; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { inStr = true; strCh = ch; continue; }
    if (ch === '/' && i > 0 && ' (=&|!,;{}[]?'.includes(c[i - 1])) { inRgx = true; continue; }
    if (ch === '(') d++;
    if (ch === ')') {
        d--;
        if (d < 0) {
            // Find the line containing this position
            const lines = c.substring(0, i).split('\n');
            const ln = lines.length;
            const col = lines[lines.length - 1].length + 1;
            const lineContent = c.split('\n')[ln - 1];
            console.log('EXTRA ) at line ' + ln + ', col ' + col);
            console.log('  Context: ...' + lineContent.substring(Math.max(0, col - 40), Math.min(lineContent.length, col + 40)) + '...');
            d = 0;
        }
    }
}
console.log('Final depth=' + d);
