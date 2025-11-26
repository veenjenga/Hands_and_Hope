import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Star, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';

interface ProductDetailPageProps {
  isLoggedIn: boolean;
  currentUser?: any;
  onLogout: () => void;
}

// Mock data - same as HomePage
const products = [
  {
    id: 1,
    name: 'Handmade Wooden Chair',
    price: 89.99,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800',
    seller: 'Hope Valley School',
    rating: 4.8,
    reviewCount: 24,
    description: 'Beautiful handcrafted wooden chair with traditional design. Each piece is carefully crafted by our talented students at Hope Valley School. Made from sustainable oak wood with a natural finish.',
    stock: 5,
    reviews: [
      { id: 1, user: 'Sarah M.', rating: 5, comment: 'Absolutely beautiful craftsmanship! Worth every penny.', date: '2024-01-15' },
      { id: 2, user: 'John D.', rating: 4, comment: 'Great quality, took a bit longer to arrive but very happy with it.', date: '2024-01-10' },
      { id: 3, user: 'Emma W.', rating: 5, comment: 'Supporting a great cause and got a wonderful product!', date: '2024-01-05' }
    ]
  },
  // Add more products with similar structure...
];

const recommendedProducts = [
  {
    id: 5,
    name: 'Wooden Cutting Board',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=300',
    rating: 4.8
  },
  {
    id: 3,
    name: 'Ceramic Bowl Set',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300',
    rating: 4.9
  }
];

export default function ProductDetailPage({ isLoggedIn, currentUser, onLogout }: ProductDetailPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);

  const product = products.find(p => p.id === Number(id)) || products[0];

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      // Add to cart logic
      alert('Product added to cart!');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    // Submit review logic
    alert('Thank you for your feedback!');
    setNewReview('');
    setNewRating(5);
  };

  const ratingDistribution = [
    { stars: 5, count: 15, percentage: 62 },
    { stars: 4, count: 6, percentage: 25 },
    { stars: 3, count: 2, percentage: 8 },
    { stars: 2, count: 1, percentage: 4 },
    { stars: 1, count: 0, percentage: 0 }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar selectedCategories={selectedCategories} onCategoryChange={setSelectedCategories} />
      
      <div className="flex-1">
        <Header 
          isLoggedIn={isLoggedIn} 
          currentUser={currentUser} 
          onLogout={onLogout}
        />

        <main className="p-6" role="main">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 focus:ring-2 focus:ring-yellow-400"
            aria-label="Go back"
          >
            ← Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Product Images */}
            <div>
              <div className="aspect-square rounded-lg overflow-hidden bg-white mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div>
              <Badge className="mb-2 bg-[#1e2875]">{product.category}</Badge>
              <h1 className="text-[#1e2875] mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="text-gray-700">{product.rating}</span>
                <span className="text-gray-500">({product.reviewCount} reviews)</span>
              </div>

              <p className="text-[#1e2875] mb-4">${product.price.toFixed(2)}</p>

              <div className="mb-4">
                <p className="text-gray-700 mb-2">Sold by: <span className="text-[#1e2875]">{product.seller}</span></p>
                <p className="text-gray-700">Stock: <span className="text-green-600">{product.stock} available</span></p>
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>

              <div className="flex gap-4 mb-6">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#1e2875] hover:bg-[#2a3490] text-white py-6 focus:ring-2 focus:ring-yellow-400"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingCart className="mr-2" aria-hidden="true" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-[#1e2875] text-[#1e2875] hover:bg-[#1e2875] hover:text-white focus:ring-2 focus:ring-yellow-400"
                  aria-label="Add to wishlist"
                >
                  <Heart />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-[#1e2875] text-[#1e2875] hover:bg-[#1e2875] hover:text-white focus:ring-2 focus:ring-yellow-400"
                  aria-label="Share product"
                >
                  <Share2 />
                </Button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <section className="mb-12" aria-labelledby="reviews-title">
            <h2 id="reviews-title" className="text-[#1e2875] mb-6">Customer Reviews & Ratings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-[#1e2875] mb-2">{product.rating}</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={24}
                        className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">Based on {product.reviewCount} reviews</p>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardContent className="p-6">
                  <h3 className="mb-4">Rating Distribution</h3>
                  {ratingDistribution.map((dist) => (
                    <div key={dist.stars} className="flex items-center gap-4 mb-2">
                      <span className="text-gray-700 w-12">{dist.stars} star</span>
                      <Progress value={dist.percentage} className="flex-1" aria-label={`${dist.stars} star rating: ${dist.percentage}%`} />
                      <span className="text-gray-600 w-12">{dist.count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Review Form */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="mb-4">Write a Review</h3>
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <Label htmlFor="rating" className="mb-2 block">Your Rating</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setNewRating(rating)}
                          className="focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                          aria-label={`Rate ${rating} stars`}
                        >
                          <Star
                            size={32}
                            className={rating <= newRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="review">Your Review</Label>
                    <Textarea
                      id="review"
                      placeholder="Share your experience with this product..."
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      className="min-h-[100px] focus:border-[#1e2875] focus:ring-[#1e2875]"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="bg-[#1e2875] hover:bg-[#2a3490] text-white focus:ring-2 focus:ring-yellow-400"
                  >
                    Submit Review
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-4">
              {product.reviews?.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-[#1e2875] text-white">
                          {review.user.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p>{review.user}</p>
                          <p className="text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Recommended Products */}
          <section aria-labelledby="recommended-title">
            <h2 id="recommended-title" className="text-[#1e2875] mb-6">Recommended Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((rec) => (
                <Card 
                  key={rec.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/product/${rec.id}`)}
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={rec.image}
                      alt={rec.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-2">{rec.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-[#1e2875]">${rec.price.toFixed(2)}</p>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
                        <span className="text-gray-700">{rec.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
