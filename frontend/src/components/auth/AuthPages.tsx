import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, BookOpen, GraduationCap, Mail, Lock, User, ChevronRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useLogin } from '../../hooks/useLogin';
import { useRegisterStudent } from '../../hooks/useRegisterStudent';
import { useRegisterTeacher } from '../../hooks/useRegisterTeacher';
import type { NavigationProps } from '../../App';
import { BRAND_NAME, GRADIENTS, THEME_COLORS } from '../../constants/theme';

interface AuthPagesProps extends NavigationProps {
  setUserRole: (role: 'teacher' | 'student') => void;
}

function LoginIllustration() {
  return (
    <svg viewBox="0 0 480 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md">
      <rect width="480" height="400" rx="24" fill="url(#bg-grad)" />
      <defs>
        <linearGradient id="bg-grad" x1="0" y1="0" x2="480" y2="400" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E88E5" stopOpacity="0.15"/>
          <stop offset="1" stopColor="#42A5F5" stopOpacity="0.05"/>
        </linearGradient>
      </defs>
      {/* Floating cards */}
      <rect x="40" y="80" width="160" height="100" rx="16" fill="white" opacity="0.9" filter="url(#shadow)"/>
      <rect x="60" y="100" width="80" height="8" rx="4" fill="#1E88E5" opacity="0.3"/>
      <rect x="60" y="116" width="120" height="6" rx="3" fill="#6B7280" opacity="0.3"/>
      <rect x="60" y="130" width="100" height="6" rx="3" fill="#6B7280" opacity="0.2"/>
      <rect x="60" y="152" width="60" height="24" rx="12" fill="#1E88E5" opacity="0.8"/>
      {/* Book */}
      <rect x="280" y="60" width="160" height="120" rx="16" fill="white" opacity="0.9"/>
      <rect x="300" y="80" width="120" height="8" rx="4" fill="#FFC107" opacity="0.6"/>
      <rect x="300" y="96" width="100" height="6" rx="3" fill="#6B7280" opacity="0.3"/>
      <rect x="300" y="110" width="80" height="6" rx="3" fill="#6B7280" opacity="0.2"/>
      <rect x="300" y="124" width="110" height="6" rx="3" fill="#6B7280" opacity="0.2"/>
      <rect x="300" y="138" width="90" height="6" rx="3" fill="#6B7280" opacity="0.2"/>
      {/* Progress bar card */}
      <rect x="100" y="220" width="280" height="80" rx="16" fill="white" opacity="0.9"/>
      <rect x="120" y="240" width="80" height="6" rx="3" fill="#6B7280" opacity="0.3"/>
      <rect x="120" y="256" width="240" height="8" rx="4" fill="#E5E7EB"/>
      <rect x="120" y="256" width="180" height="8" rx="4" fill="#1E88E5"/>
      <rect x="120" y="276" width="60" height="6" rx="3" fill="#22C55E" opacity="0.6"/>
      {/* Stars */}
      <circle cx="60" cy="60" r="4" fill="#FFC107" opacity="0.6"/>
      <circle cx="420" cy="220" r="6" fill="#42A5F5" opacity="0.4"/>
      <circle cx="380" cy="320" r="4" fill="#FFC107" opacity="0.5"/>
      <circle cx="100" cy="340" r="5" fill="#1E88E5" opacity="0.3"/>
      {/* Large A letter */}
      <text x="200" y="200" fontSize="120" fontWeight="800" fill="#1E88E5" opacity="0.06" fontFamily="Inter">A</text>
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.1"/>
        </filter>
      </defs>
    </svg>
  );
}

