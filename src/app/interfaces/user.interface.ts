export interface User {
  id: number;
  username: string;
  password: string;
  passwordConfirm: string;
  email: string;
  subscribe: boolean;
  country: string;
  city: string;
}
