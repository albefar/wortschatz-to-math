import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Trophy, PartyPopper } from 'lucide-react';
import type { Quiz } from '../types/quiz';

// Dynamic import of question modules
const modules = import.meta.glob('../modules/*.tsx');

interface Props {
  quiz: Quiz;
  onComplete?: (score: number, total: number) => void;
}

export default function QuizRenderer({ quiz, onComplete }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [QuestionComponent, setQuestionComponent] = useState<any>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Initialize answeredQuestions array with the correct length
  useEffect(() => {
    setAnsweredQuestions(new Array(quiz.questions.length).fill(false));
  }, [quiz.questions.length]);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  useEffect(() => {
    const getModuleName = (type: string) => {
      // Map question types to module names
      const typeMap: Record<string, string> = {
        'match': 'MatchWords',
        'match-words': 'MatchWords'
      };

      const baseName = type.split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');

      return typeMap[type] || baseName;
    };

    const loadQuestionComponent = async () => {
      const moduleName = getModuleName(currentQuestion.type);
      const modulePath = `../modules/${moduleName}.tsx`;
      
      try {
        const module = modules[modulePath];
        if (module) {
          const { default: Component } = await module() as { default: React.ComponentType<any> };
          setQuestionComponent(() => Component);
        } else {
          console.error(`Module not found: ${modulePath}`);
        }
      } catch (error) {
        console.error(`Error loading question component: ${error}`);
      }
    };

    loadQuestionComponent();
  }, [currentQuestion.type, currentQuestionIndex]);

  const handleAnswer = (correct: boolean) => {
    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestionIndex] = true;
    setAnsweredQuestions(newAnsweredQuestions);
    
    if (correct) setScore(score + 1);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionComponent(null);
    } else if (currentQuestionIndex === quiz.questions.length - 1 && answeredQuestions[currentQuestionIndex]) {
      setIsCompleted(true);
      if (score === quiz.questions.length) {
        setShowCelebration(true);
        setTimeout(() => {
          setShowCelebration(false);
        }, 3000);
      }
    }
  };
    
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setQuestionComponent(null); // Reset component before loading previous question
    }
  };

  if (!QuestionComponent) return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-pulse text-gray-600 dark:text-gray-400">
        Lade Frage...
      </div>
    </div>
  );

  if (isCompleted) {
    return (
      <motion.div
        key="completion"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto px-4 py-12 text-center"
      >
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              key="celebration"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 bg-opacity-90"
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center text-white"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, -10, 10, -10, 10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 1, repeat: 2 }}
                  className="flex justify-center mb-6"
                >
                  <Trophy className="w-24 h-24" />
                </motion.div>
                <h2 className="text-4xl font-bold mb-4">Perfekt!</h2>
                <div className="flex justify-center gap-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -20, 0],
                        rotate: [-10, 10, -10]
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: i * 0.1
                      }}
                    >
                      <PartyPopper className="w-8 h-8" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
          <div className="relative">
            <Trophy 
              className={`w-16 h-16 mx-auto mb-6 ${
                score === quiz.questions.length ? 'text-yellow-500' : 'text-gray-400'
              }`}
            />
            <h2 className="text-3xl font-bold mb-4">Quiz abgeschlossen!</h2>
            <p className="text-xl mb-8">
              Du hast {score} von {quiz.questions.length} Fragen richtig beantwortet.
            </p>
            <button
              onClick={() => onComplete?.(score, quiz.questions.length)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Zurück zur Übersicht
            </button>
          </div>
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-4">
        <span className="text-gray-600 dark:text-gray-400 text-sm block mb-2">
          Frage {currentQuestionIndex + 1} von {quiz.questions.length}
        </span>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <QuestionComponent
            question={currentQuestion}
            onAnswer={handleAnswer}
            key={currentQuestion.id}
          />
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentQuestionIndex === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Zurück
            </button>
            <button
              onClick={handleNext}
              disabled={!answeredQuestions[currentQuestionIndex]}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-blue-600 text-white ${
                !answeredQuestions[currentQuestionIndex] ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              Weiter
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}