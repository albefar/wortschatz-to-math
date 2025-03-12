import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { ICON_SIZES } from '../constants';
import type { MatchWordsQuestion } from '../types/quiz';

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

interface Props {
  question: MatchWordsQuestion;
  onAnswer: (correct: boolean) => void;
}

export default function MatchWords({ question, onAnswer }: Props) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [pairs, setPairs] = useState<{ word: string; match: string | null }[]>([]);
  const [availableMatches, setAvailableMatches] = useState<string[]>([]);

  useEffect(() => {
    if ('pairs' in question.options) {
      const shuffledPairs = shuffleArray(question.options.pairs);
      setPairs(shuffledPairs.map(pair => ({ word: pair.word, match: null })));
      setAvailableMatches(shuffleArray(question.options.pairs.map(pair => pair.match)));
    } else {
      const shuffledLeft = shuffleArray(question.options.left);
      setPairs(shuffledLeft.map(word => ({ word, match: null })));
      setAvailableMatches(shuffleArray(question.options.right));
    }
    setSelectedWord(null);
  }, [question]);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleWordClick = (word: string) => {
    if (!selectedWord) {
      setSelectedWord(word);
    }
  };

  const handleMatchClick = (match: string) => {
    if (selectedWord) {
      const isCorrectMatch = question.answer[selectedWord] === match;
      
      if (isCorrectMatch) {
        setPairs(prev => 
          prev.map(pair => 
            pair.word === selectedWord ? { ...pair, match } : pair
          )
        );
        setAvailableMatches(prev => prev.filter(m => m !== match));
        
        // Check if all pairs are correctly matched
        const newPairs = pairs.map(pair => 
          pair.word === selectedWord ? { ...pair, match } : pair
        );
        
        if (newPairs.every(pair => pair.match !== null)) {
          setShowFeedback(true);
          onAnswer(true);
        }
      }
      setSelectedWord(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {pairs.map(({ word, match }) => (
            <motion.button
              key={word}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => !match && handleWordClick(word)}
              className={`w-full p-4 text-left rounded-lg transition-colors ${
                match 
                  ? 'bg-green-100 dark:bg-green-900'
                  : selectedWord === word
                    ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              disabled={!!match}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{word}</span>
                {selectedWord === word && (
                  <ArrowRight className="w-5 h-5 text-blue-500 animate-pulse" />
                )}
              </div>
              {match && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  → {match}
                </p>
              )}
            </motion.button>
          ))}
        </div>
        <div className="space-y-2">
          {availableMatches.map((match) => (
            <motion.button
              key={match}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleMatchClick(match)}
              className={`w-full p-4 text-left rounded-lg transition-colors ${
                selectedWord
                  ? 'bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800'
                  : 'bg-gray-50 dark:bg-gray-900 opacity-50 cursor-not-allowed'
              }`}
              disabled={!selectedWord}
            >
              {match}
            </motion.button>
          ))}
        </div>
      </div>
      {showFeedback && availableMatches.length === 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="p-4 rounded-lg bg-green-50 dark:bg-green-900/50"
        >
          <div className="flex items-start gap-2">
            <CheckCircle2 className={`${ICON_SIZES.EXPLANATION} mt-1 text-green-500`} />
            <div>
              <p className="font-medium mb-2">Richtig!</p>
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