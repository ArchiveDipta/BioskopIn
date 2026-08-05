"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
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
    getPrivacyPolicy() {
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
    getTermsOfService() {
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
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Header)('Content-Type', 'text/html'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('privacy-policy'),
    (0, common_1.Header)('Content-Type', 'text/html'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getPrivacyPolicy", null);
__decorate([
    (0, common_1.Get)('terms-of-service'),
    (0, common_1.Header)('Content-Type', 'text/html'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getTermsOfService", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map