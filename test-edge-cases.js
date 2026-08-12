const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const PORT = 3000;
const baseUrl = `http://127.0.0.1:${PORT}`;
// Note: In Node 18, global fetch is available.

async function runTests() {
  let failed = 0;
  let passed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    console.log('--- 1. Testing Validation Errors (Invalid Input) ---');
    // Test Register without email
    const regRes1 = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', password: 'password123' })
    });
    assert(regRes1.status === 400, 'Register without email should return 400 Bad Request');
    
    // Test Register with invalid email
    const regRes2 = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', email: 'not-an-email', password: 'password123' })
    });
    assert(regRes2.status === 400, 'Register with invalid email should return 400 Bad Request');

    // Test Register with short password
    const regRes3 = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', email: 'valid@email.com', password: '123' })
    });
    assert(regRes3.status === 400, 'Register with short password should return 400 Bad Request');

    console.log('\n--- 2. Testing Logic Errors ---');
    // Login with unregistered email
    const loginRes1 = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'doesntexist@bioskopin.com', password: 'password123' })
    });
    assert(loginRes1.status === 401, 'Login with unregistered email should return 401 Unauthorized');
    
    // Login with wrong password
    await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', email: 'tester@bioskopin.com', password: 'password123' })
    });
    
    const loginRes2 = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'tester@bioskopin.com', password: 'wrongpassword' })
    });
    assert(loginRes2.status === 401, 'Login with wrong password should return 401 Unauthorized');

    console.log('\n--- 3. Testing CRUD Invalid Inputs ---');
    // Get token first
    const loginRes3 = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'tester@bioskopin.com', password: 'password123' })
    });
    const { access_token } = await loginRes3.json();
    
    // Upgrade to ADMIN
    await prisma.user.update({
      where: { email: 'tester@bioskopin.com' },
      data: { role: 'ADMIN' }
    });

    const FormData = require('form-data');
    
    // Movie POST missing required fields
    const movieForm = new FormData();
    movieForm.append('description', 'Missing title and duration');
    const moviePost = await fetch(`${baseUrl}/movies`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${access_token}` },
      body: movieForm
    });
    const moviePostText = await moviePost.text();
    console.log('moviePost.status:', moviePost.status, 'body:', moviePostText);
    assert(moviePost.status === 400, 'Movie POST missing title should return 400 Bad Request');

    // Create a real movie
    const realMovieForm = new FormData();
    realMovieForm.append('title', 'Test Real Movie');
    realMovieForm.append('description', 'Test Description');
    realMovieForm.append('duration', 150);
    const movieRealPost = await fetch(`${baseUrl}/movies`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${access_token}` },
      body: realMovieForm
    });
    const createdMovie = await movieRealPost.json();

    // Showtime POST missing movieId
    const showtimePost = await fetch(`${baseUrl}/showtimes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
      body: JSON.stringify({
        studioId: 1, // hardcoded for test
        startTime: new Date().toISOString(),
        price: 50000
      })
    });
    const showtimePostText = await showtimePost.text();
    console.log('showtimePost.status:', showtimePost.status, 'body:', showtimePostText);
    assert(showtimePost.status === 400, 'Showtime POST missing movieId should return 400 Bad Request');
    
    // Delete the real movie to clean up
    await fetch(`${baseUrl}/movies/${createdMovie.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${access_token}` }
    });

  } catch (err) {
    console.error('Test script error:', err);
  } finally {
    console.log(`\nTests completed. Passed: ${passed}, Failed: ${failed}`);
    await prisma.$disconnect();
    process.exit(0);
  }
}

runTests();
