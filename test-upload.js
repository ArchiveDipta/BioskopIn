const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const baseUrl = 'http://127.0.0.1:3000';

async function testUpload() {
  try {
    console.log('1. Ambil token admin...');
    const adminEmail = `admin_upload_${Date.now()}@test.com`;
    await axios.post(`${baseUrl}/auth/register`, { name: 'Admin Upload', email: adminEmail, password: 'password123' });
    
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: 'ADMIN' }
    });
    
    const loginRes = await axios.post(`${baseUrl}/auth/login`, { email: adminEmail, password: 'password123' });
    const access_token = loginRes.data.access_token;
    
    console.log('2. Bikin dummy image file...');
    const imgBuffer = Buffer.from('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64');
    fs.writeFileSync('dummy.jpg', imgBuffer);
    
    console.log('3. POST /movies dengan gambar...');
    const form = new FormData();
    form.append('title', 'Movie dengan Gambar');
    form.append('description', 'Test Upload Supabase');
    form.append('duration', 120);
    form.append('poster', fs.createReadStream('dummy.jpg'));

    const postRes = await axios.post(`${baseUrl}/movies`, form, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        ...form.getHeaders()
      }
    });
    
    console.log('Response Status:', postRes.status);
    console.log('Response Body:', postRes.data);
    
    if (postRes.status === 201) {
      const data = postRes.data;
      console.log('✅ Upload berhasil! URL Poster:', data.posterUrl);
      
      console.log('4. Cleanup...');
      await axios.delete(`${baseUrl}/movies/${data.id}`, {
        headers: { 'Authorization': `Bearer ${access_token}` }
      });
      fs.unlinkSync('dummy.jpg');
      console.log('✅ Selesai.');
    }

  } catch(e) {
    if(e.response) {
      console.error('Error Response:', e.response.status, e.response.data);
    } else {
      console.error('Error:', e.message);
    }
    if (fs.existsSync('dummy.jpg')) fs.unlinkSync('dummy.jpg');
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

testUpload();
