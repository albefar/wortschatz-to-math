import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { ICON_SIZES } from '../constants';
import type { MultipleChoiceQuestion } from '../types/quiz';

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

interface Props {
  question: MultipleChoiceQuestion;
  onAnswer: (correct: boolean) => void;
}

export default function MultipleChoice({ question, onAnswer }: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  useEffect(() => {
    const options = Array.isArray(question.options) 
      ? typeof question.options[0] === 'string'
        ? question.options as string[]
        : (question.options as { text: string; isCorrect: boolean }[]).map(o => o.text)
      : [];
    setShuffledOptions(shuffleArray(options));
    setSelectedOption(null);
  }, [question]);

  const getCorrectAnswerIndex = () => {
    if (Array.isArray(question.options)) {
      if (typeof question.options[0] === 'string') {
        return shuffledOptions.indexOf(question.answer!);
      }
      return (question.options as { text: string; isCorrect: boolean }[])
        .findIndex(o => o.isCorrect);
    }
    return question.correctAnswer!;
  };

  const handleAnswer = (option: string) => {
    setSelectedOption(option);
    
    // Check if the answer is correct based on the question type
    const isCorrect = Array.isArray(question.options) 
      ? typeof question.options[0] === 'string'
        ? option === question.answer // Simple string comparison for string options
        : (question.options as { text: string; isCorrect: boolean }[])
            .find(o => o.text === option)?.isCorrect ?? false // Check isCorrect flag for object options
      : false;
    
    onAnswer(isCorrect);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{question.question}</h3>
      <div className="space-y-2">
        {shuffledOptions.map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full p-4 text-left rounded-lg transition-colors ${
              selectedOption === null
                ? 'hover:bg-gray-100 dark:hover:bg-gray-800'
                : Array.isArray(question.options) && (
                  typeof question.options[0] === 'string'
                    ? option === question.answer
                    : (question.options as { text: string; isCorrect: boolean }[])
                        .find(o => o.text === option)?.isCorrect
                  )
                  ? 'bg-green-100 dark:bg-green-900'
                  : selectedOption === option
                    ? 'bg-red-100 dark:bg-red-900'
                    : 'opacity-50'
            }`}
            onClick={() => !selectedOption && handleAnswer(option)}
            disabled={selectedOption !== null}
          >
            {option}
          </motion.button>
        ))}
      </div>
      {selectedOption !== null && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            Array.isArray(question.options) && (
              typeof question.options[0] === 'string'
                ? selectedOption === question.answer
                : (question.options as { text: string; isCorrect: boolean }[])
                    .find(o => o.text === selectedOption)?.isCorrect
            )
              ? 'bg-green-50 dark:bg-green-900/50'
              : 'bg-red-50 dark:bg-red-900/50'
          }`}
        >
          <div className="flex items-start gap-2">
            {Array.isArray(question.options) && (
              typeof question.options[0] === 'string'
                ? selectedOption === question.answer
                : (question.options as { text: string; isCorrect: boolean }[])
                    .find(o => o.text === selectedOption)?.isCorrect
            ) ? (
              <CheckCircle2 className={`${ICON_SIZES.EXPLANATION} mt-1 text-green-500`} />
            ) : (
              <XCircle className={`${ICON_SIZES.EXPLANATION} mt-1 text-red-500`} />
            )}
            <div>
              <p className="text-sm mb-2" dir="ltr">
                {Array.isArray(question.options) && question.germanExplanation?.[getCorrectAnswerIndex()] || 
                  (typeof question.explanation === 'object' ? question.explanation.de : question.explanation)}
              </p>
              {(Array.isArray(question.options) && question.farsiExplanation?.[getCorrectAnswerIndex()] || 
                (typeof question.explanation === 'object' && question.explanation.fa)) && (
                <p className="text-sm" dir="rtl">
                  {Array.isArray(question.options) && question.farsiExplanation?.[getCorrectAnswerIndex()] || 
                    (typeof question.explanation === 'object' ? question.explanation.fa : null)}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}