export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USERNAME: 'username',
  ROLE: 'role',
  CURRENT_VIEW: 'currentView',
} as const;

export const AUTH_ROLES = {
  TEACHER: 'ROLE_TEACHER',
  STUDENT: 'ROLE_STUDENT',
} as const;

export const DEFAULT_VIEWS = {
  TEACHER: 'teacher/dashboard',
  STUDENT: 'student/dashboard',
} as const;

export const PUBLIC_VIEWS = {
  LOGIN: 'login',
  REGISTER: 'register',
} as const;

export const VIEW_GROUPS = {
  TEACHER_VIEWS: [
    'teacher/dashboard',
    'teacher/study-plans',
    'teacher/create-plan',
    'teacher/assignments',
    'teacher/students',
    'teacher/analytics',
    'teacher/profile',
  ] as const,
  STUDENT_VIEWS: [
    'student/dashboard',
    'student/assignment',
    'student/lesson',
    'student/quiz',
    'student/exercise',
    'student/progress',
    'student/grades',
    'student/profile',
  ] as const,
} as const;

export function isTeacherRole(role?: string) {
  return role?.includes('TEACHER') ?? false;
}

export function isStudentRole(role?: string) {
  return role?.includes('STUDENT') ?? false;
}

export function normalizeRole(role?: string) {
  if (!role) return undefined;
  if (isTeacherRole(role)) return AUTH_ROLES.TEACHER;
  if (isStudentRole(role)) return AUTH_ROLES.STUDENT;
  return role;
}
