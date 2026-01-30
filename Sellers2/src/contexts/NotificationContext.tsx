import { createContext, useContext, useReducer } from 'react';

// Define types
type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'activity';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string; // URL to navigate to when clicked
  };
}

interface NotificationState {
  notifications: Notification[];
}

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp' | 'read'> }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' };

// Reducer function
const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      const newNotification: Notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...action.payload,
        timestamp: new Date(),
        read: false,
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
      };

    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload ? { ...notification, read: true } : notification
        ),
      };

    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification => ({ ...notification, read: true })),
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
      };

    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };

    default:
      return state;
  }
};

// Context
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext(null);

// Provider component
export const NotificationProvider = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(notificationReducer, { notifications: [] } as NotificationState);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const markAsRead = (id: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: id });
  };

  const markAllAsRead = () => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearAllNotifications = () => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  };

  // Calculate unread count
  const unreadCount = state.notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use the context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === null) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};