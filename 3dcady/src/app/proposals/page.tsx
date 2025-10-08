'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/auth-provider';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import Link from 'next/link';
import NewProposalModal, { ProposalFormData } from '@/components/modals/new-proposal-modal';
import { 
  PlusIcon, 
  ShoppingBagIcon, 
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface Proposal {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  supplierId: string;
  supplierName: string;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  submittedAt: string;
  validUntil: string;
  itemsCount: number;
  category: 'furniture' | 'lighting' | 'materials' | 'fixtures' | 'mixed';
}

export default function ProposalsPage() {
  const { session } = useSession();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Proposal['status']>('all');
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    // Mock proposals data
    const mockProposals: Proposal[] = [
      {
        id: '1',
        title: 'Office Furniture Complete Set',
        description: 'Comprehensive furniture proposal including ergonomic chairs, adjustable desks, and storage solutions',
        projectId: '1',
        projectName: 'Modern Office Renovation',
        supplierId: 'sup1',
        supplierName: 'Elite Office Solutions',
        totalAmount: 45000,
        status: 'pending',
        submittedAt: '2024-02-10',
        validUntil: '2024-03-10',
        itemsCount: 25,
        category: 'furniture'
      },
      {
        id: '2',
        title: 'LED Lighting System',
        description: 'Smart LED lighting system with automated controls and energy-efficient solutions',
        projectId: '1',
        projectName: 'Modern Office Renovation',
        supplierId: 'sup2',
        supplierName: 'BrightTech Lighting',
        totalAmount: 18500,
        status: 'accepted',
        submittedAt: '2024-02-05',
        validUntil: '2024-03-05',
        itemsCount: 12,
        category: 'lighting'
      },
      {
        id: '3',
        title: 'Premium Flooring Materials',
        description: 'High-quality hardwood and marble flooring materials for luxury apartment project',
        projectId: '2',
        projectName: 'Luxury Apartment Design',
        supplierId: 'sup3',
        supplierName: 'Luxury Materials Co.',
        totalAmount: 32000,
        status: 'pending',
        submittedAt: '2024-02-08',
        validUntil: '2024-03-08',
        itemsCount: 8,
        category: 'materials'
      },
      {
        id: '4',
        title: 'Restaurant Fixtures Package',
        description: 'Complete fixture package including custom lighting, seating, and decorative elements',
        projectId: '3',
        projectName: 'Restaurant Interior',
        supplierId: 'sup4',
        supplierName: 'Commercial Interiors Ltd',
        totalAmount: 22000,
        status: 'rejected',
        submittedAt: '2024-01-20',
        validUntil: '2024-02-20',
        itemsCount: 15,
        category: 'mixed'
      },
      {
        id: '5',
        title: 'Bathroom Fixtures Set',
        description: 'Modern bathroom fixtures with water-saving technology and contemporary design',
        projectId: '2',
        projectName: 'Luxury Apartment Design',
        supplierId: 'sup5',
        supplierName: 'AquaDesign Pro',
        totalAmount: 15500,
        status: 'expired',
        submittedAt: '2024-01-15',
        validUntil: '2024-02-15',
        itemsCount: 6,
        category: 'fixtures'
      }
    ];

    setTimeout(() => {
      setProposals(mockProposals);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProposals = filter === 'all' 
    ? proposals 
    : proposals.filter(proposal => proposal.status === filter);

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Proposal['status']) => {
    switch (status) {
      case 'pending': return <ClockIcon className="w-4 h-4" />;
      case 'accepted': return <CheckCircleIcon className="w-4 h-4" />;
      case 'rejected': return <XCircleIcon className="w-4 h-4" />;
      case 'expired': return <XCircleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
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

  const isExpiringSoon = (validUntil: string) => {
    const today = new Date();
    const expiry = new Date(validUntil);
    const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysLeft <= 7 && daysLeft > 0;
  };

  const handleNewProposal = (formData: ProposalFormData) => {
    const newProposal: Proposal = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      projectId: '1',
      projectName: formData.projectName,
      supplierId: '1',
      supplierName: formData.supplierName || 'Selected Supplier',
      totalAmount: formData.totalAmount,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0],
      validUntil: formData.validUntil,
      itemsCount: 1,
      category: formData.category
    };
    
    setProposals(prev => [newProposal, ...prev]);
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
            <h1 className="text-3xl font-bold text-gray-900">Proposals</h1>
            <p className="text-gray-600 mt-2">
              Review and manage proposals from suppliers for your projects
            </p>
          </div>
          <button 
            onClick={() => setShowNewModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Request Proposal</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6">
          {(['all', 'pending', 'accepted', 'rejected', 'expired'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'All Proposals' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Proposals List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="flex space-x-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProposals.map((proposal) => (
              <div key={proposal.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start space-x-4 mb-3">
                      <ShoppingBagIcon className="w-8 h-8 text-primary-600 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{proposal.title}</h3>
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                            {getStatusIcon(proposal.status)}
                            <span>{proposal.status}</span>
                          </span>
                          {isExpiringSoon(proposal.validUntil) && proposal.status === 'pending' && (
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              Expires Soon
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4">{proposal.description}</p>

                        {/* Meta Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <UserIcon className="w-4 h-4" />
                            <span>{proposal.supplierName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CurrencyDollarIcon className="w-4 h-4" />
                            <span className="font-medium text-gray-900">{formatCurrency(proposal.totalAmount)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>Valid until {formatDate(proposal.validUntil)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ShoppingBagIcon className="w-4 h-4" />
                            <span>{proposal.itemsCount} items</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    {proposal.status === 'pending' && (
                      <>
                        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors">
                          Accept
                        </button>
                        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors">
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProposals.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? "You haven't received any proposals yet." 
                : `No proposals with status "${filter}".`}
            </p>
            <button 
              onClick={() => setShowNewModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 mx-auto transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Request Your First Proposal</span>
            </button>
          </div>
        )}      </div>
      
      {/* New Proposal Modal */}
      <NewProposalModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSubmit={handleNewProposal}
      />
    </DashboardLayout>
  );
}