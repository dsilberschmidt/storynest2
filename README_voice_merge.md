## 🎙️ Voice integration (experimental)

Esta rama prueba la integración de grabación de voz con AIMLAPI usando `MediaRecorder` y archivos `.webm`.

### Estado actual:
- Grabación y envío funcionan.
- AIMLAPI rechaza `audio/webm` con error 400.
- Requiere conversión a formato más compatible o cambio de proveedor.

### Próximos pasos:
- Usar OpenAI Whisper API.
- O convertir audio a `.wav` real con `ffmpeg` en backend.

---
# StoryNest

App web para capturar historias de vida mediante entrevistas guiadas y generar biografías personalizadas con ayuda de IA.

## 🌐 Idiomas soportados
- Español
- Inglés
- Portugués

## 🚀 Instrucciones
1. Clonar el repositorio
2. Instalar dependencias
3. Configurar `.env.local`
4. Ejecutar `npm run dev`