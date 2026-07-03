import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Edit2, Trash2, RefreshCw, X, Star } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Project {
  id: number; title: string; slug: string; category: string
  client?: string; location?: string; year?: number
  description?: string; challenge?: string; solution?: string; outcome?: string
  testimonial?: string; testimonial_author?: string
  images: string[]; cover_image?: string
  featured: boolean; status: string; created_at: string
}

function slugify(s: string) { return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }
function formatDate(iso: string) { return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }

const CATEGORIES = ['residential', 'commercial', 'hospitality', 'furniture']

const EMPTY = {
  title: '', slug: '', category: 'residential', client: '', location: '', year: new Date().getFullYear(),
  description: '', challenge: '', solution: '', outcome: '',
  testimonial: '', testimonial_author: '', images: [] as string[], cover_image: '',
  featured: false, status: 'published',
}
type FormState = typeof EMPTY

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-sm text-xs font-medium border ${status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function CategoryBadge({ category }: { category: string }) {
  const map: Record<string, string> = {
    residential: 'bg-blue-50 text-blue-700 border-blue-200',
    commercial: 'bg-purple-50 text-purple-700 border-purple-200',
    hospitality: 'bg-amber-50 text-amber-700 border-amber-200',
    furniture: 'bg-intarno-cream text-intarno-charcoal border-intarno-light',
  }
  return <span className={`inline-flex px-2 py-0.5 rounded-sm text-xs font-medium border ${map[category] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
}

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState<FormState>({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [imageInput, setImageInput] = useState('')
  const [step, setStep] = useState<'basic' | 'content' | 'media'>('basic')

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    setProjects(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setEditing(null); setForm({ ...EMPTY }); setImageInput(''); setStep('basic'); setModalOpen(true)
  }
  const openEdit = (p: Project) => {
    setEditing(p)
    setForm({
      title: p.title, slug: p.slug, category: p.category, client: p.client ?? '', location: p.location ?? '',
      year: p.year ?? new Date().getFullYear(), description: p.description ?? '',
      challenge: p.challenge ?? '', solution: p.solution ?? '', outcome: p.outcome ?? '',
      testimonial: p.testimonial ?? '', testimonial_author: p.testimonial_author ?? '',
      images: p.images ?? [], cover_image: p.cover_image ?? '',
      featured: p.featured, status: p.status,
    })
    setImageInput(''); setStep('basic'); setModalOpen(true)
  }

  const save = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    const payload = { ...form, slug: form.slug || slugify(form.title) }
    if (editing) {
      await supabase.from('projects').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id)
    } else {
      await supabase.from('projects').insert(payload)
    }
    setSaving(false); setModalOpen(false); load()
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this project?')) return
    await supabase.from('projects').delete().eq('id', id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  const addImage = () => {
    if (!imageInput.trim()) return
    setForm(f => ({ ...f, images: [...f.images, imageInput.trim()], cover_image: f.cover_image || imageInput.trim() }))
    setImageInput('')
  }

  const filtered = projects.filter(p => {
    if (filterCat !== 'all' && p.category !== filterCat) return false
    if (search) { const q = search.toLowerCase(); return p.title.toLowerCase().includes(q) || (p.client ?? '').toLowerCase().includes(q) || (p.location ?? '').toLowerCase().includes(q) }
    return true
  })

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl text-intarno-black">Projects</h1>
          <p className="text-sm text-intarno-mid mt-1">{projects.length} projects in portfolio</p>
        </div>
        <div className="sm:ml-auto flex items-center gap-3">
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 text-sm border border-intarno-light rounded-sm hover:bg-intarno-cream transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 text-sm bg-intarno-charcoal text-white rounded-sm hover:bg-intarno-accent transition-colors">
            <Plus size={14} /> Add Project
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-intarno-mid" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title, client, location…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-intarno-light rounded-sm focus:outline-none focus:border-intarno-accent bg-white" />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="px-3 py-2 text-sm border border-intarno-light rounded-sm focus:outline-none focus:border-intarno-accent bg-white">
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
      </div>

      <div className="bg-white border border-intarno-light/40 rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-2 border-intarno-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-intarno-mid text-sm">
            {search || filterCat !== 'all' ? 'No projects match your filters.' : 'No projects yet. Click "Add Project" to create your first one.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-intarno-light/40 bg-intarno-cream/30">
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widests text-intarno-mid font-medium w-24">Cover</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widests text-intarno-mid font-medium">Title</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widests text-intarno-mid font-medium">Category</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widests text-intarno-mid font-medium">Client / Location</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widests text-intarno-mid font-medium">Year</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widests text-intarno-mid font-medium">Status</th>
                  <th className="px-5 py-3 text-right text-xs uppercase tracking-widests text-intarno-mid font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-intarno-light/20">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-intarno-cream/20 transition-colors group">
                    <td className="px-5 py-3">
                      {p.cover_image
                        ? <img src={p.cover_image} alt={p.title} className="w-16 h-12 object-cover rounded-sm bg-intarno-cream" />
                        : <div className="w-16 h-12 bg-intarno-cream rounded-sm flex items-center justify-center text-intarno-mid text-[10px]">No img</div>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {p.featured && <Star size={12} className="text-intarno-accent fill-intarno-accent shrink-0" />}
                        <span className="font-medium text-intarno-charcoal">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4"><CategoryBadge category={p.category} /></td>
                    <td className="px-5 py-4">
                      {p.client && <p className="text-intarno-charcoal text-xs font-medium">{p.client}</p>}
                      {p.location && <p className="text-intarno-mid text-xs">{p.location}</p>}
                    </td>
                    <td className="px-5 py-4 text-intarno-mid text-xs">{p.year || '—'}</td>
                    <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-4">
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-8 py-5 border-b border-intarno-light/30">
              <h2 className="font-display text-2xl text-intarno-black">{editing ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-intarno-mid hover:text-intarno-black"><X size={20} /></button>
            </div>

            {/* Step tabs */}
            <div className="flex border-b border-intarno-light/30 px-8">
              {(['basic', 'content', 'media'] as const).map(s => (
                <button key={s} onClick={() => setStep(s)}
                  className={`px-4 py-3 text-sm capitalize border-b-2 -mb-px transition-colors ${step === s ? 'border-intarno-accent text-intarno-charcoal font-medium' : 'border-transparent text-intarno-mid hover:text-intarno-charcoal'}`}>
                  {s}
                </button>
              ))}
            </div>

            <div className="px-8 py-6 space-y-4">
              {step === 'basic' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Project Title *</label>
                      <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))}
                        className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Slug</label>
                      <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                        className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm font-mono text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Category</label>
                      <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm bg-white">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Client</label>
                      <input value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                        className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Location</label>
                      <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                        className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Year</label>
                      <input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))}
                        className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Status</label>
                      <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                        className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm bg-white">
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-intarno-accent" />
                        <span className="text-intarno-charcoal">Featured Project</span>
                      </label>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Short Description</label>
                      <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                        className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm resize-none" />
                    </div>
                  </div>
                </>
              )}

              {step === 'content' && (
                <div className="space-y-4">
                  {([
                    ['challenge', 'Client Challenge', 3],
                    ['solution', 'Design Solution', 3],
                    ['outcome', 'Outcome / Result', 3],
                    ['testimonial', 'Client Testimonial', 3],
                    ['testimonial_author', 'Testimonial Author', 1],
                  ] as [keyof FormState, string, number][]).map(([field, label, rows]) => (
                    <div key={field}>
                      <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">{label}</label>
                      {rows > 1
                        ? <textarea value={String(form[field])} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} rows={rows}
                            className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm resize-none" />
                        : <input value={String(form[field])} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                            className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm" />}
                    </div>
                  ))}
                </div>
              )}

              {step === 'media' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Project Images</label>
                    <div className="flex gap-2 mb-3">
                      <input value={imageInput} onChange={e => setImageInput(e.target.value)} placeholder="https://… paste image URL"
                        className="flex-1 border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm"
                        onKeyDown={e => { if (e.key === 'Enter') addImage() }} />
                      <button onClick={addImage} className="px-4 py-2 text-sm bg-intarno-charcoal text-white rounded-sm hover:bg-intarno-accent transition-colors">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative group">
                          <img src={img} alt="" className="w-20 h-16 object-cover rounded-sm border border-intarno-light" />
                          <div className="absolute inset-0 bg-black/30 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            <button onClick={() => setForm(f => ({ ...f, cover_image: img }))}
                              title="Set as cover"
                              className={`p-1 rounded text-white text-xs ${form.cover_image === img ? 'bg-intarno-accent' : 'bg-black/50 hover:bg-intarno-accent'}`}>★</button>
                            <button onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                              className="p-1 rounded bg-red-500 text-white text-xs">×</button>
                          </div>
                          {form.cover_image === img && (
                            <div className="absolute bottom-0 left-0 right-0 bg-intarno-accent text-white text-[9px] text-center py-0.5">Cover</div>
                          )}
                        </div>
                      ))}
                    </div>
                    {form.images.length > 0 && <p className="text-xs text-intarno-mid mt-2">Click ★ to set cover image. Click × to remove.</p>}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center px-8 py-5 border-t border-intarno-light/30">
              <div className="flex gap-2">
                {step !== 'basic' && (
                  <button onClick={() => setStep(step === 'media' ? 'content' : 'basic')}
                    className="px-4 py-2.5 text-sm border border-intarno-light text-intarno-mid rounded-sm hover:bg-intarno-cream transition-colors">← Back</button>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 text-sm border border-intarno-light text-intarno-mid rounded-sm hover:bg-intarno-cream transition-colors">Cancel</button>
                {step !== 'media' ? (
                  <button onClick={() => setStep(step === 'basic' ? 'content' : 'media')}
                    className="px-6 py-2.5 text-sm bg-intarno-charcoal text-white rounded-sm hover:bg-intarno-accent transition-colors">Next →</button>
                ) : (
                  <button onClick={save} disabled={saving || !form.title.trim()}
                    className="px-6 py-2.5 text-sm bg-intarno-charcoal text-white rounded-sm hover:bg-intarno-accent transition-colors disabled:opacity-50">
                    {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Project'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
