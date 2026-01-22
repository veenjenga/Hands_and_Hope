import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import ProductCard from './ProductCard';
import { Button } from './ui/button';
import { ShoppingBag } from 'lucide-react';
import heroImage from 'figma:asset/d2fb7d885d1d47742f3ffd01a5bcc98de3caebce.png';
import { AccessibilitySettings } from './AccessibilityMenu';

interface HomePageProps {
  isLoggedIn: boolean;
  currentUser?: any;
  onLogout: () => void;
  accessibilitySettings?: AccessibilitySettings;
  onAccessibilityChange?: (settings: AccessibilitySettings) => void;
}

// Mock product data
const allProducts = [
  {
    id: 1,
    name: 'Handmade Wooden Chair',
    price: 89.99,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400',
    seller: 'Hope Valley School',
    rating: 4.8,
    reviewCount: 24,
    description: 'Beautiful handcrafted wooden chair with traditional design'
  },
  {
    id: 2,
    name: 'Cotton T-Shirt',
    price: 24.99,
    category: 'Textiles',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    seller: 'Bright Future Academy',
    rating: 4.6,
    reviewCount: 18,
    description: 'Comfortable 100% cotton t-shirt, handmade with care'
  },
  {
    id: 3,
    name: 'Ceramic Bowl Set',
    price: 45.99,
    category: 'Handmade Crafts',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400',
    seller: 'Creative Minds Institute',
    rating: 4.9,
    reviewCount: 32,
    description: 'Set of 4 handmade ceramic bowls with unique glazing'
  },
  {
    id: 4,
    name: 'Knitted Scarf',
    price: 34.99,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400',
    seller: 'Hope Valley School',
    rating: 4.7,
    reviewCount: 15,
    description: 'Warm wool scarf, hand-knitted with love'
  },
  {
    id: 5,
    name: 'Wooden Cutting Board',
    price: 39.99,
    category: 'Handmade Crafts',
    image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400',
    seller: 'Bright Future Academy',
    rating: 4.8,
    reviewCount: 28,
    description: 'Durable hardwood cutting board with natural finish'
  },
  {
    id: 6,
    name: 'Canvas Tote Bag',
    price: 19.99,
    category: 'Textiles',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400',
    seller: 'Creative Minds Institute',
    rating: 4.5,
    reviewCount: 21,
    description: 'Eco-friendly canvas bag with hand-painted design'
  },
  {
    id: 7,
    name: 'Abstract Painting',
    price: 129.99,
    category: 'Art',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
    seller: 'Hope Valley School',
    rating: 4.9,
    reviewCount: 12,
    description: 'Original abstract artwork on canvas'
  },
  {
    id: 8,
    name: 'Leather Wallet',
    price: 49.99,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
    seller: 'Bright Future Academy',
    rating: 4.7,
    reviewCount: 19,
    description: 'Handcrafted leather wallet with multiple card slots'
  }
];

export default function HomePage({ isLoggedIn, currentUser, onLogout, accessibilitySettings, onAccessibilityChange }: HomePageProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [showHero, setShowHero] = useState(true);
  const [cartItems, setCartItems] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    filterProducts();
  }, [selectedCategories, searchQuery]);

  const filterProducts = () => {
    let filtered = allProducts;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category)
      );
    }

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
    if (searchQuery.trim() !== '' || selectedCategories.length > 0) {
      setShowHero(false);
    }
  };

  const handleSearch = () => {
    filterProducts();
  };

  const handleAddToCart = (productId: number) => {
    if (!cartItems.includes(productId)) {
      setCartItems([...cartItems, productId]);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar selectedCategories={selectedCategories} onCategoryChange={setSelectedCategories} />
      
      <div className="flex-1">
        <Header 
          isLoggedIn={isLoggedIn} 
          currentUser={currentUser} 
          onLogout={onLogout}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
          cartItemCount={cartItems.length}
          accessibilitySettings={accessibilitySettings}
          onAccessibilityChange={onAccessibilityChange}
        />

        <main id="main-content" className="p-6" role="main">
          {showHero && (
            <section 
              className="relative rounded-lg overflow-hidden mb-8"
              aria-labelledby="hero-title"
            >
              <div 
                className="absolute inset-0"
                style={{ 
                  backgroundImage: `url(${heroImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
              <div className="absolute inset-0 bg-black/60"></div>
              <div className="relative z-10 p-16 text-center">
                <h2 id="hero-title" className="text-white mb-4">
                  Welcome to Hands and Hope
                </h2>
                <p className="text-white mb-8 max-w-3xl mx-auto">
                  Discover amazing products from trusted sellers around the world. Your one-stop destination for quality trade.
                </p>
                <Button 
                  onClick={() => setShowHero(false)}
                  className="bg-[#1e2875] hover:bg-[#2a3490] text-white px-8 py-6 shadow-lg"
                  aria-label="Start shopping"
                >
                  <ShoppingBag className="mr-2" size={20} aria-hidden="true" />
                  Start Shopping
                </Button>
              </div>
            </section>
          )}

          <section aria-labelledby="products-title">
            <h2 id="products-title" className="text-[#1e2875] mb-6">
              {searchQuery || selectedCategories.length > 0 ? 'Search Results' : 'Featured Products'}
            </h2>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16" role="status">
                <p className="text-gray-500">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    onAddToCart={handleAddToCart}
                    isInCart={cartItems.includes(product.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}