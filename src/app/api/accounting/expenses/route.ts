import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const expenses = await prisma.accountingExpense.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json({ success: true, data: expenses });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al listar gastos';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description, amount, date } = body;
    if (!description || amount == null || !date) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos: description, amount, date' },
        { status: 400 }
      );
    }
    const expense = await prisma.accountingExpense.create({
      data: {
        description: String(description),
        amount: Number(amount),
        date: new Date(date),
      },
    });
    return NextResponse.json({ success: true, data: expense });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al crear gasto';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
