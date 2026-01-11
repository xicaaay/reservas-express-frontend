export type PaymentFormErrors = {
  cardNumber?: string;
  cardHolder?: string;
  expiration?: string;
  cvv?: string;
};

type PaymentFormData = {
  cardNumber: string;
  cardHolder: string;
  expiration: string;
  cvv: string;
};

/**
 * Valida los campos del formulario de pago.
 * No ejecuta efectos secundarios ni dependencias de UI.
 */
export function validatePaymentForm(
  data: PaymentFormData,
): PaymentFormErrors {
  const errors: PaymentFormErrors = {};

  // Tarjeta: exactamente 16 dígitos
  if (!/^\d{16}$/.test(data.cardNumber)) {
    errors.cardNumber =
      'La tarjeta debe tener 16 dígitos';
  }

  // Titular obligatorio
  if (!data.cardHolder.trim()) {
    errors.cardHolder =
      'Ingresa el nombre del titular';
  }

  // Expiración MM/YY con mes válido
  if (
    !/^(0[1-9]|1[0-2])\/\d{2}$/.test(
      data.expiration,
    )
  ) {
    errors.expiration =
      'Formato inválido (MM/YY)';
  }

  // CVV: exactamente 3 dígitos
  if (!/^\d{3}$/.test(data.cvv)) {
    errors.cvv = 'CVV inválido';
  }

  return errors;
}
