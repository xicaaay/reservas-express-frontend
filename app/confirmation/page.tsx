// app/confirmation/page.tsx
import { Suspense } from 'react';
import Confirmationclient from './ConfirmationClient';

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<p>Cargando confirmación...</p>}>
      <Confirmationclient />
    </Suspense>
  );
}
