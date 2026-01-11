'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

//React Icons
import { FaCalendarCheck } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";


type ReservationConfirmation = {
    id: string;
    email: string;
    category: string;
    quantity: number;
    startDate: string;
    endDate: string;
    total: number;
    status: 'PAID' | 'PENDING';
};

export default function ConfirmationPage() {
    const searchParams = useSearchParams();
    const reservationId = searchParams.get('reservationId');

    const [reservation, setReservation] =
        useState<ReservationConfirmation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!reservationId) {
            toast.error('Reserva inválida');
            setLoading(false);
            return;
        }

        fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/reservations/${reservationId}`,
        )
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Reservation not found');
                }
                return res.json();
            })
            .then((data) => {
                setReservation(data);
            })
            .catch(() => {
                toast.error('No se pudo cargar la reserva');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [reservationId]);

    if (loading) {
        return (
            <main className="max-w-md mx-auto p-4">
                <p>Cargando confirmación…</p>
            </main>
        );
    }

    if (!reservation) {
        return (
            <main className="max-w-md mx-auto p-4">
                <p className="text-red-600">
                    No se encontró la reserva
                </p>
            </main>
        );
    }

    return (
        <main className="flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 my-6">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 text-xl">
                        <FaCalendarCheck />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        ¡Reserva confirmada!
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Tu pago fue procesado correctamente
                    </p>
                </div>

                {/* Resumen */}
                <div className="rounded-lg  text-sm mb-6 shadow-lg">
                    <div className="p-3 flex justify-between shadow">
                        <span className="text-gray-500">ID de reserva</span>
                        <span className="font-medium">{reservation.id}</span>
                    </div>

                    <div className="p-3 flex justify-between shadow">
                        <span className="text-gray-500">Email</span>
                        <span className="font-medium">{reservation.email}</span>
                    </div>

                    <div className="p-3 flex justify-between shadow">
                        <span className="text-gray-500">Categoría</span>
                        <span className="font-medium">{reservation.category}</span>
                    </div>

                    <div className="p-3 flex justify-between shadow">
                        <span className="text-gray-500">Cantidad</span>
                        <span className="font-medium">{reservation.quantity}</span>
                    </div>

                    <div className="p-3 flex justify-between shadow">
                        <span className="text-gray-500">Fechas</span>
                        <span className="font-medium text-right">
                            {reservation.startDate.split('T')[0]} <br />→{' '}
                            {reservation.endDate.split('T')[0]}
                        </span>
                    </div>

                    <div className="p-3 flex justify-between shadow">
                        <span className="text-gray-500">Total pagado</span>
                        <span className="font-semibold text-gray-900">
                            ${reservation.total}
                        </span>
                    </div>

                    <div className="p-3 flex justify-between items-center shadow">
                        <span className="text-gray-500">Estado</span>
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                            {reservation.status}
                        </span>
                    </div>
                </div>

                {/* Acción */}
                <div className="flex">
                    <a
                        href={`${process.env.NEXT_PUBLIC_API_URL}/reservations/${reservation.id}/ticket`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white py-3 rounded-lg font-medium transition"
                    >
                        <IoMdDownload className="text-lg" />
                        <span>Descargar ticket PDF</span>
                    </a>
                </div>

                {/* Footer */}
                <p className="text-xs text-center text-gray-400 mt-4">
                    Te enviamos una copia de esta información a tu correo
                </p>
            </div>
        </main>

    );
}
