'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import KanbanBoard from '@/components/project-management/kanban-board';
import { 
  AdjustmentsHorizontalIcon,
  DocumentPlusIcon,
  UserPlusIcon,
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [activeTab, setActiveTab] = useState('kanban');

  const tabs = [
    { id: 'kanban', name: 'Kanban Board', icon: AdjustmentsHorizontalIcon },
    { id: 'specifications', name: 'Specifications', icon: DocumentPlusIcon },
    { id: 'team', name: 'Team', icon: UserPlusIcon },
    { id: 'settings', name: 'Settings', icon: Cog6ToothIcon },
  ];

  const handleItemUpdate = (item: any) => {
    console.log('Item updated:', item);
    // Here you would typically make an API call to update the item
  };

  const handleStageUpdate = (stage: any) => {
    console.log('Stage updated:', stage);
    // Here you would typically make an API call to update the stage
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        {/* Project Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Lake House Renovation
              </h1>
              <p className="text-gray-600 mt-1">
                Luxury waterfront property renovation project
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Status:</span>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  In Progress
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Budget:</span>
                <span className="font-semibold">$97,500 / $150,000</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'kanban' && (
            <div className="h-full p-6">
              <KanbanBoard
                projectId={projectId}
                onItemUpdate={handleItemUpdate}
                onStageUpdate={handleStageUpdate}
              />
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="p-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Technical Specifications
                </h3>
                <p className="text-gray-600">
                  Specifications management will be implemented here.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="p-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Team Management
                </h3>
                <p className="text-gray-600">
                  Team collaboration features will be implemented here.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Project Settings
                </h3>
                <p className="text-gray-600">
                  Project configuration options will be implemented here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}