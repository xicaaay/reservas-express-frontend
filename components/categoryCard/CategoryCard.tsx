'use client';

import { AvailabilityItem } from '@/types';

interface Props {
  item: AvailabilityItem;
  selected: boolean;
  quantity: number;
  onSelect: (item: AvailabilityItem) => void;
  onQuantityChange: (quantity: number) => void;
}

export function CategoryCard({
  item,
  selected,
  quantity,
  onSelect,
  onQuantityChange,
}: Props) {
  // La disponibilidad ya viene calculada desde backend
  // Solo considera reservas PAID
  const isAvailable = item.available > 0;

  return (
    <div
      onClick={() => {
        if (isAvailable) {
          onSelect(item);
        }
      }}
      className={`border rounded p-4 transition ${
        isAvailable ? 'cursor-pointer' : 'cursor-not-allowed'
      } ${
        selected
          ? 'border-black bg-gray-100'
          : 'border-gray-300'
      } ${!isAvailable ? 'opacity-50' : ''}`}
    >
      <h2 className="text-lg font-semibold mb-2">
        {item.category}
      </h2>

      <ul className="text-sm space-y-1 mb-4">
        <li>
          Capacidad total:{' '}
          <strong>{item.capacity}</strong>
        </li>

        <li>
          Ocupados (pagados):{' '}
          <strong>{item.reserved}</strong>
        </li>

        <li>
          Disponibles:{' '}
          <strong>{item.available}</strong>
        </li>

        <li>
          Precio unitario:{' '}
          <strong>${item.price}</strong>
        </li>
      </ul>

      {selected && isAvailable && (
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <label className="text-sm">
            Cantidad
          </label>

          <input
            type="number"
            min={1}
            max={item.available}
            value={quantity}
            onChange={(e) =>
              onQuantityChange(
                Number(e.target.value),
              )
            }
            className="w-20 border rounded p-1"
          />
        </div>
      )}

      {!isAvailable && (
        <p className="text-xs text-red-600 mt-2">
          No hay disponibilidad para estas fechas
        </p>
      )}
    </div>
  );
}
