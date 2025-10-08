'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FolderIcon, ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  budget: { planned: number; actual: number; currency: string };
  deadline?: string;
  alerts: string[];
}

export default function ProjectOverviewWidget() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Lake House Renovation',
        status: 'In Progress',
        progress: 65,
        budget: { planned: 150000, actual: 97500, currency: 'USD' },
        deadline: '2024-12-15',
        alerts: ['Budget variance: +$2,500'],
      },
      {
        id: '2',
        name: 'Downtown Office Design',
        status: 'Supplier Selection',
        progress: 30,
        budget: { planned: 85000, actual: 15000, currency: 'USD' },
        deadline: '2024-11-30',
        alerts: [],
      },
    ];

    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'In Progress': 'bg-blue-100 text-blue-800',
      'Supplier Selection': 'bg-yellow-100 text-yellow-800',
      'Planning': 'bg-gray-100 text-gray-800',
      'Completed': 'bg-green-100 text-green-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Project Overview</h3>
        <Link
          href="/projects"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all projects
        </Link>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <Link href={`/projects/${project.id}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FolderIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                {project.alerts.length > 0 && (
                  <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Budget & Deadline */}
              <div className="flex justify-between text-sm">
                <div className="text-gray-600">
                  <span className="font-medium">
                    {formatCurrency(project.budget.actual, project.budget.currency)}
                  </span>
                  <span className="text-gray-400"> / </span>
                  <span>{formatCurrency(project.budget.planned, project.budget.currency)}</span>
                </div>
                {project.deadline && (
                  <div className="flex items-center text-gray-500">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    <span>{new Date(project.deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8">
          <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
          <Link
            href="/projects/new"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            New Project
          </Link>
        </div>
      )}
    </div>
  );
}