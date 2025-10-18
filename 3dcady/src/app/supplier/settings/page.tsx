'use client';

import { useState } from 'react';
import { useSession } from '@/components/auth-provider';
import SupplierLayout from '@/components/supplier/supplier-layout';
import { 
  UserCircleIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  DocumentTextIcon,
  PencilIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SupplierProfile {
  companyName: string;
  registrationNumber: string;
  taxId: string;
  website: string;
  description: string;
  categories: string[];
  serviceAreas: string[];
  contactEmail: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
  certifications: string[];
}

export default function SettingsPage() {
  const { session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<SupplierProfile>({
    companyName: 'Premium Interiors LLC',
    registrationNumber: 'LLC-2020-001234',
    taxId: '12-3456789',
    website: 'https://premiuminteriors.com',
    description: 'Specialized in high-end commercial and residential interior design and fit-out services. Over 15 years of experience delivering exceptional results.',
    categories: ['Commercial', 'Residential', 'Hospitality'],
    serviceAreas: ['New York', 'New Jersey', 'Connecticut'],
    contactEmail: 'contact@premiuminteriors.com',
    contactPhone: '+1 (555) 123-4567',
    address: {
      street: '123 Design Avenue, Suite 100',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States'
    },
    verificationStatus: 'verified',
    certifications: ['LEED AP', 'NCIDQ', 'ASID Professional']
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    browserNotifications: true,
    proposalAlerts: true,
    orderUpdates: true,
    marketingEmails: false,
    weeklyReports: true
  });

  const tabs = [
    { id: 'profile', name: 'Company Profile', icon: BuildingOfficeIcon },
    { id: 'account', name: 'Account Settings', icon: UserCircleIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'billing', name: 'Billing & Plans', icon: CreditCardIcon },
    { id: 'verification', name: 'Verification', icon: ShieldCheckIcon },
  ];

  const handleSaveProfile = () => {
    // Save profile logic would go here
    setIsEditing(false);
    // Show success message
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            <CogIcon className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            <XMarkIcon className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (!session.user) {
    return <div>Loading...</div>;
  }

  return (
    <SupplierLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your supplier profile and account preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 mb-8 lg:mb-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="flex-shrink-0 w-5 h-5 mr-3" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {/* Company Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Company Profile</h3>
                    <p className="text-sm text-gray-600">Update your company information and capabilities</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getVerificationBadge(profile.verificationStatus)}
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <PencilIcon className="w-4 h-4 mr-2" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={profile.companyName}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Registration Number
                        </label>
                        <input
                          type="text"
                          value={profile.registrationNumber}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tax ID
                        </label>
                        <input
                          type="text"
                          value={profile.taxId}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          value={profile.website}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Description
                    </label>
                    <textarea
                      rows={4}
                      value={profile.description}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          value={profile.contactEmail}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          value={profile.contactPhone}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Categories and Service Areas */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Capabilities</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Categories
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {profile.categories.map((category) => (
                            <span
                              key={category}
                              className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service Areas
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {profile.serviceAreas.map((area) => (
                            <span
                              key={area}
                              className="inline-flex px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
                  <p className="text-sm text-gray-600">Choose how you want to be notified about important updates</p>
                </div>

                <div className="space-y-6">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {key === 'emailNotifications' && 'Receive notifications via email'}
                          {key === 'browserNotifications' && 'Receive browser push notifications'}
                          {key === 'proposalAlerts' && 'Get notified about new opportunities'}
                          {key === 'orderUpdates' && 'Updates about your active orders'}
                          {key === 'marketingEmails' && 'Marketing and promotional emails'}
                          {key === 'weeklyReports' && 'Weekly performance reports'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNotifications(prev => ({
                            ...prev,
                            [key]: e.target.checked
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other tabs placeholder */}
            {activeTab !== 'profile' && activeTab !== 'notifications' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center py-12">
                  <CogIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {tabs.find(tab => tab.id === activeTab)?.name}
                  </h3>
                  <p className="text-gray-600">
                    This section is coming soon. We're working on adding more settings and features.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
}