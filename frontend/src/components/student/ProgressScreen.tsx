import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle, Clock, Star, TrendingUp, Award, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import type { NavigationProps } from '../../App';

const weeklyData = [
  { day: 'Mon', lessons: 3, time: 42 }, { day: 'Tue', lessons: 5, time: 68 },
  { day: 'Wed', lessons: 2, time: 28 }, { day: 'Thu', lessons: 4, time: 55 },
  { day: 'Fri', lessons: 6, time: 80 }, { day: 'Sat', lessons: 1, time: 15 },
  { day: 'Sun', lessons: 0, time: 0 },
];

const gradeHistory = [
  { week: 'W1', grade: 72 }, { week: 'W2', grade: 75 }, { week: 'W3', grade: 80 },
  { week: 'W4', grade: 82 }, { week: 'W5', grade: 85 }, { week: 'W6', grade: 88 },
  { week: 'W7', grade: 91 }, { week: 'W8', grade: 95 },
];

const assignments = [
  { id: 1, name: 'Grammar Fundamentals', grade: 'A+', score: 98, completion: 100, date: 'Jul 5, 2026', feedback: 'Outstanding work! Perfect grammar usage.' },
  { id: 2, name: 'Business Vocabulary', grade: 'A', score: 92, completion: 100, date: 'Jun 25, 2026', feedback: 'Excellent vocabulary range. Keep it up!' },
  { id: 3, name: 'Reading Comprehension', grade: 'B+', score: 87, completion: 100, date: 'Jun 15, 2026', feedback: 'Good analysis. Work on inference skills.' },
  { id: 4, name: 'Email Writing', grade: 'A', score: 91, completion: 100, date: 'Jun 5, 2026', feedback: 'Professional tone and structure. Well done!' },
  { id: 5, name: 'Grammar Fundamentals', grade: 'B', score: 82, completion: 100, date: 'May 25, 2026', feedback: 'Good foundation. Focus on conditionals.' },
];

const activityGrid = Array.from({ length: 70 }, (_, i) => ({
  active: Math.random() > 0.35,
  intensity: Math.floor(Math.random() * 4) + 1,
}));

function CircularProgress({ percent, size = 100, strokeWidth = 9 }: { percent: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#E5E7EB" strokeWidth={strokeWidth}/>
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke="url(#circGrad)" strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="circGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E88E5"/>
            <stop offset="100%" stopColor="#42A5F5"/>
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl" style={{fontWeight: 800, color: '#111827'}}>{percent}%</span>
        <span className="text-[10px] text-[#6B7280]">Complete</span>
      </div>
    </div>
  );
}

