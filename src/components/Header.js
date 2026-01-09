import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bars3Icon, 
  MoonIcon, 
  SunIcon,
  ChevronDownIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  WifiIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useOffline } from '../hooks/useOffline';
import NotificationPanel from './NotificationPanel';

const Header = ({ onMenuClick, user }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, t, availableLanguages } = useLanguage();
  const { isOffline } = useOffline();

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
  };

  return (
    <header className="bg-white dark:bg-secondary-800 shadow-sm border-b border-secondary-200 dark:border-secondary-700">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-700 lg:hidden"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-secondary-900 dark:text-white">
              {t('platformName')}
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Offline/Online Status */}
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

          {/* Language selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="appearance-none bg-transparent border border-secondary-300 dark:border-secondary-600 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {availableLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-700"
          >
            {theme === 'dark' ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>

          {/* Notifications */}
          <NotificationPanel />

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700"
            >
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                  {user?.fullName}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 capitalize">
                  {user?.role}
                </p>
              </div>
              <ChevronDownIcon className="w-4 h-4 text-secondary-500" />
            </button>

            {/* Dropdown menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 py-1 z-50">
                <button 
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate(`/${user?.role}/profile`);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700"
                >
                  <UserCircleIcon className="w-4 h-4" />
                  {t('profile')}
                </button>
                <button 
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    // Settings page yo'q bo'lsa, profil sahifasiga yo'naltirish
                    navigate(`/${user?.role}/profile`);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700"
                >
                  <Cog6ToothIcon className="w-4 h-4" />
                  {t('settings')}
                </button>
                <hr className="my-1 border-secondary-200 dark:border-secondary-700" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  {t('logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;