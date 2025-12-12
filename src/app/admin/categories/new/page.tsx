"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, X } from "lucide-react";

export default function NewCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generar slug automáticamente desde el nombre
  const handleNameChange = (value: string) => {
    setName(value);
    const generatedSlug = value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, slug }),
      });

      if (response.ok) {
        router.push("/admin/categories");
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.message || "Error al crear la categoría");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear la categoría");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/categories"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver a categorías
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Nueva Categoría</h1>
        <p className="text-gray-600 mt-1">
          Crea una nueva categoría para organizar tus productos
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Nombre de la categoría *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              placeholder="Ejemplo: Electrónica, Ropa, Hogar..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Este es el nombre que verán tus clientes
            </p>
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Slug (URL) *
            </label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="electronica"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
            <p className="text-sm text-gray-500 mt-1">
              Se genera automáticamente, pero puedes editarlo. Solo letras
              minúsculas, números y guiones.
            </p>
            {slug && (
              <p className="text-sm text-blue-600 mt-2">
                Vista previa: <span className="font-mono">/shop?category={slug}</span>
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex items-center space-x-4 pt-6 border-t">
            <button
              type="submit"
              disabled={isSubmitting || !name || !slug}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? "Creando..." : "Crear Categoría"}</span>
            </button>
            <Link
              href="/admin/categories"
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition flex items-center justify-center space-x-2"
            >
              <X className="w-5 h-5" />
              <span>Cancelar</span>
            </Link>
          </div>
        </form>
      </div>

      {/* Info adicional */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Consejos:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Usa nombres cortos y descriptivos</li>
          <li>• El slug debe ser único y no se puede cambiar después</li>
          <li>• Las categorías ayudan a organizar tu catálogo de productos</li>
        </ul>
      </div>
    </div>
  );
}