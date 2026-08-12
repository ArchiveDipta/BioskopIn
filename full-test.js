const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const baseUrl = 'http://127.0.0.1:3000';

async function registerAndPromote(email, name = 'Test User') {
  // register
  await axios.post(`${baseUrl}/auth/register`, { name, email, password: 'password123' });
  // promote to admin if needed
  await prisma.user.update({ where: { email }, data: { role: 'ADMIN' } }).catch(() => {});
  // login
  const loginRes = await axios.post(`${baseUrl}/auth/login`, { email, password: 'password123' });
  return loginRes.data.access_token;
}

async function main() {
  try {
    console.log('=== SETUP ADMIN & USER ===');
    const adminEmail = `admin_${Date.now()}@test.com`;
    const userEmail = `user_${Date.now()}@test.com`;
    const adminToken = await registerAndPromote(adminEmail, 'Admin User');
    const userToken = await registerAndPromote(userEmail, 'Normal User');

    // ---- MOVIE CRUD (with image) ----
    console.log('\n=== MOVIE CRUD ===');
    const imgBuf = Buffer.from('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64');
    fs.writeFileSync('dummy.jpg', imgBuf);
    const movieForm = new FormData();
    movieForm.append('title', 'Full Flow Movie');
    movieForm.append('description', 'Testing all features');
    movieForm.append('duration', 120);
    movieForm.append('poster', fs.createReadStream('dummy.jpg'));
    const movieRes = await axios.post(`${baseUrl}/movies`, movieForm, {
      headers: { Authorization: `Bearer ${adminToken}`, ...movieForm.getHeaders() },
    });
    const movie = movieRes.data;
    console.log('Created movie', movie.id);

    // ---- STUDIO CRUD ----
    console.log('\n=== STUDIO CRUD ===');
    const studioRes = await axios.post(
      `${baseUrl}/studios`,
      { name: 'Test Studio', rows: 5, seatsPerRow: 10 },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    const studio = studioRes.data;
    console.log('Created studio', studio.id);

    // ---- SHOWTIME CRUD ----
    console.log('\n=== SHOWTIME CRUD ===');
    const showtimeRes = await axios.post(
      `${baseUrl}/showtimes`,
      {
        movieId: movie.id,
        studioId: studio.id,
        startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1h later
        price: 55000,
      },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    const showtime = showtimeRes.data;
    console.log('Created showtime', showtime.id);

    // ---- GET SEATS ----
    console.log('\n=== GET SEATS ===');
    const seatsRes = await axios.get(`${baseUrl}/showtimes/${showtime.id}/seats`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const seats = seatsRes.data;
    console.log('Available seats', seats.length);

    // ---- CREATE ORDER ----
    console.log('\n=== CREATE ORDER ===');
    const selectedSeats = seats.slice(0, 2).map(s => s.id);
    const orderRes = await axios.post(
      `${baseUrl}/orders`,
      { showtimeId: showtime.id, seatIds: selectedSeats },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    const order = orderRes.data;
    console.log('Order created', order.id);

    // ---- UPDATE ORDER STATUS (as admin) ----
    console.log('\n=== UPDATE ORDER STATUS ===');
    const patchRes = await axios.patch(
      `${baseUrl}/orders/${order.id}/status`,
      { status: 'SUCCESS' },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    console.log('Order status updated', patchRes.data.status);

    // ---- CLEANUP ----
    console.log('\n=== CLEANUP ===');
    await axios.delete(`${baseUrl}/orders/${order.id}`, { headers: { Authorization: `Bearer ${adminToken}` } });
    await axios.delete(`${baseUrl}/showtimes/${showtime.id}`, { headers: { Authorization: `Bearer ${adminToken}` } });
    await axios.delete(`${baseUrl}/movies/${movie.id}`, { headers: { Authorization: `Bearer ${adminToken}` } });
    await axios.delete(`${baseUrl}/studios/${studio.id}`, { headers: { Authorization: `Bearer ${adminToken}` } });
    fs.unlinkSync('dummy.jpg');
    console.log('✅ All resources cleaned up');
  } catch (e) {
    console.error('❌ Test failed', e.response ? e.response.data : e.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
