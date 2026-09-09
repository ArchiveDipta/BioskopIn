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
files.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  let o = c;
  c = c.replace(/z\.string\(\)\.(uuid|cuid)\(\)/g, 'z.coerce.number().int()');
  c = c.replace(/cinemaId:\s*z\.string\(\)(?:\.min\([^)]+\))?/g, 'cinemaId: z.coerce.number().int()');
  c = c.replace(/movieId:\s*z\.string\(\)(?:\.min\([^)]+\))?/g, 'movieId: z.coerce.number().int()');
  c = c.replace(/studioId:\s*z\.string\(\)(?:\.min\([^)]+\))?/g, 'studioId: z.coerce.number().int()');
  c = c.replace(/id:\s*string/g, 'id: number');
  c = c.replace(/cinemaId:\s*string/g, 'cinemaId: number');
  c = c.replace(/cinemaId\?:\s*string/g, 'cinemaId?: number');
  c = c.replace(/movieId:\s*string/g, 'movieId: number');
  c = c.replace(/studioId:\s*string/g, 'studioId: number');
  c = c.replace(/userId:\s*string/g, 'userId: number');
  if (c.includes('@Param(') && !c.includes('ParseIntPipe')) {
    c = c.replace(/import\s+{([^}]+)}\s+from\s+'@nestjs\/common';/, (m, p1) => "import { " + p1 + ", ParseIntPipe } from '@nestjs/common';");
  }
  c = c.replace(/@Param\('id'\)\s*id:\s*number/g, "@Param('id', ParseIntPipe) id: number");
  c = c.replace(/@Param\('cinemaId'\)\s*cinemaId:\s*number/g, "@Param('cinemaId', ParseIntPipe) cinemaId: number");
  if (o !== c) {
    fs.writeFileSync(file, c);
    console.log('Updated ' + file);
  }
});
