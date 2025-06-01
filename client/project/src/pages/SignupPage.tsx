import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { validateSignupForm, validatePassword } from '../utils/validation';
import { signupUser } from '../utils/api';
import { SignupFormData, ValidationErrors } from '../types/auth';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string>('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  const passwordRequirements = [
    { id: 'length', label: 'At least 8 characters', met: formData.password.length >= 8 },
    { id: 'number', label: 'Contains a number', met: /\d/.test(formData.password) },
    { id: 'special', label: 'Contains a special character', met: /[!@#$%^&*]/.test(formData.password) },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    if (name === 'confirm_password' || (name === 'password' && formData.confirm_password)) {
      if (name === 'password' && value !== formData.confirm_password) {
        setErrors(prev => ({ ...prev, confirm_password: 'Passwords do not match' }));
      } else if (name === 'confirm_password' && value !== formData.password) {
        setErrors(prev => ({ ...prev, confirm_password: 'Passwords do not match' }));
      } else {
        setErrors(prev => ({ ...prev, confirm_password: undefined }));
      }
    }

    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateSignupForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setServerError('');
      
      try {
        const response = await signupUser(formData);
        
        if (response.success) {
          navigate(response.redirectUrl || '/login');
        } else {
          if (response.errors) {
            setErrors(response.errors);
          } else {
            setServerError(response.message || 'Signup failed. Please try again.');
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
      title="Create your account"
      subtitle="Join our secure platform today"
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
          id="username"
          name="username"
          label="Username"
          type="text"
          placeholder="Enter a username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          required
          autoComplete="username"
        />

        <InputField
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          autoComplete="email"
        />

        <div className="relative">
          <InputField
            id="password"
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            minLength={8}
            autoComplete="new-password"
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          <button
            type="button"
            className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-300"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {passwordFocused && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-3 bg-gray-700/50 rounded-lg border border-gray-600"
            >
              <h4 className="text-sm font-medium text-gray-200 mb-2">Password must have:</h4>
              <ul className="space-y-1">
                {passwordRequirements.map((req) => (
                  <li key={req.id} className="flex items-center text-sm">
                    {req.met ? (
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-500 mr-2" />
                    )}
                    <span className={req.met ? "text-green-400" : "text-gray-400"}>
                      {req.label}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <InputField
            id="confirm_password"
            name="confirm_password"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData.confirm_password}
            onChange={handleChange}
            error={errors.confirm_password}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-300"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-6"
          isLoading={isSubmitting}
        >
          Create Account
        </Button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;