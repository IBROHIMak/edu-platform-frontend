import React, { useState, useEffect } from 'react';
import { 
  TrophyIcon,
  PlusIcon,
  CalendarIcon,
  UserGroupIcon,
  StarIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const TeacherCompetitions = () => {
  const [competitions, setCompetitions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCompetition, setNewCompetition] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    eligibleGroups: [],
    rules: [''],
    prizes: [
      { position: 1, title: '1-o\'rin', description: '', points: 100 },
      { position: 2, title: '2-o\'rin', description: '', points: 75 },
      { position: 3, title: '3-o\'rin', description: '', points: 50 }
    ]
  });

  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [groupsRes, competitionsRes] = await Promise.all([
        axios.get('/api/groups'),
        axios.get('/api/competitions')
      ]);

      const teacherGroups = groupsRes.data.data.groups.filter(
        group => group.teacher._id === user.id
      );
      setGroups(teacherGroups);

      // Filter competitions created by teacher
      const teacherCompetitions = competitionsRes.data.data.competitions.filter(
        comp => comp.createdBy._id === user.id
      );
      setCompetitions(teacherCompetitions);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback data when API is not available
      setCompetitions([
        {
          _id: '1',
          title: t('englishLanguage') + ' ' + t('olympiad'),
          description: t('annualEnglishOlympiad'),
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          status: 'upcoming',
          participantCount: 15,
          eligibleGroups: [{ name: 'Algebra-1' }, { name: 'Physics-2' }],
          prizes: [
            { position: 1, title: '1-o\'rin', points: 100 },
            { position: 2, title: '2-o\'rin', points: 75 },
            { position: 3, title: '3-o\'rin', points: 50 }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompetition = async (e) => {
    e.preventDefault();
    try {
      const competitionData = {
        ...newCompetition,
        rules: newCompetition.rules.filter(rule => rule.trim() !== '')
      };

      await axios.post('/api/competitions', competitionData);
      toast.success(t('successCreatedCompetition'));
      setShowCreateModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error creating competition:', error);
      toast.error(t('errorCreatingCompetition'));
    }
  };

  const resetForm = () => {
    setNewCompetition({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      eligibleGroups: [],
      rules: [''],
      prizes: [
        { position: 1, title: '1-o\'rin', description: '', points: 100 },
        { position: 2, title: '2-o\'rin', description: '', points: 75 },
        { position: 3, title: '3-o\'rin', description: '', points: 50 }
      ]
    });
  };

  const addRule = () => {
    setNewCompetition({
      ...newCompetition,
      rules: [...newCompetition.rules, '']
    });
  };

  const updateRule = (index, value) => {
    const updatedRules = [...newCompetition.rules];
    updatedRules[index] = value;
    setNewCompetition({ ...newCompetition, rules: updatedRules });
  };

  const removeRule = (index) => {
    const updatedRules = newCompetition.rules.filter((_, i) => i !== index);
    setNewCompetition({ ...newCompetition, rules: updatedRules });
  };

  const updatePrize = (index, field, value) => {
    const updatedPrizes = [...newCompetition.prizes];
    updatedPrizes[index][field] = value;
    setNewCompetition({ ...newCompetition, prizes: updatedPrizes });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success-600 bg-success-100';
      case 'upcoming': return 'text-primary-600 bg-primary-100';
      case 'completed': return 'text-secondary-600 bg-secondary-100';
      default: return 'text-secondary-600 bg-secondary-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return t('active');
      case 'upcoming': return t('upcoming');
      case 'completed': return t('completed');
      default: return t('unknown');
    }
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t('competitions')}
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          {t('createNewCompetition')}
        </button>
      </div>

      {competitions.length === 0 ? (
        <div className="card text-center py-12">
          <TrophyIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
            {t('noCompetitions')}
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            {t('newCompetitionsWillAppear')}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            {t('createCompetition')}
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {competitions.map((competition) => (
            <div key={competition._id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-warning-500 rounded-xl flex items-center justify-center">
                    <TrophyIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-1">
                      {competition.title}
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-400 mb-2">
                      {competition.description}
                    </p>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(competition.status)}`}>
                      {getStatusText(competition.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Competition Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">{t('startDate')}</p>
                    <p className="font-medium text-secondary-900 dark:text-white">
                      {new Date(competition.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-danger-500" />
                  <div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">{t('endDate')}</p>
                    <p className="font-medium text-secondary-900 dark:text-white">
                      {new Date(competition.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                  <UserGroupIcon className="w-5 h-5 text-success-500" />
                  <div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">{t('participantsCount')}</p>
                    <p className="font-medium text-secondary-900 dark:text-white">
                      {competition.participantCount || 0} {t('people')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Eligible Groups */}
              {competition.eligibleGroups && competition.eligibleGroups.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    {t('eligibleGroups')}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {competition.eligibleGroups.map((group, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-sm rounded-full"
                      >
                        {group.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Prizes */}
              {competition.prizes && competition.prizes.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                    🏆 {t('prizes')}:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {competition.prizes.slice(0, 3).map((prize, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-800/20 rounded-lg border border-warning-200 dark:border-warning-700"
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-warning-500 text-white rounded-full text-sm font-bold">
                          {prize.position}
                        </div>
                        <div>
                          <p className="font-medium text-warning-800 dark:text-warning-200">
                            {prize.title}
                          </p>
                          {prize.points && (
                            <p className="text-sm text-warning-600 dark:text-warning-400">
                              {prize.points} {t('points')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                <button className="btn-primary">
                  {t('manage')}
                </button>
                <button className="btn-outline">
                  {t('participants')}
                </button>
                <button className="btn-outline">
                  {t('results')}
                </button>
                <button className="btn-outline text-danger-600 border-danger-300 hover:bg-danger-50">
                  {t('deleteButton')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Competition Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
              {t('createNewCompetition')}
            </h2>
            
            <form onSubmit={handleCreateCompetition} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    {t('competitionName')} *
                  </label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder={t('competitionName')}
                    value={newCompetition.title}
                    onChange={(e) => setNewCompetition({...newCompetition, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    {t('participantGroups')} *
                  </label>
                  <select
                    multiple
                    required
                    className="input"
                    value={newCompetition.eligibleGroups}
                    onChange={(e) => setNewCompetition({
                      ...newCompetition, 
                      eligibleGroups: Array.from(e.target.selectedOptions, option => option.value)
                    })}
                  >
                    {groups.map((group) => (
                      <option key={group._id} value={group._id}>
                        {group.name} - {group.subject}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-secondary-500 mt-1">{t('selectMultipleGroups')}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  {t('description')}
                </label>
                <textarea
                  rows={3}
                  className="input"
                  placeholder={t('competitionDescription')}
                  value={newCompetition.description}
                  onChange={(e) => setNewCompetition({...newCompetition, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    {t('startDate')} *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    className="input"
                    value={newCompetition.startDate}
                    onChange={(e) => setNewCompetition({...newCompetition, startDate: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    {t('endDate')} *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    className="input"
                    value={newCompetition.endDate}
                    onChange={(e) => setNewCompetition({...newCompetition, endDate: e.target.value})}
                  />
                </div>
              </div>

              {/* Rules */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    {t('rules')}
                  </label>
                  <button
                    type="button"
                    onClick={addRule}
                    className="btn-outline text-sm"
                  >
                    + {t('addRule')}
                  </button>
                </div>
                {newCompetition.rules.map((rule, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="input flex-1"
                      placeholder={`${t('rules')} ${index + 1}`}
                      value={rule}
                      onChange={(e) => updateRule(index, e.target.value)}
                    />
                    {newCompetition.rules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRule(index)}
                        className="btn-outline text-danger-600 px-3"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Prizes */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                  {t('prizes')}
                </label>
                {newCompetition.prizes.map((prize, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                    <div>
                      <label className="block text-xs text-secondary-500 mb-1">{t('position')}</label>
                      <input
                        type="text"
                        className="input"
                        value={prize.title}
                        onChange={(e) => updatePrize(index, 'title', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-secondary-500 mb-1">{t('prizeDescription')}</label>
                      <input
                        type="text"
                        className="input"
                        placeholder={t('prizeDescription')}
                        value={prize.description}
                        onChange={(e) => updatePrize(index, 'description', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-secondary-500 mb-1">{t('points')}</label>
                      <input
                        type="number"
                        className="input"
                        value={prize.points}
                        onChange={(e) => updatePrize(index, 'points', parseInt(e.target.value))}
                      />
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
                  {t('cancelButton')}
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

export default TeacherCompetitions;