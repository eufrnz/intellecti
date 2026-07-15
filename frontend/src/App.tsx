import { useState } from 'react';
import { Toaster } from 'sonner';
import { AuthPages } from './components/auth/AuthPages';
import { TeacherLayout } from './components/teacher/TeacherLayout';
import { StudentLayout } from './components/student/StudentLayout';

export type AppView =
  | 'login' | 'register'
  | 'teacher/dashboard' | 'teacher/study-plans' | 'teacher/create-plan'
  | 'teacher/assignments' | 'teacher/students' | 'teacher/analytics' | 'teacher/profile'
  | 'student/dashboard' | 'student/assignment' | 'student/lesson' | 'student/quiz'
  | 'student/exercise' | 'student/progress' | 'student/grades' | 'student/profile';

export interface NavigationProps {
  navigate: (view: AppView, params?: Record<string, unknown>) => void;
  currentView: AppView;
  params?: Record<string, unknown>;
}

import { AUTH_ROLES, DEFAULT_VIEWS, LOCAL_STORAGE_KEYS, PUBLIC_VIEWS, VIEW_GROUPS, isStudentRole, isTeacherRole, normalizeRole } from './constants/auth';

function getInitialView(): AppView {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  const role = normalizeRole(localStorage.getItem(LOCAL_STORAGE_KEYS.ROLE));
  const savedView = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_VIEW) as AppView | null;

  if (!token || !role) {
    return PUBLIC_VIEWS.LOGIN;
  }

  if (isTeacherRole(role)) {
    return savedView && VIEW_GROUPS.TEACHER_VIEWS.includes(savedView as any)
      ? savedView
      : DEFAULT_VIEWS.TEACHER;
  }

  if (isStudentRole(role)) {
    return savedView && VIEW_GROUPS.STUDENT_VIEWS.includes(savedView as any)
      ? savedView
      : DEFAULT_VIEWS.STUDENT;
  }

  return PUBLIC_VIEWS.LOGIN;
}

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(getInitialView);
  const [userRole, setUserRole] = useState<'teacher' | 'student' | null>(() => {
    const role = normalizeRole(localStorage.getItem(LOCAL_STORAGE_KEYS.ROLE));
    if (isTeacherRole(role)) return 'teacher';
    if (isStudentRole(role)) return 'student';
    return null;
  });
  const [navParams, setNavParams] = useState<Record<string, unknown>>({});

  const navigate = (view: AppView, params?: Record<string, unknown>) => {
    if (view === PUBLIC_VIEWS.LOGIN || view === PUBLIC_VIEWS.REGISTER) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USERNAME);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ROLE);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_VIEW);
      setUserRole(null);
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_VIEW, view);
    }

    setCurrentView(view);
    setNavParams(params ?? {});
  };

  if (currentView === 'login' || currentView === 'register') {
    return (
      <>
        <AuthPages
          currentView={currentView}
          navigate={navigate}
          setUserRole={setUserRole}
        />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  if (currentView.startsWith('teacher/')) {
    return (
      <>
        <TeacherLayout currentView={currentView} navigate={navigate} params={navParams} />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  if (currentView.startsWith('student/')) {
    return (
      <>
        <StudentLayout currentView={currentView} navigate={navigate} params={navParams} />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return null;
}
