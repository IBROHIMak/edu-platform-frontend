import React, { useState, useEffect } from 'react';
import {
  PaperAirplaneIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminMessages = () => {
  const { t } = useLanguage();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableContacts, setAvailableContacts] = useState([]);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState('');
  const [newMessageSubject, setNewMessageSubject] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');

  useEffect(() => {
    // Demo ma'lumotlarni yuklash
    setAvailableContacts([
      {
        _id: 'TEA001',
        firstName: 'Aziz',
        lastName: 'Karimov',
        role: 'teacher',
        teacherId: 'TEA001',
        subject: 'Ingliz tili',
        relationship: 'O\'qituvchi'
      },
      {
        _id: 'TEA002',
        firstName: 'Malika',
        lastName: 'Tosheva',
        role: 'teacher',
        teacherId: 'TEA002',
        subject: 'Ingliz tili',
        relationship: 'O\'qituvchi'
      },
      {
        _id: 'STU001',
        firstName: 'Ali',
        lastName: 'Valiyev',
        role: 'student',
        studentId: 'STU001',
        groupName: 'Ingliz-A1',
        relationship: 'O\'quvchi'
      },
      {
        _id: 'PAR001',
        firstName: 'Oybek',
        lastName: 'Valiyev',
        role: 'parent',
        parentType: 'father',
        childName: 'Ali Valiyev',
        relationship: 'Ota-ona'
      },
      {
        _id: 'PAR002',
        firstName: 'Gulnora',
        lastName: 'Karimova',
        role: 'parent',
        parentType: 'mother',
        childName: 'Zarina Karimova',
        relationship: 'Ota-ona'
      }
    ]);

    setConversations([
      {
        _id: 'conv1',
        user: {
          _id: 'TEA001',
          firstName: 'Aziz',
          lastName: 'Karimov',
          role: 'teacher',
          teacherId: 'TEA001'
        },
        lastMessage: {
          content: 'Salom, guruh haqida savol bor edi',
          createdAt: new Date().toISOString()
        },
        unreadCount: 2
      },
      {
        _id: 'conv2',
        user: {
          _id: 'PAR001',
          firstName: 'Oybek',
          lastName: 'Valiyev',
          role: 'parent',
          parentType: 'father'
        },
        lastMessage: {
          content: 'Bolam haqida ma\'lumot olmoqchi edim',
          createdAt: new Date().toISOString()
        },
        unreadCount: 1
      }
    ]);
  }, []);

  const fetchMessages = (conversationUserId) => {
    // Demo xabarlar
    setMessages([
      {
        _id: 'msg1',
        sender: { _id: conversationUserId, firstName: 'Aziz', lastName: 'Karimov' },
        recipient: { _id: 'admin', firstName: 'Admin', lastName: 'Boshqaruvchi' },
        content: 'Salom, guruh haqida savol bor edi',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'msg2',
        sender: { _id: 'admin', firstName: 'Admin', lastName: 'Boshqaruvchi' },
        recipient: { _id: conversationUserId, firstName: 'Aziz', lastName: 'Karimov' },
        content: 'Salom! Qanday yordam kerak?',
        createdAt: new Date().toISOString()
      }
    ]);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const simulatedMessage = {
      _id: Date.now().toString(),
      sender: { _id: 'admin', firstName: 'Admin', lastName: 'Boshqaruvchi' },
      recipient: selectedConversation.user,
      content: newMessage,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, simulatedMessage]);
    setNewMessage('');
    alert('Xabar yuborildi!');
  };

  const sendNewMessage = () => {
    if (!selectedContact || !newMessageContent.trim()) {
      alert('Qabul qiluvchi va xabar matnini kiriting!');
      return;
    }

    alert('Xabar muvaffaqiyatli yuborildi!');
    setShowNewMessageModal(false);
    setSelectedContact('');
    setNewMessageSubject('');
    setNewMessageContent('');
  };

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.user._id);
  };

  const filteredConversations = conversations.filter(conv =>
    `${conv.user.firstName} ${conv.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role) => {
    switch (role) {
      case 'teacher': return '👨‍🏫';
      case 'student': return '👨‍🎓';
      case 'parent': return '👨‍👩‍👧‍👦';
      default: return '👤';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'teacher': return 'O\'qituvchi';
      case 'student': return 'O\'quvchi';
      case 'parent': return 'Ota-ona';
      default: return 'Foydalanuvchi';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
              Xabarlar Boshqaruvi
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400">
              Barcha foydalanuvchilar bilan xabar almashing
            </p>
          </div>
          <button
            onClick={() => setShowNewMessageModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <PlusIcon className="w-4 h-4" />
            Yangi Xabar
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List */}
        <div className="w-1/3 bg-white dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="Suhbatlarni qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation._id}
                  onClick={() => selectConversation(conversation)}
                  className={`p-4 border-b border-secondary-100 dark:border-secondary-700 cursor-pointer hover:bg-secondary-50 dark:hover:bg-secondary-700 ${
                    selectedConversation?._id === conversation._id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                      {getRoleIcon(conversation.user.role)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-secondary-900 dark:text-white truncate">
                          {conversation.user.firstName} {conversation.user.lastName}
                        </h3>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">
                        {getRoleText(conversation.user.role)}
                        {conversation.user.teacherId && ` • ${conversation.user.teacherId}`}
                        {conversation.user.studentId && ` • ${conversation.user.studentId}`}
                        {conversation.user.parentType && ` • ${conversation.user.parentType === 'father' ? 'Ota' : 'Ona'}`}
                      </p>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400 truncate mt-1">
                        {conversation.lastMessage?.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <ChatBubbleLeftRightIcon className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                <p className="text-secondary-500 dark:text-secondary-400">
                  Hozircha suhbatlar yo'q
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                    {getRoleIcon(selectedConversation.user.role)}
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-900 dark:text-white">
                      {selectedConversation.user.firstName} {selectedConversation.user.lastName}
                    </h3>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      {getRoleText(selectedConversation.user.role)}
                      {selectedConversation.user.teacherId && ` • ${selectedConversation.user.teacherId}`}
                      {selectedConversation.user.studentId && ` • ${selectedConversation.user.studentId}`}
                      {selectedConversation.user.parentType && ` • ${selectedConversation.user.parentType === 'father' ? 'Ota' : 'Ona'}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.sender._id === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender._id === 'admin'
                          ? 'bg-primary-500 text-white'
                          : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender._id === 'admin' ? 'text-primary-100' : 'text-secondary-500'
                      }`}>
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Xabar yozing..."
                    className="flex-1 px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
                  Suhbatni tanlang
                </h3>
                <p className="text-secondary-500 dark:text-secondary-400">
                  Xabar almashishni boshlash uchun chap tomondagi suhbatlardan birini tanlang
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Yangi Xabar Yuborish
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Qabul qiluvchi *
                </label>
                <select
                  value={selectedContact}
                  onChange={(e) => setSelectedContact(e.target.value)}
                  className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                >
                  <option value="">Foydalanuvchini tanlang</option>
                  {availableContacts.map(contact => (
                    <option key={contact._id} value={contact._id}>
                      {getRoleIcon(contact.role)} {contact.firstName} {contact.lastName} - {getRoleText(contact.role)}
                      {contact.teacherId && ` (${contact.teacherId})`}
                      {contact.studentId && ` (${contact.studentId})`}
                      {contact.childName && ` (${contact.childName} ota-onasi)`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Mavzu (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={newMessageSubject}
                  onChange={(e) => setNewMessageSubject(e.target.value)}
                  placeholder="Xabar mavzusi"
                  className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Xabar matni *
                </label>
                <textarea
                  value={newMessageContent}
                  onChange={(e) => setNewMessageContent(e.target.value)}
                  placeholder="Xabar matnini kiriting..."
                  rows={4}
                  className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={sendNewMessage}
                disabled={!selectedContact || !newMessageContent.trim()}
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                Yuborish
              </button>
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="flex-1 bg-secondary-300 text-secondary-700 py-2 rounded-lg hover:bg-secondary-400"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;