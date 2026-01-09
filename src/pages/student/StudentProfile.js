import React, { useState } from 'react';
import { 
  UserIcon,
  PencilIcon,
  StarIcon,
  TrophyIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const StudentProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
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
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t('profile')}
        </h1>
        <button
          type="button"
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
                  {user?.fullName}
                </h2>
                <p className="text-secondary-600 dark:text-secondary-400 capitalize">
                  {user?.role} • {user?.group?.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <StarIcon className="w-4 h-4 text-warning-500" />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    {user?.points || 0} ball
                  </span>
                </div>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      {t('firstName')}
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
                      {t('lastName')}
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
                    Email (ixtiyoriy)
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
                      {t('firstName')}
                    </label>
                    <p className="text-secondary-900 dark:text-white">{user?.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">
                      {t('lastName')}
                    </label>
                    <p className="text-secondary-900 dark:text-white">{user?.lastName}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">
                    Email
                  </label>
                  <p className="text-secondary-900 dark:text-white">
                    {user?.email || t('notProvided')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">
                    {t('group')}
                  </label>
                  <p className="text-secondary-900 dark:text-white">
                    {user?.group?.name} - {user?.group?.subject}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">
                    {t('registeredOn')}
                  </label>
                  <p className="text-secondary-900 dark:text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : t('unknown')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats & Achievements */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card">
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">
              {t('quickStats')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StarIcon className="w-4 h-4 text-warning-500" />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    {t('points')}
                  </span>
                </div>
                <span className="font-medium text-secondary-900 dark:text-white">
                  {user?.points || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrophyIcon className="w-4 h-4 text-primary-500" />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    {t('achievements')}
                  </span>
                </div>
                <span className="font-medium text-secondary-900 dark:text-white">
                  {user?.achievements?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-success-500" />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    {t('lastLogin')}
                  </span>
                </div>
                <span className="font-medium text-secondary-900 dark:text-white text-xs">
                  {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : t('now')}
                </span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="card">
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">
              {t('achievements')}
            </h3>
            {user?.achievements && user.achievements.length > 0 ? (
              <div className="space-y-3">
                {user.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                    <div className="w-8 h-8 bg-warning-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrophyIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-white text-sm">
                        {achievement.title}
                      </p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
                        {new Date(achievement.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <TrophyIcon className="w-12 h-12 text-secondary-400 mx-auto mb-3" />
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  {t('noAchievements')}
                </p>
                <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
                  {t('beActiveAndAchieve')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;