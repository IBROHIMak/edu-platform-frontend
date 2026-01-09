import React, { useState, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserIcon,
  ClockIcon,
  CheckIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import axios from 'axios';
import toast from 'react-hot-toast';

const ParentMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      const conversationId = selectedConversation.user ? 
        selectedConversation.user._id : 
        selectedConversation.teacher.id;
      fetchMessages(conversationId);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/messages/conversations');
      setConversations(response.data.data.conversations);
      
      if (response.data.data.conversations.length > 0) {
        setSelectedConversation(response.data.data.conversations[0]);
      } else {
        // If no conversations, fetch available teachers
        const contactsResponse = await axios.get('/api/messages/available-contacts');
        const teachers = contactsResponse.data.data.contacts;
        
        if (teachers.length > 0) {
          const mockConversations = teachers.map(teacher => ({
            id: teacher._id,
            teacher: {
              id: teacher._id,
              firstName: teacher.firstName,
              lastName: teacher.lastName,
              subject: teacher.subject,
              avatar: null
            },
            lastMessage: null,
            unreadCount: 0
          }));
          
          setConversations(mockConversations);
          setSelectedConversation(mockConversations[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`/api/messages?conversationWith=${conversationId}`);
      setMessages(response.data.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const recipientId = selectedConversation.user ? 
        selectedConversation.user._id : 
        selectedConversation.teacher.id;
        
      await axios.post('/api/messages', {
        recipient: recipientId,
        content: newMessage.trim(),
        type: 'text'
      });

      setNewMessage('');
      fetchMessages(recipientId);
      fetchConversations(); // Update conversation list
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('uz-UZ', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('uz-UZ', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  const child = user?.children?.[0];

  return (
    <div className="h-[calc(100vh-200px)] flex bg-white dark:bg-secondary-900 rounded-xl overflow-hidden shadow-lg">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r border-secondary-200 dark:border-secondary-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Xabarlar
            </h2>
            <button className="p-2 text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg">
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
            <input
              type="text"
              placeholder={t('searchTeacher')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.user ? conversation.user._id : conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 border-b border-secondary-100 dark:border-secondary-800 cursor-pointer hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors ${
                selectedConversation?.user?._id === conversation.user?._id || selectedConversation?.id === conversation.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-r-2 border-r-primary-500' 
                  : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-secondary-900 dark:text-white truncate">
                      {conversation.user ? 
                        `${conversation.user.firstName} ${conversation.user.lastName}` :
                        `${conversation.teacher.firstName} ${conversation.teacher.lastName}`
                      }
                    </h3>
                    <span className="text-xs text-secondary-500">
                      {conversation.lastMessage && formatTime(conversation.lastMessage.createdAt || conversation.lastMessage.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                    {conversation.user ? conversation.user.subject : conversation.teacher.subject} o'qituvchisi
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 truncate">
                      {conversation.lastMessage && (
                        <>
                          {(conversation.lastMessage.sender === 'parent' || 
                            (conversation.lastMessage.sender && conversation.lastMessage.sender._id === user.id)) ? 'Siz: ' : ''}
                          {conversation.lastMessage.content || conversation.lastMessage.text}
                        </>
                      )}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 dark:text-white">
                    {selectedConversation.user ? 
                      `${selectedConversation.user.firstName} ${selectedConversation.user.lastName}` :
                      `${selectedConversation.teacher.firstName} ${selectedConversation.teacher.lastName}`
                    }
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    {selectedConversation.user ? selectedConversation.user.subject : selectedConversation.teacher.subject} o'qituvchisi
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary-50 dark:bg-secondary-900">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${message.sender._id === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender._id === user.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white border border-secondary-200 dark:border-secondary-700'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${
                      message.sender._id === user.id ? 'text-primary-100' : 'text-secondary-500'
                    }`}>
                      <span className="text-xs">
                        {formatTime(message.createdAt)}
                      </span>
                      {message.sender._id === user.id && (
                        <CheckIcon className={`w-3 h-3 ${message.isRead ? 'text-primary-200' : 'text-primary-300'}`} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Xabar yozing..."
                  className="flex-1 px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <PaperAirplaneIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-secondary-50 dark:bg-secondary-900">
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

      {/* Info Panel */}
      {selectedConversation && (
        <div className="w-80 border-l border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-semibold text-secondary-900 dark:text-white">
              {selectedConversation.user ? 
                `${selectedConversation.user.firstName} ${selectedConversation.user.lastName}` :
                `${selectedConversation.teacher.firstName} ${selectedConversation.teacher.lastName}`
              }
            </h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              {selectedConversation.user ? selectedConversation.user.subject : selectedConversation.teacher.subject} o'qituvchisi
            </p>
          </div>

          <div className="space-y-4">
            <div className="card">
              <h4 className="font-medium text-secondary-900 dark:text-white mb-2">
                {t('childrenInfo')}
              </h4>
              <div className="text-sm text-secondary-600 dark:text-secondary-400 space-y-1">
                <p><span className="font-medium">{t('name')}:</span> {child?.firstName} {child?.lastName}</p>
                <p><span className="font-medium">{t('group')}:</span> {child?.group?.name}</p>
                <p><span className="font-medium">{t('averageGrade')}:</span> 8.5</p>
              </div>
            </div>

            <div className="card">
              <h4 className="font-medium text-secondary-900 dark:text-white mb-2">
                Tez harakatlar
              </h4>
              <div className="space-y-2">
                <button className="w-full text-left p-2 text-sm text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded">
                  📚 Uy vazifalari haqida so'rash
                </button>
                <button className="w-full text-left p-2 text-sm text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded">
                  📊 {t('discussGrades')}
                </button>
                <button className="w-full text-left p-2 text-sm text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded">
                  🎯 Qo'shimcha mashg'ulot so'rash
                </button>
                <button className="w-full text-left p-2 text-sm text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded">
                  ⏰ Uchrashuv belgilash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentMessages;