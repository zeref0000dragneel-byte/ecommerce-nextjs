'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Loader2 } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    comparePrice: '',
    stock: '',
    isPreOrder: false,
    preOrderDaysStart: 3,
    preOrderDaysEnd: 5,
    imageUrl: '',
    categoryId: '',
  });

  // Cargar categorías
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error al cargar categorías:', error));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generar slug desde el nombre
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      alert('✅ Imagen subida correctamente');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al subir la imagen. Intenta de nuevo.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice
          ? parseFloat(formData.comparePrice)
          : null,
        stock: formData.isPreOrder ? null : parseInt(formData.stock) || 0,
        isPreOrder: formData.isPreOrder,
        preOrderDays: formData.isPreOrder
          ? `${formData.preOrderDaysStart} a ${formData.preOrderDaysEnd} días`
          : null,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Error al crear el producto');
      }
  
      const result = await response.json();
      
      // ✅ CORRECCIÓN: Verificar estructura del response
      if (!result.success || !result.data || !result.data.id) {
        throw new Error('Respuesta inválida del servidor');
      }
  
      // ✅ Redirigir a edición con el ID correcto
      alert('✅ Producto creado. Ahora puedes agregar variantes (colores, tallas, etc.)');
      router.push(`/admin/products/${result.data.id}/edit`);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al crear el producto');
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Producto</h1>
        <p className="text-gray-600 mt-2">
          Completa el formulario para agregar un nuevo producto
        </p>
      </div>

      {/* ✅ NUEVO: Aviso sobre variantes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-2xl">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">💡 ¿Tienes variantes?</p>
            <p className="text-blue-800">
              Después de crear el producto podrás agregar <strong>colores, tallas y otras variantes</strong> con precios y stock independientes.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
        {/* Nombre */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">
            Nombre del Producto *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400"
            placeholder="Ej: Vestido de Seda"
          />
        </div>

        {/* Slug */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">
            Slug (URL amigable) *
          </label>
          <input
            type="text"
            name="slug"
            required
            value={formData.slug}
            onChange={handleInputChange}
            className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 bg-gray-50"
            placeholder="Se genera automáticamente"
          />
          <p className="text-xs text-gray-500 mt-1">
            URL: /shop/{formData.slug || 'slug-del-producto'}
          </p>
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400"
            placeholder="Descripción detallada del producto..."
          />
        </div>

        {/* Categoría */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">
            Categoría *
          </label>
          <select
            name="categoryId"
            required
            value={formData.categoryId}
            onChange={handleInputChange}
            className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg px-4 py-2 text-gray-900"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Precio y Precio Comparativo */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Precio Base *
            </label>
            <input
              type="number"
              name="price"
              required
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-500 mt-1">
              Puedes ajustar por variante después
            </p>
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Precio Comparativo
            </label>
            <input
              type="number"
              name="comparePrice"
              step="0.01"
              min="0"
              value={formData.comparePrice}
              onChange={handleInputChange}
              className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Disponibilidad: Stock o Sobre pedido */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">
            Disponibilidad
          </label>
          <div className="flex items-center gap-4 mb-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={!formData.isPreOrder}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    isPreOrder: false,
                    preOrderDaysStart: 3,
                    preOrderDaysEnd: 5,
                  }))
                }
                className="h-4 w-4 text-primary"
              />
              <span>Stock normal</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formData.isPreOrder}
                onChange={() => setFormData((prev) => ({ ...prev, isPreOrder: true }))}
                className="h-4 w-4 text-primary"
              />
              <span>Sobre pedido</span>
            </label>
          </div>

          {formData.isPreOrder ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Días de entrega estimados
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        preOrderDaysStart: Math.max(1, prev.preOrderDaysStart - 1),
                      }))
                    }
                    className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  >
                    ↓
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={formData.preOrderDaysStart}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        preOrderDaysStart: Math.max(1, parseInt(e.target.value) || 1),
                      }))
                    }
                    className="w-12 text-center border-none focus:ring-0 py-1.5 text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, preOrderDaysStart: prev.preOrderDaysStart + 1 }))
                    }
                    className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  >
                    ↑
                  </button>
                </div>
                <span className="text-gray-600 font-medium">a</span>
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        preOrderDaysEnd: Math.max(
                          prev.preOrderDaysStart + 1,
                          prev.preOrderDaysEnd - 1
                        ),
                      }))
                    }
                    className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  >
                    ↓
                  </button>
                  <input
                    type="number"
                    min={formData.preOrderDaysStart + 1}
                    value={formData.preOrderDaysEnd}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        preOrderDaysEnd: Math.max(
                          prev.preOrderDaysStart + 1,
                          parseInt(e.target.value) || prev.preOrderDaysStart + 1
                        ),
                      }))
                    }
                    className="w-12 text-center border-none focus:ring-0 py-1.5 text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, preOrderDaysEnd: prev.preOrderDaysEnd + 1 }))
                    }
                    className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  >
                    ↑
                  </button>
                </div>
                <span className="text-gray-600 font-medium">días</span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Base *
              </label>
              <input
                type="number"
                name="stock"
                required={!formData.isPreOrder}
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                El stock de variantes es independiente
              </p>
            </div>
          )}
        </div>

        {/* Imagen */}
        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-2">
            Imagen Principal del Producto
          </label>
          
          {/* Botón de Subir */}
          <div className="flex items-center gap-4">
            <label
              htmlFor="imageUpload"
              className={`cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 ${
                uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploadingImage ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Subir Imagen
                </>
              )}
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="hidden"
            />
            
            {formData.imageUrl && (
              <span className="text-sm text-green-600 font-medium">✓ Imagen cargada</span>
            )}
          </div>

          {/* Vista previa */}
          {formData.imageUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
              <img
                src={formData.imageUrl}
                alt="Vista previa"
                className="w-40 h-40 object-cover rounded-lg border-2 border-gray-200"
              />
            </div>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Formatos: JPG, PNG, WebP (máximo 5MB). Cada variante puede tener su propia imagen.
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando...' : 'Crear Producto y Agregar Variantes'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            disabled={loading || uploadingImage}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 text-gray-700 font-semibold"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}