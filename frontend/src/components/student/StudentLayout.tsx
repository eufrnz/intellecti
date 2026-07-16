import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, ClipboardList, TrendingUp, User, BookOpen, Bell, Search, X, Menu, BarChart2 } from 'lucide-react';
import type { NavigationProps, AppView } from '../../App';
import { StudentDashboard } from './StudentDashboard';
import { AssignmentScreen } from './AssignmentScreen';
import { ProgressScreen } from './ProgressScreen';
import { Profile } from '../shared/Profile';
import { AppShellNav, getCurrentUserIdentity } from '../shared/AppShellNav';
import { BRAND_NAME, GRADIENTS, THEME_COLORS } from '../../constants/theme';

const bottomNavItems = [
  { id: 'student/dashboard', label: 'Home', icon: Home },
  { id: 'student/assignment', label: 'Assignments', icon: ClipboardList },
  { id: 'student/progress', label: 'Progress', icon: TrendingUp },
  { id: 'student/profile', label: 'Profile', icon: User },
];

const sideNavItems = [
  { id: 'student/dashboard', label: 'Dashboard', icon: Home },
  { id: 'student/assignment', label: 'My Assignments', icon: ClipboardList },
  { id: 'student/progress', label: 'Progress', icon: TrendingUp },
  { id: 'student/grades', label: 'Grades', icon: BarChart2 },
  { id: 'student/profile', label: 'Profile', icon: User },
];

function renderContent(view: AppView, navigate: NavigationProps['navigate'], params?: Record<string, unknown>) {
  switch (view) {
    case 'student/dashboard': return <StudentDashboard navigate={navigate} currentView={view} params={params} />;
    case 'student/assignment': return <AssignmentScreen navigate={navigate} currentView={view} params={params} />;
    case 'student/lesson': return <AssignmentScreen navigate={navigate} currentView={view} params={params} />;
    case 'student/quiz': return <AssignmentScreen navigate={navigate} currentView={view} params={params} />;
    case 'student/exercise': return <AssignmentScreen navigate={navigate} currentView={view} params={params} />;
    case 'student/progress': return <ProgressScreen navigate={navigate} currentView={view} params={params} />;
    case 'student/grades': return <ProgressScreen navigate={navigate} currentView={view} params={params} />;
    case 'student/profile': return <Profile role="student" navigate={navigate} currentView={view} params={params} />;
    default: return <StudentDashboard navigate={navigate} currentView={view} params={params} />;
  }
}

export function StudentLayout({ currentView, navigate, params }: NavigationProps & { params?: Record<string, unknown> }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { initials } = getCurrentUserIdentity();

  const isLearnMode = ['student/lesson', 'student/quiz', 'student/exercise'].includes(currentView);

  // Full-screen for learning experiences (lesson/quiz/exercise)
  if (isLearnMode) {
    return (
      <div className="h-screen bg-[#F8FAFC] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderContent(currentView, navigate, params)}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex h-screen" style={{ background: THEME_COLORS.surface }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 shadow-[2px_0_20px_rgba(0,0,0,0.04)] z-20">
        <AppShellNav
          items={sideNavItems}
          currentView={currentView}
          onNavigate={navigate}
          title={BRAND_NAME}
          subtitle="Student Portal"
          accent={THEME_COLORS.blue}
          isActiveItem={(id, view) => view === id ||
            (view === 'student/grades' && id === 'student/progress') ||
            (['student/lesson', 'student/quiz', 'student/exercise'].includes(view) && id === 'student/assignment')}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 z-30"
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-40 shadow-2xl flex flex-col"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background: GRADIENTS.brand}}>
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <span style={{fontWeight: 700, color: THEME_COLORS.text}}>{BRAND_NAME}</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-[#6B7280]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {sideNavItems.map(({ id, label, icon: Icon }) => {
                  const isActive = currentView === id;
                  return (
                    <button
                      key={id}
                      onClick={() => { navigate(id as AppView); setMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                      style={{
                        background: isActive ? '#EFF6FF' : 'transparent',
                        color: isActive ? '#1E88E5' : '#6B7280',
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm" style={{fontWeight: isActive ? 600 : 400}}>{label}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-gray-100">
                <div className="flex-1 overflow-hidden">
                  <AppShellNav
                    items={sideNavItems}
                    currentView={currentView}
                    onNavigate={(view) => {
                      navigate(view);
                      setMobileMenuOpen(false);
                    }}
                    title=""
                    subtitle=""
                    accent="#42A5F5"
                    compact
                    isActiveItem={(id, view) => view === id ||
                      (view === 'student/grades' && id === 'student/progress') ||
                      (['student/lesson', 'student/quiz', 'student/exercise'].includes(view) && id === 'student/assignment')}
                  />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3.5 flex items-center gap-4 z-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-[#6B7280]">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="relative max-w-xs hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color: THEME_COLORS.muted}} />
                <input
                  type="text"
                  placeholder="Search lessons..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl focus:outline-none transition-all"
                  style={{ borderColor: THEME_COLORS.border, backgroundColor: THEME_COLORS.surface, color: THEME_COLORS.text }}
                />
            </div>
            <div className="sm:hidden">
              <div className="text-sm" style={{fontWeight: 600, color: '#111827'}}>
                {currentView === 'student/dashboard' ? 'My Dashboard'
                  : currentView === 'student/assignment' ? 'Assignments'
                  : currentView === 'student/progress' ? 'Progress'
                  : 'Profile'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F8FAFC]" style={{color: THEME_COLORS.muted}}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{background: THEME_COLORS.red}}/>
            </button>
            <button
              onClick={() => navigate('student/profile')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ml-1"
              style={{background: 'linear-gradient(135deg, #42A5F5, #1E88E5)', fontWeight: 700}}
            >
              {initials}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderContent(currentView, navigate, params)}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-4 h-16">
          {bottomNavItems.map(({ id, label, icon: Icon }) => {
            const isActive = currentView === id ||
              (['student/lesson', 'student/quiz', 'student/exercise'].includes(currentView) && id === 'student/assignment') ||
              (currentView === 'student/grades' && id === 'student/progress');
            return (
              <button
                key={id}
                onClick={() => navigate(id as AppView)}
                className="flex flex-col items-center justify-center gap-0.5 transition-all"
                style={{ color: isActive ? '#1E88E5' : '#9CA3AF' }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]" style={{fontWeight: isActive ? 600 : 400}}>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
