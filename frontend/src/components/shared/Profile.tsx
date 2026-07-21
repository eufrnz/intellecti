import { useEffect, useMemo, useState } from 'react';
import { Camera, Bell, Globe, Shield, LogOut, ChevronRight, Award, BookOpen, Edit2, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { NavigationProps } from '../../App';
import { BRAND_NAME, GRADIENTS, THEME_COLORS } from '../../constants/theme';
import { 
  fetchStudentMe, 
  fetchTeacherMe, 
  type StudentResponseGetAllDTO, 
  type TeacherResponseGetMeDTO 
} from '../../services/userService';

interface ProfileProps extends NavigationProps {
  role: 'teacher' | 'student';
}

const achievements = [
  { label: 'First Lesson', icon: '📚', earned: true },
  { label: '7-Day Streak', icon: '🔥', earned: true },
  { label: 'Quiz Master', icon: '🏆', earned: true },
  { label: '14-Day Streak', icon: '⚡', earned: true },
  { label: 'Perfect Score', icon: '⭐', earned: true },
  { label: 'Speed Reader', icon: '💨', earned: false },
];

const settingsGroups = [
  {
    title: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications', sub: 'Manage alerts', hasToggle: true, toggled: true },
      { icon: Globe, label: 'Language', sub: 'English (US)', hasArrow: true },
    ]
  },
  {
    title: 'Security',
    items: [
      { icon: Shield, label: 'Change Password', sub: 'Last changed 3 months ago', hasArrow: true },
    ]
  }
];

