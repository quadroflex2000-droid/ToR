'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/auth-provider';
import SupplierLayout from '@/components/supplier/supplier-layout';
import Link from 'next/link';
import { 
  DocumentTextIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Proposal {
  id: string;
  opportunityTitle: string;
  clientName: string;
  submittedDate: string;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'under_review' | 'accepted' | 'rejected' | 'expired';
  validUntil: string;
  responseDeadline?: string;
  notes?: string;
  lastUpdated: string;
}

export default function ProposalsPage() {
  const { session } = useSession();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'under_review' | 'accepted' | 'rejected' | 'expired'>('all');

  useEffect(() => {
    // Mock proposals data
    const mockProposals: Proposal[] = [
      {
        id: '1',
        opportunityTitle: 'Modern Office Interior Design & Fit-out',
        clientName: 'TechCorp Solutions',
        submittedDate: '2024-01-22T14:30:00Z',
        totalAmount: 185000,
        currency: 'USD',
        status: 'under_review',
        validUntil: '2024-02-22T14:30:00Z',
        responseDeadline: '2024-02-15T23:59:00Z',
        notes: 'Proposal includes 3D visualization and project management services',
        lastUpdated: '2024-01-25T10:15:00Z'
      },
      {
        id: '2',
        opportunityTitle: 'Luxury Residential Apartment Renovation',
        clientName: 'Private Client',
        submittedDate: '2024-01-26T16:45:00Z',
        totalAmount: 95000,
        currency: 'USD',
        status: 'pending',
        validUntil: '2024-02-26T16:45:00Z',
        responseDeadline: '2024-02-28T23:59:00Z',
        notes: 'Premium package with smart home integration included',
        lastUpdated: '2024-01-26T16:45:00Z'
      },
      {
        id: '3',
        opportunityTitle: 'Restaurant Interior Design - Farm-to-Table Concept',
        clientName: 'Bella Vista Restaurant Group',
        submittedDate: '2024-01-18T09:20:00Z',
        totalAmount: 78000,
        currency: 'USD',
        status: 'accepted',
        validUntil: '2024-02-18T09:20:00Z',
        responseDeadline: '2024-02-10T23:59:00Z',
        notes: 'Sustainable materials and eco-friendly approach emphasized',
        lastUpdated: '2024-01-30T11:22:00Z'
      },
      {
        id: '4',
        opportunityTitle: 'Corporate Headquarters Reception Area',
        clientName: 'Global Finance Corp',
        submittedDate: '2024-01-29T13:15:00Z',
        totalAmount: 52000,
        currency: 'USD',
        status: 'rejected',
        validUntil: '2024-02-28T13:15:00Z',
        responseDeadline: '2024-03-01T23:59:00Z',
        notes: 'Alternative proposal with phased approach',
        lastUpdated: '2024-01-31T15:45:00Z'
      },
      {
        id: '5',
        opportunityTitle: 'Hotel Lobby Renovation Project',
        clientName: 'Grand Hotel Chain',
        submittedDate: '2024-01-10T11:30:00Z',
        totalAmount: 125000,
        currency: 'USD',
        status: 'expired',
        validUntil: '2024-01-20T11:30:00Z',
        responseDeadline: '2024-01-15T23:59:00Z',
        notes: 'Comprehensive renovation with luxury finishes',
        lastUpdated: '2024-01-20T11:30:00Z'
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

  const getStatusIcon = (status: Proposal['status']) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'under_review':
        return <EyeIcon className="w-5 h-5 text-blue-500" />;
      case 'accepted':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'expired':
        return <ExclamationTriangleIcon className="w-5 h-5 text-gray-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpiringSoon = (validUntil: string) => {
    const now = new Date();
    const expiry = new Date(validUntil);
    const diffInDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays <= 3 && diffInDays > 0;
  };

  if (!session.user) {
    return <div>Loading...</div>;
  }

  return (
    <SupplierLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Proposals</h1>
            <p className="text-gray-600 mt-2">
              Track your submitted proposals and their current status
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6">
          {(['all', 'pending', 'under_review', 'accepted', 'rejected', 'expired'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'All Proposals' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Proposals List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProposals.map((proposal) => (
              <div key={proposal.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(proposal.status)}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {proposal.opportunityTitle}
                        </h3>
                        {isExpiringSoon(proposal.validUntil) && proposal.status === 'pending' && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                            Expiring Soon
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">Client: {proposal.clientName}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(proposal.status)}`}>
                        {proposal.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        {formatCurrency(proposal.totalAmount, proposal.currency)}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Submitted: {formatDate(proposal.submittedDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>Valid until: {formatDate(proposal.validUntil)}</span>
                    </div>
                    {proposal.responseDeadline && (
                      <div className="flex items-center space-x-2">
                        <ExclamationTriangleIcon className="w-4 h-4" />
                        <span>Response by: {formatDate(proposal.responseDeadline)}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {proposal.notes && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">{proposal.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Last updated: {formatDate(proposal.lastUpdated)}
                    </p>
                    <div className="flex space-x-3">
                      <Link
                        href={`/supplier/proposals/${proposal.id}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <EyeIcon className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                      {proposal.status === 'pending' && (
                        <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                          <DocumentTextIcon className="w-4 h-4 mr-2" />
                          Edit Proposal
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProposals.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? "You haven't submitted any proposals yet." 
                : `No proposals with status "${filter.replace('_', ' ')}".`}
            </p>
            <Link
              href="/supplier/opportunities"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Browse Opportunities
            </Link>
          </div>
        )}
      </div>
    </SupplierLayout>
  );
}