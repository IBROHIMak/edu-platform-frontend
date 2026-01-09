import React, { useState } from 'react';
import {
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  ServerIcon as DatabaseIcon,
  ServerIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminSettings = () => {
  const { t } = useLanguage();
  const [settings, setSettings] = useState({
    siteName: 'EduPlatform',
    siteDescription: t('platformDescription'),
    allowRegistration: true,
    requireEmailVerification: false,
    maxStudentsPerGroup: 30,
    defaultLanguage: 'uz',
    enableNotifications: true,
    enableFileUploads: true,
    maxFileSize: 10, // MB
    backupFrequency: 'daily',
    maintenanceMode: false
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    // Here you would save settings to backend
    alert('Sozlamalar saqlandi!');
  };

  const settingSections = [
    {
      title: t('generalSettings'),
      icon: CogIcon,
      settings: [
        {
          key: 'siteName',
          label: t('siteName'),
          type: 'text',
          description: 'Platformaning asosiy nomi'
        },
        {
          key: 'siteDescription',
          label: t('siteDescription'),
          type: 'text',
          description: 'Platformaning qisqa tavsifi'
        },
        {
          key: 'defaultLanguage',
          label: t('defaultLanguage'),
          type: 'select',
          options: [
            { value: 'uz', label: 'O\'zbekcha' },
            { value: 'ru', label: 'Русский' },
            { value: 'en', label: 'English' }
          ],
          description: 'Platformaning standart tili'
        }
      ]
    },
    {
      title: t('security'),
      icon: ShieldCheckIcon,
      settings: [
        {
          key: 'allowRegistration',
          label: t('allowRegistration'),
          type: 'boolean',
          description: t('newUsersCanRegister')
        },
        {
          key: 'requireEmailVerification',
          label: 'Email tasdiqlash majburiy',
          type: 'boolean',
          description: 'Ro\'yxatdan o\'tishda email tasdiqlash talab qilinsinmi'
        },
        {
          key: 'maintenanceMode',
          label: 'Texnik xizmat rejimi',
          type: 'boolean',
          description: 'Saytni texnik xizmat rejimiga o\'tkazish'
        }
      ]
    },
    {
      title: 'Bildirishnomalar',
      icon: BellIcon,
      settings: [
        {
          key: 'enableNotifications',
          label: t('enableNotifications'),
          type: 'boolean',
          description: t('systemNotifications')
        }
      ]
    },
    {
      key: t('groupSettings'),
      title: t('groupSettings'),
      icon: DocumentTextIcon,
      settings: [
        {
          key: 'maxStudentsPerGroup',
          label: t('maxStudentsPerGroup'),
          type: 'number',
          description: t('maxStudentsDescription')
        }
      ]
    },
    {
      title: t('fileSettings'),
      icon: DatabaseIcon,
      settings: [
        {
          key: 'enableFileUploads',
          label: 'Fayl yuklashni yoqish',
          type: 'boolean',
          description: 'Foydalanuvchilar fayl yuklay olsinmi'
        },
        {
          key: 'maxFileSize',
          label: 'Maksimal fayl hajmi (MB)',
          type: 'number',
          description: 'Yuklanishi mumkin bo\'lgan maksimal fayl hajmi'
        }
      ]
    },
    {
      title: 'Tizim',
      icon: ServerIcon,
      settings: [
        {
          key: 'backupFrequency',
          label: 'Zaxira nusxa chastotasi',
          type: 'select',
          options: [
            { value: 'hourly', label: t('hourly') },
            { value: 'daily', label: t('daily') },
            { value: 'weekly', label: t('weekly') },
            { value: 'monthly', label: t('monthly') }
          ],
          description: t('backupFrequency')
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t('systemSettings')}
        </h1>
        <button
          onClick={saveSettings}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Sozlamalarni saqlash
        </button>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <section.icon className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                {section.title}
              </h2>
            </div>

            <div className="space-y-6">
              {section.settings.map((setting, settingIndex) => (
                <div key={settingIndex} className="flex items-start justify-between">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-1">
                      {setting.label}
                    </label>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      {setting.description}
                    </p>
                  </div>
                  
                  <div className="ml-6">
                    {setting.type === 'boolean' && (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[setting.key]}
                          onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-blue-600"></div>
                      </label>
                    )}
                    
                    {setting.type === 'text' && (
                      <input
                        type="text"
                        value={settings[setting.key]}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                        className="px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white w-64"
                      />
                    )}
                    
                    {setting.type === 'number' && (
                      <input
                        type="number"
                        value={settings[setting.key]}
                        onChange={(e) => handleSettingChange(setting.key, parseInt(e.target.value))}
                        className="px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white w-32"
                      />
                    )}
                    
                    {setting.type === 'select' && (
                      <select
                        value={settings[setting.key]}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                        className="px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white w-48"
                      >
                        {setting.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* System Information */}
      <div className="card bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">
          📊 Tizim ma'lumotlari
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800 dark:text-blue-200">
          <div>
            <p className="font-medium">Platform versiyasi</p>
            <p>v1.0.0</p>
          </div>
          <div>
            <p className="font-medium">Ma'lumotlar bazasi</p>
            <p>MongoDB 7.0</p>
          </div>
          <div>
            <p className="font-medium">Server</p>
            <p>Node.js 18.x</p>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="card bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
          ⚠️ Diqqat
        </h3>
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          Ba'zi sozlamalarni o'zgartirish tizimning ishlashiga ta'sir qilishi mumkin. 
          O'zgartirishlarni amalga oshirishdan oldin zaxira nusxa oling.
        </p>
      </div>
    </div>
  );
};

export default AdminSettings;