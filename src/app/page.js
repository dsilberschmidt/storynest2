
'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const selectLanguage = (lang) => {
    sessionStorage.setItem('storynest_language', lang);
    router.push('/interview');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to StoryNest</h1>
      <h2 className="text-xl font-semibold mb-4 text-center">Choose your language</h2>
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <button
          onClick={() => selectLanguage('es')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded"
        >
          🇪🇸 Español
        </button>
        <button
          onClick={() => selectLanguage('en')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
        >
          🇬🇧 English
        </button>
        <button
          onClick={() => selectLanguage('pt')}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded"
        >
          🇧🇷 Português
        </button>
      </div>
    </main>
  );
}
