import { LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { THEME_COLORS } from '../../constants/theme';

export interface AppShellNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface AppShellNavProps {
  items: AppShellNavItem[];
  currentPath: string;
  onNavigate: (view: string) => void;
  onCloseMobile?: () => void;
  title: string;
  subtitle: string;
  accent: string;
  isActiveItem?: (id: string, currentPath: string) => boolean;
  compact?: boolean;
}

export function getCurrentUserIdentity() {
  const storedUsername = localStorage.getItem('username')?.trim();
  const rawRole = localStorage.getItem('role')?.toUpperCase() || '';

  const isTeacher = rawRole.includes('TEACHER');

  const displayName = storedUsername || (isTeacher ? 'Professor' : 'Estudante');
  
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'U';

  const roleLabel = isTeacher ? 'English Teacher' : 'English Student';

  return { displayName, initials, roleLabel };
}

export function AppShellNav({
  items,
  currentPath,
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
      return isActiveItem(id, currentPath);
    }
    return currentPath === id;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('jwt');
    localStorage.removeItem('accessToken');
    onNavigate('/login');
  };

  return (
    <div className="flex flex-col h-full">
      {!compact && (
        <div className="p-6" style={{ borderBottom: `1px solid ${THEME_COLORS.border}` }}>
          <div className="flex items-center gap-3">
            {/* Logo SVG */}
            <div className="w-10 h-10 ">
              <img src='/logo.svg' alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <div className="text-base font-bold truncate" style={{ color: THEME_COLORS.text }}>{title}</div>
              <div className="text-xs truncate" style={{ color: THEME_COLORS.muted }}>{subtitle}</div>
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
                onNavigate(id);
                onCloseMobile?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
              style={{
                background: active ? `${THEME_COLORS.blue}10` : 'transparent',
                color: active ? THEME_COLORS.blue : THEME_COLORS.muted,
              }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm" style={{ fontWeight: active ? 600 : 400 }}>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4" style={{ borderTop: `1px solid ${THEME_COLORS.border}` }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: THEME_COLORS.surface }}>
          {/* Avatar com as iniciais mantido para o usuário rodapé */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate" style={{ color: THEME_COLORS.text }}>{displayName}</div>
            <div className="text-xs truncate" style={{ color: THEME_COLORS.muted }}>{roleLabel}</div>
          </div>
          <button
            onClick={handleLogout}
            className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors p-1 flex-shrink-0"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}