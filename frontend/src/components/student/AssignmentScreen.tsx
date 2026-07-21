import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, CheckCircle, Lock, Clock, ChevronRight, BookOpen,
  HelpCircle, Dumbbell, Video, Play, ArrowRight, X, Star, Zap
} from 'lucide-react';
import type { NavigationProps } from '../../App';
import confetti from 'canvas-confetti';

type ScreenType = 'list' | 'lesson' | 'quiz' | 'exercise' | 'complete';

interface Lesson {
  id: number;
  title: string;
  type: 'lesson' | 'quiz' | 'exercise' | 'video' | 'reading';
  duration: string;
  status: 'completed' | 'current' | 'pending' | 'locked';
  points: number;
}

const lessons: Lesson[] = [
  { id: 1, title: 'Introduction to Business Grammar', type: 'lesson', duration: '8 min', status: 'completed', points: 50 },
  { id: 2, title: 'Professional Email Writing', type: 'video', duration: '12 min', status: 'completed', points: 60 },
  { id: 3, title: 'Present Perfect Tense', type: 'lesson', duration: '10 min', status: 'completed', points: 50 },
  { id: 4, title: 'Grammar Quiz #1', type: 'quiz', duration: '15 min', status: 'current', points: 100 },
  { id: 5, title: 'Conditional Sentences', type: 'lesson', duration: '12 min', status: 'pending', points: 50 },
  { id: 6, title: 'Vocabulary Building Exercise', type: 'exercise', duration: '10 min', status: 'locked', points: 75 },
  { id: 7, title: 'Business Writing Quiz', type: 'quiz', duration: '20 min', status: 'locked', points: 100 },
  { id: 8, title: 'IELTS Reading Passage', type: 'reading', duration: '25 min', status: 'locked', points: 80 },
];

const typeConfig = {
  lesson: { icon: BookOpen, color: '#1E88E5', bg: '#EFF6FF', label: 'Lesson' },
  quiz: { icon: HelpCircle, color: '#FFC107', bg: '#FFFBEB', label: 'Quiz' },
  exercise: { icon: Dumbbell, color: '#22C55E', bg: '#F0FDF4', label: 'Exercise' },
  video: { icon: Video, color: '#8B5CF6', bg: '#F5F3FF', label: 'Video' },
  reading: { icon: BookOpen, color: '#EF4444', bg: '#FEF2F2', label: 'Reading' },
};

const quizQuestions = [
  {
    id: 1,
    question: 'Which sentence correctly uses the Present Perfect tense?',
    options: [
      'I did my homework yesterday.',
      'I have finished my homework.',
      'I am finishing my homework.',
      'I finish my homework every day.',
    ],
    correct: 1,
    explanation: 'The Present Perfect (have + past participle) is used for actions completed at an unspecified time or actions with present relevance. "I have finished my homework" correctly uses this structure.',
    points: 25,
  },
  {
    id: 2,
    question: 'In a formal email, which greeting is most appropriate?',
    options: [
      'Hey there!',
      'Yo, what\'s up?',
      'Dear Mr. Johnson,',
      'Hi buddy,',
    ],
    correct: 2,
    explanation: 'In formal business correspondence, "Dear [Title] [Surname]" is the standard professional greeting. It shows respect and maintains a professional tone.',
    points: 25,
  },
];

const lessonContent = `
# Present Perfect Tense in Business English

The **Present Perfect** tense connects the past with the present. It's essential for professional communication.

## When to Use It

Use the Present Perfect when:
- Talking about experiences without specifying when
- Describing recent events that affect the present
- Discussing achievements and accomplishments

## Key Examples

✓ **"We have launched the new product."** (recent event)
✓ **"I have sent the report."** (completed action, relevant now)
✓ **"The team has made significant progress."** (achievement)

## Structure

*Subject + have/has + past participle*

| Subject | Auxiliary | Past Participle |
|---------|-----------|-----------------|
| I/You/We/They | have | worked |
| He/She/It | has | worked |

## Common Mistakes to Avoid

❌ "I have gone there yesterday." ← Wrong (specific time = Simple Past)
✓ "I went there yesterday." ← Correct
`;

