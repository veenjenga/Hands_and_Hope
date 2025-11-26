import { useState } from 'react';
import { Bell, Check, Trash2, ShoppingBag, MessageSquare, UserPlus, AlertCircle, CheckCircle, Package, Filter, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Notification {
  id: string;
  type: 'inquiry' | 'sale' | 'message' | 'student_activity' | 'registration' | 'approval' | 'alert' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
  details?: string;
}

interface NotificationsPageProps {
  userRole: 'seller' | 'student' | 'teacher' | 'school';
  highContrast: boolean;
}

// Mock notifications based on user role
const getNotificationsForRole = (role: string): Notification[] => {
  switch (role) {
    case 'seller':
    case 'student':
      return [
        {
          id: '1',
          type: 'inquiry',
          title: 'New Inquiry',
          message: 'Sarah Johnson is interested in your handmade pottery set',
          details: 'Sarah asked: "Is this dishwasher safe? Also, do you ship internationally?"',
          timestamp: '5 minutes ago',
          read: false,
          actionable: true,
        },
        {
          id: '2',
          type: 'sale',
          title: 'Product Sold!',
          message: 'Your watercolor painting was purchased for $45.00',
          details: 'Customer: John Smith. Shipping address: 123 Main St, New York, NY 10001',
          timestamp: '2 hours ago',
          read: false,
          actionable: false,
        },
        {
          id: '3',
          type: 'message',
          title: 'New Message',
          message: 'You have a new message from Maria Garcia',
          details: 'Maria: "I love your work! Can you create a custom piece for me?"',
          timestamp: '5 hours ago',
          read: false,
          actionable: true,
        },
        {
          id: '4',
          type: 'approval',
          title: 'Product Approved',
          message: 'Your new listing "Handwoven Basket" has been approved',
          timestamp: '1 day ago',
          read: true,
          actionable: false,
        },
        {
          id: '5',
          type: 'inquiry',
          title: 'Product Question',
          message: 'Customer inquiry about "Ceramic Vase"',
          details: 'Question: "What are the dimensions of this vase?"',
          timestamp: '1 day ago',
          read: true,
          actionable: true,
        },
        {
          id: '6',
          type: 'sale',
          title: 'Sale Completed',
          message: 'Ceramic Bowl sold for $28.00',
          timestamp: '2 days ago',
          read: true,
          actionable: false,
        },
        {
          id: '7',
          type: 'system',
          title: 'Platform Update',
          message: 'New accessibility features have been added',
          details: 'We\'ve improved screen reader support and added new contrast modes.',
          timestamp: '3 days ago',
          read: true,
          actionable: false,
        },
      ];
    case 'teacher':
      return [
        {
          id: '1',
          type: 'student_activity',
          title: 'Student Product Listed',
          message: 'Emma Johnson listed a new product: "Clay Sculpture"',
          details: 'This product needs your approval before it goes live on the marketplace.',
          timestamp: '30 minutes ago',
          read: false,
          actionable: true,
        },
        {
          id: '2',
          type: 'inquiry',
          title: 'Inquiry on Student Product',
          message: 'New inquiry on Michael Brown\'s product needs your approval',
          details: 'Customer asking about shipping details for the hand-painted mug.',
          timestamp: '1 hour ago',
          read: false,
          actionable: true,
        },
        {
          id: '3',
          type: 'student_activity',
          title: 'Student Sale',
          message: 'Sophia Davis made a sale! Amount: $32.00',
          details: 'Product: Handmade greeting cards set. Great work by Sophia!',
          timestamp: '3 hours ago',
          read: false,
          actionable: false,
        },
        {
          id: '4',
          type: 'alert',
          title: 'Student Help Request',
          message: 'Oliver Wilson needs help updating product photos',
          details: 'Oliver is having trouble with the photo upload feature.',
          timestamp: '5 hours ago',
          read: true,
          actionable: true,
        },
        {
          id: '5',
          type: 'student_activity',
          title: 'New Student Account',
          message: 'Isabella Martinez joined your class',
          timestamp: '1 day ago',
          read: true,
          actionable: false,
        },
        {
          id: '6',
          type: 'system',
          title: 'Platform Update',
          message: 'New tools for teachers now available',
          details: 'Check out the new bulk approval feature and student analytics dashboard.',
          timestamp: '2 days ago',
          read: true,
          actionable: false,
        },
      ];
    case 'school':
      return [
        {
          id: '1',
          type: 'registration',
          title: 'New Teacher Registration',
          message: 'Dr. Maria Garcia has requested to join your school',
          details: 'Education: PhD in Special Education, 15 years experience. Needs approval.',
          timestamp: '1 hour ago',
          read: false,
          actionable: true,
        },
        {
          id: '2',
          type: 'registration',
          title: 'New Student Registrations',
          message: '3 new students have registered and need approval',
          details: 'Students: Alex Thompson, Ryan Lee, and Mia Chen',
          timestamp: '2 hours ago',
          read: false,
          actionable: true,
        },
        {
          id: '3',
          type: 'alert',
          title: 'School Milestone Reached!',
          message: 'Your school has reached 50 active student accounts',
          details: 'Congratulations! Your school community is growing. Total sales this month: $2,450',
          timestamp: '1 day ago',
          read: false,
          actionable: false,
        },
        {
          id: '4',
          type: 'student_activity',
          title: 'Monthly Report Available',
          message: 'View your school\'s sales and activity report for November',
          details: 'Total sales: $3,240. Most active teacher: Dr. Sarah Williams',
          timestamp: '2 days ago',
          read: true,
          actionable: true,
        },
        {
          id: '5',
          type: 'alert',
          title: 'Teacher Performance',
          message: 'Mr. James Miller\'s students achieved highest sales this week',
          timestamp: '3 days ago',
          read: true,
          actionable: false,
        },
        {
          id: '6',
          type: 'system',
          title: 'Platform Maintenance',
          message: 'Scheduled maintenance on Nov 20th from 2-4 AM EST',
          details: 'The platform will be briefly unavailable during this time for important updates.',
          timestamp: '3 days ago',
          read: true,
          actionable: false,
        },
      ];
    default:
      return [];
  }
};

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'inquiry':
      return MessageSquare;
    case 'sale':
      return ShoppingBag;
    case 'message':
      return MessageSquare;
    case 'student_activity':
      return Package;
    case 'registration':
      return UserPlus;
    case 'approval':
      return CheckCircle;
    case 'alert':
      return AlertCircle;
    case 'system':
      return Bell;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: Notification['type'], highContrast: boolean) => {
  if (highContrast) {
    return 'text-white bg-gray-800';
  }
  switch (type) {
    case 'inquiry':
      return 'text-blue-600 bg-blue-100';
    case 'sale':
      return 'text-green-600 bg-green-100';
    case 'message':
      return 'text-purple-600 bg-purple-100';
    case 'student_activity':
      return 'text-indigo-600 bg-indigo-100';
    case 'registration':
      return 'text-orange-600 bg-orange-100';
    case 'approval':
      return 'text-green-600 bg-green-100';
    case 'alert':
      return 'text-yellow-600 bg-yellow-100';
    case 'system':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export function NotificationsPage({ userRole, highContrast }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>(getNotificationsForRole(userRole));
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === 'all' || !n.read;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         n.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={highContrast ? 'text-white' : 'text-gray-900'}>Notifications</h1>
          <p className={`text-lg ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button size="lg" onClick={markAllAsRead} className="gap-2">
            <Check className="h-5 w-5" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Search and Filter */}
      <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-10"
              />
            </div>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as 'all' | 'unread')} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
                <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Notifications List */}
        <div className="space-y-4 lg:col-span-2">
          {filteredNotifications.length === 0 ? (
            <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className={`mb-4 h-16 w-16 ${highContrast ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={highContrast ? 'text-white' : 'text-gray-900'}>No notifications found</h3>
                <p className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                  {searchQuery ? 'Try a different search term' : 'You\'re all caught up!'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const colorClass = getNotificationColor(notification.type, highContrast);
              const isSelected = selectedNotification?.id === notification.id;
              
              return (
                <Card 
                  key={notification.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    highContrast ? 'border-2 border-white bg-black' : 'shadow'
                  } ${isSelected ? 'ring-2 ring-blue-600' : ''} ${
                    !notification.read ? (highContrast ? 'bg-gray-900' : 'bg-blue-50') : ''
                  }`}
                  onClick={() => {
                    setSelectedNotification(notification);
                    if (!notification.read) {
                      markAsRead(notification.id);
                    }
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${colorClass}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={highContrast ? 'text-white' : 'text-gray-900'}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" aria-label="Unread" />
                          )}
                        </div>
                        <p className={highContrast ? 'text-gray-300' : 'text-gray-700'}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                            {notification.timestamp}
                          </span>
                          <div className="flex gap-2">
                            {notification.actionable && (
                              <Badge variant="default">Action Required</Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              aria-label="Delete notification"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Notification Details Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            {selectedNotification ? (
              <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                <CardHeader>
                  <CardTitle className={highContrast ? 'text-white' : 'text-gray-900'}>
                    Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                      Title
                    </label>
                    <p className={highContrast ? 'text-white' : 'text-gray-900'}>
                      {selectedNotification.title}
                    </p>
                  </div>
                  <div>
                    <label className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                      Message
                    </label>
                    <p className={highContrast ? 'text-white' : 'text-gray-900'}>
                      {selectedNotification.message}
                    </p>
                  </div>
                  {selectedNotification.details && (
                    <div>
                      <label className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                        Additional Details
                      </label>
                      <p className={highContrast ? 'text-white' : 'text-gray-900'}>
                        {selectedNotification.details}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                      Time
                    </label>
                    <p className={highContrast ? 'text-white' : 'text-gray-900'}>
                      {selectedNotification.timestamp}
                    </p>
                  </div>
                  {selectedNotification.actionable && (
                    <div className="flex gap-2 pt-4">
                      <Button size="lg" className="flex-1">
                        Take Action
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={() => deleteNotification(selectedNotification.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className={`mb-4 h-12 w-12 ${highContrast ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`text-center text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                    Select a notification to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
