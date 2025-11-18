export interface User {
  id?: number | undefined;
  name: string;
  email: string;
  password: string;
  confirm?: string;
  phone?: string;
  address?: string;
  role: string;
  reg?: string;
  last?: string;
  status: boolean;
}
