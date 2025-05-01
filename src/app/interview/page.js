
'use client';
import { Suspense } from 'react';
import Interview from './Interview';

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando entrevista...</div>}>
      <Interview />
    </Suspense>
  );
}
