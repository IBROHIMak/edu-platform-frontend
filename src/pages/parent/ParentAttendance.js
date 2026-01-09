import React, { useState, useEffect } from 'react';
import { 
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  UserIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const ParentAttendance = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedMonth, selectedYear]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockData = {
        monthlyStats: {
          totalDays: 22,
          presentDays: 20,
          absentDays: 2,
          lateDays: 1,
          attendanceRate: 91
        },
        weeklyBreakdown: [
          { week: 'Hafta 1', present: 5, absent: 0, late: 0, total: 5 },
          { week: 'Hafta 2', present: 4, absent: 1, late: 0, total: 5 },
          { week: 'Hafta 3', present: 5, absent: 0, late: 1, total: 5 },
          { week: 'Hafta 4', present: 4, absent: 1, late: 0, total: 5 }
        ],
        dailyAttendance: [
          { date: '2024-01-01', status: 'present', subject: t('englishGrammar'), time: '08:00' },
          { date: '2024-01-02', status: 'present', subject: t('englishSpeaking'), time: '08:00' },
          { date: '2024-01-03', status: 'absent', subject: t('englishWriting'), reason: t('illness') },
          { date: '2024-01-04', status: 'present', subject: t('englishReading'), time: '08:00' },
          { date: '2024-01-05', status: 'late', subject: t('englishListening'), time: '08:15' },
          { date: '2024-01-08', status: 'present', subject: t('englishGrammar'), time: '08:00' },
          { date: '2024-01-09', status: 'present', subject: t('englishSpeaking'), time: '08:00' },
          { date: '2024-01-10', status: 'present', subject: t('englishWriting'), time: '08:00' },
          { date: '2024-01-11', status: 'absent', subject: t('englishReading'), reason: t('familyReason') },
          { date: '2024-01-12', status: 'present', subject: t('englishListening'), time: '08:00' }
        ],
        subjectAttendance: [
          { subject: t('englishGrammar'), total: 8, present: 7, absent: 1, rate: 87.5 },
          { subject: t('englishSpeaking'), total: 6, present: 6, absent: 0, rate: 100 },
          { subject: t('englishWriting'), total: 5, present: 4, absent: 1, rate: 80 },
          { subject: t('englishReading'), total: 4, present: 3, absent: 1, rate: 75 },
          { subject: t('englishListening'), total: 6, present: 5, absent: 1, rate: 83.3 }
        ],
        trends: {
          thisMonth: 91,
          lastMonth: 95,
          trend: 'down',
          change: -4
        }
      };
      
      setAttendanceData(mockData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'text-success-600 bg-success-100 dark:bg-success-900/20';
      case 'absent': return 'text-danger-600 bg-danger-100 dark:bg-danger-900/20';
      case 'late': return 'text-warning-600 bg-warning-100 dark:bg-warning-900/20';
      default: return 'text-secondary-600 bg-secondary-100 dark:bg-secondary-900/20';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'present': return t('present');
      case 'absent': return t('absent');
      case 'late': return t('late');
      default: return t('unknown');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return CheckCircleIcon;
      case 'absent': return XCircleIcon;
      case 'late': return ExclamationTriangleIcon;
      default: return ClockIcon;
    }
  };

  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ];

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
            Davomat
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            {child?.firstName} {child?.lastName} ning davomat ma'lumotlari
          </p>
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="input-field text-sm"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="input-field text-sm"
          >
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
          </select>
        </div>
      </div>

      {/* Monthly Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">{t('totalDays')}</p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {attendanceData?.monthlyStats.totalDays}
              </p>
            </div>
            <CalendarIcon className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Kelgan</p>
              <p className="text-2xl font-bold text-success-600">
                {attendanceData?.monthlyStats.presentDays}
              </p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-success-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Kelmagan</p>
              <p className="text-2xl font-bold text-danger-600">
                {attendanceData?.monthlyStats.absentDays}
              </p>
            </div>
            <XCircleIcon className="w-8 h-8 text-danger-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">{t('lateDays')}</p>
              <p className="text-2xl font-bold text-warning-600">
                {attendanceData?.monthlyStats.lateDays}
              </p>
            </div>
            <ExclamationTriangleIcon className="w-8 h-8 text-warning-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">{t('attendanceRate')}</p>
              <p className="text-2xl font-bold text-primary-600">
                {attendanceData?.monthlyStats.attendanceRate}%
              </p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-primary-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            {t('weeklyDistribution')}
          </h3>
          <div className="space-y-3">
            {attendanceData?.weeklyBreakdown.map((week, index) => (
              <div key={index} className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-secondary-900 dark:text-white">
                    {week.week}
                  </span>
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    {week.total} kun
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-secondary-600 dark:text-secondary-400">Kelgan</div>
                    <div className="font-semibold text-success-600">{week.present}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-secondary-600 dark:text-secondary-400">Kelmagan</div>
                    <div className="font-semibold text-danger-600">{week.absent}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-secondary-600 dark:text-secondary-400">Kech</div>
                    <div className="font-semibold text-warning-600">{week.late}</div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                    <div
                      className="h-2 bg-success-500 rounded-full"
                      style={{ width: `${(week.present / week.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject-wise Attendance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Fanlar bo'yicha davomat
          </h3>
          <div className="space-y-3">
            {attendanceData?.subjectAttendance.map((subject, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <AcademicCapIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-secondary-900 dark:text-white">
                      {subject.subject}
                    </h4>
                    <p className="text-xs text-secondary-600 dark:text-secondary-400">
                      {subject.present}/{subject.total} dars
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-secondary-900 dark:text-white">
                    {subject.rate.toFixed(1)}%
                  </div>
                  <div className="w-16 h-2 bg-secondary-200 dark:bg-secondary-700 rounded-full mt-1">
                    <div
                      className={`h-2 rounded-full ${
                        subject.rate >= 90 ? 'bg-success-500' :
                        subject.rate >= 80 ? 'bg-warning-500' : 'bg-danger-500'
                      }`}
                      style={{ width: `${subject.rate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Attendance Details */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Kunlik davomat tafsiloti
        </h3>
        <div className="space-y-2">
          {attendanceData?.dailyAttendance.map((day, index) => {
            const StatusIcon = getStatusIcon(day.status);
            
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <StatusIcon className={`w-5 h-5 ${
                    day.status === 'present' ? 'text-success-500' :
                    day.status === 'absent' ? 'text-danger-500' : 'text-warning-500'
                  }`} />
                  <div>
                    <div className="font-medium text-secondary-900 dark:text-white">
                      {new Date(day.date).toLocaleDateString('uz-UZ', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-sm text-secondary-600 dark:text-secondary-400">
                      {day.subject}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(day.status)}`}>
                    {getStatusText(day.status)}
                  </span>
                  {day.time && (
                    <div className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">
                      {day.time}
                    </div>
                  )}
                  {day.reason && (
                    <div className="text-xs text-danger-600 mt-1">
                      {day.reason}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attendance Trends */}
      <div className="card bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-700">
        <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-3">
          📊 Davomat tendensiyasi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {attendanceData?.trends.thisMonth}%
            </div>
            <div className="text-sm text-primary-800 dark:text-primary-200">
              Bu oy
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {attendanceData?.trends.lastMonth}%
            </div>
            <div className="text-sm text-primary-800 dark:text-primary-200">
              O'tgan oy
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              attendanceData?.trends.change > 0 ? 'text-success-600' : 'text-danger-600'
            }`}>
              {attendanceData?.trends.change > 0 ? '+' : ''}{attendanceData?.trends.change}%
            </div>
            <div className="text-sm text-primary-800 dark:text-primary-200">
              O'zgarish
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentAttendance;