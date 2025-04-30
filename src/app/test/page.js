'use client';
import VoiceRecorder from '../components/VoiceRecorder';

export default function TestPage() {
  const handleResult = (text) => {
    console.log('✅ Texto transcripto:', text);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Prueba de reconocimiento de voz</h1>
      <VoiceRecorder onTranscriptionReady={handleResult} />
    </div>
  );
}