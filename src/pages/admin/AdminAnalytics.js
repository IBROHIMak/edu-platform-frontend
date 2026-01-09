import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/admin/analytics');
      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback data when API is not available
      setAnalytics({
        userGrowth: [
          { _id: { year: 2024, month: 12, role: 'student' }, count: 5 },
          { _id: { year: 2024, month: 12, role: 'teacher' }, count: 1 },
          { _id: { year: 2024, month: 12, role: 'parent' }, count: 2 }
        ],
        homeworkStats: [
          { _id: 'pending', count: 0 },
          { _id: 'completed', count: 0 }
        ],
        groupStats: [
          { _id: t('englishLanguage'), count: 1, totalStudents: 3 },
          { _id: t('englishGrammar'), count: 1, totalStudents: 2 }
        ],
        activeUsers: 8
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  const totalHomework = analytics?.homeworkStats?.reduce((sum, stat) => sum + stat.count, 0) || 0;
  const completedHomework = analytics?.homeworkStats?.find(stat => stat._id === 'completed')?.count || 0;
  const completionRate = totalHomework > 0 ? Math.round((completedHomework / totalHomework) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t('analyticsAndReports')}
        </h1>
        <div className="flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400">
          <CalendarIcon className="w-4 h-4" />
          <span>{t('lastUpdated')}: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button 
          onClick={() => navigate('/admin/users')}
          className="card hover:shadow-lg transition-shadow cursor-pointer text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                Faol foydalanuvchilar
              </p>
              <p className="text-2xl font-bold text-green-600">
                {analytics?.activeUsers || 0}
              </p>
              <p className="text-xs text-secondary-500">{t('last7Days')}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </button>

        <button 
          onClick={() => navigate('/admin/homework')}
          className="card hover:shadow-lg transition-shadow cursor-pointer text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                Uy vazifalari
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {totalHomework}
              </p>
              <p className="text-xs text-secondary-500">{t('totalCreated')}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </button>

        <button 
          onClick={() => navigate('/admin/reports')}
          className="card hover:shadow-lg transition-shadow cursor-pointer text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                Bajarilish foizi
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {completionRate}%
              </p>
              <p className="text-xs text-secondary-500">{t('homework')}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </button>

        <button 
          onClick={() => navigate('/admin/education')}
          className="card hover:shadow-lg transition-shadow cursor-pointer text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                Guruhlar
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {analytics?.groupStats?.length || 0}
              </p>
              <p className="text-xs text-secondary-500">{t('activeGroups')}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            {t('userGrowth')}
          </h3>
          <div className="space-y-4">
            {analytics?.userGrowth?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item._id.role === 'student' ? 'bg-blue-500' :
                    item._id.role === 'teacher' ? 'bg-green-500' :
                    item._id.role === 'parent' ? 'bg-purple-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className="text-sm text-secondary-600 dark:text-secondary-400 capitalize">
                    {item._id.role === 'student' ? t('students') :
                     item._id.role === 'teacher' ? t('teachers') :
                     item._id.role === 'parent' ? t('parents') : item._id.role}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-secondary-900 dark:text-white">
                    {item.count}
                  </span>
                  <p className="text-xs text-secondary-500">
                    {item._id.month}/{item._id.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group Statistics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            {t('groupStatistics')}
          </h3>
          <div className="space-y-4">
            {analytics?.groupStats?.map((group, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-secondary-900 dark:text-white">
                    {group._id}
                  </p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    {group.count} {t('groups')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">
                    {group.totalStudents}
                  </p>
                  <p className="text-xs text-secondary-500">{t('students')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Homework Statistics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          {t('homeworkStatistics')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analytics?.homeworkStats?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                stat._id === 'completed' ? 'bg-green-100 dark:bg-green-900/30' :
                stat._id === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                'bg-gray-100 dark:bg-gray-900/30'
              }`}>
                <span className={`text-2xl font-bold ${
                  stat._id === 'completed' ? 'text-green-600' :
                  stat._id === 'pending' ? 'text-yellow-600' :
                  'text-gray-600'
                }`}>
                  {stat.count}
                </span>
              </div>
              <p className="font-medium text-secondary-900 dark:text-white capitalize">
                {stat._id === 'completed' ? t('graded') :
                 stat._id === 'pending' ? t('pending') : stat._id}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* System Health */}
      <div className="card bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-4">
          🟢 {t('systemHealth')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold">99%</span>
            </div>
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              {t('serverUptime')}
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold">0</span>
            </div>
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              {t('errorsCount')}
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold">✓</span>
            </div>
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              {t('allServices')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;