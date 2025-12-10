import { ConfigService } from '@nestjs/config';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { SessionClaimsResponseDto } from './dto/session-claims-response.dto';
export declare class AuthController {
    private configService;
    constructor(configService: ConfigService);
    getProfile(userId: string): Promise<ProfileResponseDto>;
    getSessionClaims(claims: any, user: any): SessionClaimsResponseDto;
}
