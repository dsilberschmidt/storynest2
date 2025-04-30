'use client';

export default function VoiceRecorder({ lang, texts }) {
  return (
    <div className="flex flex-col items-center gap-2 my-4">
      <button
        disabled
        className="px-4 py-2 rounded bg-gray-300 text-gray-600 text-sm cursor-not-allowed"
        title={texts[lang].voiceComingSoon}
      >
        🎙️ {texts[lang].voiceComingSoon}
      </button>
    </div>
  );
}