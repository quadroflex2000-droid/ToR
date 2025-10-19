'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DocumentTextIcon, BuildingOfficeIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Proposal {
  id: string;
  projectName: string;
  specificationCategory: string;
  supplierName: string;
  totalAmount: number;
  currency: string;
  submittedDate: string;
  deadline: string;
  status: 'new' | 'reviewed' | 'pending';
}

export default function IncomingProposalsWidget() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockProposals: Proposal[] = [
      {
        id: '1',
        projectName: 'Lake House Renovation',
        specificationCategory: 'Furniture',
        supplierName: 'Modern Furnishings Inc.',
        totalAmount: 45000,
        currency: 'USD',
        submittedDate: '2024-10-07',
        deadline: '2024-10-14',
        status: 'new',
      },
      {
        id: '2',
        projectName: 'Downtown Office',
        specificationCategory: 'Lighting',
        supplierName: 'Illumination Solutions',
        totalAmount: 12500,
        currency: 'USD',
        submittedDate: '2024-10-06',
        deadline: '2024-10-13',
        status: 'reviewed',
      },
      {
        id: '3',
        projectName: 'Boutique Hotel',
        specificationCategory: 'Finishing Materials',
        supplierName: 'Premium Materials Co.',
        totalAmount: 78000,
        currency: 'USD',
        submittedDate: '2024-10-05',
        deadline: '2024-10-12',
        status: 'pending',
      },
    ];

    setTimeout(() => {
      setProposals(mockProposals);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-green-100 text-green-800',
      reviewed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Incoming Proposals</h3>
        <Link
          href="/proposals"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {proposals.map((proposal) => {
          const daysLeft = getDaysUntilDeadline(proposal.deadline);
          return (
            <div
              key={proposal.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <Link href={`/proposals/${proposal.id}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{proposal.projectName}</h4>
                      <p className="text-xs text-gray-600">{proposal.specificationCategory}</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(proposal.status)}`}>
                    {proposal.status}
                  </span>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{proposal.supplierName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(proposal.totalAmount, proposal.currency)}
                  </span>
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span className={`text-sm ${daysLeft <= 2 ? 'text-red-600' : 'text-gray-600'}`}>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {proposals.length === 0 && (
        <div className="text-center py-8">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No proposals</h3>
          <p className="mt-1 text-sm text-gray-500">New proposals will appear here.</p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link
          href="/proposals/compare"
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Compare Proposals
        </Link>
      </div>
    </div>
  );
}