import { useState, useRef } from 'react'
import { Camera, Save, KeyRound } from 'lucide-react'
import Avatar from '../ui/Avatar'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { validateBeninPhone, formatPhoneInput, getPhoneError } from '../../utils/format'

/**
 * Édition du profil personnel — partagé par tous les rôles (client, vendeur,
 * livreur, administrateur). Gère les informations de base, la photo de profil
 * et le changement de mot de passe.
 */
export default function ProfileSettings() {
  const { user, updateUser } = useAuth()
  const toast = useToast()
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || null,
    zone: user?.zone || '',
    vehicle_type: user?.vehicle_type || '',
    plate_number: user?.plate_number || '',
  })
  const [savingProfile, setSavingProfile] = useState(false)
  // Garder une référence du téléphone original pour ne valider que les numéros modifiés
  const originalPhone = user?.phone || ''

  const [pwd, setPwd] = useState({ current_password: '', new_password: '', new_password_confirmation: '' })
  const [savingPwd, setSavingPwd] = useState(false)

  const onAvatar = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Image trop lourde (max 2 Mo).'); return }
    const reader = new FileReader()
    reader.onload = ev => setForm(f => ({ ...f, avatar: ev.target.result }))
    reader.readAsDataURL(file)
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    // Valider le téléphone uniquement si modifié (les anciens numéros en base restent valides)
    if (form.phone && form.phone !== originalPhone && !validateBeninPhone(form.phone)) {
      toast.error('Le numéro de téléphone doit être au format béninois (ex: 0142162127).')
      return
    }
    setSavingProfile(true)
    try {
      const payload = { name: form.name, email: form.email || null, phone: form.phone || null, avatar: form.avatar }
      if (user?.role === 'courier') {
        payload.zone = form.zone || null
        payload.vehicle_type = form.vehicle_type || null
        payload.plate_number = form.plate_number || null
      }
      const r = await api.put('/profile', payload)
      updateUser(r.data.user)
      toast.success(r.data.message || 'Profil mis à jour.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour.')
    } finally {
      setSavingProfile(false)
    }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    if (pwd.new_password !== pwd.new_password_confirmation) {
      toast.error('Les deux mots de passe ne correspondent pas.')
      return
    }
    setSavingPwd(true)
    try {
      await api.post('/password/change', pwd)
      toast.success('Mot de passe mis à jour avec succès.')
      setPwd({ current_password: '', new_password: '', new_password_confirmation: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors du changement de mot de passe.')
    } finally {
      setSavingPwd(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      {/* Informations personnelles */}
      <form onSubmit={saveProfile} className="card p-6 space-y-5">
        <h2 className="font-display font-bold text-ink-900">Informations personnelles</h2>

        <div className="flex items-center gap-4">
          <Avatar name={form.name} role={user?.role} src={form.avatar} size="xl" rounded="rounded-2xl" />
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatar} />
            <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost btn-sm inline-flex items-center gap-1.5">
              <Camera size={14} /> Changer la photo
            </button>
            {form.avatar && (
              <button type="button" onClick={() => setForm(f => ({ ...f, avatar: null }))} className="ml-2 text-xs text-red-500 hover:underline">
                Retirer
              </button>
            )}
            <p className="text-xs text-ink-400 mt-1">JPG ou PNG, 2 Mo max.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Nom complet</label>
            <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Téléphone</label>
            <input className={`input ${form.phone !== originalPhone && getPhoneError(form.phone) ? 'ring-2 ring-red-300 border-red-300' : ''}`} type="tel" inputMode="numeric" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: formatPhoneInput(e.target.value) }))} placeholder="Ex: 0142162127" maxLength={10} />
            {form.phone !== originalPhone && getPhoneError(form.phone) && <p className="mt-1 text-xs text-red-500 font-medium">{getPhoneError(form.phone)}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="label">Adresse e-mail</label>
            <input className="input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="vous@exemple.com" />
          </div>
          {user?.role === 'courier' && (
            <>
              <div className="sm:col-span-2">
                <label className="label">Zone de livraison</label>
                <input className="input" value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))} placeholder="Parakou" />
              </div>
              <div>
                <label className="label">Type de véhicule</label>
                <input className="input" value={form.vehicle_type} onChange={e => setForm(f => ({ ...f, vehicle_type: e.target.value }))} placeholder="Moto, vélo…" />
              </div>
              <div>
                <label className="label">Plaque d'immatriculation</label>
                <input className="input" value={form.plate_number} onChange={e => setForm(f => ({ ...f, plate_number: e.target.value }))} />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={savingProfile} className="btn-primary inline-flex items-center gap-1.5 disabled:opacity-50">
            <Save size={15} /> {savingProfile ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </form>

      {/* Mot de passe */}
      <form onSubmit={savePassword} className="card p-6 space-y-5">
        <h2 className="font-display font-bold text-ink-900 flex items-center gap-2">
          <KeyRound size={16} className="text-teal-600" /> Mot de passe
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Mot de passe actuel</label>
            <input className="input" type="password" value={pwd.current_password} onChange={e => setPwd(p => ({ ...p, current_password: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Nouveau mot de passe</label>
            <input className="input" type="password" value={pwd.new_password} onChange={e => setPwd(p => ({ ...p, new_password: e.target.value }))} minLength={8} required />
          </div>
          <div>
            <label className="label">Confirmer le nouveau</label>
            <input className="input" type="password" value={pwd.new_password_confirmation} onChange={e => setPwd(p => ({ ...p, new_password_confirmation: e.target.value }))} minLength={8} required />
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={savingPwd} className="btn-primary inline-flex items-center gap-1.5 disabled:opacity-50">
            <KeyRound size={15} /> {savingPwd ? 'Mise à jour…' : 'Changer le mot de passe'}
          </button>
        </div>
      </form>
    </div>
  )
}
