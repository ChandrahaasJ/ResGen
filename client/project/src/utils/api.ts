import { SignupFormData, LoginFormData, AuthResponse } from '../types/auth';

// Fetch CSRF token
const fetchCSRFToken = async (): Promise<string> => {
  try {
    const response = await fetch('http://localhost:3000/api/csrf-token', {
      credentials: 'include',
    });
    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    return '';
  }
};

export const getCSRFToken = async (): Promise<string> => {
  return await fetchCSRFToken();
};

export const signupUser = async (formData: SignupFormData): Promise<AuthResponse> => {
  try {
    const csrfToken = await getCSRFToken();
    const response = await fetch('http://localhost:3000/signup/resGen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
      },
      body: JSON.stringify(formData),
      credentials: 'include',
    });

    const data: AuthResponse = await response.json();

    // Save JWT token if present
    if (data.success && data.token) {
      localStorage.setItem('jwtToken', data.token);
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
};

export const loginUser = async (formData: LoginFormData): Promise<AuthResponse> => {
  try {
    const csrfToken = await getCSRFToken();
    const response = await fetch('http://localhost:3000/login/resGen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
      },
      body: JSON.stringify(formData),
      credentials: 'include',
    });

    const data: AuthResponse = await response.json();

    // Save JWT token if present
    if (data.success && data.token) {
      localStorage.setItem('jwtToken', data.token);
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
};
