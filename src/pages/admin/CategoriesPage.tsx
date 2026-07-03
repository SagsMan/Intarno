import { useState, useEffect, useCallback } from 'react'
import { Plus, Edit2, Trash2, RefreshCw, X, ChevronUp, ChevronDown } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Category {
  id: number; name: string; slug: string; description?: string
  image_url?: string; sort_order: number; created_at: string
}

function slugify(s: string) { return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }

const EMPTY = { name: '', slug: '', description: '', image_url: '', sort_order: 0 }
type FormState = typeof EMPTY

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState<FormState>({ ...EMPTY })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    setCats(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setModalOpen(true) }
  const openEdit = (c: Category) => {
    setEditing(c)
    setForm({ name: c.name, slug: c.slug, description: c.description ?? '', image_url: c.image_url ?? '', sort_order: c.sort_order })
    setModalOpen(true)
  }

  const save = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    const payload = { ...form, slug: form.slug || slugify(form.name) }
    if (editing) {
      await supabase.from('categories').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('categories').insert(payload)
    }
    setSaving(false); setModalOpen(false); load()
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this category? Products in this category will lose their category assignment.')) return
    await supabase.from('categories').delete().eq('id', id)
    setCats(prev => prev.filter(c => c.id !== id))
  }

  const moveOrder = async (cat: Category, dir: -1 | 1) => {
    const newOrder = cat.sort_order + dir
    await supabase.from('categories').update({ sort_order: newOrder }).eq('id', cat.id)
    load()
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-intarno-black">Categories</h1>
          <p className="text-sm text-intarno-mid mt-1">{cats.length} categories</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 text-sm border border-intarno-light rounded-sm hover:bg-intarno-cream transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 text-sm bg-intarno-charcoal text-white rounded-sm hover:bg-intarno-accent transition-colors">
            <Plus size={14} /> Add Category
          </button>
        </div>
      </div>

      <div className="bg-white border border-intarno-light/40 rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-2 border-intarno-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : cats.length === 0 ? (
          <div className="text-center py-16 text-intarno-mid text-sm">No categories yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-intarno-light/40 bg-intarno-cream/30">
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-intarno-mid font-medium">Order</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-intarno-mid font-medium">Name</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-intarno-mid font-medium">Slug</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-intarno-mid font-medium">Description</th>
                <th className="px-5 py-3 text-right text-xs uppercase tracking-widest text-intarno-mid font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-intarno-light/20">
              {cats.map((c, idx) => (
                <tr key={c.id} className="hover:bg-intarno-cream/20 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => moveOrder(c, -1)} disabled={idx === 0}
                        className="p-0.5 text-intarno-mid hover:text-intarno-charcoal disabled:opacity-20"><ChevronUp size={14} /></button>
                      <span className="text-xs text-center text-intarno-mid">{c.sort_order}</span>
                      <button onClick={() => moveOrder(c, 1)} disabled={idx === cats.length - 1}
                        className="p-0.5 text-intarno-mid hover:text-intarno-charcoal disabled:opacity-20"><ChevronDown size={14} /></button>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {c.image_url && <img src={c.image_url} alt={c.name} className="w-10 h-10 object-cover rounded-sm bg-intarno-cream" />}
                      <span className="font-medium text-intarno-charcoal">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-intarno-mid">{c.slug}</td>
                  <td className="px-5 py-4 text-intarno-mid max-w-xs truncate">{c.description || '—'}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(c)} className="p-1.5 text-intarno-mid hover:text-intarno-accent hover:bg-intarno-cream rounded-sm"><Edit2 size={14} /></button>
                      <button onClick={() => remove(c.id)} className="p-1.5 text-intarno-mid hover:text-red-500 hover:bg-red-50 rounded-sm"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-8 py-5 border-b border-intarno-light/30">
              <h2 className="font-display text-2xl text-intarno-black">{editing ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-intarno-mid hover:text-intarno-black"><X size={20} /></button>
            </div>
            <div className="px-8 py-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Category Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                  className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Slug</label>
                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm font-mono text-xs" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Description</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Image URL</label>
                <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  placeholder="https://…" className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Sort Order</label>
                <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                  className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-8 py-5 border-t border-intarno-light/30">
              <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 text-sm border border-intarno-light text-intarno-mid rounded-sm hover:bg-intarno-cream transition-colors">Cancel</button>
              <button onClick={save} disabled={saving || !form.name.trim()}
                className="px-6 py-2.5 text-sm bg-intarno-charcoal text-white rounded-sm hover:bg-intarno-accent transition-colors disabled:opacity-50">
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