export function AuthPages({ currentView, navigate, setUserRole }: AuthPagesProps) {
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigateToRoute = (path: string) => {
    if (path === '/student/home') {
      navigate('student/dashboard');
      return;
    }

    if (path === '/teacher/home') {
      navigate('teacher/dashboard');
      return;
    }

    if (path === '/') {
      navigate('login');
      return;
    }

    navigate('login');
  };

  const {
    formData: loginFormData,
    isLoading: loginIsLoading,
    handleChange: handleLoginChange,
    handleSubmit: handleLoginSubmit,
  } = useLogin(navigateToRoute);

  const {
    formData: studentFormData,
    isLoading: studentIsLoading,
    handleChange: handleStudentChange,
    handleSubmit: handleStudentSubmit,
  } = useRegisterStudent(navigateToRoute);

  const {
    formData: teacherFormData,
    isLoading: teacherIsLoading,
    handleChange: handleTeacherChange,
    handleSubmit: handleTeacherSubmit,
  } = useRegisterTeacher(navigateToRoute);

  const handleRoleSelect = (role: 'teacher' | 'student') => {
    setSelectedRole(role);
    setRegisterStep(2);
    setUserRole(role);
  };

  const handleLogin = (e: React.FormEvent) => {
    if (!loginFormData.username || !loginFormData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    void handleLoginSubmit(e);
  };

  const handleRegister = (e: React.FormEvent) => {
    if (!selectedRole) {
      toast.error('Please select a role first');
      return;
    }

    if (selectedRole === 'student') {
      const { firstName, lastName, username, email, password } = studentFormData;
      if (!firstName || !lastName || !username || !email || !password) {
        toast.error('Please fill in all fields');
        return;
      }

      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      void handleStudentSubmit(e);
      return;
    }

    const { username, email, password } = teacherFormData;
    if (!username || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    void handleTeacherSubmit(e);
  };

  const inputClass = 'w-full px-4 py-3 rounded-xl border placeholder:text-[#6C6C8C] focus:outline-none transition-all';

  if (currentView === 'login') {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: THEME_COLORS.surface }}>
        {/* Left illustration panel - desktop only */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden" style={{ background: GRADIENTS.brand }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white"/>
            <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-white"/>
            <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white"/>
          </div>
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-2xl" style={{fontWeight: 700}}>{BRAND_NAME}</span>
            </div>
            <LoginIllustration />
            <h2 className="text-white text-2xl mt-8 mb-3" style={{fontWeight: 700}}>Master English Together</h2>
            <p className="text-white/70 text-base max-w-xs mx-auto">Connect teachers and students in a modern, engaging learning experience.</p>
            <div className="flex items-center justify-center gap-6 mt-8">
              {[
                { label: '2,400+', sub: 'Students' },
                { label: '180+', sub: 'Teachers' },
                { label: '98%', sub: 'Satisfaction' },
              ].map(s => (
                <div key={s.sub} className="text-center">
                  <div className="text-white text-xl" style={{fontWeight: 700}}>{s.label}</div>
                  <div className="text-white/60 text-sm">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            {/* Mobile logo */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background: GRADIENTS.brand}}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl" style={{fontWeight: 700, color: THEME_COLORS.text}}>{BRAND_NAME}</span>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl mb-2" style={{fontWeight: 700, color: THEME_COLORS.text}}>Welcome back</h1>
              <p className="text-sm" style={{color: THEME_COLORS.muted}}>Sign in to continue your learning journey</p>
            </div>

            {/* Demo quick login buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => {
                  const demoUsername = 'teacher';
                  const demoPassword = 'password';
                  const syntheticEvent = { preventDefault: () => undefined } as React.FormEvent;
                  handleLoginChange({ target: { name: 'username', value: demoUsername } } as React.ChangeEvent<HTMLInputElement>);
                  handleLoginChange({ target: { name: 'password', value: demoPassword } } as React.ChangeEvent<HTMLInputElement>);
                  void handleLoginSubmit(syntheticEvent);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors text-sm"
                style={{fontWeight: 500, borderColor: `${THEME_COLORS.blue}33`, backgroundColor: `${THEME_COLORS.blue}10`, color: THEME_COLORS.blue}}
              >
                <GraduationCap className="w-4 h-4" />
                Teacher Demo
              </button>
              <button
                type="button"
                onClick={() => {
                  const demoUsername = 'student';
                  const demoPassword = 'password';
                  const syntheticEvent = { preventDefault: () => undefined } as React.FormEvent;
                  handleLoginChange({ target: { name: 'username', value: demoUsername } } as React.ChangeEvent<HTMLInputElement>);
                  handleLoginChange({ target: { name: 'password', value: demoPassword } } as React.ChangeEvent<HTMLInputElement>);
                  void handleLoginSubmit(syntheticEvent);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors text-sm"
                style={{fontWeight: 500, borderColor: `${THEME_COLORS.red}33`, backgroundColor: `${THEME_COLORS.red}15`, color: THEME_COLORS.red}}
              >
                <User className="w-4 h-4" />
                Student Demo
              </button>
            </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px" style={{backgroundColor: THEME_COLORS.border}}/>
                <span className="text-sm" style={{color: THEME_COLORS.muted}}>or sign in with email</span>
                <div className="flex-1 h-px" style={{backgroundColor: THEME_COLORS.border}}/>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm mb-1.5" style={{fontWeight: 500, color: '#374151'}}>Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{color: THEME_COLORS.muted}} />
                  <input
                    type="text"
                    name="username"
                    placeholder="your username"
                    value={loginFormData.username}
                    onChange={handleLoginChange}
                    className={inputClass + ' pl-10'}
                    style={{ backgroundColor: THEME_COLORS.surface, color: THEME_COLORS.text, borderColor: THEME_COLORS.border }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm" style={{fontWeight: 500, color: '#374151'}}>Password</label>
                  <button type="button" className="text-sm hover:underline" style={{fontWeight: 500, color: THEME_COLORS.blue}}>Forgot password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{color: THEME_COLORS.muted}} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    value={loginFormData.password}
                    onChange={handleLoginChange}
                    className={inputClass + ' pl-10 pr-10'}
                    style={{ backgroundColor: THEME_COLORS.surface, color: THEME_COLORS.text, borderColor: THEME_COLORS.border }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginIsLoading}
                className="w-full py-3.5 rounded-xl text-white transition-all hover:opacity-90 active:scale-[0.98] shadow-lg mt-2 disabled:cursor-not-allowed disabled:opacity-70"
                style={{background: GRADIENTS.brand, fontWeight: 600, boxShadow: `0 18px 32px ${THEME_COLORS.blue}20`}}
              >
                {loginIsLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{color: THEME_COLORS.muted}}>
              Don't have an account?{' '}
              <button
                onClick={() => navigate('register')}
                className="hover:underline"
                style={{fontWeight: 600}}
              >
                Create account
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Register page
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: THEME_COLORS.surface }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background: GRADIENTS.brand}}>
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl" style={{fontWeight: 700, color: THEME_COLORS.text}}>{BRAND_NAME}</span>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2].map(step => (
            <div key={step} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all"
                style={{
                  background: registerStep >= step ? 'linear-gradient(135deg, #1E88E5, #42A5F5)' : '#E5E7EB',
                  color: registerStep >= step ? 'white' : '#6B7280',
                  fontWeight: 600
                }}
              >
                {step}
              </div>
              {step === 1 && <div className="w-16 h-0.5 rounded" style={{background: registerStep === 2 ? '#1E88E5' : '#E5E7EB'}}/>}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {registerStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <h1 className="text-3xl mb-2" style={{fontWeight: 700, color: THEME_COLORS.text}}>Join {BRAND_NAME}</h1>
              <p className="text-sm mb-8" style={{color: THEME_COLORS.muted}}>Choose your role to get started</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                {[
                  {
                    role: 'teacher' as const,
                    icon: GraduationCap,
                    title: 'Teacher',
                    desc: 'Create study plans, manage students, track progress',
                    color: THEME_COLORS.blue,
                    bg: `${THEME_COLORS.blue}15`,
                    features: ['Create study plans', 'Assign lessons & quizzes', 'Track student progress', 'View analytics'],
                  },
                  {
                    role: 'student' as const,
                    icon: BookOpen,
                    title: 'Student',
                    desc: 'Access lessons, complete assignments, track your progress',
                    color: THEME_COLORS.blueDark,
                    bg: `${THEME_COLORS.blueDark}10`,
                    features: ['Access assignments', 'Complete lessons & quizzes', 'Track your progress', 'View grades'],
                  },
                ].map(({ role, icon: Icon, title, desc, color, bg, features }) => (
                  <button
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    className="p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] hover:shadow-lg group"
                    style={{
                      borderColor: selectedRole === role ? color : '#E5E7EB',
                      background: selectedRole === role ? bg : 'white',
                    }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{background: color + '20'}}>
                      <Icon className="w-6 h-6" style={{color}} />
                    </div>
                    <h3 className="text-lg mb-1" style={{fontWeight: 700, color: '#111827'}}>{title}</h3>
                    <p className="text-sm text-[#6B7280] mb-4">{desc}</p>
                    <ul className="space-y-1.5">
                      {features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm" style={{color: '#374151'}}>
                          <div className="w-1.5 h-1.5 rounded-full" style={{background: color}}/>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-1.5 mt-4" style={{color, fontWeight: 600}}>
                      <span className="text-sm">Get started</span>
                      <ChevronRight className="w-4 h-4"/>
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-center text-[#6B7280] text-sm mt-6">
                Already have an account?{' '}
                <button onClick={() => navigate('login')} className="text-[#1E88E5] hover:underline" style={{fontWeight: 600}}>Sign in</button>
              </p>
            </motion.div>
          )}

          {registerStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md mx-auto"
            >
              <button
                onClick={() => setRegisterStep(1)}
                className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] mb-6 text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4"/>
                Back to role selection
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{background: selectedRole === 'teacher' ? '#1E88E5' : '#42A5F5', opacity: 0.15 + 0.85}}
                >
                  {selectedRole === 'teacher'
                    ? <GraduationCap className="w-5 h-5 text-white"/>
                    : <BookOpen className="w-5 h-5 text-white"/>
                  }
                </div>
                <div>
                  <h1 className="text-xl" style={{fontWeight: 700, color: '#111827'}}>Create your account</h1>
                  <p className="text-sm text-[#6B7280]">Registering as a {selectedRole}</p>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {selectedRole === 'student' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1.5" style={{fontWeight: 500, color: '#374151'}}>First name</label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="John"
                        value={studentFormData.firstName}
                        onChange={handleStudentChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1.5" style={{fontWeight: 500, color: '#374151'}}>Last name</label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        value={studentFormData.lastName}
                        onChange={handleStudentChange}
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm mb-1.5" style={{fontWeight: 500, color: '#374151'}}>Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"/>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={selectedRole === 'student' ? studentFormData.email : teacherFormData.email}
                      onChange={selectedRole === 'student' ? handleStudentChange : handleTeacherChange}
                      className={inputClass + ' pl-10'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1.5" style={{fontWeight: 500, color: '#374151'}}>Username</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"/>
                    <input
                      type="text"
                      name="username"
                      placeholder="johndoe"
                      value={selectedRole === 'student' ? studentFormData.username : teacherFormData.username}
                      onChange={selectedRole === 'student' ? handleStudentChange : handleTeacherChange}
                      className={inputClass + ' pl-10'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1.5" style={{fontWeight: 500, color: '#374151'}}>Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"/>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Min. 8 characters"
                      value={selectedRole === 'student' ? studentFormData.password : teacherFormData.password}
                      onChange={selectedRole === 'student' ? handleStudentChange : handleTeacherChange}
                      className={inputClass + ' pl-10 pr-10'}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                      {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1.5" style={{fontWeight: 500, color: '#374151'}}>Confirm password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"/>
                    <input type={showConfirm ? 'text' : 'password'} placeholder="Repeat password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClass + ' pl-10 pr-10'}/>
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                      {showConfirm ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={selectedRole === 'student' ? studentIsLoading : teacherIsLoading}
                  className="w-full py-3.5 rounded-xl text-white transition-all hover:opacity-90 active:scale-[0.98] shadow-lg shadow-[#1E88E5]/20 mt-2 disabled:cursor-not-allowed disabled:opacity-70"
                  style={{background: 'linear-gradient(135deg, #1E88E5, #42A5F5)', fontWeight: 600}}
                >
                  {selectedRole === 'student' ? (studentIsLoading ? 'Creating account...' : 'Create Account') : (teacherIsLoading ? 'Creating account...' : 'Create Account')}
                </button>

                <p className="text-center text-[#6B7280] text-xs">
                  By creating an account you agree to our{' '}
                  <button type="button" className="text-[#1E88E5]">Terms</button> and{' '}
                  <button type="button" className="text-[#1E88E5]">Privacy Policy</button>
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
