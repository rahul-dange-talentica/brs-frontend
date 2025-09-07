import { User } from './common';

// Auth types moved to api.ts to avoid duplication

export interface AuthResponse {
  user: User;
  message: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
