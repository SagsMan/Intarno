import { useState, useEffect } from 'react'
  import { Package, Users, ShoppingCart, MessageSquare, TrendingUp, CheckCircle2, XCircle, Zap, ExternalLink } from 'lucide-react'
  import { supabase } from '../../lib/supabase'

  const META_PIXEL_ID = '1373383381316823'
  const GA4_ID = 'G-EF46XK8Y2X'

  interface DashboardStats {
    totalProducts: number
    totalInquiries: number
    totalSampleRequests: number
    recentInquiries: Array<{ id: number; name: string; service: string; created_at: string }>
    recentSamples: Array<{ id: number; name: string; city: string; created_at: string }>
  }

  function MetaPixelCard() {
    const [pixelLoaded, setPixelLoaded] = useState<boolean | null>(null)
    const [testFired, setTestFired] = useState(false)
    const [firing, setFiring] = useState(false)

    useEffect(() => {
      const check = () => setPixelLoaded(typeof (window as any).fbq === 'function')
      check()
      const t = setTimeout(check, 2000)
      return () => clearTimeout(t)
    }, [])

    const fireTestEvent = () => {
      setFiring(true)
      try {
        if (typeof (window as any).fbq === 'function') {
          ;(window as any).fbq('track', 'Lead', { content_name: 'Admin Test Event' })
          setTestFired(true)
        }
      } catch {}
      setTimeout(() => setFiring(false), 800)
    }

    const isActive = pixelLoaded === true

    return (
      <div className="bg-white border border-intarno-light/20 rounded-sm shadow-sm p-6 flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center bg-blue-50 rounded-sm shrink-0">
              <svg viewBox="0 0 24 24" fill="#1877F2" className="w-5 h-5">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-sm text-intarno-black">Meta Pixel</h3>
              <p className="text-[11px] text-intarno-mid font-mono mt-0.5">{META_PIXEL_ID}</p>
            </div>
          </div>
          {pixelLoaded === null ? (
            <span className="text-xs text-intarno-mid px-2.5 py-1 bg-intarno-cream rounded-full">Checking…</span>
          ) : isActive ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
              <CheckCircle2 size={11} /> Active
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2.5 py-1 rounded-full font-medium">
              <XCircle size={11} /> Not detected
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: 'Script', value: pixelLoaded === null ? '…' : isActive ? 'Loaded ✓' : 'Missing ✗', ok: isActive },
            { label: 'PageView', value: isActive ? 'Firing ✓' : '—', ok: isActive },
            { label: 'Test Event', value: testFired ? 'Sent ✓' : 'Not sent', ok: testFired },
          ].map(s => (
            <div key={s.label} className="bg-intarno-cream p-2.5 text-center rounded-sm">
              <p className="text-[9px] uppercase tracking-wider text-intarno-mid mb-1">{s.label}</p>
              <p className={`text-[11px] font-medium ${s.ok ? 'text-emerald-600' : 'text-intarno-mid'}`}>{s.value}</p>
            </div>
          ))}
        </div>
        {testFired && (
          <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs p-3 rounded-sm mb-4">
            <CheckCircle2 size={13} className="shrink-0 mt-0.5" />
            <span><strong>Lead</strong> event sent. Check Events Manager → Test Events (~1 min).</span>
          </div>
        )}
        <div className="flex gap-2 mt-auto">
          <button onClick={fireTestEvent} disabled={!isActive || firing}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1877F2] text-white text-xs font-medium rounded-sm hover:bg-[#166fe5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Zap size={12} />
            {firing ? 'Firing…' : testFired ? 'Fire Again' : 'Fire Test Event'}
          </button>
          <a href={`https://business.facebook.com/events_manager2/list/pixel/${META_PIXEL_ID}/overview`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 border border-intarno-light text-intarno-mid text-xs font-medium rounded-sm hover:border-intarno-black hover:text-intarno-black transition-colors">
            <ExternalLink size={12} />
            Events Manager
          </a>
        </div>
      </div>
    )
  }

  function GA4Card() {
    const [gaLoaded, setGaLoaded] = useState<boolean | null>(null)
    const [testFired, setTestFired] = useState(false)
    const [firing, setFiring] = useState(false)

    useEffect(() => {
      const check = () => setGaLoaded(typeof (window as any).gtag === 'function')
      check()
      const t = setTimeout(check, 2000)
      return () => clearTimeout(t)
    }, [])

    const fireTestEvent = () => {
      setFiring(true)
      try {
        if (typeof (window as any).gtag === 'function') {
          ;(window as any).gtag('event', 'admin_test', { event_category: 'Admin', event_label: 'Dashboard Test' })
          setTestFired(true)
        }
      } catch {}
      setTimeout(() => setFiring(false), 800)
    }

    const isActive = gaLoaded === true

    return (
      <div className="bg-white border border-intarno-light/20 rounded-sm shadow-sm p-6 flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center bg-orange-50 rounded-sm shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#F9AB00"/>
                <path d="M12 2v20C6.48 22 2 17.52 2 12S6.48 2 12 2z" fill="#E37400"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-sm text-intarno-black">Google Analytics 4</h3>
              <p className="text-[11px] text-intarno-mid font-mono mt-0.5">{GA4_ID}</p>
            </div>
          </div>
          {gaLoaded === null ? (
            <span className="text-xs text-intarno-mid px-2.5 py-1 bg-intarno-cream rounded-full">Checking…</span>
          ) : isActive ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
              <CheckCircle2 size={11} /> Active
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2.5 py-1 rounded-full font-medium">
              <XCircle size={11} /> Not detected
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: 'gtag.js', value: gaLoaded === null ? '…' : isActive ? 'Loaded ✓' : 'Missing ✗', ok: isActive },
            { label: 'PageView', value: isActive ? 'Firing ✓' : '—', ok: isActive },
            { label: 'Test Event', value: testFired ? 'Sent ✓' : 'Not sent', ok: testFired },
          ].map(s => (
            <div key={s.label} className="bg-intarno-cream p-2.5 text-center rounded-sm">
              <p className="text-[9px] uppercase tracking-wider text-intarno-mid mb-1">{s.label}</p>
              <p className={`text-[11px] font-medium ${s.ok ? 'text-emerald-600' : 'text-intarno-mid'}`}>{s.value}</p>
            </div>
          ))}
        </div>
        {testFired && (
          <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs p-3 rounded-sm mb-4">
            <CheckCircle2 size={13} className="shrink-0 mt-0.5" />
            <span><strong>admin_test</strong> event sent. Check GA4 → Realtime to confirm.</span>
          </div>
        )}
        <div className="flex gap-2 mt-auto">
          <button onClick={fireTestEvent} disabled={!isActive || firing}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#E37400] text-white text-xs font-medium rounded-sm hover:bg-[#c96800] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Zap size={12} />
            {firing ? 'Firing…' : testFired ? 'Fire Again' : 'Fire Test Event'}
          </button>
          <a href="https://analytics.google.com/analytics/web/#/realtime"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 border border-intarno-light text-intarno-mid text-xs font-medium rounded-sm hover:border-intarno-black hover:text-intarno-black transition-colors">
            <ExternalLink size={12} />
            GA4 Realtime
          </a>
        </div>
      </div>
    )
  }

  export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
      async function load() {
        try {
          const [inquiryCountRes, productCountRes, sampleCountRes, recentInquiriesRes, recentSamplesRes] = await Promise.all([
            supabase.from('inquiries').select('*', { count: 'exact', head: true }),
            supabase.from('products').select('*', { count: 'exact', head: true }),
            supabase.from('sample_requests').select('*', { count: 'exact', head: true }),
            supabase.from('inquiries').select('id, name, service, created_at').order('created_at', { ascending: false }).limit(5),
            supabase.from('sample_requests').select('id, name, city, created_at').order('created_at', { ascending: false }).limit(5),
          ])
          setStats({
            totalProducts: productCountRes.count ?? 0,
            totalInquiries: inquiryCountRes.count ?? 0,
            totalSampleRequests: sampleCountRes.count ?? 0,
            recentInquiries: recentInquiriesRes.data ?? [],
            recentSamples: recentSamplesRes.data ?? [],
          })
        } catch {
          setError(true)
        } finally {
          setIsLoading(false)
        }
      }
      load()
    }, [])

    if (isLoading) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-intarno-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )
    }

    if (error || !stats) {
      return (
        <div className="bg-red-50 text-red-600 p-6 rounded-sm border border-red-100 text-sm">
          Failed to load dashboard. Check your Supabase configuration.
        </div>
      )
    }

    const statCards = [
      { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-intarno-accent', bg: 'bg-intarno-accent/10' },
      { title: 'Inquiries', value: stats.totalInquiries, icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50' },
      { title: 'Sample Requests', value: stats.totalSampleRequests, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
      { title: 'Total Leads', value: stats.totalInquiries + stats.totalSampleRequests, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
      { title: 'Revenue', value: '—', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ]

    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })

    return (
      <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white p-6 border border-intarno-light/20 rounded-sm shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-sm ${stat.bg} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <h3 className="text-xs font-medium tracking-wider uppercase text-intarno-mid">{stat.title}</h3>
              </div>
              <p className="text-2xl font-display text-intarno-black">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-intarno-light/20 rounded-sm shadow-sm flex flex-col">
            <div className="p-5 border-b border-intarno-light/20">
              <h3 className="font-display text-lg">Recent Inquiries</h3>
            </div>
            <div className="flex-1">
              {stats.recentInquiries.length > 0 ? (
                <table className="w-full text-sm text-left">
                  <thead className="bg-intarno-cream text-intarno-mid text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-5 py-3 font-medium">Service</th>
                      <th className="px-5 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-intarno-light/10">
                    {stats.recentInquiries.map(inq => (
                      <tr key={inq.id} className="hover:bg-intarno-cream/50 transition-colors">
                        <td className="px-5 py-4 font-medium text-intarno-charcoal truncate max-w-[140px]">{inq.name}</td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 bg-intarno-cream text-intarno-mid border border-intarno-light/30 text-[10px] uppercase tracking-wider rounded-full">
                            {inq.service}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-intarno-mid text-xs">{formatDate(inq.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-intarno-mid text-sm">No inquiries yet.</div>
              )}
            </div>
          </div>

          <div className="bg-white border border-intarno-light/20 rounded-sm shadow-sm flex flex-col">
            <div className="p-5 border-b border-intarno-light/20">
              <h3 className="font-display text-lg">Recent Sample Requests</h3>
            </div>
            <div className="flex-1">
              {stats.recentSamples.length > 0 ? (
                <table className="w-full text-sm text-left">
                  <thead className="bg-intarno-cream text-intarno-mid text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-5 py-3 font-medium">City</th>
                      <th className="px-5 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-intarno-light/10">
                    {stats.recentSamples.map(s => (
                      <tr key={s.id} className="hover:bg-intarno-cream/50 transition-colors">
                        <td className="px-5 py-4 font-medium text-intarno-charcoal truncate max-w-[140px]">{s.name}</td>
                        <td className="px-5 py-4 text-intarno-mid text-xs">{s.city || '—'}</td>
                        <td className="px-5 py-4 text-intarno-mid text-xs">{formatDate(s.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-intarno-mid text-sm">No sample requests yet.</div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-medium tracking-wider uppercase text-intarno-mid mb-4">Tracking & Analytics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GA4Card />
            <MetaPixelCard />
          </div>
        </div>
      </div>
    )
  }
  