const exerciseData = {
  question: 'Complete the sentence using the Present Perfect tense:\n\n"The board of directors ___ (approve) the new budget proposal."',
  answer: 'has approved',
  explanation: 'We use "has" (not "have") because "The board of directors" is treated as a singular noun in British English business writing. The past participle of "approve" is "approved".',
};

export function AssignmentScreen({ currentView, navigate }: NavigationProps) {
  const [screen, setScreen] = useState<ScreenType>(
    currentView === 'student/quiz' ? 'quiz'
    : currentView === 'student/exercise' ? 'exercise'
    : currentView === 'student/lesson' ? 'lesson'
    : 'list'
  );
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [exerciseAnswer, setExerciseAnswer] = useState('');
  const [exerciseFeedback, setExerciseFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);

  const completedCount = lessons.filter(l => l.status === 'completed').length;
  const progress = Math.round((completedCount / lessons.length) * 100);

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.status === 'locked') return;
    setSelectedLesson(lesson);
    if (lesson.type === 'quiz') setScreen('quiz');
    else if (lesson.type === 'exercise') setScreen('exercise');
    else setScreen('lesson');
  };

  const handleAnswerSelect = (idx: number) => {
    if (showExplanation) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    const isCorrect = idx === quizQuestions[quizIndex].correct;
    if (isCorrect) {
      const pts = quizQuestions[quizIndex].points;
      setScore(score + pts);
      setEarnedPoints(pts);
      setTimeout(() => setEarnedPoints(null), 2000);
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(quizIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setScreen('complete');
    }
  };

  const handleExerciseSubmit = () => {
    const isCorrect = exerciseAnswer.trim().toLowerCase() === exerciseData.answer.toLowerCase();
    setExerciseFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setEarnedPoints(75);
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => setEarnedPoints(null), 2000);
    }
  };

  // === QUIZ SCREEN ===
  if (screen === 'quiz') {
    const q = quizQuestions[quizIndex];
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setScreen('list')} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-[#6B7280]">
            <X className="w-5 h-5"/>
          </button>
          <div className="flex-1">
            <div className="text-xs text-[#6B7280] mb-1">Grammar Quiz #1 · Question {quizIndex + 1}/{quizQuestions.length}</div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div className="h-1.5 rounded-full transition-all" style={{width: `${((quizIndex) / quizQuestions.length) * 100}%`, background: '#FFC107'}}/>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-xl" style={{background: '#FFFBEB', color: '#F59E0B', fontWeight: 700}}>
            <Star className="w-4 h-4"/> {score} pts
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-6 max-w-2xl mx-auto w-full">
          {/* Points animation */}
          <AnimatePresence>
            {earnedPoints !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-white text-sm z-50"
                style={{background: '#22C55E', fontWeight: 700}}
              >
                +{earnedPoints} points! 🎉
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            key={quizIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5 pt-4"
          >
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{background: '#FFFBEB'}}>
                  <HelpCircle className="w-4 h-4 text-[#FFC107]"/>
                </div>
                <span className="text-xs text-[#6B7280]" style={{fontWeight: 500}}>Multiple Choice</span>
              </div>
              <h2 className="text-base" style={{fontWeight: 600, color: '#111827', lineHeight: 1.6}}>{q.question}</h2>
            </div>

            <div className="space-y-3">
              {q.options.map((option, idx) => {
                let bg = 'white';
                let border = '#E5E7EB';
                let color = '#111827';
                if (showExplanation) {
                  if (idx === q.correct) { bg = '#F0FDF4'; border = '#22C55E'; color = '#22C55E'; }
                  else if (idx === selectedAnswer && idx !== q.correct) { bg = '#FEF2F2'; border = '#EF4444'; color = '#EF4444'; }
                } else if (selectedAnswer === idx) {
                  bg = '#EFF6FF'; border = '#1E88E5'; color = '#1E88E5';
                }

                return (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerSelect(idx)}
                    className="w-full text-left p-4 rounded-xl border-2 transition-all"
                    style={{ background: bg, borderColor: border, color }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 border"
                        style={{
                          borderColor: border,
                          background: showExplanation && idx === q.correct ? '#22C55E'
                            : showExplanation && idx === selectedAnswer && idx !== q.correct ? '#EF4444'
                            : 'transparent',
                          color: showExplanation && (idx === q.correct || (idx === selectedAnswer && idx !== q.correct)) ? 'white' : color,
                          fontWeight: 700
                        }}
                      >
                        {['A','B','C','D'][idx]}
                      </div>
                      <span className="text-sm" style={{fontWeight: 500}}>{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 border"
                  style={{
                    background: selectedAnswer === q.correct ? '#F0FDF4' : '#FEF2F2',
                    borderColor: selectedAnswer === q.correct ? '#22C55E' : '#EF4444',
                  }}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{color: selectedAnswer === q.correct ? '#22C55E' : '#EF4444'}}/>
                    <div className="text-sm" style={{fontWeight: 600, color: selectedAnswer === q.correct ? '#22C55E' : '#EF4444'}}>
                      {selectedAnswer === q.correct ? 'Correct! Well done! 🎉' : 'Not quite right'}
                    </div>
                  </div>
                  <p className="text-sm text-[#374151] ml-6">{q.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {showExplanation && (
              <button
                onClick={handleNextQuestion}
                className="w-full py-3.5 rounded-xl text-white shadow-lg shadow-[#1E88E5]/20"
                style={{background: 'linear-gradient(135deg, #1E88E5, #42A5F5)', fontWeight: 600}}
              >
                {quizIndex < quizQuestions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
              </button>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // === LESSON SCREEN ===
  if (screen === 'lesson') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-4 py-3 flex items-center gap-3 z-10">
          <button onClick={() => setScreen('list')} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-[#6B7280]">
            <ArrowLeft className="w-5 h-5"/>
          </button>
          <div className="flex-1">
            <div className="text-sm" style={{fontWeight: 600, color: '#111827'}}>Present Perfect Tense</div>
            <div className="text-xs text-[#6B7280] flex items-center gap-1">
              <Clock className="w-3 h-3"/> 10 min read
            </div>
          </div>
          {/* Reading progress */}
          <div className="text-xs text-[#6B7280]">Day 4 of 30</div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 h-1">
          <div className="h-1" style={{width: '45%', background: 'linear-gradient(90deg, #1E88E5, #42A5F5)'}}/>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8 lg:px-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{background: '#EFF6FF'}}>
                <BookOpen className="w-3.5 h-3.5 text-[#1E88E5]"/>
              </div>
              <span className="text-xs text-[#6B7280]" style={{fontWeight: 500}}>Lesson · Day 4</span>
            </div>
          </div>

          {/* Lesson content - styled markdown */}
          <div className="prose max-w-none space-y-4" style={{color: '#111827'}}>
            <h1 style={{fontWeight: 800, fontSize: '28px', lineHeight: 1.3, color: '#111827'}}>
              Present Perfect Tense in Business English
            </h1>
            <p className="text-[#6B7280]" style={{lineHeight: 1.8}}>
              The <strong style={{color: '#111827'}}>Present Perfect</strong> tense connects the past with the present. It's essential for professional communication.
            </p>

            <div className="rounded-2xl p-5 border-l-4" style={{background: '#EFF6FF', borderColor: '#1E88E5'}}>
              <h3 className="mb-3" style={{fontWeight: 700, color: '#1E88E5', fontSize: '14px'}}>When to Use It</h3>
              <ul className="space-y-1.5 text-sm" style={{color: '#374151'}}>
                {['Talking about experiences without specifying when', 'Describing recent events that affect the present', 'Discussing achievements and accomplishments'].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{background: '#1E88E5'}}/>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <h2 style={{fontWeight: 700, color: '#111827', fontSize: '20px', marginTop: '24px'}}>Key Examples</h2>
            <div className="space-y-2">
              {[
                '"We have launched the new product." (recent event)',
                '"I have sent the report." (completed, relevant now)',
                '"The team has made significant progress." (achievement)',
              ].map(ex => (
                <div key={ex} className="flex items-start gap-3 p-3 rounded-xl" style={{background: '#F8FAFC'}}>
                  <CheckCircle className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0"/>
                  <span className="text-sm" style={{color: '#111827'}}>{ex}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-100 mt-4">
              <div className="px-4 py-3" style={{background: '#F8FAFC'}}>
                <span className="text-xs" style={{fontWeight: 700, color: '#6B7280'}}>STRUCTURE</span>
              </div>
              <div className="p-4">
                <div className="text-center p-4 rounded-xl" style={{background: '#EFF6FF'}}>
                  <span className="text-lg" style={{fontWeight: 700, color: '#1E88E5'}}>Subject + have/has + past participle</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                  {[['I/You/We/They', 'have worked'], ['He/She/It', 'has worked']].map(([sub, verb]) => (
                    <div key={sub} className="p-3 rounded-xl border border-gray-100 text-center">
                      <div style={{fontWeight: 600, color: '#111827'}}>{sub}</div>
                      <div className="text-[#1E88E5] mt-1" style={{fontWeight: 700}}>{verb}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{background: '#FEF2F2'}}>
              <h3 className="mb-3" style={{fontWeight: 700, color: '#EF4444', fontSize: '14px'}}>Common Mistakes to Avoid</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2" style={{color: '#EF4444'}}><X className="w-4 h-4 mt-0.5 flex-shrink-0"/> "I have gone there yesterday." ← Wrong (specific time = Simple Past)</div>
                <div className="flex items-start gap-2" style={{color: '#22C55E'}}><CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0"/> "I went there yesterday." ← Correct</div>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-3 mt-10">
            <button
              onClick={() => setScreen('list')}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm hover:bg-gray-50 transition-colors"
              style={{fontWeight: 500, color: '#6B7280'}}
            >
              ← Previous
            </button>
            <button
              onClick={() => { setScreen('list'); }}
              className="flex-1 py-3 rounded-xl text-white text-sm shadow-lg shadow-[#22C55E]/20"
              style={{background: 'linear-gradient(135deg, #22C55E, #16A34A)', fontWeight: 600}}
            >
              ✓ Complete Lesson
            </button>
            <button
              onClick={() => setScreen('list')}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm hover:bg-gray-50 transition-colors"
              style={{fontWeight: 500, color: '#6B7280'}}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === EXERCISE SCREEN ===
  if (screen === 'exercise') {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setScreen('list')} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-[#6B7280]">
            <X className="w-5 h-5"/>
          </button>
          <div className="flex-1">
            <div className="text-sm" style={{fontWeight: 600, color: '#111827'}}>Vocabulary Building Exercise</div>
            <div className="text-xs text-[#6B7280]">Fill in the blank</div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 lg:p-6 space-y-5 pt-6">
          <AnimatePresence>
            {earnedPoints !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-white text-sm z-50"
                style={{background: '#22C55E', fontWeight: 700}}
              >
                +{earnedPoints} points! 🎉
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{background: '#F0FDF4'}}>
                <Dumbbell className="w-4 h-4 text-[#22C55E]"/>
              </div>
              <span className="text-xs" style={{fontWeight: 500, color: '#22C55E'}}>Exercise</span>
            </div>
            <h2 className="text-base mb-1" style={{fontWeight: 700, color: '#111827'}}>Complete the sentence</h2>
            <p className="text-sm text-[#6B7280] whitespace-pre-line">{exerciseData.question}</p>
          </div>

          <div>
            <label className="block text-sm mb-2" style={{fontWeight: 500, color: '#374151'}}>Your answer:</label>
            <textarea
              rows={3}
              value={exerciseAnswer}
              onChange={e => { setExerciseAnswer(e.target.value); setExerciseFeedback(null); }}
              placeholder="Type your answer here..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all resize-none text-sm"
            />
          </div>

          {!exerciseFeedback ? (
            <button
              onClick={handleExerciseSubmit}
              disabled={!exerciseAnswer.trim()}
              className="w-full py-3.5 rounded-xl text-white text-sm transition-all disabled:opacity-40"
              style={{background: exerciseAnswer.trim() ? 'linear-gradient(135deg, #22C55E, #16A34A)' : '#9CA3AF', fontWeight: 600}}
            >
              Submit Answer
            </button>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div
                  className="rounded-2xl p-4 border"
                  style={{
                    background: exerciseFeedback === 'correct' ? '#F0FDF4' : '#FEF2F2',
                    borderColor: exerciseFeedback === 'correct' ? '#22C55E' : '#EF4444'
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4" style={{color: exerciseFeedback === 'correct' ? '#22C55E' : '#EF4444'}}/>
                    <span className="text-sm" style={{fontWeight: 700, color: exerciseFeedback === 'correct' ? '#22C55E' : '#EF4444'}}>
                      {exerciseFeedback === 'correct' ? 'Correct! Excellent work! 🎉' : 'Not quite right'}
                    </span>
                  </div>
                  <p className="text-sm text-[#374151] ml-6">{exerciseData.explanation}</p>
                  <div className="ml-6 mt-2 p-2 rounded-lg text-sm" style={{background: 'white', color: '#22C55E', fontWeight: 700}}>
                    ✓ Correct: "{exerciseData.answer}"
                  </div>
                </div>
                <button
                  onClick={() => setScreen('list')}
                  className="w-full py-3.5 rounded-xl text-white text-sm"
                  style={{background: 'linear-gradient(135deg, #1E88E5, #42A5F5)', fontWeight: 600}}
                >
                  Continue →
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    );
  }

  // === COMPLETION SCREEN ===
  if (screen === 'complete') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm w-full text-center"
        >
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{background: 'linear-gradient(135deg, #FFC107, #FF8F00)'}}>
            <Trophy className="w-12 h-12 text-white"/>
          </div>
          <h1 className="text-3xl mb-2" style={{fontWeight: 800, color: '#111827'}}>Quiz Complete!</h1>
          <p className="text-[#6B7280] mb-6">You scored {score} out of {quizQuestions.reduce((a, q) => a + q.points, 0)} points</p>

          <div className="bg-white rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-50 mb-6">
            <div className="flex justify-around">
              {[
                { label: 'Score', value: `${score}/${quizQuestions.reduce((a, q) => a + q.points, 0)}`, icon: Star, color: '#FFC107' },
                { label: 'Correct', value: `${Math.round(score / quizQuestions.reduce((a, q) => a + q.points, 0) * quizQuestions.length)}/${quizQuestions.length}`, icon: CheckCircle, color: '#22C55E' },
                { label: 'XP Earned', value: `+${score}`, icon: Zap, color: '#1E88E5' },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-1.5" style={{background: item.color + '20'}}>
                    <item.icon className="w-5 h-5" style={{color: item.color}}/>
                  </div>
                  <div className="text-base" style={{fontWeight: 700, color: '#111827'}}>{item.value}</div>
                  <div className="text-xs text-[#6B7280]">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => { setScreen('list'); setQuizIndex(0); setSelectedAnswer(null); setShowExplanation(false); setScore(0); }}
              className="w-full py-3.5 rounded-xl text-white shadow-lg shadow-[#1E88E5]/20"
              style={{background: 'linear-gradient(135deg, #1E88E5, #42A5F5)', fontWeight: 600}}
            >
              Continue Learning →
            </button>
            <button
              onClick={() => navigate('student/dashboard')}
              className="w-full py-3 rounded-xl border border-gray-200 text-sm"
              style={{fontWeight: 500, color: '#6B7280'}}
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // === ASSIGNMENT LIST SCREEN ===
  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      {/* Assignment header */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50 mb-5">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="text-xs text-[#6B7280] mb-1" style={{fontWeight: 500}}>ASSIGNMENT</div>
            <h1 className="text-xl mb-1" style={{fontWeight: 700, color: '#111827'}}>Grammar Fundamentals</h1>
            <p className="text-sm text-[#6B7280] mb-3">Business English A2→B1 · Due Jul 17, 2026</p>
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#6B7280]">Overall Progress</span>
                <span style={{fontWeight: 700, color: '#1E88E5'}}>{progress}% · {completedCount}/{lessons.length} lessons</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="h-2.5 rounded-full" style={{width: `${progress}%`, background: 'linear-gradient(90deg, #1E88E5, #42A5F5)'}}/>
              </div>
            </div>
          </div>
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
              <circle cx="32" cy="32" r="26" fill="none" stroke="#E5E7EB" strokeWidth="6"/>
              <circle cx="32" cy="32" r="26" fill="none" stroke="#1E88E5" strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={`${2 * Math.PI * 26 * (1 - progress / 100)}`}
                strokeLinecap="round"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm" style={{fontWeight: 700, color: '#111827'}}>{progress}%</div>
          </div>
        </div>
      </div>

      {/* Lesson list */}
      <div className="space-y-2">
        {lessons.map((lesson, idx) => {
          const config = typeConfig[lesson.type];
          const Icon = config.icon;
          const isCompleted = lesson.status === 'completed';
          const isCurrent = lesson.status === 'current';
          const isLocked = lesson.status === 'locked';

          return (
            <motion.button
              key={lesson.id}
              onClick={() => handleLessonClick(lesson)}
              disabled={isLocked}
              className="w-full bg-white rounded-xl p-4 shadow-[0_1px_8px_rgba(0,0,0,0.05)] border text-left transition-all hover:shadow-[0_2px_16px_rgba(0,0,0,0.08)] disabled:cursor-not-allowed"
              style={{
                borderColor: isCurrent ? '#1E88E5' : '#F3F4F6',
                background: isCurrent ? '#FAFEFF' : 'white',
                opacity: isLocked ? 0.5 : 1
              }}
            >
              <div className="flex items-center gap-3">
                {/* Status icon */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{background: isCompleted ? '#F0FDF4' : isCurrent ? '#EFF6FF' : config.bg}}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-[#22C55E]"/>
                  ) : isLocked ? (
                    <Lock className="w-5 h-5 text-[#9CA3AF]"/>
                  ) : (
                    <Icon className="w-4 h-4" style={{color: config.color}}/>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm" style={{fontWeight: isCurrent ? 700 : 500, color: isLocked ? '#9CA3AF' : '#111827'}}>
                      {lesson.title}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full text-white flex-shrink-0" style={{background: '#1E88E5', fontWeight: 600}}>
                        CONTINUE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                    <span className="capitalize" style={{color: config.color, fontWeight: 500}}>{config.label}</span>
                    <span>·</span>
                    <Clock className="w-3 h-3"/>
                    <span>{lesson.duration}</span>
                    <span>·</span>
                    <Star className="w-3 h-3 text-[#FFC107]"/>
                    <span>{lesson.points} pts</span>
                  </div>
                </div>

                {!isLocked && (
                  <ChevronRight className="w-4 h-4 flex-shrink-0" style={{color: isCurrent ? '#1E88E5' : '#9CA3AF'}}/>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
