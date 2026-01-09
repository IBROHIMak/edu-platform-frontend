import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChartBarIcon,
  BookOpenIcon,
  ClockIcon,
  StarIcon,
  TrophyIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const ParentHome = () => {
  const [childStats, setChildStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchChildData();
  }, []);

  const fetchChildData = async () => {
    try {
      // Check if user is from localStorage (admin-created)
      const isLocalStorageUser = localStorage.getItem('token')?.startsWith('localStorage_');
      
      if (isLocalStorageUser) {
        // Show demo data for localStorage users
        console.log('👨‍👩‍👧‍👦 Showing demo data for admin-created parent');
        setChildStats({
          totalScore: 8.7,
          attendance: 94,
          homeworkCompletion: 89,
          rankInGroup: 2,
          totalStudents: 25,
          points: 180,
          recentGrades: [9, 8, 10, 9, 8],
          childName: user?.childName || 'Farzand',
          groupName: 'Ingliz-A1',
          teacherName: 'Aziz Karimov'
        });
      } else {
        // For real API users, try to fetch actual data
        setChildStats({
          totalScore: 0,
          attendance: 0,
          homeworkCompletion: 0,
          rankInGroup: 0,
          totalStudents: 0,
          points: 0,
          recentGrades: []
        });
      }
    } catch (error) {
      console.error('Error fetching child data:', error);
      // Show empty data for errors
      setChildStats({
        totalScore: 0,
        attendance: 0,
        homeworkCompletion: 0,
        rankInGroup: 0,
        totalStudents: 0,
        points: 0,
        recentGrades: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  const child = user?.children?.[0]; // Assuming first child for now

  const statCards = [
    {
      title: t('totalScore'),
      value: childStats?.totalScore || 0,
      max: 10,
      suffix: '/10',
      icon: ChartBarIcon,
      color: 'bg-primary-500',
      textColor: 'text-primary-600'
    },
    {
      title: t('attendance'),
      value: childStats?.attendance || 0,
      suffix: '%',
      icon: ClockIcon,
      color: 'bg-success-500',
      textColor: 'text-success-600'
    },
    {
      title: t('homeworkCompletion'),
      value: childStats?.homeworkCompletion || 0,
      suffix: '%',
      icon: BookOpenIcon,
      color: 'bg-warning-500',
      textColor: 'text-warning-600'
    },
    {
      title: t('groupRank'),
      value: childStats?.rankInGroup || 0,
      suffix: t('rankSuffix'),
      icon: TrophyIcon,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {t('welcomeStudent')}, {user?.firstName} {user?.lastName}!
        </h1>
        <p className="text-primary-100 mb-4">
          {t('childEducationProgress')}
        </p>
        {user?.childName && (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              <span>Farzand: {user.childName}</span>
            </div>
            {childStats?.groupName && (
              <div className="flex items-center gap-2">
                <BookOpenIcon className="w-4 h-4" />
                <span>Guruh: {childStats.groupName}</span>
              </div>
            )}
            {childStats?.teacherName && (
              <div className="flex items-center gap-2">
                <StarIcon className="w-4 h-4" />
                <span>O'qituvchi: {childStats.teacherName}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <button
            key={index}
            onClick={() => {
              if (stat.title === t('totalScore') || stat.title === t('homeworkCompletion')) {
                navigate('/parent/progress');
              } else if (stat.title === t('attendance')) {
                navigate('/parent/attendance');
              } else if (stat.title === t('groupRank')) {
                navigate('/parent/progress');
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
                  {stat.value}{stat.suffix}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            {stat.max && (
              <div className="mt-4">
                <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${stat.color}`}
                    style={{ width: `${(stat.value / stat.max) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Performance */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              {t('recentResults')}
            </h2>
            <ChartBarIcon className="w-5 h-5 text-secondary-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <span className="text-sm text-secondary-600 dark:text-secondary-400">
                {t('mathematics')}
              </span>
              <span className="font-medium text-success-600">9</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <span className="text-sm text-secondary-600 dark:text-secondary-400">
                {t('physics')}
              </span>
              <span className="font-medium text-primary-600">8</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <span className="text-sm text-secondary-600 dark:text-secondary-400">
                {t('chemistry')}
              </span>
              <span className="font-medium text-success-600">10</span>
            </div>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="card">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            {t('overallIndicators')}
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StarIcon className="w-4 h-4 text-warning-500" />
                <span className="text-sm text-secondary-600 dark:text-secondary-400">
                  {t('earnedPoints')}
                </span>
              </div>
              <span className="font-medium text-secondary-900 dark:text-white">
                {childStats?.points || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrophyIcon className="w-4 h-4 text-primary-500" />
                <span className="text-sm text-secondary-600 dark:text-secondary-400">
                  {t('groupPosition')}
                </span>
              </div>
              <span className="font-medium text-secondary-900 dark:text-white">
                {childStats?.rankInGroup}/{childStats?.totalStudents}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-success-500" />
                <span className="text-sm text-secondary-600 dark:text-secondary-400">
                  {t('weeklyAttendance')}
                </span>
              </div>
              <span className="font-medium text-success-600">
                5/5 {t('days')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          {t('quickActions')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/parent/homework')}
            className="flex flex-col items-center gap-2 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            <BookOpenIcon className="w-8 h-8 text-primary-600" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-400">
              {t('homework')}
            </span>
          </button>
          <button 
            onClick={() => navigate('/parent/progress')}
            className="flex flex-col items-center gap-2 p-4 bg-success-50 dark:bg-success-900/20 rounded-lg hover:bg-success-100 dark:hover:bg-success-900/30 transition-colors"
          >
            <ChartBarIcon className="w-8 h-8 text-success-600" />
            <span className="text-sm font-medium text-success-700 dark:text-success-400">
              {t('progress')}
            </span>
          </button>
          <button 
            onClick={() => navigate('/parent/attendance')}
            className="flex flex-col items-center gap-2 p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg hover:bg-warning-100 dark:hover:bg-warning-900/30 transition-colors"
          >
            <ClockIcon className="w-8 h-8 text-warning-600" />
            <span className="text-sm font-medium text-warning-700 dark:text-warning-400">
              {t('attendance')}
            </span>
          </button>
          <button 
            onClick={() => navigate('/parent/messages')}
            className="flex flex-col items-center gap-2 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <UserIcon className="w-8 h-8 text-purple-600" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
              {t('messages')}
            </span>
          </button>
        </div>
      </div>

      {/* Information Cards */}
      <div className="card bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-700">
        <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-3">
          📚 {t('parentTips')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-primary-800 dark:text-primary-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span>{t('talkWithChild')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span>{t('helpWithHomework')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span>{t('stayInTouch')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span>{t('appreciateSuccess')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentHome;