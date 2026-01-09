import { Routes, Route } from 'react-router-dom';
import { 
  HomeIcon,
  BookOpenIcon,
  GiftIcon,
  TrophyIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ChartBarIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import Layout from '../../components/Layout';
import StudentHome from './StudentHome';
import StudentHomework from './StudentHomework';
import StudentRewards from './StudentRewards';
import StudentCompetitions from './StudentCompetitions';
import StudentMessages from './StudentMessages';
import StudentProfile from './StudentProfile';
import StudentRating from './StudentRating';
import StudentBonusTasks from './StudentBonusTasks';

const StudentDashboard = () => {
  const { t } = useLanguage();
  
  const sidebarItems = [
    { path: '/student', label: t('home'), icon: HomeIcon },
    { path: '/student/homework', label: t('assignments'), icon: BookOpenIcon },
    { path: '/student/bonus-tasks', label: t('bonusTasks'), icon: StarIcon },
    { path: '/student/rewards', label: t('rewards'), icon: GiftIcon },
    { path: '/student/competitions', label: t('competitions'), icon: TrophyIcon },
    { path: '/student/messages', label: t('messages'), icon: ChatBubbleLeftRightIcon },
    { path: '/student/rating', label: t('progress'), icon: ChartBarIcon },
    { path: '/student/profile', label: t('profile'), icon: UserGroupIcon },
  ];

  return (
    <Layout sidebarItems={sidebarItems}>
      <Routes>
        <Route path="/" element={<StudentHome />} />
        <Route path="/homework" element={<StudentHomework />} />
        <Route path="/bonus-tasks" element={<StudentBonusTasks />} />
        <Route path="/rewards" element={<StudentRewards />} />
        <Route path="/competitions" element={<StudentCompetitions />} />
        <Route path="/messages" element={<StudentMessages />} />
        <Route path="/rating" element={<StudentRating />} />
        <Route path="/profile" element={<StudentProfile />} />
      </Routes>
    </Layout>
  );
};

export default StudentDashboard;