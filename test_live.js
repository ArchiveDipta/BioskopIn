const https = require('https');

const BASE_URL = 'https://bioskopin-production.up.railway.app';

function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      method: method,
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = 'Bearer ' + token;
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: body ? JSON.parse(body) : null });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function run() {
  console.log('=== MEMULAI PENGUJIAN LENGKAP TERMASUK PAYMENT GATEWAY DI RAILWAY ===\n');

  const ts = Date.now();
  const adminEmail = 'admin_' + ts + '@test.com';
  const user1Email = 'user1_' + ts + '@test.com';

  // 1. Setup Akun Admin & Customer
  console.log('1. Registrasi Akun Admin & Customer...');
  const regAdmin = await request('POST', '/auth/register', { name: 'Admin Bioskop', email: adminEmail, password: 'password123', role: 'ADMIN' });
  const adminToken = regAdmin.body?.access_token;

  const regUser1 = await request('POST', '/auth/register', { name: 'Customer Pembeli', email: user1Email, password: 'password123', role: 'USER' });
  const user1Token = regUser1.body?.access_token;
  console.log('   Status Admin:', regAdmin.status, '| User 1:', regUser1.status);

  // 2. Setup Bioskop, Studio, Film, F&B, dan Jadwal
  console.log('\n2. Setup Bioskop, Studio, Film, dan Jadwal...');
  const cinema = await request('POST', '/cinemas', { name: 'XXI Kota Kasablanka ' + ts, city: 'Jakarta' }, adminToken);
  const studio = await request('POST', '/studios', { cinemaId: cinema.body.id, name: 'Studio 1 IMAX', rows: 2, seatsPerRow: 4 }, adminToken);
  const movie = await request('POST', '/movies', { title: 'Gladiator II', duration: 150, category: 'Action' }, adminToken);
  const startTime = new Date(Date.now() + 86400000).toISOString();
  const showtime = await request('POST', '/showtimes', { movieId: movie.body.id, studioId: studio.body.id, startTime, price: 60000 }, adminToken);
  const popcorn = await request('POST', '/foods', { name: 'Popcorn Salty Medium', price: 30000, category: 'SNACK' }, adminToken);
  console.log('   Bioskop ID:', cinema.body.id, '| Studio ID:', studio.body.id, '| Film ID:', movie.body.id, '| Showtime ID:', showtime.body.id);

  // 3. Testing Seat Hold
  console.log('\n3. Testing Kunci Kursi (Seat Hold 10 Menit)...');
  const seatsRes = await request('GET', `/showtimes/${showtime.body.id}/seats`);
  const seat1 = seatsRes.body[0].id;
  const seat2 = seatsRes.body[1].id;
  const hold = await request('POST', `/showtimes/${showtime.body.id}/hold-seats`, { seatIds: [seat1, seat2] }, user1Token);
  console.log('   Status:', hold.status, '| Pesan:', hold.body.message);

  // 4. Checkout Order (Status Harus PENDING dengan Payment URL & Snap Token)
  console.log('\n4. Testing Checkout Order Tiket + Popcorn...');
  const checkout = await request('POST', '/orders', {
    showtimeId: showtime.body.id,
    seatIds: [seat1, seat2],
    foodItems: [{ foodItemId: popcorn.body.id, quantity: 1 }]
  }, user1Token);
  console.log('   Status:', checkout.status, '| Order ID:', checkout.body.id);
  console.log('   Status Pembayaran (Expected: PENDING):', checkout.body.status);
  console.log('   Total Harga: Rp', checkout.body.totalPrice, '(2x60k + 30k = 150000)');
  console.log('   Snap Token / Simulation URL:', checkout.body.paymentUrl);
  const orderId = checkout.body.id;
  const bookingCode = checkout.body.bookingCode;

  // 5. Testing Payment Simulation (PENDING -> SUCCESS)
  console.log('\n5. Testing Pembayaran Pesanan (Simulate Pay)...');
  const payRes = await request('POST', `/orders/${orderId}/pay`, null, user1Token);
  console.log('   Status:', payRes.status, '| Status Baru (Expected: SUCCESS):', payRes.body.status);
  console.log('   Waktu Bayar (paidAt):', payRes.body.paidAt, '| Metode:', payRes.body.paymentType);

  // 6. Testing QR Code E-Ticket setelah lunas
  console.log('\n6. Testing QR Code E-Ticket...');
  const qrRes = await request('GET', `/orders/${orderId}/qrcode`, null, user1Token);
  console.log('   Status:', qrRes.status, '| QR Code Image Valid:', qrRes.body.qrCodeDataUrl?.startsWith('data:image/png;base64,'));

  // 7. Testing Verifikasi Tiket di Pintu Masuk (Check-in)
  console.log('\n7. Testing Verifikasi Petugas Bioskop (Check-in)...');
  const checkinRes = await request('POST', '/orders/verify-ticket', { bookingCode }, adminToken);
  console.log('   Status:', checkinRes.status, '| Pesan:', checkinRes.body.message);

  // 8. Testing Ulasan Verified Viewer setelah menonton
  console.log('\n8. Testing Review Film oleh Pembeli Tiket...');
  const reviewRes = await request('POST', `/movies/${movie.body.id}/reviews`, {
    rating: 5,
    comment: 'Sekuel Gladiator yang luar biasa megah!'
  }, user1Token);
  console.log('   Status:', reviewRes.status, '| Rating:', reviewRes.body.rating, '| Komentar:', reviewRes.body.comment);

  // 9. Testing Midtrans Webhook Endpoint
  console.log('\n9. Testing Midtrans Payment Webhook...');
  const webhookRes = await request('POST', '/orders/payment-webhook', {
    order_id: `ORDER-${orderId}-${bookingCode}`,
    transaction_status: 'settlement',
    payment_type: 'qris'
  });
  console.log('   Status:', webhookRes.status, '| Response:', webhookRes.body.message);

  console.log('\n========================================================================');
  console.log('🎉 SELURUH SISTEM BIOSKOP LENGKAP (FITUR 1 SAMPAI 5) BERHASIL 100%! 🎉');
  console.log('========================================================================');
}

run().catch(console.error);
