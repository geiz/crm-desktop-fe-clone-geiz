import { Role } from 'types/common';

export interface AuthParams {
    email?: string;
    password?: string;
    token?: string;
}

export interface LoginResponse {
    accessToken: string;
    userId: number;
    companyId: number;
    role: Role;
    username: string;
    timezone: string;
}

export interface RefreshResponse {
    accessToken: string;
}

export interface LoginFormValues {
    email: string;
    password: string;
}

export interface RecoveryFormValues {
    password: string;
    confirmpassword: string;
}
