import { useState, useEffect } from 'react';
import { Bell, X, Check, ExternalLink } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

interface NotificationDropdownProps {
  adminRole: 'super-admin' | 'admin';
}

export const NotificationDropdown = ({ adminRole }: { adminRole: 'super-admin' | 'admin' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  } = useNotifications();

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.notification-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Mark notification as read and navigate to action URL if available
  const handleNotificationClick = (notification: any) => {
    if (notification.action && notification.action.url) {
      // Navigate to the relevant page based on the action URL
      // For now, we'll just mark as read
      markAsRead(notification.id);
    } else {
      markAsRead(notification.id);
    }
  };

  // Get notification icon based on type
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Bell className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'activity':
        return <Bell className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get notification color based on type
  const getColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-500/10';
      case 'error':
        return 'border-l-red-500 bg-red-500/10';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-500/10';
      case 'info':
        return 'border-l-blue-500 bg-blue-500/10';
      case 'activity':
        return 'border-l-purple-500 bg-purple-500/10';
      default:
        return 'border-l-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="notification-dropdown relative">
      <button
        className="px-3 py-1 border border-gray-600 text-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-700 relative"
        onClick={toggleDropdown}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-white font-semibold">Notifications</h3>
            <div className="flex gap-2">
              <button
                onClick={markAllAsRead}
                className="text-xs text-gray-300 hover:text-white hover:bg-gray-700 px-2 py-1 rounded"
              >
                <Check className="h-3 w-3 mr-1 inline" />
                Mark all read
              </button>
              <button
                onClick={clearAllNotifications}
                className="text-xs text-gray-300 hover:text-white hover:bg-gray-700 px-2 py-1 rounded"
              >
                Clear all
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-700 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-gray-750' : ''
                  } ${getColor(notification.type)}`}
                  style={{ borderLeftWidth: '4px' }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium truncate ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                          {notification.title}
                        </h4>
                        <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-300' : 'text-gray-500'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  
                  {notification.action && (
                    <div className="mt-2 flex justify-end">
                      <button
                        className="border border-gray-600 text-gray-300 rounded-md px-2 py-1 text-xs hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          // In a real app, this would navigate to the action URL
                          console.log('Navigating to:', notification.action.url);
                          markAsRead(notification.id);
                        }}
                      >
                        {notification.action.label}
                        <ExternalLink className="h-3 w-3 ml-1 inline" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};