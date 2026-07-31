const http = require('http');
const jwt = require('jsonwebtoken');

const SECRET = 'rahasia_jwt_bebas_diisi_apapun';

// Generate Admin JWT Token
const adminToken = jwt.sign(
  { email: 'admin@bioskopin.com', sub: 'admin_id_test', role: 'ADMIN' },
  SECRET,
  { expiresIn: '1h' }
);

async function fetchApi(path, method = 'GET', data = null, useToken = true) {
  return new Promise((resolve, reject) => {
    const headers = { 'Content-Type': 'application/json' };
    if (useToken) headers['Authorization'] = `Bearer ${adminToken}`;
    
    const req = http.request({ hostname: 'localhost', port: 3000, path, method, headers }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body: body.slice(0, 500) }));
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING API TESTS ---');
  let passed = 0;
  let total = 0;

  async function test(name, path, method, data, useToken, expectedStatus) {
    total++;
    try {
      const res = await fetchApi(path, method, data, useToken);
      if (res.status === expectedStatus) {
        console.log(`[PASS] ${name} (Status: ${res.status})`);
        passed++;
      } else {
        console.error(`[FAIL] ${name} (Expected: ${expectedStatus}, Got: ${res.status})`);
        console.error(`       Response: ${res.body}`);
      }
    } catch (e) {
      console.error(`[ERROR] ${name} - ${e.message}`);
    }
  }

  await test('Public: GET /movies', '/movies', 'GET', null, false, 200);
  await test('Public: GET /studios (Should Fail - 401)', '/studios', 'GET', null, false, 401);
  await test('Admin: GET /studios', '/studios', 'GET', null, true, 200);
  await test('Admin: GET /orders', '/orders', 'GET', null, true, 200);
  await test('Admin: GET /admin/analytics/top-movies', '/admin/analytics/top-movies', 'GET', null, true, 200);
  
  console.log(`\n--- TESTS COMPLETED: ${passed}/${total} PASSED ---`);
}

runTests();
