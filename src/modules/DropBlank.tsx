import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { ICON_SIZES } from '../constants';
import type { DropBlankQuestion } from '../types/quiz';

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

interface Props {
  question: DropBlankQuestion;
  onAnswer: (correct: boolean) => void;
}

export default function DropBlank({ question, onAnswer }: Props) {
  const [filledBlanks, setFilledBlanks] = useState<(string | null)[]>(
    new Array(question.blanks.length).fill(null)
  );
  const [availableOptions, setAvailableOptions] = useState(shuffleArray([...question.options]));
  const [isComplete, setIsComplete] = useState(false);
  
  // Get the index of the first empty blank
  const currentBlankIndex = filledBlanks.findIndex(blank => blank === null);

  const handleOptionClick = (option: string) => {
    if (isComplete || currentBlankIndex === -1) return;

    const newFilledBlanks = [...filledBlanks];
    newFilledBlanks[currentBlankIndex] = option;
    setFilledBlanks(newFilledBlanks);
    setAvailableOptions(availableOptions.filter(opt => opt !== option));

    // Check if all blanks are filled
    if (newFilledBlanks.every(blank => blank !== null)) {
      const isCorrect = newFilledBlanks.every(
        (answer, index) => answer === question.blanks[index]
      );
      setIsComplete(true);
      onAnswer(isCorrect);
    }
  };

  const handleRemoveAnswer = (blankIndex: number) => {
    if (!isComplete) {
      const removedOption = filledBlanks[blankIndex];
      if (removedOption) {
        const newFilledBlanks = [...filledBlanks];
        newFilledBlanks[blankIndex] = null;
        setFilledBlanks(newFilledBlanks);
        setAvailableOptions([...availableOptions, removedOption]);
      }
    }
  };

  const handleTryAgain = () => {
    setFilledBlanks(new Array(question.blanks.length).fill(null));
    setAvailableOptions(shuffleArray([...question.options]));
    setIsComplete(false);
  };

  const renderText = () => {
    const parts = question.text.split('___');
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 && (
          <span
            className={`inline transition-colors ${
              !isComplete && `border-b ${
                filledBlanks[index]
                  ? 'border-blue-500 border-b-2'
                  : index === currentBlankIndex
                    ? 'border-blue-500 border-b-2 animate-pulse'
                    : 'border-gray-300 border-b-2'
              }`
            }`}
            onClick={() => !isComplete && handleRemoveAnswer(index)}
          >
            {isComplete && filledBlanks[index] !== question.blanks[index] ? (
              <>
                <span className="text-red-600 dark:text-red-400 line-through">
                  {filledBlanks[index]}
                </span>
                <span className="text-green-500 dark:text-green-400 font-medium">
                  {question.blanks[index]}
                </span>
              </>
            ) : isComplete && filledBlanks[index] === question.blanks[index] ? (
              <span className="text-green-500 dark:text-green-400 font-medium">
                {filledBlanks[index]}
              </span>
            ) : (
              <span className={`text-center ${filledBlanks[index] ? 'text-blue-600 dark:text-blue-400 cursor-pointer hover:opacity-80' : ''}`}>
                {filledBlanks[index] || '_____'}
              </span>
            )}
          </span>
        )}
      </span>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold mb-2">
        {renderText()}
      </div>
      
      <div className="flex justify-end">
        {isComplete && !filledBlanks.every((answer, index) => answer === question.blanks[index]) && (
          <button
            onClick={handleTryAgain}
            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
            title="Try Again"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {availableOptions.map((option) => (
          <motion.div
            key={option}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOptionClick(option)}
           className={`px-3 py-1.5 rounded-md bg-gray-50 dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer transition-all text-blue-600 dark:text-blue-400 ${
              isComplete || currentBlankIndex === -1 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
            }`}
          >
            {option}
          </motion.div>
        ))}
      </div>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            filledBlanks.every((answer, index) => answer === question.blanks[index])
              ? 'bg-green-50 dark:bg-green-900/50'
              : 'bg-red-50 dark:bg-red-900/50'
          }`}
        >
          <div className="flex items-start gap-2">
            {filledBlanks.every((answer, index) => answer === question.blanks[index]) ? (
              <CheckCircle2 className={`${ICON_SIZES.EXPLANATION} mt-1 text-green-500`} />
            ) : (
              <XCircle className={`${ICON_SIZES.EXPLANATION} mt-1 text-red-500`} />
            )}
            <div className="flex-1">
              {typeof question.explanation === 'object' ? (
                <>
                  <p className="text-sm mb-2" dir="ltr">{question.explanation.de}</p>
                  {question.explanation.fa && (
                    <p className="text-sm" dir="rtl">{question.explanation.fa}</p>
                  )}
                </>
              ) : (
                <p className="text-sm">{question.explanation}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}