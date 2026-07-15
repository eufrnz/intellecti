import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { TrendingUp, Award, AlertCircle, Target } from 'lucide-react';
import type { NavigationProps } from '../../App';

const completionByWeek = [
  { week: 'Jun W1', rate: 72 }, { week: 'Jun W2', rate: 78 }, { week: 'Jun W3', rate: 75 },
  { week: 'Jun W4', rate: 82 }, { week: 'Jul W1', rate: 85 }, { week: 'Jul W2', rate: 88 },
  { week: 'Jul W3', rate: 91 },
];

const gradeDistribution = [
  { grade: 'A+ (95-100)', students: 28 },
  { grade: 'A (90-94)', students: 45 },
  { grade: 'B+ (85-89)', students: 62 },
  { grade: 'B (80-84)', students: 48 },
  { grade: 'C+ (75-79)', students: 35 },
  { grade: 'C (70-74)', students: 20 },
  { grade: 'Below 70', students: 10 },
];

const studentProgress = [
  { name: 'Alex J.', completion: 92, grade: 98 },
  { name: 'Maria G.', completion: 85, grade: 95 },
  { name: 'David C.', completion: 78, grade: 87 },
  { name: 'Emma W.', completion: 65, grade: 82 },
  { name: 'James B.', completion: 55, grade: 74 },
  { name: 'Sophie T.', completion: 88, grade: 91 },
  { name: 'Lucas M.', completion: 70, grade: 80 },
  { name: 'Olivia A.', completion: 95, grade: 99 },
];

const difficultLessons = [
  { lesson: 'Conditional Clauses', avgScore: 64, attempts: 3.2 },
  { lesson: 'Passive Voice', avgScore: 68, attempts: 2.8 },
  { lesson: 'Reported Speech', avgScore: 71, attempts: 2.5 },
  { lesson: 'Modal Verbs', avgScore: 73, attempts: 2.1 },
  { lesson: 'Present Perfect', avgScore: 76, attempts: 1.8 },
];

const engagementData = [
  { month: 'Jan', sessions: 1240, duration: 42 },
  { month: 'Feb', sessions: 1380, duration: 45 },
  { month: 'Mar', sessions: 1520, duration: 48 },
  { month: 'Apr', sessions: 1410, duration: 44 },
  { month: 'May', sessions: 1680, duration: 52 },
  { month: 'Jun', sessions: 1750, duration: 55 },
  { month: 'Jul', sessions: 1920, duration: 58 },
];

const pieData = [
  { name: 'A / A+', value: 73, color: '#22C55E' },
  { name: 'B / B+', value: 110, color: '#1E88E5' },
  { name: 'C / C+', value: 55, color: '#FFC107' },
  { name: 'Below C', value: 10, color: '#EF4444' },
];

