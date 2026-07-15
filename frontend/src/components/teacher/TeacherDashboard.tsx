import { useEffect, useMemo, useState } from 'react';
import { Users, BookOpen, ClipboardList, TrendingUp, Clock, CheckCircle, AlertCircle, ArrowRight, Flame, Star } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import type { NavigationProps } from '../../App';
import { countMyStudyPlans, fetchStudyPlans } from '../../services/lessonService';

const completionData = [
  { month: 'Jan', completed: 65, assigned: 80 },
  { month: 'Feb', completed: 72, assigned: 85 },
  { month: 'Mar', completed: 88, assigned: 95 },
  { month: 'Apr', completed: 76, assigned: 90 },
  { month: 'May', completed: 91, assigned: 100 },
  { month: 'Jun', completed: 84, assigned: 92 },
  { month: 'Jul', completed: 95, assigned: 105 },
];

const gradeData = [
  { month: 'Jan', avg: 72 },
  { month: 'Feb', avg: 75 },
  { month: 'Mar', avg: 80 },
  { month: 'Apr', avg: 78 },
  { month: 'May', avg: 85 },
  { month: 'Jun', avg: 83 },
  { month: 'Jul', avg: 88 },
];

const recentActivity = [
  { id: 1, student: 'Alex Johnson', action: 'Completed Quiz: Present Perfect', time: '5 min ago', type: 'quiz', score: 92 },
  { id: 2, student: 'Maria Garcia', action: 'Submitted Assignment: Reading 3', time: '18 min ago', type: 'assignment', score: 87 },
  { id: 3, student: 'David Chen', action: 'Completed Lesson: Past Tense', time: '32 min ago', type: 'lesson', score: null },
  { id: 4, student: 'Emma Wilson', action: 'Started Plan: Business English', time: '1 hr ago', type: 'plan', score: null },
  { id: 5, student: 'James Brown', action: 'Completed Exercise: Vocabulary B2', time: '2 hr ago', type: 'exercise', score: 78 },
];

const upcomingAssignments = [
  { id: 1, name: 'Grammar Fundamentals', students: 24, due: 'Tomorrow', status: 'active', progress: 68 },
  { id: 2, name: 'Business Writing', students: 18, due: 'Jul 17', status: 'active', progress: 45 },
  { id: 3, name: 'Pronunciation Basics', students: 32, due: 'Jul 20', status: 'draft', progress: 0 },
];

const topStudents = [
  { name: 'Alex Johnson', grade: 'A+', score: 98, streak: 14 },
  { name: 'Maria Garcia', grade: 'A', score: 95, streak: 10 },
  { name: 'Emma Wilson', grade: 'A', score: 93, streak: 7 },
];

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  positive: boolean;
  color: string;
  bg: string;
}

function StatCard({ icon: Icon, label, value, change, positive, color, bg }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50 hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{background: bg}}>
          <Icon className="w-5 h-5" style={{color}}/>
        </div>
        <span
          className="text-xs px-2 py-1 rounded-lg"
          style={{
            color: positive ? '#22C55E' : '#EF4444',
            background: positive ? '#F0FDF4' : '#FEF2F2',
            fontWeight: 600
          }}
        >
          {change}
        </span>
      </div>
      <div className="text-2xl mb-1" style={{fontWeight: 700, color: '#111827'}}>{value}</div>
      <div className="text-sm text-[#6B7280]">{label}</div>
    </div>
  );
}

