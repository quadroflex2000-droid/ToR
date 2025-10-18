'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/auth-provider';
import SupplierLayout from '@/components/supplier/supplier-layout';
import Link from 'next/link';
import { 
  ShoppingBagIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface Order {
  id: string;
  orderNumber: string;
  projectTitle: string;
  clientName: string;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'in_production' | 'ready_to_ship' | 'shipped' | 'delivered' | 'completed';
  orderDate: string;
  expectedDelivery: string;
  deliveryAddress: string;
  paymentStatus: 'pending' | 'partial' | 'paid';
  items: OrderItem[];
  notes?: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  status: 'pending' | 'in_production' | 'ready' | 'shipped' | 'delivered';
}

export default function OrdersPage() {
  const { session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'in_production' | 'shipped' | 'completed'>('all');

  useEffect(() => {
    // Mock orders data
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        projectTitle: 'Modern Office Interior Design & Fit-out',
        clientName: 'TechCorp Solutions',
        totalAmount: 185000,
        currency: 'USD',
        status: 'in_production',
        orderDate: '2024-01-30T10:00:00Z',
        expectedDelivery: '2024-03-15T17:00:00Z',
        deliveryAddress: '123 Business Ave, New York, NY 10001',
        paymentStatus: 'partial',
        items: [
          {
            id: '1a',
            name: 'Executive Desk - Oak Finish',
            quantity: 15,
            unit: 'pcs',
            unitPrice: 2500,
            totalPrice: 37500,
            status: 'in_production'
          },
          {
            id: '1b',
            name: 'LED Panel Lights - 60x60cm',
            quantity: 24,
            unit: 'pcs',
            unitPrice: 180,
            totalPrice: 4320,
            status: 'ready'
          },
          {
            id: '1c',
            name: 'Acoustic Wall Panels',
            quantity: 200,
            unit: 'sqm',
            unitPrice: 85,
            totalPrice: 17000,
            status: 'in_production'
          }
        ],
        notes: 'Client requested expedited delivery for lighting fixtures'
      },
      {
        id: '2',
        orderNumber: 'ORD-2024-002',
        projectTitle: 'Restaurant Interior Design - Farm-to-Table Concept',
        clientName: 'Bella Vista Restaurant Group',
        totalAmount: 78000,
        currency: 'USD',
        status: 'shipped',
        orderDate: '2024-02-01T14:30:00Z',
        expectedDelivery: '2024-02-20T12:00:00Z',
        deliveryAddress: '456 Culinary Street, Chicago, IL 60601',
        paymentStatus: 'paid',
        items: [
          {
            id: '2a',
            name: 'Reclaimed Wood Tables',
            quantity: 12,
            unit: 'pcs',
            unitPrice: 850,
            totalPrice: 10200,
            status: 'shipped'
          },
          {
            id: '2b',
            name: 'Industrial Bar Stools',
            quantity: 24,
            unit: 'pcs',
            unitPrice: 320,
            totalPrice: 7680,
            status: 'shipped'
          },
          {
            id: '2c',
            name: 'Edison Bulb Fixtures',
            quantity: 18,
            unit: 'pcs',
            unitPrice: 150,
            totalPrice: 2700,
            status: 'shipped'
          }
        ]
      },
      {
        id: '3',
        orderNumber: 'ORD-2024-003',
        projectTitle: 'Luxury Residential Apartment',
        clientName: 'Private Client',
        totalAmount: 95000,
        currency: 'USD',
        status: 'confirmed',
        orderDate: '2024-02-05T09:15:00Z',
        expectedDelivery: '2024-04-10T16:00:00Z',
        deliveryAddress: '789 Luxury Lane, Los Angeles, CA 90210',
        paymentStatus: 'pending',
        items: [
          {
            id: '3a',
            name: 'Italian Marble Flooring',
            quantity: 150,
            unit: 'sqm',
            unitPrice: 280,
            totalPrice: 42000,
            status: 'pending'
          },
          {
            id: '3b',
            name: 'Smart Home Control Panels',
            quantity: 8,
            unit: 'pcs',
            unitPrice: 1200,
            totalPrice: 9600,
            status: 'pending'
          }
        ],
        notes: 'Awaiting material confirmation from client'
      }
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircleIcon className="w-5 h-5 text-blue-500" />;
      case 'in_production':
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />;
      case 'ready_to_ship':
        return <ShoppingBagIcon className="w-5 h-5 text-purple-500" />;
      case 'shipped':
        return <TruckIcon className="w-5 h-5 text-indigo-500" />;
      case 'delivered':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_production':
        return 'bg-orange-100 text-orange-800';
      case 'ready_to_ship':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-2">
              Manage and track your active orders and deliveries
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'pending', 'confirmed', 'in_production', 'shipped', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'All Orders' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(order.status)}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.orderNumber}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium mb-1">{order.projectTitle}</p>
                      <p className="text-gray-600 text-sm">Client: {order.clientName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(order.totalAmount, order.currency)}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Ordered: {formatDate(order.orderDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TruckIcon className="w-4 h-4" />
                      <span>Expected: {formatDate(order.expectedDelivery)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-4 h-4" />
                      <span className="truncate">{order.deliveryAddress}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">Order Items ({order.items.length})</h4>
                    <div className="space-y-3">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              {item.quantity} {item.unit} × {formatCurrency(item.unitPrice, order.currency)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatCurrency(item.totalPrice, order.currency)}
                            </p>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status as any)}`}>
                              {item.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-sm text-gray-500 text-center pt-2 border-t border-gray-200">
                          +{order.items.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> {order.notes}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      {order.status === 'in_production' && (
                        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                          Mark Ready to Ship
                        </button>
                      )}
                      {order.status === 'ready_to_ship' && (
                        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                          Mark as Shipped
                        </button>
                      )}
                    </div>
                    <Link
                      href={`/supplier/orders/${order.id}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? "You don't have any orders yet." 
                : `No orders with status "${filter.replace('_', ' ')}".`}
            </p>
            <Link
              href="/supplier/opportunities"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Browse Opportunities
            </Link>
          </div>
        )}
      </div>
    </SupplierLayout>
  );
}