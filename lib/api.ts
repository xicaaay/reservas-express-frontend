import { AvailabilityItem } from '@/types';

// Consulta de disponibilidad
export async function checkAvailability(
  startDate: string,
  endDate: string
): Promise<AvailabilityItem[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/availability?startDate=${startDate}&endDate=${endDate}`
  );

  if (!response.ok) {
    let message = 'Error al consultar disponibilidad';

    try {
      const errorBody = await response.json();
      if (typeof errorBody.message === 'string') {
        message = errorBody.message;
      }
    } catch {
    }

    throw new Error(message);
  }

  return response.json();
}

// Crear reservación (se crea en estado PENDING y al momento de pagar cambia a PAID)
export async function createReservation(payload: {
  email: string;
  category: string;
  quantity: number;
  startDate: string;
  endDate: string;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/reservations`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  );

  const text = await res.text();
  console.log('STATUS:', res.status);
  console.log('RESPONSE RAW:', text);

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text };
  }

  if (!res.ok) {
    throw new Error(data.message || 'Failed to create reservation');
  }

  return data;
}

// Checkout, simulación de pago
export async function checkoutPayment(payload: {
  reservationId: string;
  cardNumber: string;
  cardHolder: string;
  expiration: string;
  cvv: string;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Checkout failed');
  }

  return response.json();
}