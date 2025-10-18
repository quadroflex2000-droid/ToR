'use client';

import { useSession } from '@/components/auth-provider';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import ProjectOverviewWidget from '@/components/widgets/project-overview-widget';
import BudgetAnalyticsWidget from '@/components/widgets/budget-analytics-widget';
import IncomingProposalsWidget from '@/components/widgets/incoming-proposals-widget';
import CalendarTasksWidget from '@/components/widgets/calendar-tasks-widget';
import Link from 'next/link';
import { 
  BuildingOfficeIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { session } = useSession();

  if (!session.user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Role Switcher */}
        <div className="mb-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BuildingOfficeIcon className="w-8 h-8 text-amber-600" />
                <div>
                  <h3 className="text-sm font-medium text-amber-800">Supplier Portal Available</h3>
                  <p className="text-xs text-amber-600">Switch to supplier mode to manage opportunities and orders</p>
                </div>
              </div>
              <Link
                href="/supplier/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 transition-colors"
              >
                <span>Switch to Supplier</span>
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Project Overview Widget */}
          <div className="lg:col-span-2 xl:col-span-2">
            <ProjectOverviewWidget />
          </div>

          {/* Budget Analytics Widget */}
          <div className="lg:col-span-1 xl:col-span-1">
            <BudgetAnalyticsWidget />
          </div>

          {/* Incoming Proposals Widget */}
          <div className="lg:col-span-1 xl:col-span-1">
            <IncomingProposalsWidget />
          </div>

          {/* Calendar & Tasks Widget */}
          <div className="lg:col-span-1 xl:col-span-2">
            <CalendarTasksWidget />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}