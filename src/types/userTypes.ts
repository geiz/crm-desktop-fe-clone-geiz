import { Role } from './common';
import { JwtPayload } from 'jwt-decode';

export interface User {
    id: number;
    companyId: number;
    role: Role;
    email: string;
    type: string;
    name: string;
}

export interface UserJwtPayload extends JwtPayload {
    sub: string; // User email
    userId: number;
    role: Role;
    companyId: number;
    type: string; // ex."ACCESS"
    name: string;
    timezone: string;
}

export interface ConfirmInviteResponse {
    accessToken: string;
    userId: number;
    role: Role;
    companyId: number;
    username: string; // email
}
