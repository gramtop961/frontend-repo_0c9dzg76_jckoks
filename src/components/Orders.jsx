import { useEffect, useState } from 'react'

export default function Orders(){
  const backend = import.meta.env.VITE_BACKEND_URL
  const [orders, setOrders] = useState([])
  const [creating, setCreating] = useState(false)

  async function load(){
    const res = await fetch(`${backend}/orders`)
    const data = await res.json()
    setOrders(data)
  }

  useEffect(()=>{ load() },[])

  async function createDummyOrder(){
    setCreating(true)
    try{
      const res = await fetch(`${backend}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: 'John Customer',
          customer_email: 'john@example.com',
          items: [
            { book_id: '0', title: 'Sample Book', price: 10, quantity: 2 }
          ],
          notes: 'Test order'
        })
      })
      const data = await res.json()
      setOrders([data, ...orders])
    } finally { setCreating(false) }
  }

  async function updateStatus(id, status){
    const res = await fetch(`${backend}/orders/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    const data = await res.json()
    setOrders(orders.map(o=> o.id===id? data : o))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-white text-lg font-semibold">Orders</h3>
        <button onClick={createDummyOrder} disabled={creating} className="bg-blue-600 text-white px-3 py-1 rounded-md">{creating? 'Creating...' : 'Create Sample Order'}</button>
      </div>
      <div className="grid gap-3">
        {orders.map(o=> (
          <div key={o.id} className="bg-slate-800/60 p-4 rounded-xl border border-blue-500/20">
            <div className="flex justify-between">
              <div>
                <div className="text-white font-medium">{o.customer_name}</div>
                <div className="text-blue-300 text-sm">{o.customer_email} • ${o.total_amount} • {o.items?.length} items</div>
              </div>
              <div className="text-blue-300">{o.status}</div>
            </div>
            <div className="mt-3 flex gap-2">
              {['pending','processing','shipped','delivered','cancelled'].map(s=> (
                <button key={s} onClick={()=>updateStatus(o.id, s)} className={`px-3 py-1 rounded-md ${o.status===s? 'bg-blue-600 text-white' : 'bg-slate-700 text-blue-100'}`}>{s}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
