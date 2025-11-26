import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import ProductCard from './ProductCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MapPin, Users, Award, ChevronDown, ChevronUp } from 'lucide-react';

interface SchoolsPageProps {
  isLoggedIn: boolean;
  currentUser?: any;
  onLogout: () => void;
}

// All available products
const allProducts = [
  {
    id: 1,
    name: 'Handmade Wooden Chair',
    price: 89.99,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400',
    seller: 'Hope Valley School',
    sellerName: 'Sarah Johnson',
    rating: 4.8,
    reviewCount: 24,
    description: 'Beautiful handcrafted wooden chair with traditional oak design'
  },
  {
    id: 4,
    name: 'Knitted Scarf',
    price: 34.99,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400',
    seller: 'Hope Valley School',
    sellerName: 'Michael Chen',
    rating: 4.7,
    reviewCount: 15,
    description: 'Warm wool scarf, hand-knitted with love and care'
  },
  {
    id: 7,
    name: 'Abstract Painting',
    price: 129.99,
    category: 'Art',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
    seller: 'Hope Valley School',
    sellerName: 'Sarah Johnson',
    rating: 4.9,
    reviewCount: 12,
    description: 'Original abstract artwork on canvas'
  },
  {
    id: 9,
    name: 'Oak Coffee Table',
    price: 159.99,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    seller: 'Hope Valley School',
    sellerName: 'Sarah Johnson',
    rating: 4.9,
    reviewCount: 18,
    description: 'Rustic oak coffee table with hand-carved details'
  },
  {
    id: 10,
    name: 'Wool Blanket',
    price: 79.99,
    category: 'Textiles',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400',
    seller: 'Hope Valley School',
    sellerName: 'Michael Chen',
    rating: 4.8,
    reviewCount: 22,
    description: 'Cozy hand-knitted wool blanket in earth tones'
  },
  {
    id: 3,
    name: 'Ceramic Bowl Set',
    price: 45.99,
    category: 'Handmade Crafts',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400',
    seller: 'Bright Future Academy',
    sellerName: 'Emma Williams',
    rating: 4.9,
    reviewCount: 32,
    description: 'Set of 4 handmade ceramic bowls with unique glazing'
  },
  {
    id: 8,
    name: 'Leather Wallet',
    price: 49.99,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
    seller: 'Bright Future Academy',
    sellerName: 'David Martinez',
    rating: 4.7,
    reviewCount: 19,
    description: 'Handcrafted leather wallet with multiple card slots'
  },
  {
    id: 11,
    name: 'Ceramic Vase',
    price: 34.99,
    category: 'Handmade Crafts',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400',
    seller: 'Bright Future Academy',
    sellerName: 'Emma Williams',
    rating: 4.8,
    reviewCount: 16,
    description: 'Beautiful handmade ceramic vase with blue glaze finish'
  },
  {
    id: 12,
    name: 'Leather Messenger Bag',
    price: 129.99,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    seller: 'Bright Future Academy',
    sellerName: 'David Martinez',
    rating: 4.9,
    reviewCount: 25,
    description: 'Durable leather messenger bag with brass hardware'
  },
  {
    id: 5,
    name: 'Wooden Cutting Board',
    price: 39.99,
    category: 'Handmade Crafts',
    image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400',
    seller: 'Bright Future Academy',
    sellerName: 'Emma Williams',
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
    sellerName: 'James Taylor',
    rating: 4.5,
    reviewCount: 21,
    description: 'Eco-friendly canvas bag with hand-painted design'
  },
  {
    id: 13,
    name: 'Watercolor Landscape',
    price: 89.99,
    category: 'Art',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400',
    seller: 'Creative Minds Institute',
    sellerName: 'Lisa Anderson',
    rating: 4.7,
    reviewCount: 14,
    description: 'Original watercolor painting of serene landscape'
  },
  {
    id: 14,
    name: 'Hand-painted Tote',
    price: 29.99,
    category: 'Textiles',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
    seller: 'Creative Minds Institute',
    sellerName: 'James Taylor',
    rating: 4.6,
    reviewCount: 19,
    description: 'Canvas tote bag with unique abstract hand-painted art'
  },
  {
    id: 15,
    name: 'Acrylic Pour Art',
    price: 149.99,
    category: 'Art',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
    seller: 'Creative Minds Institute',
    sellerName: 'Lisa Anderson',
    rating: 4.9,
    reviewCount: 21,
    description: 'Vibrant acrylic pour painting with metallic accents'
  },
  {
    id: 2,
    name: 'Cotton T-Shirt',
    price: 24.99,
    category: 'Textiles',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    seller: 'Creative Minds Institute',
    sellerName: 'James Taylor',
    rating: 4.6,
    reviewCount: 18,
    description: 'Comfortable 100% cotton t-shirt with hand-painted design'
  }
];

