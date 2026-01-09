import React, { useState, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserIcon,
  MagnifyingGlassIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const TeacherMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    fetchConversations();
    fetchStudentsAndParents();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.user._id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/messages/conversations');
      setConversations(response.data.data.conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error(t('errorLoadingMessages'));
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsAndParents = async () => {
    try {
      const response = await axios.get('/api/messages/available-contacts');
      const contacts = response.data.data.contacts;
      
      const studentContacts = contacts.filter(contact => contact.role === 'student');
      const parentContacts = contacts.filter(contact => contact.role === 'parent');
      
      setStudents(studentContacts);
      setParents(parentContacts);
    } catch (error) {
      console.error('Error fetching students and parents:', error);
    }
  };

  const fetchMessages = async (conversationWith) => {
    try {
      const response = await axios.get(`/api/messages?conversationWith=${conversationWith}`);
      setMessages(response.data.data.messages.reverse());
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
      });
      
      setNewMessage('');
      fetchMessages(selectedConversation.user._id);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('errorSendingMessage'));
    } finally {
      setSendingMessage(false);
    }
  };

  const startNewConversation = async (recipientId) => {
    try {
      // Find the user in students or parents list
      const recipient = students.find(s => s._id === recipientId) || 
                       parents.find(p => p._id === recipientId);
      
      if (recipient) {
        setSelectedConversation({
          user: recipient,
          lastMessage: null,
          unreadCount: 0
        });
        setMessages([]);
        setShowNewMessageModal(false);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-secondary-200 dark:border-secondary-700 flex flex-col">
        <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              {t('messages')}
            </h2>
            <button
              onClick={() => setShowNewMessageModal(true)}
              className="btn-primary text-sm"
            >
              {t('newMessage')}
            </button>
          </div>
          
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center">
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-secondary-400 mx-auto mb-3" />
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                {searchTerm ? t('nothingFound') : t('noConversationsYet')}
              </p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredConversations.map((conversation) => (
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
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          conversation.user.role === 'student' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        }`}>
                          {conversation.user.role === 'student' ? t('student') : t('parent')}
                        </span>
                        {conversation.user.studentId && (
                          <span className="text-xs text-secondary-500 dark:text-secondary-400">
                            ID: {conversation.user.studentId}
                          </span>
                        )}
                        {conversation.user.groupName && (
                          <span className="text-xs text-secondary-500 dark:text-secondary-400">
                            {conversation.user.groupName}
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
                    <span className="text-sm text-secondary-500 dark:text-secondary-400 capitalize">
                      {selectedConversation.user.role === 'student' ? t('student') : t('parent')}
                    </span>
                    {selectedConversation.user.studentId && (
                      <>
                        <span className="text-secondary-300">•</span>
                        <span className="text-sm text-secondary-500 dark:text-secondary-400">
                          ID: {selectedConversation.user.studentId}
                        </span>
                      </>
                    )}
                    {selectedConversation.user.groupName && (
                      <>
                        <span className="text-secondary-300">•</span>
                        <span className="text-sm text-secondary-500 dark:text-secondary-400">
                          {selectedConversation.user.groupName}
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

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
              {t('newMessage')}
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-secondary-900 dark:text-white mb-2">
                  {t('students')}
                </h3>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {students.map((student) => (
                    <button
                      key={student._id}
                      onClick={() => startNewConversation(student._id)}
                      className="w-full flex items-center gap-3 p-2 hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm text-secondary-900 dark:text-white">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-xs text-secondary-500 dark:text-secondary-400">
                          ID: {student.studentId} • {student.groupName}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {parents.length > 0 && (
                <div>
                  <h3 className="font-medium text-secondary-900 dark:text-white mb-2">
                    {t('parents')}
                  </h3>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {parents.map((parent) => (
                      <button
                        key={parent._id}
                        onClick={() => startNewConversation(parent._id)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {parent.firstName[0]}{parent.lastName[0]}
                          </span>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm text-secondary-900 dark:text-white">
                            {parent.firstName} {parent.lastName}
                          </div>
                          <div className="text-xs text-secondary-500 dark:text-secondary-400">
                            {parent.parentType} • {parent.childName}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="btn-outline"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherMessages;