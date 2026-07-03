import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Edit2, Trash2, RefreshCw, X, Star, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

// Actual Supabase schema for 'projects':
// id, title, slug, description, client, location, type, images (jsonb),
// tags (jsonb), is_featured (boolean), completed_at (date), created_at

interface Project {
  id: number
  title: string
  slug: string
  description?: string
  client?: string
  location?: string
  type: string
  images: string[]
  tags?: string[]
  is_featured: boolean
  completed_at?: string
  created_at: string
}

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const TYPES = ['residential', 'commercial', 'hospitality', 'furniture', 'other']

const EMPTY = {
  title: '',
  slug: '',
  type: 'residential',
  client: '',
  location: '',
  description: '',
  images: [] as string[],
  tags: [] as string[],
  is_featured: false,
  completed_at: '',
}
type FormState = typeof EMPTY

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    residential: 'bg-blue-50 text-blue-700 border-blue-200',
    commercial: 'bg-purple-50 text-purple-700 border-purple-200',
    hospitality: 'bg-amber-50 text-amber-700 border-amber-200',
    furniture: 'bg-intarno-cream text-intarno-charcoal border-intarno-light',
    other: 'bg-gray-50 text-gray-600 border-gray-200',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-sm text-xs font-medium border ${map[type] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  )
}

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState<FormState>({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [imageInput, setImageInput] = useState('')
  const [tagInput, setTagInput] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: dbError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      if (dbError) throw dbError
      // Normalise images from jsonb (could be array or object)
      const normalised = (data ?? []).map(p => ({
        ...p,
        images: Array.isArray(p.images) ? p.images : [],
        tags: Array.isArray(p.tags) ? p.tags : [],
      }))
      setProjects(normalised)
    } catch (err) {
      console.error('[Projects] load error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load projects.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...EMPTY })
    setImageInput('')
    setTagInput('')
    setModalOpen(true)
  }

  const openEdit = (p: Project) => {
    setEditing(p)
    setForm({
      title: p.title,
      slug: p.slug,
      type: p.type,
      client: p.client ?? '',
      location: p.location ?? '',
      description: p.description ?? '',
      images: p.images ?? [],
      tags: p.tags ?? [],
      is_featured: p.is_featured,
      completed_at: p.completed_at ?? '',
    })
    setImageInput('')
    setTagInput('')
    setModalOpen(true)
  }

  const save = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug || slugify(form.title),
        type: form.type,
        client: form.client.trim() || null,
        location: form.location.trim() || null,
        description: form.description.trim() || null,
        images: form.images,
        tags: form.tags,
        is_featured: form.is_featured,
        completed_at: form.completed_at || null,
      }
      const { error: dbError } = editing
        ? await supabase.from('projects').update(payload).eq('id', editing.id)
        : await supabase.from('projects').insert(payload)
      if (dbError) throw dbError
      setModalOpen(false)
      load()
    } catch (err) {
      console.error('[Projects] save error:', err)
      alert('Failed to save project. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this project?')) return
    const { error: dbError } = await supabase.from('projects').delete().eq('id', id)
    if (!dbError) setProjects(prev => prev.filter(p => p.id !== id))
  }

  const addImage = () => {
    const url = imageInput.trim()
    if (!url) return
    setForm(f => ({ ...f, images: [...f.images, url] }))
    setImageInput('')
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (!tag || form.tags.includes(tag)) return
    setForm(f => ({ ...f, tags: [...f.tags, tag] }))
    setTagInput('')
  }

  const filtered = projects.filter(p => {
    if (filterType !== 'all' && p.type !== filterType) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        p.title.toLowerCase().includes(q) ||
        (p.client ?? '').toLowerCase().includes(q) ||
        (p.location ?? '').toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
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

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Failed to load projects</p>
            <p className="text-red-600 mt-0.5">{error}</p>
            <button onClick={load} className="mt-2 underline hover:no-underline">Try again</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-intarno-mid" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, client, location…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-intarno-light rounded-sm focus:outline-none focus:border-intarno-accent bg-white"
          />
        </div>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-3 py-2 text-sm border border-intarno-light rounded-sm focus:outline-none focus:border-intarno-accent bg-white"
        >
          <option value="all">All Types</option>
          {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-intarno-light/40 rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-2 border-intarno-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-intarno-mid text-sm">Unable to load projects.</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-intarno-mid text-sm">
            {search || filterType !== 'all' ? 'No projects match your filters.' : 'No projects yet. Click "Add Project" to create your first one.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-intarno-light/40 bg-intarno-cream/30">
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-intarno-mid font-medium w-24">Cover</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widests text-intarno-mid font-medium">Title</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widests text-intarno-mid font-medium">Type</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widests text-intarno-mid font-medium">Client / Location</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widests text-intarno-mid font-medium">Completed</th>
                  <th className="px-5 py-3 text-right text-xs uppercase tracking-widests text-intarno-mid font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-intarno-light/20">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-intarno-cream/20 transition-colors group">
                    <td className="px-5 py-3">
                      {p.images[0]
                        ? <img src={p.images[0]} alt={p.title} className="w-16 h-12 object-cover rounded-sm bg-intarno-cream" />
                        : <div className="w-16 h-12 bg-intarno-cream rounded-sm flex items-center justify-center text-intarno-mid text-[10px]">No img</div>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {p.is_featured && <Star size={12} className="text-intarno-accent fill-intarno-accent shrink-0" />}
                        <span className="font-medium text-intarno-charcoal">{p.title}</span>
                      </div>
                      {p.tags && p.tags.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {p.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-intarno-cream text-intarno-mid rounded-sm">{tag}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4"><TypeBadge type={p.type} /></td>
                    <td className="px-5 py-4">
                      {p.client && <p className="text-intarno-charcoal text-xs font-medium">{p.client}</p>}
                      {p.location && <p className="text-intarno-mid text-xs">{p.location}</p>}
                    </td>
                    <td className="px-5 py-4 text-intarno-mid text-xs">
                      {p.completed_at ? formatDate(p.completed_at) : '—'}
                    </td>
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

            <div className="px-8 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Project Title *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Slug</label>
                  <input
                    value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Type</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm bg-white"
                  >
                    {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Client</label>
                  <input
                    value={form.client}
                    onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Location</label>
                  <input
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Completed Date</label>
                  <input
                    type="date"
                    value={form.completed_at}
                    onChange={e => setForm(f => ({ ...f, completed_at: e.target.value }))}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_featured}
                      onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                      className="w-4 h-4 accent-intarno-accent"
                    />
                    <span className="text-intarno-charcoal">Featured Project</span>
                  </label>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                    className="w-full border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm resize-none"
                  />
                </div>

                {/* Tags */}
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      placeholder="e.g. modern, luxury…"
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                      className="flex-1 border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm"
                    />
                    <button onClick={addTag} className="px-4 py-2 text-sm bg-intarno-charcoal text-white rounded-sm hover:bg-intarno-accent transition-colors">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map((tag, i) => (
                      <span key={i} className="flex items-center gap-1 px-2 py-1 bg-intarno-cream text-intarno-charcoal text-xs rounded-sm border border-intarno-light">
                        {tag}
                        <button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter((_, j) => j !== i) }))} className="text-intarno-mid hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widests text-intarno-mid mb-1.5">Images</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      value={imageInput}
                      onChange={e => setImageInput(e.target.value)}
                      placeholder="https://… paste image URL"
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImage() } }}
                      className="flex-1 border border-intarno-light px-3 py-2 text-sm focus:outline-none focus:border-intarno-accent rounded-sm"
                    />
                    <button onClick={addImage} className="px-4 py-2 text-sm bg-intarno-charcoal text-white rounded-sm hover:bg-intarno-accent transition-colors">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img} alt="" className="w-20 h-16 object-cover rounded-sm border border-intarno-light" />
                        <button
                          onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                          className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >×</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-8 py-5 border-t border-intarno-light/30">
              <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 text-sm border border-intarno-light text-intarno-mid rounded-sm hover:bg-intarno-cream transition-colors">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving || !form.title.trim()}
                className="px-6 py-2.5 text-sm bg-intarno-charcoal text-white rounded-sm hover:bg-intarno-accent transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
