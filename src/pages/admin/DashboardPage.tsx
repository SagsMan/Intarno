import { useState, useEffect, useCallback } from 'react'
  import { Package, Users, ShoppingCart, MessageSquare, TrendingUp, RefreshCw, Eye } from 'lucide-react'
  import { supabase } from '../../lib/supabase'

  const META_PIXEL_ID = '1373383381316823'
  const GA4_ID = 'G-EF46XK8Y2X'

  type Period = 'today' | '7d' | '30d' | '12m'

  interface Stats {
    totalProducts: number
    totalInquiries: number
    totalSampleRequests: number
    recentInquiries: Array<{ id: number; name: string; service: string; created_at: string }>
    recentSamples: Array<{ id: number; name: string; city: string; created_at: string }>
  }

  interface PageViewBucket { label: string; count: number }
  interface TopPage { path: string; count: number }

  function getPeriodStart(period: Period): string {
    const now = new Date()
    if (period === 'today') {
      const d = new Date(now); d.setHours(0,0,0,0); return d.toISOString()
    }
    if (period === '7d') { const d = new Date(now); d.setDate(d.getDate()-7); return d.toISOString() }
    if (period === '30d') { const d = new Date(now); d.setDate(d.getDate()-30); return d.toISOString() }
    const d = new Date(now); d.setFullYear(d.getFullYear()-1); return d.toISOString()
  }

  function AnalyticsSection() {
    const [period, setPeriod] = useState<Period>('7d')
    const [buckets, setBuckets] = useState<PageViewBucket[]>([])
    const [topPages, setTopPages] = useState<TopPage[]>([])
    const [totalViews, setTotalViews] = useState(0)
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

    const load = useCallback(async () => {
      setLoading(true)
      const since = getPeriodStart(period)

      // Total views
      const { count } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', since)
      setTotalViews(count ?? 0)

      // All rows for bucketing
      const { data: rows } = await supabase
        .from('page_views')
        .select('created_at, path')
        .gte('created_at', since)
        .order('created_at', { ascending: true })

      const all = rows ?? []

      // Build time buckets
      const bucketMap = new Map<string, number>()
      const now = new Date()

      if (period === 'today') {
        // Hourly buckets
        for (let h = 0; h < 24; h++) {
          const label = h === 0 ? '12am' : h < 12 ? h + 'am' : h === 12 ? '12pm' : (h-12) + 'pm'
          bucketMap.set(label, 0)
        }
        all.forEach(r => {
          const h = new Date(r.created_at).getHours()
          const label = h === 0 ? '12am' : h < 12 ? h + 'am' : h === 12 ? '12pm' : (h-12) + 'pm'
          bucketMap.set(label, (bucketMap.get(label) ?? 0) + 1)
        })
      } else if (period === '7d') {
        // Daily buckets
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now); d.setDate(d.getDate() - i)
          const label = d.toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric' })
          bucketMap.set(label, 0)
        }
        all.forEach(r => {
          const d = new Date(r.created_at)
          const label = d.toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric' })
          if (bucketMap.has(label)) bucketMap.set(label, (bucketMap.get(label) ?? 0) + 1)
        })
      } else if (period === '30d') {
        // Weekly buckets
        for (let i = 3; i >= 0; i--) {
          const d = new Date(now); d.setDate(d.getDate() - i * 7)
          const label = 'Wk ' + d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
          bucketMap.set(label, 0)
        }
        all.forEach(r => {
          const d = new Date(r.created_at)
          const weekAgo = Math.floor((now.getTime() - d.getTime()) / (7 * 86400000))
          const base = new Date(now); base.setDate(base.getDate() - weekAgo * 7)
          const label = 'Wk ' + base.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
          if (bucketMap.has(label)) bucketMap.set(label, (bucketMap.get(label) ?? 0) + 1)
        })
      } else {
        // Monthly buckets for 12m
        for (let i = 11; i >= 0; i--) {
          const d = new Date(now); d.setMonth(d.getMonth() - i)
          const label = d.toLocaleDateString('en-NG', { month: 'short', year: '2-digit' })
          bucketMap.set(label, 0)
        }
        all.forEach(r => {
          const d = new Date(r.created_at)
          const label = d.toLocaleDateString('en-NG', { month: 'short', year: '2-digit' })
          if (bucketMap.has(label)) bucketMap.set(label, (bucketMap.get(label) ?? 0) + 1)
        })
      }

      setBuckets(Array.from(bucketMap.entries()).map(([label, count]) => ({ label, count })))

      // Top pages
      const pathCount = new Map<string, number>()
      all.forEach(r => pathCount.set(r.path, (pathCount.get(r.path) ?? 0) + 1))
      const sorted = Array.from(pathCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([path, count]) => ({ path, count }))
      setTopPages(sorted)

      setLastUpdated(new Date())
      setLoading(false)
    }, [period])

    useEffect(() => { load() }, [load])

    // Auto-refresh every 60 seconds
    useEffect(() => {
      const t = setInterval(load, 60000)
      return () => clearInterval(t)
    }, [load])

    const maxCount = Math.max(...buckets.map(b => b.count), 1)
    const periods: { key: Period; label: string }[] = [
      { key: 'today', label: 'Today' },
      { key: '7d', label: '7 Days' },
      { key: '30d', label: '30 Days' },
      { key: '12m', label: '12 Months' },
    ]

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium tracking-wider uppercase text-intarno-mid">Site Analytics</h3>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-[10px] text-intarno-light">
                Updated {lastUpdated.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button onClick={load} disabled={loading}
              className="flex items-center gap-1.5 text-xs text-intarno-mid hover:text-intarno-black transition-colors disabled:opacity-40">
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Page view chart */}
          <div className="lg:col-span-2 bg-white border border-intarno-light/20 rounded-sm shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Eye size={14} className="text-intarno-accent" />
                  <span className="text-xs font-medium uppercase tracking-wider text-intarno-mid">Page Views</span>
                </div>
                <p className="text-3xl font-display text-intarno-black">
                  {loading ? <span className="text-intarno-light text-xl">—</span> : totalViews.toLocaleString()}
                </p>
              </div>
              <div className="flex gap-1">
                {periods.map(p => (
                  <button key={p.key} onClick={() => setPeriod(p.key)}
                    className={`px-3 py-1.5 text-[11px] font-medium rounded-sm transition-colors ${period === p.key ? 'bg-intarno-black text-white' : 'text-intarno-mid hover:bg-intarno-cream'}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="h-32 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-intarno-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : totalViews === 0 ? (
              <div className="h-32 flex flex-col items-center justify-center text-intarno-light text-sm gap-2">
                <Eye size={20} />
                <span>No visits recorded yet — data appears as users browse the site</span>
              </div>
            ) : (
              <div className="flex items-end gap-1 h-32">
                {buckets.map((b, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                    <div className="w-full relative" style={{ height: '100px' }}>
                      <div
                        className="absolute bottom-0 w-full bg-intarno-accent/80 hover:bg-intarno-accent transition-all rounded-t-sm"
                        style={{ height: `${Math.max((b.count / maxCount) * 100, b.count > 0 ? 4 : 0)}%` }}
                        title={`${b.label}: ${b.count} views`}
                      />
                    </div>
                    {buckets.length <= 12 && (
                      <span className="text-[8px] text-intarno-light truncate w-full text-center">{b.label}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top pages */}
          <div className="bg-white border border-intarno-light/20 rounded-sm shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={14} className="text-intarno-accent" />
              <span className="text-xs font-medium uppercase tracking-wider text-intarno-mid">Top Pages</span>
            </div>
            {loading ? (
              <div className="space-y-3">{[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-intarno-cream rounded animate-pulse" />
              ))}</div>
            ) : topPages.length === 0 ? (
              <p className="text-sm text-intarno-light text-center py-4">No data yet</p>
            ) : (
              <div className="space-y-3">
                {topPages.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[10px] text-intarno-light w-4 shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-intarno-black truncate max-w-[120px]">{p.path || '/'}</span>
                        <span className="text-xs text-intarno-mid font-medium ml-1 shrink-0">{p.count}</span>
                      </div>
                      <div className="h-1 bg-intarno-cream rounded-full overflow-hidden">
                        <div className="h-full bg-intarno-accent/60 rounded-full"
                          style={{ width: `${(p.count / (topPages[0]?.count || 1)) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tracking IDs row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-intarno-light/20 rounded-sm p-4 flex items-center gap-4">
            <div className="w-8 h-8 flex items-center justify-center bg-orange-50 rounded-sm shrink-0">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#F9AB00"/>
                <path d="M12 2v20C6.48 22 2 17.52 2 12S6.48 2 12 2z" fill="#E37400"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-intarno-black">Google Analytics 4</p>
              <p className="text-[11px] text-intarno-mid font-mono">{GA4_ID}</p>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Active
            </span>
            <a href="https://analytics.google.com/analytics/web/#/realtime" target="_blank" rel="noopener noreferrer"
              className="text-[11px] text-intarno-mid hover:text-intarno-black underline shrink-0">Open ↗</a>
          </div>
          <div className="bg-white border border-intarno-light/20 rounded-sm p-4 flex items-center gap-4">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-50 rounded-sm shrink-0">
              <svg viewBox="0 0 24 24" fill="#1877F2" className="w-4 h-4">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-intarno-black">Meta Pixel</p>
              <p className="text-[11px] text-intarno-mid font-mono">{META_PIXEL_ID}</p>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Active
            </span>
            <a href={`https://business.facebook.com/events_manager2/list/pixel/${META_PIXEL_ID}/overview`} target="_blank" rel="noopener noreferrer"
              className="text-[11px] text-intarno-mid hover:text-intarno-black underline shrink-0">Open ↗</a>
          </div>
        </div>
      </div>
    )
  }

  export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null)
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
        } catch { setError(true) }
        finally { setIsLoading(false) }
      }
      load()
    }, [])

    if (isLoading) return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-intarno-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )

    if (error || !stats) return (
      <div className="bg-red-50 text-red-600 p-6 rounded-sm border border-red-100 text-sm">
        Failed to load dashboard. Check your Supabase configuration.
      </div>
    )

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
                <div className={`p-3 rounded-sm ${stat.bg} ${stat.color}`}><stat.icon size={20} /></div>
                <h3 className="text-xs font-medium tracking-wider uppercase text-intarno-mid">{stat.title}</h3>
              </div>
              <p className="text-2xl font-display text-intarno-black">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-intarno-light/20 rounded-sm shadow-sm flex flex-col">
            <div className="p-5 border-b border-intarno-light/20"><h3 className="font-display text-lg">Recent Inquiries</h3></div>
            <div className="flex-1">
              {stats.recentInquiries.length > 0 ? (
                <table className="w-full text-sm text-left">
                  <thead className="bg-intarno-cream text-intarno-mid text-xs uppercase tracking-wider">
                    <tr><th className="px-5 py-3 font-medium">Name</th><th className="px-5 py-3 font-medium">Service</th><th className="px-5 py-3 font-medium">Date</th></tr>
                  </thead>
                  <tbody className="divide-y divide-intarno-light/10">
                    {stats.recentInquiries.map(inq => (
                      <tr key={inq.id} className="hover:bg-intarno-cream/50 transition-colors">
                        <td className="px-5 py-4 font-medium text-intarno-charcoal truncate max-w-[140px]">{inq.name}</td>
                        <td className="px-5 py-4"><span className="px-2.5 py-1 bg-intarno-cream text-intarno-mid border border-intarno-light/30 text-[10px] uppercase tracking-wider rounded-full">{inq.service}</span></td>
                        <td className="px-5 py-4 text-intarno-mid text-xs">{formatDate(inq.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <div className="p-8 text-center text-intarno-mid text-sm">No inquiries yet.</div>}
            </div>
          </div>

          <div className="bg-white border border-intarno-light/20 rounded-sm shadow-sm flex flex-col">
            <div className="p-5 border-b border-intarno-light/20"><h3 className="font-display text-lg">Recent Sample Requests</h3></div>
            <div className="flex-1">
              {stats.recentSamples.length > 0 ? (
                <table className="w-full text-sm text-left">
                  <thead className="bg-intarno-cream text-intarno-mid text-xs uppercase tracking-wider">
                    <tr><th className="px-5 py-3 font-medium">Name</th><th className="px-5 py-3 font-medium">City</th><th className="px-5 py-3 font-medium">Date</th></tr>
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
              ) : <div className="p-8 text-center text-intarno-mid text-sm">No sample requests yet.</div>}
            </div>
          </div>
        </div>

        <AnalyticsSection />
      </div>
    )
  }
  