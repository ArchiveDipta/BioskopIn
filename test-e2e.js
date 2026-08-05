const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function testAll() {
  const prisma = new PrismaClient();
  const PORT = 3000;
  const baseUrl = `http://localhost:${PORT}`;

  try {
    console.log('--- 1. Testing Registration ---');
    const registerRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Admin', email: 'testadmin@bioskopin.com', password: 'password123' })
    });
    
    // We ignore 409 because we might have registered it already
    if (registerRes.status !== 201 && registerRes.status !== 409) {
      throw new Error(`Register failed: ${await registerRes.text()}`);
    }
    console.log('✅ Registration (or already registered)');

    // Force user to be ADMIN
    await prisma.user.update({
      where: { email: 'testadmin@bioskopin.com' },
      data: { role: 'ADMIN' }
    });

    console.log('--- 2. Testing Login ---');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testadmin@bioskopin.com', password: 'password123' })
    });

    if (loginRes.status !== 201) throw new Error(`Login failed: ${await loginRes.text()}`);
    const { access_token } = await loginRes.json();
    console.log('✅ Login successful, got token');

    const authHeaders = {
      'Authorization': `Bearer ${access_token}`
    };

    console.log('--- 3. Testing Movies POST ---');
    // Using formData to test upload if needed, but the endpoint supports optional file.
    // So JSON is fine if we omit file. wait, if it uses FileInterceptor without any body parsing maybe it fails?
    // Let's use multipart/form-data with fetch.
    const FormData = require('form-data');
    const movieForm = new FormData();
    movieForm.append('title', 'Test Movie CRUD');
    movieForm.append('description', 'This is a test');
    movieForm.append('duration', 120);

    // Using form-data with node fetch
    const moviePost = await fetch(`${baseUrl}/movies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`
      },
      body: movieForm
    });

    if (moviePost.status !== 201) throw new Error(`Movie POST failed: ${await moviePost.text()}`);
    const createdMovie = await moviePost.json();
    console.log('✅ Movie POST successful');

    console.log('--- 4. Testing Movies GET ---');
    const moviesGet = await fetch(`${baseUrl}/movies`);
    if (moviesGet.status !== 200) throw new Error(`Movie GET failed: ${await moviesGet.text()}`);
    const allMovies = await moviesGet.json();
    if (!Array.isArray(allMovies)) throw new Error('Movies GET should return array');
    console.log('✅ Movie GET successful');

    console.log('--- 5. Testing Movies PATCH ---');
    const updateForm = new FormData();
    updateForm.append('title', 'Test Movie CRUD Updated');
    const moviePatch = await fetch(`${baseUrl}/movies/${createdMovie.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${access_token}`
      },
      body: updateForm
    });
    if (moviePatch.status !== 200) throw new Error(`Movie PATCH failed: ${await moviePatch.text()}`);
    console.log('✅ Movie PATCH successful');

    console.log('--- 6. Testing Showtimes POST ---');
    const studio = await prisma.studio.findFirst();
    const showtimePost = await fetch(`${baseUrl}/showtimes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
      body: JSON.stringify({
        movieId: createdMovie.id,
        studioId: studio.id,
        startTime: new Date().toISOString(),
        price: 50000
      })
    });
    if (showtimePost.status !== 201) throw new Error(`Showtime POST failed: ${await showtimePost.text()}`);
    const createdShowtime = await showtimePost.json();
    console.log('✅ Showtime POST successful');

    console.log('--- 7. Testing Seats GET ---');
    const seatsGet = await fetch(`${baseUrl}/showtimes/${createdShowtime.id}/seats`);
    if (seatsGet.status !== 200) throw new Error(`Seats GET failed: ${await seatsGet.text()}`);
    console.log('✅ Seats GET successful');

    console.log('--- 8. Testing Showtimes DELETE ---');
    const showtimeDelete = await fetch(`${baseUrl}/showtimes/${createdShowtime.id}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    if (showtimeDelete.status !== 200) throw new Error(`Showtime DELETE failed: ${await showtimeDelete.text()}`);
    console.log('✅ Showtime DELETE successful');

    console.log('--- 9. Testing Movies DELETE ---');
    const movieDelete = await fetch(`${baseUrl}/movies/${createdMovie.id}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    if (movieDelete.status !== 200) throw new Error(`Movie DELETE failed: ${await movieDelete.text()}`);
    console.log('✅ Movie DELETE successful');

    console.log('🎉 ALL CRUD TESTS PASSED PERFECTLY!');

  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

testAll();
