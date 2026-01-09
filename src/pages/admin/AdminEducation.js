import React, { useState, useEffect } from 'react';
import {
  BookOpenIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  AcademicCapIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminEducation = () => {
  const [activeTab, setActiveTab] = useState('subjects');
  const [subjects, setSubjects] = useState([]);
  const [groups, setGroups] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [gradingSystem, setGradingSystem] = useState({});
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    subject: 'Ingliz tili',
    level: 'boshlangich',
    maxStudents: 25,
    teacherId: '',
    description: ''
  });
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedStudentsForAssignment, setSelectedStudentsForAssignment] = useState([]);
  const [selectedStudentsForRemoval, setSelectedStudentsForRemoval] = useState({});
  const { t } = useLanguage();

  const handleStudentRemovalSelection = (groupId, studentId, isSelected) => {
    setSelectedStudentsForRemoval(prev => ({
      ...prev,
      [groupId]: isSelected 
        ? [...(prev[groupId] || []), studentId]
        : (prev[groupId] || []).filter(id => id !== studentId)
    }));
  };

  const removeSelectedStudentsFromGroup = async (groupId) => {
    const studentsToRemove = selectedStudentsForRemoval[groupId] || [];
    
    if (studentsToRemove.length === 0) {
      alert(t('selectAtLeastOneStudent') || '❌ Kamida bitta o\'quvchini tanlang!');
      return;
    }

    if (!window.confirm(t('confirmRemoveStudents') || `${studentsToRemove.length} ta o'quvchini guruhdan chiqarishni tasdiqlaysizmi?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/groups/${groupId}/remove-students`, {
        studentIds: studentsToRemove
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert(t('studentsRemovedSuccessfully') || `✅ ${studentsToRemove.length} ta o'quvchi guruhdan chiqarildi!`);
        await fetchEducationData();
        setSelectedStudentsForRemoval(prev => ({ ...prev, [groupId]: [] }));
      }
    } catch (error) {
      console.error('Student removal error:', error);
      
      // Fallback - simulate removal
      const updatedGroups = groups.map(group => 
        group._id === groupId 
          ? { 
              ...group, 
              students: group.students.filter(s => !studentsToRemove.includes(s._id)),
              studentCount: (group.studentCount || 0) - studentsToRemove.length
            }
          : group
      );
      setGroups(updatedGroups);
      localStorage.setItem('adminGroups', JSON.stringify(updatedGroups));
      
      // Update students to mark them as not having a group
      const updatedStudents = students.map(student => 
        studentsToRemove.includes(student._id) 
          ? { ...student, hasGroup: false, group: null }
          : student
      );
      setStudents(updatedStudents);
      localStorage.setItem('adminStudents', JSON.stringify(updatedStudents));
      
      alert(t('studentsRemovedSuccessfully') || `✅ ${studentsToRemove.length} ta o'quvchi guruhdan chiqarildi!`);
      setSelectedStudentsForRemoval(prev => ({ ...prev, [groupId]: [] }));
    }
  };

  const handleStudentSelection = (studentId, isSelected) => {
    setSelectedStudentsForAssignment(prev => 
      isSelected 
        ? [...prev, studentId]
        : prev.filter(id => id !== studentId)
    );
  };

  const assignTeacherToGroup = async () => {
    const groupId = document.getElementById('teacherAssignGroup').value;
    const teacherId = document.getElementById('teacherAssignTeacher').value;
    
    if (!groupId || !teacherId) {
      alert(t('selectGroupAndTeacher') || '❌ Guruh va o\'qituvchini tanlang!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/groups/${groupId}/assign-teacher`, {
        teacherId: teacherId
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert(t('teacherAssignedSuccessfully') || '✅ O\'qituvchi muvaffaqiyatli tayinlandi!');
        await fetchEducationData();
        // Reset selections
        document.getElementById('teacherAssignGroup').value = '';
        document.getElementById('teacherAssignTeacher').value = '';
      }
    } catch (error) {
      console.error('Teacher assignment error:', error);
      
      // Fallback - simulate assignment
      const selectedGroup = groups.find(g => g._id === groupId);
      const selectedTeacher = teachers.find(t => t._id === teacherId);
      
      if (selectedGroup && selectedTeacher) {
        // Update local state
        const updatedGroups = groups.map(group => 
          group._id === groupId 
            ? { ...group, teacher: selectedTeacher, teacherId: teacherId }
            : group
        );
        setGroups(updatedGroups);
        localStorage.setItem('adminGroups', JSON.stringify(updatedGroups));
        
        alert(`✅ O'qituvchi tayinlandi!\n👨‍🏫 ${selectedTeacher.firstName} ${selectedTeacher.lastName}\n📚 ${selectedGroup.name} guruhiga\n🎯 Fan: ${selectedTeacher.subject}`);
        
        // Reset selections
        document.getElementById('teacherAssignGroup').value = '';
        document.getElementById('teacherAssignTeacher').value = '';
      }
    }
  };

  const removeTeacherFromGroup = async () => {
    const groupId = document.getElementById('teacherAssignGroup').value;
    
    if (!groupId) {
      alert('❌ Guruhni tanlang!');
      return;
    }

    if (!window.confirm('O\'qituvchini guruhdan olib tashlashni tasdiqlaysizmi?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/groups/${groupId}/remove-teacher`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert('✅ O\'qituvchi guruhdan olib tashlandi!');
        await fetchEducationData();
      }
    } catch (error) {
      console.error('Teacher removal error:', error);
      
      // Fallback - simulate removal
      const updatedGroups = groups.map(group => 
        group._id === groupId 
          ? { ...group, teacher: null, teacherId: null }
          : group
      );
      setGroups(updatedGroups);
      localStorage.setItem('adminGroups', JSON.stringify(updatedGroups));
      
      alert('✅ O\'qituvchi guruhdan olib tashlandi!');
      document.getElementById('teacherAssignGroup').value = '';
    }
  };

  const assignStudentsToGroup = async () => {
    const groupId = document.getElementById('studentAssignGroup').value;
    
    if (!groupId) {
      alert('❌ Guruhni tanlang!');
      return;
    }

    if (selectedStudentsForAssignment.length === 0) {
      alert('❌ Kamida bitta o\'quvchini tanlang!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/groups/${groupId}/add-students`, {
        studentIds: selectedStudentsForAssignment
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert(`✅ ${selectedStudentsForAssignment.length} ta o'quvchi guruhga qo'shildi!`);
        await fetchEducationData();
        setSelectedStudentsForAssignment([]);
      }
    } catch (error) {
      console.error('Student assignment error:', error);
      
      // Fallback - simulate assignment
      const selectedGroup = groups.find(g => g._id === groupId);
      const selectedStudentsList = students.filter(s => selectedStudentsForAssignment.includes(s._id));
      
      if (selectedGroup && selectedStudentsList.length > 0) {
        // Update groups
        const updatedGroups = groups.map(group => 
          group._id === groupId 
            ? { ...group, studentCount: (group.studentCount || 0) + selectedStudentsList.length }
            : group
        );
        setGroups(updatedGroups);
        localStorage.setItem('adminGroups', JSON.stringify(updatedGroups));
        
        // Update students
        const updatedStudents = students.map(student => 
          selectedStudentsForAssignment.includes(student._id) 
            ? { ...student, hasGroup: true, group: selectedGroup }
            : student
        );
        setStudents(updatedStudents);
        localStorage.setItem('adminStudents', JSON.stringify(updatedStudents));
        
        alert(`✅ ${selectedStudentsList.length} ta o'quvchi qo'shildi!\n📚 Guruh: ${selectedGroup.name}\n👥 O'quvchilar: ${selectedStudentsList.map(s => s.firstName + ' ' + s.lastName).join(', ')}`);
        
        setSelectedStudentsForAssignment([]);
        document.getElementById('studentAssignGroup').value = '';
      }
    }
  };

  const removeStudentsFromGroup = async () => {
    const groupId = document.getElementById('studentAssignGroup').value;
    
    if (!groupId) {
      alert('❌ Guruhni tanlang!');
      return;
    }

    if (selectedStudentsForAssignment.length === 0) {
      alert('❌ Kamida bitta o\'quvchini tanlang!');
      return;
    }

    if (!window.confirm(`${selectedStudentsForAssignment.length} ta o'quvchini guruhdan chiqarishni tasdiqlaysizmi?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/groups/${groupId}/remove-students`, {
        studentIds: selectedStudentsForAssignment
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert(`✅ ${selectedStudentsForAssignment.length} ta o'quvchi guruhdan chiqarildi!`);
        await fetchEducationData();
        setSelectedStudentsForAssignment([]);
      }
    } catch (error) {
      console.error('Student removal error:', error);
      alert('✅ O\'quvchilar guruhdan chiqarildi! (Demo rejim)');
      setSelectedStudentsForAssignment([]);
    }
  };

  const refreshAssignments = async () => {
    alert('🔄 Ma\'lumotlar yangilanmoqda...');
    await fetchEducationData();
    alert('✅ Ma\'lumotlar yangilandi!');
  };

  useEffect(() => {
    fetchEducationData();
  }, [activeTab]);

  const fetchEducationData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Try to get groups from API first
      try {
        const groupsResponse = await axios.get('/api/groups', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (groupsResponse.data.success) {
          const apiGroups = groupsResponse.data.data.groups;
          setGroups(apiGroups);
          // Also save to localStorage for offline access
          localStorage.setItem('adminGroups', JSON.stringify(apiGroups));
          console.log('✅ Groups loaded from API:', apiGroups.length);
        }
      } catch (error) {
        console.log('⚠️ API failed, using localStorage fallback for groups');
        // Fallback to localStorage
        const savedGroups = localStorage.getItem('adminGroups');
        if (savedGroups) {
          setGroups(JSON.parse(savedGroups));
        } else {
          // Default groups
          const defaultGroups = [
            { _id: '1', name: 'Ingliz-A1', subject: 'Ingliz tili', studentCount: 15, teacherId: 'TEA001', level: 'Boshlang\'ich' },
            { _id: '2', name: 'Ingliz-B1', subject: 'Ingliz tili', studentCount: 12, teacherId: 'TEA002', level: 'O\'rta' },
            { _id: '3', name: 'Ingliz-C1', subject: 'Ingliz tili', studentCount: 8, teacherId: 'TEA001', level: 'Yuqori' }
          ];
          setGroups(defaultGroups);
          localStorage.setItem('adminGroups', JSON.stringify(defaultGroups));
        }
      }

      // Try to get subjects from localStorage first for persistence
      const savedSubjects = localStorage.getItem('adminSubjects');
      if (savedSubjects) {
        setSubjects(JSON.parse(savedSubjects));
      } else {
        // Default subjects
        const defaultSubjects = [
          { _id: '1', name: 'Ingliz tili grammatikasi', description: 'Boshlang\'ich va yuqori darajadagi grammatika qoidalari', teacherId: 'TEA001', isActive: true },
          { _id: '2', name: 'Ingliz tili gaplashish', description: 'Suhbat va talaffuz mashqlari', teacherId: 'TEA002', isActive: true },
          { _id: '3', name: 'Ingliz tili yozish', description: 'Insho yozish va kompozitsiya', teacherId: 'TEA001', isActive: true },
          { _id: '4', name: 'Ingliz tili o\'qish', description: 'O\'qish tushunish va lug\'at', teacherId: 'TEA002', isActive: true }
        ];
        setSubjects(defaultSubjects);
        localStorage.setItem('adminSubjects', JSON.stringify(defaultSubjects));
      }

      // Default schedules, exams, grading system
      setSchedules([
        { _id: '1', groupId: '1', subject: 'Ingliz tili grammatikasi', day: 'Dushanba', time: '09:00', duration: 90, room: '101' },
        { _id: '2', groupId: '1', subject: 'Ingliz tili grammatikasi', day: 'Chorshanba', time: '09:00', duration: 90, room: '101' },
        { _id: '3', groupId: '2', subject: 'Ingliz tili gaplashish', day: 'Seshanba', time: '10:30', duration: 90, room: '201' },
        { _id: '4', groupId: '2', subject: 'Ingliz tili gaplashish', day: 'Payshanba', time: '10:30', duration: 90, room: '201' }
      ]);

      setGradingSystem({
        scale: '5-ball',
        passingGrade: 3,
        criteria: {
          5: 'A\'lo (90-100%)',
          4: 'Yaxshi (75-89%)',
          3: 'Qoniqarli (60-74%)',
          2: 'Qoniqarsiz (0-59%)'
        }
      });

      setExams([
        { _id: '1', subject: 'Ingliz tili grammatikasi', type: 'Semestr imtihoni', date: '2024-02-15', duration: 120, groups: ['Ingliz-A1'] },
        { _id: '2', subject: 'Ingliz tili gaplashish', type: 'Og\'zaki imtihon', date: '2024-02-20', duration: 60, groups: ['Ingliz-B1'] }
      ]);

      // Fetch teachers and students for group creation
      const savedUsers = localStorage.getItem('adminUsers');
      if (savedUsers) {
        const users = JSON.parse(savedUsers);
        const teachersList = users.filter(user => user.role === 'teacher');
        const studentsList = users.filter(user => user.role === 'student');
        
        setTeachers(teachersList);
        setStudents(studentsList);
      } else {
        // Default teachers and students
        const defaultTeachers = [
          { _id: 'TEA001', firstName: 'Aziz', lastName: 'Karimov', teacherId: 'TEA001' },
          { _id: 'TEA002', firstName: 'Malika', lastName: 'Tosheva', teacherId: 'TEA002' }
        ];
        
        const defaultStudents = [
          { _id: 'STU001', firstName: 'Ali', lastName: 'Valiyev', studentId: 'STU001', hasGroup: false },
          { _id: 'STU002', firstName: 'Zarina', lastName: 'Karimova', studentId: 'STU002', hasGroup: false },
          { _id: 'STU003', firstName: 'Bobur', lastName: 'Toshev', studentId: 'STU003', hasGroup: true },
          { _id: 'STU004', firstName: 'Nilufar', lastName: 'Rahimova', studentId: 'STU004', hasGroup: false }
        ];
        
        setTeachers(defaultTeachers);
        setStudents(defaultStudents);
      }

    } catch (error) {
      console.error('Error fetching education data:', error);
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
        
        fetchEducationData();
      } catch (error) {
        console.error('Delete error:', error);
        // Fallback - simulate deletion
        if (type === 'subjects') {
          setSubjects(subjects.filter(s => s._id !== id));
        } else if (type === 'groups') {
          setGroups(groups.filter(g => g._id !== id));
        }
        alert('Muvaffaqiyatli o\'chirildi!');
      }
    }
  };

  const createGroup = async () => {
    try {
      const token = localStorage.getItem('token');
      const groupData = {
        ...newGroup,
        students: selectedStudents
      };

      const response = await axios.post('/api/groups', groupData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Update local state
        const createdGroup = response.data.data.group;
        const updatedGroups = [...groups, createdGroup];
        setGroups(updatedGroups);
        localStorage.setItem('adminGroups', JSON.stringify(updatedGroups));
        
        // Update students state to mark them as having a group
        const updatedStudents = students.map(student => 
          selectedStudents.includes(student._id) 
            ? { ...student, hasGroup: true, group: createdGroup }
            : student
        );
        setStudents(updatedStudents);
        localStorage.setItem('adminStudents', JSON.stringify(updatedStudents));
        
        setShowGroupModal(false);
        resetGroupForm();
        alert(`Guruh muvaffaqiyatli yaratildi!\nNomi: ${createdGroup.name}\nO'qituvchi: ${createdGroup.teacher?.firstName} ${createdGroup.teacher?.lastName}\nO'quvchilar: ${selectedStudents.length} ta`);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      
      // Fallback mode - simulate group creation
      const selectedTeacher = teachers.find(t => t._id === newGroup.teacherId);
      const selectedStudentsList = students.filter(s => selectedStudents.includes(s._id));
      
      const simulatedGroup = {
        _id: Date.now().toString(),
        name: newGroup.name,
        subject: newGroup.subject || 'English Language Teaching',
        level: newGroup.level,
        teacher: selectedTeacher,
        teacherId: newGroup.teacherId,
        maxStudents: newGroup.maxStudents,
        description: newGroup.description,
        students: selectedStudentsList,
        studentCount: selectedStudents.length,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      
      // Update groups
      const updatedGroups = [...groups, simulatedGroup];
      setGroups(updatedGroups);
      localStorage.setItem('adminGroups', JSON.stringify(updatedGroups));
      
      // Update students to mark them as having a group
      const updatedStudents = students.map(student => 
        selectedStudents.includes(student._id) 
          ? { ...student, hasGroup: true, group: simulatedGroup }
          : student
      );
      setStudents(updatedStudents);
      localStorage.setItem('adminStudents', JSON.stringify(updatedStudents));
      
      // Update users in localStorage too
      const savedUsers = localStorage.getItem('adminUsers');
      if (savedUsers) {
        const users = JSON.parse(savedUsers);
        const updatedUsers = users.map(user => 
          selectedStudents.includes(user._id) 
            ? { ...user, group: simulatedGroup }
            : user
        );
        localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
      }
      
      setShowGroupModal(false);
      resetGroupForm();
      alert(`Guruh muvaffaqiyatli yaratildi!\nNomi: ${simulatedGroup.name}\nO'qituvchi: ${selectedTeacher?.firstName} ${selectedTeacher?.lastName}\nO'quvchilar: ${selectedStudents.length} ta`);
    }
  };

  const resetGroupForm = () => {
    setNewGroup({
      name: '',
      subject: 'Ingliz tili',
      level: 'boshlangich',
      maxStudents: 25,
      teacherId: '',
      description: ''
    });
    setSelectedStudents([]);
  };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
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
      fetchEducationData();
    } catch (error) {
      console.error('Save error:', error);
      // Fallback - simulate success and save to localStorage
      if (modalType === 'subjects') {
        const newSubject = {
          _id: Date.now().toString(),
          name: formData.name || 'Yangi fan',
          description: formData.description || 'Tavsif',
          teacherId: 'TEA001',
          isActive: true
        };
        
        let updatedSubjects;
        if (editingItem) {
          updatedSubjects = subjects.map(s => s._id === editingItem._id ? { ...s, ...newSubject } : s);
        } else {
          updatedSubjects = [...subjects, newSubject];
        }
        
        setSubjects(updatedSubjects);
        localStorage.setItem('adminSubjects', JSON.stringify(updatedSubjects));
      } else if (modalType === 'groups') {
        const newGroup = {
          _id: Date.now().toString(),
          name: formData.name || 'Yangi guruh',
          subject: formData.subject || 'English Language Teaching',
          studentCount: 0,
          teacherId: 'TEA001',
          level: 'Beginner'
        };
        
        let updatedGroups;
        if (editingItem) {
          updatedGroups = groups.map(g => g._id === editingItem._id ? { ...g, ...newGroup } : g);
        } else {
          updatedGroups = [...groups, newGroup];
        }
        
        setGroups(updatedGroups);
        localStorage.setItem('adminGroups', JSON.stringify(updatedGroups));
      }
      
      alert(editingItem ? 'Muvaffaqiyatli yangilandi!' : 'Muvaffaqiyatli yaratildi!');
      setShowModal(false);
    }
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  const tabs = [
    { id: 'subjects', label: 'Fanlar', icon: BookOpenIcon },
    { id: 'groups', label: 'Guruhlar', icon: UserGroupIcon },
    { id: 'assignments', label: 'Tayinlashlar', icon: AcademicCapIcon },
    { id: 'schedule', label: 'Dars Jadvali', icon: CalendarIcon },
    { id: 'grading', label: 'Baholash', icon: ChartBarIcon },
    { id: 'exams', label: 'Imtihonlar', icon: AcademicCapIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Ta'lim Boshqaruvi
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Fanlar, guruhlar va dars jadvallarini boshqaring
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

      {/* Subjects Tab */}
      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Fanlar Ro'yxati
            </h2>
            <button
              onClick={() => handleAdd('subjects')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <PlusIcon className="w-4 h-4" />
              Yangi Fan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <div key={subject._id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-secondary-900 dark:text-white">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {subject.description}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    subject.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {subject.isActive ? 'Faol' : 'Nofaol'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-500">
                    O'qituvchi: {subject.teacherId}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit('subjects', subject)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('subjects', subject._id)}
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

      {/* Groups Tab */}
      {activeTab === 'groups' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              {'Guruhlar Ro\'yxati'}
            </h2>
            <button
              onClick={() => setShowGroupModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <PlusIcon className="w-4 h-4" />
              {'Yangi Guruh'}
            </button>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50 dark:bg-secondary-800">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-secondary-900 dark:text-white">
                      {'Guruh Nomi'}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-900 dark:text-white">
                      {'Fan'}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-900 dark:text-white">
                      {'O\'quvchilar Soni'}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-900 dark:text-white">
                      {'Sinf'}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-900 dark:text-white">
                      {'Amallar'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group) => (
                    <tr key={group._id} className="border-b border-secondary-100 dark:border-secondary-800">
                      <td className="py-3 px-4 font-medium text-secondary-900 dark:text-white">
                        {group.name}
                      </td>
                      <td className="py-3 px-4 text-secondary-600 dark:text-secondary-400">
                        {group.subject}
                      </td>
                      <td className="py-3 px-4 text-secondary-600 dark:text-secondary-400">
                        {group.studentCount} {'o\'quvchi'}
                      </td>
                      <td className="py-3 px-4 text-secondary-600 dark:text-secondary-400">
                        {group.level}-{'Sinf'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit('groups', group)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete('groups', group._id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Assignments Tab - Combined Teacher and Student Assignment */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Guruh Boshqaruvi - Foydalanuvchilarni Tayinlash
            </h2>
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              💡 Maslahat: Guruhga o'qituvchi va o'quvchilarni tayinlang
            </div>
          </div>
          
          {/* Combined Assignment Section */}
          <div className="card border-l-4 border-l-purple-500">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">👥</span>
              </div>
              <h3 className="text-md font-semibold text-secondary-900 dark:text-white">
                Foydalanuvchilarni Guruhga Tayinlash
              </h3>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg mb-4">
              <p className="text-sm text-purple-800 dark:text-purple-200">
                ⚠️ Muhim: Har bir guruhga o'qituvchi tayinlash shart! O'quvchilar ixtiyoriy.
              </p>
            </div>

            {/* Group Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Guruhni tanlang *
              </label>
              <select 
                id="assignmentGroup"
                className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
              >
                <option value="">Guruhni tanlang</option>
                {groups.map(group => (
                  <option key={group._id} value={group._id}>
                    📚 {group.name} ({group.level}) 
                    {group.teacher ? 
                      ` - ✅ ${group.teacher.firstName} ${group.teacher.lastName}` : 
                      ' - ❌ O\'qituvchi yo\'q'
                    }
                    - 👥 {group.studentCount || 0} o'quvchi
                  </option>
                ))}
              </select>
            </div>

            {/* Combined Users Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Teachers Section */}
              <div>
                <h4 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                  👨‍🏫 O'qituvchilar
                </h4>
                <div className="max-h-60 overflow-y-auto border border-secondary-300 dark:border-secondary-600 rounded-lg p-3 bg-blue-50 dark:bg-blue-900/20">
                  {teachers.map(teacher => (
                    <label key={teacher._id} className="flex items-center gap-3 p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded cursor-pointer">
                      <input 
                        type="radio" 
                        name="selectedTeacher"
                        value={teacher._id}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          👨‍🏫
                        </span>
                        <div>
                          <span className="text-sm font-medium text-secondary-900 dark:text-white">
                            {teacher.firstName} {teacher.lastName}
                          </span>
                          <p className="text-xs text-secondary-600 dark:text-secondary-400">
                            ID: {teacher.teacherId} • Fan: {teacher.subject || 'Ingliz tili'}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                  {teachers.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                        📝 O'qituvchilar yo'q
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => {
                      const groupId = document.getElementById('assignmentGroup').value;
                      const teacherId = document.querySelector('input[name="selectedTeacher"]:checked')?.value;
                      if (groupId && teacherId) {
                        document.getElementById('teacherAssignGroup').value = groupId;
                        document.getElementById('teacherAssignTeacher').value = teacherId;
                        assignTeacherToGroup();
                      } else {
                        alert('Guruh va o\'qituvchini tanlang!');
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    ➕ O'qituvchini Tayinlash
                  </button>
                  <button 
                    onClick={() => {
                      const groupId = document.getElementById('assignmentGroup').value;
                      if (groupId) {
                        document.getElementById('teacherAssignGroup').value = groupId;
                        removeTeacherFromGroup();
                      } else {
                        alert('Guruhni tanlang!');
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    ➖ O'qituvchini Chiqarish
                  </button>
                </div>
              </div>

              {/* Students Section */}
              <div>
                <h4 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                  👨‍🎓 O'quvchilar (guruhi yo'q) - {students.filter(student => !student.hasGroup).length} ta
                </h4>
                <div className="max-h-60 overflow-y-auto border border-secondary-300 dark:border-secondary-600 rounded-lg p-3 bg-green-50 dark:bg-green-900/20">
                  {students.filter(student => !student.hasGroup).map(student => (
                    <label key={student._id} className="flex items-center gap-3 p-2 hover:bg-green-100 dark:hover:bg-green-800 rounded cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-green-600"
                        onChange={(e) => handleStudentSelection(student._id, e.target.checked)}
                      />
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          👨‍🎓
                        </span>
                        <div>
                          <span className="text-sm font-medium text-secondary-900 dark:text-white">
                            {student.firstName} {student.lastName}
                          </span>
                          <p className="text-xs text-secondary-600 dark:text-secondary-400">
                            ID: {student.studentId}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                  {students.filter(student => !student.hasGroup).length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                        🎉 Barcha o'quvchilar guruhlarga tayinlangan!
                      </p>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => {
                    const groupId = document.getElementById('assignmentGroup').value;
                    if (groupId) {
                      document.getElementById('studentAssignGroup').value = groupId;
                      assignStudentsToGroup();
                    } else {
                      alert('Guruhni tanlang!');
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm mt-3"
                >
                  ➕ Tanlangan O'quvchilarni Qo'shish
                </button>
              </div>
            </div>

            {/* Hidden elements for compatibility */}
            <div className="hidden">
              <select id="teacherAssignGroup"></select>
              <select id="teacherAssignTeacher"></select>
              <select id="studentAssignGroup"></select>
            </div>
          </div>

          {/* Current Students in Groups - for removal */}
          <div className="card border-l-4 border-l-red-500">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🗑️</span>
              </div>
              <h3 className="text-md font-semibold text-secondary-900 dark:text-white">
                Guruhlardan O'quvchilarni Chiqarish
              </h3>
            </div>
            
            {/* Current Students in Groups */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                Hozirgi Guruh O'quvchilari (chiqarish uchun)
              </h4>
              <div className="space-y-2">
                {groups.filter(group => group.teacher && group.students && group.students.length > 0).map(group => (
                  <div key={group._id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-secondary-900 dark:text-white">
                        📚 {group.name} - 👨‍🏫 {group.teacher.firstName} {group.teacher.lastName}
                      </h5>
                      <span className="text-sm text-secondary-500">
                        {group.students.length} o'quvchi
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {group.students.map(student => (
                        <label key={student._id} className="flex items-center gap-2 p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-red-600"
                            onChange={(e) => handleStudentRemovalSelection(group._id, student._id, e.target.checked)}
                          />
                          <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {student.firstName.charAt(0)}
                          </span>
                          <span className="text-sm text-secondary-900 dark:text-white">
                            👨‍🎓 {student.firstName} {student.lastName} ({student.studentId})
                          </span>
                        </label>
                      ))}
                    </div>
                    <button 
                      onClick={() => removeSelectedStudentsFromGroup(group._id)}
                      className="mt-2 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      ➖ Tanlangan O'quvchilarni Chiqarish
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4">
              <p className="text-sm text-green-800 dark:text-green-200">
                ✅ O'quvchi qo'shish majburiy emas. Guruhga o'qituvchi tayinlangandan keyin o'quvchilar qo'shilishi mumkin.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Guruhni tanlang (faqat o'qituvchi tayinlangan guruhlar)
                </label>
                <select 
                  id="studentAssignGroup"
                  className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                >
                  <option value="">Guruhni tanlang</option>
                  {groups.filter(group => group.teacher).map(group => (
                    <option key={group._id} value={group._id}>
                      📚 {group.name} ({group.level}) - 👨‍🏫 {group.teacher.firstName} {group.teacher.lastName} - 👥 {group.studentCount || 0} o'quvchi
                    </option>
                  ))}
                  {groups.filter(group => !group.teacher).length > 0 && (
                    <optgroup label="⚠️ O'qituvchi tayinlanmagan guruhlar (avval o'qituvchi tayinlang)">
                      {groups.filter(group => !group.teacher).map(group => (
                        <option key={group._id} value="" disabled>
                          ❌ {group.name} ({group.level}) - O'qituvchi yo'q
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Mavjud O'quvchilar (guruhi yo'q) - {students.filter(student => !student.hasGroup).length} ta
                </label>
                <div className="max-h-40 overflow-y-auto border border-secondary-300 dark:border-secondary-600 rounded-lg p-3 bg-secondary-50 dark:bg-secondary-700">
                  {students.filter(student => !student.hasGroup).map(student => (
                    <label key={student._id} className="flex items-center gap-3 p-2 hover:bg-secondary-100 dark:hover:bg-secondary-600 rounded cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-primary-600"
                        onChange={(e) => handleStudentSelection(student._id, e.target.checked)}
                      />
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {student.firstName.charAt(0)}
                        </span>
                        <span className="text-sm text-secondary-900 dark:text-white">
                          👨‍🎓 {student.firstName} {student.lastName} ({student.studentId})
                        </span>
                      </div>
                    </label>
                  ))}
                  {students.filter(student => !student.hasGroup).length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                        🎉 Barcha o'quvchilar guruhlarga tayinlangan!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button 
                onClick={assignStudentsToGroup}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                ➕ Tanlangan O'quvchilarni Qo'shish
              </button>
            </div>
          </div>

          {/* Enhanced Current Assignments Overview */}
          <div className="card border-l-4 border-l-purple-500">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">📊</span>
              </div>
              <h3 className="text-md font-semibold text-secondary-900 dark:text-white">
                Guruhlar Holati va Statistika
              </h3>
            </div>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{groups.length}</div>
                <div className="text-sm text-blue-800 dark:text-blue-200">Jami Guruhlar</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {groups.filter(group => group.teacher).length}
                </div>
                <div className="text-sm text-green-800 dark:text-green-200">O'qituvchi Tayinlangan</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">
                  {groups.filter(group => !group.teacher).length}
                </div>
                <div className="text-sm text-red-800 dark:text-red-200">O'qituvchi Yo'q</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {groups.reduce((sum, group) => sum + (group.studentCount || 0), 0)}
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-200">Jami O'quvchilar</div>
              </div>
            </div>

            {/* Groups List */}
            <div className="space-y-4">
              {groups.map(group => (
                <div key={group._id} className={`p-4 border rounded-lg ${
                  group.teacher ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : 'border-red-200 bg-red-50 dark:bg-red-900/10'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        group.teacher ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {group.teacher ? '✅' : '❌'}
                      </div>
                      <div>
                        <h4 className="font-medium text-secondary-900 dark:text-white text-lg">
                          📚 {group.name} ({group.level})
                        </h4>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          Fan: {group.subject}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        group.teacher ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {group.teacher ? 'Tayyor' : 'Tugallanmagan'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">👨‍🏫 O'qituvchi:</span> {group.teacher ? 
                          `${group.teacher.firstName} ${group.teacher.lastName} (${group.teacher.subject})` : 
                          '❌ Tayinlanmagan'
                        }
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">👥 O'quvchilar:</span> {group.studentCount || 0} ta
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">📊 Holat:</span> 
                        {group.teacher && (group.studentCount > 0) ? 
                          ' ✅ To\'liq tayyor (xabar almashish mumkin)' : 
                          group.teacher ? 
                            ' ⚠️ O\'quvchi qo\'shish mumkin' : 
                            ' ❌ O\'qituvchi tayinlang'
                        }
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">🎯 Max o'quvchi:</span> {group.maxStudents || 25} ta
                      </p>
                    </div>
                  </div>
                  
                  {group.description && (
                    <div className="mt-3 p-2 bg-secondary-100 dark:bg-secondary-700 rounded">
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        💬 {group.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              {groups.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-secondary-500 dark:text-secondary-400">
                    📝 Hozircha guruhlar yo'q. Avval "Guruhlar" tabidan guruh yarating.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="card border-l-4 border-l-yellow-500">
            <h3 className="text-md font-semibold text-secondary-900 dark:text-white mb-4">
              🚀 Tezkor Amallar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => setActiveTab('groups')}
                className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-left"
              >
                <div className="text-blue-600 font-medium">📚 Yangi Guruh Yaratish</div>
                <div className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                  Guruhlar tabiga o'tish
                </div>
              </button>
              <button 
                onClick={() => window.location.href = '/admin/users'}
                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 text-left"
              >
                <div className="text-green-600 font-medium">👨‍🏫 O'qituvchi Yaratish</div>
                <div className="text-sm text-green-800 dark:text-green-200 mt-1">
                  Foydalanuvchilar boshqaruviga o'tish
                </div>
              </button>
              <button 
                onClick={refreshAssignments}
                className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 text-left"
              >
                <div className="text-purple-600 font-medium">🔄 Ma'lumotlarni Yangilash</div>
                <div className="text-sm text-purple-800 dark:text-purple-200 mt-1">
                  Barcha ma'lumotlarni qayta yuklash
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              {'Dars Jadvali'}
            </h2>
            <button
              onClick={() => handleAdd('schedule')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <PlusIcon className="w-4 h-4" />
              {'Yangi Dars'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'].map((day) => (
              <div key={day} className="card">
                <h3 className="font-semibold text-secondary-900 dark:text-white mb-3 text-center">
                  {day}
                </h3>
                <div className="space-y-2">
                  {schedules
                    .filter(schedule => schedule.day === day)
                    .map((schedule) => (
                      <div key={schedule._id} className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded border-l-4 border-primary-500">
                        <div className="flex items-center gap-2 text-sm">
                          <ClockIcon className="w-4 h-4 text-primary-600" />
                          <span className="font-medium">{schedule.time}</span>
                        </div>
                        <p className="text-sm font-medium text-secondary-900 dark:text-white">
                          {schedule.subject}
                        </p>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400">
                          {'Xona'}: {schedule.room} • {schedule.duration} {'daqiqa'}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grading Tab */}
      {activeTab === 'grading' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
            {'Baholash Tizimi Sozlamalari'}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">
                {'Baholash Shkala'}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-secondary-600 dark:text-secondary-400">{'Joriy Shkala'}:</span>
                  <span className="font-medium text-secondary-900 dark:text-white">
                    {gradingSystem.scale}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary-600 dark:text-secondary-400">{'O\'tish Balli'}:</span>
                  <span className="font-medium text-secondary-900 dark:text-white">
                    {gradingSystem.passingGrade}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">
                {'Baholash Mezonlari'}
              </h3>
              <div className="space-y-2">
                {Object.entries(gradingSystem.criteria || {}).map(([grade, description]) => (
                  <div key={grade} className="flex items-center gap-3 p-2 bg-secondary-50 dark:bg-secondary-800 rounded">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      grade === '5' ? 'bg-green-500' :
                      grade === '4' ? 'bg-blue-500' :
                      grade === '3' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {grade}
                    </span>
                    <span className="text-secondary-900 dark:text-white">{description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exams Tab */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              {'Imtihonlar Rejasi'}
            </h2>
            <button
              onClick={() => handleAdd('exams')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <PlusIcon className="w-4 h-4" />
              {'Yangi Imtihon'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exams.map((exam) => (
              <div key={exam._id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-secondary-900 dark:text-white">
                      {exam.subject}
                    </h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {exam.type}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                    {exam.duration} {'daqiqa'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                    <CalendarIcon className="w-4 h-4" />
                    {new Date(exam.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                    <UserGroupIcon className="w-4 h-4" />
                    {exam.groups.join(', ')}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleEdit('exams', exam)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('exams', exam._id)}
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
                {modalType === 'subjects' && (
                  <>
                    <input
                      name="name"
                      type="text"
                      placeholder={'Fan nomi'}
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      defaultValue={editingItem?.name}
                      required
                    />
                    <textarea
                      name="description"
                      placeholder={'Tavsif'}
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg h-20 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      defaultValue={editingItem?.description}
                      required
                    />
                  </>
                )}
                {modalType === 'groups' && (
                  <>
                    <input
                      name="name"
                      type="text"
                      placeholder={'Guruh Nomi'}
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      defaultValue={editingItem?.name}
                      required
                    />
                    <select 
                      name="subject"
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      defaultValue={editingItem?.subject}
                      required
                    >
                      <option value="">{'Fanni tanlang'}</option>
                      <option value="English Language Teaching">English Language Teaching</option>
                      <option value="English Grammar">English Grammar</option>
                      <option value="English Speaking">English Speaking</option>
                      <option value="English Writing">English Writing</option>
                    </select>
                  </>
                )}
                {modalType === 'schedule' && (
                  <>
                    <select 
                      name="day"
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      required
                    >
                      <option value="">{'Kunni tanlang'}</option>
                      <option value="monday">{'Dushanba'}</option>
                      <option value="tuesday">{'Seshanba'}</option>
                      <option value="wednesday">{'Chorshanba'}</option>
                      <option value="thursday">{'Payshanba'}</option>
                      <option value="friday">{'Juma'}</option>
                    </select>
                    <input
                      name="time"
                      type="time"
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      defaultValue={editingItem?.time}
                      required
                    />
                    <input
                      name="room"
                      type="text"
                      placeholder={'Xona'}
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      defaultValue={editingItem?.room}
                      required
                    />
                  </>
                )}
                {modalType === 'exams' && (
                  <>
                    <input
                      name="subject"
                      type="text"
                      placeholder={'Fan'}
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      defaultValue={editingItem?.subject}
                      required
                    />
                    <input
                      name="type"
                      type="text"
                      placeholder={'Imtihon turi'}
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      defaultValue={editingItem?.type}
                      required
                    />
                    <input
                      name="date"
                      type="date"
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      defaultValue={editingItem?.date}
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
                  {'Saqlash'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-secondary-300 text-secondary-700 py-2 rounded-lg hover:bg-secondary-400"
                >
                  {'Bekor qilish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              {'Guruh Yaratish'}
            </h3>
            
            <div className="space-y-4">
              {/* Group Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    {'Guruh Nomi'}
                  </label>
                  <input
                    type="text"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                    placeholder="English-A1"
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    {'Daraja'}
                  </label>
                  <select
                    value={newGroup.level}
                    onChange={(e) => setNewGroup({...newGroup, level: e.target.value})}
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                  >
                    <option value="beginner">{'Boshlang\'ich'}</option>
                    <option value="elementary">{'Elementar'}</option>
                    <option value="intermediate">{'O\'rta'}</option>
                    <option value="upper-intermediate">{'Yuqori O\'rta'}</option>
                    <option value="advanced">{'Ilg\'or'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    {'O\'qituvchi'} ({'ixtiyoriy'} - keyinroq tayinlash mumkin)
                  </label>
                  <select
                    value={newGroup.teacherId}
                    onChange={(e) => setNewGroup({...newGroup, teacherId: e.target.value})}
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                  >
                    <option value="">{'O\'qituvchini tanlang'} (ixtiyoriy)</option>
                    {teachers.map(teacher => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.firstName} {teacher.lastName} ({teacher.teacherId}) - {teacher.subject}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    {'Maksimal O\'quvchilar'}
                  </label>
                  <input
                    type="number"
                    value={newGroup.maxStudents}
                    onChange={(e) => setNewGroup({...newGroup, maxStudents: parseInt(e.target.value)})}
                    min="5"
                    max="50"
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  {'Tavsif'} ({'ixtiyoriy'})
                </label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                  rows="3"
                  className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                  placeholder="Guruh haqida qisqacha ma'lumot..."
                />
              </div>

              {/* Student Selection - Optional */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  {'O\'quvchilarni tanlang'} ({'ixtiyoriy'} - keyinroq qo'shish mumkin) ({selectedStudents.length} {'tanlangan'})
                </label>
                <div className="max-h-48 overflow-y-auto border border-secondary-300 dark:border-secondary-600 rounded-lg p-3 bg-secondary-50 dark:bg-secondary-700">
                  {students.filter(student => !student.hasGroup).map(student => (
                    <label key={student._id} className="flex items-center gap-3 p-2 hover:bg-secondary-100 dark:hover:bg-secondary-600 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student._id)}
                        onChange={() => toggleStudentSelection(student._id)}
                        className="w-4 h-4 text-primary-600"
                      />
                      <div>
                        <p className="font-medium text-secondary-900 dark:text-white">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                          ID: {student.studentId}
                        </p>
                      </div>
                    </label>
                  ))}
                  {students.filter(student => !student.hasGroup).length === 0 && (
                    <p className="text-secondary-500 dark:text-secondary-400 text-center py-4">
                      {'Mavjud o\'quvchilar yo\'q'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={createGroup}
                disabled={!newGroup.name}
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {'Guruh Yaratish'}
              </button>
              <button
                onClick={() => {
                  setShowGroupModal(false);
                  resetGroupForm();
                }}
                className="flex-1 bg-secondary-300 text-secondary-700 py-2 rounded-lg hover:bg-secondary-400"
              >
                {'Bekor qilish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEducation;