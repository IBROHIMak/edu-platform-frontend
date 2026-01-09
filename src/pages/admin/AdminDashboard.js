import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  HomeIcon,
  UserIcon,
  AcademicCapIcon,
  UserGroupIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  DocumentChartBarIcon,
  BookOpenIcon,
  GiftIcon,
  UserPlusIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import Layout from '../../components/Layout';
import AdminHome from './AdminHome';
import AdminTeachers from './AdminTeachers';
import AdminStudents from './AdminStudents';
import AdminParents from './AdminParents';
import AdminUsers from './AdminUsers';
import AdminAnalytics from './AdminAnalytics';
import AdminSettings from './AdminSettings';
import AdminReports from './AdminReports';
import AdminUserManagement from './AdminUserManagement';
import AdminEducation from './AdminEducation';
import AdminRewards from './AdminRewards';
import AdminMessages from './AdminMessages';

const AdminDashboard = () => {
  const { t } = useLanguage();
  
  const sidebarItems = [
    { path: '/admin', label: t('home'), icon: HomeIcon },
    { path: '/admin/messages', label: 'Xabarlar', icon: ChatBubbleLeftRightIcon },
    { path: '/admin/reports', label: t('reports'), icon: DocumentChartBarIcon },
    { path: '/admin/user-management', label: t('userManagement'), icon: UserPlusIcon },
    { path: '/admin/education', label: t('education'), icon: BookOpenIcon },
    { path: '/admin/rewards', label: t('bonusRewards'), icon: GiftIcon },
    { path: '/admin/teachers', label: t('teachers'), icon: UserIcon },
    { path: '/admin/students', label: t('students'), icon: AcademicCapIcon },
    { path: '/admin/parents', label: t('parents'), icon: UserGroupIcon },
    { path: '/admin/users', label: t('users'), icon: UsersIcon },
    { path: '/admin/analytics', label: t('analytics'), icon: ChartBarIcon },
    { path: '/admin/settings', label: t('settings'), icon: CogIcon },
  ];
  
  return (
    <Layout sidebarItems={sidebarItems}>
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/messages" element={<AdminMessages />} />
        <Route path="/reports" element={<AdminReports />} />
        <Route path="/user-management" element={<AdminUserManagement />} />
        <Route path="/education" element={<AdminEducation />} />
        <Route path="/rewards" element={<AdminRewards />} />
        <Route path="/teachers" element={<AdminTeachers />} />
        <Route path="/students" element={<AdminStudents />} />
        <Route path="/parents" element={<AdminParents />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/analytics" element={<AdminAnalytics />} />
        <Route path="/settings" element={<AdminSettings />} />
      </Routes>
    </Layout>
  );
};

export default AdminDashboard;