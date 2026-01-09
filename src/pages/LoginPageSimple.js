import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  MoonIcon, 
  SunIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPageSimple = () => {
  const [selectedRole, setSelectedRole] = useState('student');
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isAuthenticated, user } = useAuth();
  const { t, language, changeLanguage, availableLanguages } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('🚀 Login form submitted:', {
      selectedRole,
      formData,
      apiUrl: process.env.REACT_APP_API_URL
    });

    try {
      const loginData = { ...formData, role: selectedRole };
      console.log('📤 Sending login request:', loginData);
      
      const result = await login(loginData);
      console.log('📥 Login result:', result);
      
      if (!result.success) {
        console.error('❌ Login failed:', result.message);
        setError(result.message || 'Login failed');
      } else {
        console.log('✅ Login successful, redirecting...');
      }
    } catch (err) {
      console.error('💥 Login exception:', err);
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormFields = () => {
    switch (selectedRole) {
      case 'student':
        return (
          <>
            <input
              type="text"
              placeholder={t('firstName')}
              value={formData.firstName || ''}
              className="w-full p-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-secondary-400"
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder={t('lastName')}
              value={formData.lastName || ''}
              className="w-full p-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-secondary-400"
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder={`${t('studentId')} (ixtiyoriy)`}
              value={formData.studentId || ''}
              className="w-full p-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-secondary-400"
              onChange={(e) => handleInputChange('studentId', e.target.value)}
            />
            <input
              type="text"
              placeholder="Guruh nomi (Ingliz-A1)"
              value={formData.groupName || ''}
              className="w-full p-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-secondary-400"
              onChange={(e) => handleInputChange('groupName', e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Ota-ona telefon raqami (+998901234567)"
              value={formData.parentPhone || ''}
              className="w-full p-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-secondary-400"
              onChange={(e) => handleInputChange('parentPhone', e.target.value)}
              required
            />
            <input
              type="password"
              placeholder={t('password')}
              value={formData.password || ''}
              className="w-full p-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-secondary-400"
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />
          </>
        );
      case 'teacher':
        return (
          <>
            <input
              type="text"
              placeholder={t('firstName')}
              value={formData.firstName || ''}
              className="w-full p-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-secondary-400"
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder={t('lastName')}
              value={formData.lastName || ''}
              className="w-full p-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-secondary-400"
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder={`${t('teacherId')} (ixtiyoriy)`}
              value={formData.teacherId || ''}
              className="w-full p-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-secondary-400"
              onChange={(e) => handleInputChange('teacherId', e.target.value)}
            />
            <input
              type="text"
              placeholder={`${t('subject')} (ixtiyoriy - istalgan fan yozish mumkin)`}
              value={formData.subject || ''}
              className="w-full p-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-secondary-400"
              onChange={(e) => handleInputChange('subject', e.target.value)}
            />
            <input
              type="password"
              placeholder={t('password')}
              value={formData.password || ''}
              className="w-full p-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-secondary-400"
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />
          </>
        );
      case 'parent':
        return (
          <>
            <input
              type="text"
              placeholder={t('firstName')}
              value={formData.firstName || ''}
              className="w-full p-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-secondary-400"
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder={t('lastName')}
              value={formData.lastName || ''}
              className="w-full p-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-secondary-400"
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
            />
            <select
              value={formData.parentType || ''}
              className="w-full p-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
              onChange={(e) => handleInputChange('parentType', e.target.value)}
              required
            >
              <option value="">{t('selectType')}</option>
              <option value="father">{t('father')}</option>
              <option value="mother">{t('mother')}</option>
            </select>
            <input
              type="text"
              placeholder={`${t('childName')} (Ali Valiyev)`}
              value={formData.childName || ''}
              className="w-full p-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-secondary-400"
              onChange={(e) => handleInputChange('childName', e.target.value)}
              required
            />
            <input
              type="password"
              placeholder={t('password')}
              value={formData.password || ''}
              className="w-full p-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-secondary-400"
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />
          </>
        );
      case 'admin':
        return (
          <>
            <input
              type="text"
              placeholder={`${t('firstName')} (Admin)`}
              value={formData.firstName || ''}
              className="w-full p-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-secondary-400"
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder={`${t('lastName')} (Boshqaruvchi)`}
              value={formData.lastName || ''}
              className="w-full p-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-secondary-400"
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
            />
            <input
              type="password"
              placeholder={t('password')}
              value={formData.password || ''}
              className="w-full p-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-secondary-400"
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-secondary-900 dark:to-secondary-800 flex items-center justify-center p-4">
      {/* Theme and Language Controls */}
      <div className="fixed top-4 right-4 flex items-center gap-2 z-10">
        {/* Language Selector */}
        <div className="relative">
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="appearance-none bg-white dark:bg-secondary-800 border border-gray-300 dark:border-secondary-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          >
            {availableLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-white dark:bg-secondary-800 border border-gray-300 dark:border-secondary-600 text-gray-600 dark:text-secondary-400 hover:bg-gray-50 dark:hover:bg-secondary-700"
        >
          {theme === 'dark' ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="max-w-md w-full bg-white dark:bg-secondary-800 rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">CE</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('platformName')}
          </h1>
          <p className="text-gray-600 dark:text-secondary-400">
            {t('platformDescription')}
          </p>
          <p className="text-xs text-gray-500 dark:text-secondary-500 mt-2">
            API: {process.env.REACT_APP_API_URL || 'http://localhost:5004'}
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { key: 'student', label: t('studentRole') },
              { key: 'teacher', label: t('teacherRole') },
              { key: 'parent', label: t('parentRole') },
              { key: 'admin', label: 'Admin' }
            ].map((role) => (
              <button
                key={role.key}
                onClick={() => {
                  setSelectedRole(role.key);
                  setFormData({});
                  setError('');
                }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedRole === role.key
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'border-gray-200 dark:border-secondary-600 bg-gray-50 dark:bg-secondary-700 text-gray-700 dark:text-secondary-300 hover:border-gray-300 dark:hover:border-secondary-500'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFormFields()}

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                {t('loading')}
              </>
            ) : (
              t('login')
            )}
          </button>
        </form>

        {/* Test credentials */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-secondary-700 rounded-lg">
          <p className="text-sm font-medium text-gray-700 dark:text-secondary-300 mb-2">
            🔑 {t('testAccounts')}:
          </p>
          <div className="text-xs text-gray-600 dark:text-secondary-400 space-y-1">
            {selectedRole === 'student' && (
              <p><strong>Ali Valiyev</strong> - ID: STU001 - Tel: +998901234567 - {t('password')}: Password123!</p>
            )}
            {selectedRole === 'teacher' && (
              <p><strong>Aziz Karimov</strong> - ID: TEA001 - {t('subject')}: Ingliz tili - {t('password')}: teacher123</p>
            )}
            {selectedRole === 'parent' && (
              <p><strong>Oybek Valiyev</strong> - {t('parentType')}: {t('father')} - {t('childName')}: Ali Valiyev - {t('password')}: teacher123</p>
            )}
            {selectedRole === 'admin' && (
              <p><strong>Admin Boshqaruvchi</strong> - {t('password')}: Admin123!@#</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPageSimple;