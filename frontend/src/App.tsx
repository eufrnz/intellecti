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

const teacherViews = ['teacher/dashboard', 'teacher/study-plans', 'teacher/create-plan', 'teacher/assignments', 'teacher/students', 'teacher/analytics', 'teacher/profile'] as const;
const studentViews = ['student/dashboard', 'student/assignment', 'student/lesson', 'student/quiz', 'student/exercise', 'student/progress', 'student/grades', 'student/profile'] as const;

function getInitialView(): AppView {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role')?.toUpperCase();
  const savedView = localStorage.getItem('currentView') as AppView | null;

  if (!token || !role) {
    return 'login';
  }

  if (role.includes('TEACHER')) {
    return savedView && teacherViews.includes(savedView as any) ? savedView : 'teacher/dashboard';
  }

  if (role.includes('STUDENT')) {
    return savedView && studentViews.includes(savedView as any) ? savedView : 'student/dashboard';
  }

  return 'login';
}

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(getInitialView);
  const [userRole, setUserRole] = useState<'teacher' | 'student' | null>(() => {
    const role = localStorage.getItem('role')?.toUpperCase();
    if (role?.includes('TEACHER')) return 'teacher';
    if (role?.includes('STUDENT')) return 'student';
    return null;
  });
  const [navParams, setNavParams] = useState<Record<string, unknown>>({});

  const navigate = (view: AppView, params?: Record<string, unknown>) => {
    if (view === 'login' || view === 'register') {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      localStorage.removeItem('currentView');
      setUserRole(null);
    } else {
      localStorage.setItem('currentView', view);
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
