import React, { useState, useEffect } from 'react';
import { 
  UserIcon,
  ChartBarIcon,
  StarIcon,
  ClockIcon,
  BookOpenIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradeData, setGradeData] = useState({
    grades: 0,
    attendance: 0,
    homeworkCompletion: 0,
    classParticipation: 0
  });

  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchStudents();
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('/api/groups');
      const teacherGroups = response.data.data.groups.filter(
        group => group.teacher._id === user.id
      );
      setGroups(teacherGroups);
      if (teacherGroups.length > 0) {
        setSelectedGroup(teacherGroups[0]._id);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error(t('errorLoadingGroups'));
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`/api/users/students/${selectedGroup}`);
      setStudents(response.data.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error(t('errorLoadingStudents'));
    }
  };

  const handleGradeStudent = (student) => {
    setSelectedStudent(student);
    setGradeData({
      grades: student.rating?.grades || 0,
      attendance: student.rating?.attendance || 0,
      homeworkCompletion: student.rating?.homeworkCompletion || 0,
      classParticipation: student.rating?.classParticipation || 0
    });
    setShowGradeModal(true);
  };

  const submitGrade = async () => {
    try {
      await axios.put(`/api/ratings/student/${selectedStudent._id}`, gradeData);
      toast.success(t('gradeUpdatedSuccessfully'));
      setShowGradeModal(false);
      fetchStudents();
    } catch (error) {
      console.error('Error updating grade:', error);
      toast.error(t('errorUpdatingGrade'));
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-success-600 bg-success-100';
    if (score >= 6) return 'text-warning-600 bg-warning-100';
    return 'text-danger-600 bg-danger-100';
  };

  if (loading) {
    return <LoadingSpinner className="h-64" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t('students')}
        </h1>
        <div className="flex items-center gap-4">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="input"
          >
            <option value="">{t('selectGroup')}</option>
            {groups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.name} - {group.subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!selectedGroup ? (
        <div className="card text-center py-12">
          <UserIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
            {t('selectGroup')}
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            {t('selectGroupToViewStudents')}
          </p>
        </div>
      ) : students.length === 0 ? (
        <div className="card text-center py-12">
          <UserIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
            {t('noStudentsInGroup')}
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            {t('studentsWillAppearHere')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Students List */}
          <div className="grid gap-4">
            {students.map((student, index) => (
              <div key={student._id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-warning-500 text-white' :
                        index === 1 ? 'bg-secondary-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-secondary-200 dark:bg-secondary-600 text-secondary-700 dark:text-secondary-300'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-secondary-900 dark:text-white">
                        {student.firstName} {student.lastName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-secondary-500 dark:text-secondary-400">
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-4 h-4" />
                          <span>{student.points} ball</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrophyIcon className="w-4 h-4" />
                          <span>{student.rating?.rankInGroup || 0}-o'rin</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Rating Components */}
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(student.rating?.grades || 0)}`}>
                          {(student.rating?.grades || 0).toFixed(1)}
                        </div>
                        <p className="text-xs text-secondary-500 mt-1">{t('grades')}</p>
                      </div>
                      <div className="text-center">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(student.rating?.attendance || 0)}`}>
                          {(student.rating?.attendance || 0).toFixed(1)}
                        </div>
                        <p className="text-xs text-secondary-500 mt-1">{t('attendance')}</p>
                      </div>
                      <div className="text-center">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(student.rating?.totalScore || 0)}`}>
                          {(student.rating?.totalScore || 0).toFixed(1)}
                        </div>
                        <p className="text-xs text-secondary-500 mt-1">{t('total')}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleGradeStudent(student)}
                      className="btn-primary text-sm"
                    >
                      {t('grade')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grade Modal */}
      {showGradeModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
              {t('gradeStudent', {name: `${selectedStudent.firstName} ${selectedStudent.lastName}`})}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  {t('grades')} (1-10)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  className="input"
                  value={gradeData.grades}
                  onChange={(e) => setGradeData({...gradeData, grades: parseFloat(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  {t('attendance')} (1-10)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  className="input"
                  value={gradeData.attendance}
                  onChange={(e) => setGradeData({...gradeData, attendance: parseFloat(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  {t('homework')} (1-10)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  className="input"
                  value={gradeData.homeworkCompletion}
                  onChange={(e) => setGradeData({...gradeData, homeworkCompletion: parseFloat(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  {t('classParticipation')} (1-10)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  className="input"
                  value={gradeData.classParticipation}
                  onChange={(e) => setGradeData({...gradeData, classParticipation: parseFloat(e.target.value)})}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowGradeModal(false)}
                  className="flex-1 btn-outline"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={submitGrade}
                  className="flex-1 btn-primary"
                >
                  {t('save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStudents;