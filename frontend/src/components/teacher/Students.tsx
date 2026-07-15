import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, ArrowLeft, TrendingUp, BookOpen, CheckCircle, Clock, Star, MessageSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { NavigationProps } from '../../App';

const students = [
  { id: 1, name: 'Alex Johnson', email: 'alex.j@email.com', completion: 92, grade: 'A+', score: 98, progress: 92, streak: 14, lessons: 28, pending: 3, avatar: 'A', color: '#1E88E5' },
  { id: 2, name: 'Maria Garcia', email: 'maria.g@email.com', completion: 85, grade: 'A', score: 95, progress: 85, streak: 10, lessons: 26, pending: 5, avatar: 'M', color: '#22C55E' },
  { id: 3, name: 'David Chen', email: 'david.c@email.com', completion: 78, grade: 'B+', score: 87, progress: 78, streak: 7, lessons: 24, pending: 8, avatar: 'D', color: '#8B5CF6' },
  { id: 4, name: 'Emma Wilson', email: 'emma.w@email.com', completion: 65, grade: 'B', score: 82, progress: 65, streak: 5, lessons: 20, pending: 12, avatar: 'E', color: '#FFC107' },
  { id: 5, name: 'James Brown', email: 'james.b@email.com', completion: 55, grade: 'C+', score: 74, progress: 55, streak: 2, lessons: 17, pending: 15, avatar: 'J', color: '#EF4444' },
  { id: 6, name: 'Sophie Taylor', email: 'sophie.t@email.com', completion: 88, grade: 'A', score: 91, progress: 88, streak: 12, lessons: 27, pending: 4, avatar: 'S', color: '#F97316' },
  { id: 7, name: 'Lucas Martinez', email: 'lucas.m@email.com', completion: 70, grade: 'B', score: 80, progress: 70, streak: 6, lessons: 22, pending: 10, avatar: 'L', color: '#14B8A6' },
  { id: 8, name: 'Olivia Anderson', email: 'olivia.a@email.com', completion: 95, grade: 'A+', score: 99, progress: 95, streak: 18, lessons: 29, pending: 1, avatar: 'O', color: '#EC4899' },
];

const gradeProgressData = [
  { week: 'W1', grade: 72 }, { week: 'W2', grade: 75 }, { week: 'W3', grade: 79 },
  { week: 'W4', grade: 82 }, { week: 'W5', grade: 85 }, { week: 'W6', grade: 88 },
  { week: 'W7', grade: 91 }, { week: 'W8', grade: 95 },
];

const completedLessons = [
  { id: 1, title: 'Present Perfect', type: 'quiz', score: 95, date: 'Jul 12' },
  { id: 2, title: 'Business Vocabulary', type: 'lesson', score: null, date: 'Jul 11' },
  { id: 3, title: 'Email Writing', type: 'exercise', score: 88, date: 'Jul 10' },
  { id: 4, title: 'Conditionals', type: 'quiz', score: 92, date: 'Jul 9' },
];

const pendingLessons = [
  { id: 1, title: 'Passive Voice', type: 'lesson' },
  { id: 2, title: 'B2 Vocabulary Quiz', type: 'quiz' },
  { id: 3, title: 'Reading Comprehension', type: 'reading' },
];

const typeColors: Record<string, string> = {
  quiz: '#FFC107', lesson: '#1E88E5', exercise: '#22C55E', reading: '#EF4444', video: '#8B5CF6'
};

