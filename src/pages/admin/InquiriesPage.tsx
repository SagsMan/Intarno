import { useState, useEffect, useCallback } from 'react'
import { Search, Eye, Trash2, RefreshCw, Mail, Phone, MessageSquare, Package, X, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Inquiry {
  id: number
  name: string
  email: string
  phone?: string
  subject?: string
  message?: string
  type: string
  status?: string
  created_at: string
}

interface SampleRequest {
  id: number
  name: string
  email: string
  address?: string
  city?: string
  postcode?: string
  swatches?: string[]
  created_at: string
}

type Tab = 'inquiries' | 'samples'
type SortField = 'name' | 'email' | 'type' | 'created_at'
type SortDir = 'asc' | 'desc'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    consultation: 'bg-blue-50 text-blue-700 border-blue-200',
    interior_design: 'bg-purple-50 text-purple-700 border-purple-200',
    custom_furniture: 'bg-amber-50 text-amber-700 border-amber-200',
    project_management: 'bg-green-50 text-green-700 border-green-200',
  }
  const label = type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const cls = map[type] || 'bg-gray-50 text-gray-600 border-gray-200'
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-sm text-xs font-medium border ${cls}`}>
      {label}
    </span>
  )
}

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null
  const map: Record<string, string> = {
    new: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    read: 'bg-gray-50 text-gray-600 border-gray-200',
    replied: 'bg-blue-50 text-blue-700 border-blue-200',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-sm text-xs font-medium border ${map[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function Modal({ inquiry, onClose }: { inquiry: Inquiry; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg p-8 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
        <h2 className="font-display text-2xl text-intarno-black mb-1">{inquiry.name}</h2>
        <p className="text-sm text-intarno-mid mb-3">{formatDate(inquiry.created_at)}</p>
        <div className="flex items-center gap-2 mb-4">
          <TypeBadge type={inquiry.type} />
          <StatusBadge status={inquiry.status} />
        </div>
        {inquiry.subject && (
          <p className="text-sm font-medium text-intarno-charcoal mb-4 pb-4 border-b border-intarno-light/30">{inquiry.subject}</p>
        )}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail size={16} className="mt-0.5 text-intarno-accent shrink-0" />
            <div>
              <p className="text-xs text-intarno-mid uppercase tracking-wider">Email</p>
              <a href={`mailto:${inquiry.email}`} className="text-sm text-intarno-charcoal hover:underline">{inquiry.email}</a>
            </div>
          </div>
          {inquiry.phone && (
            <div className="flex items-start gap-3">
              <Phone size={16} className="mt-0.5 text-intarno-accent shrink-0" />
              <div>
                <p className="text-xs text-intarno-mid uppercase tracking-wider">Phone</p>
                <p className="text-sm text-intarno-charcoal">{inquiry.phone}</p>
              </div>
            </div>
          )}
          {inquiry.message && (
            <div className="flex items-start gap-3">
              <MessageSquare size={16} className="mt-0.5 text-intarno-accent shrink-0" />
              <div>
                <p className="text-xs text-intarno-mid uppercase tracking-wider">Message</p>
                <p className="text-sm text-intarno-charcoal leading-relaxed">{inquiry.message}</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-8">
          <a
            href={`mailto:${inquiry.email}?subject=Re: ${inquiry.subject || 'Your Intarno Inquiry'}`}
            className="w-full block text-center py-2.5 bg-intarno-charcoal text-white text-sm tracking-wider hover:bg-intarno-accent transition-colors rounded-sm"
          >
            Reply via Email
          </a>
        </div>
      </div>
    </div>
  )
}

function SampleModal({ sample, onClose }: { sample: SampleRequest; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg p-8 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
        <h2 className="font-display text-2xl text-intarno-black mb-1">{sample.name}</h2>
        <p className="text-sm text-intarno-mid mb-6">{formatDate(sample.created_at)}</p>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail size={16} className="mt-0.5 text-intarno-accent shrink-0" />
            <div>
              <p className="text-xs text-intarno-mid uppercase tracking-wider">Email</p>
              <a href={`mailto:${sample.email}`} className="text-sm text-intarno-charcoal hover:underline">{sample.email}</a>
            </div>
          </div>
          {(sample.address || sample.city) && (
            <div className="flex items-start gap-3">
              <Package size={16} className="mt-0.5 text-intarno-accent shrink-0" />
              <div>
                <p className="text-xs text-intarno-mid uppercase tracking-wider">Delivery Address</p>
                <p className="text-sm text-intarno-charcoal">{[sample.address, sample.city, sample.postcode].filter(Boolean).join(', ')}</p>
              </div>
            </div>
          )}
          {sample.swatches && sample.swatches.length > 0 && (
            <div>
              <p className="text-xs text-intarno-mid uppercase tracking-wider mb-2">Requested Swatches</p>
              <div className="flex flex-wrap gap-2">
                {sample.swatches.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-intarno-cream text-intarno-charcoal text-xs rounded-sm border border-intarno-light">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mt-8">
          <a
            href={`mailto:${sample.email}?subject=Your Intarno Fabric Sample Request`}
            className="w-full block text-center py-2.5 bg-intarno-charcoal text-white text-sm tracking-wider hover:bg-intarno-accent transition-colors rounded-sm"
          >
            Reply via Email
          </a>
        </div>
      </div>
    </div>
  )
}

export default function InquiriesPage() {
  const [tab, setTab] = useState<Tab>('inquiries')
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [samples, setSamples] = useState<SampleRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [selectedSample, setSelectedSample] = useState<SampleRequest | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [inqRes, samRes] = await Promise.all([
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('sample_requests').select('*').order('created_at', { ascending: false }),
      ])
      if (inqRes.error) throw inqRes.error
      if (samRes.error) throw samRes.error
      setInquiries(inqRes.data ?? [])
      setSamples(samRes.data ?? [])
    } catch (err) {
      console.error('[Inquiries] load error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load inquiries.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="opacity-30">↕</span>
    return sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
  }

  const deleteInquiry = async (id: number) => {
    if (!confirm('Delete this inquiry?')) return
    const { error } = await supabase.from('inquiries').delete().eq('id', id)
    if (!error) setInquiries(prev => prev.filter(i => i.id !== id))
  }

  const deleteSample = async (id: number) => {
    if (!confirm('Delete this sample request?')) return
    const { error } = await supabase.from('sample_requests').delete().eq('id', id)
    if (!error) setSamples(prev => prev.filter(s => s.id !== id))
  }

  const q = search.toLowerCase()
  const filteredInquiries = inquiries
    .filter(i => !q || i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q) || i.type.toLowerCase().includes(q) || (i.subject || '').toLowerCase().includes(q))
    .sort((a, b) => {
      const va = a[sortField as keyof Inquiry] ?? ''
      const vb = b[sortField as keyof Inquiry] ?? ''
      return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })

  const filteredSamples = samples
    .filter(s => !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q))
    .sort((a, b) => {
      const field = sortField === 'type' ? 'name' : sortField
      const va = a[field as keyof SampleRequest] ?? ''
      const vb = b[field as keyof SampleRequest] ?? ''
      return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })

  return (
    <div className="max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-intarno-black">Inquiries</h1>
          <p className="text-sm text-intarno-mid mt-1">Manage customer inquiries and fabric sample requests</p>
        </div>
        <button
          onClick={load}
          className="sm:ml-auto flex items-center gap-2 px-4 py-2 text-sm text-intarno-charcoal border border-intarno-light rounded-sm hover:bg-intarno-cream transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Failed to load inquiries</p>
            <p className="text-red-600 mt-0.5">{error}</p>
            <button onClick={load} className="mt-2 underline text-red-700 hover:no-underline">Try again</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-intarno-light/40 rounded-sm p-5">
          <p className="text-xs uppercase tracking-widest text-intarno-mid">Total Inquiries</p>
          <p className="font-display text-4xl text-intarno-black mt-1">{inquiries.length}</p>
        </div>
        <div className="bg-white border border-intarno-light/40 rounded-sm p-5">
          <p className="text-xs uppercase tracking-widest text-intarno-mid">Sample Requests</p>
          <p className="font-display text-4xl text-intarno-black mt-1">{samples.length}</p>
        </div>
      </div>

      <div className="bg-white border border-intarno-light/40 rounded-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-0 border-b border-intarno-light/40 gap-4">
          <div className="flex gap-0">
            {(['inquiries', 'samples'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setSearch('') }}
                className={`px-5 py-3 text-sm tracking-wide border-b-2 transition-colors -mb-px
                  ${tab === t ? 'border-intarno-accent text-intarno-charcoal font-medium' : 'border-transparent text-intarno-mid hover:text-intarno-charcoal'}`}
              >
                {t === 'inquiries' ? `Contact Inquiries (${inquiries.length})` : `Fabric Samples (${samples.length})`}
              </button>
            ))}
          </div>
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-intarno-mid" />
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-4 py-2 text-sm border border-intarno-light rounded-sm bg-intarno-cream/50 focus:outline-none focus:border-intarno-accent w-52"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-2 border-intarno-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-intarno-mid text-sm">Unable to load data. Please try again.</div>
        ) : tab === 'inquiries' ? (
          filteredInquiries.length === 0 ? (
            <div className="text-center py-16 text-intarno-mid text-sm">
              {search ? 'No inquiries match your search.' : 'No inquiries yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-intarno-light/40 bg-intarno-cream/30">
                    {([['name','Name'],['email','Email'],['type','Type'],['created_at','Date']] as [SortField,string][]).map(([f,l]) => (
                      <th key={f} onClick={() => handleSort(f)} className="px-5 py-3 text-left text-xs uppercase tracking-widest text-intarno-mid font-medium cursor-pointer hover:text-intarno-charcoal select-none">
                        <span className="flex items-center gap-1">{l} <SortIcon field={f} /></span>
                      </th>
                    ))}
                    <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-intarno-mid font-medium">Status</th>
                    <th className="px-5 py-3 text-right text-xs uppercase tracking-widest text-intarno-mid font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-intarno-light/20">
                  {filteredInquiries.map(inq => (
                    <tr key={inq.id} className="hover:bg-intarno-cream/20 transition-colors group">
                      <td className="px-5 py-4 font-medium text-intarno-charcoal whitespace-nowrap">{inq.name}</td>
                      <td className="px-5 py-4 text-intarno-mid">
                        <a href={`mailto:${inq.email}`} className="hover:text-intarno-accent hover:underline">{inq.email}</a>
                      </td>
                      <td className="px-5 py-4"><TypeBadge type={inq.type} /></td>
                      <td className="px-5 py-4 text-intarno-mid whitespace-nowrap">{formatDate(inq.created_at)}</td>
                      <td className="px-5 py-4"><StatusBadge status={inq.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setSelectedInquiry(inq)} className="p-1.5 text-intarno-mid hover:text-intarno-accent hover:bg-intarno-cream rounded-sm" title="View">
                            <Eye size={15} />
                          </button>
                          <button onClick={() => deleteInquiry(inq.id)} className="p-1.5 text-intarno-mid hover:text-red-500 hover:bg-red-50 rounded-sm" title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          filteredSamples.length === 0 ? (
            <div className="text-center py-16 text-intarno-mid text-sm">
              {search ? 'No sample requests match your search.' : 'No sample requests yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-intarno-light/40 bg-intarno-cream/30">
                    <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-intarno-mid font-medium">Name</th>
                    <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-intarno-mid font-medium">Email</th>
                    <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-intarno-mid font-medium">City</th>
                    <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-intarno-mid font-medium">Swatches</th>
                    <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-intarno-mid font-medium">Date</th>
                    <th className="px-5 py-3 text-right text-xs uppercase tracking-widest text-intarno-mid font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-intarno-light/20">
                  {filteredSamples.map(s => (
                    <tr key={s.id} className="hover:bg-intarno-cream/20 transition-colors group">
                      <td className="px-5 py-4 font-medium text-intarno-charcoal">{s.name}</td>
                      <td className="px-5 py-4 text-intarno-mid">
                        <a href={`mailto:${s.email}`} className="hover:text-intarno-accent hover:underline">{s.email}</a>
                      </td>
                      <td className="px-5 py-4 text-intarno-mid">{s.city || '—'}</td>
                      <td className="px-5 py-4 text-intarno-mid">
                        {s.swatches?.length ? `${s.swatches.length} swatch${s.swatches.length !== 1 ? 'es' : ''}` : '—'}
                      </td>
                      <td className="px-5 py-4 text-intarno-mid whitespace-nowrap">{formatDate(s.created_at)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setSelectedSample(s)} className="p-1.5 text-intarno-mid hover:text-intarno-accent hover:bg-intarno-cream rounded-sm" title="View">
                            <Eye size={15} />
                          </button>
                          <button onClick={() => deleteSample(s.id)} className="p-1.5 text-intarno-mid hover:text-red-500 hover:bg-red-50 rounded-sm" title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {selectedInquiry && <Modal inquiry={selectedInquiry} onClose={() => setSelectedInquiry(null)} />}
      {selectedSample && <SampleModal sample={selectedSample} onClose={() => setSelectedSample(null)} />}
    </div>
  )
}
