import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileSpreadsheet, ChevronDown } from 'lucide-react';
import Button from '../components/Button';
import { getCSRFToken } from '../utils/api';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [hasSchema, setHasSchema] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const csrfToken = await getCSRFToken();
        const response = await fetch('http://localhost:3000/api/user', {
          headers: {
            'CSRF-Token': csrfToken
          },
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setUsername(data.user.username);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchSchemaStatus = async () => {
      try {
        const csrfToken = await getCSRFToken();
        const response = await fetch('http://localhost:3000/api/schema-status', {
          headers: {
            'CSRF-Token': csrfToken
          },
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setHasSchema(data.hasSchema);
        }
      } catch (error) {
        console.error('Error fetching schema status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchSchemaStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const csrfToken = await getCSRFToken();
      await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        headers: {
          'CSRF-Token': csrfToken
        },
        credentials: 'include'
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-400">Resgen</h1>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-gray-100 transition-colors"
              >
                <span>{username}</span>
                <ChevronDown size={16} className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 border border-gray-600">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-gray-100">Memory Management</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              </div>
            ) : hasSchema ? (
              <Button
                variant="primary"
                onClick={() => navigate('/append-schema')}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <FileSpreadsheet size={20} />
                Append Schema
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => navigate('/create-schema')}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus size={20} />
                Create Global Schema
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;