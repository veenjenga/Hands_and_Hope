import { useState, useEffect } from 'react';
import { Plus, Package, Grid3x3, List, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AddProductModal } from './AddProductModal';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: string | number;
  description: string;
  category: string;
  stock: string | number;
  images: string[];
  status: 'active' | 'sold' | 'draft';
  viewCount?: number;
  views?: number;
  createdAt: string;
  warranty?: string;
  refundDeadline?: string;
}

interface ProductsPageProps {
  highContrast: boolean;
  onAddProductClick?: () => void;
  shouldOpenModal?: boolean;
  userRole?: 'seller' | 'student';
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Handmade Ceramic Bowl',
    price: '45.00',
    description: 'Beautiful handcrafted ceramic bowl with unique glaze patterns. Perfect for serving or decoration.',
    category: 'Pottery',
    stock: '3',
    images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400'],
    status: 'active',
    views: 234,
    createdAt: '2024-10-15',
  },
  {
    id: '2',
    name: 'Watercolor Landscape Painting',
    price: '120.00',
    description: 'Original watercolor painting of a serene mountain landscape. 16x20 inches on premium watercolor paper.',
    category: 'Painting',
    stock: '1',
    images: ['https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400'],
    status: 'active',
    views: 189,
    createdAt: '2024-10-20',
  },
  {
    id: '3',
    name: 'Sterling Silver Bracelet',
    price: '85.00',
    description: 'Elegant sterling silver bracelet with intricate Celtic knot design. Handcrafted with care.',
    category: 'Jewelry',
    stock: '5',
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400'],
    status: 'active',
    views: 156,
    createdAt: '2024-10-25',
  },
  {
    id: '4',
    name: 'Woven Wall Hanging',
    price: '65.00',
    description: 'Handwoven macrame wall hanging in natural cotton. Adds bohemian charm to any room.',
    category: 'Textiles',
    stock: '2',
    images: ['https://images.unsplash.com/photo-1566206091558-7f218b696731?w=400'],
    status: 'active',
    views: 98,
    createdAt: '2024-11-01',
  },
  {
    id: '5',
    name: 'Clay Sculpture - Abstract',
    price: '150.00',
    description: 'Contemporary abstract clay sculpture. Unique piece that makes a bold statement.',
    category: 'Sculpture',
    stock: '1',
    images: ['https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=400'],
    status: 'sold',
    views: 312,
    createdAt: '2024-09-18',
  },
  {
    id: '6',
    name: 'Handmade Greeting Cards Set',
    price: '28.00',
    description: 'Set of 10 hand-painted greeting cards with envelopes. Perfect for any occasion.',
    category: 'Crafts',
    stock: '8',
    images: ['https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=400'],
    status: 'active',
    views: 145,
    createdAt: '2024-11-05',
  },
];

