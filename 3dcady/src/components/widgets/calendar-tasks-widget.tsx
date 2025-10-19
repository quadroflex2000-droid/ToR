'use client';

import { useState, useEffect } from 'react';
import { CalendarIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'deadline' | 'delivery' | 'meeting';
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export default function CalendarTasksWidget() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Furniture delivery - Lake House',
        date: '2024-10-10',
        type: 'delivery',
      },
      {
        id: '2',
        title: 'Client meeting - Office Design',
        date: '2024-10-12',
        type: 'meeting',
      },
      {
        id: '3',
        title: 'Phase 1 deadline - Hotel Lobby',
        date: '2024-10-15',
        type: 'deadline',
      },
    ];

    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Review lighting proposals',
        dueDate: '2024-10-09',
        priority: 'high',
        completed: false,
      },
      {
        id: '2',
        title: 'Approve material samples',
        dueDate: '2024-10-11',
        priority: 'medium',
        completed: false,
      },
      {
        id: '3',
        title: 'Update project timeline',
        dueDate: '2024-10-08',
        priority: 'low',
        completed: true,
      },
    ];

    setTimeout(() => {
      setEvents(mockEvents);
      setTasks(mockTasks);
      setLoading(false);
    }, 1000);
  }, []);

  const getEventTypeColor = (type: string) => {
    const colors = {
      deadline: 'bg-red-100 text-red-800',
      delivery: 'bg-blue-100 text-blue-800',
      meeting: 'bg-green-100 text-green-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'text-red-600',
      medium: 'text-yellow-600',
      low: 'text-gray-600',
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Calendar & Tasks</h3>
        <CalendarIcon className="w-6 h-6 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Upcoming Events</h4>
          <div className="space-y-3">
            {events.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{formatDate(event.date)}</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEventTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">This Week's Tasks</h4>
          <div className="space-y-3">
            {tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {task.completed ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      isOverdue(task.dueDate) ? 'border-red-500' : 'border-gray-300'
                    }`}></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${
                    task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                  }`}>
                    {task.title}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${
                      isOverdue(task.dueDate) && !task.completed ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {formatDate(task.dueDate)}
                    </span>
                    <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    {isOverdue(task.dueDate) && !task.completed && (
                      <ExclamationCircleIcon className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 flex space-x-3">
        <button className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          View Calendar
        </button>
        <button className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
          Add Task
        </button>
      </div>
    </div>
  );
}