
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const isTestMode = typeof window !== 'undefined' && sessionStorage.getItem('storynest_test') === 'true';

  useEffect(() => {
    const selectedLang = sessionStorage.getItem('storynest_language') || 'en';
    setLang(selectedLang);
    if (selectedLang === 'es') setQuestions(questionsES);
    else if (selectedLang === 'pt') setQuestions(questionsPT);
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

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setInput(answers[currentQuestion - 1] || '');
      setAnswers(answers.slice(0, -1));
    }
  };

  const startNewInterview = () => {
    sessionStorage.removeItem('storynest_answers');
    router.push('/');
  };

  const loadSampleAnswers = () => {
    let samples = [];
    if (lang === 'es') {
      samples = [
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
      ];
    } else if (lang === 'pt') {
      samples = [
        "Estou muito bem, animado para começar.",
        "Nasci em Buenos Aires, Argentina.",
        "Era uma casa baixa, com um quintal e um enorme limoeiro.",
        "A pracinha da esquina, cheia de árvores e bancos antigos.",
        "Santi, meu vizinho de porta.",
        "Jogar bola na rua até escurecer.",
        "Meu carrinho vermelho e a mesa de pebolim de casa.",
        "As empanadas caseiras da minha avó.",
        "“De música ligera” do Soda Stereo.",
        "Um piquenique no Parque Centenário.",
        "As visitas ao estádio do Argentinos Juniors com meu pai.",
        "Quando nadei sozinho pela primeira vez na piscina do clube.",
        "Minha mãe, que me ensinou a nunca desistir.",
        "O cheiro de grama recém-cortada no verão.",
        "Me perdi uma vez na feira e um policial me encontrou.",
        "Aprendi que compartilhar sempre deixa tudo melhor.",
        "Admirava muito meu avô, com sua paciência infinita.",
        "Sonhava em ser bombeiro para ajudar as pessoas.",
        "O dia em que ganhei minha primeira bicicleta.",
        "Nunca pare de sonhar e acreditar em você mesmo.",
        "Obrigado por esta entrevista, me fez relembrar momentos lindos."
      ];
    } else {
      samples = [
        "I'm doing great, excited to start.",
        "I was born in Buenos Aires, Argentina.",
        "It was a small house with a patio and a huge lemon tree.",
        "The little square at the corner, full of old trees and benches.",
        "Santi, my next-door neighbor.",
        "Playing soccer on the street until it got dark.",
        "My red toy car and the foosball table at home.",
        "My grandmother’s homemade empanadas.",
        "“De música ligera” by Soda Stereo.",
        "A picnic afternoon at Centenario Park.",
        "Argentinos Juniors' stadium visits with my dad.",
        "When I swam alone for the first time at the club’s pool.",
        "My mom, who taught me never to give up.",
        "The smell of freshly cut grass in summer.",
        "I got lost once at the fair and a policeman helped me.",
        "I learned that sharing always makes everything better.",
        "I admired my grandfather, with his endless patience.",
        "I dreamed of becoming a firefighter to help others.",
        "The day I got my first bicycle.",
        "Never stop dreaming and believing in yourself.",
        "Thank you for this interview, it brought back beautiful memories."
      ];
    }

    sessionStorage.setItem('storynest_answers', JSON.stringify(samples));
    router.push('/summary');
  };

  if (questions.length === 0) {
    return <main className="flex items-center justify-center min-h-screen">Loading...</main>;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
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
    </main>
  );
}
