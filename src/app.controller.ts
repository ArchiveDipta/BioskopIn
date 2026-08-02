import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/html')
  getHello(): string {
    return `
      <html>
        <head>
          <title>BioskopIn</title>
          <meta name="google-site-verification" content="TmZ3HLVSodfnpHo9g0A2MPcufqhBxPJMXeDbzENMyHA" />
        </head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1>BioskopIn</h1>
          <p>BioskopIn is a comprehensive movie ticketing platform. Our application allows users to securely log in, browse currently showing movies, view real-time seat availability in studios, and book tickets for their favorite showtimes seamlessly.</p>
          <a href="/api">Buka Dokumentasi API (Swagger)</a><br><br>
          <a href="/privacy-policy">Privacy Policy (Kebijakan Privasi)</a> | <a href="/terms-of-service">Terms of Service (Syarat & Ketentuan)</a>
        </body>
      </html>
    `;
  }

  @Get('privacy-policy')
  @Header('Content-Type', 'text/html')
  getPrivacyPolicy(): string {
    return `
      <html>
        <head><title>Privacy Policy - BioskopIn</title></head>
        <body style="font-family: sans-serif; padding: 40px; line-height: 1.6; max-width: 800px; margin: auto;">
          <h1>Privacy Policy (Kebijakan Privasi)</h1>
          <p><strong>Terakhir diperbarui:</strong> Agustus 2026</p>
          <h2>1. Informasi yang Kami Kumpulkan</h2>
          <p>Saat Anda menggunakan otentikasi Google, kami mengumpulkan nama, alamat email, dan foto profil Anda. Informasi ini murni digunakan untuk membuat akun pengguna di platform BioskopIn.</p>
          <h2>2. Bagaimana Kami Menggunakan Informasi Anda</h2>
          <p>Kami menggunakan informasi Anda semata-mata untuk mengelola pesanan tiket bioskop Anda dan mempersonalisasi pengalaman Anda di aplikasi.</p>
          <h2>3. Berbagi Informasi</h2>
          <p>Kami tidak akan pernah menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga manapun.</p>
          <hr>
          <a href="/">Kembali ke Beranda</a>
        </body>
      </html>
    `;
  }

  @Get('terms-of-service')
  @Header('Content-Type', 'text/html')
  getTermsOfService(): string {
    return `
      <html>
        <head><title>Terms of Service - BioskopIn</title></head>
        <body style="font-family: sans-serif; padding: 40px; line-height: 1.6; max-width: 800px; margin: auto;">
          <h1>Terms of Service (Syarat & Ketentuan)</h1>
          <p><strong>Terakhir diperbarui:</strong> Agustus 2026</p>
          <h2>1. Penerimaan Syarat</h2>
          <p>Dengan menggunakan aplikasi BioskopIn, Anda setuju untuk terikat dengan syarat dan ketentuan ini.</p>
          <h2>2. Penggunaan Layanan</h2>
          <p>Aplikasi ini dibuat untuk tujuan demonstrasi dan pemesanan tiket bioskop. Dilarang keras melakukan eksploitasi, peretasan, atau aktivitas ilegal pada sistem kami.</p>
          <h2>3. Tiket dan Pembayaran</h2>
          <p>Semua transaksi yang dilakukan melalui platform ini bersifat final (atau sesuai dengan kebijakan pengembalian dana yang berlaku).</p>
          <hr>
          <a href="/">Kembali ke Beranda</a>
        </body>
      </html>
    `;
  }
}
