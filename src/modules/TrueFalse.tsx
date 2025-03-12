import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, CheckCircle2, XCircle } from 'lucide-react';
import { ICON_SIZES } from '../constants';
import type { TrueFalseQuestion } from '../types/quiz';

interface Props {
  question: TrueFalseQuestion;
  onAnswer: (correct: boolean) => void;
}

export default function TrueFalse({ question, onAnswer }: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const getAnswerText = (answer: boolean): string => answer ? 'Richtig' : 'Falsch';

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    onAnswer(getAnswerText(answer) === question.answer);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{question.question}</h3>
      <div className="space-y-4">
        <div className="flex gap-4 justify-center">
          {[true, false].map((answer) => (
            <motion.button
              key={answer.toString()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                selectedAnswer === null
                  ? 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  : getAnswerText(answer) === question.answer
                    ? 'bg-green-100 dark:bg-green-900'
                    : selectedAnswer === answer
                      ? 'bg-red-100 dark:bg-red-900'
                    : 'opacity-50'
              }`}
              onClick={() => !selectedAnswer && handleAnswer(answer)}
              disabled={selectedAnswer !== null}
            >
              {answer ? (
                <ThumbsUp className="w-5 h-5" />
              ) : (
                <ThumbsDown className="w-5 h-5" />
              )}
              {answer ? 'Richtig' : 'Falsch'}
            </motion.button>
          ))}
        </div>
        {selectedAnswer !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              getAnswerText(selectedAnswer!) === question.answer
                ? 'bg-green-50 dark:bg-green-900/50'
                : 'bg-red-50 dark:bg-red-900/50'
            }`}
          >
            <div className="flex items-start gap-2">
              {getAnswerText(selectedAnswer!) === question.answer ? (
                <CheckCircle2 className={`${ICON_SIZES.EXPLANATION} mt-1 text-green-500`} />
              ) : (
                <XCircle className={`${ICON_SIZES.EXPLANATION} mt-1 text-red-500`} />
              )}
              <div>
                <p className="text-sm mb-2" dir="ltr">
                  {question.germanExplanation?.[question.answer === 'Richtig' ? 0 : 1] || 
                    (typeof question.explanation === 'object' ? question.explanation.de : question.explanation)}
                </p>
                {(question.farsiExplanation?.[question.answer === 'Richtig' ? 0 : 1] || 
                  (typeof question.explanation === 'object' && question.explanation.fa)) && (
                  <p className="text-sm" dir="rtl">
                    {question.farsiExplanation?.[question.answer === 'Richtig' ? 0 : 1] || 
                      (typeof question.explanation === 'object' ? question.explanation.fa : null)}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}