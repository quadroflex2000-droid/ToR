'use client';

import { useSession } from 'next-auth/react';
import SupplierLayout from '@/components/supplier/supplier-layout';
import OpportunityFeedWidget from '@/components/supplier/opportunity-feed-widget';
import ProposalStatusWidget from '@/components/supplier/proposal-status-widget';
import ActiveOrdersWidget from '@/components/supplier/active-orders-widget';
import PerformanceMetricsWidget from '@/components/supplier/performance-metrics-widget';

export default function SupplierDashboardPage() {
  const { data: session } = useSession();

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <SupplierLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user.name?.split(' ')[0]}
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your opportunities and track your business performance.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Technical Specification Feed */}
          <div className="lg:col-span-2 xl:col-span-2">
            <OpportunityFeedWidget />
          </div>

          {/* Performance Metrics */}
          <div className="lg:col-span-1 xl:col-span-1">
            <PerformanceMetricsWidget />
          </div>

          {/* Proposal Status Tracking */}
          <div className="lg:col-span-1 xl:col-span-1">
            <ProposalStatusWidget />
          </div>

          {/* Active Orders Management */}
          <div className="lg:col-span-1 xl:col-span-2">
            <ActiveOrdersWidget />
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
}