'use client';

import { useSession } from '@/components/auth-provider';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import ProjectOverviewWidget from '@/components/widgets/project-overview-widget';
import BudgetAnalyticsWidget from '@/components/widgets/budget-analytics-widget';
import IncomingProposalsWidget from '@/components/widgets/incoming-proposals-widget';
import CalendarTasksWidget from '@/components/widgets/calendar-tasks-widget';

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