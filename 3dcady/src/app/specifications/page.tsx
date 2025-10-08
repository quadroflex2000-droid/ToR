'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/auth-provider';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import Link from 'next/link';
import NewSpecificationModal, { SpecificationFormData } from '@/components/modals/new-specification-modal';
import { 
  PlusIcon, 
  DocumentTextIcon, 
  FolderIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface Specification {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  category: 'furniture' | 'lighting' | 'materials' | 'colors' | 'fixtures';
  status: 'draft' | 'pending-approval' | 'approved' | 'rejected';
  items: number;
  createdAt: string;
  updatedAt: string;
}

export default function SpecificationsPage() {
  const { session } = useSession();
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Specification['category']>('all');
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    // Mock specifications data
    const mockSpecifications: Specification[] = [
      {
        id: '1',
        title: 'Office Furniture Specification',
        description: 'Complete furniture specification for modern office renovation including desks, chairs, and storage solutions',
        projectId: '1',
        projectName: 'Modern Office Renovation',
        category: 'furniture',
        status: 'approved',
        items: 25,
        createdAt: '2024-01-15',
        updatedAt: '2024-02-01'
      },
      {
        id: '2',
        title: 'Lighting Design Spec',
        description: 'Detailed lighting specification with LED solutions and smart controls',
        projectId: '1',
        projectName: 'Modern Office Renovation',
        category: 'lighting',
        status: 'pending-approval',
        items: 12,
        createdAt: '2024-01-20',
        updatedAt: '2024-02-05'
      },
      {
        id: '3',
        title: 'Premium Material Selection',
        description: 'Luxury materials specification for apartment renovation project',
        projectId: '2',
        projectName: 'Luxury Apartment Design',
        category: 'materials',
        status: 'draft',
        items: 18,
        createdAt: '2024-02-02',
        updatedAt: '2024-02-08'
      },
      {
        id: '4',
        title: 'Color Palette & Finishes',
        description: 'Complete color scheme and finish specifications for restaurant interior',
        projectId: '3',
        projectName: 'Restaurant Interior',
        category: 'colors',
        status: 'approved',
        items: 8,
        createdAt: '2023-12-01',
        updatedAt: '2024-01-15'
      }
    ];

    setTimeout(() => {
      setSpecifications(mockSpecifications);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredSpecs = filter === 'all' 
    ? specifications 
    : specifications.filter(spec => spec.category === filter);

  const getStatusColor = (status: Specification['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending-approval': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: Specification['category']) => {
    switch (category) {
      case 'furniture': return 'bg-blue-100 text-blue-800';
      case 'lighting': return 'bg-purple-100 text-purple-800';
      case 'materials': return 'bg-orange-100 text-orange-800';
      case 'colors': return 'bg-pink-100 text-pink-800';
      case 'fixtures': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleNewSpecification = (formData: SpecificationFormData) => {
    const newSpec: Specification = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      projectId: '1',
      projectName: formData.projectName,
      category: formData.category,
      status: 'draft',
      items: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    setSpecifications(prev => [newSpec, ...prev]);
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
            <h1 className="text-3xl font-bold text-gray-900">Specifications</h1>
            <p className="text-gray-600 mt-2">
              Create and manage detailed specifications for your projects
            </p>
          </div>
          <button 
            onClick={() => setShowNewModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Specification</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {(['all', 'furniture', 'lighting', 'materials', 'colors', 'fixtures'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                filter === category
                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Specifications List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="flex space-x-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-8 bg-gray-200 rounded w-8"></div>
                    <div className="h-8 bg-gray-200 rounded w-8"></div>
                    <div className="h-8 bg-gray-200 rounded w-8"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSpecs.map((spec) => (
              <div key={spec.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start space-x-4 mb-3">
                      <DocumentTextIcon className="w-8 h-8 text-primary-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{spec.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{spec.description}</p>
                        
                        {/* Tags */}
                        <div className="flex items-center space-x-2 mb-3">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(spec.category)}`}>
                            {spec.category}
                          </span>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(spec.status)}`}>
                            {spec.status.replace('-', ' ')}
                          </span>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <FolderIcon className="w-4 h-4" />
                            <span>{spec.projectName}</span>
                          </div>
                          <span>•</span>
                          <span>{spec.items} items</span>
                          <span>•</span>
                          <span>Updated {formatDate(spec.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredSpecs.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No specifications found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? "You haven't created any specifications yet." 
                : `No specifications in the "${filter}" category.`}
            </p>
            <button 
              onClick={() => setShowNewModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 mx-auto transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create Your First Specification</span>
            </button>
          </div>
        )}      </div>
      
      {/* New Specification Modal */}
      <NewSpecificationModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSubmit={handleNewSpecification}
      />
    </DashboardLayout>
  );
}