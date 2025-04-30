'use client';

import { useState, useRef } from 'react';

export default function VoiceRecorder({ onTranscriptionReady }) {
  const [recording, setRecording] = useState(false);
  const [audioType, setAudioType] = useState('');
  const [responseText, setResponseText] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setResponseText('');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      audioChunksRef.current = [];

      setAudioType(audioBlob.type);

      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.text) {
        setResponseText(data.text);
        onTranscriptionReady(data.text);
      } else {
        setResponseText('⚠️ AIMLAPI no devolvió texto');
      }
    };

    audioChunksRef.current = [];
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="flex flex-col items-center gap-2 my-2">
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`px-3 py-1 rounded text-sm ${recording ? 'bg-red-500' : 'bg-green-500'} text-white animate-pulse`}
      >
        {recording ? 'Grabando...' : 'Hablar'}
      </button>

      {audioType && <p className="text-sm text-gray-600">🎧 Tipo de audio: {audioType}</p>}
      {responseText && <p className="text-sm text-blue-700 mt-2">📝 Transcripción: {responseText}</p>}
    </div>
  );
}