import { useEffect, useState } from 'react';
import { MessageSquare, Search, Filter, Reply, Archive, Trash2, Clock, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Inquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  productName: string;
  productImage: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'replied' | 'archived';
  priority: 'low' | 'medium' | 'high';
}

interface InquiriesPageProps {
  highContrast: boolean;
}

const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: '1',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    customerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    productName: 'Handmade Ceramic Bowl',
    productImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=100',
    message: 'Hi! I love this ceramic bowl. Is it dishwasher safe? Also, do you offer international shipping? I\'m located in Canada.',
    timestamp: '2 hours ago',
    status: 'pending',
    priority: 'high',
  },
  {
    id: '2',
    customerName: 'Michael Chen',
    customerEmail: 'michael.chen@email.com',
    customerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    productName: 'Watercolor Landscape Painting',
    productImage: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=100',
    message: 'Beautiful work! Could you tell me more about the paper quality? Is this piece signed?',
    timestamp: '5 hours ago',
    status: 'pending',
    priority: 'medium',
  },
  {
    id: '3',
    customerName: 'Emily Rodriguez',
    customerEmail: 'emily.r@email.com',
    customerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
    productName: 'Sterling Silver Bracelet',
    productImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=100',
    message: 'I\'m interested in this bracelet. What size is it? Can it be adjusted?',
    timestamp: '1 day ago',
    status: 'replied',
    priority: 'medium',
  },
  {
    id: '4',
    customerName: 'David Kim',
    customerEmail: 'david.kim@email.com',
    customerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    productName: 'Woven Wall Hanging',
    productImage: 'https://images.unsplash.com/photo-1566206091558-7f218b696731?w=100',
    message: 'Would you be able to create a custom size version of this? I need something about 3 feet wide.',
    timestamp: '1 day ago',
    status: 'pending',
    priority: 'low',
  },
  {
    id: '5',
    customerName: 'Jessica Martinez',
    customerEmail: 'jessica.m@email.com',
    customerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica',
    productName: 'Handmade Greeting Cards Set',
    productImage: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=100',
    message: 'These cards are perfect! Do you offer bulk discounts? I need about 20 sets for a corporate event.',
    timestamp: '2 days ago',
    status: 'replied',
    priority: 'high',
  },
  {
    id: '6',
    customerName: 'Robert Taylor',
    customerEmail: 'robert.t@email.com',
    customerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert',
    productName: 'Clay Sculpture - Abstract',
    productImage: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=100',
    message: 'Stunning piece! Is this still available? I\'d like to purchase it as a gift.',
    timestamp: '3 days ago',
    status: 'archived',
    priority: 'low',
  },
];

