import React, { useState, useEffect } from 'react';
import { 
  GiftIcon,
  StarIcon,
  LockClosedIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const StudentRewards = () => {
  const [rewards, setRewards] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await axios.get('/api/rewards');
      setRewards(response.data.data.rewards);
      setUserPoints(response.data.data.userPoints);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      toast.error(t('errorLoadingRewards'));
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async (rewardId) => {
    try {
      await axios.post(`/api/rewards/${rewardId}/claim`);
      toast.success(t('rewardClaimedSuccessfully'));
      fetchRewards(); // Refresh the list
    } catch (error) {
      console.error('Error claiming reward:', error);
      const message = error.response?.data?.message || t('errorClaimingReward');
      toast.error(message);
    }
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  const getRewardStatus = (reward) => {
    if (reward.claimed) return 'claimed';
    if (reward.canClaim) return 'available';
    return 'locked';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'claimed': return 'bg-success-100 text-success-800 border-success-200';
      case 'available': return 'bg-primary-100 text-primary-800 border-primary-200';
      default: return 'bg-secondary-100 text-secondary-600 border-secondary-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'claimed': return CheckCircleIcon;
      case 'available': return GiftIcon;
      default: return LockClosedIcon;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'claimed': return t('claimed');
      case 'available': return t('available');
      default: return t('locked');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t('rewards')}
        </h1>
        <div className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-lg">
          <StarIcon className="w-5 h-5 text-primary-600" />
          <span className="font-semibold text-primary-700 dark:text-primary-400">
            {userPoints} ball
          </span>
        </div>
      </div>

      {/* Progress info */}
      <div className="card">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          {t('rewardsSystem')}
        </h2>
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
          <p className="text-sm text-primary-700 dark:text-primary-400 mb-2">
            💡 <strong>{t('rules')}:</strong>
          </p>
          <ul className="text-sm text-primary-600 dark:text-primary-400 space-y-1">
            <li>• {t('rewardRuleSequential')}</li>
            <li>• {t('rewardRulePrevious')}</li>
            <li>• {t('rewardRuleBonusTasks')}</li>
            <li>• {t('rewardRulePointsDeducted')}</li>
          </ul>
        </div>
      </div>

      {rewards.length === 0 ? (
        <div className="card text-center py-12">
          <GiftIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
            {t('noRewardsYet')}
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            {t('rewardsComingSoon')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward, index) => {
            const status = getRewardStatus(reward);
            const StatusIcon = getStatusIcon(status);
            
            return (
              <div
                key={reward._id}
                className={`card border-2 ${getStatusColor(status)} ${
                  status === 'locked' ? 'opacity-60' : ''
                }`}
              >
                {/* Reward image placeholder */}
                <div className="w-full h-32 bg-secondary-100 dark:bg-secondary-700 rounded-lg mb-4 flex items-center justify-center">
                  {reward.image ? (
                    <img
                      src={reward.image}
                      alt={reward.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <GiftIcon className="w-12 h-12 text-secondary-400" />
                  )}
                </div>

                {/* Reward info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-secondary-900 dark:text-white">
                      {reward.title}
                    </h3>
                    <span className="text-xs bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
                      #{reward.order}
                    </span>
                  </div>

                  {reward.description && (
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {reward.description}
                    </p>
                  )}

                  {/* Points required */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StarIcon className="w-4 h-4 text-warning-500" />
                      <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                        {reward.pointsRequired} ball
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-xs font-medium">
                        {getStatusText(status)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {status === 'locked' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-secondary-500">
                        <span>Progress</span>
                        <span>{userPoints} / {reward.pointsRequired}</span>
                      </div>
                      <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((userPoints / reward.pointsRequired) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action button */}
                  {status === 'available' && (
                    <button
                      onClick={() => handleClaimReward(reward._id)}
                      className="w-full btn-primary"
                    >
                      {t('claimReward')}
                    </button>
                  )}

                  {status === 'claimed' && (
                    <div className="w-full bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 py-2 px-4 rounded-lg text-center text-sm font-medium">
                      ✅ Olingan
                    </div>
                  )}

                  {status === 'locked' && (
                    <div className="w-full bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400 py-2 px-4 rounded-lg text-center text-sm">
                      🔒 Qulflangan
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tips */}
      <div className="card bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-700">
        <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-3">
          💡 {t('waysToEarnPoints')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-primary-800 dark:text-primary-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span>{t('submitHomeworkOnTime')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span>{t('completeBonusTasks')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span>{t('participateInCompetitions')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span>{t('participateActivelyInClass')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRewards;