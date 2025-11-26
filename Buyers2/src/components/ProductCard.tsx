import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
    seller: string;
    rating: number;
    reviewCount: number;
  };
  onAddToCart: (productId: number) => void;
  isInCart: boolean;
}

export default function ProductCard({ product, onAddToCart, isInCart }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer focus-within:ring-2 focus-within:ring-yellow-400"
      role="article"
      aria-label={`${product.name} product card`}
    >
      <div 
        onClick={() => navigate(`/product/${product.id}`)}
        className="focus:outline-none"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate(`/product/${product.id}`);
          }
        }}
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
            loading="lazy"
          />
          <Badge className="absolute top-2 right-2 bg-[#1e2875] text-white">
            {product.category}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <h3 className="mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-2">{product.seller}</p>
          
          <div className="flex items-center gap-1 mb-2">
            <Star className="fill-yellow-400 text-yellow-400" size={16} aria-hidden="true" />
            <span className="text-gray-700">{product.rating}</span>
            <span className="text-gray-500">({product.reviewCount} reviews)</span>
          </div>
          
          <p className="text-[#1e2875]">${product.price.toFixed(2)}</p>
        </CardContent>
      </div>
      
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product.id);
          }}
          className={`w-full ${isInCart ? 'bg-green-600 hover:bg-green-700' : 'bg-[#1e2875] hover:bg-[#2a3490]'} text-white focus:ring-2 focus:ring-yellow-400`}
          disabled={isInCart}
          aria-label={isInCart ? 'Already in cart' : `Add ${product.name} to cart`}
        >
          <ShoppingCart className="mr-2" size={18} aria-hidden="true" />
          {isInCart ? 'In Cart' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
