import { useState } from 'react'
import AdminLogin from './components/AdminLogin'
import Dashboard from './components/Dashboard'
import Books from './components/Books'
import Orders from './components/Orders'

function App() {
  const [session, setSession] = useState(null)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-6">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" className="w-10 h-10" />
            <h1 className="text-white text-2xl font-bold">Bookstore Admin</h1>
          </div>
          {session && (
            <div className="flex items-center gap-3 text-blue-200">
              <span>{session.profile.name} • {session.profile.role}</span>
              <button className="bg-slate-700 text-white px-3 py-1 rounded-md" onClick={()=>setSession(null)}>Logout</button>
            </div>
          )}
        </header>

        {!session ? (
          <div className="flex items-center justify-center mt-16">
            <AdminLogin onLoggedIn={setSession} />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-8">
            <Dashboard token={session.token} />
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-white text-xl font-semibold mb-3">Books</h2>
                <Books />
              </div>
              <div>
                <Orders />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App