import { ValidationErrors, SignupFormData, LoginFormData } from '../types/auth';

export const validatePassword = (password: string): boolean => {
  // Min 8 chars, 1 number, 1 special character
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  return passwordRegex.test(password);
};

export const validateSignupForm = (formData: SignupFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Username validation
  if (!formData.username.trim()) {
    errors.username = 'Username is required';
  } else if (formData.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }

  // Email validation
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Email is invalid';
  }

  // Password validation
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 8 characters with 1 number and 1 special character';
  }

  // Confirm password validation
  if (!formData.confirm_password) {
    errors.confirm_password = 'Please confirm your password';
  } else if (formData.password !== formData.confirm_password) {
    errors.confirm_password = 'Passwords do not match';
  }

  return errors;
};

export const validateLoginForm = (formData: LoginFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!formData.username_or_email.trim()) {
    errors.username_or_email = 'Username or email is required';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  }

  return errors;
};