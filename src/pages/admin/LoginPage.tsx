import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { loginAdmin } from '../../services/authService'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const data = await loginAdmin(email, password)
      if (data) {
        login(data.token, data.admin)
        navigate('/admin/dashboard')
      } else {
        setError('Invalid credentials')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-intarno-black text-intarno-white p-4">
      <div className="w-full max-w-md bg-intarno-charcoal p-10 rounded-sm shadow-2xl border border-white/5">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl tracking-widest text-intarno-accent mb-2">INTARNO</h1>
          <p className="text-intarno-light text-sm tracking-widest uppercase">Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium tracking-[0.2em] uppercase text-intarno-light mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-intarno-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-intarno-accent transition-colors text-white"
              placeholder="admin@intarno.com"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium tracking-[0.2em] uppercase text-intarno-light mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-intarno-black border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-intarno-accent transition-colors text-white"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-400/10 py-2 border border-red-400/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-intarno-accent text-intarno-black font-medium text-sm tracking-widest uppercase py-3.5 hover:bg-white transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
