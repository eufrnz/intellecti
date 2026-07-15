import { LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AppView } from '../../App';

export interface AppShellNavItem {
  id: AppView | string;
  label: string;
  icon: LucideIcon;
}

interface AppShellNavProps {
  items: AppShellNavItem[];
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onCloseMobile?: () => void;
  title: string;
  subtitle: string;
  accent: string;
  isActiveItem?: (id: string, currentView: AppView) => boolean;
  compact?: boolean;
}

export function getCurrentUserIdentity() {
  const storedUsername = localStorage.getItem('username')?.trim();
  const storedRole = localStorage.getItem('role')?.toUpperCase() || '';

  const displayName = storedUsername || (storedRole.includes('TEACHER') ? 'Professor' : 'Estudante');
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'U';

  const roleLabel = storedRole.includes('TEACHER') ? 'English Teacher' : 'English Student';

  return { displayName, initials, roleLabel };
}

export function AppShellNav({
  items,
  currentView,
  onNavigate,
  onCloseMobile,
  title,
  subtitle,
  accent,
  isActiveItem,
  compact = false,
}: AppShellNavProps) {
  const { displayName, initials, roleLabel } = getCurrentUserIdentity();

  const isActive = (id: string) => {
    if (isActiveItem) {
      return isActiveItem(id, currentView);
    }

    return currentView === id;
  };

  return (
    <div className="flex flex-col h-full">
      {!compact && (
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}
            >
              <span className="text-white text-sm font-semibold">{initials}</span>
            </div>
            <div>
              <div className="text-base" style={{ fontWeight: 700, color: '#111827' }}>{title}</div>
              <div className="text-xs text-[#6B7280]">{subtitle}</div>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-1">
        {items.map(({ id, label, icon: Icon }) => {
          const active = isActive(String(id));
          return (
            <button
              key={String(id)}
              onClick={() => {
                onNavigate(id as AppView);
                onCloseMobile?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
              style={{
                background: active ? 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' : 'transparent',
                color: active ? '#1E88E5' : '#6B7280',
              }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm" style={{ fontWeight: active ? 600 : 400 }}>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#F8FAFC]">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, fontWeight: 700 }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm truncate" style={{ fontWeight: 600, color: '#111827' }}>{displayName}</div>
            <div className="text-xs text-[#6B7280] truncate">{roleLabel}</div>
          </div>
          <button
            onClick={() => onNavigate('login')}
            className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
