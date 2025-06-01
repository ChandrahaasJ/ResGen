import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { validateLoginForm } from '../utils/validation';
import { loginUser } from '../utils/api';
import { LoginFormData, ValidationErrors } from '../types/auth';

// Helper function to validate JWT token expiration
const isTokenValid = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    username_or_email: '',
    password: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string>('');

  // On mount, check if JWT token is in localStorage & valid -> redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token && isTokenValid(token)) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setServerError('');

      try {
        const response = await loginUser(formData);

        if (response.success) {
          // Save JWT token to localStorage
          if (response.token) {
            localStorage.setItem('jwtToken', response.token);
          }
          navigate(response.redirectUrl || '/dashboard');
        } else {
          if (response.errors) {
            setErrors(response.errors);
          } else {
            setServerError(response.message || 'Invalid credentials. Please try again.');
          }
        }
      } catch (error) {
        setServerError('Network error. Please try again later.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <AuthLayout
      title="Resgen"
      subtitle="Log in to your account"
    >
      {serverError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-900/50 border border-red-800 text-red-200 rounded-lg"
        >
          {serverError}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="username_or_email"
          name="username_or_email"
          label="Username or Email"
          type="text"
          placeholder="Enter your username or email"
          value={formData.username_or_email}
          onChange={handleChange}
          error={errors.username_or_email}
          required
          autoComplete="username"
        />

        <div className="relative">
          <InputField
            id="password"
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-300"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-6"
          isLoading={isSubmitting}
        >
          Sign In
        </Button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
