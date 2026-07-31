import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Menghapus data lama (opsional)...');
  await prisma.showtime.deleteMany();
  await prisma.movie.deleteMany();
  // Kita biarkan Studio dan Seat tetap utuh karena sudah digenerate dengan baik

  console.log('Menambahkan Film...');
  const movie1 = await prisma.movie.create({
    data: {
      title: 'Spider-Man: No Way Home',
      description: 'Identitas Spider-Man kini terungkap, dan Peter meminta bantuan Doctor Strange. Namun, sebuah kesalahan mantra justru mengundang musuh berbahaya dari semesta lain.',
      duration: 148,
      posterUrl: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1ZrsNdGvpK2PZJ.jpg',
      trailerUrl: 'https://www.youtube.com/embed/JfVOs4VSpmA',
    },
  });

  const movie2 = await prisma.movie.create({
    data: {
      title: 'Oppenheimer',
      description: 'Kisah J. Robert Oppenheimer dan perannya dalam pengembangan bom atom pada masa Perang Dunia II.',
      duration: 180,
      posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
    },
  });

  const movie3 = await prisma.movie.create({
    data: {
      title: 'Interstellar',
      description: 'Tim penjelajah luar angkasa melakukan perjalanan melalui lubang cacing untuk memastikan kelangsungan hidup umat manusia.',
      duration: 169,
      posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MvrIdlsR.jpg',
      trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    },
  });

  console.log('Mengambil data Studio...');
  const studio = await prisma.studio.findFirst();
  
  if (studio) {
    console.log('Menambahkan Jadwal Tayang (Showtime)...');
    
    // Hari ini jam 19:00
    const today = new Date();
    today.setHours(19, 0, 0, 0);

    // Besok jam 14:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);

    await prisma.showtime.createMany({
      data: [
        {
          movieId: movie1.id,
          studioId: studio.id,
          startTime: today,
          price: 50000,
        },
        {
          movieId: movie2.id,
          studioId: studio.id,
          startTime: tomorrow,
          price: 65000,
        },
        {
          movieId: movie3.id,
          studioId: studio.id,
          startTime: new Date(new Date().setHours(21, 30, 0, 0)),
          price: 45000,
        },
      ],
    });
  }

  // Membuat User Dummy Admin
  const adminExists = await prisma.user.findUnique({ where: { email: 'admin@bioskopin.com' } });
  if (!adminExists) {
    console.log('Membuat Akun Dummy Admin...');
    await prisma.user.create({
      data: {
        email: 'admin@bioskopin.com',
        name: 'Super Admin',
        role: Role.ADMIN,
      }
    });
  }

  console.log('Seeding Selesai! Data dummy telah berhasil diimpor.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
