import { JwtService } from '@nestjs/jwt';
import { PrismaService } from "../../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly storageService;
    private googleClient;
    constructor(prisma: PrismaService, jwtService: JwtService, storageService: StorageService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        access_token: string;
        user: {
            id: string;
            name: string | null;
            email: string | null;
            emailVerified: Date | null;
            image: string | null;
            password: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        access_token: string;
        user: {
            id: string;
            name: string | null;
            email: string | null;
            emailVerified: Date | null;
            image: string | null;
            password: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    validateOAuthLogin(profile: any): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string | null;
            email: string | null;
            emailVerified: Date | null;
            image: string | null;
            password: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    verifyAndroidToken(idToken: string): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string | null;
            email: string | null;
            emailVerified: Date | null;
            image: string | null;
            password: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
}
