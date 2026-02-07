import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.accountingExternalItem.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ success: true, data: items });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al listar items externos';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Falta el campo name' },
        { status: 400 }
      );
    }
    const item = await prisma.accountingExternalItem.create({
      data: {
        name: String(name),
        description: description ? String(description) : null,
      },
    });
    return NextResponse.json({ success: true, data: item });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al crear item externo';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
