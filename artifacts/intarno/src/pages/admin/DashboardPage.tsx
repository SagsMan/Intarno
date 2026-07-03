import { useGetDashboardStats } from '@workspace/api-client-react'
import { Package, Users, ShoppingCart, MessageSquare, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useGetDashboardStats()

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-intarno-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-sm border border-red-100">
        Failed to load dashboard statistics.
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(value)
  }

  const statCards = [
    { title: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-intarno-accent', bg: 'bg-intarno-accent/10' },
    { title: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Total Inquiries', value: stats.totalInquiries, icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase()
    if (s === 'pending') return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (s === 'confirmed') return 'bg-blue-100 text-blue-800 border-blue-200'
    if (s === 'processing') return 'bg-orange-100 text-orange-800 border-orange-200'
    if (s === 'shipped') return 'bg-purple-100 text-purple-800 border-purple-200'
    if (s === 'delivered') return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

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
        {/* Recent Orders */}
        <div className="bg-white border border-intarno-light/20 rounded-sm shadow-sm flex flex-col">
          <div className="p-5 border-b border-intarno-light/20 flex justify-between items-center">
            <h3 className="font-display text-lg">Recent Orders</h3>
          </div>
          <div className="p-0 flex-1">
            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-intarno-cream text-intarno-mid text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 font-medium">Order ID</th>
                    <th className="px-5 py-3 font-medium">Total</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-intarno-light/10">
                  {stats.recentOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-intarno-cream/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-intarno-charcoal">#{order.id}</td>
                      <td className="px-5 py-4 text-intarno-mid">{formatCurrency(order.totalAmount)}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider border rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-intarno-mid text-sm">No recent orders found.</div>
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white border border-intarno-light/20 rounded-sm shadow-sm flex flex-col">
          <div className="p-5 border-b border-intarno-light/20 flex justify-between items-center">
            <h3 className="font-display text-lg">Recent Inquiries</h3>
          </div>
          <div className="p-0 flex-1">
            {stats.recentInquiries && stats.recentInquiries.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-intarno-cream text-intarno-mid text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Type</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-intarno-light/10">
                  {stats.recentInquiries.map((inq: any) => (
                    <tr key={inq.id} className="hover:bg-intarno-cream/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-intarno-charcoal truncate max-w-[150px]">{inq.name}</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 bg-intarno-cream text-intarno-mid border border-intarno-light/30 text-[10px] uppercase tracking-wider rounded-full">
                          {inq.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-intarno-mid text-xs">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-intarno-mid text-sm">No recent inquiries found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