export function ProductsPage({ highContrast, onAddProductClick, shouldOpenModal, userRole }: ProductsPageProps) {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(shouldOpenModal || false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.getProducts(token);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (newProduct: {
    name: string;
    price: string;
    description: string;
    category: string;
    stock: string;
    images: string[];
    warranty?: string;
    refundDeadline?: string;
  }) => {
    if (!token) {
      alert('You must be logged in to add products');
      return;
    }

    try {
      if (editingProduct) {
        // Update existing product
        const productId = editingProduct._id || editingProduct.id || '';
        const updatedProduct = await api.updateProduct(productId, newProduct, token);
        setProducts(products.map(p => 
          (p._id || p.id) === productId ? updatedProduct : p
        ));
        setEditingProduct(null);
      } else {
        // Create new product
        const productData = {
          ...newProduct,
          status: 'active',
        };
        
        const savedProduct = await api.createProduct(productData, token);
        setProducts([savedProduct, ...products]);
      }
      
      setShowAddModal(false);
    } catch (err) {
      console.error('Error saving product:', err);
      alert(`Failed to ${editingProduct ? 'update' : 'add'} product. Please try again.`);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    if (!token) {
      alert('You must be logged in to delete products');
      return;
    }

    try {
      await api.deleteProduct(id, token);
      setProducts(products.filter(p => (p._id || p.id) !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleAddProductClick = () => {
    if (onAddProductClick) {
      onAddProductClick();
    }
    setEditingProduct(null);
    setShowAddModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAddModal(true);
  };

  const activeProducts = products.filter(p => p.status === 'active').length;
  const soldProducts = products.filter(p => p.status === 'sold').length;
  const totalProducts = products.length;

  // Helper function to get product ID
  const getProductId = (product: Product) => product._id || product.id || '';

  // Helper function to get views count
  const getViews = (product: Product) => product.viewCount || product.views || 0;

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button onClick={fetchProducts} className="ml-4 underline">Retry</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={highContrast ? 'text-white' : 'text-gray-900'}>
                My Products
              </h1>
              <p className={`mt-1 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                {totalProducts} total products • {activeProducts} active • {soldProducts} sold
              </p>
            </div>
        <div className="flex gap-3">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="lg" 
            className="gap-2"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="h-5 w-5" />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="lg" 
            className="gap-2"
            onClick={() => setViewMode('list')}
          >
            <List className="h-5 w-5" />
          </Button>
          <Button size="lg" className="gap-2 shadow-lg" onClick={handleAddProductClick}>
            <Plus className="h-5 w-5" aria-hidden="true" />
            Add New Product
          </Button>
        </div>
      </div>

      {products.length === 0 ? (
        <Card className={`${highContrast ? 'border-2 border-white bg-black' : 'border-0 shadow-lg'}`}>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <div className={`mb-6 rounded-full ${highContrast ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-100 to-purple-100'} p-8`}>
                <Package className={`h-16 w-16 ${highContrast ? 'text-gray-500' : 'text-blue-600'}`} aria-hidden="true" />
              </div>
              <h2 className={`mb-2 ${highContrast ? 'text-white' : 'text-gray-900'}`}>
                No Products Yet
              </h2>
              <p className={`mb-8 max-w-md ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                Start selling by adding your first product. Share your crafts, art, or services with our community.
              </p>
              <Button size="lg" className="gap-2 shadow-lg" onClick={handleAddProductClick}>
                <Plus className="h-5 w-5" aria-hidden="true" />
                Create Your First Product
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
          {products.map((product) => {
            const productId = getProductId(product);
            const views = getViews(product);
            
            return (
            <Card 
              key={productId} 
              className={`overflow-hidden transition-all hover:shadow-xl ${
                highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'
              }`}
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                    <Badge 
                      className="absolute top-3 right-3"
                      variant={product.status === 'active' ? 'default' : product.status === 'sold' ? 'secondary' : 'outline'}
                    >
                      {product.status}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className={`line-clamp-1 ${highContrast ? 'text-white' : 'text-gray-900'}`}>
                          {product.name}
                        </h3>
                        <p className={`mt-1 line-clamp-2 text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                          {product.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600">${product.price}</p>
                          <p className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                            Stock: {product.stock}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Eye className="h-4 w-4 text-gray-400" />
                          <span className={highContrast ? 'text-gray-400' : 'text-gray-500'}>
                            {views}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 border-t pt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleDeleteProduct(productId)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex gap-4 p-4">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={highContrast ? 'text-white' : 'text-gray-900'}>
                          {product.name}
                        </h3>
                        <Badge 
                          variant={product.status === 'active' ? 'default' : product.status === 'sold' ? 'secondary' : 'outline'}
                        >
                          {product.status}
                        </Badge>
                      </div>
                      <p className={`mt-1 line-clamp-1 text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                        {product.description}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="text-blue-600">${product.price}</span>
                        <span className={highContrast ? 'text-gray-400' : 'text-gray-500'}>
                          Stock: {product.stock}
                        </span>
                        <span className={`flex items-center gap-1 ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Eye className="h-4 w-4" />
                          {views}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteProduct(productId)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
          })}
        </div>
      )}
        </>
      )}

      {showAddModal && (
        <AddProductModal
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
          onAddProduct={handleAddProduct}
          highContrast={highContrast}
          editProduct={editingProduct}
        />
      )}
    </div>
  );
}