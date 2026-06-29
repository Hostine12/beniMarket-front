import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle2, AlertTriangle } from 'lucide-react'
import api from '../api/axios'
import Logo from '../components/ui/Logo'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get('token') || ''
  const uid   = searchParams.get('uid')   || ''

  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPwd,         setShowPwd]         = useState(false)
  const [loading,         setLoading]         = useState(false)
  const [success,         setSuccess]         = useState(false)
  const [error,           setError]           = useState('')

  if (!token || !uid) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-ink-900 mb-2">Lien invalide</h2>
          <p className="text-ink-500 mb-4">Ce lien de réinitialisation est invalide ou expiré.</p>
          <Link to="/connexion" className="btn-primary">Retour à la connexion</Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    setLoading(true)
    try {
      await api.post('/password/reset', {
        uid,
        token,
        new_password:              newPassword,
        new_password_confirmation: confirmPassword,
      })
      setSuccess(true)
      setTimeout(() => navigate('/connexion'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Lien invalide ou expiré.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-50 px-4 py-10">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-teal-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl" />
      <div className="relative w-full max-w-md card p-8 shadow-card">
        <div className="mb-6 text-center">
          <Logo className="mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-ink-900">
            Nouveau mot de passe
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Choisissez un mot de passe sécurisé d'au moins 8 caractères.
          </p>
        </div>

        {success ? (
          <div className="text-center py-6">
            <CheckCircle2 size={48} className="mx-auto text-teal-600 mb-4" />
            <p className="font-semibold text-ink-900 mb-1">Mot de passe mis à jour !</p>
            <p className="text-sm text-ink-500">Redirection vers la connexion…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <AlertTriangle size={16} />
                {error}
              </div>
            )}

            <div>
              <label className="label">Nouveau mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="input pl-9 pr-10 w-full"
                  placeholder="8 caractères minimum"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="input pl-9 w-full"
                  placeholder="Répétez le mot de passe"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 transition hover:brightness-110 disabled:opacity-50"
            >
              {loading ? 'Mise à jour…' : 'Définir le nouveau mot de passe'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
