'use client';
'use client';

import { useState, useEffect } from 'react';
import SupplierLayout from '@/components/supplier/supplier-layout';
import ProductGrid from '@/components/catalog/product-grid';
import ProductForm from '@/components/catalog/product-form';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  DocumentDuplicateIcon 
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

export default function SupplierCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    availability: '',
    tags: [] as string[],
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      // Mock data - replace with actual API call
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Modern Executive Desk',
          description: 'High-quality oak executive desk with built-in cable management',
          category: 'Furniture',
          subcategory: 'Desks',
          price: 1200,
          currency: 'USD',
          unit: 'pcs',
          availability: 'in_stock',
          leadTimeDays: 5,
          minimumOrder: 1,
          tags: ['executive', 'oak', 'modern'],
          images: ['/images/desk1.jpg'],
          specifications: {
            dimensions: { length: 160, width: 80, height: 75, unit: 'cm' },
            material: 'Oak wood',
            finish: 'Natural oil',
            weight: '45 kg',
          },
          createdDate: '2024-10-01',
        },
        {
          id: '2',
          name: 'LED Pendant Light',
          description: 'Contemporary LED pendant light with adjustable height',
          category: 'Lighting',
          subcategory: 'Pendant Lights',
          price: 350,
          currency: 'USD',
          unit: 'pcs',
          availability: 'made_to_order',
          leadTimeDays: 14,
          minimumOrder: 2,
          tags: ['led', 'modern', 'adjustable'],
          images: ['/images/pendant1.jpg'],
          specifications: {
            dimensions: { diameter: 30, height: 40, unit: 'cm' },
            power: '24W',
            color_temperature: '3000K',
            dimmable: true,
          },
          createdDate: '2024-09-28',
        },
      ];

      setProducts(mockProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      if (editingProduct) {
        // Update existing product
        const updatedProduct = { ...editingProduct, ...productData };
        setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
      } else {
        // Add new product
        const newProduct: Product = {
          id: Date.now().toString(),
          createdDate: new Date().toISOString(),
          currency: 'USD',
          availability: 'in_stock',
          tags: [],
          images: [],
          specifications: {},
          ...productData,
        } as Product;
        setProducts([...products, newProduct]);
      }
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleBulkUpload = () => {
    // TODO: Implement bulk upload functionality
    console.log('Bulk upload not implemented yet');
  };

  const filteredProducts = products.filter(product => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    
    if (filters.availability && product.availability !== filters.availability) {
      return false;
    }
    
    if (filters.tags.length > 0 && 
        !filters.tags.some(tag => product.tags.includes(tag))) {
      return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <SupplierLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </SupplierLayout>
    );
  }

  return (
    <SupplierLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
            <p className="text-gray-600 mt-1">
              Manage your product listings and inventory
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleBulkUpload}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
              Bulk Upload
            </button>
            
            <button
              onClick={handleAddProduct}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Filters */}
            <div className="flex space-x-3">
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Categories</option>
                <option value="Furniture">Furniture</option>
                <option value="Lighting">Lighting</option>
                <option value="Finishing Materials">Finishing Materials</option>
                <option value="Plumbing">Plumbing</option>
              </select>

              <select
                value={filters.availability}
                onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Any Availability</option>
                <option value="in_stock">In Stock</option>
                <option value="made_to_order">Made to Order</option>
                <option value="discontinued">Discontinued</option>
              </select>

              <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          showActions={true}
        />

        {/* Product Form Modal */}
        {showProductForm && (
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setShowProductForm(false);
              setEditingProduct(null);
            }}
          />
        )}
      </div>
    </SupplierLayout>
  );
}