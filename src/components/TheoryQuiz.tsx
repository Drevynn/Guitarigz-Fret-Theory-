/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { NoteName, Tuning, ScaleType, QuizQuestion } from '../types';
import { CHROMATIC_NOTES_SHARP, SCALE_FORMULAS, CHORD_FORMULAS, getSpelledNoteName, getNoteIndex } from '../utils/theory';
import { playNote } from '../utils/audio';
import { Trophy, CheckCircle2, AlertCircle, RefreshCw, GraduationCap, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TheoryQuizProps {
  activeKey: NoteName;
  activeScale: ScaleType;
  activeTuning: Tuning;
  useFlats: boolean;
}

export default function TheoryQuiz({
  activeKey,
  activeScale,
  activeTuning,
  useFlats,
}: TheoryQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Generate a random deck of 5 music theory cards
  const generateQuizDeck = () => {
    const deck: QuizQuestion[] = [];
    const rIdx = getNoteIndex(activeKey);

    // Question 1: Fretboard note locater lookup (Low string)
    const q1StringIdx = 5; // Low E
    const q1Fret = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const q1OpenMidi = activeTuning.notes[q1StringIdx];
    const q1TargetMidi = q1OpenMidi + q1Fret;
    const q1AnswerNote = getSpelledNoteName(q1TargetMidi, useFlats);
    const q1Options = [
      q1AnswerNote,
      getSpelledNoteName(q1TargetMidi + 5, useFlats),
      getSpelledNoteName(q1TargetMidi - 3, useFlats),
      getSpelledNoteName(q1TargetMidi + 2, useFlats),
    ];
    // Shuffle options
    q1Options.sort(() => Math.random() - 0.5);

    deck.push({
      id: 'q1',
      type: 'locate_note',
      question: `On the Low string (String 6, tuned to ${getSpelledNoteName(q1OpenMidi, useFlats)}), what note is fretted at Fret ${q1Fret}?`,
      options: Array.from(new Set(q1Options)),
      answer: q1AnswerNote,
      explanation: `Fret 0 starts at ${getSpelledNoteName(q1OpenMidi, useFlats)}. Moving up fret by fret (semitone by semitone): ${q1Fret} half-steps lands on ${q1AnswerNote}.`,
      contextData: { stringIdx: q1StringIdx, fret: q1Fret }
    });

    // Question 2: Simple note interval quizzer
    const q2Formula = SCALE_FORMULAS[activeScale];
    const q2TargetStepIdx = Math.floor(Math.random() * (q2Formula.intervals.length - 1)) + 1; // Pick random non-root degree
    const q2SemitoneOffset = q2Formula.intervals[q2TargetStepIdx];
    const q2TargetNote = getSpelledNoteName(rIdx + q2SemitoneOffset, useFlats);
    const q2IntervalLabel = q2Formula.labelMap[q2TargetStepIdx];
    
    const q2Options = [
      q2IntervalLabel,
      ...(q2IntervalLabel === '3' ? ['b3', '5', '7'] : q2IntervalLabel === 'b3' ? ['3', '4', 'b7'] : ['3', '5', '6'])
    ];
    q2Options.sort(() => Math.random() - 0.5);

    deck.push({
      id: 'q2',
      type: 'identify_interval',
      question: `In the active key of ${activeKey} ${SCALE_FORMULAS[activeScale].name}, what interval represents the note "${q2TargetNote}" relative to the Root?`,
      options: Array.from(new Set(q2Options)),
      answer: q2IntervalLabel,
      explanation: `The note ${q2TargetNote} resides ${q2SemitoneOffset} semitones above the key root (${activeKey}), which translates directly to the ${q2IntervalLabel} interval.`,
      contextData: { targetInterval: q2IntervalLabel }
    });

    // Question 3: Scale spelling checker
    const currentScaleNotes = q2Formula.intervals.map(semitones => getSpelledNoteName(rIdx + semitones, useFlats));
    const nonScaleNotePitch = rIdx + 1; // Half step above root is never in standard majors/minors
    const nonScaleNote = getSpelledNoteName(nonScaleNotePitch, useFlats);

    const q3Options = [
      currentScaleNotes[0],
      currentScaleNotes[Math.min(currentScaleNotes.length - 1, 3)],
      currentScaleNotes[Math.min(currentScaleNotes.length - 1, 4)],
      nonScaleNote
    ];
    q3Options.sort(() => Math.random() - 0.5);

    deck.push({
      id: 'q3',
      type: 'spell_scale',
      question: `Which of these notes does NOT belong to the active scale: ${activeKey} ${SCALE_FORMULAS[activeScale].name}?`,
      options: Array.from(new Set(q3Options)),
      answer: nonScaleNote,
      explanation: `The spelling of ${activeKey} ${SCALE_FORMULAS[activeScale].name} consists of: ${currentScaleNotes.join(', ')}. The note "${nonScaleNote}" does not belong.`,
      contextData: { scalePitches: currentScaleNotes }
    });

    // Question 4: Chord spellings
    const q4Options = [
      getSpelledNoteName(rIdx + 4, useFlats), // maj 3rd
      getSpelledNoteName(rIdx + 3, useFlats), // min 3rd
      getSpelledNoteName(rIdx + 7, useFlats), // perf 5th
      getSpelledNoteName(rIdx + 1, useFlats), // false flat 2
    ];
    q4Options.sort(() => Math.random() - 0.5);

    deck.push({
      id: 'q4',
      type: 'chord_construction',
      question: `Which note forms the Major Third (3) interval of the ${activeKey} Major chord?`,
      options: Array.from(new Set(q4Options)),
      answer: getSpelledNoteName(rIdx + 4, useFlats),
      explanation: `A Major Third interval has a distance of exactly 4 half-steps (4 semitones) above the parent root. For ${activeKey}, that pitch computes directly to ${getSpelledNoteName(rIdx + 4, useFlats)}.`,
      contextData: { root: activeKey }
    });

    // Question 5: High string note finder
    const q5StringIdx = 0; // High string
    const q5Fret = Math.floor(Math.random() * 6) + 3; // 3 to 8
    const q5OpenMidi = activeTuning.notes[q5StringIdx];
    const q5TargetMidi = q5OpenMidi + q5Fret;
    const q5AnswerNote = getSpelledNoteName(q5TargetMidi, useFlats);
    const q5Options = [
      q5AnswerNote,
      getSpelledNoteName(q5TargetMidi + 3, useFlats),
      getSpelledNoteName(q5TargetMidi - 2, useFlats),
      getSpelledNoteName(q5TargetMidi + 5, useFlats),
    ];
    q5Options.sort(() => Math.random() - 0.5);

    deck.push({
      id: 'q5',
      type: 'locate_note',
      question: `On String 1 (High string tuned to ${getSpelledNoteName(q5OpenMidi, useFlats)}), what note resides at Fret ${q5Fret}?`,
      options: Array.from(new Set(q5Options)),
      answer: q5AnswerNote,
      explanation: `Tuning is standard ${getSpelledNoteName(q5OpenMidi, useFlats)}4. Counting up ${q5Fret} cumulative frets places the note precisely at ${q5AnswerNote}.`,
      contextData: { stringIdx: q5StringIdx, fret: q5Fret }
    });

    setQuestions(deck);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
  };

  useEffect(() => {
    generateQuizDeck();
  }, [activeKey, activeScale, activeTuning, useFlats]);

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (isAnswered || !selectedOption) return;

    setIsAnswered(true);
    const isCorrect = selectedOption === questions[currentIdx].answer;

    if (isCorrect) {
      setScore(prev => prev + 1);
      // Play a happy major octave third note sequence chime!
      playNote(64, 0, 0.2); // E4
      playNote(67, 0.08, 0.2); // G4
      playNote(72, 0.16, 0.4); // C5
    } else {
      // Play a lower sour flat note warning chime
      playNote(49, 0, 0.45); // Db2 low fret warning
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIdx];

  return (
    <div className="flex flex-col w-full bg-slate-950/40 border border-slate-850 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
      {/* Background radial highlight */}
      <div className="absolute inset-x-0 bottom-0 h-[100px] bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.02)_0%,transparent_70%)] pointer-events-none" />

      {/* Header title */}
      <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-850 z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-550 border border-amber-500/20">
            <GraduationCap size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm tracking-tight flex items-center gap-2">
              Fretboard Theory Quizzer
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Reinforce your knowledge of scales, note intervals, and cord frets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
            Card {currentIdx + 1} of 5
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!quizCompleted ? (
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col z-10"
          >
            {/* Question Text */}
            <h4 className="text-sm font-bold text-slate-200 mb-5 leading-relaxed font-sans">
              {currentQuestion.question}
            </h4>

            {/* Answer Options list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOption === option;
                const isCorrectAnswer = option === currentQuestion.answer;
                
                let buttonStyle = 'bg-slate-900/50 border-slate-850 text-slate-350 hover:bg-slate-900 hover:border-slate-750';
                if (isAnswered) {
                  if (isCorrectAnswer) {
                    buttonStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500/35';
                  } else if (isSelected) {
                    buttonStyle = 'bg-red-500/10 border-red-500 text-red-450 ring-1 ring-red-500/35';
                  } else {
                    buttonStyle = 'bg-slate-900/20 border-slate-900 text-slate-600 cursor-not-allowed';
                  }
                } else if (isSelected) {
                  buttonStyle = 'bg-slate-905 border-amber-500 ring-1 ring-amber-500/30 text-amber-500';
                }

                return (
                  <button
                    key={option}
                    id={`quiz-option-${option}`}
                    disabled={isAnswered}
                    onClick={() => handleOptionClick(option)}
                    className={`px-4 py-3 rounded-2xl border text-left font-sans font-bold text-xs transition-all duration-300 flex items-center justify-between ${buttonStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrectAnswer && (
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrectAnswer && (
                      <AlertCircle size={14} className="text-red-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanations card section */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-slate-900 rounded-2xl p-4 border border-emerald-550/20 mb-6 flex gap-3 text-xs items-start"
                >
                  {selectedOption === currentQuestion.answer ? (
                    <Trophy className="text-emerald-500 mt-0.5 shrink-0" size={16} />
                  ) : (
                    <AlertCircle className="text-red-500 mt-0.5 shrink-0" size={16} />
                  )}
                  <div>
                    <div className="font-bold text-slate-200">
                      {selectedOption === currentQuestion.answer ? 'Beautifully done! Spelled Correctly' : 'Not quite right! Review spelling'}
                    </div>
                    <p className="text-slate-400 leading-relaxed mt-1 font-sans">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons triggers */}
            <div className="flex justify-end gap-3">
              {!isAnswered ? (
                <button
                  id="btn-submit-answer"
                  disabled={selectedOption === null}
                  onClick={handleSubmitAnswer}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all tracking-wide ${
                    selectedOption !== null
                      ? 'bg-amber-550 hover:bg-amber-500 text-slate-950 cursor-pointer shadow shadow-amber-950/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Verify Answer
                </button>
              ) : (
                <button
                  id="btn-next-question"
                  onClick={handleNext}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700 px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  {currentIdx + 1 < questions.length ? 'Next Question' : 'View Core Summary'}
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-6 text-center z-10"
          >
            <div className="relative mb-4 flex items-center justify-center">
              <div className="absolute inset-0 bg-amber-500/15 rounded-full blur-xl scale-125" />
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-500 h-16 w-16 flex items-center justify-center shadow-lg relative">
                <Award size={36} />
              </div>
            </div>

            <h4 className="text-base font-bold text-slate-205 mb-2 font-sans">
              Quiz Completed!
            </h4>
            <p className="text-xs text-slate-400 mb-6 max-w-sm">
              You scored <span className="text-amber-500 font-bold">{score} out of 5</span> answers correctly in standard guitar theory!
            </p>

            <button
              id="btn-restart-quiz"
              onClick={generateQuizDeck}
              className="bg-amber-550 hover:bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow shadow-amber-950/20"
            >
              <RefreshCw size={13} />
              Try Another Card Set
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
