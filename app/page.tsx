'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
  checkAvailability,
  createReservation,
} from '@/lib/api';
import { AvailabilityItem } from '@/types';
import { CategoryCard } from '@/components/categoryCard/CategoryCard';

export default function HomePage() {
  const router = useRouter();

  // Fechas
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Disponibilidad
  const [availability, setAvailability] =
    useState<AvailabilityItem[]>([]);

  // Selección
  const [selectedItem, setSelectedItem] =
    useState<AvailabilityItem | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Paso email
  const [showEmailStep, setShowEmailStep] =
    useState(false);
  const [email, setEmail] = useState('');

  /**
   * Consulta disponibilidad
   */
  const handleSearch = async () => {
    if (!startDate || !endDate) {
      toast.error(
        'Debes seleccionar una fecha de inicio y una fecha de fin',
      );
      return;
    }

    if (endDate <= startDate) {
      toast.error(
        'La fecha de fin debe ser posterior a la fecha de inicio',
      );
      return;
    }

    const toastId = toast.loading(
      'Consultando disponibilidad',
    );

    try {
      const data = await checkAvailability(
        startDate,
        endDate,
      );

      setAvailability(data);
      setSelectedItem(null);
      setQuantity(1);
      setShowEmailStep(false);
      setEmail('');

      toast.success(
        'Disponibilidad obtenida correctamente',
        { id: toastId },
      );
    } catch (error: any) {
      toast.error(
        error.message ||
          'Error al consultar disponibilidad',
        { id: toastId },
      );
    }
  };

  /**
   * Continuar al paso de email
   */
  const handleContinue = () => {
    if (!selectedItem) {
      toast.error('Selecciona una categoría');
      return;
    }

    if (
      quantity < 1 ||
      quantity > selectedItem.available
    ) {
      toast.error('Cantidad inválida');
      return;
    }

    setShowEmailStep(true);
  };

  /**
   * Crear reserva y continuar al checkout
   */
  const handleConfirmEmail = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Ingresa un email válido');
      return;
    }

    const toastId = toast.loading(
      'Creando reserva',
    );

    try {
      const reservation = await createReservation({
        email,
        category: selectedItem!.category,
        quantity,
        startDate,
        endDate,
      });

      if (!reservation?.data?.id) {
        throw new Error(
          'No se pudo crear la reserva',
        );
      }

      toast.success('Reserva creada', {
        id: toastId,
      });

      router.push(
        `/checkout?reservationId=${reservation.data.id}`,
      );
    } catch (error: any) {
      toast.error(
        error.message || 'Error al crear reserva',
        { id: toastId },
      );
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 my-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Sistema de Reservas Express
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Consulta disponibilidad y reserva en pocos
            pasos
          </p>
        </div>

        {/* Paso 1: Fechas */}
        <div className="space-y-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-700">
            1. Selecciona las fechas
          </h2>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Fecha de inicio
            </label>
            <input
              type="date"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Fecha de fin
            </label>
            <input
              type="date"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
            />
          </div>

          <button
            onClick={handleSearch}
            className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-xl font-medium transition"
          >
            Consultar disponibilidad
          </button>
        </div>

        {/* Paso 2: Categorías */}
        {availability.length > 0 && (
          <div className="space-y-4 mb-6">
            <h2 className="text-sm font-semibold text-gray-700">
              2. Elige una categoría
            </h2>

            {availability.map((item) => (
              <CategoryCard
                key={item.category}
                item={item}
                selected={
                  selectedItem?.category ===
                  item.category
                }
                quantity={quantity}
                onSelect={(item) => {
                  setSelectedItem(item);
                  setQuantity(1);
                  setShowEmailStep(false);
                }}
                onQuantityChange={setQuantity}
              />
            ))}
          </div>
        )}

        {/* Paso 3: Resumen */}
        {selectedItem && !showEmailStep && (
          <div className="border-t pt-4 space-y-3">
            <h2 className="text-sm font-semibold text-gray-700">
              3. Resumen
            </h2>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Categoría
              </span>
              <span className="font-medium">
                {selectedItem.category}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Total
              </span>
              <span className="font-semibold">
                ${quantity * selectedItem.price}
              </span>
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Paso 4: Email */}
        {showEmailStep && (
          <div className="border-t pt-4 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">
              4. Ingresa tu email
            </h2>

            <input
              type="email"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <button
              onClick={handleConfirmEmail}
              className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-xl font-medium transition"
            >
              Continuar al checkout
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
