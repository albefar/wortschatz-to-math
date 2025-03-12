import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom'
import { Book, Globe2, Shirt, School, Sparkles, ArrowLeft, Activity } from 'lucide-react'
import './App.css'
import Logo from './components/Logo'
import QuizRenderer from './components/QuizRenderer'
import type { Quiz } from './types/quiz'

const getQuizIcon = (id: string) => {
  switch (id) {
    case 'countries-capitals':
      return <Globe2 className="w-12 h-12 text-blue-500" />;
    case 'kleidung-b1':
    case 'kleidung-b2':
      return <Shirt className="w-12 h-12 text-purple-500" />;
    case 'classroom-b1':
      return <School className="w-12 h-12 text-green-500" />;
    case 'demo-quiz':
      return <Sparkles className="w-12 h-12 text-amber-500" />;
    case '1-02-staatsangehorigkeit-nationalitat':
      return <Globe2 className="w-12 h-12 text-indigo-500" />;
    case '9-03-koerperliche-taetigkeiten':
      return <Activity className="w-12 h-12 text-rose-500" />;
    default:
      return <Book className="w-12 h-12 text-gray-500" />;
  }
};

function QuizPage({ quizzes }: { quizzes: Quiz[] }) {
  const { id } = useParams<{ id: string }>()
  
  if (!id) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Invalid Quiz URL</h2>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    )
  }

  const quiz = quizzes.find((q) => q.id === id)

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Quiz Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Quiz ID: {id} not found.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    )
  }

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold">{quiz.title}</h1>
          </div>
        </div>
      </header>
      <QuizRenderer
        quiz={quiz}
        onComplete={() => window.location.hash = ''}
      />
    </>
  )
}

function App() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const quizFiles = [
          'quizzes/1-02-staatsangehorigkeit-nationalitat.json',
          'quizzes/9-03-koerperliche-taetigkeiten.json',
          'quizzes/countries-capitals.json',
          'quizzes/demo-quiz.json',
          'quizzes/kleidung-b1.json',
          'quizzes/kleidung-b2.json',
          'quizzes/classroom-b1.json',
          'quizzes/personal-info-b1.json',
          'quizzes/personal-info-b2.json',
          'quizzes/mixed-practice.json'
        ]
        
        const loadedQuizzes = await Promise.all(
          quizFiles.map(async (file) => {
            const response = await fetch(file)
            if (!response.ok) {
              console.error(`Failed to load quiz: ${file}`)
              return null
            }
            return response.json()
          })
        )
        // Filter out any failed loads
        const validQuizzes = loadedQuizzes.filter((quiz): quiz is Quiz => quiz !== null)
        setQuizzes(validQuizzes)
      } catch (error) {
        console.error('Error loading quizzes:', error)
        setQuizzes([])
      }
    }

    loadQuizzes()
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <header className="bg-white dark:bg-gray-800 shadow">
                  <div className="max-w-7xl mx-auto px-4 py-6">
                    <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
                      <Logo className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      <span>Wortschatz Interaktiv</span>
                    </Link>
                  </div>
                </header>
                <main className="max-w-7xl mx-auto px-4 py-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz) => (
                      <div
                        key={quiz.id || `quiz-${quiz.title}`}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow flex flex-col"
                      >
                        <div className="flex items-start gap-4 flex-grow">
                          <div className="flex-shrink-0 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            {getQuizIcon(quiz.id)}
                          </div>
                          <div>
                            <h2 className="text-xl font-bold mb-2">{quiz.title}</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              {quiz.description}
                            </p>
                            <div className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                              {quiz.questions.length} {quiz.questions.length === 1 ? 'Frage' : 'Fragen'}
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 flex justify-center">
                          <Link
                            to={`/quiz/${quiz.id}`}
                            className="block w-[90%] px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                          >
                            Quiz starten
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </main>
              </>
            }
          />
          <Route
            path="quiz/:id"
            element={<QuizPage quizzes={quizzes} />}
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App