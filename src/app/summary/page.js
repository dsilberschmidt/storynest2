
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import questionsES from '../../i18n/questions_es';
import questionsEN from '../../i18n/questions_en';
import questionsPT from '../../i18n/questions_pt';
import texts from '../../i18n/texts';

export default function Summary() {
  const [answers, setAnswers] = useState([]);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState('en');
  const [questions, setQuestions] = useState([]);
  const router = useRouter();

  const apiKey = process.env.NEXT_PUBLIC_AIMLAPI_KEY;

  useEffect(() => {
    const selectedLang = sessionStorage.getItem('storynest_language') || 'en';
    setLang(selectedLang);
    if (selectedLang === 'es') setQuestions(questionsES);
    else if (selectedLang === 'pt') setQuestions(questionsPT);
    else setQuestions(questionsEN);

    const savedAnswers = JSON.parse(sessionStorage.getItem('storynest_answers')) || [];
    setAnswers(savedAnswers);
  }, []);

  const generateBiography = async () => {
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
              content: "You are a professional biographer. Based on the user's memories, write a concise and realistic life story in the third person. The tone should be warm, affectionate, and natural, as if leaving a beautiful memory for future generations. Do not invent new facts. Connect the memories in a meaningful and heartfelt way."
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
      <h1 className="text-3xl font-bold mb-6">{texts[lang].thankYou}</h1>

      {answers.length > 0 && questions.length > 0 && (
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
          {loading ? 'Generating...' : texts[lang].generate}
        </button>
      )}

      {bio && (
        <div className="mt-8 p-6 border rounded shadow w-full max-w-2xl bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4">{texts[lang].yourStory}</h2>
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
          {texts[lang].edit}
        </button>

        <button
          onClick={() => {
            sessionStorage.clear();
            router.push('/');
          }}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          {texts[lang].startOver}
        </button>
      </div>
    </main>
  );
}