export function TeacherDashboard({ navigate }: NavigationProps) {
  const [studyPlanCount, setStudyPlanCount] = useState(0);
  const [plansCount, setPlansCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [count, plans] = await Promise.all([countMyStudyPlans(), fetchStudyPlans()]);
        setStudyPlanCount(count);
        setPlansCount(plans.length);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  const username = useMemo(() => localStorage.getItem('username') || 'Professor', []);

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl" style={{fontWeight: 700, color: '#111827'}}>
            Olá, {username} 👋
          </h1>
          <p className="text-[#6B7280] text-sm mt-0.5">Aqui está o que está acontecendo com seus alunos hoje.</p>
        </div>
        <button
          onClick={() => navigate('teacher/create-plan')}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm shadow-lg shadow-[#1E88E5]/20 hover:opacity-90 transition-opacity"
          style={{background: 'linear-gradient(135deg, #1E88E5, #42A5F5)', fontWeight: 600}}
        >
          <BookOpen className="w-4 h-4"/>
          New Study Plan
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard icon={Users} label="Total Students" value="248" change="+12%" positive={true} color="#1E88E5" bg="#EFF6FF"/>
        <StatCard icon={BookOpen} label="Study Plans" value={loading ? '...' : String(studyPlanCount)} change="+2" positive={true} color="#42A5F5" bg="#F0F9FF"/>
        <StatCard icon={ClipboardList} label="Assignments" value={String(plansCount)} change="+5" positive={true} color="#FFC107" bg="#FFFBEB"/>
        <StatCard icon={TrendingUp} label="Completion Rate" value="78%" change="+3%" positive={true} color="#22C55E" bg="#F0FDF4"/>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Assignment Completion Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base" style={{fontWeight: 600, color: '#111827'}}>Assignment Completion</h3>
              <p className="text-sm text-[#6B7280]">Assigned vs completed this year</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{background: '#1E88E5'}}/><span className="text-[#6B7280]">Completed</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{background: '#E3F2FD'}}/><span className="text-[#6B7280]">Assigned</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={completionData} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={30}/>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: '12px' }}
                cursor={{ fill: '#F8FAFC' }}
              />
              <Bar dataKey="assigned" fill="#E3F2FD" radius={[4, 4, 0, 0]} name="Assigned"/>
              <Bar dataKey="completed" fill="#1E88E5" radius={[4, 4, 0, 0]} name="Completed"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Average grade trend */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
          <div className="mb-5">
            <h3 className="text-base" style={{fontWeight: 600, color: '#111827'}}>Avg. Grade Trend</h3>
            <p className="text-sm text-[#6B7280]">Class average over time</p>
          </div>
          <div className="mb-3 flex items-end gap-2">
            <span className="text-3xl" style={{fontWeight: 700, color: '#111827'}}>88%</span>
            <span className="text-sm text-[#22C55E] mb-1" style={{fontWeight: 600}}>↑ 3.2%</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={gradeData}>
              <defs>
                <linearGradient id="gradeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E88E5" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#1E88E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false}/>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="avg" stroke="#1E88E5" strokeWidth={2.5} fill="url(#gradeGrad)" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base" style={{fontWeight: 600, color: '#111827'}}>Recent Activity</h3>
            <button className="text-sm text-[#1E88E5]" style={{fontWeight: 500}}>View all</button>
          </div>
          <div className="space-y-3">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm flex-shrink-0"
                  style={{
                    background: activity.type === 'quiz' ? 'linear-gradient(135deg, #FFC107, #FF8F00)'
                      : activity.type === 'assignment' ? 'linear-gradient(135deg, #1E88E5, #42A5F5)'
                      : activity.type === 'lesson' ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                      : 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                    fontWeight: 700
                  }}
                >
                  {activity.student[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate" style={{fontWeight: 600, color: '#111827'}}>{activity.student}</div>
                  <div className="text-xs text-[#6B7280] truncate">{activity.action}</div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {activity.score !== null && (
                    <span className="text-xs px-2 py-0.5 rounded-lg" style={{
                      background: activity.score >= 90 ? '#F0FDF4' : activity.score >= 75 ? '#FFFBEB' : '#FEF2F2',
                      color: activity.score >= 90 ? '#22C55E' : activity.score >= 75 ? '#F59E0B' : '#EF4444',
                      fontWeight: 600
                    }}>
                      {activity.score}%
                    </span>
                  )}
                  <span className="text-xs text-[#9CA3AF]">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-4">
          {/* Top students */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm" style={{fontWeight: 600, color: '#111827'}}>Top Students</h3>
              <Star className="w-4 h-4 text-[#FFC107]"/>
            </div>
            <div className="space-y-3">
              {topStudents.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="text-xs w-5 text-center" style={{fontWeight: 700, color: i === 0 ? '#FFC107' : '#9CA3AF'}}>
                    {i + 1}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                    style={{
                      background: i === 0 ? 'linear-gradient(135deg, #FFC107, #FF8F00)'
                        : i === 1 ? 'linear-gradient(135deg, #1E88E5, #42A5F5)'
                        : 'linear-gradient(135deg, #22C55E, #16A34A)',
                      fontWeight: 700
                    }}
                  >
                    {s.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs truncate" style={{fontWeight: 600, color: '#111827'}}>{s.name}</div>
                    <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-400"/>
                      <span className="text-xs text-[#6B7280]">{s.streak}d streak</span>
                    </div>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-lg"
                    style={{background: '#F0FDF4', color: '#22C55E', fontWeight: 700}}
                  >
                    {s.grade}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming assignments */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm" style={{fontWeight: 600, color: '#111827'}}>Upcoming</h3>
              <button
                onClick={() => navigate('teacher/assignments')}
                className="text-xs text-[#1E88E5] flex items-center gap-1"
                style={{fontWeight: 500}}
              >
                All <ArrowRight className="w-3 h-3"/>
              </button>
            </div>
            <div className="space-y-3">
              {upcomingAssignments.map(a => (
                <div key={a.id} className="group">
                  <div className="flex items-start gap-2 mb-1.5">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{background: a.status === 'active' ? '#22C55E' : '#9CA3AF'}}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs truncate" style={{fontWeight: 600, color: '#111827'}}>{a.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-[#6B7280]">{a.students} students</span>
                        <span className="text-xs text-[#6B7280]">·</span>
                        <span className="text-xs" style={{color: a.due === 'Tomorrow' ? '#EF4444' : '#6B7280', fontWeight: a.due === 'Tomorrow' ? 600 : 400}}>
                          {a.due}
                        </span>
                      </div>
                    </div>
                  </div>
                  {a.progress > 0 && (
                    <div className="ml-4">
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{width: `${a.progress}%`, background: '#1E88E5'}}/>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
