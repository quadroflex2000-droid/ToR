'use client';

import { useState, useEffect } from 'react';
import { ChartBarIcon, ArrowTrendingUpIcon, StarIcon } from '@heroicons/react/24/outline';

interface Metrics {
  proposalsSubmitted: number;
  proposalsAccepted: number;
  totalRevenue: number;
  averageResponseTime: number;
  rating: number;
  activeOrders: number;
}

export default function PerformanceMetricsWidget() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockMetrics: Metrics = {
      proposalsSubmitted: 24,
      proposalsAccepted: 8,
      totalRevenue: 245000,
      averageResponseTime: 2.3,
      rating: 4.8,
      activeOrders: 5,
    };

    setTimeout(() => {
      setMetrics(mockMetrics);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const acceptanceRate = metrics.proposalsSubmitted > 0 
    ? (metrics.proposalsAccepted / metrics.proposalsSubmitted) * 100 
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
        <ChartBarIcon className="w-6 h-6 text-gray-400" />
      </div>

      <div className="space-y-4">
        {/* Success Rate */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Success Rate</span>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900">{acceptanceRate.toFixed(1)}%</span>
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Rating</span>
          <div className="flex items-center space-x-1">
            <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-semibold text-gray-900">{metrics.rating}</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Revenue</span>
          <span className="font-semibold text-gray-900">{formatCurrency(metrics.totalRevenue)}</span>
        </div>

        {/* Response Time */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Avg Response Time</span>
          <span className="font-semibold text-gray-900">{metrics.averageResponseTime} days</span>
        </div>

        {/* Active Orders */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Active Orders</span>
          <span className="font-semibold text-gray-900">{metrics.activeOrders}</span>
        </div>

        {/* Proposals Stats */}
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{metrics.proposalsSubmitted}</div>
              <div className="text-xs text-gray-500">Submitted</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{metrics.proposalsAccepted}</div>
              <div className="text-xs text-gray-500">Accepted</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}