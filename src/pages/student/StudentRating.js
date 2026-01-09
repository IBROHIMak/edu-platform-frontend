import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  TrophyIcon,
  CalendarIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentRating = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [ratingData, setRatingData] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [groupRankings, setGroupRankings] = useState([]);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    fetchRatingData();
  }, []);

  const fetchRatingData = async () => {
    try {
      // Fetch rating data
      const ratingRes = await axios.get(`/api/ratings/student/${user.id}`).catch(() => ({ data: { success: false } }));
      
      if (ratingRes.data.success) {
        setRatingData(ratingRes.data.data.rating);
      } else {
        // Fallback data when API is not available
        setRatingData({
          totalScore: 8.5,
          rankInGroup: 2,
          attendance: 18,
          totalClasses: 20,
          homeworkCompletion: 85,
          averageGrade: 8.2,
          participationCount: 15
        });
      }

      // Mock attendance data
      setAttendanceData([
        { date: '2024-01-15', status: 'present', lesson: 'Grammar Basics' },
        { date: '2024-01-17', status: 'present', lesson: 'Speaking Practice' },
        { date: '2024-01-19', status: 'absent', lesson: 'Writing Skills' },
        { date: '2024-01-22', status: 'present', lesson: 'Reading Comprehension' },
        { date: '2024-01-24', status: 'present', lesson: 'Listening Practice' },
        { date: '2024-01-26', status: 'late', lesson: 'Vocabulary Building' },
        { date: '2024-01-29', status: 'present', lesson: 'Grammar Advanced' },
        { date: '2024-01-31', status: 'present', lesson: 'Conversation Practice' }
      ]);

      // Mock group rankings
      setGroupRankings([
        { rank: 1, name: 'Malika Toshmatova', points: 245, average: 9.2 },
        { rank: 2, name: user.firstName + ' ' + user.lastName, points: 201, average: 8.5, isCurrentUser: true },
        { rank: 3, name: 'Bobur Rahimov', points: 189, average: 8.1 },
        { rank: 4, name: 'Dilnoza Karimova', points: 176, average: 7.8 },
        { rank: 5, name: 'Jasur Abdullayev', points: 165, average: 7.5 }
      ]);

      // Mock points history
      setPointsHistory([
        { date: '2024-01-15', points: 10, reason: 'Homework completed', type: 'homework' },
        { date: '2024-01-17', points: 15, reason: 'Active participation', type: 'participation' },
        { date: '2024-01-19', points: -5, reason: 'Late submission', type: 'penalty' },
        { date: '2024-01-22', points: 20, reason: 'Excellent presentation', type: 'bonus' },
        { date: '2024-01-24', points: 12, reason: 'Quiz completed', type: 'quiz' },
        { date: '2024-01-26', points: 8, reason: 'Class attendance', type: 'attendance' },
        { date: '2024-01-29', points: 25, reason: 'Project submission', type: 'project' },
        { date: '2024-01-31', points: 18, reason: 'Group work leadership', type: 'leadership' }
      ]);

    } catch (error) {
      console.error('Error fetching rating data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircleIcon className="w-5 h-5 text-success-500" />;
      case 'absent':
        return <XCircleIcon className="w-5 h-5 text-danger-500" />;
      case 'late':
        return <ClockIcon className="w-5 h-5 text-warning-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-secondary-400" />;
    }
  };

  const getPointsTypeColor = (type) => {
    const colors = {
      homework: 'bg-blue-100 text-blue-800',
      participation: 'bg-green-100 text-green-800',
      penalty: 'bg-red-100 text-red-800',
      bonus: 'bg-purple-100 text-purple-800',
      quiz: 'bg-yellow-100 text-yellow-800',
      attendance: 'bg-indigo-100 text-indigo-800',
      project: 'bg-pink-100 text-pink-800',
      leadership: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  const tabs = [
    { id: 'overview', label: 'Umumiy ko\'rsatkichlar', icon: ChartBarIcon },
    { id: 'attendance', label: 'Davomat', icon: CalendarIcon },
    { id: 'ranking', label: 'Guruhda o\'rin', icon: TrophyIcon },
    { id: 'points', label: 'Ballar tarixi', icon: StarIcon }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t('progress')}
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-secondary-200 dark:border-secondary-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 dark:text-secondary-400 dark:hover:text-secondary-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-secondary-900 dark:text-white">
                Umumiy ball
              </h3>
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {ratingData?.totalScore || 0}/10
            </div>
            <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
              <div
                className="h-2 bg-primary-500 rounded-full"
                style={{ width: `${((ratingData?.totalScore || 0) / 10) * 100}%` }}
              />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-warning-500 rounded-lg flex items-center justify-center">
                <TrophyIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-secondary-900 dark:text-white">
                Guruhda o'rin
              </h3>
            </div>
            <div className="text-3xl font-bold text-warning-600 mb-2">
              #{ratingData?.rankInGroup || 0}
            </div>
            <p className="text-sm text-secondary-500">
              {groupRankings.length} o'quvchi ichida
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-success-500 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-secondary-900 dark:text-white">
                Davomat
              </h3>
            </div>
            <div className="text-3xl font-bold text-success-600 mb-2">
              {ratingData?.attendance || 0}/{ratingData?.totalClasses || 0}
            </div>
            <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
              <div
                className="h-2 bg-success-500 rounded-full"
                style={{ width: `${((ratingData?.attendance || 0) / (ratingData?.totalClasses || 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-secondary-900 dark:text-white">
                O'rtacha baho
              </h3>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {ratingData?.averageGrade || 0}
            </div>
            <p className="text-sm text-secondary-500">
              10 ballik tizim bo'yicha
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-secondary-900 dark:text-white">
                Faollik
              </h3>
            </div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {ratingData?.participationCount || 0}
            </div>
            <p className="text-sm text-secondary-500">
              Darsda ishtirok
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-secondary-900 dark:text-white">
                Uy vazifalar
              </h3>
            </div>
            <div className="text-3xl font-bold text-emerald-600 mb-2">
              {ratingData?.homeworkCompletion || 0}%
            </div>
            <p className="text-sm text-secondary-500">
              Bajarilgan vazifalar
            </p>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Davomat tarixi
          </h3>
          <div className="space-y-3">
            {attendanceData.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                <div className="flex items-center gap-3">
                  {getAttendanceIcon(record.status)}
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-white">
                      {record.lesson}
                    </p>
                    <p className="text-sm text-secondary-500">
                      {new Date(record.date).toLocaleDateString('uz-UZ')}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${
                  record.status === 'present' ? 'bg-success-100 text-success-800' :
                  record.status === 'absent' ? 'bg-danger-100 text-danger-800' :
                  'bg-warning-100 text-warning-800'
                }`}>
                  {record.status === 'present' ? 'Kelgan' :
                   record.status === 'absent' ? 'Kelmagan' : 'Kech kelgan'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ranking' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Guruh reytingi
          </h3>
          <div className="space-y-3">
            {groupRankings.map((student, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                student.isCurrentUser 
                  ? 'bg-primary-50 border-2 border-primary-200 dark:bg-primary-900/20 dark:border-primary-700' 
                  : 'bg-secondary-50 dark:bg-secondary-800'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    student.rank === 1 ? 'bg-yellow-500' :
                    student.rank === 2 ? 'bg-gray-400' :
                    student.rank === 3 ? 'bg-orange-600' :
                    'bg-secondary-500'
                  }`}>
                    {student.rank}
                  </div>
                  <div>
                    <p className={`font-medium ${
                      student.isCurrentUser 
                        ? 'text-primary-900 dark:text-primary-100' 
                        : 'text-secondary-900 dark:text-white'
                    }`}>
                      {student.name}
                      {student.isCurrentUser && ' (Siz)'}
                    </p>
                    <p className="text-sm text-secondary-500">
                      O'rtacha: {student.average}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-secondary-900 dark:text-white">
                    {student.points}
                  </p>
                  <p className="text-sm text-secondary-500">ball</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'points' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Ballar tarixi
          </h3>
          <div className="space-y-3">
            {pointsHistory.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    record.points > 0 ? 'bg-success-500' : 'bg-danger-500'
                  }`}>
                    {record.points > 0 ? '+' : ''}
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-white">
                      {record.reason}
                    </p>
                    <p className="text-sm text-secondary-500">
                      {new Date(record.date).toLocaleDateString('uz-UZ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${getPointsTypeColor(record.type)}`}>
                    {record.type}
                  </span>
                  <span className={`font-bold text-lg ${
                    record.points > 0 ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {record.points > 0 ? '+' : ''}{record.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRating;