const fs = require('fs');
const c = fs.readFileSync('src/b-app1.jsx', 'utf-8');
let d = 0, inStr = false, strCh = '', inRgx = false, inBC = false, lineNum = 1, minD = 0, minLine = 0;
for (let i = 0; i < c.length; i++) {
    const ch = c[i], nx = c[i + 1] || '';
    if (ch === '\n') { lineNum++; continue; }
    if (inBC) { if (ch === '*' && nx === '/') { inBC = false; i++; } continue; }
    if (inStr) { if (ch === '\\') { i++; } else if (ch === strCh) inStr = false; continue; }
    if (inRgx) { if (ch === '/' && c[i - 1] !== '\\') inRgx = false; continue; }
    if (ch === '/' && nx === '/') { while (i < c.length && c[i] !== '\n') i++; continue; }
    if (ch === '/' && nx === '*') { inBC = true; i++; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { inStr = true; strCh = ch; continue; }
    if (ch === '/' && i > 0 && ' (=&|!,;{}[]?'.includes(c[i - 1])) { inRgx = true; continue; }
    if (ch === '(') d++;
    if (ch === ')') { d--; if (d < minD) { minD = d; minLine = lineNum; } }
}
console.log('minDepth=' + minD + ' at line ' + minLine + ' finalDepth=' + d);
