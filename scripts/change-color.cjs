const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src');

function walk(directory) {
  let results = [];
  const list = fs.readdirSync(directory);
  list.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      if (fullPath.endsWith('.astro') || fullPath.endsWith('.md') || fullPath.endsWith('.css')) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const files = walk(dir);

const replacements = [
  // Hex replacements
  { from: /#fef7e6/ig, to: '#fff0f0' },
  { from: /#fde8c0/ig, to: '#ffc2c2' },
  { from: /#f9d89a/ig, to: '#ee1c25' },
  { from: /#e8c47a/ig, to: '#d01520' },
  { from: /#c9a85c/ig, to: '#b01018' },
  
  // RGB Replacements (no spaces)
  { from: /249,216,154/g, to: '238,28,37' },
  // RGB Replacements (with spaces)
  { from: /249, 216, 154/g, to: '238, 28, 37' },
  
  // Naming changes for semantics (where applicable)
  // text-gradient-gold -> text-gradient-red
  { from: /text-gradient-gold/g, to: 'text-gradient-red' },
  { from: /color-gold/g, to: 'color-red' },
  { from: /text-gold/g, to: 'text-red' },
  { from: /gold-text/g, to: 'red-text' },
  { from: /btn-gold/g, to: 'btn-red' }
];

let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${path.relative(dir, file)}`);
    changedCount++;
  }
});

console.log(`\nReplacement complete. Modified ${changedCount} files.`);
