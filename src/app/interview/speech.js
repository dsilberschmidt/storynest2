
// src/app/interview/speech.js

let recognition;
let listening = false;

export function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("⚠️ Tu navegador no soporta reconocimiento de voz. Por favor responde escribiendo.");
    return null;
  }
  const recog = new SpeechRecognition();
  recog.lang = 'es-ES';
  recog.interimResults = false;
  recog.maxAlternatives = 1;
  return recog;
}

export function startListening(inputId = 'answer-input') {
  if (!recognition) {
    recognition = initSpeechRecognition();
    if (!recognition) return;
    
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      const inputField = document.getElementById(inputId);
      if (inputField) {
        inputField.value = speechResult;
        const inputEvent = new Event('input', { bubbles: true });
        inputField.dispatchEvent(inputEvent);
      }
      console.log('Texto reconocido:', speechResult);
    };
    
    recognition.onerror = (event) => {
      console.error('Error en reconocimiento:', event.error);
    };
    
    recognition.onend = () => {
      listening = false;
      console.log('🎙️ Reconocimiento finalizado.');
    };
  }

  if (!listening) {
    recognition.start();
    listening = true;
    console.log('🎙️ Escuchando...');
  }
}
