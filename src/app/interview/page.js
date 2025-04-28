
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { startListening } from './speech';
import questions from '../questions';

export default function Interview() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState('');
  const router = useRouter();

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

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-semibold mb-6">{questions[currentQuestion]}</h2>

      <textarea
        id="answer-input"
        className="border p-2 w-full max-w-md mb-4"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        placeholder="Write your answer here or use your voice..."
      />

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => startListening('answer-input')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
        >
          🎙️ Hablar
        </button>

        <button
          onClick={handleNext}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
        </button>
      </div>
    </main>
  );
}
