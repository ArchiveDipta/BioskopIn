import { Controller, Get, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VerifyGoogleDto } from './dto/verify-google.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Mendaftar menggunakan Email dan Password' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login menggunakan Email dan Password' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('google/android')
  @ApiOperation({ summary: 'Endpoint khusus aplikasi Native Android untuk mengirimkan Google ID Token' })
  async verifyAndroidToken(@Body() verifyGoogleDto: VerifyGoogleDto) {
    return this.authService.verifyAndroidToken(verifyGoogleDto.idToken);
  }

  @Get('google')
  @ApiOperation({ summary: 'Login menggunakan Google (Web)' })
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Rute ini akan otomatis me-redirect pengguna ke halaman login Google
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Callback dari Google (Jangan dipanggil manual)' })
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    // req.user sudah berisi hasil dari validateOAuthLogin() yang dipanggil di google.strategy.ts
    return res.json({
      message: 'Login Berhasil',
      ...req.user,
    });
  }
}
