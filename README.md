## 🧪 Experimental Branch: voice-experiment

We explored voice input with AIMLAPI using the Whisper model in a separate branch: [`voice-experiment`](https://github.com/tuusuario/storynest2/tree/voice-experiment)

### Current status:
- Audio recording and upload via MediaRecorder works
- AIMLAPI currently rejects audio/webm with 400 errors
- Further integration would require format conversion (e.g., with ffmpeg)

This branch is **not part of the submitted MVP**, but documents technical exploration for future features.

# StoryNest

StoryNest is a mobile-first web app that captures life stories through guided digital interviews and generates beautiful AI-assisted biographies.

Built for the **Execute AI Genesis 2025** hackathon.

## Key Features

- Mobile-first design
- Guided interview with 50+ questions
- Optional speech-to-text answers
- AI-generated short biography
- Easy preview and download

## Technologies

- Next.js 15 (Turbopack)
- TailwindCSS 4
- Node.js 20, npm 10

## Current Status

- Basic interview flow working
- Mobile testing underway
- AI text generation integration in progress

---

*Every life deserves to be told.*