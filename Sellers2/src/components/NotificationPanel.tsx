import { useState } from 'react';
import { Bell, X, Check, Trash2, ShoppingBag, MessageSquare, UserPlus, AlertCircle, CheckCircle, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface Notification {
  id: string;
  type: 'inquiry' | 'sale' | 'message' | 'student_activity' | 'registration' | 'approval' | 'alert' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
}

interface NotificationPanelProps {
  userRole: 'seller' | 'student' | 'teacher' | 'school';
  highContrast: boolean;
  onViewAll?: () => void;
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
          timestamp: '5 minutes ago',
          read: false,
          actionable: true,
        },
        {
          id: '2',
          type: 'sale',
          title: 'Product Sold!',
          message: 'Your watercolor painting was purchased for $45.00',
          timestamp: '2 hours ago',
          read: false,
          actionable: false,
        },
        {
          id: '3',
          type: 'approval',
          title: 'Product Approved',
          message: 'Your new listing "Handwoven Basket" has been approved',
          timestamp: '1 day ago',
          read: true,
          actionable: false,
        },
        {
          id: '4',
          type: 'message',
          title: 'New Message',
          message: 'You have a new message from a potential buyer',
          timestamp: '2 days ago',
          read: true,
          actionable: true,
        },
      ];
    case 'teacher':
      return [
        {
          id: '1',
          type: 'student_activity',
          title: 'Student Product Listed',
          message: 'Emma Johnson listed a new product: "Clay Sculpture"',
          timestamp: '30 minutes ago',
          read: false,
          actionable: true,
        },
        {
          id: '2',
          type: 'inquiry',
          title: 'Inquiry on Student Product',
          message: 'New inquiry on Michael Brown\'s product needs your approval',
          timestamp: '1 hour ago',
          read: false,
          actionable: true,
        },
        {
          id: '3',
          type: 'student_activity',
          title: 'Student Sale',
          message: 'Sophia Davis made a sale! Amount: $32.00',
          timestamp: '3 hours ago',
          read: false,
          actionable: false,
        },
        {
          id: '4',
          type: 'alert',
          title: 'Student Help Request',
          message: 'Oliver Wilson needs help updating product photos',
          timestamp: '5 hours ago',
          read: true,
          actionable: true,
        },
        {
          id: '5',
          type: 'system',
          title: 'Platform Update',
          message: 'New accessibility features have been added to help your students',
          timestamp: '1 day ago',
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
          timestamp: '1 hour ago',
          read: false,
          actionable: true,
        },
        {
          id: '2',
          type: 'registration',
          title: 'New Student Registration',
          message: '3 new students have registered and need approval',
          timestamp: '2 hours ago',
          read: false,
          actionable: true,
        },
        {
          id: '3',
          type: 'alert',
          title: 'School Milestone',
          message: 'Your school has reached 50 active student accounts!',
          timestamp: '1 day ago',
          read: false,
          actionable: false,
        },
        {
          id: '4',
          type: 'student_activity',
          title: 'Monthly Report Available',
          message: 'View your school\'s sales and activity report for November',
          timestamp: '2 days ago',
          read: true,
          actionable: true,
        },
        {
          id: '5',
          type: 'system',
          title: 'Platform Maintenance',
          message: 'Scheduled maintenance on Nov 20th from 2-4 AM EST',
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

const getNotificationColor = (type: Notification['type']) => {
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

export function NotificationPanel({ userRole, highContrast, onViewAll }: NotificationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(getNotificationsForRole(userRole));

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
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative h-12 w-12"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications - ${unreadCount} unread`}
        aria-expanded={isOpen}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -right-1 -top-1 h-6 w-6 rounded-full bg-red-600 p-0 text-xs text-white"
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Notification Panel */}
          <div 
            className={`absolute right-0 top-16 z-50 w-96 rounded-xl border shadow-2xl ${
              highContrast ? 'border-2 border-white bg-black' : 'border-gray-200 bg-white'
            }`}
            role="dialog"
            aria-label="Notifications panel"
          >
            {/* Header */}
            <div className={`flex items-center justify-between border-b p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}>
              <div>
                <h3 className={highContrast ? 'text-white' : 'text-gray-900'}>
                  Notifications
                </h3>
                <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-sm"
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close notifications"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className={`mb-3 h-12 w-12 ${highContrast ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                    No notifications yet
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    const colorClass = getNotificationColor(notification.type);
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 transition-colors hover:bg-gray-50 ${
                          !notification.read ? (highContrast ? 'bg-gray-900' : 'bg-blue-50') : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${colorClass}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`text-sm ${highContrast ? 'text-white' : 'text-gray-900'}`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" aria-label="Unread" />
                              )}
                            </div>
                            <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className={`text-xs ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                                {notification.timestamp}
                              </span>
                              <div className="flex gap-2">
                                {notification.actionable && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs"
                                  >
                                    View
                                  </Button>
                                )}
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2"
                                    onClick={() => markAsRead(notification.id)}
                                    aria-label="Mark as read"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2"
                                  onClick={() => deleteNotification(notification.id)}
                                  aria-label="Delete notification"
                                >
                                  <Trash2 className="h-3 w-3 text-red-600" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className={`border-t p-3 text-center ${highContrast ? 'border-white' : 'border-gray-200'}`}>
                <Button variant="link" size="sm" className="text-sm" onClick={onViewAll}>
                  View All Notifications
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}