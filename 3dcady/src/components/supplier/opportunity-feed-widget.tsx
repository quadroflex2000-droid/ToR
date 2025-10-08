'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  CurrencyDollarIcon, 
  ClockIcon,
  MapPinIcon,
  TagIcon 
} from '@heroicons/react/24/outline';

interface Opportunity {
  id: string;
  projectTitle: string;
  category: string;
  budgetRange?: {
    min: number;
    max: number;
    currency: string;
  };
  location: string;
  deadline: string;
  postedDate: string;
  description: string;
  isAnonymized: boolean;
  tags: string[];
}

export default function OpportunityFeedWidget() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    budgetRange: '',
    location: '',
  });

  useEffect(() => {
    // Mock data
    const mockOpportunities: Opportunity[] = [
      {
        id: '1',
        projectTitle: 'Luxury Hotel Furniture Package',
        category: 'Furniture',
        budgetRange: {
          min: 80000,
          max: 120000,
          currency: 'USD',
        },
        location: 'New York, NY',
        deadline: '2024-10-20',
        postedDate: '2024-10-08',
        description: 'High-end furniture for 50-room boutique hotel. Seeking contemporary pieces with premium finishes.',
        isAnonymized: false,
        tags: ['luxury', 'contemporary', 'hotel'],
      },
      {
        id: '2',
        projectTitle: 'Office Lighting System',
        category: 'Lighting',
        budgetRange: {
          min: 25000,
          max: 40000,
          currency: 'USD',
        },
        location: 'San Francisco, CA',
        deadline: '2024-10-15',
        postedDate: '2024-10-07',
        description: 'LED lighting system for 10,000 sq ft office space. Energy efficiency and smart controls required.',
        isAnonymized: true,
        tags: ['LED', 'smart', 'energy-efficient'],
      },
      {
        id: '3',
        projectTitle: 'Residential Finishing Materials',
        category: 'Finishing Materials',
        location: 'Austin, TX',
        deadline: '2024-10-25',
        postedDate: '2024-10-06',
        description: 'Premium flooring, wall finishes, and trim for luxury residential project.',
        isAnonymized: true,
        tags: ['residential', 'luxury', 'flooring'],
      },
    ];

    setTimeout(() => {
      setOpportunities(mockOpportunities);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Furniture': 'bg-blue-100 text-blue-800',
      'Lighting': 'bg-yellow-100 text-yellow-800',
      'Finishing Materials': 'bg-green-100 text-green-800',
      'Plumbing': 'bg-purple-100 text-purple-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Opportunity Feed</h3>
        <Link
          href="/supplier/opportunities"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all opportunities
        </Link>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">All Categories</option>
          <option value="furniture">Furniture</option>
          <option value="lighting">Lighting</option>
          <option value="materials">Finishing Materials</option>
          <option value="plumbing">Plumbing</option>
        </select>
        
        <select
          value={filters.budgetRange}
          onChange={(e) => setFilters(prev => ({ ...prev, budgetRange: e.target.value }))}
          className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Any Budget</option>
          <option value="0-25000">$0 - $25K</option>
          <option value="25000-50000">$25K - $50K</option>
          <option value="50000-100000">$50K - $100K</option>
          <option value="100000+">$100K+</option>
        </select>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {opportunities.map((opportunity) => {
          const daysLeft = getDaysUntilDeadline(opportunity.deadline);
          return (
            <div
              key={opportunity.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900">
                      {opportunity.isAnonymized ? 'Project #' + opportunity.id : opportunity.projectTitle}
                    </h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(opportunity.category)}`}>
                      {opportunity.category}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{opportunity.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    {opportunity.budgetRange && (
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                        <span>
                          {formatCurrency(opportunity.budgetRange.min, opportunity.budgetRange.currency)} - 
                          {formatCurrency(opportunity.budgetRange.max, opportunity.budgetRange.currency)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      <span>{opportunity.location}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      <span className={daysLeft <= 3 ? 'text-red-600' : ''}>
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {opportunity.tags.length > 0 && (
                    <div className="flex items-center mt-3">
                      <TagIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <div className="flex flex-wrap gap-1">
                        {opportunity.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Posted {new Date(opportunity.postedDate).toLocaleDateString()}
                </span>
                <Link
                  href={`/supplier/opportunities/${opportunity.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  View & Submit Proposal
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {opportunities.length === 0 && (
        <div className="text-center py-8">
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No opportunities found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Adjust your filters or check back later for new opportunities.
          </p>
        </div>
      )}
    </div>
  );
}