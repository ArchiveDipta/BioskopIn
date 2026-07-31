import { AuthService } from './auth.service';
import { VerifyGoogleDto } from './dto/verify-google.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    verifyAndroidToken(verifyGoogleDto: VerifyGoogleDto): Promise<{
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
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: any): Promise<any>;
}
