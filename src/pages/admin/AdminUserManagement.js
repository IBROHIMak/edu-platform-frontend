import React, { useState, useEffect } from 'react';
import {
  UserPlusIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminUserManagement = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBulkMessage, setShowBulkMessage] = useState(false);
  const [bulkMessage, setBulkMessage] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    role: 'student',
    password: '',
    studentId: '',
    teacherId: '',
    subject: '',
    groupId: '',
    parentPhone: '',
    parentType: '',
    childName: ''
  });
  const [availableGroups, setAvailableGroups] = useState([]);
  const [availableTeachers, setAvailableTeachers] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchGroupsAndTeachers();
    
    // Debug: Log data sources
    console.log('🔍 AdminUserManagement Debug Info:');
    console.log('- API Base URL:', axios.defaults.baseURL || 'http://localhost:5002');
    console.log('- Token exists:', !!localStorage.getItem('token'));
    console.log('- localStorage adminUsers:', localStorage.getItem('adminUsers') ? 'exists' : 'empty');
  }, [filterRole, searchTerm]);

  const fetchGroupsAndTeachers = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Try to get groups from API first
      try {
        const groupsResponse = await axios.get('/api/groups', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (groupsResponse.data.success) {
          const apiGroups = groupsResponse.data.data.groups;
          setAvailableGroups(apiGroups);
          console.log('✅ Groups loaded from API for user management:', apiGroups.length);
        }
      } catch (error) {
        console.log('⚠️ Groups API failed, using localStorage fallback');
        // Fallback to localStorage
        const savedGroups = localStorage.getItem('adminGroups');
        if (savedGroups) {
          setAvailableGroups(JSON.parse(savedGroups));
        } else {
          setAvailableGroups([
            { _id: '1', name: 'English-A1', level: 'Beginner', teacher: { firstName: 'Aziz', lastName: 'Karimov', subject: 'English Language Teaching' } },
            { _id: '2', name: 'English-B1', level: 'Intermediate', teacher: { firstName: 'Malika', lastName: 'Tosheva', subject: 'English Grammar' } }
          ]);
        }
      }
      
      // Get teachers from API
      try {
        const usersResponse = await axios.get('/api/admin/users?role=teacher', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (usersResponse.data.success) {
          setAvailableTeachers(usersResponse.data.data.users);
          console.log('✅ Teachers loaded from API for user management:', usersResponse.data.data.users.length);
        }
      } catch (error) {
        console.log('⚠️ Teachers API failed, using localStorage fallback');
        // Fallback to localStorage
        const savedUsers = localStorage.getItem('adminUsers');
        if (savedUsers) {
          const users = JSON.parse(savedUsers);
          const teachersList = users.filter(user => user.role === 'teacher');
          setAvailableTeachers(teachersList);
        } else {
          // Default teachers
          setAvailableTeachers([
            { _id: 'TEA001', firstName: 'Aziz', lastName: 'Karimov', teacherId: 'TEA001', subject: 'English Language Teaching' },
            { _id: 'TEA002', firstName: 'Malika', lastName: 'Tosheva', teacherId: 'TEA002', subject: 'English Grammar' }
          ]);
        }
      }
    } catch (error) {
      console.error('Error fetching groups and teachers:', error);
      alert('Guruhlar va o\'qituvchilarni yuklashda xatolik yuz berdi');
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filterRole !== 'all') params.append('role', filterRole);
      if (searchTerm) params.append('search', searchTerm);
      
      // Try API first
      try {
        const response = await axios.get(`/api/admin/users?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          console.log('✅ Users loaded from API:', response.data.data.users.length);
          setUsers(response.data.data.users);
          return; // Exit early if API works
        }
      } catch (apiError) {
        console.log('⚠️ API failed, using localStorage fallback');
      }
      
      // Fallback - load from localStorage ONLY (no default demo users)
      const savedUsers = localStorage.getItem('adminUsers');
      if (savedUsers) {
        let parsedUsers = JSON.parse(savedUsers);
        
        // Apply filters
        if (filterRole !== 'all') {
          parsedUsers = parsedUsers.filter(user => user.role === filterRole);
        }
        if (searchTerm) {
          parsedUsers = parsedUsers.filter(user => 
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        console.log('✅ Users loaded from localStorage:', parsedUsers.length);
        setUsers(parsedUsers);
      } else {
        // Show empty state instead of demo users
        console.log('ℹ️ No users found in any source');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.put(`/api/admin/users/${userId}/status`, {
        isActive: !currentStatus
      });
      
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isActive: !currentStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
      alert(t('userStatusError'));
    }
  };

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  const resetPassword = async (userId) => {
    setSelectedUserId(userId);
    setShowPasswordModal(true);
  };

  const handlePasswordReset = async () => {
    if (!newPasswordInput || newPasswordInput.length < 6) {
      alert('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/admin/users/${selectedUserId}/reset-password`, {
        newPassword: newPasswordInput
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        alert(`Parol muvaffaqiyatli o'zgartirildi: ${newPasswordInput}`);
        setShowPasswordModal(false);
        setNewPasswordInput('');
        setSelectedUserId(null);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Parolni tiklashda xatolik yuz berdi');
    }
  };

  const sendBulkMessage = async () => {
    try {
      await axios.post('/api/admin/bulk-message', {
        userIds: selectedUsers,
        message: bulkMessage,
        type: 'notification'
      });
      
      alert('Xabar muvaffaqiyatli yuborildi!');
      setShowBulkMessage(false);
      setBulkMessage('');
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error sending bulk message:', error);
      alert('Xabar yuborishda xatolik yuz berdi');
      setShowBulkMessage(false);
      setBulkMessage('');
      setSelectedUsers([]);
    }
  };

  const exportUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/users/export', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      alert('Foydalanuvchilar muvaffaqiyatli eksport qilindi!');
    } catch (error) {
      console.error('Error exporting users:', error);
      alert('Foydalanuvchilarni eksport qilishda xatolik yuz berdi');
    }
  };

  const editUser = async (userId) => {
    const user = users.find(u => u._id === userId);
    if (!user) return;
    
    // Set user data for editing
    setNewUser({
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      password: '',
      studentId: user.studentId || '',
      teacherId: user.teacherId || '',
      subject: user.subject || '',
      parentType: user.parentType || '',
      childName: user.childName || '',
      groupId: user.group?._id || '',
      parentPhone: user.parentPhone || ''
    });
    setShowCreateModal(true);
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Foydalanuvchini o\'chirishni tasdiqlaysizmi?')) return;
    
    try {
      const token = localStorage.getItem('token');
      
      // Try API deletion first
      try {
        const response = await axios.delete(`/api/admin/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          alert('Foydalanuvchi muvaffaqiyatli o\'chirildi!');
          await fetchUsers(); // Refresh from API
          return;
        }
      } catch (apiError) {
        console.log('API deletion failed, trying localStorage fallback...');
      }
      
      // Fallback - delete from localStorage
      const savedUsers = localStorage.getItem('adminUsers');
      if (savedUsers) {
        const existingUsers = JSON.parse(savedUsers);
        const updatedUsers = existingUsers.filter(user => user._id !== userId);
        
        // Update localStorage
        localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
        
        // Update state directly (don't call fetchUsers to avoid API reload)
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        
        alert('Foydalanuvchi muvaffaqiyatli o\'chirildi!');
      } else {
        alert('Foydalanuvchini o\'chirishda xatolik yuz berdi');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Foydalanuvchini o\'chirishda xatolik yuz berdi');
    }
  };

  const importUsers = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/admin/users/import', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        alert(`${response.data.data.imported} foydalanuvchi muvaffaqiyatli import qilindi!`);
        await fetchUsers();
      }
    } catch (error) {
      console.error('Error importing users:', error);
      alert('Foydalanuvchilarni import qilishda xatolik yuz berdi');
    }
  };

  const createUser = async () => {
    try {
      // Validate required fields
      if (!newUser.firstName || !newUser.lastName) {
        alert('Ism va familiya majburiy!');
        return;
      }

      if (newUser.role === 'student' && !newUser.parentPhone) {
        alert('O\'quvchi uchun ota-ona telefon raqami majburiy!');
        return;
      }

      if (newUser.role === 'teacher' && !newUser.subject) {
        alert('O\'qituvchi uchun fan majburiy!');
        return;
      }

      if (newUser.role === 'parent' && (!newUser.parentType || !newUser.childName)) {
        alert('Ota-ona uchun turi va farzand ismi majburiy!');
        return;
      }

      const token = localStorage.getItem('token');
      const userData = {
        ...newUser,
        password: newUser.password || 'Password123!'
      };

      try {
        const response = await axios.post('/api/admin/users', userData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          const createdUser = response.data.data.user;
          const credentials = response.data.data.credentials;
          
          // Refresh users list
          await fetchUsers();
          
          setShowCreateModal(false);
          setNewUser({
            firstName: '',
            lastName: '',
            role: 'student',
            password: '',
            studentId: '',
            teacherId: '',
            subject: '',
            groupId: '',
            parentPhone: '',
            parentType: '',
            childName: ''
          });
          
          const selectedGroup = newUser.role === 'student' && newUser.groupId ? 
            availableGroups.find(g => g._id === newUser.groupId) : null;
          
          alert(`Foydalanuvchi muvaffaqiyatli yaratildi!\nID: ${credentials.id}\nParol: ${credentials.password}${
            selectedGroup ? `\nGuruh: ${selectedGroup.name}` : ''
          }`);
        } else {
          alert('Foydalanuvchi yaratishda xatolik: ' + response.data.message);
        }
      } catch (apiError) {
        console.log('API failed, using localStorage fallback...');
        
        // Fallback - simulate user creation and save to localStorage
        const currentUsers = users || [];
        
        // Generate unique ID based on role - check existing IDs to avoid duplicates
        let newId;
        if (newUser.role === 'student') {
          // Find highest existing student ID
          const existingStudentIds = currentUsers
            .filter(u => u.role === 'student' && u.studentId)
            .map(u => parseInt(u.studentId.replace('STU', '')))
            .sort((a, b) => b - a);
          
          const nextNumber = existingStudentIds.length > 0 ? existingStudentIds[0] + 1 : 1;
          newId = `STU${String(nextNumber).padStart(3, '0')}`;
        } else if (newUser.role === 'teacher') {
          // Find highest existing teacher ID
          const existingTeacherIds = currentUsers
            .filter(u => u.role === 'teacher' && u.teacherId)
            .map(u => parseInt(u.teacherId.replace('TEA', '')))
            .sort((a, b) => b - a);
          
          const nextNumber = existingTeacherIds.length > 0 ? existingTeacherIds[0] + 1 : 1;
          newId = `TEA${String(nextNumber).padStart(3, '0')}`;
        } else if (newUser.role === 'parent') {
          // Find highest existing parent number
          const existingParentIds = currentUsers
            .filter(u => u.role === 'parent')
            .length;
          
          newId = `PAR${String(existingParentIds + 1).padStart(3, '0')}`;
        } else {
          newId = 'ADM001';
        }
        
        const simulatedUser = {
          _id: Date.now().toString(),
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
          studentId: newUser.role === 'student' ? newId : undefined,
          teacherId: newUser.role === 'teacher' ? newId : undefined,
          subject: newUser.role === 'teacher' ? (newUser.subject || 'English Language Teaching') : undefined,
          parentPhone: newUser.role === 'student' ? newUser.parentPhone : undefined,
          parentType: newUser.role === 'parent' ? newUser.parentType : undefined,
          childName: newUser.role === 'parent' ? newUser.childName : undefined,
          group: newUser.groupId ? availableGroups.find(g => g._id === newUser.groupId) : undefined,
          isActive: true,
          createdAt: new Date().toISOString(),
          password: newUser.password || 'Password123!' // Store for localStorage login
        };
        
        // Add to users list
        const updatedUsers = [...users, simulatedUser];
        setUsers(updatedUsers);
        
        // Save to localStorage for persistence
        const savedUsers = localStorage.getItem('adminUsers') || '[]';
        const existingUsers = JSON.parse(savedUsers);
        existingUsers.push(simulatedUser);
        localStorage.setItem('adminUsers', JSON.stringify(existingUsers));
        
        setShowCreateModal(false);
        setNewUser({
          firstName: '',
          lastName: '',
          role: 'student',
          password: '',
          studentId: '',
          teacherId: '',
          subject: '',
          groupId: '',
          parentPhone: '',
          parentType: '',
          childName: ''
        });
        
        const selectedGroup = newUser.role === 'student' && newUser.groupId ? 
          availableGroups.find(g => g._id === newUser.groupId) : null;
        
        alert(`Foydalanuvchi muvaffaqiyatli yaratildi!\nID: ${newId}\nParol: ${newUser.password || 'Password123!'}${
          selectedGroup ? `\nGuruh: ${selectedGroup.name}` : ''
        }${newUser.role === 'teacher' ? `\nFan: ${newUser.subject || 'English Language Teaching'}` : ''}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Foydalanuvchi yaratishda xatolik yuz berdi: ' + error.message);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesSearch = searchTerm === '' || 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            {t('userManagement')}
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            {t('manageAllUsers')}
          </p>
        </div>
        
        <div className="flex gap-3">
          {/* Barcha ma'lumotlarni tozalash tugmasi */}
          <button
            onClick={async () => {
              if (!window.confirm('DIQQAT! Bu barcha foydalanuvchilarni (admin bundan mustasno) va mahalliy ma\'lumotlarni butunlay o\'chiradi. Davom etasizmi?')) return;
              
              try {
                // Avval ma'lumotlar bazasini tozalash
                const token = localStorage.getItem('token');
                const response = await axios.delete('/api/admin/users/clear-all', {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.data.success) {
                  // Keyin localStorage ni tozalash
                  localStorage.removeItem('adminUsers');
                  setUsers([]);
                  
                  alert(`✅ ${response.data.deletedCount} foydalanuvchi ma'lumotlar bazasidan va barcha mahalliy ma'lumotlar o'chirildi!`);
                  await fetchUsers(); // Ro'yxatni yangilash
                } else {
                  alert('❌ Xatolik yuz berdi: ' + response.data.message);
                }
              } catch (error) {
                console.error('Clear all data error:', error);
                // Agar API ishlamasa, faqat localStorage ni tozalash
                localStorage.removeItem('adminUsers');
                setUsers([]);
                alert('⚠️ Ma\'lumotlar bazasiga ulanib bo\'lmadi, faqat mahalliy ma\'lumotlar tozalandi');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            title="Barcha foydalanuvchilarni va mahalliy ma'lumotlarni o'chirish"
          >
            🗑️ Hammasini O'chirish
          </button>
          
          <button
            onClick={exportUsers}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            {t('exportButton')}
          </button>
          
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
            <ArrowUpTrayIcon className="w-4 h-4" />
            {t('importButton')}
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={importUsers}
              className="hidden"
            />
          </label>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <UserPlusIcon className="w-4 h-4" />
            {t('newUser')}
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800"
            >
              <option value="all">{t('allRoles')}</option>
              <option value="student">{t('students')}</option>
              <option value="teacher">{t('teachers')}</option>
              <option value="admin">{t('admins')}</option>
            </select>
            
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800"
            />
          </div>
          
          {selectedUsers.length > 0 && (
            <div className="flex gap-2 items-center">
              <span className="text-sm text-secondary-600">
                {selectedUsers.length} {t('selectedCount')}
              </span>
              <button
                onClick={() => setShowBulkMessage(true)}
                className="flex items-center gap-2 px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
              >
                <MegaphoneIcon className="w-4 h-4" />
                {t('sendMessage')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <UserPlusIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
              {users.length === 0 ? 'Hech qanday foydalanuvchi topilmadi' : 'Filter bo\'yicha natija topilmadi'}
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              {users.length === 0 
                ? 'Yangi foydalanuvchi yaratish uchun "Yangi foydalanuvchi" tugmasini bosing'
                : 'Boshqa filter yoki qidiruv so\'zini sinab ko\'ring'
              }
            </p>
            {users.length === 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <UserPlusIcon className="w-4 h-4" />
                Yangi foydalanuvchi
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 dark:bg-secondary-800">
                <tr>
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map(u => u._id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-900 dark:text-white">
                    {t('userColumn')}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-900 dark:text-white">
                    {t('roleColumn')}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-900 dark:text-white">
                    {t('lastLoginColumn')}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-900 dark:text-white">
                    {t('statusColumn')}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-900 dark:text-white">
                    {t('actionsColumn')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-secondary-100 dark:border-secondary-800">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                          user.role === 'student' ? 'bg-blue-500' :
                          user.role === 'teacher' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {user.firstName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </p>
                          <div className="text-sm text-secondary-500 space-y-1">
                            <p>ID: {user.studentId || user.teacherId || 'N/A'}</p>
                            {user.group && (
                              <p>Group: {user.group.name || 'N/A'}</p>
                            )}
                            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'student' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'teacher' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.role === 'student' ? t('studentRole') :
                         user.role === 'teacher' ? t('teacherRole') : 'Admin'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-secondary-600 dark:text-secondary-400">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : t('never')}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleUserStatus(user._id, user.isActive)}
                        className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {user.isActive ? <EyeIcon className="w-3 h-3" /> : <EyeSlashIcon className="w-3 h-3" />}
                        {user.isActive ? t('active') : t('blocked')}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => resetPassword(user._id)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          title={t('resetPasswordTitle')}
                        >
                          <LockClosedIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => editUser(user._id)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                          title={t('editTitle')}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title={t('deleteTitle')}
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
        )}
      </div>

      {/* Bulk Message Modal */}
      {showBulkMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              {t('bulkMessageTitle')}
            </h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
              {selectedUsers.length} {t('usersWillReceiveMessage')}
            </p>
            <textarea
              value={bulkMessage}
              onChange={(e) => setBulkMessage(e.target.value)}
              placeholder={t('enterMessageText')}
              className="w-full h-32 p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={sendBulkMessage}
                disabled={!bulkMessage.trim()}
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {t('send')}
              </button>
              <button
                onClick={() => setShowBulkMessage(false)}
                className="flex-1 bg-secondary-300 text-secondary-700 py-2 rounded-lg hover:bg-secondary-400"
              >
                {t('cancelButton')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Parolni tiklash
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Yangi parol
                </label>
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Kamida 6 ta belgi"
                  className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handlePasswordReset}
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
              >
                Parolni o'zgartirish
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPasswordInput('');
                  setSelectedUserId(null);
                }}
                className="flex-1 bg-secondary-300 text-secondary-700 py-2 rounded-lg hover:bg-secondary-400"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              {t('newUser')}
            </h3>
            
            <div className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  {t('role')}
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                >
                  <option value="student">{t('studentRole')}</option>
                  <option value="teacher">{t('teacherRole')}</option>
                  <option value="parent">Ota-ona</option>
                </select>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    {t('firstName')}
                  </label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    {t('lastName')}
                  </label>
                  <input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  {t('password')} ({t('optional')} - default: Password123!)
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Password123!"
                  className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                />
              </div>

              {/* Role-specific fields */}
              {newUser.role === 'student' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      {t('selectGroup')} (ixtiyoriy - keyinroq tayinlash mumkin)
                    </label>
                    <select
                      value={newUser.groupId}
                      onChange={(e) => setNewUser({...newUser, groupId: e.target.value})}
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                    >
                      <option value="">{t('selectGroup')} (ixtiyoriy)</option>
                      {availableGroups.map(group => (
                        <option key={group._id} value={group._id}>
                          {group.name} ({group.level}) - {group.teacher?.firstName} {group.teacher?.lastName} 
                          {group.teacher?.subject ? ` - ${group.teacher.subject}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Ota-ona telefon raqami *
                    </label>
                    <input
                      type="tel"
                      value={newUser.parentPhone}
                      onChange={(e) => setNewUser({...newUser, parentPhone: e.target.value})}
                      placeholder="+998901234567"
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      required
                    />
                  </div>
                </>
              )}
              
              {newUser.role === 'teacher' && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    {t('subject')} (istalgan fan yozish mumkin)
                  </label>
                  <input
                    type="text"
                    value={newUser.subject}
                    onChange={(e) => setNewUser({...newUser, subject: e.target.value})}
                    placeholder="English Language Teaching, yo'q, Matematika, Fizika, va h.k."
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                    required
                  />
                </div>
              )}
              
              {newUser.role === 'parent' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      {t('parentType')} *
                    </label>
                    <select
                      value={newUser.parentType}
                      onChange={(e) => setNewUser({...newUser, parentType: e.target.value})}
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      required
                    >
                      <option value="">{t('selectType')}</option>
                      <option value="father">{t('father')}</option>
                      <option value="mother">{t('mother')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      {t('childName')} *
                    </label>
                    <input
                      type="text"
                      value={newUser.childName}
                      onChange={(e) => setNewUser({...newUser, childName: e.target.value})}
                      placeholder="Ali Valiyev"
                      className="w-full p-3 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      required
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={createUser}
                disabled={!newUser.firstName || !newUser.lastName || 
                  (newUser.role === 'student' && !newUser.parentPhone) ||
                  (newUser.role === 'teacher' && !newUser.subject) ||
                  (newUser.role === 'parent' && (!newUser.parentType || !newUser.childName))
                }
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {t('create')}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-secondary-300 text-secondary-700 py-2 rounded-lg hover:bg-secondary-400"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;