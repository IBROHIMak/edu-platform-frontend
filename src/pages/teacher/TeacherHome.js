import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserGroupIcon,
  BookOpenIcon,
  TrophyIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const TeacherHome = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalGroups: 0,
    pendingHomework: 0,
    unreadMessages: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Check if user is from localStorage (admin-created)
      const isLocalStorageUser = localStorage.getItem('token')?.startsWith('localStorage_');
      
      if (isLocalStorageUser) {
        // Show demo data for localStorage users
        console.log('👨‍🏫 Showing demo data for admin-created teacher');
        setStats({
          totalStudents: 28,
          totalGroups: 2,
          pendingHomework: 8,
          unreadMessages: 3
        });
        
        setRecentActivity([
          { type: 'homework', message: 'Yangi vazifa yaratildi: Grammar Exercise', time: '2 soat oldin' },
          { type: 'message', message: 'Ota-onadan xabar keldi', time: '3 soat oldin' },
          { type: 'submission', message: 'O\'quvchi vazifani topshirdi', time: '5 soat oldin' },
          { type: 'grade', message: 'Baholar yangilandi', time: '1 kun oldin' }
        ]);
      } else {
        // This would fetch actual data from your API for real users
        setStats({
          totalStudents: 0,
          totalGroups: 0,
          pendingHomework: 0,
          unreadMessages: 0
        });
        
        setRecentActivity([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Show empty data for errors
      setStats({
        totalStudents: 0,
        totalGroups: 0,
        pendingHomework: 0,
        unreadMessages: 0
      });
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  const statCards = [
    {
      title: t('totalStudents'),
      value: stats.totalStudents,
      icon: UserGroupIcon,
      color: 'bg-primary-500',
      textColor: 'text-primary-600'
    },
    {
      title: t('groups'),
      value: stats.totalGroups,
      icon: ChartBarIcon,
      color: 'bg-success-500',
      textColor: 'text-success-600'
    },
    {
      title: t('pendingTasks'),
      value: stats.pendingHomework,
      icon: BookOpenIcon,
      color: 'bg-warning-500',
      textColor: 'text-warning-600'
    },
    {
      title: t('unreadMessages'),
      value: stats.unreadMessages,
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-danger-500',
      textColor: 'text-danger-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {t('welcomeTeacher')}, {user?.firstName} {user?.lastName}!
        </h1>
        <p className="text-primary-100">
          {t('readyToTeach')}
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            {t('teacher')}
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            {user?.groupsTaught?.length || 0} {t('groupsTaught')}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <button
            key={index}
            onClick={() => {
              if (stat.title === t('totalStudents')) {
                navigate('/teacher/students');
              } else if (stat.title === t('groups')) {
                navigate('/teacher/groups');
              } else if (stat.title === t('pendingTasks')) {
                navigate('/teacher/homework');
              } else if (stat.title === t('unreadMessages')) {
                navigate('/teacher/messages');
              }
            }}
            className="card hover:shadow-lg transition-shadow cursor-pointer text-left"
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
        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              {t('recentActivity')}
            </h2>
            <ClockIcon className="w-5 h-5 text-secondary-500" />
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg"
              >
                <div>
                  <p className="font-medium text-secondary-900 dark:text-white">
                    {activity.message}
                  </p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            {t('quickActions')}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/teacher/homework')}
              className="flex flex-col items-center gap-2 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
            >
              <BookOpenIcon className="w-8 h-8 text-primary-600" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-400">
                {t('createHomework')}
              </span>
            </button>
            <button 
              onClick={() => navigate('/teacher/students')}
              className="flex flex-col items-center gap-2 p-4 bg-success-50 dark:bg-success-900/20 rounded-lg hover:bg-success-100 dark:hover:bg-success-900/30 transition-colors"
            >
              <ChartBarIcon className="w-8 h-8 text-success-600" />
              <span className="text-sm font-medium text-success-700 dark:text-success-400">
                {t('viewGrades')}
              </span>
            </button>
            <button 
              onClick={() => navigate('/teacher/competitions')}
              className="flex flex-col items-center gap-2 p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg hover:bg-warning-100 dark:hover:bg-warning-900/30 transition-colors"
            >
              <TrophyIcon className="w-8 h-8 text-warning-600" />
              <span className="text-sm font-medium text-warning-700 dark:text-warning-400">
                {t('createCompetition')}
              </span>
            </button>
            <button 
              onClick={() => navigate('/teacher/messages')}
              className="flex flex-col items-center gap-2 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                {t('messages')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;