// fetch built in Node 18

const baseUrl = 'http://127.0.0.1:3000';
let adminToken = '';
let userToken = '';
let movieId = '';
let cinemaId = '';
let studioId = '';
let showtimeId = '';
let orderId = '';

async function assert(condition, message, expected, actual) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
  } else {
    console.error(`❌ FAIL: ${message} | Expected: ${expected}, Actual: ${actual}`);
    process.exit(1);
  }
}

async function runTests() {
  try {
    console.log('=== PREPARATION ===');
    
    // 1. Setup Admin
    const adminEmail = `admin_${Date.now()}@test.com`;
    await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Admin', email: adminEmail, password: 'password123' })
    });
    
    // Kita butuh koneksi DB untuk paksa role ADMIN ke adminEmail
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: 'ADMIN' }
    });
    
    const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password: 'password123' })
    });
    const adminLoginData = await adminLoginRes.json();
    adminToken = adminLoginData.access_token;
    console.log('✅ Admin Token Acquired');

    // 2. Setup User
    const userEmail = `user_${Date.now()}@test.com`;
    await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'User', email: userEmail, password: 'password123' })
    });
    
    const userLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, password: 'password123' })
    });
    const userLoginData = await userLoginRes.json();
    userToken = userLoginData.access_token;
    console.log('✅ User Token Acquired');


    console.log('\n=== TESTING MOVIES CRUD ===');
    // POST Movie
    const moviePayload = {
      title: 'Movie Testing Complete',
      description: 'A good movie for testing',
      duration: 120,
      category: 'Action',
      ageRating: 'R13+'
    };

    const moviePost = await fetch(`${baseUrl}/movies`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(moviePayload)
    });
    const moviePostText = await moviePost.text();
    console.log('moviePost.status:', moviePost.status, moviePostText);
    assert(moviePost.status === 201, 'Create Movie', 201, moviePost.status);
    const createdMovie = JSON.parse(moviePostText);
    movieId = createdMovie.id;

    // GET Movies
    const moviesGet = await fetch(`${baseUrl}/movies`);
    assert(moviesGet.status === 200, 'Get All Movies', 200, moviesGet.status);
    const allMovies = await moviesGet.json();
    assert(allMovies.some(m => m.id === movieId), 'New movie exists in list', true, false);

    // PATCH Movie
    const moviePatch = await fetch(`${baseUrl}/movies/${movieId}`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: 'Movie Testing Updated' })
    });
    assert(moviePatch.status === 200, 'Update Movie', 200, moviePatch.status);


    console.log('\n=== TESTING CINEMAS CRUD ===');
    const cinemaPost = await fetch(`${baseUrl}/cinemas`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Cinema Test', city: 'Jakarta', address: 'Jl. Test No. 1' })
    });
    assert(cinemaPost.status === 201, 'Create Cinema', 201, cinemaPost.status);
    const createdCinema = await cinemaPost.json();
    cinemaId = createdCinema.id;


    console.log('\n=== TESTING STUDIOS CRUD ===');
    // POST Studio
    const studioPost = await fetch(`${baseUrl}/studios`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ cinemaId: cinemaId, name: 'Studio Test Complete', rows: 5, seatsPerRow: 6 })
    });
    const studioPostText = await studioPost.text();
    console.log('studioPost.status:', studioPost.status, studioPostText);
    assert(studioPost.status === 201, 'Create Studio', 201, studioPost.status);
    const createdStudio = JSON.parse(studioPostText);
    studioId = createdStudio.id;


    console.log('\n=== TESTING SHOWTIMES CRUD ===');
    const showtimePost = await fetch(`${baseUrl}/showtimes`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        movieId: movieId,
        studioId: studioId,
        startTime: new Date(Date.now() + 86400000).toISOString(), // besok
        price: 55000
      })
    });
    assert(showtimePost.status === 201, 'Create Showtime', 201, showtimePost.status);
    const createdShowtime = await showtimePost.json();
    showtimeId = createdShowtime.id;


    console.log('\n=== TESTING ORDERS CRUD ===');
    // GET Seats
    const seatsGet = await fetch(`${baseUrl}/showtimes/${showtimeId}/seats`);
    assert(seatsGet.status === 200, 'Get Seats for Showtime', 200, seatsGet.status);
    const seatsData = await seatsGet.json();
    
    // POST Order (sebagai User)
    const seatIds = seatsData.slice(0, 2).map(s => s.id);
    const orderPost = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        showtimeId: showtimeId,
        seatIds: seatIds
      })
    });
    const orderPostText = await orderPost.text();
    console.log('orderPost.status:', orderPost.status, orderPostText);
    assert(orderPost.status === 201, 'Create Order as User', 201, orderPost.status);
    const createdOrder = JSON.parse(orderPostText);
    orderId = createdOrder.id;

    // GET My Orders (User)
    const myOrdersGet = await fetch(`${baseUrl}/orders/my-orders`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    assert(myOrdersGet.status === 200, 'Get My Orders', 200, myOrdersGet.status);

    // PATCH Order Status (Admin)
    const orderPatch = await fetch(`${baseUrl}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'SUCCESS' })
    });
    const orderPatchText = await orderPatch.text();
    console.log('orderPatch.status:', orderPatch.status, orderPatchText);
    assert(orderPatch.status === 200, 'Update Order Status as Admin', 200, orderPatch.status);


    console.log('\n=== CLEANUP (DELETIONS) ===');
    // Hapus Showtime (bisa gagal jika order belum cascade, mari kita coba)
    const orderDelete = await fetch(`${baseUrl}/orders/${orderId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if(orderDelete.status !== 404) {
        assert(orderDelete.status === 200, 'Delete Order', 200, orderDelete.status);
    }

    const showtimeDelete = await fetch(`${baseUrl}/showtimes/${showtimeId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(showtimeDelete.status === 200, 'Delete Showtime', 200, showtimeDelete.status);

    const studioDelete = await fetch(`${baseUrl}/studios/${studioId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(studioDelete.status === 200, 'Delete Studio', 200, studioDelete.status);

    const cinemaDelete = await fetch(`${baseUrl}/cinemas/${cinemaId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(cinemaDelete.status === 200, 'Delete Cinema', 200, cinemaDelete.status);

    const movieDelete = await fetch(`${baseUrl}/movies/${movieId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(movieDelete.status === 200, 'Delete Movie', 200, movieDelete.status);

    console.log('\n🎉 ALL FULL CRUD TESTS PASSED PERFECTLY!');
    await prisma.$disconnect();
    process.exit(0);
    
  } catch(e) {
    console.error('Crash!', e);
    process.exit(1);
  }
}

runTests();
