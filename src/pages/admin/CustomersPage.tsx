import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Edit2, Trash2, RefreshCw, X, Mail, Phone, MapPin, Download } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Customer {
  id: number; name: string; email: string; phone?: string
  address?: string; city?: string; country: string; notes?: string
  created_at: string; updated_at: string
}

const EMPTY = { name: '', email: '', phone: '', address: '', city: '', country: 'Nigeria', notes: '' }
type FormState = typeof EMPTY

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewModal, setViewModal] = useState<Customer | null>(null)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [form, setForm] = useState<FormState>({ ...EMPTY })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: false })
    setCustomers(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setModalOpen(true) }
  const openEdit = (c: Customer) => {
    setEditing(c)
    setForm({ name: c.name, email: c.email, phone: c.phone ?? '', address: c.address ?? '', city: c.city ?? '', country: c.country, notes: c.notes ?? '' })
    setModalOpen(true)
  }

  const save = async () => {
    if (!form.name.trim() || !form.email.trim()) return
    setSaving(true)
    if (editing) {
      await supabase.from('customers').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing.id)
    } else {
      await supabase.from('customers').insert(form)
    }
    setSaving(false); setModalOpen(false); load()
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this customer?')) return
    await supabase.from('customers').delete().eq('id', id)
    setCustomers(prev => prev.filter(c => c.id !== id))
  }

  const exportCSV = () => {
    const rows = [['Name', 'Email', 'Phone', 'City', 'Country', 'Joined']]
    customers.forEach(c => rows.push([c.name, c.email, c.phone ?? '', c.city ?? '', c.country, formatDate(c.created_at)]))
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = 'intarno-customers.csv'; a.click()
  }

  const filtered = customers.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.city ?? '').toLowerCase().includes(q)
  })

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl text-intarno-black">Customers</h1>
          <p className="text-sm text-intarno-mid mt-1">{customers.length} customers in database</p>
        </div>
        <div className="sm:ml-auto flex items-center gap-3">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 text-sm border border-intarno-light rounded-sm hover:bg-intarno-cream transition-colors">
            <Download size={14} /> Export CSV
          </button>
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 text-sm border border-intarno-light rounded-sm hover:bg-intarno-cream transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 text-sm bg-intarno-charcoal text-white rounded-sm hover:bg-intarno-accent transition-colors">
            <Plus size={14} /> Add Customer
          </button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-intarno-mid" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, city…"
          className="w-full pl-9 pr-4 py-2 text-sm border border-intarno-light rounded-sm focus:outline-none focus:border-intarno-accent bg-white" />
      </div>

      <div className="bg-white border border-intarno-light/40 rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-2 border-intarno-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-intarno-mid text-sm">
            {search ? 'No customers match your search.' : 'No customers yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-intarno-light/40 bg-intarno-cream/30">
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widests text-intarno-mid font-medium">Name</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widests text-intarno-mid font-medium">Contact</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widests text-intarno-mid font-medium">Location</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widests text-intarno-mid font-medium">Joined</th>
                  <th className="px-5 py-3 text-right text-xs uppercase tracking-widests text-intarno-mid font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-intarno-light/20">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-intarno-cream/20 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-intarno-accent/10 flex items-center justify-center text-intarno-accent font-display text-lg shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-intarno-charcoal">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-intarno-mid hover:text-intarno-accent text-xs mb-1">
                        <Mail size={12} />{c.email}
                      </a>
                      {c.phone && <p className="flex items-center gap-1.5 text-intarno-mid text-xs"><Phone size={12} />{c.phone}</p>}
                    </td>
                    <td className="px-5 py-4">
                      {(c.city || c.country) && (
                        <span className="flex items-center gap-1.5 text-intarno-mid text-xs">
                          <MapPin size={12} />{[c.city, c.country].filter(Boolean).join(', ')}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-intarno-mid text-xs whitespace-nowrap">{formatDate(c.created_at)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setViewModal(c)} className="p-1.5 text-intarno-mid hover:text-intarno-accent hover:bg-intarno-cream rounded-sm text-xs px-2">View</button>
                        <button onClick={() => openEdit(c)} className="p-1.5 text-intarno-mid hover:text-intarno-accent hover:bg-intarno-cream rounded-sm"><Edit2 size={14} /></button>
                        <button onClick={() => remove(c.id)} className="p-1.5 text-intarno-mid hover:text-red-500 hover:bg-red-50 rounded-sm"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewModal(null)}>
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-md p-8 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewModal(null)} className="absolute top-4 right-4 text-intarno-mid hover:text-intarno-black"><X size={20} /></button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-intarno-accent/10 flex items-center justify-center text-intarno-accent font-display text-3xl">
                {viewModal.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-display text-2xl text-intarno-black">{viewModal.name}</h2>
                <p className="text-sm text-intarno-mid">{formatDate(viewModal.created_at)}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3"><Mail size={14} className="text-intarno-accent shrink-0" /><a href={`mailto:${viewModal.email}`} className="text-intarno-charcoal hover:underline">{viewModal.email}</a></div>
              {viewModal.phone && <div className="flex items-center gap-3"><Phone size={14} className="text-intarno-accent shrink-0" /><span>{viewModal.phone}</span></div>}
              {(viewModal.city || viewModal.address) && <div className="flex items-start gap-3"><MapPin size={14} className="text-intarno-accent shrink-0 mt-0.5" /><span>{[viewModal.address, viewModal.city, viewModal.country].filter(Boolean).join(', ')}</span></div>}
              {viewModal.notes && <div className="mt-4 p-3 bg-intarno-cream rounded-sm text-intarno-mid">{viewModal.notes}</div>}
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => { setViewModal(null); openEdit(viewModal) }}
                className="flex-1 py-2.5 border border-intarno-light text-sm text-intarno-charcoal rounded-sm hover:bg-intarno-cream transition-colors">Edit</button>
              <a href={`mailto:${viewModal.email}`}
                className="flex-1 py-2.5 bg-intarno-charcoal text-white text-sm text-center rounded-sm hover:bg-intarno-accent transition-colors">Email</a>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-8 py-5 border-b border-intarno-light/30">
              <h2 className="font-display text-2xl text-intarno-black">{editing ? 'Edit Customer' : 'New Customer'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-intarno-mid hover:text-intarno-black"><X size={20} /></button>
            </div>
            <div className="px-8 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Full Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">City</label>
                  <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Country</label>
                  <input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Address</label>
                  <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Notes</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm resize-none" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-8 py-5 border-t border-intarno-light/30">
              <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 text-sm border border-intarno-light text-intarno-mid rounded-sm hover:bg-intarno-cream transition-colors">Cancel</button>
              <button onClick={save} disabled={saving || !form.name.trim() || !form.email.trim()}
                className="px-6 py-2.5 text-sm bg-intarno-charcoal text-white rounded-sm hover:bg-intarno-accent transition-colors disabled:opacity-50">
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Customer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
