import React, { InputHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          className={`w-full px-3 py-2 bg-gray-700 border ${
            error ? 'border-red-500' : 'border-gray-600'
          } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-100 ${className}`}
          {...props}
        />
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;