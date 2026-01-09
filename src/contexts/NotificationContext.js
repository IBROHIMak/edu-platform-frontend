import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const { user, token } = useAuth();

  // Initialize socket connection
  useEffect(() => {
    if (user && token) {
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5002', {
        auth: {
          token,
          userId: user._id
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to notification service');
      });

      newSocket.on('notification', (notification) => {
        handleNewNotification(notification);
      });

      newSocket.on('new_message', (data) => {
        handleNewMessage(data);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from notification service');
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user, token]);

  // Handle new notification
  const handleNewNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show toast notification
    const toastOptions = {
      duration: 5000,
      position: 'top-right',
    };

    switch (notification.priority) {
      case 'urgent':
        toast.error(notification.message, toastOptions);
        break;
      case 'high':
        toast(notification.message, { 
          ...toastOptions,
          icon: '⚠️',
          style: { background: '#f59e0b', color: 'white' }
        });
        break;
      case 'normal':
        toast.success(notification.message, toastOptions);
        break;
      default:
        toast(notification.message, toastOptions);
    }

    // Play notification sound
    playNotificationSound(notification.priority);
  };

  // Handle new message
  const handleNewMessage = (data) => {
    const notification = {
      id: Date.now(),
      type: 'message',
      title: 'Yangi xabar',
      message: `${data.sender?.firstName} ${data.sender?.lastName}dan yangi xabar`,
      priority: 'normal',
      createdAt: new Date(),
      relatedData: { messageId: data.message._id }
    };

    handleNewNotification(notification);
  };

  // Play notification sound
  const playNotificationSound = (priority) => {
    try {
      const audio = new Audio();
      
      switch (priority) {
        case 'urgent':
          audio.src = '/sounds/urgent.mp3';
          break;
        case 'high':
          audio.src = '/sounds/high.mp3';
          break;
        default:
          audio.src = '/sounds/notification.mp3';
      }
      
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Could not play notification sound'));
    } catch (error) {
      console.log('Notification sound not available');
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  // Clear notification
  const clearNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
    setUnreadCount(prev => {
      const notification = notifications.find(n => n.id === notificationId);
      return notification && !notification.read ? prev - 1 : prev;
    });
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Get notifications by type
  const getNotificationsByType = (type) => {
    return notifications.filter(notif => notif.type === type);
  };

  // Get recent notifications
  const getRecentNotifications = (limit = 10) => {
    return notifications.slice(0, limit);
  };

  // Send real-time message
  const sendMessage = (messageData) => {
    if (socket) {
      socket.emit('send_message', messageData);
    }
  };

  // Join room for real-time updates
  const joinRoom = (roomId) => {
    if (socket) {
      socket.emit('join_room', roomId);
    }
  };

  // Leave room
  const leaveRoom = (roomId) => {
    if (socket) {
      socket.emit('leave_room', roomId);
    }
  };

  const value = {
    notifications,
    unreadCount,
    socket,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    getNotificationsByType,
    getRecentNotifications,
    sendMessage,
    joinRoom,
    leaveRoom
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};