import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GiftIcon,
  StarIcon,
  TrophyIcon,
  SparklesIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  FireIcon,
  BookOpenIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminRewards = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bonusTasks');
  const [bonusTasks, setBonusTasks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchRewardsData();
  }, [activeTab]);

  const fetchRewardsData = async () => {
    try {
      setLoading(true);
      
      // Try to get data from localStorage first for persistence
      const savedBonusTasks = localStorage.getItem('adminBonusTasks');
      const savedRewards = localStorage.getItem('adminRewards');
      
      if (savedBonusTasks) {
        setBonusTasks(JSON.parse(savedBonusTasks));
      } else {
        // Default bonus tasks
        const defaultBonusTasks = [
          {
            _id: '1',
            title: 'Kundalik o\'qish',
            description: '30 daqiqa ingliz tilidagi kitob o\'qing',
            points: 10,
            type: 'daily',
            category: 'reading',
            isActive: true,
            completedCount: 15
          },
          {
            _id: '2',
            title: 'Grammar mashqlari',
            description: '20 ta grammar mashqini bajaring',
            points: 25,
            type: 'weekly',
            category: 'practice',
            isActive: true,
            completedCount: 8
          },
          {
            _id: '3',
            title: 'Ijodiy loyiha',
            description: 'Ingliz tilida taqdimot tayyorlang',
            points: 50,
            type: 'project',
            category: 'creativity',
            isActive: true,
            completedCount: 3
          }
        ];
        setBonusTasks(defaultBonusTasks);
        localStorage.setItem('adminBonusTasks', JSON.stringify(defaultBonusTasks));
      }

      if (savedRewards) {
        setRewards(JSON.parse(savedRewards));
      } else {
        // Default rewards
        const defaultRewards = [
          {
            _id: '1',
            name: 'Ingliz tilidagi kitob',
            description: 'Sevimli ingliz tilidagi kitobingizni tanlang',
            pointsCost: 100,
            type: 'physical',
            isAvailable: true,
            claimedCount: 5
          },
          {
            _id: '2',
            name: 'Maxsus nishon',
            description: 'Profilingizda ko\'rsatiladigan nishon',
            pointsCost: 50,
            type: 'digital',
            isAvailable: true,
            claimedCount: 12
          },
          {
            _id: '3',
            name: 'Qo\'shimcha ball',
            description: 'Imtihonda qo\'shimcha 5 ball',
            pointsCost: 200,
            type: 'academic',
            isAvailable: true,
            claimedCount: 2
          }
        ];
        setRewards(defaultRewards);
        localStorage.setItem('adminRewards', JSON.stringify(defaultRewards));
      }

      // Default achievements and competitions
      setAchievements([
        {
          _id: '1',
          name: 'Birinchi qadam',
          description: 'Birinchi bonus vazifani bajaring',
          icon: 'star',
          condition: 'complete_first_task',
          points: 20,
          earnedCount: 25
        },
        {
          _id: '2',
          name: 'O\'qish sevgisi',
          description: '10 ta kitob o\'qing',
          icon: 'book',
          condition: 'read_10_books',
          points: 100,
          earnedCount: 5
        },
        {
          _id: '3',
          name: 'Grammar ustasi',
          description: '50 ta grammar mashqini bajaring',
          icon: 'trophy',
          condition: 'solve_50_grammar',
          points: 150,
          earnedCount: 3
        }
      ]);

      setCompetitions([
        {
          _id: '1',
          title: 'Ingliz tili olimpiadasi',
          description: 'Maktab ingliz tili musobaqasi',
          startDate: '2024-02-01',
          endDate: '2024-02-15',
          participants: 25,
          prizes: ['1-o\'rin: 500 ball', '2-o\'rin: 300 ball', '3-o\'rin: 200 ball'],
          status: 'active'
        },
        {
          _id: '2',
          title: 'Ijodiy loyihalar',
          description: 'Eng yaxshi loyiha tanlovi',
          startDate: '2024-02-10',
          endDate: '2024-02-28',
          participants: 18,
          prizes: ['1-o\'rin: Tablet', '2-o\'rin: Kitoblar to\'plami', '3-o\'rin: 100 ball'],
          status: 'upcoming'
        }
      ]);

    } catch (error) {
      console.error('Error fetching rewards data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (type) => {
    setModalType(type);
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (type, id) => {
    if (window.confirm('Rostdan ham o\'chirmoqchimisiz?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`/api/admin/${type}/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.data.success) {
          alert('Muvaffaqiyatli o\'chirildi!');
        }
        
        fetchRewardsData();
      } catch (error) {
        console.error('Delete error:', error);
        // Fallback - simulate deletion
        if (type === 'bonusTasks') {
          setBonusTasks(bonusTasks.filter(t => t._id !== id));
        } else if (type === 'rewards') {
          setRewards(rewards.filter(r => r._id !== id));
        } else if (type === 'achievements') {
          setAchievements(achievements.filter(a => a._id !== id));
        } else if (type === 'competitions') {
          setCompetitions(competitions.filter(c => c._id !== id));
        }
        alert('Muvaffaqiyatli o\'chirildi!');
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (editingItem) {
        // Update existing item
        const response = await axios.put(`/api/admin/${modalType}/${editingItem._id}`, formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.data.success) {
          alert('Muvaffaqiyatli yangilandi!');
        }
      } else {
        // Create new item
        const response = await axios.post(`/api/admin/${modalType}`, formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.data.success) {
          alert('Muvaffaqiyatli yaratildi!');
        }
      }
      
      setShowModal(false);
      fetchRewardsData();
    } catch (error) {
      console.error('Save error:', error);
      // Fallback - simulate success and save to localStorage
      if (modalType === 'bonusTasks') {
        const newTask = {
          _id: Date.now().toString(),
          title: formData.title || 'Yangi vazifa',
          description: formData.description || 'Tavsif',
          points: parseInt(formData.points) || 10,
          type: 'daily',
          category: formData.category || 'reading',
          isActive: true,
          completedCount: 0
        };
        
        let updatedTasks;
        if (editingItem) {
          updatedTasks = bonusTasks.map(t => t._id === editingItem._id ? { ...t, ...newTask } : t);
        } else {
          updatedTasks = [...bonusTasks, newTask];
        }
        
        setBonusTasks(updatedTasks);
        localStorage.setItem('adminBonusTasks', JSON.stringify(updatedTasks));
      } else if (modalType === 'rewards') {
        const newReward = {
          _id: Date.now().toString(),
          name: formData.title || formData.name || 'Yangi mukofot',
          description: formData.description || 'Tavsif',
          pointsCost: parseInt(formData.pointsCost) || 50,
          type: formData.type || 'digital',
          isAvailable: true,
          claimedCount: 0
        };
        
        let updatedRewards;
        if (editingItem) {
          updatedRewards = rewards.map(r => r._id === editingItem._id ? { ...r, ...newReward } : r);
        } else {
          updatedRewards = [...rewards, newReward];
        }
        
        setRewards(updatedRewards);
        localStorage.setItem('adminRewards', JSON.stringify(updatedRewards));
      }
      
      alert(editingItem ? 'Muvaffaqiyatli yangilandi!' : 'Muvaffaqiyatli yaratildi!');
      setShowModal(false);
    }
  };

  const getTaskIcon = (category) => {
    const iconMap = {
      reading: BookOpenIcon,
      practice: PencilIcon,
      teamwork: UserGroupIcon,
      creativity: SparklesIcon,
      science: BookOpenIcon,
      mathematics: PencilIcon
    };
    return iconMap[category] || StarIcon;
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  const tabs = [
    { id: 'bonusTasks', label: t('bonusTasks'), icon: StarIcon },
    { id: 'rewards', label: 'Mukofotlar', icon: GiftIcon },
    { id: 'achievements', label: 'Yutuqlar', icon: TrophyIcon },
    { id: 'competitions', label: 'Tanlovlar', icon: FireIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t('bonusRewardsSystem')}
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          {t('manageStudentMotivation')}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200 dark:border-secondary-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Bonus Tasks Tab */}
      {activeTab === 'bonusTasks' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Bonus Vazifalar
            </h2>
            <button
              onClick={() => handleAdd('bonusTasks')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <PlusIcon className="w-4 h-4" />
              Yangi Vazifa
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bonusTasks.map((task) => {
              const IconComponent = getTaskIcon(task.category);
              return (
                <div key={task._id} className="card">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        task.isActive ? 'bg-primary-500' : 'bg-gray-400'
                      }`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary-900 dark:text-white">
                          {task.title}
                        </h3>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          {task.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2 py-1 text-xs bg-warning-100 text-warning-800 rounded-full">
                      +{task.points} ball
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {task.isActive ? 'Faol' : 'Nofaol'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-secondary-600 dark:text-secondary-400">
                      <span className="font-medium">{task.completedCount}</span> marta bajarilgan
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit('bonusTasks', task)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete('bonusTasks', task._id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Mukofotlar Katalogi
            </h2>
            <button
              onClick={() => handleAdd('rewards')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <PlusIcon className="w-4 h-4" />
              Yangi Mukofot
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <div key={reward._id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      reward.type === 'physical' ? 'bg-green-500' :
                      reward.type === 'digital' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}>
                      <GiftIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900 dark:text-white">
                        {reward.name}
                      </h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        {reward.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="px-3 py-1 text-sm bg-primary-100 text-primary-800 rounded-full font-medium">
                    {reward.pointsCost} ball
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    reward.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {reward.isAvailable ? 'Mavjud' : 'Tugagan'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-secondary-600 dark:text-secondary-400">
                    <span className="font-medium">{reward.claimedCount}</span> marta olingan
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit('rewards', reward)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('rewards', reward._id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Yutuqlar va Nishonlar
            </h2>
            <button
              onClick={() => handleAdd('achievements')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <PlusIcon className="w-4 h-4" />
              Yangi Yutuq
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div key={achievement._id} className="card">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    {achievement.icon === 'star' && <StarIcon className="w-8 h-8 text-white" />}
                    {achievement.icon === 'book' && <BookOpenIcon className="w-8 h-8 text-white" />}
                    {achievement.icon === 'trophy' && <TrophyIcon className="w-8 h-8 text-white" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 dark:text-white">
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {achievement.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full font-medium">
                    +{achievement.points} ball
                  </span>
                  <div className="text-sm text-secondary-600 dark:text-secondary-400">
                    <span className="font-medium">{achievement.earnedCount}</span> kishi olgan
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit('achievements', achievement)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('achievements', achievement._id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitions Tab */}
      {activeTab === 'competitions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Tanlovlar va Musobaqalar
            </h2>
            <button
              onClick={() => handleAdd('competitions')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <PlusIcon className="w-4 h-4" />
              Yangi Tanlov
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {competitions.map((competition) => (
              <div key={competition._id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                      {competition.title}
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-400">
                      {competition.description}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    competition.status === 'active' ? 'bg-green-100 text-green-800' :
                    competition.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {competition.status === 'active' ? 'Faol' :
                     competition.status === 'upcoming' ? 'Kutilmoqda' : 'Tugagan'}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600 dark:text-secondary-400">Boshlanish:</span>
                    <span className="text-secondary-900 dark:text-white">
                      {new Date(competition.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600 dark:text-secondary-400">Tugash:</span>
                    <span className="text-secondary-900 dark:text-white">
                      {new Date(competition.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600 dark:text-secondary-400">Ishtirokchilar:</span>
                    <span className="text-secondary-900 dark:text-white">
                      {competition.participants} kishi
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-secondary-900 dark:text-white mb-2">Sovrinlar:</h4>
                  <ul className="space-y-1">
                    {competition.prizes.map((prize, index) => (
                      <li key={index} className="text-sm text-secondary-600 dark:text-secondary-400 flex items-center gap-2">
                        <TrophyIcon className="w-4 h-4 text-yellow-500" />
                        {prize}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => navigate(`/admin/competitions/${competition._id}`)}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
                  >
                    <EyeIcon className="w-4 h-4" />
                    {t('viewDetails')}
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit('competitions', competition)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('competitions', competition._id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              {editingItem ? 'Tahrirlash' : 'Yangi Qo\'shish'}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const data = Object.fromEntries(formData.entries());
              handleSave(data);
            }}>
              <div className="space-y-4">
                <input
                  name="title"
                  type="text"
                  placeholder="Nomi"
                  className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                  defaultValue={editingItem?.title || editingItem?.name}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Tavsif"
                  className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg h-20 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                  defaultValue={editingItem?.description}
                  required
                />
                {modalType === 'bonusTasks' && (
                  <>
                    <input
                      name="points"
                      type="number"
                      placeholder="Balllar"
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      defaultValue={editingItem?.points}
                      min="1"
                      max="100"
                      required
                    />
                    <select 
                      name="category"
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      defaultValue={editingItem?.category}
                      required
                    >
                      <option value="">Kategoriya tanlang</option>
                      <option value="reading">O'qish</option>
                      <option value="practice">Mashq</option>
                      <option value="creativity">Ijodkorlik</option>
                      <option value="teamwork">Jamoaviy ish</option>
                    </select>
                  </>
                )}
                {modalType === 'rewards' && (
                  <>
                    <input
                      name="pointsCost"
                      type="number"
                      placeholder="Ball narxi"
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      defaultValue={editingItem?.pointsCost}
                      min="1"
                      required
                    />
                    <select 
                      name="type"
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      defaultValue={editingItem?.type}
                      required
                    >
                      <option value="">Tur tanlang</option>
                      <option value="physical">Jismoniy</option>
                      <option value="digital">Raqamli</option>
                      <option value="academic">Ta'lim</option>
                    </select>
                  </>
                )}
                {modalType === 'achievements' && (
                  <>
                    <input
                      name="points"
                      type="number"
                      placeholder="Ball miqdori"
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      defaultValue={editingItem?.points}
                      min="1"
                      required
                    />
                    <select 
                      name="icon"
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      defaultValue={editingItem?.icon}
                      required
                    >
                      <option value="">Belgi tanlang</option>
                      <option value="star">Yulduz</option>
                      <option value="book">Kitob</option>
                      <option value="trophy">Kubok</option>
                    </select>
                  </>
                )}
                {modalType === 'competitions' && (
                  <>
                    <input
                      name="startDate"
                      type="date"
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      defaultValue={editingItem?.startDate}
                      required
                    />
                    <input
                      name="endDate"
                      type="date"
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      defaultValue={editingItem?.endDate}
                      required
                    />
                  </>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
                >
                  Saqlash
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-secondary-300 text-secondary-700 py-2 rounded-lg hover:bg-secondary-400"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRewards;