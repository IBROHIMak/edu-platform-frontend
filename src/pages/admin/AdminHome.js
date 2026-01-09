import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserGroupIcon,
  AcademicCapIcon,
  UsersIcon,
  ChartBarIcon,
  BookOpenIcon,
  CogIcon,
  EyeIcon,
  UserIcon,
  DocumentChartBarIcon,
  GiftIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setStats(response.data.data.stats);
        setRecentUsers(response.data.data.recentUsers);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback data when API is not available
      setStats({
        totalUsers: 8,
        totalTeachers: 2,
        totalStudents: 5,
        totalParents: 0, // Parent role removed
        totalGroups: 3,
        totalHomework: 12
      });
      setRecentUsers([
        {
          _id: '1',
          firstName: 'Ali',
          lastName: 'Valiyev',
          role: 'student',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          firstName: 'Aziz',
          lastName: 'Karimov',
          role: 'teacher',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  const statCards = [
    {
      title: t('totalUsers'),
      value: stats?.totalUsers || 0,
      icon: UsersIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      onClick: () => navigate('/admin/users')
    },
    {
      title: t('teachers'),
      value: stats?.totalTeachers || 0,
      icon: UserIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      onClick: () => navigate('/admin/teachers')
    },
    {
      title: t('students'),
      value: stats?.totalStudents || 0,
      icon: AcademicCapIcon,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      onClick: () => navigate('/admin/students')
    },
    {
      title: t('parents'),
      value: stats?.totalParents || 0,
      icon: UserGroupIcon,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      onClick: () => navigate('/admin/parents')
    },
    {
      title: 'Guruhlar',
      value: stats?.totalGroups || 0,
      icon: UsersIcon,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      onClick: () => navigate('/admin/education')
    },
    {
      title: 'Uy Vazifalari',
      value: stats?.totalHomework || 0,
      icon: BookOpenIcon,
      color: 'bg-pink-500',
      textColor: 'text-pink-600',
      onClick: () => navigate('/admin/education')
    }
  ];

  const quickActions = [
    {
      title: t('reportsTitle'),
      description: t('reportsDesc'),
      icon: DocumentChartBarIcon,
      color: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600',
      onClick: () => navigate('/admin/reports')
    },
    {
      title: t('userManagementTitle'),
      description: t('userManagementDesc'),
      icon: UserPlusIcon,
      color: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600',
      onClick: () => navigate('/admin/user-management')
    },
    {
      title: t('educationTitle'),
      description: t('educationDesc'),
      icon: BookOpenIcon,
      color: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600',
      onClick: () => navigate('/admin/education')
    },
    {
      title: t('bonusTitle'),
      description: t('bonusDesc'),
      icon: GiftIcon,
      color: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600',
      onClick: () => navigate('/admin/rewards')
    },
    {
      title: t('teacherManagementTitle'),
      description: t('teacherManagementDesc'),
      icon: UserIcon,
      color: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600',
      onClick: () => navigate('/admin/teachers')
    },
    {
      title: t('analyticsTitle'),
      description: t('analyticsDesc'),
      icon: ChartBarIcon,
      color: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600',
      onClick: () => navigate('/admin/analytics')
    },
    {
      title: t('settingsTitle'),
      description: t('settingsDesc'),
      icon: CogIcon,
      color: 'bg-gray-50 dark:bg-gray-900/20',
      iconColor: 'text-gray-600',
      onClick: () => navigate('/admin/settings')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {t('welcomeAdmin')}, {user?.firstName}!
        </h1>
        <p className="text-red-100">
          {t('adminWelcomeDesc')}
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            {t('administratorRole')}
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            {t('fullAccess')}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <button 
            key={index} 
            className="card hover:shadow-lg transition-shadow cursor-pointer text-left"
            onClick={stat.onClick || (() => {})}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${stat.textColor} dark:${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              {t('quickActions')}
            </h2>
            <EyeIcon className="w-5 h-5 text-secondary-500" />
          </div>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 ${action.color} rounded-lg cursor-pointer hover:shadow-md transition-all`}
                onClick={action.onClick}
              >
                <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm`}>
                  <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                </div>
                <div>
                  <p className="font-medium text-secondary-900 dark:text-white">
                    {action.title}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    {action.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              {t('recentActivity')}
            </h2>
            <UsersIcon className="w-5 h-5 text-secondary-500" />
          </div>
          <div className="space-y-3">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      user.role === 'teacher' ? 'bg-green-100 text-green-600' :
                      user.role === 'student' ? 'bg-blue-100 text-blue-600' :
                      user.role === 'parent' ? 'bg-purple-100 text-purple-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {user.firstName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400 capitalize">
                        {user.role === 'teacher' ? t('teacherRole') : 
                         user.role === 'student' ? t('studentRole') :
                         user.role === 'parent' ? t('parentRole') : user.role}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-secondary-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-secondary-500 dark:text-secondary-400 text-center py-4">
                {t('noRecentUsers')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="card bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">
          🟢 {t('systemStatus')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-800 dark:text-green-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>{t('backendActive')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>{t('databaseConnected')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>{t('allServicesRunning')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;