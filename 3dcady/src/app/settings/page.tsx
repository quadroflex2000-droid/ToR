'use client';

import { useState } from 'react';
import { useSession } from '@/components/auth-provider';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { 
  UserCircleIcon, 
  CogIcon,
  BellIcon,
  KeyIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  TrashIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const { session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const [profileData, setProfileData] = useState({
    firstName: 'Demo',
    lastName: 'User',
    email: 'user@3dcady.com',
    company: 'Design Studio Pro',
    phone: '+1 (555) 123-4567',
    bio: 'Experienced interior designer specializing in modern commercial spaces.',
    website: 'https://designstudiopro.com',
    timezone: 'America/New_York'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    proposalAlerts: true,
    deadlineReminders: true,
    weeklyReports: false
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'account', name: 'Account', icon: CogIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon }
  ];

  const handleSave = async () => {
    setSaveStatus('saving');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (activeTab === 'profile') {
      setProfileData(prev => ({ ...prev, [field]: value }));
    } else if (activeTab === 'notifications') {
      setNotificationSettings(prev => ({ ...prev, [field]: value }));
    }
  };

  if (!session.user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-64">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm">
                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                    
                    <div className="space-y-6">
                      {/* Avatar */}
                      <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                          <UserCircleIcon className="w-12 h-12 text-primary-600" />
                        </div>
                        <div>
                          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                            Change Photo
                          </button>
                          <p className="text-gray-500 text-sm mt-1">JPG, GIF or PNG. 2MB max.</p>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={profileData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={profileData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company
                          </label>
                          <input
                            type="text"
                            value={profileData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                          </label>
                          <textarea
                            rows={3}
                            value={profileData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeTab === 'notifications' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                    
                    <div className="space-y-6">
                      {Object.entries(notificationSettings).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Get notified about {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handleInputChange(key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Account Settings */}
                {activeTab === 'account' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                    
                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Account Type</h3>
                        <p className="text-gray-600 mb-4">You are currently on the Professional plan</p>
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                          Upgrade Plan
                        </button>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Data Export</h3>
                        <p className="text-gray-600 mb-4">Download a copy of your account data</p>
                        <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                          Export Data
                        </button>
                      </div>

                      <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <h3 className="text-lg font-medium text-red-900 mb-2">Delete Account</h3>
                        <p className="text-red-700 mb-4">Permanently delete your account and all associated data</p>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors flex items-center space-x-2">
                          <TrashIcon className="w-4 h-4" />
                          <span>Delete Account</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Security</h2>
                    
                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Password</h3>
                        <p className="text-gray-600 mb-4">Change your account password</p>
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm transition-colors flex items-center space-x-2">
                          <KeyIcon className="w-4 h-4" />
                          <span>Change Password</span>
                        </button>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                        <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Billing Settings */}
                {activeTab === 'billing' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing</h2>
                    
                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Current Plan</h3>
                        <p className="text-gray-600 mb-2">Professional Plan - $29/month</p>
                        <p className="text-sm text-gray-500 mb-4">Next billing date: March 15, 2024</p>
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                          Change Plan
                        </button>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Method</h3>
                        <p className="text-gray-600 mb-4">**** **** **** 4242 (Visa)</p>
                        <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                          Update Payment
                        </button>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Billing History</h3>
                        <p className="text-gray-600 mb-4">View and download your invoices</p>
                        <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                          View Invoices
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                {(activeTab === 'profile' || activeTab === 'notifications') && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        {saveStatus === 'saved' && (
                          <span className="flex items-center space-x-1 text-green-600">
                            <CheckIcon className="w-4 h-4" />
                            <span>Changes saved successfully</span>
                          </span>
                        )}
                      </p>
                      <button
                        onClick={handleSave}
                        disabled={saveStatus === 'saving'}
                        className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-6 py-2 rounded-md text-sm transition-colors"
                      >
                        {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}