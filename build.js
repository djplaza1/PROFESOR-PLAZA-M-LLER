const fs = require("fs");
const path = require("path");
const babel = require("@babel/core");

const CHUNKS = [
  "src/a-core.jsx",
  "src/features/ruta/ruta-panel.jsx",
  "src/b-app1.jsx",
  "src/b-app2.jsx",
  "src/c-extra.jsx"
];

let code = "";
for (const file of CHUNKS) {
  if (!fs.existsSync(file)) throw new Error(`Missing: ${file}`);
  code += fs.readFileSync(file, "utf8") + "\n";
}

const result = babel.transformSync(code, {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  compact: true,
  comments: false,
  minified: true
});

fs.writeFileSync("dist/app.js", result.code);
console.log("✅ Build completo → dist/app.js");
