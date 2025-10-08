'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/auth-provider';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import Link from 'next/link';
import NewProjectModal, { ProjectFormData } from '@/components/modals/new-project-modal';
import { 
  PlusIcon, 
  FolderIcon, 
  CalendarIcon, 
  UserIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  budgetPlanned: number;
  budgetActual: number;
  deadline: string;
  clientName: string;
  progress: number;
  createdAt: string;
}

export default function ProjectsPage() {
  const { session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'planning' | 'in-progress' | 'completed' | 'on-hold'>('all');
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    // Mock projects data
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Modern Office Renovation',
        description: 'Complete renovation of corporate office space with modern design elements',
        status: 'in-progress',
        budgetPlanned: 85000,
        budgetActual: 62000,
        deadline: '2024-03-15',
        clientName: 'TechCorp Solutions',
        progress: 65,
        createdAt: '2024-01-10'
      },
      {
        id: '2',
        name: 'Luxury Apartment Design',
        description: 'High-end interior design for luxury apartment complex',
        status: 'planning',
        budgetPlanned: 120000,
        budgetActual: 0,
        deadline: '2024-06-30',
        clientName: 'Premium Living LLC',
        progress: 15,
        createdAt: '2024-02-01'
      },
      {
        id: '3',
        name: 'Restaurant Interior',
        description: 'Contemporary restaurant design with custom furniture',
        status: 'completed',
        budgetPlanned: 45000,
        budgetActual: 43500,
        deadline: '2024-01-30',
        clientName: 'Bella Vista Restaurant',
        progress: 100,
        createdAt: '2023-11-15'
      }
    ];

    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.status === filter);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on-hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleNewProject = (formData: ProjectFormData) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      status: formData.status,
      budgetPlanned: formData.budgetPlanned,
      budgetActual: 0,
      deadline: formData.deadline,
      clientName: formData.clientName,
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setProjects(prev => [newProject, ...prev]);
  };

  if (!session.user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-2">
              Manage your interior design projects and track progress
            </p>
          </div>
          <button 
            onClick={() => setShowNewModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Project</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6">
          {(['all', 'planning', 'in-progress', 'completed', 'on-hold'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'All Projects' : status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer">
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <FolderIcon className="w-8 h-8 text-primary-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Project Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="w-4 h-4" />
                      <span>{project.clientName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CurrencyDollarIcon className="w-4 h-4" />
                      <span>{formatCurrency(project.budgetPlanned)} budget</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Due {formatDate(project.deadline)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>Created {formatDate(project.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FolderIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? "You haven't created any projects yet." 
                : `No projects with status "${filter}".`}
            </p>
            <button 
              onClick={() => setShowNewModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 mx-auto transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create Your First Project</span>
            </button>
          </div>
        )}      </div>
      
      {/* New Project Modal */}
      <NewProjectModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSubmit={handleNewProject}
      />
    </DashboardLayout>
  );
}