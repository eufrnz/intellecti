import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Filter, Calendar, Users, Clock, CheckCircle, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import type { NavigationProps } from '../../App';
import { 
  createAssignment, 
  fetchAllStudents, 
  fetchAssignments, 
  type StudentResponse 
} from '../../services/assignmentService';
import { fetchStudyPlans, type StudyPlanResponse } from '../../services/lessonService';

// Tipagem da resposta de tarefa vinda do seu backend
export interface AssignmentResponse {
  id: string;
  studyPlanTitle: string;
  availableAt: string; // formato "DD/MM/YYYY" ou "YYYY-MM-DD"
  dueDate: string;     // formato "DD/MM/YYYY" ou "YYYY-MM-DD"
  studentsId: string[];  // Lista com IDs ou objetos dos alunos
  // Caso sua API já traga esses campos adicionais do banco, adicione-os aqui:
  name?: string;
  status?: string;
  completionRate?: number;
  avgGrade?: number;
}

const statusConfig: Record<string, {bg: string; text: string; dot: string; label: string}> = {
  active: { bg: '#F0FDF4', text: '#22C55E', dot: '#22C55E', label: 'Active' },
  upcoming: { bg: '#FFFBEB', text: '#F59E0B', dot: '#F59E0B', label: 'Upcoming' },
  completed: { bg: '#EFF6FF', text: '#1E88E5', dot: '#1E88E5', label: 'Completed' },
  draft: { bg: '#F9FAFB', text: '#6B7280', dot: '#9CA3AF', label: 'Draft' },
};

