'use client';

import { useState, useEffect } from 'react';
import { ShoppingBagIcon, TruckIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Order {
  id: string;
  projectName: string;
  clientName: string;
  orderValue: number;
  currency: string;
  status: 'confirmed' | 'in_production' | 'ready_to_ship' | 'shipped' | 'delivered';
  orderDate: string;
  expectedDelivery: string;
  nextMilestone: string;
  progress: number;
}

export default function ActiveOrdersWidget() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockOrders: Order[] = [
      {
        id: '1',
        projectName: 'Hotel Furniture Package',
        clientName: 'Luxury Hotels Inc.',
        orderValue: 85000,
        currency: 'USD',
        status: 'in_production',
        orderDate: '2024-09-15',
        expectedDelivery: '2024-11-01',
        nextMilestone: 'Quality inspection',
        progress: 65,
      },
      {
        id: '2',
        projectName: 'Office Lighting System',
        clientName: 'Tech Startup Co.',
        orderValue: 32000,
        currency: 'USD',
        status: 'ready_to_ship',
        orderDate: '2024-09-20',
        expectedDelivery: '2024-10-15',
        nextMilestone: 'Shipment preparation',
        progress: 90,
      },
      {
        id: '3',
        projectName: 'Residential Materials',
        clientName: 'Private Client',
        orderValue: 45000,
        currency: 'USD',
        status: 'confirmed',
        orderDate: '2024-10-01',
        expectedDelivery: '2024-11-15',
        nextMilestone: 'Material sourcing',
        progress: 15,
      },
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusConfig = (status: string) => {
    const configs = {
      confirmed: {
        color: 'bg-blue-100 text-blue-800',
        icon: CheckCircleIcon,
        label: 'Confirmed',
      },
      in_production: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: ClockIcon,
        label: 'In Production',
      },
      ready_to_ship: {
        color: 'bg-purple-100 text-purple-800',
        icon: ShoppingBagIcon,
        label: 'Ready to Ship',
      },
      shipped: {
        color: 'bg-indigo-100 text-indigo-800',
        icon: TruckIcon,
        label: 'Shipped',
      },
      delivered: {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircleIcon,
        label: 'Delivered',
      },
    };
    return configs[status as keyof typeof configs] || configs.confirmed;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
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
        <h3 className="text-lg font-semibold text-gray-900">Active Orders</h3>
        <ShoppingBagIcon className="w-6 h-6 text-gray-400" />
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{order.projectName}</h4>
                  <p className="text-sm text-gray-600">{order.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(order.orderValue, order.currency)}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{order.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${order.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Order Details */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>Next: {order.nextMilestone}</span>
                  <span>Due: {formatDate(order.expectedDelivery)}</span>
                </div>
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-8">
          <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No active orders</h3>
          <p className="mt-1 text-sm text-gray-500">
            Accepted proposals will appear here as active orders.
          </p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          View All Orders
        </button>
      </div>
    </div>
  );
}