const schools = [
  {
    id: 1,
    name: 'Hope Valley School',
    location: 'California, USA',
    students: 45,
    productsListed: 28,
    description: 'Hope Valley School specializes in woodworking and textile arts, empowering students with disabilities to create beautiful handmade products.',
    achievements: ['5 Years Active', 'Top Seller 2023', '1000+ Products Sold'],
    featuredStudents: [
      { 
        name: 'Sarah Johnson', 
        specialty: 'Woodworking', 
        bio: 'Sarah discovered her passion for woodworking at age 16. Despite being deaf, she has developed an incredible talent for creating intricate wooden furniture. She specializes in traditional oak designs and loves the feeling of transforming raw wood into beautiful, functional pieces. Sarah has been with Hope Valley School for 3 years and has sold over 150 pieces.',
        skills: 'Furniture making, wood carving, finishing',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' 
      },
      { 
        name: 'Michael Chen', 
        specialty: 'Textiles', 
        bio: 'Michael is a visually impaired textile artist who creates stunning hand-knitted scarves, blankets, and accessories. His heightened sense of touch allows him to create incredibly even and precise stitches. He has been knitting for 5 years and finds it both therapeutic and empowering. Michael loves working with natural fibers and earth-tone color palettes.',
        skills: 'Hand-knitting, textile design, color coordination',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' 
      }
    ]
  },
  {
    id: 2,
    name: 'Bright Future Academy',
    location: 'New York, USA',
    students: 32,
    productsListed: 22,
    description: 'Bright Future Academy focuses on leather crafts and ceramics, providing comprehensive training and support for students with various disabilities.',
    achievements: ['3 Years Active', 'Quality Excellence Award', '500+ Products Sold'],
    featuredStudents: [
      { 
        name: 'Emma Williams', 
        specialty: 'Ceramics', 
        bio: 'Emma has autism and found her calling in ceramic arts. Working with clay provides her with a calming, meditative experience. She has developed her own unique glazing techniques that create stunning color variations. Emma has been working with ceramics for 4 years and creates everything from functional bowls to decorative vases. Her attention to detail is extraordinary.',
        skills: 'Pottery, glazing, ceramic sculpture',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200' 
      },
      { 
        name: 'David Martinez', 
        specialty: 'Leather Crafts', 
        bio: 'David has cerebral palsy affecting his lower body, but his hands are skilled and precise. He crafts beautiful leather goods including wallets, bags, and accessories. David takes pride in every stitch and uses only premium leather. He has been perfecting his craft for 6 years and loves knowing that his products will be used and cherished by customers daily.',
        skills: 'Leather working, stitching, hardware installation',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' 
      }
    ]
  },
  {
    id: 3,
    name: 'Creative Minds Institute',
    location: 'Texas, USA',
    students: 38,
    productsListed: 35,
    description: 'Creative Minds Institute offers programs in painting, ceramics, and textile arts, fostering creativity and independence among students with disabilities.',
    achievements: ['7 Years Active', 'Community Impact Award', '2000+ Products Sold'],
    featuredStudents: [
      { 
        name: 'Lisa Anderson', 
        specialty: 'Painting', 
        bio: 'Lisa has Down syndrome and is a talented abstract artist. Her vibrant, emotionally expressive paintings have gained recognition in local galleries. She loves experimenting with acrylics, watercolors, and mixed media. Lisa has been painting for 8 years and views her art as a way to communicate her feelings and share joy with others. Each piece is truly one-of-a-kind.',
        skills: 'Abstract art, color theory, mixed media',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200' 
      },
      { 
        name: 'James Taylor', 
        specialty: 'Textiles', 
        bio: 'James has a mobility impairment and creates beautiful canvas bags with hand-painted designs. He combines his love of art and functional design to create wearable art. James has been with Creative Minds for 5 years and specializes in nature-inspired and abstract patterns. He takes great pride in knowing his bags help reduce plastic waste while showcasing artistic expression.',
        skills: 'Textile painting, pattern design, sustainable crafts',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200' 
      }
    ]
  }
];

