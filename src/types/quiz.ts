export type QuestionType = 'multiple-choice' | 'true-false' | 'match-words' | 'fill-blank' | 'drop-blank';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[] | { text: string; isCorrect: boolean }[];
  answer?: string;
  correctAnswer?: number;
  explanation?: string | { de: string; fa: string };
  germanExplanation?: string[];
  farsiExplanation?: string[];
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  options?: string[];
  answer: string;
  explanation?: string | { de: string; fa: string };
  germanExplanation?: string[];
  farsiExplanation?: string[];
}

export interface MatchWordsQuestion extends BaseQuestion {
  type: 'match-words';
  options: {
    left: string[];
    right: string[];
  } | {
    pairs: {
      word: string;
      match: string;
    }[];
  };
  answer: Record<string, string>;
  explanation?: string | { de: string; fa: string };
}

export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill-blank';
  question: string;
  answer: string | string[];
  hint?: string;
  explanation?: string | { de: string; fa: string };
}

export interface DropBlankQuestion extends BaseQuestion {
  type: 'drop-blank';
  text: string;
  blanks: string[];
  options: string[];
  explanation?: string | { de: string; fa: string };
}

export type Question = 
  | MultipleChoiceQuestion 
  | TrueFalseQuestion 
  | MatchWordsQuestion 
  | FillBlankQuestion
  | DropBlankQuestion;

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}