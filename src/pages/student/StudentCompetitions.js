import React, { useState, useEffect } from 'react';
import { 
  TrophyIcon,
  CalendarIcon,
  UserGroupIcon,
  StarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const StudentCompetitions = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { t } = useLanguage();

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const response = await axios.get('/api/competitions');
      setCompetitions(response.data.data.competitions);
    } catch (error) {
      console.error('Error fetching competitions:', error);
      toast.error(t('errorLoadingCompetitions'));
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCompetition = async (competitionId) => {
    try {
      await axios.post(`/api/competitions/${competitionId}/participate`);
      toast.success(t('successJoinedCompetition'));
      fetchCompetitions(); // Refresh the list
    } catch (error) {
      console.error('Error joining competition:', error);
      const message = error.response?.data?.message || t('errorJoiningCompetition');
      toast.error(message);
    }
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-800';
      case 'upcoming': return 'bg-primary-100 text-primary-800';
      case 'completed': return 'bg-secondary-100 text-secondary-600';
      default: return 'bg-secondary-100 text-secondary-600';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t('competitions')}
        </h1>
        <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
          <TrophyIcon className="w-5 h-5" />
          <span>{competitions.length} ta tanlov</span>
        </div>
      </div>

      {competitions.length === 0 ? (
        <div className="card text-center py-12">
          <TrophyIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
            {t('noCompetitions')}
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            {t('newCompetitionsWillAppear')}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {competitions.map((competition) => (
            <div key={competition._id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                      {competition.title}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(competition.status)}`}>
                      {getStatusText(competition.status)}
                    </span>
                  </div>
                  <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                    {competition.description}
                  </p>
                </div>
                <TrophyIcon className="w-8 h-8 text-warning-500" />
              </div>

              {/* Competition details */}
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
                  <ClockIcon className="w-5 h-5 text-danger-500" />
                  <div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">Tugash</p>
                    <p className="font-medium text-secondary-900 dark:text-white">
                      {new Date(competition.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                  <UserGroupIcon className="w-5 h-5 text-success-500" />
                  <div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">Ishtirokchilar</p>
                    <p className="font-medium text-secondary-900 dark:text-white">
                      {competition.participantCount} kishi
                    </p>
                  </div>
                </div>
              </div>

              {/* Eligible groups */}
              {competition.eligibleGroups && competition.eligibleGroups.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    {t('eligibleGroups')}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {competition.eligibleGroups.map((group) => (
                      <span
                        key={group._id}
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
                    🏆 Mukofotlar:
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
                            {prize.title || `${prize.position}-o'rin`}
                          </p>
                          {prize.points && (
                            <p className="text-sm text-warning-600 dark:text-warning-400">
                              {prize.points} ball
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules */}
              {competition.rules && competition.rules.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    📋 Qoidalar:
                  </p>
                  <ul className="space-y-1">
                    {competition.rules.map((rule, index) => (
                      <li key={index} className="text-sm text-secondary-600 dark:text-secondary-400 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Winners (if completed) */}
              {competition.status === 'completed' && competition.winners && competition.winners.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                    🎉 G'oliblar:
                  </p>
                  <div className="space-y-2">
                    {competition.winners.map((winner, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-success-50 dark:bg-success-900/20 rounded-lg"
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-success-500 text-white rounded-full text-sm font-bold">
                          {winner.position}
                        </div>
                        <div>
                          <p className="font-medium text-success-800 dark:text-success-200">
                            {winner.student.firstName} {winner.student.lastName}
                          </p>
                          <p className="text-sm text-success-600 dark:text-success-400">
                            {winner.prize}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-secondary-200 dark:border-secondary-700">
                <div className="flex items-center gap-4 text-sm text-secondary-500 dark:text-secondary-400">
                  {competition.isParticipating && (
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4 text-success-500" />
                      <span className="text-success-600 dark:text-success-400 font-medium">
                        Ishtirok etmoqdasiz
                      </span>
                    </div>
                  )}
                  {competition.userScore > 0 && (
                    <span>Sizning balingiz: {competition.userScore}</span>
                  )}
                </div>

                {competition.status === 'active' && !competition.isParticipating && (
                  <button
                    onClick={() => handleJoinCompetition(competition._id)}
                    className="btn-primary"
                  >
                    Ishtirok etish
                  </button>
                )}

                {competition.status === 'upcoming' && (
                  <span className="text-sm text-secondary-500 dark:text-secondary-400">
                    {t('startingSoon')}
                  </span>
                )}

                {competition.status === 'completed' && (
                  <span className="text-sm text-secondary-500 dark:text-secondary-400">
                    Yakunlangan
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCompetitions;