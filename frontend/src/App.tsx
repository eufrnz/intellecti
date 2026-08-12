import { useState, type ReactNode } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { AuthPages } from './components/auth/AuthPages';
import { StudentLayout } from './components/student/StudentLayout';
import { TeacherLayout } from './components/teacher/TeacherLayout';
import { StudentDashboard } from './components/student/StudentDashboard';
import { AssignmentScreen } from './components/student/AssignmentScreen';
import { OpenedAssignmentScreen } from './components/student/OpenedAssignmentScreen';
import { ProgressScreen } from './components/student/ProgressScreen';
import { Profile } from './components/shared/Profile';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { StudyPlans } from './components/teacher/StudyPlans';
import { Assignments } from './components/teacher/Assignments';
import { Students } from './components/teacher/Students';
import { Analytics } from './components/teacher/Analytics';
import { AUTH_ROLES, LOCAL_STORAGE_KEYS } from './constants/auth';

export type AppView =
  | 'login' | 'register'
  | 'teacher/dashboard' | 'teacher/study-plans' | 'teacher/create-plan'
  | 'teacher/assignments' | 'teacher/students' | 'teacher/analytics' | 'teacher/profile'
  | 'student/dashboard' | 'student/assignment' | `student/assignment/${string}` | 'student/lesson' | 'student/quiz'
  | 'student/exercise' | 'student/progress' | 'student/grades' | 'student/profile';

export interface NavigationProps {
  navigate: (view: AppView, params?: Record<string, unknown>) => void;
  currentView: AppView;
  params?: Record<string, unknown>;
}

function toRoute(view: AppView, params?: Record<string, unknown>) {
  switch (view) {
    case 'login':
      return '/login';
    case 'register':
      return '/register';
    case 'teacher/dashboard':
      return '/teacher/dashboard';
    case 'teacher/study-plans':
      return '/teacher/study-plans';
    case 'teacher/create-plan':
      return '/teacher/create-plan';
    case 'teacher/assignments':
      return '/teacher/assignments';
    case 'teacher/students':
      return '/teacher/students';
    case 'teacher/analytics':
      return '/teacher/analytics';
    case 'teacher/profile':
      return '/teacher/profile';
    case 'student/dashboard':
      return '/student/dashboard';
    case 'student/assignment':
      return params?.assignmentId ? `/student/assignment/${params.assignmentId}` : '/student/assignment';
    case 'student/progress':
      return '/student/progress';
    case 'student/grades':
      return '/student/grades';
    case 'student/profile':
      return '/student/profile';
    case 'student/lesson':
      return '/student/lesson';
    case 'student/quiz':
      return '/student/quiz';
    case 'student/exercise':
      return '/student/exercise';
    default:
      if (view.startsWith('student/assignment/')) {
        return `/${view}`;
      }
      return '/login';
  }
}

function ProtectedRoute({ allowedRoles, children }: { allowedRoles: string[]; children: ReactNode }) {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  const role = localStorage.getItem(LOCAL_STORAGE_KEYS.ROLE);

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function OpenedAssignmentRoute({ navigate }: { navigate: (view: AppView, params?: Record<string, unknown>) => void }) {
  const params = useParams<{ assignmentId: string }>();
  const assignmentId = params.assignmentId ?? '';
  return (
    <OpenedAssignmentScreen
      navigate={navigate}
      currentView={`student/assignment/${assignmentId}` as AppView}
      params={{ assignmentId }}
      assignmentId={assignmentId}
    />
  );
}

export default function App() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<'teacher' | 'student' | null>(null);

  const routerNavigate: NavigationProps['navigate'] = (view, params) => {
    if (view === 'login') {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USERNAME);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ROLE);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_VIEW);
      navigate('/login');
      return;
    }

    const path = toRoute(view, params);
    navigate(path);
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AuthPages currentView="login" navigate={routerNavigate} setUserRole={setUserRole} />} />
      <Route path="/register" element={<AuthPages currentView="register" navigate={routerNavigate} setUserRole={setUserRole} />} />

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={[AUTH_ROLES.STUDENT]}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard navigate={routerNavigate} currentView="student/dashboard" />} />
        <Route path="assignment" element={<AssignmentScreen navigate={routerNavigate} currentView="student/assignment" />} />
        <Route path="assignment/:assignmentId" element={<OpenedAssignmentRoute navigate={routerNavigate} />} />
        <Route path="lesson" element={<AssignmentScreen navigate={routerNavigate} currentView="student/lesson" />} />
        <Route path="quiz" element={<AssignmentScreen navigate={routerNavigate} currentView="student/quiz" />} />
        <Route path="exercise" element={<AssignmentScreen navigate={routerNavigate} currentView="student/exercise" />} />
        <Route path="progress" element={<ProgressScreen navigate={routerNavigate} currentView="student/progress" />} />
        <Route path="grades" element={<ProgressScreen navigate={routerNavigate} currentView="student/grades" />} />
        <Route path="profile" element={<Profile role="student" navigate={routerNavigate} currentView="student/profile" />} />
      </Route>

      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={[AUTH_ROLES.TEACHER]}>
            <TeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard navigate={routerNavigate} currentView="teacher/dashboard" />} />
        <Route path="study-plans" element={<StudyPlans navigate={routerNavigate} currentView="teacher/study-plans" />} />
        <Route path="create-plan" element={<StudyPlans navigate={routerNavigate} currentView="teacher/create-plan" />} />
        <Route path="assignments" element={<Assignments navigate={routerNavigate} currentView="teacher/assignments" />} />
        <Route path="students" element={<Students navigate={routerNavigate} currentView="teacher/students" />} />
        <Route path="students/:studentId" element={<Students navigate={routerNavigate} currentView="teacher/students" />} />
        <Route path="analytics" element={<Analytics navigate={routerNavigate} currentView="teacher/analytics" />} />
        <Route path="profile" element={<Profile role="teacher" navigate={routerNavigate} currentView="teacher/profile" />} />
      </Route>

      <Route path="/student/home" element={<Navigate to="/student/dashboard" replace />} />
      <Route path="/teacher/home" element={<Navigate to="/teacher/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
