'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  CogIcon,
  UserCircleIcon,
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface SupplierLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/supplier/dashboard', icon: HomeIcon },
  { name: 'Opportunities', href: '/supplier/opportunities', icon: MagnifyingGlassIcon },
  { name: 'My Proposals', href: '/supplier/proposals', icon: DocumentTextIcon },
  { name: 'Orders', href: '/supplier/orders', icon: ShoppingBagIcon },
  { name: 'Analytics', href: '/supplier/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/supplier/settings', icon: CogIcon },
];

export default function SupplierLayout({ children }: SupplierLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">3D</span>
            </div>
            {sidebarOpen && (
              <span className="ml-3 text-xl font-bold text-gray-900">3dcady</span>
            )}
          </div>
        </div>

        {/* Supplier Badge */}
        {sidebarOpen && (
          <div className="px-4 py-3 bg-amber-50 border-b border-amber-200">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <span className="ml-2 text-sm font-medium text-amber-800">Supplier Portal</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`flex-shrink-0 h-5 w-5 ${
                        isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {sidebarOpen && <span className="ml-3">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Toggle */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
          >
            {sidebarOpen ? (
              <>
                <ChevronLeftIcon className="h-5 w-5" />
                <span className="ml-2">Collapse</span>
              </>
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-900">Supplier Portal</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors duration-200">
                <BellIcon className="h-6 w-6" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button className="flex items-center space-x-3 text-sm text-gray-700 hover:text-gray-900">
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  <div className="text-left">
                    <div className="font-medium">{session?.user?.name}</div>
                    <div className="text-xs text-gray-500">{session?.user?.email}</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}