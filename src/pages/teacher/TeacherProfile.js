import React, { useState } from 'react';
import { 
  UserIcon,
  PencilIcon,
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const TeacherProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      subject: user?.subject || ''
    }
  });

  const onSubmit = async (data) => {
    const result = await updateProfile(data);
    if (result.success) {
      setIsEditing(false);
      reset(data);
    }
  };

  const handleCancel = () => {
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      subject: user?.subject || ''
    });
    setIsEditing(false);
  };

  // Real statistics from user data
  const stats = {
    totalStudents: user?.groupsTaught?.reduce((total, group) => total + (group.studentCount || 0), 0) || 0,
    totalGroups: user?.groupsTaught?.length || 0,
    totalHomework: 0, // This should come from API
    averageGrade: 0, // This should come from API
    thisWeekClasses: 0, // This should come from API
    completedClasses: 0 // This should come from API
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Mening profilim
        </h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-outline flex items-center gap-2"
        >
          <PencilIcon className="w-4 h-4" />
          {isEditing ? t('cancel') : t('edit')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-secondary-600 dark:text-secondary-400">
                  {t('teacher')} • {user?.subject}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <AcademicCapIcon className="w-4 h-4 text-primary-500" />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    ID: {user?.teacherId}
                  </span>
                </div>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Ism
                    </label>
                    <input
                      {...register('firstName', { required: t('firstNameRequired') })}
                      type="text"
                      className="input"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-danger-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Familiya
                    </label>
                    <input
                      {...register('lastName', { required: t('lastNameRequired') })}
                      type="text"
                      className="input"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-danger-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Email
                  </label>
                  <input
                    {...register('email', {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t('invalidEmailFormat')
                      }
                    })}
                    type="email"
                    className="input"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-danger-600">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    {t('teachingSubject')}
                  </label>
                  <input
                    {...register('subject', { required: t('subjectRequired') })}
                    type="text"
                    className="input"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-danger-600">{errors.subject.message}</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary">
                    {t('save')}
                  </button>
                  <button type="button" onClick={handleCancel} className="btn-outline">
                    {t('cancel')}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">
                      Ism
                    </label>
                    <p className="text-secondary-900 dark:text-white">{user?.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">
                      Familiya
                    </label>
                    <p className="text-secondary-900 dark:text-white">{user?.lastName}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">
                    Email
                  </label>
                  <p className="text-secondary-900 dark:text-white">
                    {user?.email || 'Kiritilmagan'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">
                    {t('teachingSubject')}
                  </label>
                  <p className="text-secondary-900 dark:text-white">
                    {user?.subject}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">
                    {t('teacherId')}
                  </label>
                  <p className="text-secondary-900 dark:text-white">
                    {user?.teacherId}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">
                    {t('registeredOn')}
                  </label>
                  <p className="text-secondary-900 dark:text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Noma\'lum'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Teaching Schedule */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Dars jadvali
            </h3>
            {user?.schedule && user.schedule.length > 0 ? (
              <div className="space-y-3">
                {user.schedule.map((scheduleItem, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5 text-primary-500" />
                      <div>
                        <p className="font-medium text-secondary-900 dark:text-white capitalize">
                          {scheduleItem.day}
                        </p>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                          {scheduleItem.startTime} - {scheduleItem.endTime}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">
                      {scheduleItem.group?.name || t('group')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary-500 dark:text-secondary-400 text-center py-4">
                Jadval kiritilmagan
              </p>
            )}
          </div>
        </div>

        {/* Statistics & Groups */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card">
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">
              Statistika
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserGroupIcon className="w-4 h-4 text-primary-500" />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    {t('totalStudents')}
                  </span>
                </div>
                <span className="font-medium text-secondary-900 dark:text-white">
                  {stats.totalStudents}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AcademicCapIcon className="w-4 h-4 text-success-500" />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    {t('groups')}
                  </span>
                </div>
                <span className="font-medium text-secondary-900 dark:text-white">
                  {stats.totalGroups}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ChartBarIcon className="w-4 h-4 text-warning-500" />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    {t('averageGrade')}
                  </span>
                </div>
                <span className="font-medium text-secondary-900 dark:text-white">
                  {stats.averageGrade}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    {t('thisWeekClasses')}
                  </span>
                </div>
                <span className="font-medium text-secondary-900 dark:text-white">
                  {stats.thisWeekClasses}
                </span>
              </div>
            </div>
          </div>

          {/* Groups */}
          <div className="card">
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">
              {t('myGroups')}
            </h3>
            {user?.groupsTaught && user.groupsTaught.length > 0 ? (
              <div className="space-y-3">
                {user.groupsTaught.map((group) => (
                  <div key={group._id} className="flex items-center gap-3 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                    <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                      <UserGroupIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-white">
                        {group.name}
                      </p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">
                        {group.subject} - {group.level}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary-500 dark:text-secondary-400 text-center py-4">
                {t('noGroupsYet')}
              </p>
            )}
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">
              {t('recentActivity')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-secondary-900 dark:text-white">
                    {t('newHomeworkCreated')}
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    {t('hoursAgo', {hours: 2})}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-secondary-900 dark:text-white">
                    {t('homeworkGraded')}
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    4 soat oldin
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                <div className="w-2 h-2 bg-warning-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-secondary-900 dark:text-white">
                    {t('newCompetitionAnnounced')}
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    1 kun oldin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;