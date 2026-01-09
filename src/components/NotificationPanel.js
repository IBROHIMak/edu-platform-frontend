import React, { useState } from 'react';
import {
  BellIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useNotifications } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    getNotificationsByType
  } = useNotifications();
  
  const { t } = useLanguage();

  const getNotificationIcon = (type, priority) => {
    const iconClass = "w-5 h-5";
    
    if (priority === 'urgent') {
      return <ExclamationTriangleIcon className={`${iconClass} text-red-500`} />;
    }
    
    switch (type) {
      case 'homework_assigned':
      case 'homework_graded':
      case 'homework_due_soon':
        return <InformationCircleIcon className={`${iconClass} text-blue-500`} />;
      case 'message':
        return <InformationCircleIcon className={`${iconClass} text-green-500`} />;
      case 'competition':
        return <InformationCircleIcon className={`${iconClass} text-purple-500`} />;
      default:
        return <InformationCircleIcon className={`${iconClass} text-gray-500`} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'normal': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Hozir';
    if (diffInMinutes < 60) return `${diffInMinutes} daqiqa oldin`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} soat oldin`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} kun oldin`;
    
    return date.toLocaleDateString('uz-UZ');
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : getNotificationsByType(filter);

  const filterOptions = [
    { key: 'all', label: t('all'), count: notifications.length },
    { key: 'homework', label: t('homework'), count: getNotificationsByType('homework').length },
    { key: 'message', label: t('messages'), count: getNotificationsByType('message').length },
    { key: 'competition', label: t('competitions'), count: getNotificationsByType('competition').length }
  ];

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white transition-colors"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-secondary-800 rounded-lg shadow-xl border border-secondary-200 dark:border-secondary-700 z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                  Bildirishnomalar
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                      Barchasini o'qilgan deb belgilash
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex gap-1 bg-secondary-100 dark:bg-secondary-700 rounded-lg p-1">
                {filterOptions.map(option => (
                  <button
                    key={option.key}
                    onClick={() => setFilter(option.key)}
                    className={`flex-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      filter === option.key
                        ? 'bg-white dark:bg-secondary-600 text-secondary-900 dark:text-white shadow-sm'
                        : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white'
                    }`}
                  >
                    {option.label}
                    {option.count > 0 && (
                      <span className="ml-1 text-xs opacity-75">({option.count})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <BellIcon className="w-12 h-12 text-secondary-400 mx-auto mb-3" />
                  <p className="text-secondary-600 dark:text-secondary-400">
                    Bildirishnomalar yo'q
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors border-l-4 ${
                        getPriorityColor(notification.priority)
                      } ${!notification.read ? 'bg-primary-50 dark:bg-primary-900/10' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type, notification.priority)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-secondary-900 dark:text-white">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <ClockIcon className="w-3 h-3 text-secondary-400" />
                                <span className="text-xs text-secondary-500">
                                  {formatTime(notification.createdAt)}
                                </span>
                                {notification.priority === 'urgent' && (
                                  <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded-full">
                                    Shoshilinch
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 ml-2">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 text-primary-600 hover:text-primary-700 dark:text-primary-400"
                                  title={t('markAsRead')}
                                >
                                  <CheckIcon className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => clearNotification(notification.id)}
                                className="p-1 text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300"
                                title={t('clearNotification')}
                              >
                                <XMarkIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800">
                <button
                  onClick={clearAllNotifications}
                  className="w-full text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white transition-colors"
                >
                  {t('clearAllNotifications')}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPanel;