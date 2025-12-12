import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// GET - Obtener una categoría por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error al obtener categoría:", error);
    return NextResponse.json(
      { message: "Error al obtener la categoría" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar categoría
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { message: "El nombre es requerido" },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    return NextResponse.json(
      { message: "Error al actualizar la categoría" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar categoría
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar si tiene productos
    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        { message: "No se puede eliminar una categoría con productos asociados" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    return NextResponse.json(
      { message: "Error al eliminar la categoría" },
      { status: 500 }
    );
  }
}