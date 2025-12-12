import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configuración del cliente de MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
  },
});

// Instancia de Preference
export const preferenceClient = new Preference(client);

// Configuración base
export const MP_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!,
  backUrls: {
    success: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
    failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failure`,
    pending: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/pending`,
  },
  notificationUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/mercadopago`,
};