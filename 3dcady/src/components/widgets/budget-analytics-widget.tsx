'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CurrencyDollarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

interface BudgetData {
  period: string;
  planned: number;
  actual: number;
  pending: number;
}

export default function BudgetAnalyticsWidget() {
  const [budgetData, setBudgetData] = useState<BudgetData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockData: BudgetData[] = [
      { period: 'Jan', planned: 50000, actual: 45000, pending: 5000 },
      { period: 'Feb', planned: 60000, actual: 55000, pending: 8000 },
      { period: 'Mar', planned: 75000, actual: 70000, pending: 12000 },
      { period: 'Apr', planned: 80000, actual: 85000, pending: 15000 },
    ];

    setTimeout(() => {
      setBudgetData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const totalPlanned = budgetData.reduce((sum, item) => sum + item.planned, 0);
  const totalActual = budgetData.reduce((sum, item) => sum + item.actual, 0);
  const totalPending = budgetData.reduce((sum, item) => sum + item.pending, 0);
  const variance = totalActual - totalPlanned;
  const variancePercent = totalPlanned > 0 ? (variance / totalPlanned) * 100 : 0;

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
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Budget Analytics</h3>
        <CurrencyDollarIcon className="w-6 h-6 text-gray-400" />
      </div>

      {/* Chart */}
      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={budgetData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), '']}
              labelStyle={{ color: '#374151' }}
            />
            <Bar dataKey="planned" fill="#e5e7eb" name="Planned" />
            <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
            <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Budget</span>
          <span className="font-semibold text-gray-900">{formatCurrency(totalPlanned)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Actual Spent</span>
          <span className="font-semibold text-gray-900">{formatCurrency(totalActual)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Pending Approval</span>
          <span className="font-semibold text-amber-600">{formatCurrency(totalPending)}</span>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Variance</span>
            <div className="flex items-center space-x-1">
              {variance >= 0 ? (
                <ArrowTrendingUpIcon className="w-4 h-4 text-red-500" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4 text-green-500" />
              )}
              <span className={`font-semibold ${variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {variance >= 0 ? '+' : ''}{formatCurrency(variance)}
              </span>
              <span className={`text-sm ${variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                ({variancePercent.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}