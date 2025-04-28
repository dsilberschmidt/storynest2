
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
      if (event.error === 'not-allowed') {
        alert('⚠️ No se permitió el acceso al micrófono. Por favor habilita el permiso en configuración del navegador.');
      }
      if (event.error === 'network') {
        alert('⚠️ No se pudo conectar al servicio de reconocimiento de voz. Verifica tu conexión o la configuración de tu navegador.');
      }
    };
    
    recognition.onend = () => {
      listening = false;
      console.log('🎙️ Reconocimiento finalizado.');
    };
  }

  if (!listening) {
    try {
      recognition.start();
      listening = true;
      console.log('🎙️ Escuchando...');
    } catch (error) {
      console.error('Error al iniciar reconocimiento:', error);
      alert('⚠️ No se pudo iniciar el reconocimiento de voz. Verifica permisos o conexión.');
    }
  }
}
