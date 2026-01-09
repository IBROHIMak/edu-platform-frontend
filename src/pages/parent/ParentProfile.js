import React, { useState, useEffect } from 'react';
import { 
  UserIcon,
  PencilIcon,
  CameraIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  MoonIcon,
  SunIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  AcademicCapIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const ParentProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Use real user data from auth context
      const realData = {
        personalInfo: {
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          parentType: user?.parentType || '',
          phone: user?.phone || '',
          email: user?.email || '',
          address: user?.address || '',
          birthDate: user?.birthDate || '',
          occupation: user?.occupation || ''
        },
        children: user?.children && user.children.length > 0 ? user.children.map(child => ({
          id: child.id,
          firstName: child.firstName,
          lastName: child.lastName,
          group: child.group?.name || 'Cambridge English A2',
          teacher: child.group?.teacher || 'Sarah Johnson',
          grade: 8.5, // This would come from ratings API in real app
          attendance: 95, // This would come from attendance API in real app
          joinDate: child.createdAt || '2023-09-01'
        })) : [
          {
            id: 1,
            firstName: user?.childName?.split(' ')[0] || '',
            lastName: user?.childName?.split(' ')[1] || '',
            group: 'Cambridge English A2',
            teacher: 'Sarah Johnson',
            grade: 8.5,
            attendance: 95,
            joinDate: '2023-09-01'
          }
        ],
        statistics: {
          totalMessages: 12, // This would come from messages API in real app
          activeConversations: 2, // This would come from messages API in real app
          lastLogin: user?.lastLogin || new Date().toISOString(),
          accountCreated: user?.createdAt || new Date().toISOString()
        },
        preferences: user?.preferences || {
          notifications: {
            homework: true,
            grades: true,
            attendance: true,
            messages: true,
            competitions: false
          },
          privacy: {
            showPhone: false,
            showEmail: true,
            allowMessages: true
          }
        }
      };
      
      setProfileData(realData);
      setEditForm(realData.personalInfo);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfileData(prev => ({
        ...prev,
        personalInfo: editForm
      }));
      
      // Update auth context
      updateUser({
        ...user,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        parentType: editForm.parentType
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationChange = (key) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        notifications: {
          ...prev.preferences.notifications,
          [key]: !prev.preferences.notifications[key]
        }
      }
    }));
  };

  const handlePrivacyChange = (key) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        privacy: {
          ...prev.preferences.privacy,
          [key]: !prev.preferences.privacy[key]
        }
      }
    }));
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            {t('profile')}
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            {t('personalInfoDescription')}
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-primary flex items-center gap-2"
        >
          <PencilIcon className="w-4 h-4" />
          {isEditing ? t('cancel') : t('edit')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto">
                <UserIcon className="w-12 h-12 text-primary-600 dark:text-primary-400" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <CameraIcon className="w-4 h-4" />
              </button>
            </div>
            
            <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-1">
              {profileData?.personalInfo.firstName} {profileData?.personalInfo.lastName}
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4 capitalize">
              {profileData?.personalInfo.parentType === 'father' ? t('father') : t('mother')}
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center gap-2 text-secondary-600 dark:text-secondary-400">
                <DevicePhoneMobileIcon className="w-4 h-4" />
                <span>{profileData?.personalInfo.phone}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-secondary-600 dark:text-secondary-400">
                <EnvelopeIcon className="w-4 h-4" />
                <span>{profileData?.personalInfo.email}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-secondary-600 dark:text-secondary-400">
                <MapPinIcon className="w-4 h-4" />
                <span>{profileData?.personalInfo.address}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card mt-6">
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">
              {t('quickStats')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ChartBarIcon className="w-4 h-4 text-primary-500" />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    {t('messages')}
                  </span>
                </div>
                <span className="font-medium text-secondary-900 dark:text-white">
                  {profileData?.statistics.totalMessages}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-success-500" />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    Faol suhbatlar
                  </span>
                </div>
                <span className="font-medium text-secondary-900 dark:text-white">
                  {profileData?.statistics.activeConversations}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-warning-500" />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    {t('lastLogin')}
                  </span>
                </div>
                <span className="text-xs text-secondary-600 dark:text-secondary-400">
                  {new Date(profileData?.statistics.lastLogin).toLocaleDateString('uz-UZ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              {t('personalInfo')}
            </h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                      {t('firstName')}
                    </label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                      {t('lastName')}
                    </label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                      {t('phone')}
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                      {t('email')}
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                      {t('birthDate')}
                    </label>
                    <input
                      type="date"
                      value={editForm.birthDate}
                      onChange={(e) => setEditForm(prev => ({ ...prev, birthDate: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                      {t('occupation')}
                    </label>
                    <input
                      type="text"
                      value={editForm.occupation}
                      onChange={(e) => setEditForm(prev => ({ ...prev, occupation: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    {t('address')}
                  </label>
                  <textarea
                    value={editForm.address}
                    onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                    rows={2}
                    className="input-field"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      t('save')
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm(profileData.personalInfo);
                    }}
                    className="btn-secondary"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-secondary-600 dark:text-secondary-400">{t('firstName')}</label>
                  <p className="font-medium text-secondary-900 dark:text-white">
                    {profileData?.personalInfo.firstName}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-secondary-600 dark:text-secondary-400">{t('lastName')}</label>
                  <p className="font-medium text-secondary-900 dark:text-white">
                    {profileData?.personalInfo.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-secondary-600 dark:text-secondary-400">{t('phone')}</label>
                  <p className="font-medium text-secondary-900 dark:text-white">
                    {profileData?.personalInfo.phone}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-secondary-600 dark:text-secondary-400">{t('email')}</label>
                  <p className="font-medium text-secondary-900 dark:text-white">
                    {profileData?.personalInfo.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-secondary-600 dark:text-secondary-400">{t('birthDate')}</label>
                  <p className="font-medium text-secondary-900 dark:text-white">
                    {new Date(profileData?.personalInfo.birthDate).toLocaleDateString('uz-UZ')}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-secondary-600 dark:text-secondary-400">{t('occupation')}</label>
                  <p className="font-medium text-secondary-900 dark:text-white">
                    {profileData?.personalInfo.occupation}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-secondary-600 dark:text-secondary-400">{t('address')}</label>
                  <p className="font-medium text-secondary-900 dark:text-white">
                    {profileData?.personalInfo.address}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Children Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              {t('childrenInfo')}
            </h3>
            <div className="space-y-4">
              {profileData?.children.map((child, index) => (
                <div key={index} className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <AcademicCapIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-secondary-900 dark:text-white">
                        {child.firstName} {child.lastName}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                        <div>
                          <span className="text-secondary-600 dark:text-secondary-400">{t('group')}:</span>
                          <span className="ml-1 font-medium text-secondary-900 dark:text-white">
                            {child.group}
                          </span>
                        </div>
                        <div>
                          <span className="text-secondary-600 dark:text-secondary-400">{t('teacher')}:</span>
                          <span className="ml-1 font-medium text-secondary-900 dark:text-white">
                            {child.teacher}
                          </span>
                        </div>
                        <div>
                          <span className="text-secondary-600 dark:text-secondary-400">{t('averageGrade')}:</span>
                          <span className="ml-1 font-medium text-primary-600">
                            {child.grade}
                          </span>
                        </div>
                        <div>
                          <span className="text-secondary-600 dark:text-secondary-400">{t('attendance')}:</span>
                          <span className="ml-1 font-medium text-success-600">
                            {child.attendance}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notifications */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4 flex items-center gap-2">
                <BellIcon className="w-5 h-5" />
                {t('notifications')}
              </h3>
              <div className="space-y-3">
                {Object.entries(profileData?.preferences.notifications || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600 dark:text-secondary-400 capitalize">
                      {key === 'homework' && t('homeworkNotifications')}
                      {key === 'grades' && t('gradesNotifications')}
                      {key === 'attendance' && t('attendanceNotifications')}
                      {key === 'messages' && t('messagesNotifications')}
                      {key === 'competitions' && t('competitionsNotifications')}
                    </span>
                    <button
                      onClick={() => handleNotificationChange(key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-primary-500' : 'bg-secondary-300 dark:bg-secondary-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy & App Settings */}
            <div className="space-y-6">
              {/* Privacy */}
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4 flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5" />
                  {t('privacy')}
                </h3>
                <div className="space-y-3">
                  {Object.entries(profileData?.preferences.privacy || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">
                        {key === 'showPhone' && t('showPhone')}
                        {key === 'showEmail' && t('showEmail')}
                        {key === 'allowMessages' && t('allowMessages')}
                      </span>
                      <button
                        onClick={() => handlePrivacyChange(key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-primary-500' : 'bg-secondary-300 dark:bg-secondary-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* App Settings */}
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                  {t('appSettings')}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {theme === 'dark' ? (
                        <MoonIcon className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                      ) : (
                        <SunIcon className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                      )}
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">
                        {t('darkMode')}
                      </span>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        theme === 'dark' ? 'bg-primary-500' : 'bg-secondary-300 dark:bg-secondary-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GlobeAltIcon className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">
                        {t('language')}
                      </span>
                    </div>
                    <select
                      value={language}
                      onChange={(e) => changeLanguage(e.target.value)}
                      className="text-sm border border-secondary-300 dark:border-secondary-600 rounded px-2 py-1 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                    >
                      <option value="uz">O'zbek</option>
                      <option value="ru">Русский</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;