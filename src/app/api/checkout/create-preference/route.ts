import { NextRequest, NextResponse } from 'next/server';
import { preferenceClient, MP_CONFIG } from '@/app/lib/mercadopago';
import { prisma } from '@/app/lib/prisma';

/**
 * Este endpoint crea una preferencia de pago SIN crear la orden todavía
 * La orden se creará SOLO cuando el pago sea aprobado en el webhook
 * ⚠️ VERSIÓN CON DEBUGGING - Remover logs después de resolver
 */
export async function POST(request: NextRequest) {
  console.log('🔵 ===== INICIO: Creación de preferencia =====');
  
  try {
    const body = await request.json();
    const { customer, items, total, shippingAddress } = body;

    console.log('📦 Datos recibidos:', {
      customer: customer?.email,
      itemsCount: items?.length,
      total,
      shippingAddress: shippingAddress?.substring(0, 50)
    });

    // Validaciones básicas
    if (!customer || !items || !total) {
      console.error('❌ ERROR: Datos incompletos', { customer: !!customer, items: !!items, total: !!total });
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      console.error('❌ ERROR: Carrito vacío');
      return NextResponse.json(
        { error: 'El carrito está vacío' },
        { status: 400 }
      );
    }

    console.log('✅ Validaciones básicas pasadas');

    // Verificar stock ANTES de crear la preferencia (pero NO descontarlo)
    console.log('🔍 Verificando stock...');
    for (const item of items) {
      if (item.variantId) {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
        });
        if (!variant || variant.stock < item.quantity) {
          console.error(`❌ Stock insuficiente para variante ${item.variantId}`);
          return NextResponse.json(
            { error: `Stock insuficiente para la variante seleccionada` },
            { status: 400 }
          );
        }
        console.log(`✅ Stock OK para variante ${item.variantId}: ${variant.stock} disponibles`);
      } else {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product || product.stock < item.quantity) {
          console.error(`❌ Stock insuficiente para producto ${item.productId}`);
          return NextResponse.json(
            { error: `Stock insuficiente para ${product?.name || 'el producto'}` },
            { status: 400 }
          );
        }
        console.log(`✅ Stock OK para ${product.name}: ${product.stock} disponibles`);
      }
    }

    console.log('✅ Verificación de stock completada');

    // Obtener información completa de productos para MercadoPago
    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    console.log(`📦 Productos obtenidos: ${products.length}`);

    // Crear items para MercadoPago
    const mpItems = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        id: item.productId,
        title: product?.name || 'Producto',
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: 'MXN',
      };
    });

    console.log('🛒 Items para MercadoPago:', JSON.stringify(mpItems, null, 2));
    console.log('🔗 MP_CONFIG:', {
      publicKey: MP_CONFIG.publicKey?.substring(0, 20) + '...',
      backUrls: MP_CONFIG.backUrls,
      notificationUrl: MP_CONFIG.notificationUrl
    });

    // Crear preferencia de pago
    console.log('🚀 Llamando a MercadoPago API...');
    
    const preferenceBody = {
      items: mpItems,
      payer: {
        name: customer.name,
        email: customer.email,
        phone: {
          number: customer.phone || '',
        },
        address: {
          street_name: customer.address || '',
          zip_code: customer.zipCode || '',
        },
      },
      back_urls: {
        success: `${MP_CONFIG.backUrls.success}`,
        failure: `${MP_CONFIG.backUrls.failure}`,
        pending: `${MP_CONFIG.backUrls.pending}`,
      },
      auto_return: 'approved' as const,
      notification_url: MP_CONFIG.notificationUrl,
      external_reference: JSON.stringify({
        customer,
        items,
        total,
        shippingAddress,
        timestamp: Date.now(),
      }),
      statement_descriptor: 'MI E-COMMERCE',
    };

    console.log('📋 Preference body:', JSON.stringify(preferenceBody, null, 2));

    const preference = await preferenceClient.create({
      body: preferenceBody,
    });

    console.log('✅ ¡Preferencia creada exitosamente!');
    console.log('🆔 Preference ID:', preference.id);
    console.log('🔗 Init Point:', preference.init_point);

    const response = {
      preferenceId: preference.id,
      initPoint: preference.init_point,
    };

    console.log('📤 Respuesta enviada al cliente:', response);
    console.log('🟢 ===== FIN: Preferencia creada correctamente =====');

    return NextResponse.json(response);
    
  } catch (error: any) {
    console.error('❌ ===== ERROR CRÍTICO =====');
    console.error('Error completo:', error);
    console.error('Error message:', error.message);
    console.error('Error cause:', error.cause);
    console.error('Error stack:', error.stack);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    
    return NextResponse.json(
      { error: error.message || 'Error al crear preferencia de pago' },
      { status: 500 }
    );
  }
}