export function Students({ navigate }: NavigationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'grades'>('overview');

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedStudent) {
    return (
      <div className="p-4 lg:p-6 max-w-5xl mx-auto">
        <button
          onClick={() => setSelectedStudent(null)}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4"/>
          Back to Students
        </button>

        {/* Student header */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl flex-shrink-0" style={{background: selectedStudent.color, fontWeight: 700}}>
              {selectedStudent.avatar}
            </div>
            <div className="flex-1">
              <h1 className="text-xl" style={{fontWeight: 700, color: '#111827'}}>{selectedStudent.name}</h1>
              <p className="text-sm text-[#6B7280]">{selectedStudent.email}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="text-xs px-2.5 py-1 rounded-lg" style={{background: '#F0FDF4', color: '#22C55E', fontWeight: 600}}>
                  Grade: {selectedStudent.grade}
                </span>
                <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                  <BookOpen className="w-3.5 h-3.5"/> {selectedStudent.lessons} lessons done
                </span>
                <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                  🔥 {selectedStudent.streak}d streak
                </span>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm hover:bg-gray-50 transition-colors" style={{fontWeight: 500, color: '#6B7280'}}>
              <MessageSquare className="w-4 h-4"/> Message
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#6B7280]">Overall Progress</span>
              <span style={{fontWeight: 600, color: '#111827'}}>{selectedStudent.completion}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div className="h-2.5 rounded-full" style={{width: `${selectedStudent.completion}%`, background: 'linear-gradient(90deg, #1E88E5, #42A5F5)'}}/>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4 w-fit">
          {(['overview', 'lessons', 'grades'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-lg text-sm capitalize transition-all"
              style={{
                background: activeTab === tab ? 'white' : 'transparent',
                color: activeTab === tab ? '#111827' : '#6B7280',
                fontWeight: activeTab === tab ? 600 : 400,
                boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{opacity:0}} animate={{opacity:1}} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Grade chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
                <h3 className="text-sm mb-4" style={{fontWeight: 600, color: '#111827'}}>Grade Progress (8 weeks)</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={gradeProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false}/>
                    <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={25}/>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: '12px' }}/>
                    <Line type="monotone" dataKey="grade" stroke="#1E88E5" strokeWidth={2.5} dot={{ r: 4, fill: '#1E88E5' }}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Completed', value: selectedStudent.lessons, icon: CheckCircle, color: '#22C55E', bg: '#F0FDF4' },
                  { label: 'Pending', value: selectedStudent.pending, icon: Clock, color: '#F59E0B', bg: '#FFFBEB' },
                  { label: 'Current Score', value: `${selectedStudent.score}%`, icon: Star, color: '#FFC107', bg: '#FFFBEB' },
                  { label: 'Streak Days', value: `${selectedStudent.streak}d`, icon: TrendingUp, color: '#1E88E5', bg: '#EFF6FF' },
                ].map(item => (
                  <div key={item.label} className="bg-white rounded-xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-gray-50 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background: item.bg}}>
                      <item.icon className="w-4 h-4" style={{color: item.color}}/>
                    </div>
                    <div>
                      <div className="text-lg" style={{fontWeight: 700, color: '#111827'}}>{item.value}</div>
                      <div className="text-xs text-[#6B7280]">{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'lessons' && (
            <motion.div key="lessons" initial={{opacity:0}} animate={{opacity:1}} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
                <h3 className="text-sm mb-4 flex items-center gap-2" style={{fontWeight: 600, color: '#111827'}}>
                  <CheckCircle className="w-4 h-4 text-[#22C55E]"/> Completed ({completedLessons.length})
                </h3>
                <div className="space-y-2.5">
                  {completedLessons.map(lesson => (
                    <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC]">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background: typeColors[lesson.type] ?? '#9CA3AF'}}/>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate" style={{fontWeight: 500, color: '#111827'}}>{lesson.title}</div>
                        <div className="text-xs text-[#9CA3AF]">{lesson.date}</div>
                      </div>
                      {lesson.score !== null && (
                        <span className="text-xs" style={{fontWeight: 600, color: lesson.score >= 90 ? '#22C55E' : '#F59E0B'}}>{lesson.score}%</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
                <h3 className="text-sm mb-4 flex items-center gap-2" style={{fontWeight: 600, color: '#111827'}}>
                  <Clock className="w-4 h-4 text-[#F59E0B]"/> Pending ({pendingLessons.length})
                </h3>
                <div className="space-y-2.5">
                  {pendingLessons.map(lesson => (
                    <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#FFFBEB]">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background: typeColors[lesson.type] ?? '#9CA3AF'}}/>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate" style={{fontWeight: 500, color: '#111827'}}>{lesson.title}</div>
                        <div className="text-xs capitalize" style={{color: typeColors[lesson.type] ?? '#9CA3AF'}}>{lesson.type}</div>
                      </div>
                      <Clock className="w-3.5 h-3.5 text-[#F59E0B] flex-shrink-0"/>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'grades' && (
            <motion.div key="grades" initial={{opacity:0}} animate={{opacity:1}} className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
              <h3 className="text-sm mb-4" style={{fontWeight: 600, color: '#111827'}}>Grade History</h3>
              <div className="space-y-3">
                {[
                  { assignment: 'Grammar Fundamentals', grade: 'A+', score: 98, date: 'Jul 10', feedback: 'Excellent work!' },
                  { assignment: 'Vocabulary B2', grade: 'A', score: 92, date: 'Jul 5', feedback: 'Great progress on idioms.' },
                  { assignment: 'Reading Comprehension', grade: 'B+', score: 87, date: 'Jun 28', feedback: 'Good analysis, work on speed.' },
                  { assignment: 'Business Writing', grade: 'A', score: 93, date: 'Jun 20', feedback: 'Professional tone, well done.' },
                ].map((g, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm flex-shrink-0"
                      style={{background: g.score >= 90 ? '#22C55E' : g.score >= 80 ? '#1E88E5' : '#F59E0B', fontWeight: 700}}
                    >
                      {g.grade}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm" style={{fontWeight: 600, color: '#111827'}}>{g.assignment}</div>
                      <div className="text-xs text-[#6B7280] italic mt-0.5">"{g.feedback}"</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm" style={{fontWeight: 700, color: '#111827'}}>{g.score}%</div>
                      <div className="text-xs text-[#9CA3AF]">{g.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl" style={{fontWeight: 700, color: '#111827'}}>Students</h1>
          <p className="text-[#6B7280] text-sm mt-0.5">{students.length} students enrolled</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"/>
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
          />
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-[#6B7280] hover:bg-gray-50">
          <Filter className="w-4 h-4"/>
        </button>
      </div>

      {/* Student grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {filtered.map(student => (
          <motion.div
            key={student.id}
            layout
            className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50 hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition-all cursor-pointer"
            onClick={() => setSelectedStudent(student)}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white" style={{background: student.color, fontWeight: 700}}>
                {student.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate" style={{fontWeight: 700, color: '#111827'}}>{student.name}</div>
                <div className="text-xs text-[#6B7280] truncate">{student.email}</div>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-lg flex-shrink-0"
                style={{
                  background: student.score >= 90 ? '#F0FDF4' : student.score >= 75 ? '#FFFBEB' : '#FEF2F2',
                  color: student.score >= 90 ? '#22C55E' : student.score >= 75 ? '#F59E0B' : '#EF4444',
                  fontWeight: 700
                }}
              >
                {student.grade}
              </span>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#6B7280]">Completion</span>
                <span style={{fontWeight: 600, color: '#111827'}}>{student.completion}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="h-1.5 rounded-full" style={{width: `${student.completion}%`, background: student.color}}/>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#6B7280]">
              <span>{student.lessons} lessons</span>
              <span>🔥 {student.streak}d</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
