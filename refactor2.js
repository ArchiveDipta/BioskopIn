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
  c = c.replace(/showtimeId:\s*z\.string\(\)(?:\.min\([^)]+\))?/g, 'showtimeId: z.coerce.number().int()');
  c = c.replace(/seatId:\s*z\.string\(\)(?:\.min\([^)]+\))?/g, 'seatId: z.coerce.number().int()');
  c = c.replace(/showtimeId:\s*string/g, 'showtimeId: number');
  c = c.replace(/seatId:\s*string/g, 'seatId: number');
  c = c.replace(/getSeatsAvailability\(showtimeId:\s*string\)/g, 'getSeatsAvailability(showtimeId: number)');
  c = c.replace(/async getSeatsAvailability\(id:\s*string\)/g, 'async getSeatsAvailability(id: number)');
  c = c.replace(/const seatId:\s*string/g, 'const seatId: number');
  c = c.replace(/@Param\('showtimeId'\)\s*showtimeId:\s*number/g, "@Param('showtimeId', ParseIntPipe) showtimeId: number");
  if (o !== c) {
    fs.writeFileSync(file, c);
    console.log('Updated ' + file);
  }
});
