export interface User{
    id?: number;
    name: string;
    email: string;
    password: string;
    confirm?: string;
    role: string;
    phone?: string;
    address?: string;
    regDate?: string;
    lastLogin?: string;
    status?: boolean;
}