import React, { useState, useEffect } from 'react';
import { 
  BookOpenIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  DocumentTextIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const ParentHomework = () => {
  const [homeworkData, setHomeworkData] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    fetchHomeworkData();
  }, []);

  const fetchHomeworkData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockData = {
        current: [
          {
            id: 1,
            title: t('englishHomework'),
            subject: t('englishLanguage'),
            teacher: 'Aziza Karimova',
            assignedDate: '2024-01-15',
            dueDate: '2024-01-18',
            status: 'pending',
            exercises: [
              { 
                id: 1, 
                title: 'Chiziqli tenglamalar', 
                description: '15-20 betdagi misollarni yeching',
                videoUrl: 'https://example.com/video1',
                completed: false
              },
              { 
                id: 2, 
                title: 'Kvadrat tenglamalar', 
                description: '21-25 betdagi misollarni yeching',
                videoUrl: 'https://example.com/video2',
                completed: true
              }
            ],
            totalExercises: 2,
            completedExercises: 1,
            grade: null,
            feedback: null
          },
          {
            id: 2,
            title: 'Fizika - Harakat qonunlari',
            subject: 'Fizika',
            teacher: 'Bobur Rahimov',
            assignedDate: '2024-01-16',
            dueDate: '2024-01-19',
            status: 'overdue',
            exercises: [
              { 
                id: 1, 
                title: 'Nyuton qonunlari', 
                description: 'Nazariy qismni o\'qing va misollarni yeching',
                videoUrl: 'https://example.com/video3',
                completed: false
              }
            ],
            totalExercises: 1,
            completedExercises: 0,
            grade: null,
            feedback: null
          }
        ],
        completed: [
          {
            id: 3,
            title: t('englishWritingTask'),
            subject: t('englishLanguage'),
            teacher: 'Malika Tosheva',
            assignedDate: '2024-01-10',
            dueDate: '2024-01-13',
            submittedDate: '2024-01-12',
            status: 'graded',
            exercises: [
              { 
                id: 1, 
                title: 'Alkanlar', 
                description: 'Alkanlarning xossalari haqida',
                videoUrl: 'https://example.com/video4',
                completed: true,
                grade: 9,
                feedback: 'Yaxshi bajarilgan'
              },
              { 
                id: 2, 
                title: 'Alkenlar', 
                description: 'Alkenlarning strukturasi',
                videoUrl: 'https://example.com/video5',
                completed: true,
                grade: 8,
                feedback: 'Yaxshi, lekin ba\'zi xatoliklar bor'
              }
            ],
            totalExercises: 2,
            completedExercises: 2,
            grade: 8.5,
            feedback: t('generalFeedback')
          }
        ],
        statistics: {
          totalAssigned: 15,
          completed: 12,
          pending: 2,
          overdue: 1,
          averageGrade: 8.3,
          completionRate: 80
        }
      };
      
      setHomeworkData(mockData);
    } catch (error) {
      console.error('Error fetching homework data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success-600 bg-success-100 dark:bg-success-900/20';
      case 'pending': return 'text-warning-600 bg-warning-100 dark:bg-warning-900/20';
      case 'overdue': return 'text-danger-600 bg-danger-100 dark:bg-danger-900/20';
      case 'graded': return 'text-primary-600 bg-primary-100 dark:bg-primary-900/20';
      default: return 'text-secondary-600 bg-secondary-100 dark:bg-secondary-900/20';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return t('completed');
      case 'pending': return t('pending');
      case 'overdue': return t('overdue');
      case 'graded': return t('graded');
      default: return t('unknown');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircleIcon;
      case 'pending': return ClockIcon;
      case 'overdue': return ExclamationTriangleIcon;
      case 'graded': return DocumentTextIcon;
      default: return BookOpenIcon;
    }
  };

  const filteredHomework = () => {
    if (!homeworkData) return [];
    
    const allHomework = [...homeworkData.current, ...homeworkData.completed];
    
    if (selectedFilter === 'all') return allHomework;
    if (selectedFilter === 'current') return homeworkData.current;
    if (selectedFilter === 'completed') return homeworkData.completed;
    
    return allHomework.filter(hw => hw.status === selectedFilter);
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  const child = user?.children?.[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Uy vazifalari
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            {child?.firstName} {child?.lastName} ning uy vazifalari
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">{t('totalAssigned')}</p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {homeworkData?.statistics.totalAssigned}
              </p>
            </div>
            <BookOpenIcon className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Bajarilgan</p>
              <p className="text-2xl font-bold text-success-600">
                {homeworkData?.statistics.completed}
              </p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-success-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">{t('averageGrade')}</p>
              <p className="text-2xl font-bold text-primary-600">
                {homeworkData?.statistics.averageGrade}
              </p>
            </div>
            <DocumentTextIcon className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">{t('completionRate')}</p>
              <p className="text-2xl font-bold text-warning-600">
                {homeworkData?.statistics.completionRate}%
              </p>
            </div>
            <div className="w-8 h-8 bg-warning-100 dark:bg-warning-900 rounded-lg flex items-center justify-center">
              <span className="text-warning-600 font-bold text-sm">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-secondary-200 dark:border-secondary-700">
        {[
          { key: 'all', label: 'Barchasi' },
          { key: 'current', label: 'Joriy' },
          { key: 'completed', label: 'Bajarilgan' },
          { key: 'pending', label: 'Kutilmoqda' },
          { key: 'overdue', label: 'Muddati o\'tgan' }
        ].map(filter => (
          <button
            key={filter.key}
            onClick={() => setSelectedFilter(filter.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              selectedFilter === filter.key
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Homework List */}
      <div className="space-y-4">
        {filteredHomework().map((homework) => {
          const StatusIcon = getStatusIcon(homework.status);
          
          return (
            <div key={homework.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <BookOpenIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900 dark:text-white">
                        {homework.title}
                      </h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        {homework.subject} • {homework.teacher}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{t('assigned')}: {new Date(homework.assignedDate).toLocaleDateString('uz-UZ')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{t('dueDate')}: {new Date(homework.dueDate).toLocaleDateString('uz-UZ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(homework.status)}`}>
                        {getStatusText(homework.status)}
                      </span>
                    </div>
                    <div className="text-sm text-secondary-600 dark:text-secondary-400">
                      {homework.completedExercises}/{homework.totalExercises} mashq bajarilgan
                    </div>
                    {homework.grade && (
                      <div className="text-sm font-medium text-primary-600">
                        {t('grade')}: {homework.grade}
                      </div>
                    )}
                  </div>

                  {homework.exercises.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-secondary-900 dark:text-white">
                        Mashqlar:
                      </h4>
                      {homework.exercises.map((exercise) => (
                        <div key={exercise.id} className="flex items-center justify-between p-2 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                          <div className="flex items-center gap-2">
                            {exercise.completed ? (
                              <CheckCircleIcon className="w-4 h-4 text-success-500" />
                            ) : (
                              <ClockIcon className="w-4 h-4 text-warning-500" />
                            )}
                            <div>
                              <span className="text-sm font-medium text-secondary-900 dark:text-white">
                                {exercise.title}
                              </span>
                              {exercise.grade && (
                                <span className="ml-2 text-xs text-primary-600">
                                  {t('grade')}: {exercise.grade}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {exercise.videoUrl && (
                              <button className="p-1 text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900 rounded">
                                <PlayIcon className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => setSelectedHomework(homework)}
                              className="p-1 text-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {homework.feedback && (
                    <div className="mt-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <h4 className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-1">
                        {t('teacherComment')}
                      </h4>
                      <p className="text-sm text-primary-800 dark:text-primary-200">
                        {homework.feedback}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredHomework().length === 0 && (
        <div className="card text-center py-12">
          <BookOpenIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
            Uy vazifalari topilmadi
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            {t('noHomeworkForFilter')}
          </p>
        </div>
      )}

      {/* Homework Detail Modal */}
      {selectedHomework && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
                  {selectedHomework.title}
                </h2>
                <button
                  onClick={() => setSelectedHomework(null)}
                  className="text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-secondary-600 dark:text-secondary-400">{t('subject')}:</span>
                    <span className="ml-2 font-medium text-secondary-900 dark:text-white">
                      {selectedHomework.subject}
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary-600 dark:text-secondary-400">{t('teacherLabel')}</span>
                    <span className="ml-2 font-medium text-secondary-900 dark:text-white">
                      {selectedHomework.teacher}
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary-600 dark:text-secondary-400">Berilgan sana:</span>
                    <span className="ml-2 font-medium text-secondary-900 dark:text-white">
                      {new Date(selectedHomework.assignedDate).toLocaleDateString('uz-UZ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary-600 dark:text-secondary-400">{t('dueDate')}:</span>
                    <span className="ml-2 font-medium text-secondary-900 dark:text-white">
                      {new Date(selectedHomework.dueDate).toLocaleDateString('uz-UZ')}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-secondary-900 dark:text-white">
                    Mashqlar tafsiloti:
                  </h3>
                  {selectedHomework.exercises.map((exercise) => (
                    <div key={exercise.id} className="p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-secondary-900 dark:text-white">
                          {exercise.title}
                        </h4>
                        {exercise.completed ? (
                          <CheckCircleIcon className="w-5 h-5 text-success-500" />
                        ) : (
                          <ClockIcon className="w-5 h-5 text-warning-500" />
                        )}
                      </div>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                        {exercise.description}
                      </p>
                      {exercise.videoUrl && (
                        <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm">
                          <PlayIcon className="w-4 h-4" />
                          Tushuntirish videosini ko'rish
                        </button>
                      )}
                      {exercise.grade && (
                        <div className="mt-2 p-2 bg-primary-50 dark:bg-primary-900/20 rounded">
                          <div className="text-sm">
                            <span className="text-primary-600 font-medium">{t('grade')}: {exercise.grade}</span>
                            {exercise.feedback && (
                              <p className="text-primary-800 dark:text-primary-200 mt-1">
                                {exercise.feedback}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentHomework;