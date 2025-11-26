import { MapPin, Star, Award, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface SellerProfileProps {
  highContrast: boolean;
}

export function SellerProfile({ highContrast }: SellerProfileProps) {
  return (
    <section 
      className={`border-b ${highContrast ? 'border-white' : 'border-gray-200'} py-12`}
      aria-labelledby="seller-info"
    >
      <div className="container mx-auto px-4">
        <div className={`mx-auto max-w-5xl rounded-lg ${highContrast ? 'border-2 border-white bg-black' : 'bg-white shadow-lg'} p-8`}>
          <div className="flex flex-col items-start gap-8 md:flex-row">
            <Avatar className="h-32 w-32 border-4 border-blue-500">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=seller" alt="Sarah's profile picture" />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 id="seller-info" className="mb-2 flex items-center gap-2">
                    Sarah Martinez
                    <CheckCircle className="h-6 w-6 text-blue-500" aria-label="Verified seller" />
                  </h2>
                  <div className="mb-3 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1" role="img" aria-label="Rating: 4.9 out of 5 stars">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span>4.9 (287 reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-5 w-5" />
                      <span>Portland, OR</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="gap-1 px-3 py-1">
                      <Award className="h-4 w-4" />
                      Top Seller
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      Handmade Jewelry
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      200+ Sales
                    </Badge>
                  </div>
                </div>
                
                <Button size="lg" className="h-12 px-6" aria-label="Follow Sarah Martinez">
                  Follow
                </Button>
              </div>
              
              <p className={highContrast ? 'text-white' : 'text-gray-700'}>
                Hi! I'm Sarah, and I create custom handmade jewelry from my accessible home studio. 
                Each piece is crafted with care and attention to detail. I'm passionate about creating 
                beautiful, unique items that bring joy to others. Thank you for supporting small businesses 
                and sellers with disabilities!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
