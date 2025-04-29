
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isTestMode, setIsTestMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const test = localStorage.getItem('storynest_test') === 'true';
    setIsTestMode(test);
  }, []);

  const toggleTestMode = () => {
    if (isTestMode) {
      localStorage.removeItem('storynest_test');
      setIsTestMode(false);
    } else {
      localStorage.setItem('storynest_test', 'true');
      setIsTestMode(true);
    }
  };

  const selectLanguage = (lang) => {
    sessionStorage.setItem('storynest_language', lang);
    router.push('/interview');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 space-y-6">
      {isTestMode && (
        <div className="text-center text-red-600 font-bold text-xl">
          ⚠️ MODO PRUEBA ACTIVADO ⚠️
        </div>
      )}

      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to StoryNest</h1>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => selectLanguage('es')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
        >
          🇪🇸 Español
        </button>
        <button
          onClick={() => selectLanguage('en')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
        >
          🇬🇧 English
        </button>
        <button
          onClick={() => selectLanguage('pt')}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded"
        >
          🇧🇷 Português
        </button>
      </div>

      <div className="flex items-center mt-10 space-x-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={isTestMode}
          onChange={toggleTestMode}
          id="testMode"
          className="w-4 h-4"
        />
        <label htmlFor="testMode" className="cursor-pointer select-none">
          {isTestMode ? 'Desactivar modo prueba' : 'Activar modo prueba'}
        </label>
      </div>
    </main>
  );
}
