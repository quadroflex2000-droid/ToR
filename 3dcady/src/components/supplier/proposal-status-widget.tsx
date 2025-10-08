'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon 
} from '@heroicons/react/24/outline';

interface Proposal {
  id: string;
  projectName: string;
  category: string;
  amount: number;
  currency: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'accepted' | 'rejected';
  submittedDate?: string;
  reviewedDate?: string;
  clientFeedback?: string;
}

export default function ProposalStatusWidget() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockProposals: Proposal[] = [
      {
        id: '1',
        projectName: 'Hotel Furniture',
        category: 'Furniture',
        amount: 85000,
        currency: 'USD',
        status: 'submitted',
        submittedDate: '2024-10-07',
      },
      {
        id: '2',
        projectName: 'Office Lighting',
        category: 'Lighting',
        amount: 32000,
        currency: 'USD',
        status: 'reviewed',
        submittedDate: '2024-10-05',
        reviewedDate: '2024-10-07',
      },
      {
        id: '3',
        projectName: 'Residential Materials',
        category: 'Finishing Materials',
        amount: 45000,
        currency: 'USD',
        status: 'accepted',
        submittedDate: '2024-10-03',
        reviewedDate: '2024-10-06',
        clientFeedback: 'Excellent proposal with competitive pricing.',
      },
      {
        id: '4',
        projectName: 'Retail Fixtures',
        category: 'Furniture',
        amount: 28000,
        currency: 'USD',
        status: 'draft',
      },
    ];

    setTimeout(() => {
      setProposals(mockProposals);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusConfig = (status: string) => {
    const configs = {
      draft: {
        color: 'bg-gray-100 text-gray-800',
        icon: DocumentTextIcon,
        label: 'Draft',
      },
      submitted: {
        color: 'bg-blue-100 text-blue-800',
        icon: ClockIcon,
        label: 'Submitted',
      },
      reviewed: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: EyeIcon,
        label: 'Under Review',
      },
      accepted: {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircleIcon,
        label: 'Accepted',
      },
      rejected: {
        color: 'bg-red-100 text-red-800',
        icon: XCircleIcon,
        label: 'Rejected',
      },
    };
    return configs[status as keyof typeof configs] || configs.draft;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Group proposals by status for Kanban-style display
  const groupedProposals = proposals.reduce((acc, proposal) => {
    if (!acc[proposal.status]) {
      acc[proposal.status] = [];
    }
    acc[proposal.status].push(proposal);
    return acc;
  }, {} as Record<string, Proposal[]>);

  const statusOrder = ['draft', 'submitted', 'reviewed', 'accepted', 'rejected'];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Proposal Status</h3>
        <DocumentTextIcon className="w-6 h-6 text-gray-400" />
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-xl font-bold text-blue-600">
            {(groupedProposals.submitted || []).length}
          </div>
          <div className="text-xs text-gray-500">Pending</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-green-600">
            {(groupedProposals.accepted || []).length}
          </div>
          <div className="text-xs text-gray-500">Accepted</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-600">
            {(groupedProposals.draft || []).length}
          </div>
          <div className="text-xs text-gray-500">Drafts</div>
        </div>
      </div>

      {/* Recent Proposals */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 text-sm">Recent Activity</h4>
        {proposals.slice(0, 4).map((proposal) => {
          const statusConfig = getStatusConfig(proposal.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div
              key={proposal.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <StatusIcon className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{proposal.projectName}</p>
                  <p className="text-xs text-gray-500">{proposal.category}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(proposal.amount, proposal.currency)}
                </p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          View All Proposals
        </button>
      </div>
    </div>
  );
}