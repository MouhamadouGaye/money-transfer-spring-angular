export interface User {
  id: number;
  username: string;
  email: string;
  balance: number;
  phoneNumber?: number;
  createdAt?: string; // ISO date string
  currency?: 'USD' | 'XOF' | 'EUR';
}
