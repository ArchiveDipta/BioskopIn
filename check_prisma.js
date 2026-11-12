const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}
const files = walk('src');
let found = [];
files.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  if (c.includes('../prisma') || c.includes('prisma/')) {
    found.push(file);
  }
});
console.log(found.join('\n'));
