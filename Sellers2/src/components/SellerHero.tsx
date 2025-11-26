import { Button } from './ui/button';
import { MessageCircle, Heart } from 'lucide-react';

interface SellerHeroProps {
  highContrast: boolean;
}

export function SellerHero({ highContrast }: SellerHeroProps) {
  return (
    <section 
      className={`${highContrast ? 'bg-black border-b-4 border-white' : 'bg-gradient-to-r from-blue-600 to-purple-600'} py-16`}
      aria-labelledby="hero-heading"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h1 id="hero-heading" className="mb-6">
            Empowering Sellers with Disabilities
          </h1>
          <p className="mb-8 text-xl opacity-95">
            A fully accessible marketplace designed for sellers with disabilities. 
            Share your crafts, skills, and products with the world.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button 
              size="lg" 
              variant={highContrast ? 'outline' : 'secondary'}
              className="h-14 px-8"
              aria-label="Start selling your products"
            >
              Start Selling
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className={`h-14 gap-2 px-8 ${highContrast ? 'border-white bg-transparent text-white hover:bg-white hover:text-black' : 'border-white bg-transparent text-white hover:bg-white hover:text-blue-600'}`}
              aria-label="Contact support"
            >
              <MessageCircle className="h-5 w-5" />
              Get Support
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
