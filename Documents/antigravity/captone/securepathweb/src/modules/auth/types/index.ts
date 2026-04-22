export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        fullName: string;
    };
}

export interface AuthError {
    message: string;
    status: number;
}