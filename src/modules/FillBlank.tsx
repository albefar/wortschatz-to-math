import { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { ICON_SIZES } from '../constants';
import type { FillBlankQuestion } from '../types/quiz';

interface Props {
  question: FillBlankQuestion;
  onAnswer: (correct: boolean) => void;
}

export default function FillBlank({ question, onAnswer }: Props) {
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Process the question to show blanks and first letters
  const processedQuestion = question.question.replace(/_{2,}/g, () => {
    const firstLetter = question.answer[0];
    return `${firstLetter}${'_'.repeat(question.answer.length - 1)}`;
  });

  // Normalize input for comparison
  const normalizeInput = (input: string): string => {
    return input.trim().toLowerCase().replace(/\s+/g, ' ');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setUserInput(newInput);

    // If user has already submitted and starts typing again, reset submission state
    if (hasSubmitted) {
      setHasSubmitted(false);
      setIsCorrect(null);
      onAnswer(false);
    }
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    const normalizedInput = normalizeInput(userInput);
    const answers = Array.isArray(question.answer) 
      ? question.answer 
      : [question.answer];
    
    const isCorrect = answers.some(answer => 
      normalizeInput(answer) === normalizedInput
    );
    setIsCorrect(isCorrect);
    onAnswer(isCorrect);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-semibold flex-grow">
          {processedQuestion}
        </h3>
        <button
          onClick={() => setShowHint(!showHint)}
          className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          title={showHint ? "Hide hint" : "Show hint"}
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-transparent transition-colors focus:border-blue-500 dark:focus:border-blue-400"
          placeholder={`Type your answer (starts with "${question.answer[0]}")`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !hasSubmitted) {
              handleSubmit();
            }
          }}
        />
      </div>

      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg"
        >
          <p>Hint: The word...</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Starts with "{question.answer[0]}"</li>
            <li>Has {question.answer.length} letters</li>
            {question.hint && <li>{question.hint}</li>}
          </ul>
        </motion.div>
      )}

      {hasSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            isCorrect
              ? 'bg-green-50 dark:bg-green-900/50'
              : 'bg-red-50 dark:bg-red-900/50'
          }`}
        >
          <div className="flex items-start gap-2">
            {isCorrect ? (
              <CheckCircle2 className={`${ICON_SIZES.EXPLANATION} mt-1 text-green-500`} />
            ) : (
              <XCircle className={`${ICON_SIZES.EXPLANATION} mt-1 text-red-500`} />
            )}
            <div>
              <p className="font-medium">
                {isCorrect ? 'Korrekt!' : 'Nicht ganz richtig'}
              </p>
              {question.explanation && typeof question.explanation === 'object' ? (
                <>
                  <p className="text-sm mt-1 mb-2" dir="ltr">{question.explanation.de}</p>
                  {question.explanation.fa && (
                    <p className="text-sm" dir="rtl">{question.explanation.fa}</p>
                  )}
                </>
              ) : question.explanation && (
                <p className="text-sm mt-1" dir="ltr">{question.explanation}</p>
              )}
              {!isCorrect && (
                <p className="text-sm mt-1">
                  Die richtige Antwort ist: {Array.isArray(question.answer) 
                    ? question.answer[0] 
                    : question.answer}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
      
      <button
        onClick={handleSubmit}
        disabled={!userInput.trim() || hasSubmitted}
        className={`w-full mt-4 px-4 py-2 rounded-lg transition-colors ${
          !userInput.trim() || hasSubmitted
            ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        Antwort überprüfen
      </button>
    </div>
  );
}