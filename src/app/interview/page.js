
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import questions from '../questions';

export default function Interview() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    sessionStorage.removeItem('storynest_answers');
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

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setInput(answers[currentQuestion - 1] || '');
      setAnswers(answers.slice(0, -1));
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-semibold mb-6">{questions[currentQuestion]}</h2>

      <textarea
        id="answer-input"
        className="border p-2 w-full max-w-md mb-4"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        placeholder="Write your answer here..."
      />

      <div className="flex gap-4 mb-4 flex-wrap justify-center">
        <button
          onClick={handleBack}
          disabled={currentQuestion === 0}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          🔙 Back
        </button>

        <button
          id="mic-button"
          disabled
          className="bg-gray-400 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed"
        >
          🎙️ Voice Input Coming Soon
        </button>

        <button
          onClick={handleNext}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
        </button>

        <button
          onClick={() => {
            sessionStorage.clear();
            router.push('/');
          }}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          🆕 Start New Interview
        </button>
      </div>
    </main>
  );
}
