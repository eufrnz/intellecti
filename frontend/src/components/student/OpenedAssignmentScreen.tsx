import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileText,
  Loader2,
  AlertCircle,
  User,
} from 'lucide-react';
import type { AppView, NavigationProps } from '../../App';
import { fetchOpenedStudentAssignment, type OpenedStudyPlanResponseDTO, type StudyPlanResponseDTO } from '../../services/StudentAssignmentService';

interface OpenedAssignmentScreenProps extends NavigationProps {
  assignmentId?: string;
}

export function OpenedAssignmentScreen({ navigate, assignmentId, params }: OpenedAssignmentScreenProps) {
  const currentAssignmentId = assignmentId || (params?.assignmentId as string);

  const [data, setData] = useState<StudyPlanResponseDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const initialSelection = useRef(true);

  useEffect(() => {
    async function loadOpenedAssignment() {
      if (!currentAssignmentId) {
        setError('ID da tarefa não foi fornecido.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result: OpenedStudyPlanResponseDTO = await fetchOpenedStudentAssignment(currentAssignmentId);
        setData(result.studyPlanResponseDTO);
        setSelectedDayId(result.studyPlanResponseDTO.days?.[0]?.id ?? null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocorreu um erro ao carregar o plano de estudos.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadOpenedAssignment();
  }, [currentAssignmentId]);

  const selectDay = (dayId: string) => {
    setSelectedDayId(dayId);
  };

  const selectedDay = data?.days.find((day) => day.id === selectedDayId) ?? data?.days?.[0] ?? null;

  useEffect(() => {
    if (!selectedDay || initialSelection.current) {
      initialSelection.current = false;
      return;
    }

    if (window.matchMedia('(max-width: 768px)').matches) {
      window.requestAnimationFrame(() => {
        if (!contentRef.current) return;
        const headerOffset = 128;
        const elementPosition = contentRef.current.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      });
    }
  }, [selectedDay]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-[#6B7280]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1E88E5]" />
        <p className="text-sm font-medium">Carregando plano de estudos...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center text-red-500 max-w-md mx-auto my-8 bg-red-50 rounded-2xl border border-red-100">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
        <p className="font-semibold text-sm">{error || 'Plano de estudos não encontrado.'}</p>
        <button 
          onClick={() => navigate('student/assignment' as AppView)} 
          className="mt-4 px-4 py-2 bg-[#1E88E5] text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Voltar para minhas tarefas
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1E88E5]">
            <BookOpen className="w-3.5 h-3.5" />
            Plano de Estudos
          </span>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <User className="w-3.5 h-3.5" />
            <span>Professor: <strong className="text-gray-700">{data.teacher.username}</strong></span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-[#111827] mb-2">{data.title}</h1>
          <p className="text-sm text-[#6B7280] leading-relaxed">{data.description}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]">Dias do plano</div>
              <div className="mt-2 text-sm text-[#111827]">Clique em um dia para ver o conteúdo.</div>
            </div>
            <div className="divide-y divide-gray-100">
              {data.days.map((day) => {
                const isActive = day.id === selectedDayId;
                return (
                  <button
                    key={day.id}
                    onClick={() => selectDay(day.id)}
                    className={`w-full text-left px-5 py-4 transition-colors ${isActive ? 'bg-[#EFF6FF] text-[#111827]' : 'bg-white text-[#4B5563] hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">Dia {day.number}</div>
                        <div className="text-xs text-[#6B7280] mt-1">{day.title}</div>
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-2xl bg-white border border-gray-200 text-[#6B7280]">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-[#6B7280]">{day.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5">
            <div className="flex items-center justify-between text-xs text-[#6B7280]">
              <span>Status</span>
              <span className="font-semibold text-[#111827]">{data.studyPlanStatus}</span>
            </div>
            <div className="mt-4 text-sm text-[#4B5563] space-y-2">
              <div>
                <span className="font-semibold text-[#111827]">Criado em:</span> {new Date(data.createdAt).toLocaleDateString('pt-BR')}
              </div>
              <div>
                <span className="font-semibold text-[#111827]">Atualizado em:</span> {new Date(data.updatedAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </aside>

        <section className="space-y-4" ref={contentRef}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#111827]">{selectedDay.title}</h2>
                <p className="text-sm text-[#6B7280]">Dia {selectedDay.number} · {selectedDay.description}</p>
              </div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F1FF] text-xs font-semibold text-[#1E88E5]">
                <CheckCircle2 className="w-4 h-4" />
                {selectedDay.contents.length} {selectedDay.contents.length === 1 ? 'conteúdo' : 'conteúdos'}
              </span>
            </div>

            {selectedDay.contents.length > 0 ? (
              <div className="space-y-4 mt-5">
                {selectedDay.contents
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((content) => (
                    <div key={content.id} className="bg-[#F8FAFC] rounded-3xl p-4 border border-gray-100">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-base font-semibold text-[#111827]">{content.title}</h3>
                          <p className="text-xs text-[#6B7280]">Leitura {content.orderIndex}</p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E88E5]">
                          <FileText className="w-4 h-4" /> Conteúdo
                        </span>
                      </div>
                      <div className="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap">{content.content}</div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-6 text-center text-sm text-[#6B7280] mt-5">
                Nenhum conteúdo disponível para este dia.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}