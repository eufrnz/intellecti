import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Edit2, Trash2, Eye, BookOpen, Clock, ChevronDown, ChevronUp,
  Video, FileText, HelpCircle, Dumbbell, CheckCircle, ArrowLeft,
  ArrowRight, Play, X
} from 'lucide-react';
import { toast } from 'sonner';
import type { NavigationProps } from '../../App';
import { addContentToDay, addDayToStudyPlan, createStudyPlan, fetchStudyPlans, type StudyPlanResponse } from '../../services/lessonService';

const staticPlans = [
  {
    id: 1, title: 'Business English A2→B1', description: 'A comprehensive course covering business vocabulary, email writing, and professional communication for intermediate learners.', status: 'active', days: 30, progress: 72, students: 24,
  },
  {
    id: 2, title: 'Grammar Fundamentals', description: 'Master the essential grammar rules including tenses, conditionals, and complex sentence structures.', status: 'active', days: 21, progress: 45, students: 18,
  },
  {
    id: 3, title: 'Pronunciation & Speaking', description: 'Improve pronunciation, accent reduction, and spoken English fluency through structured exercises.', status: 'draft', days: 14, progress: 0, students: 0,
  },
  {
    id: 4, title: 'IELTS Preparation', description: 'Complete IELTS test preparation covering all four skills: Reading, Writing, Listening, and Speaking.', status: 'completed', days: 45, progress: 100, students: 32,
  },
];

const contentTypeConfig = {
  lesson: { icon: FileText, color: '#1E88E5', bg: '#EFF6FF', label: 'Lesson' },
  video: { icon: Video, color: '#8B5CF6', bg: '#F5F3FF', label: 'Video' },
  quiz: { icon: HelpCircle, color: '#FFC107', bg: '#FFFBEB', label: 'Quiz' },
  exercise: { icon: Dumbbell, color: '#22C55E', bg: '#F0FDF4', label: 'Exercise' },
  reading: { icon: BookOpen, color: '#EF4444', bg: '#FEF2F2', label: 'Reading' },
};

type ContentType = keyof typeof contentTypeConfig;

interface ContentItem {
  id: number;
  type: ContentType;
  title: string;
  content: string;
}

interface Day {
  id: number;
  number: number;
  title: string;
  description: string;
  content: ContentItem[];
}

const statusColors: Record<string, {bg: string; text: string; dot: string}> = {
  active: { bg: '#F0FDF4', text: '#22C55E', dot: '#22C55E' },
  draft: { bg: '#F9FAFB', text: '#6B7280', dot: '#9CA3AF' },
  completed: { bg: '#EFF6FF', text: '#1E88E5', dot: '#1E88E5' },
};

