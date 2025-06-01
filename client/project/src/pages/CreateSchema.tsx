import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, X, ChevronDown } from 'lucide-react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { getCSRFToken } from '../utils/api';

interface Project {
  id: string;
  title: string;
  githubLink: string;
}

interface Achievement {
  id: string;
  description: string;
}

interface Certification {
  id: string;
  title: string;
  file: File | null;
}

const CreateSchema: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([{ id: '1', title: '', githubLink: '' }]);
  const [achievements, setAchievements] = useState<Achievement[]>([{ id: '1', description: '' }]);
  const [certifications, setCertifications] = useState<Certification[]>([{ id: '1', title: '', file: null }]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState<string>('');

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user', {
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

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const csrfToken = await getCSRFToken();
      const formData = new FormData();
      formData.append('projects', JSON.stringify(projects));
      formData.append('achievements', JSON.stringify(achievements));
      
      certifications.forEach((cert) => {
        if (cert.file) {
          formData.append('certifications', cert.file);
        }
        formData.append('certification_titles', cert.title);
      });

      const response = await fetch('http://localhost:3000/createSchema', {
        method: 'POST',
        headers: {
          'CSRF-Token': csrfToken,
        },
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        alert('Schema created successfully!');
        navigate('/dashboard');
      } else {
        alert(data.message || 'Failed to create schema');
      }
    } catch (error) {
      console.error('Error creating schema:', error);
      alert('Failed to create schema. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-2xl font-bold text-blue-400">
                Resgen
              </Link>
            </div>
            <div className="relative">
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
          <h1 className="text-2xl font-bold text-gray-100 mb-6">Create Global Schema</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Projects Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-100">Projects</h2>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setProjects([...projects, { id: Date.now().toString(), title: '', githubLink: '' }])}
                  className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Plus size={16} />
                  Add Project
                </Button>
              </div>
              {projects.map((project) => (
                <div key={project.id} className="flex gap-4 items-start">
                  <div className="flex-grow space-y-3">
                    <InputField
                      id={`project-title-${project.id}`}
                      label="Project Title"
                      placeholder="Enter project"
                      value={project.title}
                      onChange={(e) => {
                        setProjects(projects.map(p =>
                          p.id === project.id ? { ...p, title: e.target.value } : p
                        ));
                      }}
                    />
                    <InputField
                      id={`project-github-${project.id}`}
                      label="GitHub Link"
                      placeholder="GitHub link"
                      value={project.githubLink}
                      onChange={(e) => {
                        setProjects(projects.map(p =>
                          p.id === project.id ? { ...p, githubLink: e.target.value } : p
                        ));
                      }}
                    />
                  </div>
                  {projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setProjects(projects.filter(p => p.id !== project.id))}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Certifications Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-100">Certifications</h2>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCertifications([...certifications, { id: Date.now().toString(), title: '', file: null }])}
                  className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Plus size={16} />
                  Add Certification
                </Button>
              </div>
              {certifications.map((cert) => (
                <div key={cert.id} className="flex gap-4 items-start">
                  <div className="flex-grow space-y-3">
                    <InputField
                      id={`cert-title-${cert.id}`}
                      label="Certification Title"
                      placeholder="Certification title"
                      value={cert.title}
                      onChange={(e) => {
                        setCertifications(certifications.map(c =>
                          c.id === cert.id ? { ...c, title: e.target.value } : c
                        ));
                      }}
                    />
                    <input
                      type="file"
                      onChange={(e) => {
                        setCertifications(certifications.map(c =>
                          c.id === cert.id ? { ...c, file: e.target.files?.[0] || null } : c
                        ));
                      }}
                      className="block w-full text-sm text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-gray-700 file:text-gray-300
                        hover:file:bg-gray-600"
                    />
                  </div>
                  {certifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setCertifications(certifications.filter(c => c.id !== cert.id))}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Achievements Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-100">Achievements</h2>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAchievements([...achievements, { id: Date.now().toString(), description: '' }])}
                  className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Plus size={16} />
                  Add Achievement
                </Button>
              </div>
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex gap-4 items-start">
                  <textarea
                    placeholder="Achievement / extra-curricular"
                    value={achievement.description}
                    onChange={(e) => {
                      setAchievements(achievements.map(a =>
                        a.id === achievement.id ? { ...a, description: e.target.value } : a
                      ));
                    }}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[100px] text-gray-100"
                  />
                  {achievements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setAchievements(achievements.filter(a => a.id !== achievement.id))}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              isLoading={isSubmitting}
            >
              Submit Global Schema
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSchema;