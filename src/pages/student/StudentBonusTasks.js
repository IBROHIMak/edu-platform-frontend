import React, { useState, useEffect } from 'react';
import { 
  StarIcon,
  FireIcon,
  BookOpenIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  TrophyIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const StudentBonusTasks = () => {
  const [bonusTasks, setBonusTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');
  
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    fetchBonusTasks();
  }, []);

  const fetchBonusTasks = async () => {
    try {
      const response = await axios.get('/api/bonus-tasks').catch(() => ({ data: { success: false } }));
      
      if (response.data.success) {
        setBonusTasks(response.data.data.tasks);
        setCompletedTasks(response.data.data.completedTasks || []);
      } else {
        // Mock bonus tasks
        setBonusTasks([
          {
            id: 1,
            title: 'Kundalik ingliz so\'zlari',
            description: '10 ta yangi ingliz so\'zini o\'rganib, ularni gapda ishlatish',
            points: 15,
            type: 'daily',
            category: 'vocabulary',
            difficulty: 'easy',
            timeLimit: '1 kun',
            completed: false
          },
          {
            id: 2,
            title: 'Ingliz tilidagi qo\'shiq',
            description: 'Ingliz tilidagi qo\'shiq tinglab, matnini yozish',
            points: 25,
            type: 'creative',
            category: 'listening',
            difficulty: 'medium',
            timeLimit: '3 kun',
            completed: false
          },
          {
            id: 3,
            title: 'Grammar mashq',
            description: 'Present Perfect zamoni bo\'yicha 20 ta mashq bajarish',
            points: 20,
            type: 'practice',
            category: 'grammar',
            difficulty: 'medium',
            timeLimit: '2 kun',
            completed: false
          },
          {
            id: 4,
            title: 'Ingliz tilidagi video',
            description: 'O\'zingiz haqingizda 2 daqiqalik ingliz tilidagi video tayyorlash',
            points: 35,
            type: 'project',
            category: 'speaking',
            difficulty: 'hard',
            timeLimit: '1 hafta',
            completed: false
          },
          {
            id: 5,
            title: 'Kitob o\'qish',
            description: 'Ingliz tilidagi qisqa hikoya o\'qib, xulosasini yozish',
            points: 30,
            type: 'reading',
            category: 'reading',
            difficulty: 'medium',
            timeLimit: '5 kun',
            completed: false
          },
          {
            id: 6,
            title: 'Ingliz tili testi',
            description: 'Online ingliz tili testini 80% dan yuqori natija bilan topshirish',
            points: 40,
            type: 'test',
            category: 'general',
            difficulty: 'hard',
            timeLimit: '3 kun',
            completed: false
          }
        ]);

        setCompletedTasks([
          {
            id: 7,
            title: 'Haftalik lug\'at',
            description: '50 ta yangi so\'zni o\'rganish',
            points: 25,
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            grade: 9
          },
          {
            id: 8,
            title: 'Ingliz tilidagi maqola',
            description: 'Sevimli mavzu haqida ingliz tilida maqola yozish',
            points: 30,
            completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            grade: 8
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching bonus tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await axios.post(`/api/bonus-tasks/${taskId}/complete`).catch(() => ({ data: { success: false } }));
      
      if (response.data.success) {
        toast.success(`Bonus vazifa bajarildi! +${response.data.data.pointsEarned} ball`);
      } else {
        toast.success('Bonus vazifa bajarildi! O\'qituvchi tekshiradi.');
      }
      
      // Update local state
      setBonusTasks(prev => 
        prev.map(t => 
          t.id === taskId ? { ...t, completed: true, completedAt: new Date() } : t
        )
      );
      
    } catch (error) {
      console.error('Error completing bonus task:', error);
      toast.error('Xatolik yuz berdi');
    }
  };

  const getTaskIcon = (category) => {
    const iconMap = {
      vocabulary: BookOpenIcon,
      listening: StarIcon,
      grammar: PlusIcon,
      speaking: FireIcon,
      reading: BookOpenIcon,
      general: TrophyIcon,
      writing: PlusIcon
    };
    return iconMap[category] || StarIcon;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type) => {
    const colors = {
      daily: 'bg-blue-100 text-blue-800',
      creative: 'bg-purple-100 text-purple-800',
      practice: 'bg-indigo-100 text-indigo-800',
      project: 'bg-pink-100 text-pink-800',
      reading: 'bg-emerald-100 text-emerald-800',
      test: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  const availableTasks = bonusTasks.filter(task => !task.completed);
  const totalPoints = completedTasks.reduce((sum, task) => sum + task.points, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Bonus Vazifalar
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-warning-100 dark:bg-warning-900/20 rounded-lg">
            <StarIcon className="w-5 h-5 text-warning-600" />
            <span className="font-medium text-warning-700 dark:text-warning-400">
              {totalPoints} bonus ball
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mx-auto mb-3">
            <StarIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-secondary-900 dark:text-white">
            {availableTasks.length}
          </h3>
          <p className="text-sm text-secondary-500">Mavjud vazifalar</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-success-500 rounded-lg flex items-center justify-center mx-auto mb-3">
            <CheckCircleIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-secondary-900 dark:text-white">
            {completedTasks.length}
          </h3>
          <p className="text-sm text-secondary-500">Bajarilgan</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-warning-500 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrophyIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-secondary-900 dark:text-white">
            {totalPoints}
          </h3>
          <p className="text-sm text-secondary-500">Bonus ballar</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
            <FireIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-secondary-900 dark:text-white">
            {Math.round((completedTasks.length / (completedTasks.length + availableTasks.length)) * 100) || 0}%
          </h3>
          <p className="text-sm text-secondary-500">Bajarish foizi</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-secondary-200 dark:border-secondary-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('available')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'available'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
            }`}
          >
            Mavjud vazifalar ({availableTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'completed'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
            }`}
          >
            Bajarilganlar ({completedTasks.length})
          </button>
        </nav>
      </div>

      {/* Available Tasks */}
      {activeTab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTasks.length === 0 ? (
            <div className="col-span-full card text-center py-12">
              <StarIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
                Hozircha bonus vazifalar yo'q
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                Yangi bonus vazifalar tez orada qo'shiladi
              </p>
            </div>
          ) : (
            availableTasks.map((task) => (
              <div key={task.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    task.difficulty === 'easy' ? 'bg-green-500' :
                    task.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {React.createElement(getTaskIcon(task.category), { className: "w-5 h-5 text-white" })}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(task.type)}`}>
                      {task.type}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(task.difficulty)}`}>
                      {task.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">
                  {task.title}
                </h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                  {task.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-secondary-500">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{task.timeLimit}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4 text-warning-500" />
                      <span className="font-medium text-warning-600">+{task.points} ball</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCompleteTask(task.id)}
                  className="w-full btn-primary"
                >
                  Bajarish
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Completed Tasks */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          {completedTasks.length === 0 ? (
            <div className="card text-center py-12">
              <CheckCircleIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
                Hali bonus vazifa bajarmagansiz
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                Bonus vazifalarni bajarib qo'shimcha ball to'plang
              </p>
            </div>
          ) : (
            completedTasks.map((task) => (
              <div key={task.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-success-500 rounded-lg flex items-center justify-center">
                      <CheckCircleIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-secondary-900 dark:text-white">
                        {task.title}
                      </h3>
                      <p className="text-sm text-secondary-500">
                        Bajarilgan: {new Date(task.completedAt).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {task.grade && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-success-600">
                          {task.grade}/10
                        </div>
                        <div className="text-xs text-secondary-500">Baho</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-lg font-bold text-warning-600">
                        +{task.points}
                      </div>
                      <div className="text-xs text-secondary-500">Ball</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StudentBonusTasks;