
'use client';

import { useEffect, useState } from 'react';

export default function Summary() {
  const [answers, setAnswers] = useState([]);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedAnswers = JSON.parse(sessionStorage.getItem('storynest_answers')) || [];
    setAnswers(savedAnswers);
  }, []);

  const generateBiography = () => {
    setLoading(true);
    setTimeout(() => {
      setBio("This is a beautiful life story generated based on your memories. Thank you for sharing them with StoryNest.");
      setLoading(false);
    }, 2000);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Thank you for sharing your story!</h1>

      {answers.length > 0 && (
        <div className="w-full max-w-md space-y-4 mb-6">
          {answers.map((answer, index) => (
            <div key={index} className="p-4 border rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Question {index + 1}</h2>
              <p>{answer}</p>
            </div>
          ))}
        </div>
      )}

      {!bio && (
        <button
          onClick={generateBiography}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? 'Generating...' : 'Generate my Story ✨'}
        </button>
      )}

      {bio && (
        <div className="mt-8 p-6 border rounded shadow max-w-md bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4">Your Story</h2>
          <p className="whitespace-pre-line">{bio}</p>
        </div>
      )}
    </main>
  );
}
