"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, X, FolderTree } from "lucide-react";

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState<string>("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [productsCount, setProductsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    params.then((resolvedParams) => {
      setCategoryId(resolvedParams.id);
      loadCategory(resolvedParams.id);
    });
  }, [params]);

  const loadCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`);
      if (response.ok) {
        const data = await response.json();
        setName(data.name);
        setSlug(data.slug);
        setProductsCount(data._count.products);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al cargar la categoría");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        router.push("/admin/categories");
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.message || "Error al actualizar la categoría");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al actualizar la categoría");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Editar Categoría</h1>
        <p className="text-gray-600 mt-1">Actualiza la información de la categoría</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
            <h3 className="font-semibold text-gray-900 mb-4">Vista Actual</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-3">
                <FolderTree className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">{name}</p>
                  <p className="text-sm text-gray-600 font-mono">{slug}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <span className="font-semibold">Productos:</span> {productsCount}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  💡 El slug no se puede modificar para mantener la integridad de
                  las URLs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-8">
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
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ejemplo: Electrónica, Ropa, Hogar..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Slug (solo lectura) */}
              <div>
                <label
                  htmlFor="slug"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Slug (URL)
                </label>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 font-mono text-sm cursor-not-allowed"
                />
                <p className="text-sm text-gray-500 mt-1">
                  El slug no se puede modificar una vez creado
                </p>
              </div>

              {/* Botones */}
              <div className="flex items-center space-x-4 pt-6 border-t">
                <button
                  type="submit"
                  disabled={isSubmitting || !name}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{isSubmitting ? "Guardando..." : "Guardar Cambios"}</span>
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
        </div>
      </div>
    </div>
  );
}
