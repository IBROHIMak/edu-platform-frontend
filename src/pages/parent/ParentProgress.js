import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  StarIcon,
  BookOpenIcon,
  ClockIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const ParentProgress = () => {
  const [progressData, setProgressData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    fetchProgressData();
  }, [selectedPeriod]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockData = {
        overallProgress: {
          currentGrade: 8.7,
          previousGrade: 8.2,
          trend: 'up',
          improvement: 0.5
        },
        subjectProgress: [
          { subject: t('englishGrammar'), current: 9.2, previous: 8.8, trend: 'up', lessons: 24 },
          { subject: t('englishSpeaking'), current: 8.5, previous: 8.9, trend: 'down', lessons: 18 },
          { subject: t('englishWriting'), current: 9.0, previous: 8.7, trend: 'up', lessons: 20 },
          { subject: t('englishReading'), current: 8.8, previous: 8.6, trend: 'up', lessons: 16 },
          { subject: t('englishLanguage'), current: 7.9, previous: 7.5, trend: 'up', lessons: 22 }
        ],
        weeklyStats: [
          { week: 'Hafta 1', attendance: 100, homework: 95, participation: 85 },
          { week: 'Hafta 2', attendance: 80, homework: 90, participation: 90 },
          { week: 'Hafta 3', attendance: 100, homework: 100, participation: 95 },
          { week: 'Hafta 4', attendance: 90, homework: 85, participation: 80 }
        ],
        achievements: [
          { title: t('bestEnglishResult'), date: '2024-01-15', type: 'academic' },
          { title: t('regularAttendance'), date: '2024-01-10', type: 'attendance' },
          { title: t('submitHomeworkOnTime'), date: '2024-01-08', type: 'homework' }
        ],
        skillsProgress: [
          { skill: t('englishSkills'), level: 85, maxLevel: 100 },
          { skill: t('vocabularyBuilding'), level: 78, maxLevel: 100 },
          { skill: t('pronunciationPractice'), level: 92, maxLevel: 100 },
          { skill: t('speakingPractice'), level: 88, maxLevel: 100 },
          { skill: t('timeManagement'), level: 75, maxLevel: 100 }
        ]
      };
      
      setProgressData(mockData);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
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
            {t('childProgress')}
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            {child?.firstName} {child?.lastName} ning batafsil rivojlanish hisoboti
          </p>
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-field text-sm"
          >
            <option value="week">{t('thisWeek')}</option>
            <option value="month">{t('thisMonth')}</option>
            <option value="quarter">{t('thisQuarter')}</option>
            <option value="year">{t('thisYear')}</option>
          </select>
        </div>
      </div>

      {/* Overall Progress Card */}
      <div className="card bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-2">
              Umumiy ko'rsatkich
            </h3>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {progressData?.overallProgress.currentGrade}
              </span>
              <div className="flex items-center gap-1">
                {progressData?.overallProgress.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="w-5 h-5 text-success-500" />
                ) : (
                  <ArrowTrendingDownIcon className="w-5 h-5 text-danger-500" />
                )}
                <span className={`text-sm font-medium ${
                  progressData?.overallProgress.trend === 'up' ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {progressData?.overallProgress.improvement > 0 ? '+' : ''}
                  {progressData?.overallProgress.improvement}
                </span>
              </div>
            </div>
          </div>
          <ChartBarIcon className="w-12 h-12 text-primary-500" />
        </div>
      </div>

      {/* Subject Progress */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Fanlar bo'yicha rivojlanish
        </h3>
        <div className="space-y-4">
          {progressData?.subjectProgress.map((subject, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                  <BookOpenIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900 dark:text-white">
                    {subject.subject}
                  </h4>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    {subject.lessons} ta dars
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-secondary-900 dark:text-white">
                      {subject.current}
                    </span>
                    {subject.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="w-4 h-4 text-success-500" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4 text-danger-500" />
                    )}
                  </div>
                  <p className="text-xs text-secondary-500">
                    Oldingi: {subject.previous}
                  </p>
                </div>
                <div className="w-16 h-2 bg-secondary-200 dark:bg-secondary-700 rounded-full">
                  <div
                    className="h-2 bg-primary-500 rounded-full"
                    style={{ width: `${(subject.current / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Statistics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Haftalik statistika
          </h3>
          <div className="space-y-3">
            {progressData?.weeklyStats.map((week, index) => (
              <div key={index} className="p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-secondary-900 dark:text-white">
                    {week.week}
                  </span>
                  <CalendarIcon className="w-4 h-4 text-secondary-500" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-secondary-600 dark:text-secondary-400">Davomat</div>
                    <div className="font-semibold text-success-600">{week.attendance}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-secondary-600 dark:text-secondary-400">{t('homework')}</div>
                    <div className="font-semibold text-primary-600">{week.homework}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-secondary-600 dark:text-secondary-400">Faollik</div>
                    <div className="font-semibold text-warning-600">{week.participation}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Progress */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Ko'nikmalar rivojlanishi
          </h3>
          <div className="space-y-4">
            {progressData?.skillsProgress.map((skill, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-secondary-900 dark:text-white">
                    {skill.skill}
                  </span>
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    {skill.level}%
                  </span>
                </div>
                <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                  <div
                    className="h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          So'ngi yutuqlar
        </h3>
        <div className="space-y-3">
          {progressData?.achievements.map((achievement, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <div className="w-10 h-10 bg-warning-100 dark:bg-warning-900 rounded-lg flex items-center justify-center">
                {achievement.type === 'academic' && <AcademicCapIcon className="w-5 h-5 text-warning-600" />}
                {achievement.type === 'attendance' && <ClockIcon className="w-5 h-5 text-warning-600" />}
                {achievement.type === 'homework' && <BookOpenIcon className="w-5 h-5 text-warning-600" />}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-secondary-900 dark:text-white">
                  {achievement.title}
                </h4>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  {new Date(achievement.date).toLocaleDateString('uz-UZ')}
                </p>
              </div>
              <StarIcon className="w-5 h-5 text-warning-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentProgress;