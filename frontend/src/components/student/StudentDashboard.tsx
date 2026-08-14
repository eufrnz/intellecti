import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Flame, Calendar, BookOpen, Trophy, Clock, ChevronLeft, ChevronRight, Star, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { NavigationProps } from '../../App';
import { fetchStudentMe } from '../../services/userService';

const weeklyActivity = [
  { day: 'Mon', lessons: 3 }, { day: 'Tue', lessons: 5 }, { day: 'Wed', lessons: 2 },
  { day: 'Thu', lessons: 4 }, { day: 'Fri', lessons: 6 }, { day: 'Sat', lessons: 1 },
  { day: 'Sun', lessons: 0 },
];

const upcomingDeadlines = [
  { id: 1, name: 'Grammar Fundamentals', due: 'Tomorrow', urgent: true, progress: 68 },
  { id: 2, name: 'Business Writing', due: 'Jul 19', urgent: false, progress: 45 },
  { id: 3, name: 'Pronunciation Workshop', due: 'Jul 22', urgent: false, progress: 20 },
];

const recentActivity = [
  { id: 1, action: 'Completed Quiz: Present Perfect', time: '2 hrs ago', type: 'quiz', score: 92 },
  { id: 2, action: 'Finished Lesson: Business Vocabulary', time: 'Yesterday', type: 'lesson', score: null },
  { id: 3, action: 'Submitted Exercise: Email Writing', time: 'Yesterday', type: 'exercise', score: 88 },
];

function CircularProgress({ percent, size = 120, strokeWidth = 10 }: { percent: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#E5E7EB" strokeWidth={strokeWidth}/>
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke="url(#progressGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E88E5"/>
            <stop offset="100%" stopColor="#42A5F5"/>
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl" style={{fontWeight: 800, color: '#111827'}}>{percent}%</span>
        <span className="text-xs text-[#6B7280]">Overall</span>
      </div>
    </div>
  );
}

export function StudentDashboard({ navigate }: NavigationProps) {
  const [streak, setStreak] = useState<number>(0);
  const [loggedFullDates, setLoggedFullDates] = useState<Set<string>>(new Set());
  const [loggedDayNumbers, setLoggedDayNumbers] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function loadStudentData() {
      try {
        const studentData = await fetchStudentMe();
        setStreak(studentData.streak ?? 0);

        if (studentData.loggedDays) {
          const rawDays = Array.isArray(studentData.loggedDays)
            ? studentData.loggedDays
            : Array.from(studentData.loggedDays as Iterable<string | number>);

          const fullDates = new Set<string>();
          const dayNumbers = new Set<number>();

          rawDays.forEach((item: string | number) => {
            if (typeof item === 'string') {
              const trimmed = item.trim();
              const normalized = trimmed.replace(/\//g, '-');

              if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(normalized)) {
                const [year, month, day] = normalized.split('-');
                const iso = `${year}-${String(Number(month)).padStart(2, '0')}-${String(Number(day)).padStart(2, '0')}`;
                fullDates.add(iso);
              } else {
                const numberValue = Number(trimmed);
                if (!Number.isNaN(numberValue) && Number.isFinite(numberValue)) {
                  dayNumbers.add(numberValue);
                }
              }
            } else if (typeof item === 'number' && Number.isFinite(item)) {
              dayNumbers.add(item);
            }
          });

          setLoggedFullDates(fullDates);
          setLoggedDayNumbers(dayNumbers);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do estudante:', error);
      }
    }

    void loadStudentData();
  }, []);

  const [calendarMonth, setCalendarMonth] = useState<Date>(() => new Date());

  const today = new Date();
  const monthYearLabel = calendarMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const firstWeekday = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();

  const calendarDays = useMemo(() => {
    const currentYear = calendarMonth.getFullYear();
    const currentMonth = calendarMonth.getMonth();
    const useDayNumbersFallback = loggedFullDates.size === 0;

    return Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1;
      const date = new Date(currentYear, currentMonth, dayNum);
      const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const isToday =
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();

      return {
        day: dayNum,
        hasActivity:
          loggedFullDates.has(isoDate) ||
          (useDayNumbersFallback && loggedDayNumbers.has(dayNum)),
        isToday,
      };
    });
  }, [calendarMonth, daysInMonth, loggedFullDates, loggedDayNumbers, today]);

  const previousMonth = () => {
    setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
  };

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-5">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl" style={{fontWeight: 700, color: '#111827'}}>
            Hey, Alex! 👋
          </h1>
          <p className="text-[#6B7280] text-sm mt-0.5">Keep up the great work. You're on a {streak}-day streak!</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)'}}>
          <Flame className="w-5 h-5 text-orange-400"/>
          <span className="text-base" style={{fontWeight: 700, color: '#111827'}}>{streak}</span>
          <span className="text-xs text-[#6B7280]">streak</span>
        </div>
      </div>

      {/* Hero stats row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Progress ring + current assignment */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Circle progress */}
            <div className="flex flex-col items-center gap-2">
              <CircularProgress percent={72} size={120} strokeWidth={10}/>
              <span className="text-xs text-[#6B7280]">Plan Progress</span>
            </div>

            <div className="flex-1">
              <div className="text-xs text-[#6B7280] mb-1" style={{fontWeight: 500}}>CURRENT ASSIGNMENT</div>
              <h3 className="text-lg mb-1" style={{fontWeight: 700, color: '#111827'}}>Grammar Fundamentals</h3>
              <p className="text-sm text-[#6B7280] mb-3">Business English A2→B1 · Day 15 of 30</p>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#6B7280]">Assignment Progress</span>
                  <span style={{fontWeight: 600, color: '#1E88E5'}}>68%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{width: '68%', background: 'linear-gradient(90deg, #1E88E5, #42A5F5)'}}/>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('student/assignment')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm shadow-lg shadow-[#1E88E5]/20 hover:opacity-90 transition-opacity"
                  style={{background: 'linear-gradient(135deg, #1E88E5, #42A5F5)', fontWeight: 600}}
                >
                  Continue Learning <ArrowRight className="w-4 h-4"/>
                </button>
                <div className="text-xs text-[#6B7280] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5"/> Due tomorrow
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: BookOpen, label: 'Completed', value: '28', sub: 'lessons', color: '#1E88E5', bg: '#EFF6FF' },
            { icon: Trophy, label: 'Avg Grade', value: '91%', sub: 'score', color: '#22C55E', bg: '#F0FDF4' },
            { icon: Star, label: 'Points', value: '2,840', sub: 'earned', color: '#FFC107', bg: '#FFFBEB' },
            { icon: Zap, label: 'Streak', value: `${streak}d`, sub: 'days', color: '#EF4444', bg: '#FEF2F2' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{background: stat.bg}}>
                <stat.icon className="w-4 h-4" style={{color: stat.color}}/>
              </div>
              <div className="text-lg" style={{fontWeight: 700, color: '#111827'}}>{stat.value}</div>
              <div className="text-xs text-[#6B7280]">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly activity */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
          <h3 className="text-base mb-4" style={{fontWeight: 600, color: '#111827'}}>Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={weeklyActivity} barCategoryGap="20%">
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: '11px' }}
                cursor={false}
              />
              <Bar dataKey="lessons" radius={[4,4,0,0]} name="Lessons" fill="#1E88E5"/>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-between text-xs text-[#6B7280] mt-2">
            <span>21 lessons this week</span>
            <span className="text-[#22C55E]" style={{fontWeight: 600}}>+4 vs last week</span>
          </div>
        </div>

        {/* Upcoming deadlines */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
          <h3 className="text-base mb-4" style={{fontWeight: 600, color: '#111827'}}>Upcoming Deadlines</h3>
          <div className="space-y-3">
            {upcomingDeadlines.map(d => (
              <div key={d.id} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate" style={{fontWeight: 500, color: '#111827'}}>{d.name}</div>
                  </div>
                  <span
                    className="text-xs ml-2 flex-shrink-0"
                    style={{
                      color: d.urgent ? '#EF4444' : '#6B7280',
                      fontWeight: d.urgent ? 700 : 400
                    }}
                  >
                    {d.due}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{
                    width: `${d.progress}%`,
                    background: d.urgent ? '#EF4444' : '#1E88E5'
                  }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly calendar */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base" style={{fontWeight: 600, color: '#111827'}}>{monthYearLabel}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={previousMonth}
                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 text-[#6B7280] shadow-sm hover:bg-gray-50"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 text-[#6B7280] shadow-sm hover:bg-gray-50"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {['S','M','T','W','T','F','S'].map((d, i) => (
              <div key={i} className="text-center text-[10px] text-[#9CA3AF]" style={{fontWeight: 500}}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstWeekday }).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}
            {calendarDays.map(({ day, hasActivity, isToday }) => (
              <div
                key={day}
                className="aspect-square rounded-lg flex items-center justify-center text-[11px] relative"
                style={{
                  background: isToday ? 'linear-gradient(135deg, #1E88E5, #42A5F5)'
                    : hasActivity ? '#EFF6FF'
                    : 'transparent',
                  color: isToday ? 'white' : hasActivity ? '#1E88E5' : '#6B7280',
                  fontWeight: isToday ? 700 : hasActivity ? 600 : 400
                }}
              >
                {day}
                {hasActivity && !isToday && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{background: '#1E88E5'}}/>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base" style={{fontWeight: 600, color: '#111827'}}>Recent Activity</h3>
          <button
            onClick={() => navigate('student/progress')}
            className="text-sm text-[#1E88E5] flex items-center gap-1"
            style={{fontWeight: 500}}
          >
            View all <ChevronRight className="w-4 h-4"/>
          </button>
        </div>
        <div className="space-y-3">
          {recentActivity.map(activity => (
            <div key={activity.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: activity.type === 'quiz' ? '#FFFBEB'
                    : activity.type === 'lesson' ? '#EFF6FF'
                    : '#F0FDF4'
                }}
              >
                {activity.type === 'quiz' ? <Trophy className="w-4 h-4 text-[#FFC107]"/>
                  : activity.type === 'lesson' ? <BookOpen className="w-4 h-4 text-[#1E88E5]"/>
                  : <Zap className="w-4 h-4 text-[#22C55E]"/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate" style={{fontWeight: 500, color: '#111827'}}>{activity.action}</div>
                <div className="text-xs text-[#9CA3AF]">{activity.time}</div>
              </div>
              {activity.score !== null && (
                <span
                  className="text-xs px-2 py-0.5 rounded-lg flex-shrink-0"
                  style={{
                    background: activity.score >= 90 ? '#F0FDF4' : '#FFFBEB',
                    color: activity.score >= 90 ? '#22C55E' : '#F59E0B',
                    fontWeight: 600
                  }}
                >
                  {activity.score}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}