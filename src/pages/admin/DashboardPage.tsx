import { useState, useEffect } from 'react'
import { Package, Users, ShoppingCart, MessageSquare, TrendingUp } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface DashboardStats {
  totalProducts: number
  totalInquiries: number
  totalSampleRequests: number
  recentInquiries: Array<{ id: number; name: string; service: string; created_at: string }>
  recentSamples: Array<{ id: number; name: string; city: string; created_at: string }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [inquiryCountRes, sampleCountRes, recentInquiriesRes, recentSamplesRes] = await Promise.all([
          supabase.from('inquiries').select('*', { count: 'exact', head: true }),
          supabase.from('sample_requests').select('*', { count: 'exact', head: true }),
          supabase.from('inquiries').select('id, name, service, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('sample_requests').select('id, name, city, created_at').order('created_at', { ascending: false }).limit(5),
        ])

        setStats({
          totalProducts: 24,
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
        {/* Recent Inquiries */}
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

        {/* Recent Sample Requests */}
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
    </div>
  )
}
