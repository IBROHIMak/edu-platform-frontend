import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserIcon,
  UserGroupIcon,
  BookOpenIcon,
  EyeIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminTeachers = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherGroups, setTeacherGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupStudents, setGroupStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentParents, setStudentParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('teachers'); // teachers, groups, students, parents
  const [messageModal, setMessageModal] = useState(false);
  const [messageData, setMessageData] = useState({ parentId: '', subject: '', content: '' });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/api/admin/teachers');
      if (response.data.success) {
        setTeachers(response.data.data.teachers);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherGroups = async (teacherId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/teachers/${teacherId}/groups`);
      if (response.data.success) {
        setSelectedTeacher(response.data.data.teacher);
        setTeacherGroups(response.data.data.groups);
        setView('groups');
      }
    } catch (error) {
      console.error('Error fetching teacher groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupStudents = async (groupId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/groups/${groupId}/students`);
      if (response.data.success) {
        setSelectedGroup(response.data.data.group);
        setGroupStudents(response.data.data.group.students);
        setView('students');
      }
    } catch (error) {
      console.error('Error fetching group students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentParents = async (studentId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/students/${studentId}/parents`);
      if (response.data.success) {
        setSelectedStudent(response.data.data.student);
        setStudentParents(response.data.data.parents);
        setView('parents');
      }
    } catch (error) {
      console.error('Error fetching student parents:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessageToParent = async () => {
    try {
      const response = await axios.post('/api/admin/message-parent', messageData);
      if (response.data.success) {
        alert('Xabar muvaffaqiyatli yuborildi!');
        setMessageModal(false);
        setMessageData({ parentId: '', subject: '', content: '' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Xabar yuborishda xatolik yuz berdi');
    }
  };

  const sendMessageToTeacher = (teacher) => {
    // Xabarlar sahifasiga o'tish va o'qituvchini tanlash
    navigate('/admin/messages', { 
      state: { 
        selectedContact: teacher._id,
        contactName: `${teacher.firstName} ${teacher.lastName}`,
        contactType: 'teacher',
        teacherId: teacher.teacherId,
        subject: teacher.subject
      }
    });
  };

  const openMessageModal = (parent) => {
    setMessageData({
      parentId: parent._id,
      subject: `${selectedStudent.firstName} ${selectedStudent.lastName} haqida`,
      content: ''
    });
    setMessageModal(true);
  };

  const goBack = () => {
    if (view === 'parents') {
      setView('students');
      setSelectedStudent(null);
      setStudentParents([]);
    } else if (view === 'students') {
      setView('groups');
      setSelectedGroup(null);
      setGroupStudents([]);
    } else if (view === 'groups') {
      setView('teachers');
      setSelectedTeacher(null);
      setTeacherGroups([]);
    }
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {view !== 'teachers' && (
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-4 py-2 bg-secondary-100 dark:bg-secondary-800 rounded-lg hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Orqaga
            </button>
          )}
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            {view === 'teachers' && t('teachers')}
            {view === 'groups' && `${selectedTeacher?.firstName} ${selectedTeacher?.lastName} - ${t('groups')}`}
            {view === 'students' && `${selectedGroup?.name} - ${t('students')}`}
            {view === 'parents' && `${selectedStudent?.firstName} ${selectedStudent?.lastName} - ${t('parents')}`}
          </h1>
        </div>
      </div>

      {/* Teachers View */}
      {view === 'teachers' && (
        <div className="grid grid-cols-1 md:grid-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <div key={teacher._id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 dark:text-white">
                      {teacher.firstName} {teacher.lastName}
                    </h3>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      {teacher.subject}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div>
                  <p className="text-lg font-bold text-blue-600">{teacher.stats.totalGroups}</p>
                  <p className="text-xs text-secondary-500">{t('groups')}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-purple-600">{teacher.stats.totalStudents}</p>
                  <p className="text-xs text-secondary-500">{t('students')}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-orange-600">{teacher.stats.totalHomework}</p>
                  <p className="text-xs text-secondary-500">Vazifalar</p>
                </div>
              </div>
              
              <div className="mb-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary-500">ID: {teacher.teacherId}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    teacher.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {teacher.isActive ? 'Faol' : 'Nofaol'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => fetchTeacherGroups(teacher._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <EyeIcon className="w-4 h-4" />
                  Ko'rish
                </button>
                <button
                  onClick={() => sendMessageToTeacher(teacher)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  Habar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Groups View */}
      {view === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teacherGroups.map((group) => (
            <button
              key={group._id}
              className="card cursor-pointer hover:shadow-lg transition-shadow text-left"
              onClick={() => fetchGroupStudents(group._id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <UserGroupIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 dark:text-white">
                      {group.name}
                    </h3>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      {group.subject} - {group.level}
                    </p>
                  </div>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-secondary-400" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserGroupIcon className="w-4 h-4 text-secondary-500" />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    {group.students?.length || 0} o'quvchi
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-secondary-500">Jadval</p>
                  <p className="text-sm font-medium text-secondary-900 dark:text-white">
                    {group.schedule?.length || 0} dars/hafta
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Students View */}
      {view === 'students' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupStudents.map((student) => (
            <button
              key={student._id}
              className="card cursor-pointer hover:shadow-lg transition-shadow text-left"
              onClick={() => fetchStudentParents(student._id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">
                      {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </span>
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
                <ChevronRightIcon className="w-5 h-5 text-secondary-400" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">{t('points')}:</span>
                  <span className="font-semibold text-orange-600">{student.points || 0}</span>
                </div>
                {student.rating && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">{t('averageGrade')}:</span>
                      <span className="font-semibold text-blue-600">{student.rating.averageGrade || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">{t('attendance')}:</span>
                      <span className="font-semibold text-green-600">{student.rating.attendance || 0}%</span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">Ota-onalar:</span>
                  <span className="font-semibold text-purple-600">{student.parents?.length || 0}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Parents View */}
      {view === 'parents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studentParents.map((parent) => (
            <div key={parent._id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 dark:text-white">
                      {parent.firstName} {parent.lastName}
                    </h3>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 capitalize">
                      {parent.parentType === 'father' ? 'Ota' : 'Ona'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {parent.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">{t('phone')}:</span>
                    <span className="font-medium text-secondary-900 dark:text-white">{parent.phone}</span>
                  </div>
                )}
                {parent.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">{t('email')}:</span>
                    <span className="font-medium text-secondary-900 dark:text-white">{parent.email}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">{t('childName')}:</span>
                  <span className="font-medium text-secondary-900 dark:text-white">{parent.childName}</span>
                </div>
              </div>
              
              <button
                onClick={() => openMessageModal(parent)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Xabar yuborish
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Message Modal */}
      {messageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Ota-onaga xabar yuborish
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Mavzu
                </label>
                <input
                  type="text"
                  value={messageData.subject}
                  onChange={(e) => setMessageData({...messageData, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Xabar matni
                </label>
                <textarea
                  rows={4}
                  value={messageData.content}
                  onChange={(e) => setMessageData({...messageData, content: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                  placeholder="Xabar matnini kiriting..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setMessageModal(false)}
                className="flex-1 bg-secondary-200 dark:bg-secondary-700 text-secondary-900 dark:text-white py-2 px-4 rounded-lg hover:bg-secondary-300 dark:hover:bg-secondary-600 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={sendMessageToParent}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Yuborish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeachers;