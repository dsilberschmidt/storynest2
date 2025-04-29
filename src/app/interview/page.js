
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import questionsES from '../../i18n/questions_es';
import questionsEN from '../../i18n/questions_en';
import questionsPT from '../../i18n/questions_pt';

export default function Interview() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const lang = sessionStorage.getItem('storynest_language') || 'en';
    if (lang === 'es') setQuestions(questionsES);
    else if (lang === 'pt') setQuestions(questionsPT);
    else setQuestions(questionsEN);
  }, []);

  const handleNext = () => {
    setAnswers([...answers, input]);
    setInput('');
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      sessionStorage.setItem('storynest_answers', JSON.stringify([...answers, input]));
      router.push('/summary');
    }
  };

  if (questions.length === 0) {
    return <main className="flex items-center justify-center min-h-screen">Loading...</main>;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-semibold mb-6">{questions[currentQuestion]}</h2>

      <textarea
        className="border p-2 w-full max-w-md mb-4"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        placeholder="Escribe tu respuesta aquí..."
      />

      <button
        onClick={handleNext}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
      </button>
    </main>
  );
}