export function StudyPlans({ currentView, navigate }: NavigationProps) {
  const [plans, setPlans] = useState<StudyPlanResponse[]>([]);
  const [showCreate, setShowCreate] = useState(currentView === 'teacher/create-plan');
  const [createStep, setCreateStep] = useState<1 | 2 | 3>(1);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<{ dayId: number; contentId: number } | null>(null);
  const [editingText, setEditingText] = useState('');

  // Create plan form state
  const [planTitle, setPlanTitle] = useState('');
  const [planDesc, setPlanDesc] = useState('');
  const [planStatus, setPlanStatus] = useState<'draft' | 'active'>('draft');
  const [days, setDays] = useState<Day[]>([
    { id: 1, number: 1, title: 'Introduction', description: 'Getting started with the basics', content: [] }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await fetchStudyPlans();
        setPlans(data);
      } catch (error) {
        console.error(error);
      }
    };

    void loadPlans();
  }, []);

  const addDay = () => {
    const newDay: Day = {
      id: Date.now(),
      number: days.length + 1,
      title: `Day ${days.length + 1}`,
      description: '',
      content: []
    };
    setDays([...days, newDay]);
  };

  const addContent = (dayId: number, type: ContentType) => {
    setDays(days.map(d => d.id === dayId
      ? {
          ...d,
          content: [...d.content, {
            id: Date.now(),
            type,
            title: `New ${contentTypeConfig[type].label}`,
            content: ''
          }]
        }
      : d
    ));
  };

  const removeContent = (dayId: number, contentId: number) => {
    setDays(days.map(d => d.id === dayId
      ? { ...d, content: d.content.filter(c => c.id !== contentId) }
      : d
    ));
  };

  const openEditContent = (dayId: number, contentId: number) => {
    const day = days.find(d => d.id === dayId);
    const item = day?.content.find(c => c.id === contentId);
    if (item) {
      setEditingContent({ dayId, contentId });
      setEditingText(item.content);
    }
  };

  const saveEditContent = () => {
    if (!editingContent) return;
    setDays(days.map(d => d.id === editingContent.dayId
      ? {
          ...d,
          content: d.content.map(c => c.id === editingContent.contentId
            ? { ...c, content: editingText }
            : c
          )
        }
      : d
    ));
    setEditingContent(null);
  };

  const handlePublish = async () => {
    if (!planTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setIsSubmitting(true);

    try {
      const studyPlanId = await createStudyPlan({
        title: planTitle,
        description: planDesc,
        studyPlanStatus: planStatus === 'active' ? 'PUBLISHED' : 'DRAFT',
      });

      for (const day of days) {
        const dayId = await addDayToStudyPlan(studyPlanId, {
          number: day.number,
          title: day.title,
          description: day.description,
        });

        for (const [index, content] of day.content.entries()) {
          await addContentToDay(dayId, {
            title: content.title,
            content: content.content || content.title,
            orderIndex: index + 1,
          });
        }
      }

      const refreshedPlans = await fetchStudyPlans();
      setPlans(refreshedPlans);
      toast.success('Study plan published successfully!');
      setShowCreate(false);
      setCreateStep(1);
      setPlanTitle('');
      setPlanDesc('');
      setPlanStatus('draft');
      setDays([{ id: 1, number: 1, title: 'Introduction', description: 'Getting started with the basics', content: [] }]);
      navigate('teacher/study-plans');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Unable to create study plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showCreate) {
    return (
      <div className="p-4 lg:p-6 max-w-3xl mx-auto">
        <button
          onClick={() => { setShowCreate(false); navigate('teacher/study-plans'); }}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4"/>
          Back to Study Plans
        </button>

        <div className="mb-6">
          <h1 className="text-2xl" style={{fontWeight: 700, color: '#111827'}}>Create Study Plan</h1>
          <p className="text-[#6B7280] text-sm mt-1">Build a complete learning experience for your students</p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {(['1. Basics', '2. Days', '3. Content'] as const).map((label, i) => {
            const step = (i + 1) as 1 | 2 | 3;
            const isActive = createStep === step;
            const isDone = createStep > step;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all"
                    style={{
                      background: isDone ? '#22C55E' : isActive ? '#1E88E5' : '#E5E7EB',
                      color: isDone || isActive ? 'white' : '#6B7280',
                      fontWeight: 700
                    }}
                  >
                    {isDone ? <CheckCircle className="w-4 h-4"/> : step}
                  </div>
                  <span className="text-sm hidden sm:block" style={{fontWeight: isActive ? 600 : 400, color: isActive ? '#111827' : '#6B7280'}}>
                    {label}
                  </span>
                </div>
                {i < 2 && <div className="flex-1 h-px min-w-8" style={{background: isDone ? '#22C55E' : '#E5E7EB'}}/>}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {createStep === 1 && (
            <motion.div key="step1" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
                <h2 className="text-base mb-4" style={{fontWeight: 600, color: '#111827'}}>Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1.5" style={{fontWeight: 500, color: '#374151'}}>Plan Title *</label>
                    <input
                      type="text"
                      placeholder="e.g., Business English A2→B1"
                      value={planTitle}
                      onChange={e => setPlanTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{fontWeight: 500, color: '#374151'}}>Description</label>
                    <textarea
                      rows={3}
                      placeholder="Describe what students will learn..."
                      value={planDesc}
                      onChange={e => setPlanDesc(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{fontWeight: 500, color: '#374151'}}>Status</label>
                    <div className="flex gap-3">
                      {(['draft', 'active'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => setPlanStatus(s)}
                          className="flex-1 py-2.5 rounded-xl border-2 text-sm transition-all capitalize"
                          style={{
                            borderColor: planStatus === s ? '#1E88E5' : '#E5E7EB',
                            background: planStatus === s ? '#EFF6FF' : 'white',
                            color: planStatus === s ? '#1E88E5' : '#6B7280',
                            fontWeight: planStatus === s ? 600 : 400
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => planTitle ? setCreateStep(2) : toast.error('Please enter a title')}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm"
                  style={{background: 'linear-gradient(135deg, #1E88E5, #42A5F5)', fontWeight: 600}}
                >
                  Next: Add Days <ArrowRight className="w-4 h-4"/>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Days */}
          {createStep === 2 && (
            <motion.div key="step2" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base" style={{fontWeight: 600, color: '#111827'}}>Study Days ({days.length} days)</h2>
                </div>
                <div className="space-y-3">
                  {days.map((day, idx) => (
                    <div key={day.id} className="border border-gray-100 rounded-xl p-4 bg-[#F8FAFC]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-white" style={{background: 'linear-gradient(135deg, #1E88E5, #42A5F5)', fontWeight: 700}}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={day.title}
                            onChange={e => setDays(days.map(d => d.id === day.id ? {...d, title: e.target.value} : d))}
                            className="w-full text-sm bg-transparent border-none outline-none"
                            style={{fontWeight: 600, color: '#111827'}}
                            placeholder="Day title"
                          />
                        </div>
                      </div>
                      <input
                        type="text"
                        value={day.description}
                        onChange={e => setDays(days.map(d => d.id === day.id ? {...d, description: e.target.value} : d))}
                        className="w-full text-xs bg-transparent border-none outline-none text-[#6B7280] ml-11"
                        placeholder="Brief description..."
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={addDay}
                  className="mt-3 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm text-[#6B7280] hover:border-[#1E88E5] hover:text-[#1E88E5] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4"/> Add Day
                </button>
              </div>
              <div className="flex justify-between">
                <button onClick={() => setCreateStep(1)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#6B7280] hover:bg-gray-50" style={{fontWeight: 500}}>Back</button>
                <button
                  onClick={() => setCreateStep(3)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm"
                  style={{background: 'linear-gradient(135deg, #1E88E5, #42A5F5)', fontWeight: 600}}
                >
                  Next: Add Content <ArrowRight className="w-4 h-4"/>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Content */}
          {createStep === 3 && (
            <motion.div key="step3" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
                <h2 className="text-base mb-4" style={{fontWeight: 600, color: '#111827'}}>Add Content to Days</h2>
                <div className="space-y-3">
                  {days.map(day => (
                    <div key={day.id} className="border border-gray-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedDay(expandedDay === day.id ? null : day.id)}
                        className="w-full flex items-center gap-3 p-4 bg-[#F8FAFC] hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-white" style={{background: 'linear-gradient(135deg, #1E88E5, #42A5F5)', fontWeight: 700}}>
                          {day.number}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm" style={{fontWeight: 600, color: '#111827'}}>{day.title}</div>
                          <div className="text-xs text-[#6B7280]">{day.content.length} content items</div>
                        </div>
                        {expandedDay === day.id ? <ChevronUp className="w-4 h-4 text-[#6B7280]"/> : <ChevronDown className="w-4 h-4 text-[#6B7280]"/>}
                      </button>

                      {expandedDay === day.id && (
                        <div className="p-4 space-y-3">
                          {/* Content items */}
                          {day.content.map(item => {
                            const config = contentTypeConfig[item.type];
                            const ItemIcon = config.icon;
                            return (
                              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background: config.bg}}>
                                  <ItemIcon className="w-4 h-4" style={{color: config.color}}/>
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs" style={{fontWeight: 600, color: '#111827'}}>{item.title}</div>
                                  <div className="text-xs" style={{color: config.color}}>{config.label}</div>
                                  {item.content && <div className="text-xs text-[#6B7280] mt-1 truncate">{item.content}</div>}
                                </div>
                                <div className="flex items-center gap-1">
                                  <button 
                                    onClick={() => openEditContent(day.id, item.id)}
                                    className="text-[#6B7280] hover:text-[#1E88E5] transition-colors"
                                    title="Edit content"
                                  >
                                    <Edit2 className="w-4 h-4"/>
                                  </button>
                                  <button onClick={() => removeContent(day.id, item.id)} className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors">
                                    <X className="w-4 h-4"/>
                                  </button>
                                </div>
                              </div>
                            );
                          })}

                          {/* Add content buttons */}
                          <div>
                            <div className="text-xs mb-2" style={{fontWeight: 500, color: '#6B7280'}}>Add content:</div>
                            <div className="flex flex-wrap gap-2">
                              {(Object.entries(contentTypeConfig) as [ContentType, typeof contentTypeConfig[ContentType]][]).map(([type, config]) => {
                                const BtnIcon = config.icon;
                                return (
                                  <button
                                    key={type}
                                    onClick={() => addContent(day.id, type)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all hover:shadow-sm"
                                    style={{
                                      borderColor: config.color + '30',
                                      background: config.bg,
                                      color: config.color,
                                      fontWeight: 500
                                    }}
                                  >
                                    <BtnIcon className="w-3 h-3"/>
                                    {config.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <button onClick={() => setCreateStep(2)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#6B7280] hover:bg-gray-50" style={{fontWeight: 500}}>Back</button>
                <button
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm shadow-lg shadow-[#1E88E5]/20 disabled:opacity-70"
                  style={{background: 'linear-gradient(135deg, #22C55E, #16A34A)', fontWeight: 600}}
                >
                  <Play className="w-4 h-4"/>{isSubmitting ? 'Creating...' : 'Publish Plan'}
                </button>
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
          <h1 className="text-xl lg:text-2xl" style={{fontWeight: 700, color: '#111827'}}>Study Plans</h1>
          <p className="text-[#6B7280] text-sm mt-0.5">{plans.length} plans total · {plans.filter(p => (p.studyPlanStatus || '').toLowerCase() === 'published').length} active</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm shadow-lg shadow-[#1E88E5]/20 hover:opacity-90 transition-opacity"
          style={{background: 'linear-gradient(135deg, #1E88E5, #42A5F5)', fontWeight: 600}}
        >
          <Plus className="w-4 h-4"/>
          <span className="hidden sm:inline">Create Plan</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {['All', 'Active', 'Draft', 'Completed'].map(tab => (
          <button
            key={tab}
            className="px-4 py-1.5 rounded-xl text-sm transition-all"
            style={{
              background: tab === 'All' ? '#1E88E5' : '#F3F4F6',
              color: tab === 'All' ? 'white' : '#6B7280',
              fontWeight: tab === 'All' ? 600 : 400
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {plans.map(plan => {
          const status = (plan.studyPlanStatus || 'draft').toLowerCase();
          const s = statusColors[status] || statusColors.draft;
          const dayCount = plan.days?.length ?? 0;
          const progress = status === 'published' ? 100 : 45;
          return (
            <motion.div
              key={plan.id || plan.title}
              layout
              className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50 hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
                  style={{background: s.bg, color: s.text, fontWeight: 600}}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{background: s.dot}}/>
                  <span className="capitalize">{status}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                  <Clock className="w-3.5 h-3.5"/>
                  {dayCount} days
                </div>
              </div>

              <h3 className="text-base mb-1.5" style={{fontWeight: 700, color: '#111827'}}>{plan.title || 'Untitled study plan'}</h3>
              <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">{plan.description || 'No description provided.'}</p>

              {plan.days && plan.days.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-3">
                  <div className="flex -space-x-1">
                    {Array.from({length: Math.min(3, plan.students)}).map((_, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-white text-[8px]"
                        style={{background: ['#1E88E5', '#22C55E', '#FFC107'][i], fontWeight: 700}}
                      >
                        {['A', 'M', 'D'][i]}
                      </div>
                    ))}
                  </div>
                  <span>{dayCount} days configured</span>
                </div>
              )}

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#6B7280]">Progress</span>
                  <span style={{fontWeight: 600, color: '#111827'}}>{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${progress}%`,
                      background: progress === 100 ? '#22C55E' : 'linear-gradient(90deg, #1E88E5, #42A5F5)'
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs border border-gray-200 hover:bg-gray-50 transition-colors"
                  style={{color: '#6B7280', fontWeight: 500}}
                >
                  <Eye className="w-3.5 h-3.5"/> View
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs border border-gray-200 hover:bg-gray-50 transition-colors"
                  style={{color: '#1E88E5', fontWeight: 500}}
                >
                  <Edit2 className="w-3.5 h-3.5"/> Edit
                </button>
                <button
                  onClick={() => setConfirmDelete(Number(plan.id) || 0)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-[#FEF2F2] hover:border-[#EF4444] transition-colors"
                  style={{color: '#9CA3AF'}}
                >
                  <Trash2 className="w-3.5 h-3.5"/>
                </button>
              </div>
            </motion.div>
          );
        })}

        {/* Empty create card */}
        <motion.button
          onClick={() => setShowCreate(true)}
          className="bg-white rounded-2xl p-5 border-2 border-dashed border-gray-200 hover:border-[#1E88E5] hover:bg-[#EFF6FF] transition-all flex flex-col items-center justify-center gap-3 min-h-48 group"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{background: '#EFF6FF'}}>
            <Plus className="w-6 h-6 text-[#1E88E5]"/>
          </div>
          <div className="text-center">
            <div className="text-sm" style={{fontWeight: 600, color: '#1E88E5'}}>Create New Plan</div>
            <div className="text-xs text-[#9CA3AF] mt-0.5">Build a custom learning path</div>
          </div>
        </motion.button>
      </div>

      {/* Edit content modal */}
      <AnimatePresence>
        {editingContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingContent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl"
            >
              <h3 className="text-lg mb-4" style={{fontWeight: 700, color: '#111827'}}>Edit Content</h3>
              <textarea
                value={editingText}
                onChange={e => setEditingText(e.target.value)}
                placeholder="Enter the content text..."
                rows={8}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all resize-none"
              />
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setEditingContent(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm"
                  style={{fontWeight: 500, color: '#6B7280'}}
                >
                  Cancel
                </button>
                <button 
                  onClick={saveEditContent}
                  className="flex-1 py-2.5 rounded-xl text-sm text-white"
                  style={{background: 'linear-gradient(135deg, #1E88E5, #42A5F5)', fontWeight: 600}}
                >
                  Save Content
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation dialog */}
      <AnimatePresence>
        {confirmDelete !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{background: '#FEF2F2'}}>
                <Trash2 className="w-6 h-6 text-[#EF4444]"/>
              </div>
              <h3 className="text-lg text-center mb-2" style={{fontWeight: 700, color: '#111827'}}>Delete Study Plan?</h3>
              <p className="text-sm text-[#6B7280] text-center mb-6">This action cannot be undone. All lessons and progress data will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm" style={{fontWeight: 500, color: '#6B7280'}}>
                  Cancel
                </button>
                <button
                  onClick={() => { toast.success('Plan deleted'); setConfirmDelete(null); }}
                  className="flex-1 py-2.5 rounded-xl text-sm text-white"
                  style={{background: '#EF4444', fontWeight: 600}}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
