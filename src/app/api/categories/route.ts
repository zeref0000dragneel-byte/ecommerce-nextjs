import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// GET - Obtener todas las categorías
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return NextResponse.json(
      { message: "Error al obtener categorías" },
      { status: 500 }
    );
  }
}

// POST - Crear nueva categoría
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug } = body;

    // Validaciones
    if (!name || !slug) {
      return NextResponse.json(
        { message: "Nombre y slug son requeridos" },
        { status: 400 }
      );
    }

    // Verificar si el slug ya existe
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: "Ya existe una categoría con ese slug" },
        { status: 400 }
      );
    }

    // Crear categoría
    const category = await prisma.category.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error al crear categoría:", error);
    return NextResponse.json(
      { message: "Error al crear la categoría" },
      { status: 500 }
    );
  }
}