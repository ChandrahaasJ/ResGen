import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, X, ChevronDown } from 'lucide-react';
import Button from '../components/Button';
import InputField from '../components/InputField';

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

const AppendSchema: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'projects' | 'achievements' | 'certifications' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([{ id: '1', title: '', githubLink: '' }]);
  const [achievements, setAchievements] = useState<Achievement[]>([{ id: '1', description: '' }]);
  const [certifications, setCertifications] = useState<Certification[]>([{ id: '1', title: '', file: null }]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState<string>('');
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
      const formData = new FormData();
      let header = '';

      switch (activeSection) {
        case 'projects':
          formData.append('projects', JSON.stringify(projects));
          header = 'Proj';
          break;
        case 'achievements':
          formData.append('achievements', JSON.stringify(achievements));
          header = 'Ache';
          break;
        case 'certifications':
          certifications.forEach((cert) => {
            if (cert.file) {
              formData.append('certifications', cert.file);
            }
            formData.append('certification_titles', cert.title);
          });
          header = 'Cert';
          break;
      }

      const response = await fetch('http://localhost:3000/appendSchema', {
        method: 'POST',
        headers: {
          'Schema-Type': header,
        },
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        alert('Schema updated successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error appending schema:', error);
      alert('Failed to update schema. Please try again.');
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
          <h1 className="text-2xl font-bold text-gray-100 mb-6">Append Schema</h1>

          {!activeSection ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => setActiveSection('projects')}
                className="h-32 flex flex-col items-center justify-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Plus size={24} />
                Add Projects
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveSection('achievements')}
                className="h-32 flex flex-col items-center justify-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Plus size={24} />
                Add Achievements
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveSection('certifications')}
                className="h-32 flex flex-col items-center justify-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Plus size={24} />
                Add Certifications
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {activeSection === 'projects' && (
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
                          className="bg-gray-700 text-gray-100 border-gray-600"
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
                          className="bg-gray-700 text-gray-100 border-gray-600"
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
              )}

              {activeSection === 'achievements' && (
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
              )}

              {activeSection === 'certifications' && (
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
                          className="bg-gray-700 text-gray-100 border-gray-600"
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
              )}

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveSection(null)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Submit
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppendSchema;