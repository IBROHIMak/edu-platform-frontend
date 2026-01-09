import React, { useState, useEffect } from 'react';
import {
  UsersIcon,
  UserIcon,
  AcademicCapIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminUsers = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter, pagination.page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(roleFilter !== 'all' && { role: roleFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await axios.get(`/api/admin/users?${params}`);
      if (response.data.success) {
        setUsers(response.data.data.users);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await axios.put(`/api/admin/users/${userId}/status`, {
        isActive: !currentStatus
      });
      
      if (response.data.success) {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, isActive: !currentStatus } : user
        ));
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'teacher':
        return <UserIcon className="w-5 h-5 text-green-600" />;
      case 'student':
        return <AcademicCapIcon className="w-5 h-5 text-blue-600" />;
      case 'parent':
        return <UserGroupIcon className="w-5 h-5 text-purple-600" />;
      case 'admin':
        return <UsersIcon className="w-5 h-5 text-red-600" />;
      default:
        return <UserIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'teacher': return t('teacherRole');
      case 'student': return t('studentRole');
      case 'parent': return t('parentRole');
      case 'admin': return 'Admin';
      default: return role;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'teacher': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'student': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'parent': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (loading && users.length === 0) {
    return <LoadingSpinner className="h-64" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t('allUsers')} ({pagination.total})
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
          <input
            type="text"
            placeholder={t('searchUser')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
          />
        </div>
        <div className="relative">
          <FunnelIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
          >
            <option value="all">{t('allRoles')}</option>
            <option value="admin">Admin</option>
            <option value="teacher">{t('teacherRole')}</option>
            <option value="student">{t('studentRole')}</option>
            <option value="parent">{t('parentRole')}</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 dark:bg-secondary-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Foydalanuvchi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Ma'lumotlar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Holat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Oxirgi kirish
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Harakatlar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-secondary-900 divide-y divide-secondary-200 dark:divide-secondary-700">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center">
                        {getRoleIcon(user.role)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-secondary-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </div>
                        {user.email && (
                          <div className="text-sm text-secondary-500 dark:text-secondary-400">
                            {user.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-400">
                    {user.role === 'student' && (
                      <div>
                        <div>ID: {user.studentId}</div>
                        <div>{t('group')}: {user.group?.name || t('notAssigned')}</div>
                      </div>
                    )}
                    {user.role === 'teacher' && (
                      <div>
                        <div>ID: {user.teacherId}</div>
                        <div>{t('subject')}: {user.subject}</div>
                      </div>
                    )}
                    {user.role === 'parent' && (
                      <div>
                        <div>{t('parentType')}: {user.parentType === 'father' ? t('father') : t('mother')}</div>
                        <div>{t('childName')}: {user.childName}</div>
                      </div>
                    )}
                    {user.role === 'admin' && (
                      <div>Administrator</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {user.isActive ? 'Faol' : 'Nofaol'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-400">
                    {user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : t('never')
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleUserStatus(user._id, user.isActive)}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        user.isActive
                          ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                      }`}
                    >
                      {user.isActive ? 'Faolsizlashtirish' : 'Faollashtirish'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-secondary-500 dark:text-secondary-400">
            {pagination.total} tadan {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} ko'rsatilmoqda
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-3 py-1 text-sm border border-secondary-300 dark:border-secondary-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-50 dark:hover:bg-secondary-800"
            >
              Oldingi
            </button>
            <span className="px-3 py-1 text-sm">
              {pagination.page} / {pagination.pages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-1 text-sm border border-secondary-300 dark:border-secondary-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-50 dark:hover:bg-secondary-800"
            >
              Keyingi
            </button>
          </div>
        </div>
      )}

      {users.length === 0 && !loading && (
        <div className="text-center py-12">
          <UsersIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <p className="text-secondary-500 dark:text-secondary-400">
            {searchTerm || roleFilter !== 'all' ? 'Qidiruv bo\'yicha natija topilmadi' : 'Hozircha foydalanuvchilar yo\'q'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;