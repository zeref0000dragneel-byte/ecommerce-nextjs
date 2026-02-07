'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { DollarSign, Package, TrendingDown, Plus, BarChart3 } from 'lucide-react';

type Product = { id: string; name: string; slug: string; price: number; categoryId: string; category?: { id: string; name: string } };
type Category = { id: string; name: string };
type ExternalItem = { id: string; name: string; description: string | null };
type SaleStatus = 'pagado' | 'parcial' | 'pendiente';

type Sale = {
  id: string;
  productId: string | null;
  externalItemId: string | null;
  externalItem: ExternalItem | null;
  quantity: number;
  amount: number;
  status: string;
  clientName: string | null;
  paymentDate: string | null;
  createdAt: string;
};

type EditingVenta = {
  id: string;
  amount: number;
  quantity: number;
  status: string;
  clientName: string | null;
  paymentDate: string;
  montoPagado: number;
  productPrice: number;
  producto: string;
};

type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  createdAt: string;
};

function parseClientName(clientName: string | null): { name: string; amountPaid: number | null } {
  if (!clientName) return { name: '', amountPaid: null };
  const idx = clientName.lastIndexOf('|');
  if (idx === -1) return { name: clientName, amountPaid: null };
  const name = clientName.slice(0, idx).trim();
  const paid = Number(clientName.slice(idx + 1).trim());
  return { name, amountPaid: Number.isFinite(paid) ? paid : null };
}

