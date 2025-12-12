import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const test = await prisma.test.create({
      data: {
        name: 'Conexión exitosa desde Next.js! 🎉'
      }
    });

    const allTests = await prisma.test.findMany();

    return NextResponse.json({ 
      success: true, 
      message: 'Base de datos conectada correctamente',
      nuevoRegistro: test,
      todosLosRegistros: allTests
    });
  } catch (error) {
    console.error('Error de base de datos:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'No se pudo conectar a la base de datos',
      detalles: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}