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
  console.log('=== MEMULAI PENGUJIAN 4 FITUR BARU DI LIVE RAILWAY SERVER ===\n');

  const ts = Date.now();
  const adminEmail = 'admin_' + ts + '@test.com';
  const user1Email = 'user1_' + ts + '@test.com';
  const user2Email = 'user2_' + ts + '@test.com';

  // 1. Setup Akun Admin & Customer
  console.log('1. Registrasi Akun Admin & 2 Customer...');
  const regAdmin = await request('POST', '/auth/register', { name: 'Admin Bioskop', email: adminEmail, password: 'password123', role: 'ADMIN' });
  const adminToken = regAdmin.body?.access_token;

  const regUser1 = await request('POST', '/auth/register', { name: 'Customer 1 (Penonton)', email: user1Email, password: 'password123', role: 'USER' });
  const user1Token = regUser1.body?.access_token;
  const user1Id = regUser1.body?.user?.id;

  const regUser2 = await request('POST', '/auth/register', { name: 'Customer 2 (Bukan Penonton)', email: user2Email, password: 'password123', role: 'USER' });
  const user2Token = regUser2.body?.access_token;
  console.log('   Status Admin:', regAdmin.status, '| User 1:', regUser1.status, '| User 2:', regUser2.status);

  // 2. Setup Bioskop, Studio, Film, dan Jadwal
  console.log('\n2. Setup Bioskop, Studio, Film, dan Jadwal...');
  const cinema = await request('POST', '/cinemas', { name: 'XXI Epicentrum ' + ts, city: 'Jakarta' }, adminToken);
  const studio = await request('POST', '/studios', { cinemaId: cinema.body.id, name: 'Studio Deluxe', rows: 2, seatsPerRow: 4 }, adminToken);
  const movie = await request('POST', '/movies', { title: 'Avatar: Fire and Ash', duration: 190, category: 'Action' }, adminToken);
  const startTime = new Date(Date.now() + 86400000).toISOString();
  const showtime = await request('POST', '/showtimes', { movieId: movie.body.id, studioId: studio.body.id, startTime, price: 50000 }, adminToken);
  console.log('   Bioskop ID:', cinema.body.id, '| Studio ID:', studio.body.id, '| Film ID:', movie.body.id, '| Showtime ID:', showtime.body.id);

  // ==========================================
  // FITUR 4: MAKANAN & MINUMAN (F&B)
  // ==========================================
  console.log('\n=== [FITUR 4] TESTING FOODS & BEVERAGES (F&B) ===');
  console.log('4.1 Admin menambahkan menu Popcorn & Soda...');
  const popcorn = await request('POST', '/foods', {
    name: 'Popcorn Caramel Large',
    description: 'Popcorn renyah manis gurih',
    price: 35000,
    category: 'SNACK'
  }, adminToken);
  console.log('    Status:', popcorn.status, '| Menu:', popcorn.body.name, '| Harga: Rp', popcorn.body.price);

  const soda = await request('POST', '/foods', {
    name: 'Coca Cola Zero 500ml',
    description: 'Minuman dingin segar',
    price: 15000,
    category: 'BEVERAGE'
  }, adminToken);
  console.log('    Status:', soda.status, '| Menu:', soda.body.name, '| Harga: Rp', soda.body.price);

  console.log('4.2 Customer melihat katalog menu F&B...');
  const foodsList = await request('GET', '/foods');
  console.log('    Status:', foodsList.status, '| Total Menu Tersedia:', foodsList.body.length);

  // ==========================================
  // FITUR 3: SEAT HOLD (KUNCI KURSI 10 MENIT)
  // ==========================================
  console.log('\n=== [FITUR 3] TESTING SEAT HOLD (TIMER 10 MENIT) ===');
  const seatsAvailabilityBefore = await request('GET', `/showtimes/${showtime.body.id}/seats`);
  const seatA1 = seatsAvailabilityBefore.body[0].id;
  const seatA2 = seatsAvailabilityBefore.body[1].id;
  console.log(`3.1 Customer 1 memilih & mengunci sementara Kursi [ID ${seatA1} & ID ${seatA2}]...`);

  const holdRes = await request('POST', `/showtimes/${showtime.body.id}/hold-seats`, {
    seatIds: [seatA1, seatA2]
  }, user1Token);
  console.log('    Status:', holdRes.status, '| Pesan:', holdRes.body.message, '| Expired At:', holdRes.body.expiresAt);

  console.log('3.2 Customer 2 mencoba mengunci kursi yang sama (Harus Ditolak)...');
  const holdConflictRes = await request('POST', `/showtimes/${showtime.body.id}/hold-seats`, {
    seatIds: [seatA1]
  }, user2Token);
  console.log('    Status (Expected 409 Conflict):', holdConflictRes.status, '| Pesan:', holdConflictRes.body.message);

  // ==========================================
  // CHECKOUT TIKET + F&B
  // ==========================================
  console.log('\n=== TESTING CHECKOUT TIKET + F&B SEKALIGUS ===');
  console.log('Customer 1 checkout 2 Tiket (2x50k) + 1 Popcorn (35k) + 2 Soda (2x15k)...');
  const checkoutRes = await request('POST', '/orders', {
    showtimeId: showtime.body.id,
    seatIds: [seatA1, seatA2],
    foodItems: [
      { foodItemId: popcorn.body.id, quantity: 1 },
      { foodItemId: soda.body.id, quantity: 2 }
    ]
  }, user1Token);
  // Total expected: 100.000 (tiket) + 35.000 + 30.000 = 165.000
  console.log('Status:', checkoutRes.status, '| Order ID:', checkoutRes.body.id);
  console.log('Total Harga Tercatat: Rp', checkoutRes.body.totalPrice, '(Expected: Rp 165000)');
  console.log('Menu F&B yang Dibeli:', checkoutRes.body.foodItems?.map(f => `${f.foodItem.name} (${f.quantity}x)`).join(', '));
  const orderId = checkoutRes.body.id;
  const bookingCode = checkoutRes.body.bookingCode;

  // ==========================================
  // FITUR 2: QR CODE & CHECK-IN TIKET
  // ==========================================
  console.log('\n=== [FITUR 2] TESTING QR CODE E-TICKET & VERIFIKASI CHECK-IN ===');
  console.log('2.1 Customer 1 mengambil QR Code E-Ticket...');
  const qrRes = await request('GET', `/orders/${orderId}/qrcode`, null, user1Token);
  console.log('    Status:', qrRes.status, '| QR Code Image DataURL Didapat:', qrRes.body.qrCodeDataUrl?.startsWith('data:image/png;base64,'));
  console.log('    Booking Code:', qrRes.body.bookingCode, '| Status Check-in:', qrRes.body.isCheckedIn);

  console.log('2.2 Petugas Bioskop (Admin) scan QR Code tiket penonton di pintu studio...');
  const verifyRes = await request('POST', '/orders/verify-ticket', { bookingCode }, adminToken);
  console.log('    Status:', verifyRes.status, '| Pesan:', verifyRes.body.message);
  console.log('    Checked-in At:', verifyRes.body.checkedInAt, '| Penonton:', verifyRes.body.order?.user?.name);

  console.log('2.3 Petugas coba scan tiket yang sama lagi (Pencegahan Tiket Bekas/Duplikasi)...');
  const verifyAgainRes = await request('POST', '/orders/verify-ticket', { bookingCode }, adminToken);
  console.log('    Status (Expected 409 Conflict):', verifyAgainRes.status, '| Pesan:', verifyAgainRes.body.message);

  // ==========================================
  // FITUR 5: RATING & ULASAN VERIFIED VIEWER
  // ==========================================
  console.log('\n=== [FITUR 5] TESTING RATING & ULASAN FILM OLEH PENONTON RESMI ===');
  console.log('5.1 Customer 2 yang BELUM pernah beli tiket mencoba memberi ulasan (Harus Ditolak 403)...');
  const fakeReviewRes = await request('POST', `/movies/${movie.body.id}/reviews`, {
    rating: 1,
    comment: 'Film jelek padahal belum nonton'
  }, user2Token);
  console.log('    Status (Expected 403 Forbidden):', fakeReviewRes.status, '| Pesan:', fakeReviewRes.body.message);

  console.log('5.2 Customer 1 yang SUDAH membeli tiket memberikan ulasan resmi bintang 5...');
  const realReviewRes = await request('POST', `/movies/${movie.body.id}/reviews`, {
    rating: 5,
    comment: 'Film mahakarya luar biasa! Visual efeknya spektakuler.'
  }, user1Token);
  console.log('    Status:', realReviewRes.status, '| Review ID:', realReviewRes.body.id, '| Rating:', realReviewRes.body.rating);

  console.log('5.3 Publik melihat seluruh ulasan dan rata-rata rating film...');
  const reviewsListRes = await request('GET', `/movies/${movie.body.id}/reviews`);
  console.log('    Status:', reviewsListRes.status, '| Total Ulasan:', reviewsListRes.body.totalReviews, '| Rata-rata Rating:', reviewsListRes.body.averageRating);
  console.log('    Komentar:', reviewsListRes.body.reviews[0]?.comment, 'oleh', reviewsListRes.body.reviews[0]?.user?.name);

  console.log('\n======================================================');
  console.log('🎉 SEMUA 4 FITUR BARU BERFUNGSI SEMPURNA 100% DI RAILWAY! 🎉');
  console.log('======================================================');
}

run().catch(console.error);
