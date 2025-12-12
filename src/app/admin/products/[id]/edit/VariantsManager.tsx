'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, Loader2, Upload } from 'lucide-react';

interface Variant {
  id: string;
  color: string | null;
  size: string | null;
  sku: string | null;
  price: number | null;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
}

interface Props {
  productId: string;
  basePrice: number;
}

export default function VariantsManager({ productId, basePrice }: Props) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    color: '',
    size: '',
    sku: '',
    price: '',
    stock: '0',
    imageUrl: '',
    isActive: true,
  });

  // Cargar variantes
  useEffect(() => {
    loadVariants();
  }, [productId]);

  const loadVariants = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/variants`);
      const data = await response.json();
      setVariants(data);
    } catch (error) {
      console.error('Error al cargar variantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

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

      if (!response.ok) throw new Error('Error al subir imagen');

      const data = await response.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      alert('✅ Imagen subida correctamente');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al subir imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.color && !formData.size) {
      alert('Debes especificar al menos color o talla');
      return;
    }

    try {
      const url = editingId
        ? `/api/products/${productId}/variants/${editingId}`
        : `/api/products/${productId}/variants`;

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al guardar variante');

      alert(`✅ Variante ${editingId ? 'actualizada' : 'creada'} correctamente`);
      resetForm();
      loadVariants();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al guardar variante');
    }
  };

  const handleEdit = (variant: Variant) => {
    setFormData({
      color: variant.color || '',
      size: variant.size || '',
      sku: variant.sku || '',
      price: variant.price?.toString() || '',
      stock: variant.stock.toString(),
      imageUrl: variant.imageUrl || '',
      isActive: variant.isActive,
    });
    setEditingId(variant.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta variante?')) return;

    try {
      const response = await fetch(`/api/products/${productId}/variants/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');

      alert('✅ Variante eliminada');
      loadVariants();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al eliminar variante');
    }
  };

  const resetForm = () => {
    setFormData({
      color: '',
      size: '',
      sku: '',
      price: '',
      stock: '0',
      imageUrl: '',
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="mt-8 border-t pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Variantes del Producto</h3>
          <p className="text-sm text-gray-600 mt-1">
            Colores, tallas y combinaciones disponibles
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Variante
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h4 className="font-semibold text-gray-900 mb-4">
            {editingId ? 'Editar Variante' : 'Nueva Variante'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Ej: Rojo, Azul, Negro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Talla
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Ej: S, M, L, XL"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU (Código único)
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="PROD-COLOR-TALLA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio (opcional)
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder={`Base: $${basePrice}`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Si no especificas, usa ${basePrice}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                min="0"
                required
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
          </div>

          {/* Imagen */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen de la variante
            </label>
            <div className="flex items-center gap-4">
              <label
                htmlFor={`variantImage-${editingId || 'new'}`}
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
                id={`variantImage-${editingId || 'new'}`}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </div>

            {formData.imageUrl && (
              <div className="mt-3">
                <img
                  src={formData.imageUrl}
                  alt="Vista previa"
                  className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                />
              </div>
            )}
          </div>

          {/* Activo */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Variante activa (visible en tienda)
              </span>
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={uploadingImage}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {editingId ? 'Actualizar' : 'Crear'} Variante
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista de Variantes */}
      {variants.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-2">No hay variantes creadas</p>
          <p className="text-sm text-gray-500">
            Agrega colores, tallas u otras opciones para este producto
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className={`border rounded-lg p-4 ${
                variant.isActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300 opacity-60'
              }`}
            >
              {variant.imageUrl && (
                <img
                  src={variant.imageUrl}
                  alt={`${variant.color} ${variant.size}`}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              )}

              <div className="space-y-2">
                {variant.color && (
                  <p className="text-sm">
                    <span className="font-semibold">Color:</span> {variant.color}
                  </p>
                )}
                {variant.size && (
                  <p className="text-sm">
                    <span className="font-semibold">Talla:</span> {variant.size}
                  </p>
                )}
                {variant.sku && (
                  <p className="text-xs text-gray-600">SKU: {variant.sku}</p>
                )}
                <p className="text-sm">
                  <span className="font-semibold">Precio:</span> $
                  {(variant.price || basePrice).toFixed(2)}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Stock:</span> {variant.stock} unidades
                </p>
                {!variant.isActive && (
                  <p className="text-xs text-red-600 font-semibold">INACTIVA</p>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(variant)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-1 text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(variant.id)}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}