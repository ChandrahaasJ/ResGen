import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import CreateSchema from './pages/CreateSchema';
import AppendSchema from './pages/AppendSchema';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-schema" element={<CreateSchema />} />
        <Route path="/append-schema" element={<AppendSchema />} />
        <Route path="/" element={<Navigate to="/login\" replace />} />
      </Routes>
    </Router>
  );
}

export default App;