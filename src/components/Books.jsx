import { useEffect, useState } from 'react'

export default function Books(){
  const backend = import.meta.env.VITE_BACKEND_URL
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title: '', author: '', price: 0, stock: 0 })
  const [loading, setLoading] = useState(false)

  async function load(){
    const res = await fetch(`${backend}/books`)
    const data = await res.json()
    setItems(data)
  }

  useEffect(()=>{ load() },[])

  async function addBook(e){
    e.preventDefault()
    setLoading(true)
    try{
      const res = await fetch(`${backend}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      setItems([data, ...items])
      setForm({ title: '', author: '', price: 0, stock: 0 })
    } finally{ setLoading(false) }
  }

  async function updateBook(id, patch){
    const res = await fetch(`${backend}/books/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) })
    const data = await res.json()
    setItems(items.map(i=> i.id===id? data : i))
  }

  async function removeBook(id){
    await fetch(`${backend}/books/${id}`, { method: 'DELETE' })
    setItems(items.filter(i=> i.id!==id))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={addBook} className="grid grid-cols-1 md:grid-cols-5 gap-2 bg-slate-800/60 p-4 rounded-xl border border-blue-500/20">
        <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" className="px-3 py-2 rounded-md bg-slate-900/60 text-white border border-slate-700" />
        <input value={form.author} onChange={e=>setForm({...form,author:e.target.value})} placeholder="Author" className="px-3 py-2 rounded-md bg-slate-900/60 text-white border border-slate-700" />
        <input type="number" value={form.price} onChange={e=>setForm({...form,price:parseFloat(e.target.value)})} placeholder="Price" className="px-3 py-2 rounded-md bg-slate-900/60 text-white border border-slate-700" />
        <input type="number" value={form.stock} onChange={e=>setForm({...form,stock:parseInt(e.target.value||'0')})} placeholder="Stock" className="px-3 py-2 rounded-md bg-slate-900/60 text-white border border-slate-700" />
        <button disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white rounded-md">{loading? 'Adding...' : 'Add Book'}</button>
      </form>

      <div className="grid gap-3">
        {items.map(b=> (
          <div key={b.id} className="bg-slate-800/60 p-4 rounded-xl border border-blue-500/20 flex items-center justify-between">
            <div>
              <div className="text-white font-medium">{b.title}</div>
              <div className="text-blue-300 text-sm">{b.author} • ${b.price} • Stock {b.stock}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>updateBook(b.id, { stock: (b.stock||0)+1 })} className="px-3 py-1 bg-slate-700 text-white rounded-md">+ Stock</button>
              <button onClick={()=>removeBook(b.id)} className="px-3 py-1 bg-red-600 text-white rounded-md">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
