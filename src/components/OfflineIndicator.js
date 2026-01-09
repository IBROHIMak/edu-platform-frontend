import React, { useState, useEffect } from 'react';
import { 
  WifiIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useOffline, offlineQueue } from '../hooks/useOffline';
import { useLanguage } from '../contexts/LanguageContext';

const OfflineIndicator = () => {
  const { isOffline, wasOffline } = useOffline();
  const { t } = useLanguage();
  const [showNotification, setShowNotification] = useState(false);
  const [queueSize, setQueueSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Offline holatga o'tganda notification ko'rsatish
    if (isOffline) {
      setShowNotification(true);
      setQueueSize(offlineQueue.size());
    }

    // Online holatga qaytganda queue ni process qilish
    if (!isOffline && wasOffline) {
      setShowNotification(true);
      processOfflineQueue();
      
      // 3 soniyadan keyin notification ni yashirish
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  }, [isOffline, wasOffline]);

  const processOfflineQueue = async () => {
    if (offlineQueue.size() > 0) {
      setIsProcessing(true);
      await offlineQueue.processQueue();
      setQueueSize(offlineQueue.size());
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (!showNotification && !isOffline) {
    return null;
  }

  return (
    <>
      {/* Offline Banner */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-2 text-center text-sm font-medium">
          <div className="flex items-center justify-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4" />
            <span>{t('offlineMode')}</span>
            <button
              onClick={handleRetry}
              className="ml-4 px-2 py-1 bg-red-700 hover:bg-red-800 rounded text-xs transition-colors"
            >
              <ArrowPathIcon className="w-3 h-3 inline mr-1" />
              {t('retry')}
            </button>
          </div>
        </div>
      )}

      {/* Connection Status Notification */}
      {showNotification && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full transition-all duration-300 ${
          showNotification ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}>
          <div className={`rounded-lg shadow-lg p-4 ${
            isOffline 
              ? 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800' 
              : 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 ${
                isOffline ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
              }`}>
                {isOffline ? (
                  <ExclamationTriangleIcon className="w-5 h-5" />
                ) : (
                  <CheckCircleIcon className="w-5 h-5" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium ${
                  isOffline 
                    ? 'text-red-800 dark:text-red-200' 
                    : 'text-green-800 dark:text-green-200'
                }`}>
                  {isOffline ? t('connectionLost') : t('connectionRestored')}
                </h4>
                
                <p className={`mt-1 text-xs ${
                  isOffline 
                    ? 'text-red-600 dark:text-red-300' 
                    : 'text-green-600 dark:text-green-300'
                }`}>
                  {isOffline ? (
                    <>
                      {t('offlineDescription')}
                      {queueSize > 0 && (
                        <span className="block mt-1">
                          {queueSize} {t('pendingActions')}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      {t('onlineDescription')}
                      {isProcessing && (
                        <span className="block mt-1 flex items-center gap-1">
                          <ArrowPathIcon className="w-3 h-3 animate-spin" />
                          {t('syncingData')}
                        </span>
                      )}
                    </>
                  )}
                </p>
              </div>
              
              <button
                onClick={() => setShowNotification(false)}
                className={`flex-shrink-0 text-xs ${
                  isOffline 
                    ? 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200' 
                    : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200'
                }`}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Network Status Icon in Header */}
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          isOffline 
            ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
            : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
        }`}>
          <WifiIcon className={`w-3 h-3 ${isOffline ? 'opacity-50' : ''}`} />
          <span className="hidden sm:inline">
            {isOffline ? t('offline') : t('online')}
          </span>
        </div>
        
        {queueSize > 0 && (
          <div className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 px-2 py-1 rounded-full text-xs font-medium">
            {queueSize} {t('pending')}
          </div>
        )}
      </div>
    </>
  );
};

export default OfflineIndicator;