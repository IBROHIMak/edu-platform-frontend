import React, { useState, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const StudentMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.user._id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setConversations(response.data.data.conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error(t('errorLoadingMessages'));
      
      // If no conversations exist, fetch available contacts to show teachers
      try {
        const contactsResponse = await axios.get('/api/messages/available-contacts', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const contacts = contactsResponse.data.data.contacts;
        
        // Convert contacts to conversation format for display
        const mockConversations = contacts.map(contact => ({
          user: contact,
          lastMessage: null,
          unreadCount: 0
        }));
        
        setConversations(mockConversations);
      } catch (contactsError) {
        console.error('Error fetching contacts:', contactsError);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationWith) => {
    try {
      const response = await axios.get(`/api/messages?conversationWith=${conversationWith}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessages(response.data.data.messages.reverse()); // Reverse to show oldest first
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error(t('errorLoadingMessages'));
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSendingMessage(true);
    try {
      await axios.post('/api/messages', {
        recipient: selectedConversation.user._id,
        content: newMessage.trim(),
        type: 'text'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setNewMessage('');
      fetchMessages(selectedConversation.user._id);
      fetchConversations(); // Update conversation list
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('errorSendingMessage'));
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-secondary-200 dark:border-secondary-700 flex flex-col">
        <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
            {t('messages')}
          </h2>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            {t('chatWithTeacher')}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center">
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-secondary-400 mx-auto mb-3" />
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Hozircha suhbatlar yo'q
              </p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.user._id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedConversation?.user._id === conversation.user._id
                      ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700'
                      : 'hover:bg-secondary-50 dark:hover:bg-secondary-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {conversation.user.firstName[0]}{conversation.user.lastName[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-secondary-900 dark:text-white truncate">
                          {conversation.user.firstName} {conversation.user.lastName}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {t('teacher')}
                        </span>
                        {conversation.user.subject && (
                          <span className="text-xs text-secondary-500 dark:text-secondary-400">
                            {conversation.user.subject}
                          </span>
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <p className="text-xs text-secondary-400 dark:text-secondary-500 truncate mt-1">
                          {conversation.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {selectedConversation.user.firstName[0]}{selectedConversation.user.lastName[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-secondary-900 dark:text-white">
                    {selectedConversation.user.firstName} {selectedConversation.user.lastName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-secondary-500 dark:text-secondary-400">
                      {t('teacher')}
                    </span>
                    {selectedConversation.user.subject && (
                      <>
                        <span className="text-secondary-300">•</span>
                        <span className="text-sm text-secondary-500 dark:text-secondary-400">
                          {selectedConversation.user.subject}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <ChatBubbleLeftRightIcon className="w-12 h-12 text-secondary-400 mx-auto mb-3" />
                  <p className="text-secondary-500 dark:text-secondary-400">
                    {t('noMessagesYet')}
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.sender._id === user.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender._id === user.id
                          ? 'bg-primary-500 text-white'
                          : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender._id === user.id
                            ? 'text-primary-100'
                            : 'text-secondary-500 dark:text-secondary-400'
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
              <div className="flex gap-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('writeYourMessage')}
                  rows={1}
                  className="flex-1 resize-none input"
                  disabled={sendingMessage}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                  className="btn-primary px-3"
                >
                  {sendingMessage ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <PaperAirplaneIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2">
                {t('pressEnterToSend')}
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
                Suhbatni tanlang
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                {t('selectConversationToChat')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMessages;