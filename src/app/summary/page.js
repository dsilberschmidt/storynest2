
'use client';

import { useEffect, useState } from 'react';

export default function Summary() {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const savedAnswers = JSON.parse(sessionStorage.getItem('storynest_answers')) || [];
    setAnswers(savedAnswers);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Thank you for sharing your story!</h1>

      {answers.length > 0 && (
        <div className="w-full max-w-md space-y-4">
          {answers.map((answer, index) => (
            <div key={index} className="p-4 border rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Question {index + 1}</h2>
              <p>{answer}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
