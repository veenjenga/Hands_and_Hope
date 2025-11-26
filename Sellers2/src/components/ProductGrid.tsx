import { ProductCard } from './ProductCard';

interface ProductGridProps {
  highContrast: boolean;
}

const products = [
  {
    id: 1,
    name: 'Handcrafted Silver Necklace',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
    inStock: true,
    sales: 45,
  },
  {
    id: 2,
    name: 'Beaded Bracelet Set',
    price: 28.50,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500',
    inStock: true,
    sales: 89,
  },
  {
    id: 3,
    name: 'Custom Name Ring',
    price: 52.00,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500',
    inStock: true,
    sales: 123,
  },
  {
    id: 4,
    name: 'Pearl Earrings',
    price: 35.99,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500',
    inStock: false,
    sales: 67,
  },
  {
    id: 5,
    name: 'Gemstone Pendant',
    price: 58.00,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500',
    inStock: true,
    sales: 34,
  },
  {
    id: 6,
    name: 'Leather Wrap Bracelet',
    price: 32.50,
    image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500',
    inStock: true,
    sales: 56,
  },
];

export function ProductGrid({ highContrast }: ProductGridProps) {
  return (
    <section className="py-12" aria-labelledby="products-heading">
      <div className="container mx-auto px-4">
        <h2 id="products-heading" className="mb-8 text-center">
          Featured Products
        </h2>
        <div 
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label="Product listings"
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              highContrast={highContrast}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