export function InquiriesPage({ highContrast }: InquiriesPageProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'replied' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:5000';

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/dashboard/inquiries`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        const mapped = (data || []).map((item: any) => ({
          ...item,
          timestamp: item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Unknown'
        }));

        setInquiries(mapped);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiries();
  }, [API_URL]);

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesFilter = filter === 'all' || inquiry.status === filter;
    const matchesSearch = 
      inquiry.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = inquiries.filter(i => i.status === 'pending').length;
  const repliedCount = inquiries.filter(i => i.status === 'replied').length;

  const handleReply = async () => {
    if (!selectedInquiry || !replyText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/dashboard/inquiries/${selectedInquiry.id}/reply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: replyText })
      });
      if (!res.ok) return;

      setInquiries(inquiries.map(i =>
        i.id === selectedInquiry.id ? { ...i, status: 'replied' as const } : i
      ));
      setReplyText('');
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Reply error:', error);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/dashboard/inquiries/${id}/archive`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;

      setInquiries(inquiries.map(i =>
        i.id === id ? { ...i, status: 'archived' as const } : i
      ));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
    } catch (error) {
      console.error('Archive error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/dashboard/inquiries/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;

        setInquiries(inquiries.filter(i => i.id !== id));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'replied':
        return <CheckCircle className="h-4 w-4" />;
      case 'archived':
        return <Archive className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
        <CardContent className="py-12 text-center">
          <p className={highContrast ? 'text-gray-300' : 'text-gray-600'}>Loading inquiries...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={highContrast ? 'text-white' : 'text-gray-900'}>
            Customer Inquiries
          </h1>
          <p className={`mt-1 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
            {pendingCount} pending • {repliedCount} replied • {inquiries.length} total
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search inquiries by customer or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-10"
              />
            </div>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-4 h-12">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="replied">Replied</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {filteredInquiries.length === 0 ? (
        <Card className={`${highContrast ? 'border-2 border-white bg-black' : 'border-0 shadow-lg'}`}>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <div className={`mb-6 rounded-full ${highContrast ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-100 to-purple-100'} p-8`}>
                <MessageSquare className={`h-16 w-16 ${highContrast ? 'text-gray-500' : 'text-blue-600'}`} />
              </div>
              <h2 className={`mb-2 ${highContrast ? 'text-white' : 'text-gray-900'}`}>
                No Inquiries Found
              </h2>
              <p className={`max-w-md ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                {searchQuery ? 'Try a different search term' : 'Customer inquiries will appear here'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Inquiries List */}
          <div className="space-y-4 lg:col-span-2">
            {filteredInquiries.map((inquiry) => (
              <Card
                key={inquiry.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  highContrast ? 'border-2 border-white bg-black' : 'shadow'
                } ${selectedInquiry?.id === inquiry.id ? 'ring-2 ring-blue-600' : ''}`}
                onClick={() => setSelectedInquiry(inquiry)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src={inquiry.customerAvatar} alt={inquiry.customerName} />
                      <AvatarFallback>{inquiry.customerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className={highContrast ? 'text-white' : 'text-gray-900'}>
                            {inquiry.customerName}
                          </h4>
                          <p className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                            {inquiry.productName}
                          </p>
                        </div>
                        <Badge className={getPriorityColor(inquiry.priority)}>
                          {inquiry.priority}
                        </Badge>
                      </div>
                      <p className={`line-clamp-2 text-sm ${highContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                        {inquiry.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                          {inquiry.timestamp}
                        </span>
                        <Badge variant={inquiry.status === 'pending' ? 'default' : 'secondary'} className="gap-1">
                          {getStatusIcon(inquiry.status)}
                          {inquiry.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Inquiry Details */}
          <div className="lg:col-span-3">
            <div className="sticky top-6">
              {selectedInquiry ? (
                <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                  <CardHeader className="border-b">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={selectedInquiry.customerAvatar} alt={selectedInquiry.customerName} />
                          <AvatarFallback>{selectedInquiry.customerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className={highContrast ? 'text-white' : 'text-gray-900'}>
                            {selectedInquiry.customerName}
                          </CardTitle>
                          <p className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                            {selectedInquiry.customerEmail}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleArchive(selectedInquiry.id)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(selectedInquiry.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    {/* Product Info */}
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <img 
                        src={selectedInquiry.productImage} 
                        alt={selectedInquiry.productName}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                          Product Inquiry
                        </p>
                        <p className={highContrast ? 'text-white' : 'text-gray-900'}>
                          {selectedInquiry.productName}
                        </p>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                        Customer Message
                      </label>
                      <div className={`mt-2 rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200 bg-gray-50'}`}>
                        <p className={highContrast ? 'text-white' : 'text-gray-900'}>
                          {selectedInquiry.message}
                        </p>
                        <p className={`mt-2 text-sm ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                          Received {selectedInquiry.timestamp}
                        </p>
                      </div>
                    </div>

                    {/* Reply Section */}
                    <div>
                      <label className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                        Your Reply
                      </label>
                      <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply to the customer..."
                        rows={4}
                        className="mt-2 resize-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button size="lg" className="flex-1 gap-2" onClick={handleReply}>
                        <Reply className="h-5 w-5" />
                        Send Reply
                      </Button>
                      <Button variant="outline" size="lg" onClick={() => handleArchive(selectedInquiry.id)}>
                        Archive
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <MessageSquare className={`mb-4 h-16 w-16 ${highContrast ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`text-center ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                      Select an inquiry to view details and reply
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
