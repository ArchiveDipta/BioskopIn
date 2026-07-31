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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
const google_auth_library_1 = require("google-auth-library");
let AuthService = class AuthService {
    prisma;
    jwtService;
    storageService;
    googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    constructor(prisma, jwtService, storageService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.storageService = storageService;
    }
    async validateOAuthLogin(profile) {
        let user = await this.prisma.user.findUnique({
            where: { email: profile.email },
        });
        if (!user) {
            let avatarUrl = null;
            if (profile.picture) {
                try {
                    const response = await fetch(profile.picture);
                    const arrayBuffer = await response.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    const filename = `profiles/${profile.email.replace(/[@.]/g, '_')}_${Date.now()}.jpg`;
                    avatarUrl = await this.storageService.uploadFile('avatars', filename, buffer, 'image/jpeg');
                }
                catch (error) {
                    console.error('Gagal upload gambar google ke supabase', error);
                }
            }
            user = await this.prisma.user.create({
                data: {
                    email: profile.email,
                    name: `${profile.firstName} ${profile.lastName}`.trim(),
                    image: avatarUrl || profile.picture,
                },
            });
        }
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }
    async verifyAndroidToken(idToken) {
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                throw new common_1.UnauthorizedException('Token tidak valid atau tidak memiliki email');
            }
            const mockProfile = {
                email: payload.email,
                firstName: payload.given_name || '',
                lastName: payload.family_name || '',
                picture: payload.picture,
            };
            return this.validateOAuthLogin(mockProfile);
        }
        catch (error) {
            console.error('Verifikasi Token Google Gagal:', error);
            throw new common_1.UnauthorizedException('Gagal memverifikasi token dari Google');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        storage_service_1.StorageService])
], AuthService);
//# sourceMappingURL=auth.service.js.map