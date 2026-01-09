import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AcademicCapIcon,
  UserGroupIcon,
  StarIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminStudents = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/admin/users?role=student');
      if (response.data.success) {
        setStudents(response.data.data.users);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessageToStudent = (student) => {
    // Xabarlar sahifasiga o'tish va o'quvchini tanlash
    navigate('/admin/messages', { 
      state: { 
        selectedContact: student._id,
        contactName: `${student.firstName} ${student.lastName}`,
        contactType: 'student',
        studentId: student.studentId,
        groupName: student.group?.name
      }
    });
  };

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t('students')} ({students.length})
        </h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder={t('searchStudent')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
          />
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div key={student._id} className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 dark:text-white">
                  {student.firstName} {student.lastName}
                </h3>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  ID: {student.studentId}
                </p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600 dark:text-secondary-400">{t('group')}:</span>
                <span className="font-medium text-secondary-900 dark:text-white">
                  {student.group?.name || t('notAssigned')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600 dark:text-secondary-400">Ballar:</span>
                <span className="font-semibold text-orange-600">{student.points || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600 dark:text-secondary-400">Yutuqlar:</span>
                <span className="font-medium text-purple-600">{student.achievements?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600 dark:text-secondary-400">Holat:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  student.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {student.isActive ? 'Faol' : 'Nofaol'}
                </span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-secondary-200 dark:border-secondary-700">
              <button
                onClick={() => sendMessageToStudent(student)}
                className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                Habar jonatish
              </button>
              <p className="text-xs text-secondary-500">
                {t('registeredOn')}: {new Date(student.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <AcademicCapIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <p className="text-secondary-500 dark:text-secondary-400">
            {searchTerm ? 'Qidiruv bo\'yicha natija topilmadi' : 'Hozircha o\'quvchilar yo\'q'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;