
// src/app/interview/speech.js

let recognition;
let listening = false;
let originalButtonColor = null;

export function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("⚠️ Tu navegador no soporta reconocimiento de voz. Por favor responde escribiendo.");
    return null;
  }
  const recog = new SpeechRecognition();
  recog.lang = 'es-ES';
  recog.interimResults = false;
  recog.continuous = false;
  recog.maxAlternatives = 1;
  return recog;
}

export function startListening(inputId = 'answer-input', buttonId = 'mic-button', setInput) {
  if (!recognition) {
    recognition = initSpeechRecognition();
    if (!recognition) return;

    recognition.onstart = () => {
      console.log('🎙️ Reconocimiento de voz iniciado.');
      const button = document.getElementById(buttonId);
      if (button) {
        originalButtonColor = button.style.backgroundColor;
        button.style.backgroundColor = '#FF0000'; // rojo grabando
      }
      alert('🎙️ Micrófono activo, puedes empezar a hablar.');
    };

    recognition.onspeechstart = () => {
      alert('🗣️ Se detectó que estás hablando.');
    };

    recognition.onspeechend = () => {
      alert('🔇 Dejaste de hablar.');
    };

    recognition.onsoundstart = () => {
      alert('🔊 Sonido detectado.');
    };

    recognition.onsoundend = () => {
      alert('🔈 Fin del sonido.');
    };

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      console.log('🎯 Voz capturada:', speechResult);
      if (typeof setInput === 'function') {
        setInput(speechResult);
      }
      alert('🎯 Texto capturado: "' + speechResult + '"');
    };

    recognition.onerror = (event) => {
      console.error('❌ Error en reconocimiento:', event.error);
      alert('❌ Error en reconocimiento: ' + event.error);
    };

    recognition.onend = () => {
      console.log('🎙️ Reconocimiento de voz terminado.');
      listening = false;
      const button = document.getElementById(buttonId);
      if (button && originalButtonColor !== null) {
        button.style.backgroundColor = originalButtonColor;
      }
      alert('✅ Grabación finalizada.');
    };
  }

  if (!listening) {
    try {
      recognition.start();
      listening = true;
      console.log('🎙️ Escuchando...');
    } catch (error) {
      console.error('❌ Error al iniciar reconocimiento:', error);
      alert('❌ Error al iniciar reconocimiento: ' + error.message);
    }
  }
}
