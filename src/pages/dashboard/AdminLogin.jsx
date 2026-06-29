import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext' 
import api from '../../api/axios' // Importation de ton instance Axios connectée à Laravel

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // 1. On interroge le vrai backend Laravel de la marketplace BeniMarket
      const response = await api.post('/login', {
        identifier: email.trim(),
        password: password
      })

      const { user, access_token } = response.data

      // 2. Vérification stricte du rôle retourné par MySQL
      if (user && user.role === 'admin') {
        // Enregistrement de l'objet complet dans le Contexte Global Sanctum
        login(user, access_token)
        
        // Propulsion instantanée sur le Dashboard Admin
        navigate('/admin')
      } else {
        setError("Accès refusé. Cet espace est strictement réservé aux administrateurs.")
      }

    } catch (err) {
      console.error(err)
      const message = err.response?.data?.message
      if (message) {
        setError(message)
      } else {
        setError("Impossible de joindre le serveur d'authentification de BeniMarket.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-ink-900 via-ink-900 to-teal-900 px-4 py-12">
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="relative w-full max-w-md rounded-3xl border-t-4 border-teal-600 bg-white p-8 shadow-2xl ring-1 ring-ink-900/5">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-soft">
            <ShieldCheck size={28} />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Console d’administration</h1>
          <p className="text-sm text-ink-500 mt-1">Veuillez vous authentifier pour accéder à la plateforme BeniMarket</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-200">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-xs font-semibold uppercase tracking-wide text-ink-600 mb-1.5">
              Adresse e-mail de confiance
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                id="admin-email"
                type="email"
                className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-10 pr-4 text-sm text-ink-900 placeholder-ink-400 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                placeholder="admin@benimarket.bj"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-pwd" className="block text-xs font-semibold uppercase tracking-wide text-ink-600 mb-1.5">
              Clé de sécurité (Mot de passe)
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                id="admin-pwd"
                type={showPwd ? 'text' : 'password'}
                className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-10 pr-11 text-sm text-ink-900 placeholder-ink-400 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-ink-400 hover:bg-ink-100"
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 py-3 text-sm font-semibold text-white shadow-soft transition hover:shadow-glow hover:brightness-110 disabled:opacity-50"
          >
            {isSubmitting ? 'Vérification de la clé...' : 'Se connecter à la console'}
          </button>
        </form>
      </div>
    </div>
  )
}