export function ProgressScreen({ currentView, navigate }: NavigationProps) {
  const [activeTab, setActiveTab] = useState<'progress' | 'grades'>(currentView === 'student/grades' ? 'grades' : 'progress');

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl" style={{fontWeight: 700, color: '#111827'}}>My Progress</h1>
          <p className="text-[#6B7280] text-sm mt-0.5">Track your learning journey and achievements</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {([['progress', TrendingUp], ['grades', BarChart2]] as const).map(([tab, Icon]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm capitalize transition-all"
            style={{
              background: activeTab === tab ? 'white' : 'transparent',
              color: activeTab === tab ? '#111827' : '#6B7280',
              fontWeight: activeTab === tab ? 600 : 400,
              boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <Icon className="w-4 h-4"/>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'progress' && (
          <motion.div key="progress" initial={{opacity:0}} animate={{opacity:1}} className="space-y-5">
            {/* Overview row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Big progress card */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50 flex items-center gap-5">
                <CircularProgress percent={72} size={100}/>
                <div>
                  <h3 className="text-base mb-2" style={{fontWeight: 700, color: '#111827'}}>Overall Progress</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-[#22C55E]">
                      <CheckCircle className="w-4 h-4"/>
                      <span>28 lessons completed</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#F59E0B]">
                      <Clock className="w-4 h-4"/>
                      <span>11 lessons remaining</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#1E88E5]">
                      <TrendingUp className="w-4 h-4"/>
                      <span>+8% this week</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Star, label: 'Total Points', value: '2,840', color: '#FFC107', bg: '#FFFBEB' },
                  { icon: Award, label: 'Achievements', value: '12', color: '#8B5CF6', bg: '#F5F3FF' },
                  { icon: BookOpen, label: 'Study Hours', value: '48h', color: '#1E88E5', bg: '#EFF6FF' },
                  { icon: TrendingUp, label: 'Streak', value: '14d', color: '#EF4444', bg: '#FEF2F2' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50 text-center">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{background: stat.bg}}>
                      <stat.icon className="w-5 h-5" style={{color: stat.color}}/>
                    </div>
                    <div className="text-lg" style={{fontWeight: 700, color: '#111827'}}>{stat.value}</div>
                    <div className="text-xs text-[#6B7280]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grade trend */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
              <h3 className="text-base mb-4" style={{fontWeight: 600, color: '#111827'}}>Grade Trend</h3>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={gradeHistory}>
                  <defs>
                    <linearGradient id="gradeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E88E5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1E88E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false}/>
                  <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={25}/>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: '12px' }}/>
                  <Area type="monotone" dataKey="grade" stroke="#1E88E5" strokeWidth={2.5} fill="url(#gradeAreaGrad)" dot={{ r: 4, fill: '#1E88E5' }}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly activity chart */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base" style={{fontWeight: 600, color: '#111827'}}>Weekly Activity</h3>
                <span className="text-xs text-[#6B7280]">21 lessons · 288 min this week</span>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={weeklyData} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false}/>
                  <YAxis hide/>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: '12px' }}/>
                  <Bar dataKey="lessons" fill="#1E88E5" radius={[4,4,0,0]} name="Lessons"/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Activity grid */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base" style={{fontWeight: 600, color: '#111827'}}>Activity Heatmap</h3>
                <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                  <span>Less</span>
                  {[0.15, 0.35, 0.55, 0.75, 0.95].map((o, i) => (
                    <div key={i} className="w-3 h-3 rounded-sm" style={{background: `rgba(30, 136, 229, ${o})`}}/>
                  ))}
                  <span>More</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {activityGrid.map((day, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      background: day.active
                        ? `rgba(30, 136, 229, ${day.intensity * 0.2 + 0.1})`
                        : '#F3F4F6'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
              <h3 className="text-base mb-4" style={{fontWeight: 600, color: '#111827'}}>Achievements</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {[
                  { label: 'First Lesson', icon: '📚', earned: true, color: '#1E88E5' },
                  { label: '7-Day Streak', icon: '🔥', earned: true, color: '#EF4444' },
                  { label: 'Quiz Master', icon: '🏆', earned: true, color: '#FFC107' },
                  { label: '14-Day Streak', icon: '⚡', earned: true, color: '#8B5CF6' },
                  { label: 'Perfect Score', icon: '⭐', earned: true, color: '#22C55E' },
                  { label: 'Speed Reader', icon: '💨', earned: false, color: '#9CA3AF' },
                  { label: '30-Day Streak', icon: '🌟', earned: false, color: '#9CA3AF' },
                  { label: 'Vocabulary Pro', icon: '📖', earned: false, color: '#9CA3AF' },
                  { label: 'Grammar Guru', icon: '✍️', earned: false, color: '#9CA3AF' },
                  { label: 'Top Student', icon: '🎓', earned: false, color: '#9CA3AF' },
                  { label: 'Night Owl', icon: '🦉', earned: false, color: '#9CA3AF' },
                  { label: 'Early Bird', icon: '🐦', earned: false, color: '#9CA3AF' },
                ].map(ach => (
                  <div
                    key={ach.label}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl text-center"
                    style={{opacity: ach.earned ? 1 : 0.3}}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{background: ach.earned ? ach.color + '20' : '#F3F4F6'}}
                    >
                      {ach.icon}
                    </div>
                    <span className="text-[10px] text-center leading-tight" style={{color: ach.earned ? '#111827' : '#9CA3AF', fontWeight: ach.earned ? 600 : 400}}>
                      {ach.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'grades' && (
          <motion.div key="grades" initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
            {/* Grade summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Average Grade', value: '91%', grade: 'A', color: '#22C55E', bg: '#F0FDF4' },
                { label: 'Highest Score', value: '98%', grade: 'A+', color: '#1E88E5', bg: '#EFF6FF' },
                { label: 'Assignments', value: '5', grade: 'Done', color: '#8B5CF6', bg: '#F5F3FF' },
                { label: 'Improvement', value: '+19%', grade: '↑', color: '#FFC107', bg: '#FFFBEB' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-4 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
                  <div className="text-xs text-[#6B7280] mb-2">{s.label}</div>
                  <div className="flex items-end gap-2">
                    <span className="text-xl" style={{fontWeight: 800, color: '#111827'}}>{s.value}</span>
                    <span className="text-sm mb-0.5 px-1.5 py-0.5 rounded-lg" style={{background: s.bg, color: s.color, fontWeight: 700}}>{s.grade}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Assignment grades */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
              <h3 className="text-base mb-4" style={{fontWeight: 600, color: '#111827'}}>Assignment Grades</h3>
              <div className="space-y-3">
                {assignments.map(a => (
                  <div key={a.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm flex-shrink-0"
                        style={{
                          background: a.score >= 95 ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                            : a.score >= 90 ? 'linear-gradient(135deg, #1E88E5, #42A5F5)'
                            : a.score >= 85 ? 'linear-gradient(135deg, #8B5CF6, #6D28D9)'
                            : 'linear-gradient(135deg, #F59E0B, #D97706)',
                          fontWeight: 800
                        }}
                      >
                        {a.grade}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm" style={{fontWeight: 700, color: '#111827'}}>{a.name}</h4>
                            <div className="text-xs text-[#9CA3AF] mt-0.5">{a.date}</div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-base" style={{fontWeight: 800, color: '#111827'}}>{a.score}%</div>
                            <div className="text-xs text-[#22C55E]">✓ Completed</div>
                          </div>
                        </div>
                        <div className="mt-2 p-2.5 rounded-xl bg-[#F8FAFC] text-xs text-[#374151] italic">
                          "{a.feedback}"
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grade chart */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
              <h3 className="text-base mb-4" style={{fontWeight: 600, color: '#111827'}}>Grade History</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={assignments.map(a => ({name: a.name.slice(0, 10) + '...', score: a.score})).reverse()} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false}/>
                  <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={25}/>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: '12px' }}/>
                  <Bar dataKey="score" radius={[6,6,0,0]} name="Score %" fill="#1E88E5"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
