
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import questions from '../questions';

export default function Summary() {
  const [answers, setAnswers] = useState([]);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const apiKey = process.env.NEXT_PUBLIC_AIMLAPI_KEY;

  useEffect(() => {
    const savedAnswers = JSON.parse(sessionStorage.getItem('storynest_answers')) || [];
    setAnswers(savedAnswers);
  }, []);

  const generateBiography = async () => {
    console.log('⏳ Empezando generación de biografía');
    console.log('🔑 API Key:', apiKey ? '[ok]' : '[missing]');
    setBio('');
    setLoading(true);
    setError(null);

    const nonEmptyAnswers = answers.filter(a => a.trim() !== '');
    if (nonEmptyAnswers.length === 0) {
      setLoading(false);
      setError('Please answer at least one question before generating your story.');
      return;
    }

    try {
      const response = await fetch('https://api.aimlapi.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          max_tokens: 1500,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful biographer. Write a realistic, emotionally touching biography based only on the user's memories. Do not invent new facts. Be authentic and natural, as if telling the real story of a person's life.'
            },
            {
              role: 'user',
              content: 'Here are my memories: ' + nonEmptyAnswers.join(' ')
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBio(data.choices[0].message.content);
    } catch (error) {
      console.error('❌ Error generando biografía:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Thank you for sharing your story!</h1>

      {answers.length > 0 && (
        <div className="w-full max-w-md space-y-4 mb-6">
          {answers.map((answer, index) => (
            <div key={index} className="p-4 border rounded shadow">
              <h2 className="text-lg font-semibold mb-2">{questions[index]}</h2>
              <p>{answer}</p>
            </div>
          ))}
        </div>
      )}

      {!bio && !error && (
        <button
          onClick={generateBiography}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
        >
          {loading ? 'Generating...' : 'Generate my Story ✨'}
        </button>
      )}

      {bio && (
        <div className="mt-8 p-6 border rounded shadow w-full max-w-2xl bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4">Your Story</h2>
          <p className="whitespace-pre-line">{bio}</p>
        </div>
      )}

      {error && (
        <div className="mt-8 text-red-500 font-bold">
          {error}
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => router.push('/interview?edit=true')}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          ✏️ Edit My Answers
        </button>

        <button
          onClick={() => {
            sessionStorage.clear();
            router.push('/');
          }}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          🆕 Start Over
        </button>
      </div>
    </main>
  );
}
