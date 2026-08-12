import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, BookOpen, ClipboardList, Users, BarChart2,
  User, Bell, Search, X, Menu, Settings
} from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppShellNav, getCurrentUserIdentity } from '../shared/AppShellNav';
import { BRAND_NAME, GRADIENTS, THEME_COLORS } from '../../constants/theme';

const navItems = [
  { id: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: '/teacher/study-plans', label: 'Study Plans', icon: BookOpen },
  { id: '/teacher/assignments', label: 'Assignments', icon: ClipboardList },
  { id: '/teacher/students', label: 'Students', icon: Users },
  { id: '/teacher/analytics', label: 'Analytics', icon: BarChart2 },
  { id: '/teacher/profile', label: 'Profile', icon: User },
];

function getPageTitle(path: string) {
  if (path.startsWith('/teacher/study-plans')) return 'Study Plans';
  if (path === '/teacher/dashboard') return 'Dashboard';
  if (path === '/teacher/assignments') return 'Assignments';
  if (path === '/teacher/students') return 'Students';
  if (path === '/teacher/analytics') return 'Analytics';
  if (path === '/teacher/profile') return 'Profile';
  return 'Teacher Portal';
}

export function TeacherLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications] = useState(3);
  const { initials } = getCurrentUserIdentity();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: THEME_COLORS.surface }}>
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 shadow-[2px_0_20px_rgba(0,0,0,0.04)] z-20">
        <AppShellNav
          items={navItems}
          currentPath={currentPath}
          onNavigate={navigate}
          title={BRAND_NAME}
          subtitle="Teacher Portal"
          accent={THEME_COLORS.blue}
          isActiveItem={(id, path) =>
            path === id ||
            (path === '/teacher/create-plan' && id === '/teacher/study-plans') ||
            (id === '/teacher/students' && path.startsWith('/teacher/students'))
          }
        />
      </aside>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 z-30"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-40 shadow-2xl flex flex-col"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: GRADIENTS.brand }}>
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <span style={{ fontWeight: 700, color: THEME_COLORS.text }}>{BRAND_NAME}</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-[#6B7280]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <AppShellNav
                  items={navItems}
                  currentPath={currentPath}
                  onNavigate={(view) => {
                    navigate(view);
                    setMobileMenuOpen(false);
                  }}
                  title=""
                  subtitle=""
                  accent="#1E88E5"
                  compact
                  isActiveItem={(id, path) => path === id || (path === '/teacher/create-plan' && id === '/teacher/study-plans')}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3.5 flex items-center gap-4 z-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <div className="relative max-w-xs hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: THEME_COLORS.muted }} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-[#F8FAFC] border rounded-xl focus:outline-none transition-all"
                style={{ borderColor: THEME_COLORS.border, backgroundColor: THEME_COLORS.surface, color: THEME_COLORS.text }}
              />
            </div>
            <div className="sm:hidden">
              <h2 className="text-base" style={{ fontWeight: 600, color: '#111827' }}>{getPageTitle(currentPath)}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F8FAFC] transition-colors text-[#6B7280]">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#EF4444' }} />
              )}
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F8FAFC] transition-colors text-[#6B7280]">
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/teacher/profile')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ml-1"
              style={{ background: GRADIENTS.brand, fontWeight: 700 }}
            >
              {initials}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPath}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
