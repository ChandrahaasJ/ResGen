import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { UserCircle2 } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700"
      >
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="flex justify-center mb-4">
            <UserCircle2 className="h-12 w-12 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-100 mb-2">{title}</h1>
          <p className="text-gray-400 mb-6">{subtitle}</p>
        </div>

        <div className="px-8 pb-8">
          {children}
        </div>

        <div className="px-8 py-4 bg-gray-900 border-t border-gray-700 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} SecureAuth. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;