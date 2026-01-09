import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpenIcon,
  GiftIcon,
  TrophyIcon,
  ChartBarIcon,
  StarIcon,
  ClockIcon,
  PlusIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';

// Set axios base URL for this component
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5002';

const StudentHome = () => {
  const [stats, setStats] = useState(null);
  const [recentHomework, setRecentHomework] = useState([]);
  const [upcomingCompetitions, setUpcomingCompetitions] = useState([]);
  const [bonusTasks, setBonusTasks] = useState([]);
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
        console.log('📱 Showing demo data for admin-created user');
        setStats({
          totalScore: 85,
          rankInGroup: 3,
          attendance: 92,
          homeworkCompletion: 88
        });
        
        setRecentHomework([
          { id: 1, title: 'Grammar Exercise 5', subject: 'English', dueDate: '2024-01-15', status: 'pending' },
          { id: 2, title: 'Speaking Practice', subject: 'English', dueDate: '2024-01-18', status: 'completed' },
          { id: 3, title: 'Vocabulary Test', subject: 'English', dueDate: '2024-01-20', status: 'pending' }
        ]);
        
        setUpcomingCompetitions([
          { id: 1, title: 'English Olympiad', date: '2024-02-01', participants: 50 },
          { id: 2, title: 'Speaking Contest', date: '2024-02-15', participants: 25 }
        ]);
        
        setBonusTasks([
          { id: 1, title: 'Extra Reading', points: 10, completed: false },
          { id: 2, title: 'Vocabulary Quiz', points: 15, completed: true },
          { id: 3, title: 'Grammar Practice', points: 20, completed: false },
          { id: 4, title: 'Listening Exercise', points: 12, completed: false }
        ]);
        
        setLoading(false);
        return;
      }
      
      // Try to fetch data from APIs for real users
      const promises = [
        axios.get('/api/homework/student').catch(() => ({ data: { data: { homework: [] } } })),
        axios.get('/api/competitions').catch(() => ({ data: { data: { competitions: [] } } })),
        axios.get(`/api/ratings/student/${user.id}`).catch(() => ({ data: { success: false } })),
        axios.get('/api/bonus-tasks').catch(() => ({ data: { success: false } }))
      ];

      const [homeworkRes, competitionsRes, ratingRes, bonusTasksRes] = await Promise.all(promises);

      setRecentHomework(homeworkRes.data.data.homework.slice(0, 3));
      setUpcomingCompetitions(competitionsRes.data.data.competitions.slice(0, 3));
      
      // Set bonus tasks from API or show empty state
      if (bonusTasksRes.data.success) {
        setBonusTasks(bonusTasksRes.data.data.tasks.slice(0, 4));
      } else {
        setBonusTasks([]); // No demo data - show empty state
      }
      
      if (ratingRes.data.success) {
        setStats({
          totalScore: ratingRes.data.data.rating.totalScore,
          rankInGroup: ratingRes.data.data.rating.rankInGroup,
          attendance: ratingRes.data.data.rating.attendance,
          homeworkCompletion: ratingRes.data.data.rating.homeworkCompletion
        });
      } else {
        // Show empty/zero stats if no data available
        setStats({
          totalScore: 0,
          rankInGroup: 0,
          attendance: 0,
          homeworkCompletion: 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Show empty data instead of demo data
      setStats({
        totalScore: 0,
        rankInGroup: 0,
        attendance: 0,
        homeworkCompletion: 0
      });
      setBonusTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCompletion = async (taskId) => {
    try {
      const response = await axios.post(`/api/bonus-tasks/${taskId}/complete`);
      
      if (response.data.success) {
        // Update local state
        setBonusTasks(prev => 
          prev.map(t => 
            t.id === taskId ? { ...t, completed: true, completedAt: new Date() } : t
          )
        );
        
        // Show success message
        console.log(`${t('bonusTaskCompleted')} +${response.data.data.pointsEarned} ${t('points')}`);
      }
    } catch (error) {
      console.error('Error completing bonus task:', error);
      // Fallback to local state update
      setBonusTasks(prev => 
        prev.map(t => 
          t.id === taskId ? { ...t, completed: true } : t
        )
      );
    }
  };

  const getTaskIcon = (category) => {
    const iconMap = {
      reading: BookOpenIcon,
      practice: PlusIcon,
      teamwork: StarIcon,
      creativity: FireIcon,
      science: BookOpenIcon,
      mathematics: PlusIcon,
      ecology: StarIcon,
      linguistics: BookOpenIcon
    };
    return iconMap[category] || StarIcon;
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  const statCards = [
    {
      title: t('totalScore'),
      value: stats?.totalScore || 0,
      max: 10,
      icon: ChartBarIcon,
      color: 'bg-primary-500',
      textColor: 'text-primary-600'
    },
    {
      title: t('groupRank'),
      value: stats?.rankInGroup || 0,
      suffix: t('rankSuffix'),
      icon: TrophyIcon,
      color: 'bg-warning-500',
      textColor: 'text-warning-600'
    },
    {
      title: t('attendance'),
      value: stats?.attendance || 0,
      max: 10,
      suffix: '/10',
      icon: ClockIcon,
      color: 'bg-success-500',
      textColor: 'text-success-600'
    },
    {
      title: t('points'),
      value: user?.points || 0,
      icon: StarIcon,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {t('welcomeStudent')}, {user?.firstName}!
        </h1>
        <p className="text-primary-100">
          {t('readyToLearn')}
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            {user?.group?.name}
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            {user?.group?.subject}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <button
            key={index}
            onClick={() => {
              if (stat.title === t('totalScore') || stat.title === t('points')) {
                navigate('/student/rating');
              } else if (stat.title === t('groupRank')) {
                navigate('/student/rating');
              } else if (stat.title === t('attendance')) {
                navigate('/student/rating');
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
                  {stat.suffix && stat.suffix}
                  {stat.max && `/${stat.max}`}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Homework */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              {t('recentHomework')}
            </h2>
            <BookOpenIcon className="w-5 h-5 text-secondary-500" />
          </div>
          <div className="space-y-3">
            {recentHomework.length > 0 ? (
              recentHomework.map((homework) => (
                <div
                  key={homework._id}
                  className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-white">
                      {homework.title}
                    </p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      {t('dueDate')}: {new Date(homework.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      homework.submissionStatus === 'submitted'
                        ? 'bg-success-100 text-success-800'
                        : homework.isOverdue
                        ? 'bg-danger-100 text-danger-800'
                        : 'bg-warning-100 text-warning-800'
                    }`}
                  >
                    {homework.submissionStatus === 'submitted'
                      ? t('submitted')
                      : homework.isOverdue
                      ? t('overdue')
                      : t('pending')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-secondary-500 dark:text-secondary-400 text-center py-4">
                {t('noHomework')}
              </p>
            )}
          </div>
        </div>

        {/* Upcoming Competitions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              {t('upcomingCompetitions')}
            </h2>
            <TrophyIcon className="w-5 h-5 text-secondary-500" />
          </div>
          <div className="space-y-3">
            {upcomingCompetitions.length > 0 ? (
              upcomingCompetitions.map((competition) => (
                <div
                  key={competition._id}
                  className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-white">
                      {competition.title}
                    </p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      {t('startDate')}: {new Date(competition.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      competition.status === 'active'
                        ? 'bg-success-100 text-success-800'
                        : 'bg-primary-100 text-primary-800'
                    }`}
                  >
                    {competition.status === 'active' ? t('active') : t('pending')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-secondary-500 dark:text-secondary-400 text-center py-4">
                {t('noCompetitions')}
              </p>
            )}
          </div>
        </div>

        {/* Bonus Tasks */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              {t('bonusTasks')}
            </h2>
            <StarIcon className="w-5 h-5 text-warning-500" />
          </div>
          <div className="space-y-3">
            {bonusTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  task.completed
                    ? 'bg-success-50 border-success-200 dark:bg-success-900/20 dark:border-success-800'
                    : 'bg-secondary-50 border-secondary-200 dark:bg-secondary-800 dark:border-secondary-700 hover:border-primary-300'
                }`}
                onClick={() => {
                  if (!task.completed) {
                    handleTaskCompletion(task.id);
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      task.completed ? 'bg-success-500' : 'bg-primary-500'
                    }`}>
                      {task.category ? (
                        React.createElement(getTaskIcon(task.category), { className: "w-4 h-4 text-white" })
                      ) : (
                        <StarIcon className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${
                        task.completed 
                          ? 'text-success-800 dark:text-success-400 line-through' 
                          : 'text-secondary-900 dark:text-white'
                      }`}>
                        {task.title}
                      </p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">
                        {task.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.completed
                        ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400'
                        : 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400'
                    }`}>
                      +{task.points} ball
                    </span>
                    <span className="text-xs text-secondary-400 mt-1">
                      {task.type === 'daily' && t('daily')}
                      {task.type === 'weekly' && t('weekly')}
                      {task.type === 'social' && t('social')}
                      {task.type === 'project' && t('project')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
            onClick={() => navigate('/student/homework')}
            className="flex flex-col items-center gap-2 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            <BookOpenIcon className="w-8 h-8 text-primary-600" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-400">
              {t('homework')}
            </span>
          </button>
          <button 
            onClick={() => navigate('/student/bonus-tasks')}
            className="flex flex-col items-center gap-2 p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg hover:bg-warning-100 dark:hover:bg-warning-900/30 transition-colors"
          >
            <StarIcon className="w-8 h-8 text-warning-600" />
            <span className="text-sm font-medium text-warning-700 dark:text-warning-400">
              {t('bonusTasks')}
            </span>
          </button>
          <button 
            onClick={() => navigate('/student/rewards')}
            className="flex flex-col items-center gap-2 p-4 bg-success-50 dark:bg-success-900/20 rounded-lg hover:bg-success-100 dark:hover:bg-success-900/30 transition-colors"
          >
            <GiftIcon className="w-8 h-8 text-success-600" />
            <span className="text-sm font-medium text-success-700 dark:text-success-400">
              {t('rewards')}
            </span>
          </button>
          <button 
            onClick={() => navigate('/student/rating')}
            className="flex flex-col items-center gap-2 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <ChartBarIcon className="w-8 h-8 text-purple-600" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
              {t('rating')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;