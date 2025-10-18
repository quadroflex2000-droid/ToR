'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/auth-provider';
import SupplierLayout from '@/components/supplier/supplier-layout';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  EyeIcon,
  DocumentTextIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface Opportunity {
  id: string;
  title: string;
  clientName: string;
  location: string;
  category: string;
  budgetRange: string;
  deadline: string;
  description: string;
  requirements: string[];
  status: 'open' | 'closing_soon' | 'closed';
  postedDate: string;
  responseCount: number;
  estimatedValue: number;
}

export default function OpportunitiesPage() {
  const { session } = useSession();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    budgetRange: '',
    status: 'open' as const
  });

  useEffect(() => {
    // Mock opportunities data
    const mockOpportunities: Opportunity[] = [
      {
        id: '1',
        title: 'Modern Office Interior Design & Fit-out',
        clientName: 'TechCorp Solutions',
        location: 'New York, NY',
        category: 'Commercial',
        budgetRange: '$150K - $200K',
        deadline: '2024-02-15',
        description: 'Complete interior design and fit-out for 5,000 sq ft modern office space. Looking for contemporary design with focus on collaboration spaces and employee wellness.',
        requirements: ['Commercial design experience', 'LEED certification preferred', 'Full project management', '3D visualization'],
        status: 'open',
        postedDate: '2024-01-20',
        responseCount: 8,
        estimatedValue: 175000
      },
      {
        id: '2',
        title: 'Luxury Residential Apartment Renovation',
        clientName: 'Private Client',
        location: 'Los Angeles, CA',
        category: 'Residential',
        budgetRange: '$80K - $120K',
        deadline: '2024-02-28',
        description: 'High-end renovation of 2,500 sq ft luxury apartment. Modern aesthetic with premium finishes and smart home integration.',
        requirements: ['Luxury residential experience', 'Premium material sourcing', 'Smart home integration', 'Timeline: 12 weeks'],
        status: 'open',
        postedDate: '2024-01-25',
        responseCount: 12,
        estimatedValue: 100000
      },
      {
        id: '3',
        title: 'Restaurant Interior Design - Farm-to-Table Concept',
        clientName: 'Bella Vista Restaurant Group',
        location: 'Chicago, IL',
        category: 'Hospitality',
        budgetRange: '$60K - $90K',
        deadline: '2024-02-10',
        description: 'Design and fit-out for 3,000 sq ft farm-to-table restaurant. Rustic-modern aesthetic with emphasis on natural materials.',
        requirements: ['Restaurant design experience', 'Natural material expertise', 'Code compliance knowledge', 'Sustainability focus'],
        status: 'closing_soon',
        postedDate: '2024-01-15',
        responseCount: 15,
        estimatedValue: 75000
      },
      {
        id: '4',
        title: 'Corporate Headquarters Reception Area',
        clientName: 'Global Finance Corp',
        location: 'Miami, FL',
        category: 'Commercial',
        budgetRange: '$40K - $60K',
        deadline: '2024-03-01',
        description: 'Redesign of executive reception area and waiting lounge. Professional, welcoming atmosphere that reflects company values.',
        requirements: ['Corporate design experience', 'High-end finishes', 'Brand integration', 'Fast track delivery'],
        status: 'open',
        postedDate: '2024-01-28',
        responseCount: 6,
        estimatedValue: 50000
      }
    ];

    setTimeout(() => {
      setOpportunities(mockOpportunities);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredOpportunities = opportunities.filter(opp => {
    if (searchQuery && !opp.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !opp.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filters.category && opp.category !== filters.category) {
      return false;
    }
    
    if (filters.status && opp.status !== filters.status) {
      return false;
    }
    
    return true;
  });

  const getStatusBadge = (status: Opportunity['status']) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closing_soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
            <h1 className="text-3xl font-bold text-gray-900">Project Opportunities</h1>
            <p className="text-gray-600 mt-2">
              Discover new projects and submit competitive proposals
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Categories</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="closing_soon">Closing Soon</option>
              </select>
            </div>
          </div>
        </div>

        {/* Opportunities Grid */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {opportunity.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {opportunity.location}
                        </span>
                        <span className="flex items-center">
                          <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                          {opportunity.budgetRange}
                        </span>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(opportunity.status)}`}>
                      {opportunity.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {opportunity.description}
                  </p>

                  {/* Requirements */}
                  {opportunity.requirements.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Key Requirements:</h4>
                      <div className="flex flex-wrap gap-2">
                        {opportunity.requirements.slice(0, 3).map((req, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
                          >
                            {req}
                          </span>
                        ))}
                        {opportunity.requirements.length > 3 && (
                          <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            +{opportunity.requirements.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        Due: {formatDate(opportunity.deadline)}
                      </span>
                      <span className="flex items-center">
                        <EyeIcon className="w-4 h-4 mr-1" />
                        {opportunity.responseCount} proposals
                      </span>
                    </div>
                    
                    <Link
                      href={`/supplier/opportunities/${opportunity.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                    >
                      <DocumentTextIcon className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filters.category || filters.status !== 'open'
                ? 'Try adjusting your search criteria or filters.'
                : 'Check back later for new project opportunities.'}
            </p>
          </div>
        )}
      </div>
    </SupplierLayout>
  );
}