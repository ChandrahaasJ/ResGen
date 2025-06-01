export interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface LoginFormData {
  username_or_email: string;
  password: string;
}

export interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
  username_or_email?: string;
  general?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  redirectUrl?: string;
  errors?: ValidationErrors;
  token?: string; // JWT token for authenticated requests
}