export default function ContabilidadClient() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<'resumen' | 'ventas' | 'gastos'>(() => {
    if (tabParam === 'ventas') return 'ventas';
    if (tabParam === 'gastos') return 'gastos';
    return 'resumen';
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [externalItems, setExternalItems] = useState<ExternalItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [useExternal, setUseExternal] = useState(false);
  const [externalName, setExternalName] = useState('');
  const [externalDescription, setExternalDescription] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedExternalId, setSelectedExternalId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState('');
  const [saleStatus, setSaleStatus] = useState<SaleStatus>('pagado');
  const [montoPagado, setMontoPagado] = useState('');
  const [clientName, setClientName] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [saleSubmitting, setSaleSubmitting] = useState(false);

  const [expDescription, setExpDescription] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState(new Date().toISOString().slice(0, 10));
  const [expSubmitting, setExpSubmitting] = useState(false);

  const [showAddExternal, setShowAddExternal] = useState(false);

  const [editingVenta, setEditingVenta] = useState<EditingVenta | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const selectedProduct = useMemo(() => products.find((p) => p.id === selectedProductId), [products, selectedProductId]);
  const productPrice = selectedProduct ? selectedProduct.price : 0;
  const totalCatalog = productPrice * quantity;
  const isCatalogSale = !useExternal && selectedProductId && !showAddExternal;
  const totalVenta = isCatalogSale ? totalCatalog : (amount ? Number(amount) : 0);
  const montoPagadoNum = saleStatus === 'pendiente' ? 0 : saleStatus === 'pagado' ? totalVenta : (montoPagado ? Number(montoPagado) : 0);
  const saldoPendiente = totalVenta - montoPagadoNum;

  const filteredProducts = products.filter((p) => {
    const matchSearch = !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase());
    const matchCat = !categoryFilter || p.categoryId === categoryFilter;
    return matchSearch && matchCat;
  });

  useEffect(() => {
    if (tabParam === 'ventas') setActiveTab('ventas');
    else if (tabParam === 'gastos') setActiveTab('gastos');
  }, [tabParam]);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/accounting/external-items').then((r) => r.json()),
      fetch('/api/accounting/sales').then((r) => r.json()),
      fetch('/api/accounting/expenses').then((r) => r.json()),
    ])
      .then(([prodRes, catRes, extRes, salesRes, expRes]) => {
        if (prodRes.data) setProducts(prodRes.data);
        else if (Array.isArray(prodRes)) setProducts(prodRes);
        if (Array.isArray(catRes)) setCategories(catRes);
        else if (catRes.data) setCategories(catRes.data);
        if (extRes.data) setExternalItems(extRes.data);
        if (salesRes.data) setSales(salesRes.data);
        if (expRes.data) setExpenses(expRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const loadSalesAndExpenses = () => {
    fetch('/api/accounting/sales').then((r) => r.json()).then((res) => res.data && setSales(res.data));
    fetch('/api/accounting/expenses').then((r) => r.json()).then((res) => res.data && setExpenses(res.data));
  };

  const loadExternalItems = () => {
    fetch('/api/accounting/external-items').then((r) => r.json()).then((res) => res.data && setExternalItems(res.data));
  };

  const getSaleProductName = (s: Sale) =>
    s.productId ? products.find((p) => p.id === s.productId)?.name : null;
  const getSaleDisplayName = (s: Sale) =>
    getSaleProductName(s) ?? s.externalItem?.name ?? 'Externo';

  const openEditModal = (s: Sale) => {
    const { name: _n, amountPaid } = parseClientName(s.clientName);
    setEditingVenta({
      id: s.id,
      amount: s.amount,
      quantity: s.quantity,
      status: s.status,
      clientName: s.clientName,
      paymentDate: s.paymentDate ? String(s.paymentDate).slice(0, 10) : '',
      montoPagado: amountPaid ?? 0,
      productPrice: s.amount / s.quantity,
      producto: getSaleDisplayName(s),
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editingVenta) return;
    try {
      const { name } = parseClientName(editingVenta.clientName);
      const clientNameToSend = name ? `${name}|${editingVenta.montoPagado}` : `|${editingVenta.montoPagado}`;
      const res = await fetch(`/api/accounting/sales/${editingVenta.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editingVenta.status,
          clientName: clientNameToSend,
          paymentDate: editingVenta.status !== 'pagado' && editingVenta.paymentDate ? editingVenta.paymentDate : null,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSales(sales.map((v) => (v.id === editingVenta.id ? data.data : v)));
        setIsEditing(false);
        setEditingVenta(null);
      } else {
        alert(data.error || 'Error al actualizar venta');
      }
    } catch (error) {
      console.error('Error al actualizar venta:', error);
      alert('Error al actualizar venta');
    }
  };

  const resumen = useMemo(() => {
    const hoy = new Date().toISOString().slice(0, 10);
    const ingresosTotales = sales.reduce((a, s) => a + s.amount, 0);
    const gastosTotales = expenses.reduce((a, e) => a + e.amount, 0);
    const ingresosDia = sales.filter((s) => s.createdAt.slice(0, 10) === hoy).reduce((a, s) => a + s.amount, 0);
    const gastosDia = expenses.filter((e) => e.date.slice(0, 10) === hoy).reduce((a, e) => a + e.amount, 0);
    return {
      ingresosTotales,
      gastosTotales,
      ingresosDia,
      gastosDia,
      saldoDia: ingresosDia - gastosDia,
      saldoTotal: ingresosTotales - gastosTotales,
    };
  }, [sales, expenses]);

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaleSubmitting(true);
    let productId: string | null = null;
    let externalItemId: string | null = null;

    if (useExternal) {
      if (showAddExternal && externalName.trim()) {
        const createRes = await fetch('/api/accounting/external-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: externalName.trim(), description: externalDescription.trim() || undefined }),
        });
        const createData = await createRes.json();
        if (!createData.success) {
          alert(createData.error || 'Error al crear item externo');
          setSaleSubmitting(false);
          return;
        }
        externalItemId = createData.data.id;
        loadExternalItems();
      } else {
        externalItemId = selectedExternalId || null;
      }
    } else {
      productId = selectedProductId || null;
    }

    if (!productId && !externalItemId) {
      alert('Selecciona un producto o añade un producto externo.');
      setSaleSubmitting(false);
      return;
    }

    const total = isCatalogSale ? totalCatalog : (amount ? Number(amount) : 0);
    if (total <= 0) {
      alert('Indica un monto válido o selecciona un producto del catálogo.');
      setSaleSubmitting(false);
      return;
    }

    const paid = saleStatus === 'pendiente' ? 0 : saleStatus === 'pagado' ? total : (montoPagado ? Number(montoPagado) : 0);
    const needStorePaid = saleStatus === 'parcial' || saleStatus === 'pendiente';
    const clientNameToSend = needStorePaid
      ? (clientName.trim() ? `${clientName.trim()}|${paid}` : `|${paid}`)
      : (clientName.trim() || undefined);

    const res = await fetch('/api/accounting/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: productId || undefined,
        externalItemId: externalItemId || undefined,
        quantity: Number(quantity) || 1,
        amount: total,
        status: saleStatus,
        clientName: clientNameToSend || undefined,
        paymentDate: saleStatus !== 'pagado' && paymentDate ? paymentDate : undefined,
      }),
    });
    const data = await res.json();
    setSaleSubmitting(false);
    if (data.success) {
      setAmount('');
      setMontoPagado('');
      setClientName('');
      setPaymentDate('');
      setExternalName('');
      setExternalDescription('');
      setShowAddExternal(false);
      setSelectedProductId('');
      setSelectedExternalId('');
      setQuantity(1);
      loadSalesAndExpenses();
    } else {
      alert(data.error || 'Error al añadir venta');
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expDescription.trim() || !expAmount) {
      alert('Descripción y cantidad son requeridos.');
      return;
    }
    setExpSubmitting(true);
    const res = await fetch('/api/accounting/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: expDescription.trim(),
        amount: Number(expAmount),
        date: expDate,
      }),
    });
    const data = await res.json();
    setExpSubmitting(false);
    if (data.success) {
      setExpDescription('');
      setExpAmount('');
      setExpDate(new Date().toISOString().slice(0, 10));
      loadSalesAndExpenses();
    } else {
      alert(data.error || 'Error al añadir gasto');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 font-medium">Cargando contabilidad...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-title text-3xl font-bold tracking-wider text-secondary-dark flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-primary" />
          Contabilidad
        </h2>
        <p className="font-medium text-gray-600 mt-2">Reporte financiero ONSET</p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('resumen')}
          className={`px-6 py-3 font-semibold rounded-t-xl transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'resumen'
              ? 'bg-white border-2 border-b-0 border-primary text-primary shadow-soft -mb-0.5'
              : 'text-gray-500 hover:text-secondary-dark hover:bg-gray-50'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          Resumen
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ventas')}
          className={`px-6 py-3 font-semibold rounded-t-xl transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'ventas'
              ? 'bg-white border-2 border-b-0 border-primary text-primary shadow-soft -mb-0.5'
              : 'text-gray-500 hover:text-secondary-dark hover:bg-gray-50'
          }`}
        >
          <Package className="w-5 h-5" />
          Ventas
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gastos')}
          className={`px-6 py-3 font-semibold rounded-t-xl transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'gastos'
              ? 'bg-white border-2 border-b-0 border-action text-action shadow-soft -mb-0.5'
              : 'text-gray-500 hover:text-secondary-dark hover:bg-gray-50'
          }`}
        >
          <TrendingDown className="w-5 h-5" />
          Gastos
        </button>
      </div>

      {activeTab === 'resumen' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-soft border-2 border-gray-100 p-6 border-t-4 border-t-primary">
            <p className="text-sm font-semibold text-gray-600">Ingresos totales</p>
            <p className="font-title text-2xl text-primary mt-1">
              ${resumen.ingresosTotales.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-soft border-2 border-gray-100 p-6 border-t-4 border-t-action">
            <p className="text-sm font-semibold text-gray-600">Gastos totales</p>
            <p className="font-title text-2xl text-error mt-1">
              ${resumen.gastosTotales.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-soft border-2 border-gray-100 p-6 border-t-4 border-t-secondary-salmon">
            <p className="text-sm font-semibold text-gray-600">Saldo total</p>
            <p className="font-title text-2xl text-secondary-dark mt-1">
              ${resumen.saldoTotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-soft border-2 border-gray-100 p-6">
            <p className="text-sm font-semibold text-gray-600">Ingresos del día</p>
            <p className="font-title text-xl text-primary mt-1">
              ${resumen.ingresosDia.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-soft border-2 border-gray-100 p-6">
            <p className="text-sm font-semibold text-gray-600">Gastos del día</p>
            <p className="font-title text-xl text-error mt-1">
              ${resumen.gastosDia.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-soft border-2 border-gray-100 p-6">
            <p className="text-sm font-semibold text-gray-600">Saldo del día</p>
            <p className="font-title text-xl text-secondary-dark mt-1">
              ${resumen.saldoDia.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'ventas' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-soft border-2 border-gray-100 p-6">
            <h3 className="font-title text-xl text-secondary-dark mb-4">Añadir Venta</h3>
            <form onSubmit={handleAddSale} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Producto</label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => { setUseExternal(false); setShowAddExternal(false); setAmount(''); }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${!useExternal ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    Catálogo
                  </button>
                  <button
                    type="button"
                    onClick={() => { setUseExternal(true); setSelectedProductId(''); setAmount(''); }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${useExternal ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    Producto externo
                  </button>
                </div>
                {!useExternal ? (
                  <>
                    <input
                      type="text"
                      placeholder="Buscar por nombre"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="input-modern mb-2"
                    />
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="input-modern mb-2"
                    >
                      <option value="">Todas las categorías</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="input-modern"
                      required={!useExternal && !showAddExternal}
                    >
                      <option value="">Seleccionar producto</option>
                      {filteredProducts.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} – ${p.price}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAddExternal(true)}
                      className="mt-2 text-sm text-action font-semibold hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Añadir producto externo
                    </button>
                  </>
                ) : (
                  <>
                    {!showAddExternal ? (
                      <>
                        <select
                          value={selectedExternalId}
                          onChange={(e) => setSelectedExternalId(e.target.value)}
                          className="input-modern mb-2"
                        >
                          <option value="">Seleccionar item externo</option>
                          {externalItems.map((i) => (
                            <option key={i.id} value={i.id}>{i.name}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setShowAddExternal(true)}
                          className="text-sm text-action font-semibold hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" /> Crear nuevo item externo
                        </button>
                      </>
                    ) : (
                      <div className="space-y-2 p-3 bg-gray-50 rounded-xl">
                        <input
                          type="text"
                          placeholder="Nombre (curso, servicio...)"
                          value={externalName}
                          onChange={(e) => setExternalName(e.target.value)}
                          className="input-modern"
                        />
                        <input
                          type="text"
                          placeholder="Descripción (opcional)"
                          value={externalDescription}
                          onChange={(e) => setExternalDescription(e.target.value)}
                          className="input-modern"
                        />
                        <button type="button" onClick={() => setShowAddExternal(false)} className="text-sm text-gray-600 hover:underline">
                          Cancelar
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {isCatalogSale && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Precio unitario (catálogo)</label>
                  <div className="input-modern bg-gray-100 cursor-not-allowed" aria-readonly>
                    ${productPrice.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cantidad</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="input-modern"
                />
              </div>

              {isCatalogSale ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Total</label>
                  <div className="input-modern bg-gray-100 cursor-not-allowed" aria-readonly>
                    ${totalCatalog.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Monto total</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input-modern"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
                <select
                  value={saleStatus}
                  onChange={(e) => {
                    const v = e.target.value as SaleStatus;
                    setSaleStatus(v);
                    if (v === 'pagado') setMontoPagado(String(totalVenta));
                    if (v === 'pendiente') setMontoPagado('0');
                  }}
                  className="input-modern"
                >
                  <option value="pagado">Pagado</option>
                  <option value="parcial">Parcial</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>

              {(saleStatus === 'parcial' || saleStatus === 'pendiente') && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Monto pagado</label>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      max={totalVenta}
                      placeholder="0.00"
                      value={saleStatus === 'pendiente' ? '0' : montoPagado}
                      onChange={(e) => setMontoPagado(e.target.value)}
                      className="input-modern"
                      readOnly={saleStatus === 'pendiente'}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Saldo pendiente</p>
                    <p className="font-title text-lg text-amber-600">
                      ${saldoPendiente.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cliente</label>
                <input
                  type="text"
                  placeholder="Nombre del cliente (opcional)"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="input-modern"
                />
              </div>
              {(saleStatus === 'parcial' || saleStatus === 'pendiente') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de pago</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="input-modern"
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={saleSubmitting}
                className="w-full bg-gradient-to-r from-primary to-coral text-white font-bold py-3 rounded-xl shadow-glow hover:shadow-hover transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saleSubmitting ? 'Guardando...' : 'Añadir Venta'}
              </button>
            </form>
          </div>
          <div className="bg-white rounded-2xl shadow-soft border-2 border-gray-100 p-6">
            <h3 className="font-title text-xl text-secondary-dark mb-4">Últimas ventas</h3>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              {sales.length === 0 ? (
                <p className="text-gray-500 text-sm">Aún no hay ventas registradas.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white border-b border-gray-200">
                    <tr>
                      <th className="text-left py-2 font-semibold text-gray-700">Producto</th>
                      <th className="text-left py-2 font-semibold text-gray-700">Cantidad</th>
                      <th className="text-left py-2 font-semibold text-gray-700">Total</th>
                      <th className="text-left py-2 font-semibold text-gray-700">Estado</th>
                      <th className="text-left py-2 font-semibold text-gray-700">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((s) => (
                      <tr key={s.id} className="border-b border-gray-100">
                        <td className="py-2 px-4 border-b border-gray-100">
                          {getSaleDisplayName(s)}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-100">{s.quantity}</td>
                        <td className="py-2 px-4 border-b border-gray-100">
                          ${s.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-100">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              s.status === 'pagado'
                                ? 'bg-green-100 text-green-800'
                                : s.status === 'parcial'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b border-gray-100">
                          <button
                            type="button"
                            onClick={() => openEditModal(s)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'gastos' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-soft border-2 border-gray-100 p-6">
            <h3 className="font-title text-xl text-secondary-dark mb-4">Añadir Gasto</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                <input
                  type="text"
                  placeholder="Ej. Servicio, insumo, pago..."
                  value={expDescription}
                  onChange={(e) => setExpDescription(e.target.value)}
                  className="input-modern"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cantidad (monto)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  className="input-modern"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className="input-modern"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={expSubmitting}
                className="w-full bg-gradient-to-r from-action to-accent-electric text-white font-bold py-3 rounded-xl shadow-float hover:shadow-hover transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {expSubmitting ? 'Guardando...' : 'Añadir Gasto'}
              </button>
            </form>
          </div>
          <div className="bg-white rounded-2xl shadow-soft border-2 border-gray-100 p-6">
            <h3 className="font-title text-xl text-secondary-dark mb-4">Últimos gastos</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {expenses.length === 0 ? (
                <p className="text-gray-500 text-sm">Aún no hay gastos registrados.</p>
              ) : (
                expenses.map((e) => (
                  <div key={e.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-secondary-dark">{e.description}</span>
                    <span className="font-bold text-error">${e.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    <span className="text-gray-500 text-sm">{new Date(e.date).toLocaleDateString('es-MX')}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {isEditing && editingVenta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h2 className="font-bold text-lg mb-4">Editar Venta</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Monto Pagado</label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  max={editingVenta.amount}
                  value={editingVenta.montoPagado}
                  onChange={(e) =>
                    setEditingVenta({
                      ...editingVenta,
                      montoPagado: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="border rounded-lg px-3 py-2 w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <select
                  value={editingVenta.status}
                  onChange={(e) =>
                    setEditingVenta({
                      ...editingVenta,
                      status: e.target.value,
                    })
                  }
                  className="border rounded-lg px-3 py-2 w-full"
                >
                  <option value="pagado">Pagado</option>
                  <option value="parcial">Parcial</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>

              {editingVenta.status !== 'pagado' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha de Pago</label>
                  <input
                    type="date"
                    value={editingVenta.paymentDate}
                    onChange={(e) =>
                      setEditingVenta({
                        ...editingVenta,
                        paymentDate: e.target.value,
                      })
                    }
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Saldo Pendiente</label>
                <input
                  type="text"
                  readOnly
                  value={`$${(editingVenta.amount - editingVenta.montoPagado).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
                  className="border rounded-lg px-3 py-2 w-full bg-gray-100"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingVenta(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
