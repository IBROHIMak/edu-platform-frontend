import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminParents = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    // Demo ota-onalar ma'lumotlari
    setParents([
      {
        _id: 'PAR001',
        firstName: 'Oybek',
        lastName: 'Valiyev',
        parentType: 'father',
        childName: 'Ali Valiyev',
        phone: '+998901234567',
        address: 'Toshkent shahar, Yunusobod tumani',
        children: ['STU001'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        lastLogin: '2024-02-01T09:30:00Z'
      },
      {
        _id: 'PAR002',
        firstName: 'Gulnora',
        lastName: 'Karimova',
        parentType: 'mother',
        childName: 'Zarina Karimova',
        phone: '+998907654321',
        address: 'Toshkent shahar, Mirzo Ulug\'bek tumani',
        children: ['STU002'],
        isActive: true,
        createdAt: '2024-01-20T14:00:00Z',
        lastLogin: '2024-02-02T16:45:00Z'
      }
    ]);
  }, []);

  const sendMessageToParent = (parent) => {
    // Xabarlar sahifasiga o'tish va ota-onani tanlash
    navigate('/admin/messages', { 
      state: { 
        selectedContact: parent._id,
        contactName: `${parent.firstName} ${parent.lastName}`,
        contactType: 'parent',
        childName: parent.childName
      }
    });
  };

  const filteredParents = parents.filter(parent =>
    parent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.childName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t('parents')} ({parents.length})
        </h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder={t('searchParents')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
          />
        </div>
      </div>

      {/* Parents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParents.map((parent) => (
          <div key={parent._id} className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 dark:text-white">
                  {parent.firstName} {parent.lastName}
                </h3>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 capitalize">
                  {parent.parentType === 'father' ? t('father') : t('mother')}
                </p>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600 dark:text-secondary-400">{t('child')}:</span>
                <span className="font-medium text-secondary-900 dark:text-white">
                  {parent.childName}
                </span>
              </div>
              
              {parent.phone && (
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 text-secondary-500" />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    {parent.phone}
                  </span>
                </div>
              )}
              
              {parent.email && (
                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="w-4 h-4 text-secondary-500" />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    {parent.email}
                  </span>
                </div>
              )}
              
              {parent.address && (
                <div className="flex items-start gap-2">
                  <UserIcon className="w-4 h-4 text-secondary-500 mt-0.5" />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    {parent.address}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600 dark:text-secondary-400">{t('children')}:</span>
                <span className="font-medium text-blue-600">{parent.children?.length || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600 dark:text-secondary-400">{t('status')}:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  parent.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {parent.isActive ? t('active') : t('inactive')}
                </span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-secondary-200 dark:border-secondary-700">
              <button
                onClick={() => sendMessageToParent(parent)}
                className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                Habar jonatish
              </button>
              <p className="text-xs text-secondary-500">
                {t('registeredOn')}: {new Date(parent.createdAt).toLocaleDateString()}
              </p>
              {parent.lastLogin && (
                <p className="text-xs text-secondary-500">
                  {t('lastLogin')}: {new Date(parent.lastLogin).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredParents.length === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <p className="text-secondary-500 dark:text-secondary-400">
            {searchTerm ? t('noSearchResults') : t('noParentsYet')}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminParents;