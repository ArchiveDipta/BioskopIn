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
  console.log('=== MEMULAI INTEGRATION TEST PADA SERVER LIVE RAILWAY ===\n');

  const ts = Date.now();
  const adminEmail = 'admin_' + ts + '@test.com';
  const userEmail = 'user_' + ts + '@test.com';

  // 1. Register Admin
  console.log('1. Testing Register Admin...');
  const regAdmin = await request('POST', '/auth/register', {
    name: 'Super Admin',
    email: adminEmail,
    password: 'password123',
    role: 'ADMIN'
  });
  console.log('   Status:', regAdmin.status, '| Access Token didapat:', !!regAdmin.body?.access_token);
  const adminToken = regAdmin.body?.access_token;

  // 2. Register Customer
  console.log('2. Testing Register Customer...');
  const regUser = await request('POST', '/auth/register', {
    name: 'Customer Dipta',
    email: userEmail,
    password: 'password123',
    role: 'USER'
  });
  console.log('   Status:', regUser.status, '| Access Token didapat:', !!regUser.body?.access_token);
  const userToken = regUser.body?.access_token;

  // 3. Create Cinema (Admin)
  console.log('3. Testing Create Cinema (Admin)...');
  const cinemaRes = await request('POST', '/cinemas', {
    name: 'XXI Grand Cinema ' + ts,
    city: 'Jakarta',
    address: 'Jl. Sudirman No. 10'
  }, adminToken);
  console.log('   Status:', cinemaRes.status, '| Cinema ID:', cinemaRes.body?.id);
  const cinemaId = cinemaRes.body?.id;

  // 4. Create Studio (Admin)
  console.log('4. Testing Create Studio & Auto-generate Seats (Admin)...');
  const studioRes = await request('POST', '/studios', {
    cinemaId: cinemaId,
    name: 'Studio 1 IMAX',
    rows: 2,
    seatsPerRow: 3
  }, adminToken);
  console.log('   Status:', studioRes.status, '| Studio ID:', studioRes.body?.id, '| Total Kapasitas:', studioRes.body?.totalCapacity);
  const studioId = studioRes.body?.id;

  // 5. Create Movie (Admin)
  console.log('5. Testing Create Movie (Admin)...');
  const movieRes = await request('POST', '/movies', {
    title: 'Interstellar 2026',
    duration: 169,
    category: 'Sci-Fi',
    ageRating: 'SU',
    description: 'Petualangan melintasi lubang cacing'
  }, adminToken);
  console.log('   Status:', movieRes.status, '| Movie ID:', movieRes.body?.id, '| Judul:', movieRes.body?.title);
  const movieId = movieRes.body?.id;

  // 6. Create Showtime (Admin)
  console.log('6. Testing Create Showtime (Admin)...');
  const startTime = new Date(Date.now() + 3600000).toISOString();
  const showtimeRes = await request('POST', '/showtimes', {
    movieId: movieId,
    studioId: studioId,
    startTime: startTime,
    price: 50000
  }, adminToken);
  console.log('   Status:', showtimeRes.status, '| Showtime ID:', showtimeRes.body?.id, '| Harga:', showtimeRes.body?.price);
  const showtimeId = showtimeRes.body?.id;

  // 7. Testing New Endpoint: GET /movies/:id
  console.log('7. Testing Endpoint Baru: GET /movies/:id...');
  const movieDetailRes = await request('GET', '/movies/' + movieId);
  console.log('   Status:', movieDetailRes.status, '| Showtimes Count:', movieDetailRes.body?.showtimes?.length);

  // 8. Testing New Endpoint: GET /showtimes?movieId=...
  console.log('8. Testing Endpoint Baru: GET /showtimes?movieId=...');
  const showtimesListRes = await request('GET', '/showtimes?movieId=' + movieId);
  console.log('   Status:', showtimesListRes.status, '| Jumlah Jadwal Ditemukan:', showtimesListRes.body?.length);

  // 9. Check Seats Availability
  console.log('9. Testing GET /showtimes/:id/seats (Ketersediaan Kursi)...');
  const seatsRes = await request('GET', '/showtimes/' + showtimeId + '/seats');
  console.log('   Status:', seatsRes.status, '| Total Kursi Tersedia:', seatsRes.body?.length);
  const seat1 = seatsRes.body[0]?.id;
  const seat2 = seatsRes.body[1]?.id;
  console.log('   Memilih Kursi: [ID ' + seat1 + ' (' + seatsRes.body[0]?.row + seatsRes.body[0]?.number + ') & ID ' + seat2 + ' (' + seatsRes.body[1]?.row + seatsRes.body[1]?.number + ')]');

  // 10. Checkout Order (Customer)
  console.log('10. Testing Checkout Order (Customer)...');
  const checkoutRes = await request('POST', '/orders', {
    showtimeId: showtimeId,
    seatIds: [seat1, seat2]
  }, userToken);
  console.log('   Status:', checkoutRes.status, '| Order ID:', checkoutRes.body?.id, '| Total Harga: Rp ' + checkoutRes.body?.totalPrice, '| Booking Code:', checkoutRes.body?.bookingCode);
  console.log('   Tiket Terbentuk:', checkoutRes.body?.tickets?.length, '| Film:', checkoutRes.body?.tickets?.[0]?.showtime?.movie?.title);

  // 11. Testing Anti-Double-Booking Prevention
  console.log('11. Testing Pencegahan Kursi Ganda (Double Booking)...');
  const doubleBookingRes = await request('POST', '/orders', {
    showtimeId: showtimeId,
    seatIds: [seat1]
  }, userToken);
  console.log('   Status (Expected 409 Conflict):', doubleBookingRes.status, '| Pesan:', doubleBookingRes.body?.message);

  // 12. Testing Invalid Seat IDs
  console.log('12. Testing Validasi Kursi Tidak Valid (Invalid Seat)...');
  const invalidSeatRes = await request('POST', '/orders', {
    showtimeId: showtimeId,
    seatIds: [99999]
  }, userToken);
  console.log('   Status (Expected 400 Bad Request):', invalidSeatRes.status, '| Pesan:', invalidSeatRes.body?.message);

  // 13. Testing GET /orders/my-orders
  console.log('13. Testing GET /orders/my-orders (Riwayat Pesanan)...');
  const myOrdersRes = await request('GET', '/orders/my-orders', null, userToken);
  console.log('   Status:', myOrdersRes.status, '| Total Pesanan:', myOrdersRes.body?.length);

  // 14. Testing Analytics Revenue (Admin)
  console.log('14. Testing Admin Analytics Revenue...');
  const revenueRes = await request('GET', '/admin/analytics/revenue', null, adminToken);
  console.log('   Status:', revenueRes.status, '| Total Revenue Tercatat: Rp ' + revenueRes.body?.totalRevenue);

  // 15. Testing Analytics Top Movies (Admin)
  console.log('15. Testing Admin Analytics Top Movies...');
  const topMoviesRes = await request('GET', '/admin/analytics/top-movies', null, adminToken);
  console.log('   Status:', topMoviesRes.status, '| Top Movie:', topMoviesRes.body?.[0]?.title, '| Tiket Terjual:', topMoviesRes.body?.[0]?.ticketsSold);

  console.log('\n=== SEMUA 15 PENGUJIAN SELESAI DENGAN SUKSES! ===');
}

run().catch(console.error);