// Converte "YYYY-MM-DD" para "DD/MM/YYYY"
const formatDateToBR = (dateStr: string): string => {
  if (!dateStr) return '';
  if (dateStr.includes('/')) return dateStr; // Já está formatada
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

export function Assignments({ navigate }: NavigationProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  
  // Estado que guardará as tarefas vindas do seu banco
  const [assignmentsList, setAssignmentsList] = useState<AssignmentResponse[]>([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);

  const [createForm, setCreateForm] = useState({
    planId: '',
    availableDate: '',
    dueDate: '',
    status: 'active',
  });
  const [availablePlans, setAvailablePlans] = useState<StudyPlanResponse[]>([]);
  const [studentsList, setStudentsList] = useState<StudentResponse[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSavingAssignment, setIsSavingAssignment] = useState(false);

  // Carrega todos os dados necessários da API ao montar a tela
  const loadData = async () => {
    setIsLoadingStudents(true);
    setIsLoadingAssignments(true);
    try {
      const [plans, students, dbAssignments] = await Promise.all([
        fetchStudyPlans(), 
        fetchAllStudents(),
        fetchAssignments()
      ]);
      setAvailablePlans(plans);
      setStudentsList(students);
      setAssignmentsList(dbAssignments);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar os dados do servidor.');
    } finally {
      setIsLoadingStudents(false);
      setIsLoadingAssignments(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  // Filtra as tarefas vindas do banco baseado na busca e no status selecionado
  const filtered = assignmentsList.filter(a => {
    const nameToSearch = (a.name || a.studyPlanTitle || '').toLowerCase();
    const planToSearch = (a.studyPlanTitle || '').toLowerCase();
    const matchesSearch = nameToSearch.includes(searchQuery.toLowerCase()) || planToSearch.includes(searchQuery.toLowerCase());
    
    // Tratativa caso o banco ainda não retorne um status estruturado
    const currentStatus = a.status || 'active'; 
    const matchesStatus = selectedStatus === 'all' || currentStatus === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId) ? prev.filter(s => s !== studentId) : [...prev, studentId]
    );
  };

  const handleCreate = async () => {
    if (!createForm.planId) { toast.error('Please select a study plan'); return; }
    if (selectedStudents.length === 0) { toast.error('Please select at least one student'); return; }
    if (!createForm.dueDate) { toast.error('Please set a due date'); return; }

    const selectedPlan = availablePlans.find(plan => plan.id === createForm.planId);
    if (!selectedPlan?.id) {
      toast.error('Plano de estudo inválido.');
      return;
    }

    setIsSavingAssignment(true);

    const rawAvailableDate = createForm.availableDate || new Date().toISOString().split('T')[0];

    try {
      await createAssignment({
        studyPlanId: selectedPlan.id,
        availableAt: formatDateToBR(rawAvailableDate),
        dueDate: formatDateToBR(createForm.dueDate),
        students: selectedStudents,
      });
      
      toast.success('Assignment publicado com sucesso!');
      setShowCreate(false);
      setSelectedStudents([]);
      setCreateForm({ planId: '', availableDate: '', dueDate: '', status: 'active' });
      
      // Recarrega a lista para mostrar a nova tarefa na hora
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error('Falha ao publicar a assignment.');
    } finally {
      setIsSavingAssignment(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl" style={{fontWeight: 700, color: '#111827'}}>Assignments</h1>
          <p className="text-[#6B7280] text-sm mt-0.5">
            {assignmentsList.length} total · {assignmentsList.filter(a => (a.status || 'active') === 'active').length} active
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm shadow-lg shadow-[#1E88E5]/20"
          style={{background: 'linear-gradient(135deg, #1E88E5, #42A5F5)', fontWeight: 600}}
        >
          <Plus className="w-4 h-4"/>
          <span className="hidden sm:inline">New Assignment</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"/>
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'upcoming', 'completed'].map(s => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className="px-3 py-2 rounded-xl text-xs capitalize transition-all hidden sm:block"
              style={{
                background: selectedStatus === s ? '#1E88E5' : '#F3F4F6',
                color: selectedStatus === s ? 'white' : '#6B7280',
                fontWeight: selectedStatus === s ? 600 : 400
              }}
            >
              {s}
            </button>
          ))}
          <button className="sm:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-[#6B7280]">
            <Filter className="w-4 h-4"/>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoadingAssignments ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#1E88E5] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        /* Assignment cards */
        <div className="space-y-3">
          {filtered.map(assignment => {
            const statusKey = assignment.status || 'active';
            const s = statusConfig[statusKey] || statusConfig.active;
            const totalStudents = assignment.studentsId ? assignment.studentsId.length : 0;
            const compRate = assignment.completionRate ?? 0;
            const avgG = assignment.avgGrade ?? 0;

            return (
              <motion.div
                key={assignment.id}
                layout
                className="bg-white rounded-2xl p-4 lg:p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-base" style={{fontWeight: 700, color: '#111827'}}>
                        {assignment.name || `Task - ${assignment.studyPlanTitle}`}
                      </h3>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs" style={{background: s.bg, color: s.text, fontWeight: 600}}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{background: s.dot}}/>
                        {s.label}
                      </div>
                    </div>
                    <div className="text-xs text-[#6B7280] mb-2">{assignment.studyPlanTitle}</div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5"/> {totalStudents} students</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/> Due {assignment.dueDate}</span>
                      {avgG > 0 && (
                        <span className="flex items-center gap-1 text-[#22C55E]"><CheckCircle className="w-3.5 h-3.5"/> Avg {avgG}%</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Progress ring */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-12 h-12">
                        <svg viewBox="0 0 48 48" className="w-12 h-12 -rotate-90">
                          <circle cx="24" cy="24" r="20" fill="none" stroke="#F3F4F6" strokeWidth="4"/>
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            fill="none"
                            stroke={compRate === 100 ? '#22C55E' : '#1E88E5'}
                            strokeWidth="4"
                            strokeDasharray={`${2 * Math.PI * 20}`}
                            strokeDashoffset={`${2 * Math.PI * 20 * (1 - compRate / 100)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-xs" style={{fontWeight: 700, color: '#111827'}}>
                          {compRate}%
                        </div>
                      </div>
                      <div className="text-[10px] text-[#9CA3AF] mt-0.5">Done</div>
                    </div>

                    <button
                      onClick={() => navigate('teacher/students')}
                      className="px-3 py-2 rounded-xl text-xs border border-gray-200 hover:bg-[#EFF6FF] hover:border-[#1E88E5] hover:text-[#1E88E5] transition-all"
                      style={{fontWeight: 500, color: '#6B7280'}}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!isLoadingAssignments && filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background: '#F3F4F6'}}>
            <Clock className="w-8 h-8 text-[#9CA3AF]"/>
          </div>
          <h3 className="text-base mb-2" style={{fontWeight: 600, color: '#111827'}}>No assignments found</h3>
          <p className="text-sm text-[#6B7280]">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Create Assignment Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl" style={{fontWeight: 700, color: '#111827'}}>Create Assignment</h2>
                <button onClick={() => setShowCreate(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-[#6B7280]">
                  <X className="w-5 h-5"/>
                </button>
              </div>

              <div className="space-y-4">
                {/* Study Plan select */}
                <div>
                  <label className="block text-sm mb-1.5" style={{fontWeight: 500, color: '#374151'}}>Study Plan *</label>
                  <div className="relative">
                    <select
                      value={createForm.planId}
                      onChange={e => setCreateForm({...createForm, planId: e.target.value})}
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] appearance-none text-sm"
                      style={{color: createForm.planId ? '#111827' : '#9CA3AF'}}
                    >
                      <option value="">Select a study plan...</option>
                      {availablePlans.map(plan => (
                        <option key={plan.id} value={plan.id}>
                          {plan.title ?? `Plano #${plan.id}`}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none"/>
                  </div>
                </div>

                {/* Students */}
                <div>
                  <label className="block text-sm mb-1.5" style={{fontWeight: 500, color: '#374151'}}>
                    Select Students * <span className="text-[#6B7280]">({selectedStudents.length} selected)</span>
                  </label>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="p-3 bg-[#F8FAFC] flex flex-wrap gap-1.5">
                      {selectedStudents.map(studentId => {
                        const student = studentsList.find(s => s.id === studentId);
                        return (
                          <span key={studentId} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-white" style={{background: '#42A5F5', fontWeight: 500}}>
                            {student ? `${student.firstName ?? student.username ?? 'Aluno'} ${student.lastName ?? ''}`.trim() : 'Aluno'}
                            <button onClick={() => toggleStudent(studentId)}><X className="w-3 h-3"/></button>
                          </span>
                        );
                      })}
                    </div>
                    <div className="max-h-32 overflow-y-auto divide-y divide-gray-50">
                      {studentsList.map(student => {
                        const studentName = `${student.firstName ?? student.username ?? 'Aluno'} ${student.lastName ?? ''}`.trim();
                        return (
                          <button
                            key={student.id}
                            type="button"
                            onClick={() => toggleStudent(student.id)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F8FAFC] transition-colors"
                          >
                            <div
                              className="w-4 h-4 rounded flex items-center justify-center border transition-all"
                              style={{
                                borderColor: selectedStudents.includes(student.id) ? '#1E88E5' : '#D1D5DB',
                                background: selectedStudents.includes(student.id) ? '#1E88E5' : 'white',
                              }}
                            >
                              {selectedStudents.includes(student.id) && <CheckCircle className="w-3 h-3 text-white"/>}
                            </div>
                            <span className="text-sm" style={{color: '#111827'}}>{studentName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm mb-1.5" style={{fontWeight: 500, color: '#374151'}}>Available Date</label>
                    <input
                      type="date"
                      value={createForm.availableDate}
                      onChange={e => setCreateForm({...createForm, availableDate: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{fontWeight: 500, color: '#374151'}}>Due Date *</label>
                    <input
                      type="date"
                      value={createForm.dueDate}
                      onChange={e => setCreateForm({...createForm, dueDate: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] text-sm"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm mb-2" style={{fontWeight: 500, color: '#374151'}}>Status</label>
                  <div className="flex gap-3">
                    {(['draft', 'active'] as const).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setCreateForm({...createForm, status: s})}
                        className="flex-1 py-2.5 rounded-xl border-2 text-sm capitalize transition-all"
                        style={{
                          borderColor: createForm.status === s ? '#1E88E5' : '#E5E7EB',
                          background: createForm.status === s ? '#EFF6FF' : 'white',
                          color: createForm.status === s ? '#1E88E5' : '#6B7280',
                          fontWeight: createForm.status === s ? 600 : 400
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowCreate(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm" style={{fontWeight: 500, color: '#6B7280'}}>
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={isSavingAssignment}
                  className="flex-1 py-3 rounded-xl text-white text-sm shadow-lg shadow-[#1E88E5]/20 disabled:opacity-50"
                  style={{background: 'linear-gradient(135deg, #1E88E5, #42A5F5)', fontWeight: 600}}
                >
                  {isSavingAssignment ? 'Publishing...' : 'Publish Assignment'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}