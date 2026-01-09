import React, { useState, useEffect } from 'react';
import { 
  BookOpenIcon,
  PlayIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const StudentHomework = () => {
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [submissionData, setSubmissionData] = useState({});
  
  const { t } = useLanguage();

  useEffect(() => {
    fetchHomework();
  }, []);

  const fetchHomework = async () => {
    try {
      const response = await axios.get('/api/homework/student');
      setHomework(response.data.data.homework);
    } catch (error) {
      console.error('Error fetching homework:', error);
      toast.error(t('errorLoadingHomework'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitHomework = async (homeworkId) => {
    try {
      const exercises = submissionData[homeworkId] || [];
      await axios.post(`/api/homework/${homeworkId}/submit`, { exercises });
      toast.success(t('homeworkSubmittedSuccessfully'));
      fetchHomework(); // Refresh the list
      setSelectedHomework(null);
    } catch (error) {
      console.error('Error submitting homework:', error);
      toast.error(t('errorSubmittingHomework'));
    }
  };

  const updateSubmissionData = (homeworkId, exerciseIndex, answer) => {
    setSubmissionData(prev => ({
      ...prev,
      [homeworkId]: {
        ...prev[homeworkId],
        [exerciseIndex]: { answer }
      }
    }));
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  const getStatusColor = (homework) => {
    if (homework.submissionStatus === 'submitted') return 'text-success-600 bg-success-100';
    if (homework.submissionStatus === 'graded') return 'text-primary-600 bg-primary-100';
    if (homework.isOverdue) return 'text-danger-600 bg-danger-100';
    return 'text-warning-600 bg-warning-100';
  };

  const getStatusText = (homework) => {
    if (homework.submissionStatus === 'submitted') return t('submitted');
    if (homework.submissionStatus === 'graded') return t('graded');
    if (homework.isOverdue) return t('overdue');
    return t('pending');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t('homework')}
        </h1>
        <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
          <BookOpenIcon className="w-5 h-5" />
          <span>{homework.length} {t('assignments')}</span>
        </div>
      </div>

      {homework.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpenIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
            {t('noHomework')}
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            {t('noNewHomework')}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {homework.map((hw) => (
            <div key={hw._id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                    {hw.title}
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400 mb-3">
                    {hw.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-secondary-500 dark:text-secondary-400">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{t('dueDate')}: {new Date(hw.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{t('teacher')}: {hw.teacher.firstName} {hw.teacher.lastName}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(hw)}`}>
                  {getStatusText(hw)}
                </span>
              </div>

              {/* Exercises */}
              <div className="space-y-4">
                <h4 className="font-medium text-secondary-900 dark:text-white">
                  Mashqlar ({hw.exercises.length} ta)
                </h4>
                {hw.exercises.map((exercise, index) => (
                  <div key={index} className="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h5 className="font-medium text-secondary-900 dark:text-white mb-1">
                          {exercise.title}
                        </h5>
                        {exercise.description && (
                          <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                            {exercise.description}
                          </p>
                        )}
                        {exercise.pageRange && (
                          <p className="text-sm text-secondary-500 dark:text-secondary-400">
                            Sahifalar: {exercise.pageRange.from} - {exercise.pageRange.to}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {exercise.points} ball
                      </span>
                    </div>

                    {/* Video explanation */}
                    {exercise.explanationVideo && exercise.explanationVideo.url && (
                      <div className="mb-3">
                        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h6 className="font-medium text-primary-900 dark:text-primary-100">
                              📹 Tushuntirish videosi
                            </h6>
                            <span className="text-xs text-primary-600 dark:text-primary-400">
                              O'qituvchi tomonidan
                            </span>
                          </div>
                          <p className="text-sm text-primary-700 dark:text-primary-300 mb-3">
                            {exercise.explanationVideo.title || 'Video tushuntirish'}
                          </p>
                          <a
                            href={exercise.explanationVideo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                          >
                            <PlayIcon className="w-4 h-4" />
                            Videoni ko'rish
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Answer input (only if not submitted) */}
                    {hw.submissionStatus === 'not_submitted' && !hw.isOverdue && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          Javobingiz:
                        </label>
                        <textarea
                          rows={3}
                          className="input"
                          placeholder="Javobingizni yozing..."
                          onChange={(e) => updateSubmissionData(hw._id, index, e.target.value)}
                        />
                      </div>
                    )}

                    {/* Show grade if graded */}
                    {hw.submissionStatus === 'graded' && hw.studentGrade && (
                      <div className="mt-3 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-success-500" />
                        <span className="text-sm font-medium text-success-700 dark:text-success-400">
                          {t('grade')}: {hw.studentGrade}/10
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit button */}
              {hw.submissionStatus === 'not_submitted' && !hw.isOverdue && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleSubmitHomework(hw._id)}
                    className="btn-primary"
                  >
                    Topshirish
                  </button>
                </div>
              )}

              {/* Overdue warning */}
              {hw.isOverdue && hw.submissionStatus === 'not_submitted' && (
                <div className="mt-4 flex items-center gap-2 p-3 bg-danger-50 dark:bg-danger-900/20 rounded-lg">
                  <ExclamationTriangleIcon className="w-5 h-5 text-danger-500" />
                  <span className="text-sm text-danger-700 dark:text-danger-400">
                    {t('assignmentOverdue')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentHomework;