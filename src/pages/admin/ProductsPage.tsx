import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Edit2, Trash2, RefreshCw, X, Star, ChevronUp, ChevronDown } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Category { id: number; name: string; slug: string }
interface Product {
  id: number; name: string; slug: string; description?: string
  price: number; sale_price?: number; currency: string
  category_id?: number; category_name?: string
  images: string[]; materials: string[]; collection?: string
  width_cm?: number; height_cm?: number; depth_cm?: number
  stock_qty: number; featured: boolean; is_new: boolean; is_sale: boolean
  status: string; created_at: string
}

function slugify(s: string) { return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }
function formatNaira(n: number) { return '₦' + Number(n).toLocaleString('en-NG') }

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    draft: 'bg-gray-50 text-gray-600 border-gray-200',
    archived: 'bg-red-50 text-red-600 border-red-200',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-sm text-xs font-medium border ${map[status] || map.draft}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

const EMPTY = {
  name: '', slug: '', description: '', price: 0, sale_price: undefined as number | undefined,
  currency: '₦', category_id: undefined as number | undefined, category_name: '',
  images: [] as string[], materials: [] as string[], collection: '',
  width_cm: undefined as number | undefined, height_cm: undefined as number | undefined,
  depth_cm: undefined as number | undefined,
  stock_qty: 0, featured: false, is_new: false, is_sale: false, status: 'active',
}
type FormState = typeof EMPTY

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortField, setSortField] = useState<'name' | 'price' | 'created_at'>('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [imageInput, setImageInput] = useState('')
  const [materialInput, setMaterialInput] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const [pRes, cRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('id, name, slug').order('sort_order'),
    ])
    setProducts(pRes.data ?? [])
    setCategories(cRes.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setEditing(null); setForm({ ...EMPTY }); setImageInput(''); setMaterialInput(''); setModalOpen(true)
  }
  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({
      name: p.name, slug: p.slug, description: p.description ?? '',
      price: p.price, sale_price: p.sale_price, currency: p.currency,
      category_id: p.category_id, category_name: p.category_name ?? '',
      images: p.images ?? [], materials: p.materials ?? [], collection: p.collection ?? '',
      width_cm: p.width_cm, height_cm: p.height_cm, depth_cm: p.depth_cm,
      stock_qty: p.stock_qty, featured: p.featured, is_new: p.is_new, is_sale: p.is_sale, status: p.status,
    })
    setImageInput(''); setMaterialInput(''); setModalOpen(true)
  }

  const handleCategoryChange = (id: string) => {
    const cat = categories.find(c => c.id === Number(id))
    setForm(f => ({ ...f, category_id: cat?.id, category_name: cat?.name ?? '' }))
  }

  const save = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    const payload = { ...form, slug: form.slug || slugify(form.name) }
    if (editing) {
      await supabase.from('products').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id)
    } else {
      await supabase.from('products').insert(payload)
    }
    setSaving(false); setModalOpen(false); load()
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const handleSort = (f: typeof sortField) => {
    if (sortField === f) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(f); setSortDir('asc') }
  }

  const filtered = products
    .filter(p => {
      if (filterStatus !== 'all' && p.status !== filterStatus) return false
      if (search) { const q = search.toLowerCase(); return p.name.toLowerCase().includes(q) || (p.category_name ?? '').toLowerCase().includes(q) }
      return true
    })
    .sort((a, b) => {
      const va = String(a[sortField] ?? ''), vb = String(b[sortField] ?? '')
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    })

  const SortIcon = ({ field }: { field: typeof sortField }) =>
    sortField !== field ? <span className="opacity-30">↕</span> :
    sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl text-intarno-black">Products</h1>
          <p className="text-sm text-intarno-mid mt-1">{products.length} products in catalogue</p>
        </div>
        <div className="sm:ml-auto flex items-center gap-3">
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 text-sm border border-intarno-light rounded-sm hover:bg-intarno-cream transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 text-sm bg-intarno-charcoal text-white rounded-sm hover:bg-intarno-accent transition-colors">
            <Plus size={14} /> Add Product
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-intarno-mid" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-intarno-light rounded-sm focus:outline-none focus:border-intarno-accent bg-white" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-sm border border-intarno-light rounded-sm focus:outline-none focus:border-intarno-accent bg-white">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="bg-white border border-intarno-light/40 rounded-sm overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 border-2 border-intarno-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-intarno-mid text-sm">
            {search ? 'No products match your search.' : 'No products yet. Click "Add Product" to create your first one.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-intarno-light/40 bg-intarno-cream/30">
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-intarno-mid font-medium w-16">Img</th>
                  <th onClick={() => handleSort('name')} className="px-5 py-3 text-left text-xs uppercase tracking-widest text-intarno-mid font-medium cursor-pointer">
                    <span className="flex items-center gap-1">Name <SortIcon field="name" /></span>
                  </th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-intarno-mid font-medium">Category</th>
                  <th onClick={() => handleSort('price')} className="px-5 py-3 text-left text-xs uppercase tracking-widest text-intarno-mid font-medium cursor-pointer">
                    <span className="flex items-center gap-1">Price <SortIcon field="price" /></span>
                  </th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-intarno-mid font-medium">Status</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-intarno-mid font-medium">Flags</th>
                  <th className="px-5 py-3 text-right text-xs uppercase tracking-widest text-intarno-mid font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-intarno-light/20">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-intarno-cream/20 transition-colors group">
                    <td className="px-5 py-3">
                      {p.images?.[0]
                        ? <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded-sm bg-intarno-cream" />
                        : <div className="w-12 h-12 bg-intarno-cream rounded-sm flex items-center justify-center text-intarno-mid text-[10px]">No img</div>}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-intarno-charcoal">{p.name}</p>
                      {p.collection && <p className="text-xs text-intarno-mid mt-0.5">{p.collection}</p>}
                    </td>
                    <td className="px-5 py-3 text-intarno-mid">{p.category_name || '—'}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-intarno-charcoal">{formatNaira(p.price)}</p>
                      {p.is_sale && p.sale_price && <p className="text-xs text-red-500">{formatNaira(p.sale_price)}</p>}
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1 items-center">
                        {p.featured && <Star size={13} className="text-intarno-accent fill-intarno-accent" />}
                        {p.is_new && <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-sm">New</span>}
                        {p.is_sale && <span className="text-[10px] px-1.5 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded-sm">Sale</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-intarno-mid hover:text-intarno-accent hover:bg-intarno-cream rounded-sm"><Edit2 size={14} /></button>
                        <button onClick={() => remove(p.id)} className="p-1.5 text-intarno-mid hover:text-red-500 hover:bg-red-50 rounded-sm"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-8 py-5 border-b border-intarno-light/30">
              <h2 className="font-display text-2xl text-intarno-black">{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-intarno-mid hover:text-intarno-black"><X size={20} /></button>
            </div>
            <div className="px-8 py-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-intarno-mid mb-1.5">Product Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-intarno-mid mb-1.5">Slug</label>
                  <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm font-mono text-xs" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-intarno-mid mb-1.5">Category</label>
                  <select value={form.category_id ?? ''} onChange={e => handleCategoryChange(e.target.value)}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm bg-white">
                    <option value="">— Select —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-intarno-mid mb-1.5">Price (₦)</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-intarno-mid mb-1.5">Sale Price (₦)</label>
                  <input type="number" value={form.sale_price ?? ''} onChange={e => setForm(f => ({ ...f, sale_price: e.target.value ? Number(e.target.value) : undefined }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-intarno-mid mb-1.5">Collection</label>
                  <input value={form.collection} onChange={e => setForm(f => ({ ...f, collection: e.target.value }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-intarno-mid mb-1.5">Stock Qty</label>
                  <input type="number" value={form.stock_qty} onChange={e => setForm(f => ({ ...f, stock_qty: Number(e.target.value) }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-intarno-mid mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                  className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm resize-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-intarno-mid mb-1.5">Dimensions (cm) — W × H × D</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['width_cm', 'height_cm', 'depth_cm'] as const).map(dim => (
                    <input key={dim} type="number" placeholder={dim.split('_')[0].charAt(0).toUpperCase() + dim.split('_')[0].slice(1)}
                      value={form[dim] ?? ''} onChange={e => setForm(f => ({ ...f, [dim]: e.target.value ? Number(e.target.value) : undefined }))}
                      className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-intarno-mid mb-1.5">Image URLs</label>
                <div className="flex gap-2 mb-2">
                  <input value={imageInput} onChange={e => setImageInput(e.target.value)} placeholder="https://… paste image URL"
                    className="flex-1 border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm"
                    onKeyDown={e => { if (e.key === 'Enter' && imageInput.trim()) { setForm(f => ({ ...f, images: [...f.images, imageInput.trim()] })); setImageInput('') }}} />
                  <button onClick={() => { if (imageInput.trim()) { setForm(f => ({ ...f, images: [...f.images, imageInput.trim()] })); setImageInput('') }}}
                    className="px-4 py-2 text-sm bg-intarno-charcoal text-white rounded-sm hover:bg-intarno-accent transition-colors">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt="" className="w-16 h-16 object-cover rounded-sm border border-intarno-light" />
                      <button onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100">×</button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-intarno-mid mb-1.5">Materials</label>
                <div className="flex gap-2 mb-2">
                  <input value={materialInput} onChange={e => setMaterialInput(e.target.value)} placeholder="e.g. Solid oak"
                    className="flex-1 border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm"
                    onKeyDown={e => { if (e.key === 'Enter' && materialInput.trim()) { setForm(f => ({ ...f, materials: [...f.materials, materialInput.trim()] })); setMaterialInput('') }}} />
                  <button onClick={() => { if (materialInput.trim()) { setForm(f => ({ ...f, materials: [...f.materials, materialInput.trim()] })); setMaterialInput('') }}}
                    className="px-4 py-2 text-sm bg-intarno-charcoal text-white rounded-sm hover:bg-intarno-accent transition-colors">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.materials.map((m, i) => (
                    <span key={i} className="flex items-center gap-1 px-2 py-1 bg-intarno-cream text-xs rounded-sm border border-intarno-light">
                      {m}
                      <button onClick={() => setForm(f => ({ ...f, materials: f.materials.filter((_, j) => j !== i) }))} className="text-red-400 hover:text-red-600 ml-1">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm bg-white">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end gap-2 pb-1">
                  {(['featured', 'is_new', 'is_sale'] as const).map(flag => (
                    <label key={flag} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={form[flag]} onChange={e => setForm(f => ({ ...f, [flag]: e.target.checked }))} className="w-4 h-4 accent-intarno-accent" />
                      <span className="text-intarno-charcoal">{flag === 'is_new' ? 'New Arrival' : flag === 'is_sale' ? 'On Sale' : 'Featured'}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-8 py-5 border-t border-intarno-light/30">
              <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 text-sm border border-intarno-light text-intarno-mid rounded-sm hover:bg-intarno-cream transition-colors">Cancel</button>
              <button onClick={save} disabled={saving || !form.name.trim()}
                className="px-6 py-2.5 text-sm bg-intarno-charcoal text-white rounded-sm hover:bg-intarno-accent transition-colors disabled:opacity-50">
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
