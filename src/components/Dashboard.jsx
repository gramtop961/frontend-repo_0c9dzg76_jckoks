import { useEffect, useState } from 'react'

function StatCard({ label, value }){
  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
      <div className="text-blue-300 text-sm">{label}</div>
      <div className="text-white text-2xl font-semibold">{value}</div>
    </div>
  )
}

export default function Dashboard({ token }){
  const backend = import.meta.env.VITE_BACKEND_URL
  const [stats, setStats] = useState(null)

  useEffect(()=>{
    async function fetchStats(){
      const res = await fetch(`${backend}/admin/stats`)
      const data = await res.json()
      setStats(data)
    }
    fetchStats()
  },[backend])

  if(!stats){
    return <div className="text-blue-200">Loading dashboard...</div>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="Total Books" value={stats.total_books} />
      <StatCard label="Total Orders" value={stats.total_orders} />
      <StatCard label="Pending Orders" value={stats.pending_orders} />
      <StatCard label="Revenue" value={`$${stats.revenue.toFixed(2)}`} />
    </div>
  )
}
