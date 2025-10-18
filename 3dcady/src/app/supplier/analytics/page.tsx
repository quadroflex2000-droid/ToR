'use client';
'use client';

import { useState } from 'react';
import { useSession } from '@/components/auth-provider';
import SupplierLayout from '@/components/supplier/supplier-layout';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
}

export default function AnalyticsPage() {
  const { session } = useSession();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const metrics: MetricCard[] = [
    {
      title: 'Total Revenue',
      value: '$485,230',
      change: '+12.5%',
      changeType: 'increase',
      icon: CurrencyDollarIcon
    },
    {
      title: 'Active Orders',
      value: '24',
      change: '+8.2%',
      changeType: 'increase',
      icon: ShoppingBagIcon
    },
    {
      title: 'Proposals Submitted',
      value: '47',
      change: '-3.1%',
      changeType: 'decrease',
      icon: DocumentTextIcon
    },
    {
      title: 'Win Rate',
      value: '68.5%',
      change: '+5.4%',
      changeType: 'increase',
      icon: StarIcon
    }
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'order_completed',
      title: 'Order ORD-2024-001 completed',
      client: 'TechCorp Solutions',
      value: '$185,000',
      date: '2024-02-01T14:30:00Z'
    },
    {
      id: '2',
      type: 'proposal_accepted',
      title: 'Proposal accepted',
      client: 'Bella Vista Restaurant',
      value: '$78,000',
      date: '2024-01-30T11:22:00Z'
    },
    {
      id: '3',
      type: 'proposal_submitted',
      title: 'New proposal submitted',
      client: 'Global Finance Corp',
      value: '$52,000',
      date: '2024-01-29T13:15:00Z'
    },
    {
      id: '4',
      type: 'order_shipped',
      title: 'Order shipped',
      client: 'Premium Living LLC',
      value: '$95,000',
      date: '2024-01-28T16:45:00Z'
    }
  ];

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
      case 'decrease':
        return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order_completed':
        return '✅';
      case 'proposal_accepted':
        return '🎉';
      case 'proposal_submitted':
        return '📋';
      case 'order_shipped':
        return '🚚';
      default:
        return '📊';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Performance</h1>
            <p className="text-gray-600 mt-2">
              Track your business performance and growth metrics
            </p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range === '7d' ? '7 Days' : 
                 range === '30d' ? '30 Days' : 
                 range === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.title} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex items-center space-x-1">
                    {getChangeIcon(metric.changeType)}
                    <span className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart Placeholder */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <ChartBarIcon className="w-5 h-5 text-gray-400" />
            </div>
            
            {/* Mock Chart */}
            <div className="h-64 bg-gradient-to-t from-primary-50 to-primary-100 rounded-lg flex items-end justify-center">
              <div className="text-center p-8">
                <ChartBarIcon className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                <p className="text-gray-600 text-sm">Revenue chart visualization</p>
                <p className="text-gray-500 text-xs mt-1">Interactive charts coming soon</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="text-gray-600">This Month</p>
                <p className="font-semibold text-gray-900">$145,230</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Last Month</p>
                <p className="font-semibold text-gray-900">$128,950</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Growth</p>
                <p className="font-semibold text-green-600">+12.6%</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <CalendarIcon className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.client} • {activity.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(activity.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
                View all activity
              </button>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">Top 15%</div>
              <p className="text-sm text-green-800">Performance Ranking</p>
              <p className="text-xs text-green-600 mt-1">Among all suppliers</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">4.8★</div>
              <p className="text-sm text-blue-800">Average Rating</p>
              <p className="text-xs text-blue-600 mt-1">Based on 127 reviews</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">96%</div>
              <p className="text-sm text-purple-800">On-Time Delivery</p>
              <p className="text-xs text-purple-600 mt-1">Last 90 days</p>
            </div>
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
}