'use client';

import { useState } from 'react';
import Modal from '@/components/ui/modal';

interface NewProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProposalFormData) => void;
}

export interface ProposalFormData {
  title: string;
  description: string;
  projectName: string;
  supplierName: string;
  totalAmount: number;
  validUntil: string;
  category: 'furniture' | 'lighting' | 'materials' | 'fixtures' | 'mixed';
}

export default function NewProposalModal({ isOpen, onClose, onSubmit }: NewProposalModalProps) {
  const [formData, setFormData] = useState<ProposalFormData>({
    title: '',
    description: '',
    projectName: '',
    supplierName: '',
    totalAmount: 0,
    validUntil: '',
    category: 'furniture'
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit(formData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        projectName: '',
        supplierName: '',
        totalAmount: 0,
        validUntil: '',
        category: 'furniture'
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating proposal request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalAmount' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request New Proposal" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Proposal Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter proposal title"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe what you need from suppliers"
            />
          </div>

          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
              Project *
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              required
              value={formData.projectName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Associated project name"
            />
          </div>

          <div>
            <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Supplier
            </label>
            <input
              type="text"
              id="supplierName"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Supplier name (optional)"
            />
          </div>

          <div>
            <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Budget Estimate (USD)
            </label>
            <input
              type="number"
              id="totalAmount"
              name="totalAmount"
              min="0"
              step="100"
              value={formData.totalAmount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700 mb-2">
              Response Deadline
            </label>
            <input
              type="date"
              id="validUntil"
              name="validUntil"
              value={formData.validUntil}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="furniture">Furniture</option>
              <option value="lighting">Lighting</option>
              <option value="materials">Materials</option>
              <option value="fixtures">Fixtures</option>
              <option value="mixed">Mixed Categories</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending Request...' : 'Request Proposal'}
          </button>
        </div>
      </form>
    </Modal>
  );
}