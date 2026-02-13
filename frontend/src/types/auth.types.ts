export interface SignUpData {
  email: string;
  name: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface User {
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
}
