const fs = require('fs');
let c = fs.readFileSync('src/modules/orders/dto/checkout-order.dto.ts', 'utf8');
c = c.replace(/z\.array\(z\.string\(\)\)/g, 'z.array(z.coerce.number().int())');
fs.writeFileSync('src/modules/orders/dto/checkout-order.dto.ts', c);
console.log('Fixed checkout-order.dto.ts');
let s = fs.readFileSync('src/modules/orders/orders.service.ts', 'utf8');
s = s.replace(/const seatId of seatIds\)/g, 'const seatId of seatIds)'); // just in case it was explicitly typed
fs.writeFileSync('src/modules/orders/orders.service.ts', s);
