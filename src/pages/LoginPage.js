import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  UserIcon, 
  AcademicCapIcon, 
  UsersIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const { login, isAuthenticated, user } = useAuth();
  const { language, changeLanguage, availableLanguages, t } = useLanguage();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    reset();
    setLoginError('');
  }, [selectedRole, reset]);

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  const onSubmit = async (data) => {
    console.log('Login attempt with data:', data);
    setIsLoading(true);
    setLoginError('');
    
    try {
      const result = await login({ ...data, role: selectedRole });
      console.log('Login result:', result);
      setIsLoading(false);
      
      if (result.success) {
        console.log('Login successful, user:', result.user);
        // Navigation will be handled by the redirect above
      } else {
        console.error('Login failed:', result.message);
        setLoginError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Network error occurred');
      setIsLoading(false);
    }
  };

  const roleOptions = [
    {
      key: 'student',
      label: t('studentLogin'),
      icon: AcademicCapIcon,
      color: 'bg-blue-500',
      description: t('studentDescription')
    },
    {
      key: 'teacher',
      label: t('teacherLogin'),
      icon: UserIcon,
      color: 'bg-green-500',
      description: t('teacherDescription')
    },
    {
      key: 'parent',
      label: t('parentLogin'),
      icon: UsersIcon,
      color: 'bg-purple-500',
      description: t('parentDescription')
    },
    {
      key: 'admin',
      label: t('adminLogin'),
      icon: UserIcon,
      color: 'bg-red-500',
      description: t('adminDescription')
    }
  ];

  // Role-specific form fields - AS PER ORIGINAL REQUIREMENTS
  const getFormFields = () => {
    switch (selectedRole) {
      case 'student':
        return [
          { name: 'firstName', label: t('firstName'), placeholder: t('enterFirstName'), required: true },
          { name: 'lastName', label: t('lastName'), placeholder: t('enterLastName'), required: true },
          { name: 'studentId', label: t('studentId'), placeholder: t('studentId'), required: true },
          { name: 'password', label: t('password'), placeholder: t('enterPassword'), required: true, type: 'password' }
        ];
      case 'teacher':
        return [
          { name: 'firstName', label: t('firstName'), placeholder: t('enterFirstName'), required: true },
          { name: 'lastName', label: t('lastName'), placeholder: t('enterLastName'), required: true },
          { name: 'teacherId', label: t('teacherId'), placeholder: t('teacherId'), required: true },
          { name: 'subject', label: t('subject'), placeholder: t('englishLanguageTeaching'), required: true },
          { name: 'password', label: t('password'), placeholder: t('enterPassword'), required: true, type: 'password' }
        ];
      case 'parent':
        return [
          { name: 'firstName', label: t('firstName'), placeholder: t('enterFirstName'), required: true },
          { name: 'lastName', label: t('lastName'), placeholder: t('enterLastName'), required: true },
          { 
            name: 'parentType', 
            label: t('parentType'), 
            required: true, 
            type: 'select',
            options: [
              { value: '', label: t('selectType') },
              { value: 'father', label: t('father') },
              { value: 'mother', label: t('mother') }
            ]
          },
          { name: 'childName', label: t('childName'), placeholder: t('childName'), required: true },
          { name: 'password', label: t('password'), placeholder: t('enterPassword'), required: true, type: 'password' }
        ];
      case 'admin':
        return [
          { name: 'firstName', label: t('firstName'), placeholder: t('enterFirstName'), required: true },
          { name: 'lastName', label: t('lastName'), placeholder: t('enterLastName'), required: true },
          { name: 'password', label: t('password'), placeholder: t('enterPassword'), required: true, type: 'password' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">CE</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t('platformName')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('platformDescription')}
          </p>
        </div>

        {/* Settings */}
        <div className="flex justify-center gap-4">
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {availableLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Role Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-6">
            {t('login')}
          </h2>
          <div className="grid gap-4 mb-6">
            {roleOptions.map((role) => (
              <button
                key={role.key}
                onClick={() => setSelectedRole(role.key)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedRole === role.key
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className={`w-12 h-12 ${role.color} rounded-lg flex items-center justify-center shadow-sm`}>
                  <role.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {role.label}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {role.description}
                  </p>
                </div>
                {selectedRole === role.key && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Login Form */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
              {selectedRole === 'student' && t('studentLogin')}
              {selectedRole === 'teacher' && t('teacherLogin')}
              {selectedRole === 'parent' && t('parentLogin')}
              {selectedRole === 'admin' && t('adminLogin')}
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Debug info */}
              <div className="text-xs text-gray-500 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                Selected role: {selectedRole}
              </div>
              
              {getFormFields().map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.type === 'select' ? (
                    <select
                      {...register(field.name, { required: field.required ? `${field.label} tanlash majburiy` : false })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="relative">
                      <input
                        {...register(field.name, { required: field.required ? `${field.label} kiritish majburiy` : false })}
                        type={field.type === 'password' ? (showPassword ? 'text' : 'password') : 'text'}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={field.placeholder}
                      />
                      {field.type === 'password' && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>
                  )}
                  
                  {errors[field.name] && (
                    <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>
                  )}
                </div>
              ))}

              {loginError && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
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
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🔑 {t('testAccounts')}:
              </p>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                {selectedRole === 'student' && (
                  <>
                    <p><strong>Ali Valiyev</strong> - ID: STU001 - {t('password')}: teacher123</p>
                    <p><strong>Malika Toshmatova</strong> - ID: STU002 - {t('password')}: teacher123</p>
                    <p><strong>Bobur Rahimov</strong> - ID: STU003 - {t('password')}: teacher123</p>
                  </>
                )}
                {selectedRole === 'teacher' && (
                  <>
                    <p><strong>Aziz Karimov</strong> - ID: TEA001 - {t('subject')}: {t('englishLanguage')} - {t('password')}: teacher123</p>
                  </>
                )}
                {selectedRole === 'parent' && (
                  <>
                    <p><strong>Oybek Valiyev</strong> - {t('parentType')}: {t('father')} - {t('childName')}: Ali Valiyev - {t('password')}: teacher123</p>
                    <p><strong>Gulnora Toshmatova</strong> - {t('parentType')}: {t('mother')} - {t('childName')}: Malika Toshmatova - {t('password')}: teacher123</p>
                  </>
                )}
                {selectedRole === 'admin' && (
                  <>
                    <p><strong>{t('adminManager')}</strong> - {t('password')}: admin123</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 {t('platformName')}. {t('allRightsReserved')}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;