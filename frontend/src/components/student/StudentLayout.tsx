import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, ClipboardList, TrendingUp, User, BookOpen, Bell, Search, X, Menu, BarChart2 } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppShellNav, getCurrentUserIdentity } from '../shared/AppShellNav';
import { BRAND_NAME, GRADIENTS, THEME_COLORS } from '../../constants/theme';

const sideNavItems = [
  { id: '/student/dashboard', label: 'Dashboard', icon: Home },
  { id: '/student/assignment', label: 'My Assignments', icon: ClipboardList },
  { id: '/student/progress', label: 'Progress', icon: TrendingUp },
  { id: '/student/grades', label: 'Grades', icon: BarChart2 },
  { id: '/student/profile', label: 'Profile', icon: User },
];

function getPageTitle(path: string) {
  if (path.startsWith('/student/assignment')) return 'Assignments';
  if (path === '/student/dashboard') return 'My Dashboard';
  if (path === '/student/progress') return 'Progress';
  if (path === '/student/grades') return 'Grades';
  if (path === '/student/profile') return 'Profile';
  return 'Student Portal';
}

export function StudentLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { initials } = getCurrentUserIdentity();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isLearnMode = ['/student/lesson', '/student/quiz', '/student/exercise'].some((route) => currentPath.startsWith(route));

  if (isLearnMode) {
    return (
      <div className="h-screen bg-[#F8FAFC] overflow-hidden">
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
      </div>
    );
  }

  return (
    <div className="flex h-screen" style={{ background: THEME_COLORS.surface }}>
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 shadow-[2px_0_20px_rgba(0,0,0,0.04)] z-20">
        <AppShellNav
          items={sideNavItems}
          currentPath={currentPath}
          onNavigate={navigate}
          title={BRAND_NAME}
          subtitle="Student Portal"
          accent={THEME_COLORS.blue}
          isActiveItem={(id, path) =>
            path === id ||
            (path === '/student/grades' && id === '/student/progress') ||
            (path.startsWith('/student/assignment') && id === '/student/assignment')
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
              <nav className="flex-1 p-4 space-y-1">
                {sideNavItems.map(({ id, label, icon: Icon }) => {
                  const isActive = currentPath === id || (currentPath.startsWith('/student/assignment') && id === '/student/assignment');
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        navigate(id);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                      style={{
                        background: isActive ? '#EFF6FF' : 'transparent',
                        color: isActive ? '#1E88E5' : '#6B7280',
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm" style={{ fontWeight: isActive ? 600 : 400 }}>{label}</span>
                    </button>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3.5 flex items-center gap-4 z-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-[#6B7280]">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="relative max-w-xs hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: THEME_COLORS.muted }} />
              <input
                type="text"
                placeholder="Search lessons..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl focus:outline-none transition-all"
                style={{ borderColor: THEME_COLORS.border, backgroundColor: THEME_COLORS.surface, color: THEME_COLORS.text }}
              />
            </div>
            <div className="sm:hidden">
              <div className="text-sm" style={{ fontWeight: 600, color: '#111827' }}>
                {getPageTitle(currentPath)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F8FAFC]" style={{ color: THEME_COLORS.muted }}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: THEME_COLORS.red }} />
            </button>
            <button
              onClick={() => navigate('/student/profile')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ml-1"
              style={{ background: 'linear-gradient(135deg, #42A5F5, #1E88E5)', fontWeight: 700 }}
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