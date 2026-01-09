import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const TeacherGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    subject: '',
    level: '',
    maxStudents: 30,
    description: ''
  });

  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('/api/groups');
      // Filter groups taught by current teacher
      const teacherGroups = response.data.data.groups.filter(
        group => group.teacher._id === user.id
      );
      setGroups(teacherGroups);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error(t('errorLoadingGroups'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/groups', newGroup);
      toast.success(t('groupCreatedSuccessfully'));
      setShowCreateModal(false);
      setNewGroup({
        name: '',
        subject: '',
        level: '',
        maxStudents: 30,
        description: ''
      });
      fetchGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error(t('errorCreatingGroup'));
    }
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t('myGroups')}
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          {t('createNewGroup')}
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="card text-center py-12">
          <UserGroupIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
            {t('noGroupsYet')}
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            {t('createFirstGroup')}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            {t('createGroup')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                    <UserGroupIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 dark:text-white">
                      {group.name}
                    </h3>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      {group.subject} - {group.level}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-secondary-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-secondary-500 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4 text-secondary-500" />
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">
                      {t('students')}
                    </span>
                  </div>
                  <span className="font-medium text-secondary-900 dark:text-white">
                    {group.studentCount}/{group.maxStudents}
                  </span>
                </div>

                {group.description && (
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    {group.description}
                  </p>
                )}

                <div className="pt-3 border-t border-secondary-200 dark:border-secondary-700">
                  <div className="flex gap-2">
                    <button className="flex-1 btn-outline text-sm py-2">
                      {t('viewStudents')}
                    </button>
                    <button className="flex-1 btn-primary text-sm py-2">
                      {t('manage')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
              {t('createNewGroup')}
            </h2>
            
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  {t('groupName')} *
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder={t('groupName')}
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  {t('subject')} *
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder={t('subject')}
                  value={newGroup.subject}
                  onChange={(e) => setNewGroup({...newGroup, subject: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  {t('level')} *
                </label>
                <select
                  required
                  className="input"
                  value={newGroup.level}
                  onChange={(e) => setNewGroup({...newGroup, level: e.target.value})}
                >
                  <option value="">{t('selectLevel')}</option>
                  <option value="Boshlang'ich">{t('beginner')}</option>
                  <option value="O'rta">{t('intermediate')}</option>
                  <option value="Yuqori">{t('advanced')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  {t('maxStudents')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  className="input"
                  value={newGroup.maxStudents}
                  onChange={(e) => setNewGroup({...newGroup, maxStudents: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  {t('description')}
                </label>
                <textarea
                  rows={3}
                  className="input"
                  placeholder={t('groupDescription')}
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                />
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
    </div>
  );
};

export default TeacherGroups;