import Image from "next/image";
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Welcome to 3dcady
            </h1>
            <p className="text-gray-600 mb-8">
              AI-Powered Interior Project Hub
            </p>
            
            <div className="space-y-4">
              <Link
                href="/auth/signin"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Sign In
              </Link>
              
              <Link
                href="/auth/signup"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Create Account
              </Link>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Features</h2>
              <div className="text-sm text-gray-600 space-y-2">
                <p>✓ AI-powered document analysis</p>
                <p>✓ Project management with Kanban boards</p>
                <p>✓ Supplier marketplace integration</p>
                <p>✓ Real-time collaboration</p>
                <p>✓ Budget tracking and analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