export function Analytics({ navigate }: NavigationProps) {
  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-5">
      <div className="mb-2">
        <h1 className="text-xl lg:text-2xl" style={{fontWeight: 700, color: '#111827'}}>Analytics</h1>
        <p className="text-[#6B7280] text-sm mt-0.5">Insights into student performance and engagement</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {[
          { icon: TrendingUp, label: 'Avg Completion', value: '78.3%', change: '+5.2%', color: '#22C55E', bg: '#F0FDF4' },
          { icon: Award, label: 'Avg Grade', value: '84.7%', change: '+3.1%', color: '#1E88E5', bg: '#EFF6FF' },
          { icon: Target, label: 'Engagement Rate', value: '91.2%', change: '+8.4%', color: '#FFC107', bg: '#FFFBEB' },
          { icon: AlertCircle, label: 'At-Risk Students', value: '12', change: '-3', color: '#EF4444', bg: '#FEF2F2' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background: kpi.bg}}>
              <kpi.icon className="w-5 h-5" style={{color: kpi.color}}/>
            </div>
            <div className="text-xl" style={{fontWeight: 700, color: '#111827'}}>{kpi.value}</div>
            <div className="text-xs text-[#6B7280] mt-0.5">{kpi.label}</div>
            <div className="text-xs mt-1" style={{color: kpi.label === 'At-Risk Students' ? '#22C55E' : '#22C55E', fontWeight: 600}}>
              {kpi.change} this month
            </div>
          </div>
        ))}
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Completion trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
          <h3 className="text-base mb-1" style={{fontWeight: 600, color: '#111827'}}>Assignment Completion Rate</h3>
          <p className="text-xs text-[#6B7280] mb-4">Weekly completion percentage across all active assignments</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={completionByWeek}>
              <defs>
                <linearGradient id="completionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E88E5" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#1E88E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false}/>
              <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={30}/>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: '12px' }}/>
              <Area type="monotone" dataKey="rate" stroke="#1E88E5" strokeWidth={2.5} fill="url(#completionGrad)" dot={{ r: 4, fill: '#1E88E5' }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Grade distribution pie */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
          <h3 className="text-base mb-1" style={{fontWeight: 600, color: '#111827'}}>Grade Distribution</h3>
          <p className="text-xs text-[#6B7280] mb-2">All students</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color}/>
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: '12px' }}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {pieData.map(p => (
              <div key={p.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{background: p.color}}/>
                <span className="flex-1 text-[#6B7280]">{p.name}</span>
                <span style={{fontWeight: 600, color: '#111827'}}>{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Student progress scatter - using bar chart for clarity */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
          <h3 className="text-base mb-1" style={{fontWeight: 600, color: '#111827'}}>Student Progress</h3>
          <p className="text-xs text-[#6B7280] mb-4">Completion vs grade score</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={studentProgress} layout="horizontal" barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false}/>
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={25}/>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: '12px' }}/>
              <Bar dataKey="completion" fill="#42A5F5" radius={[4,4,0,0]} name="Completion %"/>
              <Bar dataKey="grade" fill="#1E88E5" radius={[4,4,0,0]} name="Grade %"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Most difficult lessons */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
          <h3 className="text-base mb-1" style={{fontWeight: 600, color: '#111827'}}>Most Difficult Lessons</h3>
          <p className="text-xs text-[#6B7280] mb-4">Ranked by average score (lowest first)</p>
          <div className="space-y-3">
            {difficultLessons.map((lesson, i) => (
              <div key={lesson.lesson} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-xs text-white flex-shrink-0"
                  style={{background: i < 2 ? '#EF4444' : i < 4 ? '#F59E0B' : '#22C55E', fontWeight: 700}}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs truncate" style={{fontWeight: 600, color: '#111827'}}>{lesson.lesson}</span>
                    <span className="text-xs ml-2 flex-shrink-0" style={{fontWeight: 700, color: lesson.avgScore < 70 ? '#EF4444' : '#F59E0B'}}>{lesson.avgScore}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${lesson.avgScore}%`,
                        background: lesson.avgScore < 70 ? '#EF4444' : lesson.avgScore < 75 ? '#F59E0B' : '#22C55E'
                      }}
                    />
                  </div>
                  <div className="text-[10px] text-[#9CA3AF] mt-0.5">avg {lesson.attempts}x attempts</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement chart */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base" style={{fontWeight: 600, color: '#111827'}}>Student Engagement</h3>
            <p className="text-xs text-[#6B7280]">Monthly sessions and average session duration (minutes)</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{background: '#1E88E5'}}/><span className="text-[#6B7280]">Sessions</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{background: '#FFC107'}}/><span className="text-[#6B7280]">Avg Duration</span></div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={engagementData} barGap={4} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false}/>
            <YAxis yAxisId="sessions" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={40}/>
            <YAxis yAxisId="duration" orientation="right" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={30}/>
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: '12px' }}/>
            <Bar yAxisId="sessions" dataKey="sessions" fill="#1E88E5" radius={[4,4,0,0]} name="Sessions"/>
            <Bar yAxisId="duration" dataKey="duration" fill="#FFC107" radius={[4,4,0,0]} name="Avg Duration (min)"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
