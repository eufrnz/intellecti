import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Calendar, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import type { AppView, NavigationProps } from '../../App';
import { fetchStudentAssignments, type AssignmentStudentResponseDTO } from '../../services/StudentAssignmentService';

export function AssignmentScreen({ navigate }: NavigationProps) {
  const [assignments, setAssignments] = useState<AssignmentStudentResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAssignments() {
      try {
        setLoading(true);
        const data = await fetchStudentAssignments();
        setAssignments(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Erro ao carregar atribuições.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadAssignments();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleAssignmentClick = (assignmentId: string) => {
  if (navigate) {
    // Força o TypeScript a aceitar a string dinâmica
    navigate(`student/assignment/${assignmentId}` as AppView);
  }
};

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-[#6B7280]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1E88E5]" />
        <p className="text-sm font-medium">Carregando suas tarefas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 max-w-md mx-auto my-8 bg-red-50 rounded-2xl border border-red-100">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
        <p className="font-semibold text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Minhas Tarefas</h1>
        <p className="text-sm text-[#6B7280]">
          {assignments.length > 0 
            ? `Você possui ${assignments.length} ${assignments.length === 1 ? 'plano atribuído' : 'planos atribuídos'}.`
            : 'Acompanhe seus planos de estudos atribuídos.'}
        </p>
      </div>

      {/* Lista de Atribuições */}
      {assignments.length > 0 ? (
        <div className="space-y-3">
          {assignments.map((assignment) => {
            const progress = assignment.percentage ?? 0;

            return (
              <motion.button
                key={assignment.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleAssignmentClick(assignment.id)}
                className="w-full bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 text-left transition-all hover:border-[#1E88E5]/40 hover:shadow-[0_4px_20px_rgba(30,136,229,0.08)]"
              >
                <div className="flex items-start gap-4">
                  {/* Ícone Indicador */}
                  <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 text-[#1E88E5] mt-0.5">
                    <BookOpen className="w-5 h-5" />
                  </div>

                  {/* Detalhes da Tarefa */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-[#1E88E5] tracking-wider uppercase">
                        Plano de Estudo
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-[#111827] truncate mb-1">
                      {assignment.studyPlanTitle}
                    </h2>

                    <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Disp: {formatDate(assignment.availableAt)}</span>
                      <span>·</span>
                      <span className="font-semibold text-gray-700">Entrega: {formatDate(assignment.dueDate)}</span>
                    </div>

                    {/* Barra de Progresso em Linha */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#6B7280]">Progresso</span>
                        <span className="font-bold text-[#1E88E5]">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${progress}%`, 
                            background: 'linear-gradient(90deg, #1E88E5, #42A5F5)' 
                          }} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gráfico Circular + Seta */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="relative w-12 h-12 hidden sm:block">
                      <svg viewBox="0 0 64 64" className="w-12 h-12 -rotate-90">
                        <circle cx="32" cy="32" r="26" fill="none" stroke="#E5E7EB" strokeWidth="6" />
                        <circle 
                          cx="32" 
                          cy="32" 
                          r="26" 
                          fill="none" 
                          stroke="#1E88E5" 
                          strokeWidth="6"
                          strokeDasharray={`${2 * Math.PI * 26}`}
                          strokeDashoffset={`${2 * Math.PI * 26 * (1 - progress / 100)}`}
                          strokeLinecap="round" 
                          className="transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#111827]">
                        {progress}%
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-[#9CA3AF] my-auto" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center my-6 text-[#6B7280]">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium text-gray-700 mb-1">Nenhuma tarefa encontrada</p>
          <p className="text-sm text-gray-400">Você não tem planos de estudos atribuídos no momento.</p>
        </div>
      )}
    </div>
  );
}