import React, { useState, useEffect } from 'react';
import {
  PlayIcon,
  PlusIcon,
  VideoCameraIcon,
  CloudArrowUpIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const TeacherVideos = () => {
  const { t } = useLanguage();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      // Mock data for Cambridge English videos
      setVideos([
        {
          _id: '1',
          title: 'Cambridge English: Grammar Fundamentals',
          description: 'Essential grammar rules for Cambridge English exams',
          thumbnail: '/api/placeholder/320/180',
          duration: '15:30',
          views: 245,
          uploadDate: '2024-01-10',
          level: 'B1',
          category: 'Grammar',
          status: 'published',
          videoUrl: '/uploads/videos/grammar-fundamentals.mp4'
        },
        {
          _id: '2',
          title: 'IELTS Speaking Practice: Part 1',
          description: 'Complete guide to IELTS Speaking Part 1 with examples',
          thumbnail: '/api/placeholder/320/180',
          duration: '22:15',
          views: 189,
          uploadDate: '2024-01-08',
          level: 'B2',
          category: 'Speaking',
          status: 'published',
          videoUrl: '/uploads/videos/ielts-speaking-part1.mp4'
        },
        {
          _id: '3',
          title: 'Cambridge FCE Writing Task 1',
          description: 'How to write effective essays for FCE exam',
          thumbnail: '/api/placeholder/320/180',
          duration: '18:45',
          views: 156,
          uploadDate: '2024-01-05',
          level: 'B2',
          category: 'Writing',
          status: 'draft',
          videoUrl: '/uploads/videos/fce-writing-task1.mp4'
        },
        {
          _id: '4',
          title: 'English Pronunciation: British vs American',
          description: 'Key differences in pronunciation for Cambridge exams',
          thumbnail: '/api/placeholder/320/180',
          duration: '12:20',
          views: 298,
          uploadDate: '2024-01-03',
          level: 'A2',
          category: 'Pronunciation',
          status: 'published',
          videoUrl: '/uploads/videos/pronunciation-guide.mp4'
        }
      ]);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (formData) => {
    try {
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Mock API call
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadProgress(0);
        fetchVideos();
        alert(t('videoUploadedSuccessfully'));
      }, 2500);

    } catch (error) {
      console.error('Upload error:', error);
      alert(t('uploadFailed'));
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm(t('confirmDeleteVideo'))) {
      try {
        // await axios.delete(`/api/videos/${videoId}`);
        setVideos(videos.filter(v => v._id !== videoId));
        alert(t('videoDeletedSuccessfully'));
      } catch (error) {
        console.error('Delete error:', error);
        alert(t('failedToDeleteVideo'));
      }
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      'A1': 'bg-green-100 text-green-800',
      'A2': 'bg-blue-100 text-blue-800',
      'B1': 'bg-yellow-100 text-yellow-800',
      'B2': 'bg-orange-100 text-orange-800',
      'C1': 'bg-red-100 text-red-800',
      'C2': 'bg-purple-100 text-purple-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            {t('videoLessonsTitle')}
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            {t('manageVideoContent')}
          </p>
        </div>
        
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cambridge-600 text-white rounded-lg hover:bg-cambridge-700 transition-colors"
        >
          <CloudArrowUpIcon className="w-4 h-4" />
          {t('uploadVideo')}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                {t('totalVideos')}
              </p>
              <p className="text-2xl font-bold text-cambridge-600">
                {videos.length}
              </p>
            </div>
            <VideoCameraIcon className="w-8 h-8 text-cambridge-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                {t('totalViews')}
              </p>
              <p className="text-2xl font-bold text-green-600">
                {videos.reduce((sum, video) => sum + video.views, 0)}
              </p>
            </div>
            <EyeIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                {t('published')}
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {videos.filter(v => v.status === 'published').length}
              </p>
            </div>
            <PlayIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                {t('drafts')}
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {videos.filter(v => v.status === 'draft').length}
              </p>
            </div>
            <DocumentTextIcon className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div key={video._id} className="card overflow-hidden hover:shadow-lg transition-shadow">
            {/* Video Thumbnail */}
            <div className="relative aspect-video bg-secondary-100 dark:bg-secondary-800 rounded-lg overflow-hidden mb-4">
              <img
                src={`https://via.placeholder.com/320x180/0284c7/ffffff?text=${encodeURIComponent(video.title.substring(0, 20))}`}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setSelectedVideo(video)}
                  className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
                >
                  <PlayIcon className="w-6 h-6 text-cambridge-600 ml-1" />
                </button>
              </div>
              
              {/* Duration Badge */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
              
              {/* Status Badge */}
              <div className={`absolute top-2 left-2 px-2 py-1 text-xs rounded-full ${
                video.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {video.status === 'published' ? t('published') : t('draft')}
              </div>
            </div>

            {/* Video Info */}
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-secondary-900 dark:text-white line-clamp-2 mb-1">
                  {video.title}
                </h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2">
                  {video.description}
                </p>
              </div>

              {/* Level and Category */}
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getLevelColor(video.level)}`}>
                  {video.level}
                </span>
                <span className="px-2 py-1 text-xs bg-secondary-100 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-300 rounded-full">
                  {video.category}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-secondary-500 dark:text-secondary-400">
                <div className="flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" />
                  <span>{video.views} {t('views')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-secondary-200 dark:border-secondary-700">
                <button
                  onClick={() => setSelectedVideo(video)}
                  className="flex items-center gap-1 text-cambridge-600 hover:text-cambridge-700 text-sm font-medium"
                >
                  <PlayIcon className="w-4 h-4" />
                  {t('watch')}
                </button>
                <div className="flex gap-2">
                  <button
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    title={t('edit')}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(video._id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                    title={t('delete')}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              {t('uploadNewVideo')}
            </h3>
            
            {uploadProgress > 0 ? (
              <div className="space-y-4">
                <div className="text-center">
                  <VideoCameraIcon className="w-12 h-12 text-cambridge-500 mx-auto mb-2" />
                  <p className="text-secondary-600 dark:text-secondary-400">
                    {t('uploadingVideo')}
                  </p>
                </div>
                <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                  <div
                    className="bg-cambridge-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-center text-sm text-secondary-500">
                  {uploadProgress}% complete
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleVideoUpload(new FormData(e.target));
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    {t('videoTitle')}
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                    placeholder={t('videoTitle')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    {t('description')}
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                    placeholder={t('description')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      {t('level')}
                    </label>
                    <select
                      name="level"
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                    >
                      <option value="A1">A1 - {t('beginner')}</option>
                      <option value="A2">A2 - {t('elementary')}</option>
                      <option value="B1">B1 - {t('intermediate')}</option>
                      <option value="B2">B2 - {t('upperIntermediate')}</option>
                      <option value="C1">C1 - {t('advanced')}</option>
                      <option value="C2">C2 - {t('proficiency')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      {t('category')}
                    </label>
                    <select
                      name="category"
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                    >
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

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    {t('videoFile')}
                  </label>
                  <input
                    type="file"
                    name="video"
                    accept="video/*"
                    required
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-cambridge-600 text-white py-2 rounded-lg hover:bg-cambridge-700 transition-colors"
                  >
                    {t('uploadVideo')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 bg-secondary-300 text-secondary-700 py-2 rounded-lg hover:bg-secondary-400 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-800 rounded-lg overflow-hidden w-full max-w-4xl">
            <div className="aspect-video bg-black">
              <video
                controls
                className="w-full h-full"
                poster={`https://via.placeholder.com/800x450/0284c7/ffffff?text=${encodeURIComponent(selectedVideo.title)}`}
              >
                <source src={selectedVideo.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                    {selectedVideo.title}
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400">
                    {selectedVideo.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-secondary-500 hover:text-secondary-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-secondary-500 dark:text-secondary-400">
                <div className="flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" />
                  <span>{selectedVideo.views} {t('views')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{selectedVideo.duration}</span>
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

export default TeacherVideos;