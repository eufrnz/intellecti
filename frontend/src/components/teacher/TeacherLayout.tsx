import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, BookOpen, ClipboardList, Users, BarChart2,
  User, Bell, Search, X, Menu, Settings
} from 'lucide-react';
import type { NavigationProps, AppView } from '../../App';
import { TeacherDashboard } from './TeacherDashboard';
import { StudyPlans } from './StudyPlans';
import { Assignments } from './Assignments';
import { Students } from './Students';
import { Analytics } from './Analytics';
import { Profile } from '../shared/Profile';
import { AppShellNav, getCurrentUserIdentity } from '../shared/AppShellNav';
import { BRAND_NAME, GRADIENTS, THEME_COLORS } from '../../constants/theme';

const navItems = [
  { id: 'teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'teacher/study-plans', label: 'Study Plans', icon: BookOpen },
  { id: 'teacher/assignments', label: 'Assignments', icon: ClipboardList },
  { id: 'teacher/students', label: 'Students', icon: Users },
  { id: 'teacher/analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'teacher/profile', label: 'Profile', icon: User },
];

const bottomNavItems = [
  { id: 'teacher/dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'teacher/study-plans', label: 'Plans', icon: BookOpen },
  { id: 'teacher/assignments', label: 'Tasks', icon: ClipboardList },
  { id: 'teacher/students', label: 'Students', icon: Users },
  { id: 'teacher/profile', label: 'Profile', icon: User },
];

function renderContent(view: AppView, navigate: NavigationProps['navigate'], params?: Record<string, unknown>) {
  switch (view) {
    case 'teacher/dashboard': return <TeacherDashboard navigate={navigate} currentView={view} params={params} />;
    case 'teacher/study-plans': return <StudyPlans navigate={navigate} currentView={view} params={params} />;
    case 'teacher/create-plan': return <StudyPlans navigate={navigate} currentView={view} params={params} />;
    case 'teacher/assignments': return <Assignments navigate={navigate} currentView={view} params={params} />;
    case 'teacher/students': return <Students navigate={navigate} currentView={view} params={params} />;
    case 'teacher/analytics': return <Analytics navigate={navigate} currentView={view} params={params} />;
    case 'teacher/profile': return <Profile role="teacher" navigate={navigate} currentView={view} params={params} />;
    default: return <TeacherDashboard navigate={navigate} currentView={view} params={params} />;
  }
}

export function TeacherLayout({ currentView, navigate, params }: NavigationProps & { params?: Record<string, unknown> }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications] = useState(3);
  const { initials } = getCurrentUserIdentity();

  const activeItem = navItems.find(n => n.id === currentView || (currentView === 'teacher/create-plan' && n.id === 'teacher/study-plans'));

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: THEME_COLORS.surface }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 shadow-[2px_0_20px_rgba(0,0,0,0.04)] z-20">
        <AppShellNav
          items={navItems}
          currentView={currentView}
          onNavigate={navigate}
          title={BRAND_NAME}
          subtitle="Teacher Portal"
          accent={THEME_COLORS.blue}
          isActiveItem={(id, view) => view === id || (view === 'teacher/create-plan' && id === 'teacher/study-plans')}
        />
      </aside>

      {/* Mobile sidebar overlay */}
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
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background: GRADIENTS.brand}}>
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <span style={{fontWeight: 700, color: THEME_COLORS.text}}>{BRAND_NAME}</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-[#6B7280]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <AppShellNav
                  items={navItems}
                  currentView={currentView}
                  onNavigate={(view) => {
                    navigate(view);
                    setMobileMenuOpen(false);
                  }}
                  title=""
                  subtitle=""
                  accent="#1E88E5"
                  compact
                  isActiveItem={(id, view) => view === id || (view === 'teacher/create-plan' && id === 'teacher/study-plans')}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3.5 flex items-center gap-4 z-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
              <div className="relative max-w-xs hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color: THEME_COLORS.muted}} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-[#F8FAFC] border rounded-xl focus:outline-none transition-all"
                style={{ borderColor: THEME_COLORS.border, backgroundColor: THEME_COLORS.surface, color: THEME_COLORS.text }}
              />
            </div>
            <div className="sm:hidden">
              <h2 className="text-base" style={{fontWeight: 600, color: '#111827'}}>{activeItem?.label ?? 'Dashboard'}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F8FAFC] transition-colors text-[#6B7280]"
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{background: '#EF4444'}}/>
              )}
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F8FAFC] transition-colors text-[#6B7280]">
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('teacher/profile')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ml-1"
              style={{background: GRADIENTS.brand, fontWeight: 700}}
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

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-5 h-16">
          {bottomNavItems.map(({ id, label, icon: Icon }) => {
            const isActive = currentView === id || (currentView === 'teacher/create-plan' && id === 'teacher/study-plans');
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
