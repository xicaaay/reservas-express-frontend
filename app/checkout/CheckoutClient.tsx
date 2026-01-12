'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { checkoutPayment } from '@/lib/api';

// Validaciones externas
import {
  validatePaymentForm,
  type PaymentFormErrors,
} from '@/lib/payment-validations/payment';

// React Icons
import { MdOutlinePayments } from 'react-icons/md';
import { FaCreditCard } from 'react-icons/fa';

type ReservationSummary = {
  id: string;
  email: string;
  category: string;
  quantity: number;
  total: number;
  status?: string;
};

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const reservationId = searchParams.get('reservationId');

  const [reservation, setReservation] =
    useState<ReservationSummary | null>(null);

  // Datos de tarjeta
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiration, setExpiration] = useState('');
  const [cvv, setCvv] = useState('');

  // Errores de validación
  const [errors, setErrors] =
    useState<PaymentFormErrors>({});

  /**
   * Carga del resumen de la reserva
   */
  useEffect(() => {
    if (!reservationId) return;

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/reservations/${reservationId}`,
    )
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Reservation not found');
        }
        return res.json();
      })
      .then((data) => {
        // 🔐 Si ya está pagada, redirigimos directo
        if (data.status === 'PAID') {
          router.replace(
            `/confirmation?reservationId=${data.id}`,
          );
          return;
        }

        setReservation(data);
      })
      .catch(() => {
        toast.error('No se pudo cargar la reserva');
      });
  }, [reservationId, router]);

  /**
   * Ejecuta validaciones usando la lógica externa
   */
  const validateForm = () => {
    const validationErrors =
      validatePaymentForm({
        cardNumber,
        cardHolder,
        expiration,
        cvv,
      });

    setErrors(validationErrors);

    return (
      Object.keys(validationErrors).length === 0
    );
  };

  /**
   * Flujo de pago
   */
  const handlePay = async () => {
    if (!validateForm()) {
      toast.error('Revisa los datos de la tarjeta');
      return;
    }

    if (!reservationId) {
      toast.error('Reserva inválida');
      return;
    }

    const toastId = toast.loading('Procesando pago');

    try {
      const result = await checkoutPayment({
        reservationId,
        cardNumber,
        cardHolder,
        expiration,
        cvv,
      });

      // ✅ Estados finales felices (éxito real o idempotente)
      if (
        result?.status === 'PAID' ||
        result?.message === 'Reservation already paid' ||
        result?.message === 'Payment processed successfully'
      ) {
        toast.success('Pago confirmado', {
          id: toastId,
        });

        router.push(
          `/confirmation?reservationId=${reservationId}`,
        );
        return;
      }

      throw new Error(
        result?.message ||
          'Estado de pago inesperado',
      );
    } catch (error: any) {
      toast.error(
        error.message || 'Error en el pago',
        { id: toastId },
      );
    }
  };

  /**
   * Estado de carga
   */
  if (!reservation?.id) {
    return (
      <main className="max-w-md mx-auto p-4">
        <p>Cargando reserva…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 my-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Checkout
          </h1>
          <p className="text-sm text-gray-500">
            Completa el pago para finalizar tu reserva
          </p>
        </div>

        {/* Resumen */}
        <div className="border border-gray-300 rounded-lg text-sm mb-6">
          <div className="p-3 flex justify-between border-b border-gray-300">
            <span className="text-gray-500">Reserva</span>
            <span className="font-medium">
              #{reservation.id}
            </span>
          </div>

          <div className="p-3 flex justify-between border-b border-gray-300">
            <span className="text-gray-500">Email</span>
            <span className="font-medium">
              {reservation.email}
            </span>
          </div>

          <div className="p-3 flex justify-between border-b border-gray-300">
            <span className="text-gray-500">Categoría</span>
            <span className="font-medium">
              {reservation.category}
            </span>
          </div>

          <div className="p-3 flex justify-between border-b border-gray-300">
            <span className="text-gray-500">Cantidad</span>
            <span className="font-medium">
              {reservation.quantity}
            </span>
          </div>

          <div className="p-3 flex justify-between">
            <span className="font-semibold text-gray-700">
              Total
            </span>
            <span className="font-semibold text-gray-900">
              ${reservation.total}
            </span>
          </div>
        </div>

        {/* Formulario de pago */}
        <div className="space-y-3 mb-6">
          {/* Número de tarjeta */}
          <div>
            <label className="text-xs text-gray-500">
              Número de tarjeta
            </label>
            <div className="relative">
              <FaCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                maxLength={16}
                inputMode="numeric"
                className={`w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:ring-2 ${
                  errors.cardNumber
                    ? 'border-red-500 focus:ring-red-500'
                    : 'focus:ring-black'
                }`}
                placeholder="1234567890123456"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(
                    e.target.value.replace(/\D/g, ''),
                  )
                }
              />
            </div>
            {errors.cardNumber && (
              <p className="text-xs text-red-500 mt-1">
                {errors.cardNumber}
              </p>
            )}
          </div>

          {/* Titular */}
          <div>
            <label className="text-xs text-gray-500">
              Titular de la tarjeta
            </label>
            <input
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 ${
                errors.cardHolder
                  ? 'border-red-500 focus:ring-red-500'
                  : 'focus:ring-black'
              }`}
              placeholder="Nombre completo"
              value={cardHolder}
              onChange={(e) =>
                setCardHolder(e.target.value)
              }
            />
            {errors.cardHolder && (
              <p className="text-xs text-red-500 mt-1">
                {errors.cardHolder}
              </p>
            )}
          </div>

          {/* Expiración y CVV */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500">
                Expiración
              </label>
              <input
                maxLength={5}
                inputMode="numeric"
                className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 ${
                  errors.expiration
                    ? 'border-red-500 focus:ring-red-500'
                    : 'focus:ring-black'
                }`}
                placeholder="MM/YY"
                value={expiration}
                onChange={(e) => {
                  let value = e.target.value
                    .replace(/\D/g, '')
                    .slice(0, 4);

                  if (value.length >= 3) {
                    value =
                      value.slice(0, 2) +
                      '/' +
                      value.slice(2);
                  }

                  setExpiration(value);
                }}
              />
              {errors.expiration && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.expiration}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-500">
                CVV
              </label>
              <input
                maxLength={3}
                inputMode="numeric"
                className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 ${
                  errors.cvv
                    ? 'border-red-500 focus:ring-red-500'
                    : 'focus:ring-black'
                }`}
                placeholder="123"
                value={cvv}
                onChange={(e) =>
                  setCvv(
                    e.target.value.replace(/\D/g, ''),
                  )
                }
              />
              {errors.cvv && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.cvv}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Acción */}
        <button
          onClick={handlePay}
          className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white py-3 rounded-lg font-medium transition"
        >
          <MdOutlinePayments className="text-sm" />
          Pagar ${reservation.total}
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-4">
          Pago simulado · No se almacenan datos reales
        </p>
      </div>
    </main>
  );
}