export default function SchoolsPage({ isLoggedIn, currentUser, onLogout }: SchoolsPageProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expandedSchools, setExpandedSchools] = useState<number[]>([]);
  const [expandedSellers, setExpandedSellers] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<number[]>([]);
  const navigate = useNavigate();

  const toggleSchoolProducts = (schoolId: number) => {
    setExpandedSchools(prev => 
      prev.includes(schoolId) 
        ? prev.filter(id => id !== schoolId)
        : [...prev, schoolId]
    );
  };

  const toggleSellerProducts = (sellerName: string) => {
    setExpandedSellers(prev => 
      prev.includes(sellerName) 
        ? prev.filter(name => name !== sellerName)
        : [...prev, sellerName]
    );
  };

  const getSchoolProducts = (schoolName: string) => {
    return allProducts.filter(product => product.seller === schoolName);
  };

  const getSellerProducts = (sellerName: string) => {
    return allProducts.filter(product => product.sellerName === sellerName);
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
        />

        <main className="p-6" role="main">
          <div className="mb-8">
            <h1 className="text-[#1e2875] mb-2">Schools & Institutions</h1>
            <p className="text-gray-600">
              Meet the amazing schools and institutions whose students create beautiful handmade products
            </p>
          </div>

          <div className="space-y-8">
            {schools.map((school) => (
              <Card key={school.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#1e2875] to-[#2a3490] text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white mb-2">{school.name}</CardTitle>
                      <CardDescription className="text-gray-200 flex items-center gap-2">
                        <MapPin size={16} aria-hidden="true" />
                        {school.location}
                      </CardDescription>
                    </div>
                    <div className="flex gap-4 text-right">
                      <div>
                        <p className="text-white">{school.students}</p>
                        <p className="text-gray-200">Students</p>
                      </div>
                      <div>
                        <p className="text-white">{school.productsListed}</p>
                        <p className="text-gray-200">Products</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <p className="text-gray-700 mb-6">{school.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {school.achievements.map((achievement, index) => (
                      <Badge key={index} variant="secondary" className="bg-yellow-400 text-[#1e2875]">
                        <Award className="mr-1" size={14} aria-hidden="true" />
                        {achievement}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="text-[#1e2875] mb-4">Featured Students</h3>
                  <div className="space-y-6">
                    {school.featuredStudents.map((student, index) => {
                      const sellerProducts = getSellerProducts(student.name);
                      const isExpanded = expandedSellers.includes(student.name);
                      
                      return (
                        <Card key={index} className="border-2 border-gray-100">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={student.image} alt={student.name} />
                                <AvatarFallback className="bg-[#1e2875] text-white">
                                  {student.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="text-[#1e2875] mb-1">{student.name}</p>
                                <Badge className="mb-2 bg-[#1e2875]">{student.specialty}</Badge>
                                <p className="text-gray-600 mb-2">
                                  <strong>Skills:</strong> {student.skills}
                                </p>
                                <p className="text-gray-700">{student.bio}</p>
                              </div>
                            </div>

                            <div className="text-center mt-4">
                              <Button
                                onClick={() => toggleSellerProducts(student.name)}
                                className="bg-white hover:bg-gray-50 text-[#1e2875] border-2 border-[#1e2875] focus:ring-2 focus:ring-yellow-400"
                                aria-label={`${isExpanded ? 'Hide' : 'View'} products by ${student.name}`}
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="mr-2" size={20} aria-hidden="true" />
                                    Hide {student.name}'s Products ({sellerProducts.length})
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="mr-2" size={20} aria-hidden="true" />
                                    View {student.name}'s Products ({sellerProducts.length})
                                  </>
                                )}
                              </Button>
                            </div>

                            {isExpanded && (
                              <div className="mt-6">
                                <h4 className="text-[#1e2875] mb-4">Products by {student.name}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {sellerProducts.map(product => (
                                    <ProductCard
                                      key={product.id}
                                      product={product}
                                      onAddToCart={handleAddToCart}
                                      isInCart={cartItems.includes(product.id)}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="mt-6 text-center">
                    <Button
                      className="bg-[#1e2875] hover:bg-[#2a3490] text-white px-8 focus:ring-2 focus:ring-yellow-400"
                      aria-label={`View all products from ${school.name}`}
                      onClick={() => toggleSchoolProducts(school.id)}
                    >
                      <Users className="mr-2" size={20} aria-hidden="true" />
                      {expandedSchools.includes(school.id) ? (
                        <ChevronUp size={20} aria-hidden="true" />
                      ) : (
                        <ChevronDown size={20} aria-hidden="true" />
                      )}
                      View All Products from {school.name}
                    </Button>
                  </div>

                  {expandedSchools.includes(school.id) && (
                    <div className="mt-6">
                      <h4 className="text-[#1e2875] mb-4">Products from {school.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getSchoolProducts(school.name).map(product => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}