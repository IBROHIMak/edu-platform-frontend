import React, { useState, useEffect } from 'react';
import {
  PlayIcon,
  EyeIcon,
  ClockIcon,
  BookmarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentVideos = () => {
  const { t } = useLanguage();
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [watchedVideos, setWatchedVideos] = useState(new Set());
  const [bookmarkedVideos, setBookmarkedVideos] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchVideos();
    loadUserProgress();
  }, []);

  useEffect(() => {
    filterVideos();
  }, [videos, searchTerm, selectedLevel, selectedCategory]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      // Mock Cambridge English video data
      setVideos([
        {
          _id: '1',
          title: 'Cambridge English: Grammar Fundamentals',
          description: 'Master essential grammar rules for Cambridge English exams with clear explanations and examples.',
          thumbnail: '/api/placeholder/320/180',
          duration: '15:30',
          views: 245,
          uploadDate: '2024-01-10',
          level: 'B1',
          category: 'Grammar',
          rating: 4.8,
          videoUrl: '/uploads/videos/grammar-fundamentals.mp4',
          teacherName: 'Sarah Johnson'
        },
        {
          _id: '2',
          title: 'IELTS Speaking Practice: Part 1',
          description: 'Complete guide to IELTS Speaking Part 1 with sample questions and model answers.',
          thumbnail: '/api/placeholder/320/180',
          duration: '22:15',
          views: 189,
          uploadDate: '2024-01-08',
          level: 'B2',
          category: 'Speaking',
          rating: 4.9,
          videoUrl: '/uploads/videos/ielts-speaking-part1.mp4',
          teacherName: 'Michael Brown'
        },
        {
          _id: '3',
          title: 'Cambridge FCE Writing Task 1',
          description: 'Learn how to write effective essays for FCE exam with step-by-step guidance.',
          thumbnail: '/api/placeholder/320/180',
          duration: '18:45',
          views: 156,
          uploadDate: '2024-01-05',
          level: 'B2',
          category: 'Writing',
          rating: 4.7,
          videoUrl: '/uploads/videos/fce-writing-task1.mp4',
          teacherName: 'Emma Wilson'
        },
        {
          _id: '4',
          title: 'English Pronunciation: British vs American',
          description: 'Understand key pronunciation differences for Cambridge English exams.',
          thumbnail: '/api/placeholder/320/180',
          duration: '12:20',
          views: 298,
          uploadDate: '2024-01-03',
          level: 'A2',
          category: 'Pronunciation',
          rating: 4.6,
          videoUrl: '/uploads/videos/pronunciation-guide.mp4',
          teacherName: 'David Smith'
        },
        {
          _id: '5',
          title: 'Cambridge Advanced Vocabulary',
          description: 'Expand your vocabulary for C1 Advanced exam with practical examples.',
          thumbnail: '/api/placeholder/320/180',
          duration: '25:10',
          views: 134,
          uploadDate: '2024-01-01',
          level: 'C1',
          category: 'Vocabulary',
          rating: 4.9,
          videoUrl: '/uploads/videos/advanced-vocabulary.mp4',
          teacherName: 'Lisa Anderson'
        },
        {
          _id: '6',
          title: 'IELTS Listening Strategies',
          description: 'Proven strategies to improve your IELTS listening score.',
          thumbnail: '/api/placeholder/320/180',
          duration: '19:30',
          views: 201,
          uploadDate: '2023-12-28',
          level: 'B2',
          category: 'Listening',
          rating: 4.8,
          videoUrl: '/uploads/videos/ielts-listening.mp4',
          teacherName: 'James Taylor'
        }
      ]);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = () => {
    // Load from localStorage (in real app, this would come from API)
    const watched = JSON.parse(localStorage.getItem('watchedVideos') || '[]');
    const bookmarked = JSON.parse(localStorage.getItem('bookmarkedVideos') || '[]');
    setWatchedVideos(new Set(watched));
    setBookmarkedVideos(new Set(bookmarked));
  };

  const filterVideos = () => {
    let filtered = videos;

    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(video => video.level === selectedLevel);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    setFilteredVideos(filtered);
  };

  const handleVideoWatch = (video) => {
    setSelectedVideo(video);
    
    // Mark as watched
    const newWatched = new Set(watchedVideos);
    newWatched.add(video._id);
    setWatchedVideos(newWatched);
    localStorage.setItem('watchedVideos', JSON.stringify([...newWatched]));
  };

  const toggleBookmark = (videoId) => {
    const newBookmarked = new Set(bookmarkedVideos);
    if (newBookmarked.has(videoId)) {
      newBookmarked.delete(videoId);
    } else {
      newBookmarked.add(videoId);
    }
    setBookmarkedVideos(newBookmarked);
    localStorage.setItem('bookmarkedVideos', JSON.stringify([...newBookmarked]));
  };

  const getLevelColor = (level) => {
    const colors = {
      'A1': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'A2': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'B1': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'B2': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      'C1': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'C2': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    };
    return colors[level] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white mb-2">
          {t('videoLessonsTitle')}
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          {t('platformDescription')}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder={t('searchVideos')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-cambridge-500 focus:border-transparent"
            />
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-secondary-500" />
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-cambridge-500"
            >
              <option value="all">{t('allLevels')}</option>
              <option value="A1">A1 - {t('beginner')}</option>
              <option value="A2">A2 - {t('elementary')}</option>
              <option value="B1">B1 - {t('intermediate')}</option>
              <option value="B2">B2 - {t('upperIntermediate')}</option>
              <option value="C1">C1 - {t('advanced')}</option>
              <option value="C2">C2 - {t('proficiency')}</option>
            </select>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-cambridge-500"
          >
            <option value="all">{t('allCategories')}</option>
            <option value="Grammar">{t('grammar')}</option>
            <option value="Speaking">{t('speaking')}</option>
            <option value="Writing">{t('writing')}</option>
            <option value="Reading">{t('reading')}</option>
            <option value="Listening">{t('listening')}</option>
            <option value="Pronunciation">{t('pronunciation')}</option>
            <option value="Vocabulary">{t('vocabulary')}</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-secondary-600 dark:text-secondary-400">
          {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} found
        </p>
        <div className="flex items-center gap-4 text-sm text-secondary-500">
          <div className="flex items-center gap-1">
            <CheckCircleIcon className="w-4 h-4 text-green-500" />
            <span>{watchedVideos.size} {t('watched')}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookmarkIcon className="w-4 h-4 text-cambridge-500" />
            <span>{bookmarkedVideos.size} {t('saved')}</span>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map((video) => (
          <div key={video._id} className="card overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in">
            {/* Video Thumbnail */}
            <div className="relative aspect-video bg-secondary-100 dark:bg-secondary-800 rounded-lg overflow-hidden mb-4">
              <img
                src={`https://via.placeholder.com/320x180/0284c7/ffffff?text=${encodeURIComponent(video.title.substring(0, 20))}`}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleVideoWatch(video)}
                  className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all transform hover:scale-110"
                >
                  <PlayIcon className="w-6 h-6 sm:w-8 sm:h-8 text-cambridge-600 ml-1" />
                </button>
              </div>
              
              {/* Duration Badge */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
              
              {/* Watched Badge */}
              {watchedVideos.has(video._id) && (
                <div className="absolute top-2 left-2 bg-green-500 text-white p-1 rounded-full">
                  <CheckCircleIcon className="w-4 h-4" />
                </div>
              )}

              {/* Bookmark Button */}
              <button
                onClick={() => toggleBookmark(video._id)}
                className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${
                  bookmarkedVideos.has(video._id)
                    ? 'bg-cambridge-500 text-white'
                    : 'bg-white bg-opacity-75 text-secondary-600 hover:bg-opacity-100'
                }`}
              >
                <BookmarkIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Video Info */}
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-secondary-900 dark:text-white line-clamp-2 mb-1 text-sm sm:text-base">
                  {video.title}
                </h3>
                <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2">
                  {video.description}
                </p>
              </div>

              {/* Teacher */}
              <p className="text-xs text-cambridge-600 dark:text-cambridge-400 font-medium">
                by {video.teacherName}
              </p>

              {/* Level and Category */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getLevelColor(video.level)}`}>
                  {video.level}
                </span>
                <span className="px-2 py-1 text-xs bg-secondary-100 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-300 rounded-full">
                  {video.category}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-secondary-500 dark:text-secondary-400">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <EyeIcon className="w-3 h-3" />
                    <span>{video.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-3 h-3 text-yellow-500" />
                    <span>{video.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" />
                  <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Watch Button */}
              <button
                onClick={() => handleVideoWatch(video)}
                className="w-full bg-cambridge-600 text-white py-2 rounded-lg hover:bg-cambridge-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <PlayIcon className="w-4 h-4" />
                {watchedVideos.has(video._id) ? t('watchAgain') : t('watchNow')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <MagnifyingGlassIcon className="w-8 h-8 text-secondary-400" />
          </div>
          <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
            {t('noVideosFound')}
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            {t('adjustFilters')}
          </p>
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-800 rounded-lg overflow-hidden w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="aspect-video bg-black">
              <video
                controls
                autoPlay
                className="w-full h-full"
                poster={`https://via.placeholder.com/800x450/0284c7/ffffff?text=${encodeURIComponent(selectedVideo.title)}`}
              >
                <source src={selectedVideo.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                    {selectedVideo.title}
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400 mb-3">
                    {selectedVideo.description}
                  </p>
                  <p className="text-sm text-cambridge-600 dark:text-cambridge-400 font-medium">
                    by {selectedVideo.teacherName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-secondary-500 hover:text-secondary-700 text-2xl flex-shrink-0"
                >
                  ×
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-500 dark:text-secondary-400">
                <div className="flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" />
                  <span>{selectedVideo.views} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{selectedVideo.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 text-yellow-500" />
                  <span>{selectedVideo.rating} rating</span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(selectedVideo.level)}`}>
                  {selectedVideo.level}
                </span>
                <span className="px-2 py-1 text-xs bg-secondary-100 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-300 rounded-full">
                  {selectedVideo.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentVideos;