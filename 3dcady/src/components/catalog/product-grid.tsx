'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  TagIcon,
  ClockIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  unit: string;
  availability: 'in_stock' | 'made_to_order' | 'discontinued';
  leadTimeDays?: number;
  minimumOrder?: number;
  tags: string[];
  images: string[];
  specifications: Record<string, any>;
  createdDate: string;
}

interface ProductGridProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onView?: (product: Product) => void;
  showActions?: boolean;
  selectable?: boolean;
  selectedProducts?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

export default function ProductGrid({
  products,
  onEdit,
  onDelete,
  onView,
  showActions = false,
  selectable = false,
  selectedProducts = [],
  onSelectionChange,
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return 'bg-green-100 text-green-800';
      case 'made_to_order':
        return 'bg-yellow-100 text-yellow-800';
      case 'discontinued':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityLabel = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return 'In Stock';
      case 'made_to_order':
        return 'Made to Order';
      case 'discontinued':
        return 'Discontinued';
      default:
        return 'Unknown';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleProductClick = (product: Product) => {
    if (onView) {
      onView(product);
    }
  };

  const handleSelectionChange = (productId: string, checked: boolean) => {
    if (!onSelectionChange) return;
    
    let newSelection = [...selectedProducts];
    if (checked) {
      newSelection.push(productId);
    } else {
      newSelection = newSelection.filter(id => id !== productId);
    }
    onSelectionChange(newSelection);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
          <TagIcon className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600 mb-6">
          Get started by adding your first product to the catalog.
        </p>
        {showActions && (
          <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
            Add Product
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex justify-end">
        <div className="flex border border-gray-300 rounded-md">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 text-sm font-medium ${
              viewMode === 'grid'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 text-sm font-medium border-l border-gray-300 ${
              viewMode === 'list'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Selection Checkbox */}
              {selectable && (
                <div className="p-3 border-b border-gray-200">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => handleSelectionChange(product.id, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Select</span>
                  </label>
                </div>
              )}

              {/* Product Image */}
              <div className="aspect-w-1 aspect-h-1 bg-gray-100">
                {product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  />
                ) : (
                  <div 
                    className="flex items-center justify-center h-48 cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <TagIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 
                    className="font-medium text-gray-900 text-sm cursor-pointer hover:text-primary-600"
                    onClick={() => handleProductClick(product)}
                  >
                    {product.name}
                  </h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(product.availability)}`}>
                    {getAvailabilityLabel(product.availability)}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(product.price, product.currency)}
                  </span>
                  <span className="text-sm text-gray-500">
                    per {product.unit}
                  </span>
                </div>

                {/* Tags */}
                {product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {product.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{product.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Lead Time */}
                {product.leadTimeDays && (
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    <span>{product.leadTimeDays} days lead time</span>
                  </div>
                )}

                {/* Actions */}
                {showActions && (
                  <div className="flex justify-end space-x-2">
                    {onView && (
                      <button
                        onClick={() => onView(product)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        title="View details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        title="Edit product"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded"
                        title="Delete product"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {selectable && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                {showActions && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  {selectable && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => handleSelectionChange(product.id, e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <TagIcon className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div 
                          className="text-sm font-medium text-gray-900 cursor-pointer hover:text-primary-600"
                          onClick={() => handleProductClick(product)}
                        >
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                    {product.subcategory && (
                      <div className="text-xs text-gray-400">{product.subcategory}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(product.price, product.currency)}
                    <div className="text-xs text-gray-500">per {product.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(product.availability)}`}>
                      {getAvailabilityLabel(product.availability)}
                    </span>
                  </td>
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {onView && (
                          <button
                            onClick={() => onView(product)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(product)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(product.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}