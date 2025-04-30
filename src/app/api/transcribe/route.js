// src/app/api/transcribe/route.js

import { NextResponse } from 'next/server';

export async function POST(req) {
  const apiKey = process.env.NEXT_PUBLIC_AIMLAPI_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'AIMLAPI Key missing' }, { status: 500 });
  }

  const formData = await req.formData();
  const audioFile = formData.get('file');

  if (!audioFile) {
    return NextResponse.json({ error: 'No audio file received' }, { status: 400 });
  }

  const createForm = new FormData();
  createForm.append('file', audioFile);
  createForm.append('model', 'g1_whisper-large');
  createForm.append('response_format', 'json');
  createForm.append('language', 'es'); // opcional: se puede ajustar dinámicamente

  try {
    // Paso 1: crear tarea
    const createRes = await fetch('https://api.aimlapi.com/v1/stt/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: createForm,
    });

    if (!createRes.ok) {
      throw new Error(`AIMLAPI stt/create failed with status ${createRes.status}`);
    }

    const { generation_id } = await createRes.json();
    if (!generation_id) {
      throw new Error('Missing generation_id in AIMLAPI response');
    }

    // Esperar 3 segundos (puede ajustarse)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Paso 2: obtener resultado
    const resultRes = await fetch(`https://api.aimlapi.com/v1/stt/${generation_id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!resultRes.ok) {
      throw new Error(`AIMLAPI stt/{id} failed with status ${resultRes.status}`);
    }

    const data = await resultRes.json();
    return NextResponse.json({ text: data.text || '' });
  } catch (error) {
    console.error('❌ Error en transcripción AIMLAPI:', error);
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 });
  }
}