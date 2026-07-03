import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Eye, Trash2, RefreshCw, X, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface OrderItem { name: string; qty: number; price: number }
interface Order {
  id: number; order_number: string
  customer_name: string; customer_email: string; customer_phone?: string
  items: OrderItem[]; subtotal: number; total: number; currency: string
  status: string; notes?: string; delivery_address?: string
  created_at: string; updated_at: string
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'in_production', 'ready_for_delivery', 'delivered', 'cancelled']

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:             'bg-yellow-50 text-yellow-700 border-yellow-200',
    confirmed:           'bg-blue-50 text-blue-700 border-blue-200',
    in_production:       'bg-purple-50 text-purple-700 border-purple-200',
    ready_for_delivery:  'bg-orange-50 text-orange-700 border-orange-200',
    delivered:           'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled:           'bg-red-50 text-red-600 border-red-200',
  }
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return <span className={`inline-flex px-2 py-0.5 rounded-sm text-xs font-medium border ${map[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>{label}</span>
}

function formatNaira(n: number) { return '₦' + Number(n).toLocaleString('en-NG') }
function formatDate(iso: string) { return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }

const NEW_ORDER = {
  order_number: '', customer_name: '', customer_email: '', customer_phone: '',
  subtotal: 0, total: 0, currency: '₦', status: 'pending',
  notes: '', delivery_address: '', items: [] as OrderItem[],
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [viewOrder, setViewOrder] = useState<Order | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({ ...NEW_ORDER })
  const [saving, setSaving] = useState(false)
  const [itemInput, setItemInput] = useState({ name: '', qty: 1, price: 0 })

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setOrders(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const generateOrderNumber = () => 'ORD-' + Date.now().toString().slice(-6)

  const openCreate = () => {
    setForm({ ...NEW_ORDER, order_number: generateOrderNumber() })
    setItemInput({ name: '', qty: 1, price: 0 })
    setCreateOpen(true)
  }

  const addItem = () => {
    if (!itemInput.name.trim()) return
    const newItem = { ...itemInput }
    const items = [...form.items, newItem]
    const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)
    setForm(f => ({ ...f, items, subtotal, total: subtotal }))
    setItemInput({ name: '', qty: 1, price: 0 })
  }

  const removeItem = (idx: number) => {
    const items = form.items.filter((_, i) => i !== idx)
    const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)
    setForm(f => ({ ...f, items, subtotal, total: subtotal }))
  }

  const save = async () => {
    if (!form.customer_name.trim() || !form.customer_email.trim()) return
    setSaving(true)
    await supabase.from('orders').insert({ ...form, items: form.items })
    setSaving(false); setCreateOpen(false); load()
  }

  const updateStatus = async (id: number, status: string) => {
    await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    if (viewOrder?.id === id) setViewOrder(prev => prev ? { ...prev, status } : prev)
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this order?')) return
    await supabase.from('orders').delete().eq('id', id)
    setOrders(prev => prev.filter(o => o.id !== id))
  }

  const filtered = orders
    .filter(o => {
      if (filterStatus !== 'all' && o.status !== filterStatus) return false
      if (search) { const q = search.toLowerCase(); return o.order_number.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q) || o.customer_email.toLowerCase().includes(q) }
      return true
    })
    .sort((a, b) => sortDir === 'desc'
      ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      : new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  const statusCounts = STATUS_OPTIONS.reduce((acc, s) => ({ ...acc, [s]: orders.filter(o => o.status === s).length }), {} as Record<string, number>)

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl text-intarno-black">Orders</h1>
          <p className="text-sm text-intarno-mid mt-1">{orders.length} total orders</p>
        </div>
        <div className="sm:ml-auto flex items-center gap-3">
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 text-sm border border-intarno-light rounded-sm hover:bg-intarno-cream transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 text-sm bg-intarno-charcoal text-white rounded-sm hover:bg-intarno-accent transition-colors">
            <Plus size={14} /> New Order
          </button>
        </div>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {STATUS_OPTIONS.map(s => (
          <button key={s} onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
            className={`p-3 rounded-sm border text-left transition-all ${filterStatus === s ? 'border-intarno-accent bg-intarno-accent/5' : 'border-intarno-light/40 bg-white hover:border-intarno-accent/40'}`}>
            <p className="text-lg font-display text-intarno-black">{statusCounts[s] || 0}</p>
            <p className="text-[10px] uppercase tracking-wider text-intarno-mid mt-0.5">{s.replace(/_/g, ' ')}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-intarno-mid" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order number, customer…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-intarno-light rounded-sm focus:outline-none focus:border-intarno-accent bg-white" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-sm border border-intarno-light rounded-sm focus:outline-none focus:border-intarno-accent bg-white">
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
        </select>
        <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')} className="flex items-center gap-1 px-3 py-2 text-sm border border-intarno-light rounded-sm hover:bg-intarno-cream transition-colors">
          Date {sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      <div className="bg-white border border-intarno-light/40 rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-2 border-intarno-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-intarno-mid text-sm">
            {search || filterStatus !== 'all' ? 'No orders match your filters.' : 'No orders yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-intarno-light/40 bg-intarno-cream/30">
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widests text-intarno-mid font-medium">Order</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widests text-intarno-mid font-medium">Customer</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widests text-intarno-mid font-medium">Total</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widests text-intarno-mid font-medium">Status</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widests text-intarno-mid font-medium">Date</th>
                  <th className="px-5 py-3 text-right text-xs uppercase tracking-widests text-intarno-mid font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-intarno-light/20">
                {filtered.map(o => (
                  <tr key={o.id} className="hover:bg-intarno-cream/20 transition-colors group">
                    <td className="px-5 py-4 font-mono text-xs font-medium text-intarno-charcoal">{o.order_number}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-intarno-charcoal">{o.customer_name}</p>
                      <p className="text-xs text-intarno-mid">{o.customer_email}</p>
                    </td>
                    <td className="px-5 py-4 font-medium text-intarno-charcoal">{formatNaira(o.total)}</td>
                    <td className="px-5 py-4">
                      <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                        className="text-xs border-0 bg-transparent cursor-pointer focus:outline-none">
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-intarno-mid text-xs whitespace-nowrap">{formatDate(o.created_at)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setViewOrder(o)} className="p-1.5 text-intarno-mid hover:text-intarno-accent hover:bg-intarno-cream rounded-sm"><Eye size={14} /></button>
                        <button onClick={() => remove(o.id)} className="p-1.5 text-intarno-mid hover:text-red-500 hover:bg-red-50 rounded-sm"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Order Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewOrder(null)}>
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewOrder(null)} className="absolute top-4 right-4 text-intarno-mid hover:text-intarno-black"><X size={20} /></button>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-display text-2xl text-intarno-black">{viewOrder.order_number}</h2>
                <StatusBadge status={viewOrder.status} />
              </div>
              <p className="text-sm text-intarno-mid">{formatDate(viewOrder.created_at)}</p>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-widests text-intarno-mid mb-2">Customer</p>
                <p className="font-medium text-intarno-charcoal">{viewOrder.customer_name}</p>
                <p className="text-intarno-mid">{viewOrder.customer_email}</p>
                {viewOrder.customer_phone && <p className="text-intarno-mid">{viewOrder.customer_phone}</p>}
              </div>
              {viewOrder.delivery_address && (
                <div>
                  <p className="text-xs uppercase tracking-widests text-intarno-mid mb-1">Delivery Address</p>
                  <p className="text-intarno-charcoal">{viewOrder.delivery_address}</p>
                </div>
              )}
              {viewOrder.items?.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widests text-intarno-mid mb-2">Items</p>
                  <div className="divide-y divide-intarno-light/20">
                    {viewOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between py-2">
                        <span className="text-intarno-charcoal">{item.name} <span className="text-intarno-mid">× {item.qty}</span></span>
                        <span className="font-medium">{formatNaira(item.qty * item.price)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-3 font-medium border-t border-intarno-light/40 mt-2">
                    <span>Total</span><span>{formatNaira(viewOrder.total)}</span>
                  </div>
                </div>
              )}
              {viewOrder.notes && (
                <div className="p-3 bg-intarno-cream rounded-sm text-intarno-mid">{viewOrder.notes}</div>
              )}
            </div>
            <div className="mt-6">
              <p className="text-xs uppercase tracking-widests text-intarno-mid mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map(s => (
                  <button key={s} onClick={() => updateStatus(viewOrder.id, s)}
                    className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${viewOrder.status === s ? 'bg-intarno-charcoal text-white border-intarno-charcoal' : 'border-intarno-light text-intarno-mid hover:border-intarno-accent hover:text-intarno-charcoal'}`}>
                    {s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setCreateOpen(false)}>
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-8 py-5 border-b border-intarno-light/30">
              <h2 className="font-display text-2xl text-intarno-black">New Order</h2>
              <button onClick={() => setCreateOpen(false)} className="text-intarno-mid hover:text-intarno-black"><X size={20} /></button>
            </div>
            <div className="px-8 py-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Order Number</label>
                  <input value={form.order_number} onChange={e => setForm(f => ({ ...f, order_number: e.target.value }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm font-mono" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm bg-white">
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Customer Name *</label>
                  <input value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Customer Email *</label>
                  <input type="email" value={form.customer_email} onChange={e => setForm(f => ({ ...f, customer_email: e.target.value }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Phone</label>
                  <input value={form.customer_phone} onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Delivery Address</label>
                <input value={form.delivery_address} onChange={e => setForm(f => ({ ...f, delivery_address: e.target.value }))}
                  className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-2">Order Items</label>
                <div className="flex gap-2 mb-3">
                  <input value={itemInput.name} onChange={e => setItemInput(i => ({ ...i, name: e.target.value }))} placeholder="Item name"
                    className="flex-1 border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                  <input type="number" value={itemInput.qty} onChange={e => setItemInput(i => ({ ...i, qty: Number(e.target.value) }))} placeholder="Qty" min={1}
                    className="w-16 border border-intarno-light px-2 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm text-center" />
                  <input type="number" value={itemInput.price || ''} onChange={e => setItemInput(i => ({ ...i, price: Number(e.target.value) }))} placeholder="Price"
                    className="w-28 border border-intarno-light px-2 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                  <button onClick={addItem} className="px-3 py-2 text-sm bg-intarno-charcoal text-white rounded-sm hover:bg-intarno-accent transition-colors">Add</button>
                </div>
                {form.items.length > 0 && (
                  <div className="space-y-1">
                    {form.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 px-3 bg-intarno-cream rounded-sm text-sm">
                        <span>{item.name} × {item.qty}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{formatNaira(item.qty * item.price)}</span>
                          <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600">×</button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 px-3 font-medium text-sm border-t border-intarno-light/40">
                      <span>Total</span><span>{formatNaira(form.total)}</span>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
                  className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-8 py-5 border-t border-intarno-light/30">
              <button onClick={() => setCreateOpen(false)} className="px-6 py-2.5 text-sm border border-intarno-light text-intarno-mid rounded-sm hover:bg-intarno-cream transition-colors">Cancel</button>
              <button onClick={save} disabled={saving || !form.customer_name.trim() || !form.customer_email.trim()}
                className="px-6 py-2.5 text-sm bg-intarno-charcoal text-white rounded-sm hover:bg-intarno-accent transition-colors disabled:opacity-50">
                {saving ? 'Saving…' : 'Create Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