export function Profile({ role, navigate }: ProfileProps) {
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<StudentResponseGetAllDTO | null>(null);
  const [teacherData, setTeacherData] = useState<TeacherResponseGetMeDTO | null>(null);

  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('Business professional learning English for career advancement.');
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        if (role === 'teacher') {
          const data = await fetchTeacherMe();
          console.log('Teacher data:', data);
          setTeacherData(data);
        } else {
          const data = await fetchStudentMe();
          console.log('Student data:', data);
          setStudentData(data);
        }
      } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Erro ao carregar os dados do perfil.');
        }
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, [role]);

  const username = role === 'teacher' 
    ? teacherData?.username || '' 
    : studentData?.username || '';

  const email = role === 'teacher' 
    ? teacherData?.email || '' 
    : studentData?.email || '';

  const streak = studentData?.streak ?? 0;

  const displayRole = role === 'teacher' ? 'English Teacher' : 'English Student · B1 Level';
  const color = role === 'teacher' ? THEME_COLORS.blue : THEME_COLORS.blueDark;

  const initials = useMemo(() => {
    if (!username) return 'U';
    return username.substring(0, 2).toUpperCase();
  }, [username]);

  const handleSave = () => {
    setEditing(false);
    toast.success('Profile updated successfully!');
  };

  const stats = role === 'teacher' ? [
    { label: 'Students', value: '248', icon: '👥' },
    { label: 'Study Plans', value: '12', icon: '📚' },
    { label: 'Avg Grade', value: '84%', icon: '📊' },
  ] : [
    { label: 'Streak', value: `${streak}d`, icon: '🔥' },
    { label: 'Lessons Done', value: '28', icon: '📖' },
    { label: 'Points', value: '2,840', icon: '⭐' },
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-[#6B7280]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1E88E5]" />
        <p className="text-sm font-medium">Carregando seu perfil...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-5">
      {/* Profile header card */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
        <div className="h-24 relative" style={{ background: GRADIENTS.brand }}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-3 left-8 w-16 h-16 rounded-full bg-white"/>
            <div className="absolute top-1 right-12 w-24 h-24 rounded-full bg-white"/>
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-8 mb-4">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-2xl border-4 border-white flex items-center justify-center text-2xl text-white shadow-lg"
                style={{ background: color, fontWeight: 800 }}
              >
                {initials}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                <Camera className="w-3 h-3 text-[#6B7280]"/>
              </button>
            </div>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all"
              style={{
                borderColor: editing ? '#22C55E' : THEME_COLORS.border,
                background: editing ? '#F0FDF4' : THEME_COLORS.white,
                color: editing ? '#22C55E' : THEME_COLORS.muted,
                fontWeight: 500
              }}
            >
              {editing ? <><Check className="w-3.5 h-3.5"/> Save</> : <><Edit2 className="w-3.5 h-3.5"/> Edit</>}
            </button>
          </div>

          <h1 className="text-xl" style={{ fontWeight: 700, color: THEME_COLORS.text }}>{username}</h1>
          <p className="text-sm" style={{ color: THEME_COLORS.muted }}>@{username} · {displayRole}</p>

          {editing ? (
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              className="w-full mt-3 px-3 py-2 rounded-xl border bg-[#F8FAFC] focus:outline-none text-sm resize-none"
              style={{ color: THEME_COLORS.text, borderColor: THEME_COLORS.border, backgroundColor: THEME_COLORS.surface }}
            />
          ) : (
            <p className="text-sm mt-2" style={{ lineHeight: 1.6, color: THEME_COLORS.muted }}>{bio}</p>
          )}

          <div className="flex items-center gap-1.5 mt-2 text-xs text-[#9CA3AF]">
            <BookOpen className="w-3.5 h-3.5"/>
            <span>Member of {BRAND_NAME}</span>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-lg" style={{ fontWeight: 700, color: '#111827' }}>{stat.value}</div>
                <div className="text-xs text-[#6B7280]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
        <h2 className="text-base mb-4" style={{ fontWeight: 600, color: '#111827' }}>Personal Information</h2>
        <div className="space-y-3">
          {[
            { label: 'Username', value: `@${username}` },
            { label: 'Email', value: email },
            { label: 'Role', value: displayRole },
          ].map(field => (
            <div key={field.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <div>
                <div className="text-xs text-[#6B7280]" style={{ fontWeight: 500 }}>{field.label}</div>
                <div className="text-sm mt-0.5" style={{ fontWeight: 500, color: '#111827' }}>{field.value}</div>
              </div>
              {editing && (
                <button className="text-xs text-[#1E88E5]" style={{ fontWeight: 500 }}>Edit</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements (student only) */}
      {role === 'student' && (
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-[#FFC107]"/>
            <h2 className="text-base" style={{ fontWeight: 600, color: '#111827' }}>Achievements</h2>
            <span className="text-xs px-2 py-0.5 rounded-lg" style={{ background: '#FFFBEB', color: '#F59E0B', fontWeight: 600 }}>
              5/12 earned
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {achievements.map(ach => (
              <div
                key={ach.label}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl text-center"
                style={{ opacity: ach.earned ? 1 : 0.3 }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: ach.earned ? '#FFFBEB' : '#F3F4F6' }}>
                  {ach.icon}
                </div>
                <span className="text-[10px] text-center leading-tight" style={{ fontWeight: ach.earned ? 600 : 400, color: ach.earned ? '#111827' : '#9CA3AF' }}>
                  {ach.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
        <h2 className="text-base mb-4" style={{ fontWeight: 600, color: '#111827' }}>Settings</h2>
        <div className="space-y-5">
          {settingsGroups.map(group => (
            <div key={group.title}>
              <div className="text-xs text-[#9CA3AF] mb-2 px-1" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>
                {group.title.toUpperCase()}
              </div>
              <div className="space-y-1">
                {group.items.map(item => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F3F4F6' }}>
                      <item.icon className="w-4 h-4 text-[#6B7280]"/>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm" style={{ fontWeight: 500, color: '#111827' }}>{item.label}</div>
                      <div className="text-xs text-[#9CA3AF]">{item.sub}</div>
                    </div>
                    {'hasToggle' in item && item.hasToggle ? (
                      <button
                        onClick={() => setNotifications(!notifications)}
                        className="w-11 h-6 rounded-full relative transition-all flex-shrink-0"
                        style={{ background: notifications ? '#1E88E5' : '#E5E7EB' }}
                      >
                        <div
                          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all"
                          style={{ left: notifications ? '24px' : '4px' }}
                        />
                      </button>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#9CA3AF] flex-shrink-0"/>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('role');
          navigate('login');
        }}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 text-sm hover:bg-[#FEF2F2] hover:border-[#EF4444] hover:text-[#EF4444] transition-all"
        style={{ fontWeight: 500, color: '#6B7280' }}
      >
        <LogOut className="w-4 h-4"/>
        Sign Out
      </button>
    </div>
  );
}