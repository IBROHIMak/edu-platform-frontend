import React, { useState, useEffect } from 'react';
import { 
  BookOpenIcon,
  PlusIcon,
  PlayIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const TeacherHomework = () => {
  const [homework, setHomework] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [newHomework, setNewHomework] = useState({
    title: '',
    description: '',
    group: '',
    dueDate: '',
    exercises: [
      {
        title: '',
        description: '',
        pageRange: { from: '', to: '' },
        exerciseNumbers: '',
        explanationVideo: { url: '', title: '' },
        points: 10
      }
    ]
  });

  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [groupsRes, homeworkRes] = await Promise.all([
        axios.get('/api/groups'),
        axios.get('/api/homework/teacher')
      ]);

      const teacherGroups = groupsRes.data.data.groups.filter(
        group => group.teacher._id === user.id
      );
      setGroups(teacherGroups);

      // Filter homework by teacher's groups
      const teacherHomework = homeworkRes.data?.data?.homework?.filter(
        hw => teacherGroups.some(group => group._id === hw.group._id)
      ) || [];
      setHomework(teacherHomework);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Create mock data for now
      setHomework([
        {
          _id: '1',
          title: t('grammarExercises'),
          description: t('algebraExercisesExample'),
          group: { name: 'Algebra-1', _id: 'group1' },
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          exercises: [
            {
              title: '7-bet mashqlari',
              description: t('vocabularyBuilding'),
              pageRange: { from: 7, to: 7 },
              points: 10
            }
          ],
          submissions: [
            { student: { firstName: 'Ali', lastName: 'Valiyev' }, status: 'submitted', totalGrade: 9 },
            { student: { firstName: 'Malika', lastName: 'Toshmatova' }, status: 'graded', totalGrade: 8 }
          ],
          createdAt: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHomework = async (e) => {
    e.preventDefault();
    try {
      // Process exercises
      const processedExercises = newHomework.exercises.map(ex => ({
        ...ex,
        exerciseNumbers: ex.exerciseNumbers.split(',').map(n => n.trim()).filter(n => n)
      }));

      const homeworkData = {
        ...newHomework,
        exercises: processedExercises
      };

      await axios.post('/api/homework', homeworkData);
      toast.success(t('homeworkCreatedSuccessfully'));
      setShowCreateModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error creating homework:', error);
      toast.error(t('errorCreatingHomework'));
    }
  };

  const resetForm = () => {
    setNewHomework({
      title: '',
      description: '',
      group: '',
      dueDate: '',
      exercises: [
        {
          title: '',
          description: '',
          pageRange: { from: '', to: '' },
          exerciseNumbers: '',
          explanationVideo: { url: '', title: '' },
          points: 10
        }
      ]
    });
  };

  const addExercise = () => {
    setNewHomework({
      ...newHomework,
      exercises: [
        ...newHomework.exercises,
        {
          title: '',
          description: '',
          pageRange: { from: '', to: '' },
          exerciseNumbers: '',
          explanationVideo: { url: '', title: '' },
          points: 10
        }
      ]
    });
  };

  const updateExercise = (index, field, value) => {
    const updatedExercises = [...newHomework.exercises];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updatedExercises[index][parent][child] = value;
    } else {
      updatedExercises[index][field] = value;
    }
    setNewHomework({ ...newHomework, exercises: updatedExercises });
  };

  const viewSubmissions = (homework) => {
    setSelectedHomework(homework);
    setShowSubmissionsModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'text-warning-600 bg-warning-100';
      case 'graded': return 'text-success-600 bg-success-100';
      case 'late': return 'text-danger-600 bg-danger-100';
      default: return 'text-secondary-600 bg-secondary-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'submitted': return t('submitted');
      case 'graded': return t('graded');
      case 'late': return t('late');
      default: return t('pending');
    }
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t('homework')}
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          {t('createNewHomework')}
        </button>
      </div>

      {homework.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpenIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
            {t('noHomeworkYet')}
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            {t('createFirstHomework')}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            {t('createHomework')}
          </button>
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
                      <span>{t('group')}: {hw.group?.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{hw.exercises?.length || 0} {t('exercises')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submissions Summary */}
              <div className="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-secondary-900 dark:text-white mb-3">
                  {t('submissionStatus')}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {hw.submissions?.length || 0}
                    </div>
                    <div className="text-sm text-secondary-500">{t('totalSubmitted')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning-600">
                      {hw.submissions?.filter(s => s.status === 'submitted').length || 0}
                    </div>
                    <div className="text-sm text-secondary-500">{t('ungraded')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success-600">
                      {hw.submissions?.filter(s => s.status === 'graded').length || 0}
                    </div>
                    <div className="text-sm text-secondary-500">{t('graded')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary-600">
                      {hw.submissions?.reduce((sum, s) => sum + (s.totalGrade || 0), 0) / (hw.submissions?.length || 1) || 0}
                    </div>
                    <div className="text-sm text-secondary-500">{t('averageScore')}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => viewSubmissions(hw)}
                  className="btn-primary flex items-center gap-2"
                >
                  <EyeIcon className="w-4 h-4" />
                  {t('viewSubmissions')}
                </button>
                <button className="btn-outline">
                  {t('edit')}
                </button>
                <button className="btn-outline text-danger-600 border-danger-300 hover:bg-danger-50">
                  {t('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Homework Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
              {t('createNewHomework')}
            </h2>
            
            <form onSubmit={handleCreateHomework} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    {t('homeworkName')} *
                  </label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder={t('homeworkName')}
                    value={newHomework.title}
                    onChange={(e) => setNewHomework({...newHomework, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    {t('group')} *
                  </label>
                  <select
                    required
                    className="input"
                    value={newHomework.group}
                    onChange={(e) => setNewHomework({...newHomework, group: e.target.value})}
                  >
                    <option value="">{t('selectGroup')}</option>
                    {groups.map((group) => (
                      <option key={group._id} value={group._id}>
                        {group.name} - {group.subject}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  {t('description')}
                </label>
                <textarea
                  rows={3}
                  className="input"
                  placeholder={t('homeworkDescription')}
                  value={newHomework.description}
                  onChange={(e) => setNewHomework({...newHomework, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  {t('dueDate')} *
                </label>
                <input
                  type="datetime-local"
                  required
                  className="input"
                  value={newHomework.dueDate}
                  onChange={(e) => setNewHomework({...newHomework, dueDate: e.target.value})}
                />
              </div>

              {/* Exercises */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
                    {t('exercises')}
                  </h3>
                  <button
                    type="button"
                    onClick={addExercise}
                    className="btn-outline text-sm"
                  >
                    + {t('addExercise')}
                  </button>
                </div>

                {newHomework.exercises.map((exercise, index) => (
                  <div key={index} className="border border-secondary-200 dark:border-secondary-700 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-secondary-900 dark:text-white mb-3">
                      {t('exercise')} #{index + 1}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          {t('exerciseName')}
                        </label>
                        <input
                          type="text"
                          className="input"
                          placeholder={t('exerciseName')}
                          value={exercise.title}
                          onChange={(e) => updateExercise(index, 'title', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          {t('points')}
                        </label>
                        <input
                          type="number"
                          min="1"
                          className="input"
                          value={exercise.points}
                          onChange={(e) => updateExercise(index, 'points', parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        {t('description')}
                      </label>
                      <textarea
                        rows={2}
                        className="input"
                        placeholder={t('exerciseDescription')}
                        value={exercise.description}
                        onChange={(e) => updateExercise(index, 'description', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          {t('pageFrom')}
                        </label>
                        <input
                          type="number"
                          className="input"
                          value={exercise.pageRange.from}
                          onChange={(e) => updateExercise(index, 'pageRange.from', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          {t('pageTo')}
                        </label>
                        <input
                          type="number"
                          className="input"
                          value={exercise.pageRange.to}
                          onChange={(e) => updateExercise(index, 'pageRange.to', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          {t('exerciseNumbers')}
                        </label>
                        <input
                          type="text"
                          className="input"
                          placeholder="1,2,3,4"
                          value={exercise.exerciseNumbers}
                          onChange={(e) => updateExercise(index, 'exerciseNumbers', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          {t('videoUrl')}
                        </label>
                        <input
                          type="url"
                          className="input"
                          placeholder="https://youtube.com/..."
                          value={exercise.explanationVideo.url}
                          onChange={(e) => updateExercise(index, 'explanationVideo.url', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          {t('videoTitle')}
                        </label>
                        <input
                          type="text"
                          className="input"
                          placeholder={t('explanationVideo')}
                          value={exercise.explanationVideo.title}
                          onChange={(e) => updateExercise(index, 'explanationVideo.title', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-outline"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  {t('create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submissions Modal */}
      {showSubmissionsModal && selectedHomework && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
              {selectedHomework.title} - {t('submissions')}
            </h2>
            
            {selectedHomework.submissions?.length === 0 ? (
              <div className="text-center py-8">
                <BookOpenIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                <p className="text-secondary-600 dark:text-secondary-400">
                  {t('noSubmissionsYet')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedHomework.submissions?.map((submission, index) => (
                  <div key={index} className="border border-secondary-200 dark:border-secondary-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-secondary-900 dark:text-white">
                          {submission.student.firstName} {submission.student.lastName}
                        </h4>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                          {t('submittedAt')}: {new Date(submission.submittedAt || Date.now()).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(submission.status)}`}>
                          {getStatusText(submission.status)}
                        </span>
                        {submission.totalGrade && (
                          <span className="text-lg font-bold text-primary-600">
                            {submission.totalGrade}/10
                          </span>
                        )}
                        <button className="btn-primary text-sm">
                          {t('grade')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setShowSubmissionsModal(false)}
                className="btn-outline"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherHomework;