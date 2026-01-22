import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardFooter } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  sales: number;
}

interface ProductCardProps {
  product: Product;
  highContrast: boolean;
}

export function ProductCard({ product, highContrast }: ProductCardProps) {
  return (
    <Card 
      className={`overflow-hidden transition-all hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-500 ${
        highContrast ? 'border-2 border-white bg-black' : ''
      }`}
      role="listitem"
    >
      <div className="relative">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="h-64 w-full object-cover"
        />
        {!product.inStock && (
          <Badge 
            variant="destructive" 
            className="absolute right-2 top-2"
            aria-label="Out of stock"
          >
            Out of Stock
          </Badge>
        )}
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-2 top-2 h-10 w-10 rounded-full"
          aria-label={`Add ${product.name} to favorites`}
        >
          <Heart className="h-5 w-5" />
        </Button>
      </div>
      
      <CardContent className="p-6">
        <h3 className="mb-2">
          {product.name}
        </h3>
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-2xl text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          <span className={`${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
            {product.sales} sold
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Button
          className="h-12 w-full gap-2"
          disabled={!product.inStock}
          aria-label={`Add ${product.name} to cart for $${product.price.toFixed(2)}`}
        >
          <ShoppingCart className="h-5 w-5" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
}
