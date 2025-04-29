
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import questionsES from '../../i18n/questions_es';
import questionsEN from '../../i18n/questions_en';
import questionsPT from '../../i18n/questions_pt';
import texts from '../../i18n/texts';

export default function Interview() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const [lang, setLang] = useState('en');
  const [isTestMode, setIsTestMode] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const selectedLang = sessionStorage.getItem('storynest_language') || 'en';
    setLang(selectedLang);
    if (selectedLang === 'es') setQuestions(questionsES);
    else if (selectedLang === 'pt') setQuestions(questionsPT);
    else setQuestions(questionsEN);

    const test = localStorage.getItem('storynest_test') === 'true';
    setIsTestMode(test);
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const isEditing = searchParams.get('edit') === 'true';
      if (isEditing) {
        const savedAnswers = JSON.parse(sessionStorage.getItem('storynest_answers')) || [];
        setAnswers(savedAnswers);
        setInput(savedAnswers[0] || '');
        setCurrentQuestion(0);
        setShowIntro(false);
      }
    }
  }, [questions, searchParams]);

  const handleNext = () => {
    if (showIntro) {
      setShowIntro(false);
      return;
    }

    const updatedAnswers = [...answers];
    if (input.trim() !== '') {
      updatedAnswers[currentQuestion] = input;
    } else if (!updatedAnswers[currentQuestion]) {
      updatedAnswers[currentQuestion] = '';
    }
    setAnswers(updatedAnswers);
    setInput('');

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setInput(updatedAnswers[currentQuestion + 1] || '');
    } else {
      sessionStorage.setItem('storynest_answers', JSON.stringify(updatedAnswers));
      router.push('/summary');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setInput(answers[currentQuestion - 1] || '');
    }
  };

  const startNewInterview = () => {
    sessionStorage.removeItem('storynest_answers');
    router.push('/');
  };

  const loadSampleAnswers = () => {
    sessionStorage.setItem('storynest_answers', JSON.stringify([
      "Estoy muy bien, emocionado de comenzar.",
      "Nací en Buenos Aires, Argentina.",
      "Era una casa baja, con patio y un limonero enorme.",
      "La placita de la esquina, llena de árboles y bancos viejos.",
      "Santi, mi vecino de al lado.",
      "Jugar a la pelota en la calle hasta que oscurecía.",
      "Mi autito rojo y el metegol de casa.",
      "Las empanadas caseras de mi abuela.",
      "“De música ligera” de Soda Stereo.",
      "Una tarde de picnic en el parque Centenario.",
      "La cancha de Argentinos Juniors con mi papá.",
      "Cuando nadé solo por primera vez en la pileta del club.",
      "Mi mamá, quien me enseñó a no rendirme.",
      "El olor a pasto recién cortado en verano.",
      "Una vez me perdí en la feria y me encontró un policía.",
      "Aprendí que compartir siempre hace todo mejor.",
      "Admiraba mucho a mi abuelo, con su infinita paciencia.",
      "Soñaba con ser bombero para ayudar a otros.",
      "El día que recibí mi primera bicicleta.",
      "“Nunca dejes de soñar ni de creer en ti.”",
      "Gracias por esta entrevista, me hizo recordar momentos hermosos."
    ]));
    router.push('/summary');
  };

  if (questions.length === 0) {
    return <main className="flex items-center justify-center min-h-screen">Loading...</main>;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
      {showIntro ? (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {lang === 'es' && '¡Hola! Soy Amanda, tu biógrafa personal.'}
            {lang === 'en' && "Hi! I'm Amanda, your personal biographer."}
            {lang === 'pt' && 'Oi! Sou Amanda, sua biógrafa pessoal.'}
          </h2>
          <button
            onClick={handleNext}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {texts[lang].next}
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-center">{questions[currentQuestion]}</h2>

          <textarea
            className="border p-2 w-full max-w-md mb-4"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            placeholder={texts[lang].writeHere}
          />

          <div className="flex gap-4">
            {currentQuestion > 0 && (
              <button
                onClick={handleBack}
                className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                {texts[lang].back}
              </button>
            )}
            <button
              onClick={handleNext}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {currentQuestion < questions.length - 1 ? texts[lang].next : texts[lang].finish}
            </button>
          </div>

          <button
            onClick={startNewInterview}
            className="mt-6 text-sm underline text-blue-500 hover:text-blue-700"
          >
            {texts[lang].newInterview}
          </button>

          {isTestMode && (
            <button
              onClick={loadSampleAnswers}
              className="mt-4 text-xs underline text-green-600 hover:text-green-800"
            >
              {lang === 'es' ? 'Cargar respuestas de prueba' : lang === 'pt' ? 'Carregar respostas de teste' : 'Load sample answers'}
            </button>
          )}
        </>
      )}
    </main>
  );
}
