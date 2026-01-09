import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  HomeIcon,
  ChartBarIcon,
  BookOpenIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import Layout from '../../components/Layout';
import ParentHome from './ParentHome';
import ParentProgress from './ParentProgress';
import ParentHomework from './ParentHomework';
import ParentAttendance from './ParentAttendance';
import ParentMessages from './ParentMessages';
import ParentProfile from './ParentProfile';

const ParentDashboard = () => {
  const { t } = useLanguage();
  
  const sidebarItems = [
    { path: '/parent', label: t('home'), icon: HomeIcon },
    { path: '/parent/progress', label: t('progress'), icon: ChartBarIcon },
    { path: '/parent/homework', label: t('homework'), icon: BookOpenIcon },
    { path: '/parent/attendance', label: t('attendance'), icon: ClockIcon },
    { path: '/parent/messages', label: t('messages'), icon: ChatBubbleLeftRightIcon },
    { path: '/parent/profile', label: t('profile'), icon: UserIcon },
  ];

  return (
    <Layout sidebarItems={sidebarItems}>
      <Routes>
        <Route path="/" element={<ParentHome />} />
        <Route path="/progress" element={<ParentProgress />} />
        <Route path="/homework" element={<ParentHomework />} />
        <Route path="/attendance" element={<ParentAttendance />} />
        <Route path="/messages" element={<ParentMessages />} />
        <Route path="/profile" element={<ParentProfile />} />
      </Routes>
    </Layout>
  );
};

export default ParentDashboard;