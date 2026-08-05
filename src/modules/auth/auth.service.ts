import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/modules/storage/storage.service';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly storageService: StorageService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar. Silakan login.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
      },
    });

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      message: 'Registrasi Berhasil',
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    if (!user.password) {
      throw new UnauthorizedException('Akun ini didaftarkan menggunakan Google. Silakan login menggunakan Google.');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      message: 'Login Berhasil',
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async validateOAuthLogin(profile: any) {
    let user = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (!user) {
      let avatarUrl: string | null = null;
      if (profile.picture) {
        try {
          const response = await fetch(profile.picture);
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const filename = `profiles/${profile.email.replace(/[@.]/g, '_')}_${Date.now()}.jpg`;
          
          // Mengunggah gambar profil asli Google ke Supabase Storage
          avatarUrl = await this.storageService.uploadFile('avatars', filename, buffer, 'image/jpeg');
        } catch (error) {
          console.error('Gagal upload gambar google ke supabase', error);
        }
      }

      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          name: `${profile.firstName} ${profile.lastName}`.trim(),
          image: avatarUrl || profile.picture, // Fallback ke URL asli jika upload gagal
        },
      });
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async verifyAndroidToken(idToken: string) {
    try {
      // Verifikasi token dengan Google Server
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID, 
      });
      
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Token tidak valid atau tidak memiliki email');
      }

      // Gunakan logika yang sama seperti validateOAuthLogin untuk menyimpan user
      const mockProfile = {
        email: payload.email,
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        picture: payload.picture,
      };

      return this.validateOAuthLogin(mockProfile);
    } catch (error) {
      console.error('Verifikasi Token Google Gagal:', error);
      throw new UnauthorizedException('Gagal memverifikasi token dari Google');
    }
  }
}
