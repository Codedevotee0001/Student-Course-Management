import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import OverviewTab from './components/OverviewTab';
import CatalogTab from './components/CatalogTab';
import MyCoursesTab from './components/MyCoursesTab';
import ManageCoursesTab from './components/ManageCoursesTab';
import ProfileTab from './components/ProfileTab';
import CourseDetailModal from './components/CourseDetailModal';
import AddCourseModal from './components/AddCourseModal';
import EditCourseModal from './components/EditCourseModal';
import ToastNotification from './components/ToastNotification';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('catalog');
  
  // Data states
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  // Modal states: AuthModal opens automatically at starting if user is not logged in!
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [selectedCourseModal, setSelectedCourseModal] = useState(null);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [editingCourseModal, setEditingCourseModal] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Initial Check for logged in user session
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        // Verify current user with backend
        axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        }).catch(() => {
          // Token invalid/expired -> open Auth Modal at start
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setAuthModal({ isOpen: true, mode: 'login' });
        });
      } catch (e) {
        setUser(null);
        setAuthModal({ isOpen: true, mode: 'login' });
      }
    } else {
      // If user is not logged in at start, open the sleek Login/Signup modal to prompt them first!
      setUser(null);
      setAuthModal({ isOpen: true, mode: 'login' });
    }
  }, []);

  // Fetch Courses when filters change
  const fetchCourses = async () => {
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedLevel && selectedLevel !== 'All') params.level = selectedLevel;

      const res = await axios.get('/api/courses', { params });
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  // Fetch User Enrollments
  const fetchEnrollments = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get('/api/enrollments/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrollments(res.data);
    } catch (err) {
      console.error('Error fetching enrollments:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [searchQuery, selectedCategory, selectedLevel]);

  useEffect(() => {
    if (user) {
      fetchEnrollments();
    } else {
      setEnrollments([]);
    }
  }, [user]);

  // Auth Handlers
  const handleAuthSuccess = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    showToast(`Welcome back, ${userData.name}!`);
    fetchEnrollments();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setEnrollments([]);
    setActiveTab('catalog');
    showToast('Logged out successfully.', 'info');
    // Open the sleek Auth Modal again for prompt
    setAuthModal({ isOpen: true, mode: 'login' });
  };

  // CRUD Handler: Enroll in Course (Create Enrollment)
  const handleEnroll = async (courseId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthModal({ isOpen: true, mode: 'login' });
      return;
    }

    try {
      const res = await axios.post('/api/enrollments', { courseId }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast(res.data.message);
      fetchEnrollments();
      fetchCourses();
    } catch (err) {
      showToast(err.response?.data?.message || 'Enrollment failed.', 'error');
    }
  };

  // CRUD Handler: Update Progress (Update Enrollment)
  const handleUpdateProgress = async (enrollmentId, progressVal) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(`/api/enrollments/${enrollmentId}/progress`, { progress: progressVal }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast(res.data.message);
      fetchEnrollments();
    } catch (err) {
      showToast('Failed to update progress.', 'error');
    }
  };

  // CRUD Handler: Unenroll / Drop Course (Delete Enrollment)
  const handleUnenroll = async (enrollmentId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.delete(`/api/enrollments/${enrollmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast(res.data.message, 'info');
      fetchEnrollments();
      fetchCourses();
    } catch (err) {
      showToast('Failed to drop course.', 'error');
    }
  };

  // CRUD Handler: Create Course (Instructor/Admin Create)
  const handleAddCourse = async (newCourseData) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('/api/courses', newCourseData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast(res.data.message);
      fetchCourses();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create course.', 'error');
    }
  };

  // CRUD Handler: Edit Course (Instructor/Admin Update)
  const handleUpdateCourse = async (courseId, updatedData) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(`/api/courses/${courseId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast(res.data.message);
      fetchCourses();
    } catch (err) {
      showToast('Failed to update course.', 'error');
    }
  };

  // CRUD Handler: Delete Course (Instructor/Admin Delete)
  const handleDeleteCourse = async (courseId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.delete(`/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast(res.data.message, 'info');
      fetchCourses();
      fetchEnrollments();
    } catch (err) {
      showToast('Failed to delete course.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      
      {/* Navigation Bar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        onLogout={handleLogout}
        onOpenAddCourse={() => setIsAddCourseModalOpen(true)}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'overview' && (
          <OverviewTab
            user={user}
            enrollments={enrollments}
            courses={courses}
            onNavigateTab={setActiveTab}
            onSelectCourse={(c) => setSelectedCourseModal(c)}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogTab
            courses={courses}
            userEnrollments={enrollments}
            user={user}
            onSelectCourse={(c) => setSelectedCourseModal(c)}
            onEnroll={handleEnroll}
            onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
          />
        )}

        {activeTab === 'my-courses' && (
          <MyCoursesTab
            enrollments={enrollments}
            onUpdateProgress={handleUpdateProgress}
            onUnenroll={handleUnenroll}
            onSelectCourse={(c) => setSelectedCourseModal(c)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'manage' && (
          <ManageCoursesTab
            courses={courses}
            user={user}
            onOpenAddModal={() => setIsAddCourseModalOpen(true)}
            onOpenEditModal={(c) => setEditingCourseModal(c)}
            onDeleteCourse={handleDeleteCourse}
          />
        )}

        {activeTab === 'profile' && user && (
          <ProfileTab
            user={user}
            onUpdateUser={(updated) => {
              setUser(updated);
              localStorage.setItem('user', JSON.stringify(updated));
            }}
            onLogout={handleLogout}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">EduPortal</span>
            <span>• Powered by MongoDB & Express REST API</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>URI: <code className="text-indigo-400">mongodb://127.0.0.1:27017/course_enrollment_db</code></span>
            <span>Compass Verified</span>
          </div>
        </div>
      </footer>

      {/* Sleek Previous Style Auth Modal (Opens at starting if not logged in) */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        onAuthSuccess={handleAuthSuccess}
      />

      <CourseDetailModal
        course={selectedCourseModal}
        isOpen={!!selectedCourseModal}
        onClose={() => setSelectedCourseModal(null)}
        isEnrolled={selectedCourseModal ? enrollments.some(e => e.course?._id === selectedCourseModal._id) : false}
        onEnroll={handleEnroll}
        user={user}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
      />

      <AddCourseModal
        isOpen={isAddCourseModalOpen}
        onClose={() => setIsAddCourseModalOpen(false)}
        onAddCourse={handleAddCourse}
      />

      <EditCourseModal
        course={editingCourseModal}
        isOpen={!!editingCourseModal}
        onClose={() => setEditingCourseModal(null)}
        onUpdateCourse={handleUpdateCourse}
      />

      <ToastNotification toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
