import { Routes, Route } from 'react-router-dom';
import { 
  HomeIcon,
  UserGroupIcon,
  BookOpenIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  TrophyIcon,
  UserIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import Layout from '../../components/Layout';
import TeacherHome from './TeacherHome';
import TeacherGroups from './TeacherGroups';
import TeacherHomework from './TeacherHomework';
import TeacherStudents from './TeacherStudents';
import TeacherMessages from './TeacherMessages';
import TeacherCompetitions from './TeacherCompetitions';
import TeacherProfile from './TeacherProfile';
import TeacherVideos from './TeacherVideos';

const TeacherDashboard = () => {
  const { t } = useLanguage();
  
  const sidebarItems = [
    { path: '/teacher', label: t('home'), icon: HomeIcon },
    { path: '/teacher/videos', label: t('videoLessons'), icon: VideoCameraIcon },
    { path: '/teacher/groups', label: t('groups'), icon: UserGroupIcon },
    { path: '/teacher/students', label: t('students'), icon: UserIcon },
    { path: '/teacher/homework', label: t('assignments'), icon: BookOpenIcon },
    { path: '/teacher/competitions', label: t('competitions'), icon: TrophyIcon },
    { path: '/teacher/messages', label: t('messages'), icon: ChatBubbleLeftRightIcon },
    { path: '/teacher/profile', label: t('profile'), icon: ChartBarIcon },
  ];

  return (
    <Layout sidebarItems={sidebarItems}>
      <Routes>
        <Route path="/" element={<TeacherHome />} />
        <Route path="/videos" element={<TeacherVideos />} />
        <Route path="/groups" element={<TeacherGroups />} />
        <Route path="/students" element={<TeacherStudents />} />
        <Route path="/homework" element={<TeacherHomework />} />
        <Route path="/competitions" element={<TeacherCompetitions />} />
        <Route path="/messages" element={<TeacherMessages />} />
        <Route path="/profile" element={<TeacherProfile />} />
      </Routes>
    </Layout>
  );
};

export default TeacherDashboard;