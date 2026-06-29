import { useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { User, Mail, Lock, Phone, Eye, EyeOff, ShieldCheck, ArrowLeft, Clock, Car, Camera, X } from 'lucide-react'
import Logo from '../components/ui/Logo'
import { useAuth, ROLES } from '../context/AuthContext'
import api from '../api/axios'
import { validateBeninPhone, formatPhoneInput, getPhoneError } from '../utils/format'

const roleOptions = [
  { key: 'client',  label: 'Client',  desc: "J'achète des produits",  image: '/icone client.png'  },
  { key: 'vendor',  label: 'Vendeur', desc: 'Je vends mes produits',  image: '/icone vendeur.jpg' },
  { key: 'courier', label: 'Livreur', desc: 'Je livre des commandes', image: '/icone livreur.jpg' },
]

const sideConfig = {
  client:  { bg: '/connexion client.jpg'  },
  vendor:  { bg: '/connexion vendeur.avif' },
  courier: { bg: '/connexion livreur.jpg' },
}

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('client')
  const [showPwd, setShowPwd] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || null

  const [name, setName] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [vehicleBrand, setVehicleBrand] = useState('')
  const [plateNumber, setPlateNumber] = useState('')
  const [password, setPassword] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const avatarRef = useRef(null)

  const phoneError = getPhoneError(phone)

  const submit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    // Validation du téléphone béninois pour les nouveaux comptes vendeur/livreur
    if (mode === 'register' && role !== 'client' && phone.trim() && !validateBeninPhone(phone)) {
      setErrorMsg('Le numéro de téléphone doit être au format béninois (ex: 0142162127).')
      return
    }
    setIsSubmitting(true)

    const cleanIdentifier = identifier.trim()

    try {
      if (mode === 'login') {
        const response = await api.post('/login', {
          identifier: cleanIdentifier,
          password,
        })

        const { user, access_token } = response.data
        const currentStatus = user.status?.toLowerCase()

        if (user.role === 'vendor' || user.role === 'courier') {
          if (currentStatus !== 'actif' && currentStatus !== 'approved' && currentStatus !== 'disponible') {
            setIsPending(true)
            setIsSubmitting(false)
            return
          }
        }

        login(user, access_token)

        if (redirectTo && user.role === 'client') {
          navigate(redirectTo, { replace: true })
        } else if (user.role === 'admin') {
          navigate('/admin')
        } else if (ROLES[user.role]?.dashboard) {
          navigate(ROLES[user.role].dashboard)
        } else {
          navigate('/')
        }

      } else {
        // Utiliser FormData pour supporter l'upload de photo
        const formData = new FormData()
        formData.append('name', name)
        formData.append('role', role)
        formData.append('password', password)
        if (email.trim())   formData.append('email', email.trim())
        if (phone.trim())   formData.append('phone', phone.trim())
        if (role === 'courier') {
          if (vehicleBrand.trim())  formData.append('vehicle_type', vehicleBrand.trim())
          if (plateNumber.trim())   formData.append('plate_number', plateNumber.trim())
        }
        if (avatarFile) formData.append('avatar', avatarFile)

        await api.post('/register', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        if (role === 'client') {
          setSuccessMsg('✨ Inscription réussie ! Entrez votre mot de passe pour vous connecter.')
          setMode('login')
          setIdentifier(email)
        } else {
          setIsPending(true)
        }
      }
    } catch (error) {
      console.error(error)
      const status = error.response?.status
      const data = error.response?.data
      const message = data?.errors?.identifier?.[0]
        || data?.errors?.password?.[0]
        || data?.message
        || null

      if (status === 403) {
        setIsPending(true)
      } else if (message) {
        setErrorMsg(message)
      } else {
        setErrorMsg('Une erreur de connexion au serveur de la marketplace BeniMarket est survenue.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isPending) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-ink-50 px-4 py-10 sm:px-8">
        <div className="w-full max-w-md card p-6 text-center shadow-lg border-t-4 border-amber-500 animate-scale-in">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-50 text-amber-600 mb-4">
            <Clock size={32} className="animate-pulse" />
          </div>

          <h2 className="font-display text-xl font-bold text-ink-900">
            {mode === 'register' ? 'Inscription enregistrée !' : 'Compte en attente de validation'}
          </h2>

          <p className="mt-3 text-sm text-ink-600 leading-relaxed">
            {mode === 'register'
              ? `Merci pour votre inscription ! Votre profil de ${role === 'vendor' ? 'Vendeur' : 'Livreur'} a été soumis avec succès.`
              : `Votre accès en tant que ${role === 'vendor' ? 'Vendeur' : 'Livreur'} est actuellement en attente des vérifications administratives.`
            }
          </p>

          <div className="mt-5 rounded-2xl bg-white border border-ink-200 p-4 text-xs text-left text-ink-500 space-y-2.5 shadow-inner">
            <p className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">⚠️</span>
              <span><strong>Accès restreint :</strong> L'administration doit valider manuellement vos informations avant l'ouverture de vos accès.</span>
            </p>
            <p className="flex items-start gap-2 border-t border-ink-100 pt-2">
              <span className="text-teal-600 font-bold">💡</span>
              <span><strong>Délai estimé :</strong> Validation sous 72h. L'équipe de BeniMarket à Parakou prendra contact avec vous si nécessaire.</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsPending(false)
              setMode('login')
              setSuccessMsg('')
              setErrorMsg('')
            }}
            className="btn-primary mt-6 w-full"
          >
            Retourner à la connexion
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">

      {/* Visuel secondaire — image dynamique selon le rôle */}
      <div className="relative hidden overflow-hidden lg:block">
        <img
          key={role}
          src={sideConfig[role].bg}
          alt={role}
          className="absolute inset-0 h-full w-full object-cover animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-900/55 to-teal-800/20" />
        <div className="absolute -left-16 top-1/3 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
          <Logo light />
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Commerce local · Parakou
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-balance">
              Rejoignez la communauté du commerce local.
            </h2>
            <p className="mt-3 max-w-sm text-teal-50">
              Clients, vendeurs et livreurs réunis sur une seule plateforme de confiance.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 text-sm text-teal-50 ring-1 ring-white/15 backdrop-blur">
              <ShieldCheck size={18} className="text-amber-400" /> Données protégées · Paiements sécurisés
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="relative flex items-center justify-center overflow-hidden bg-ink-50 px-4 py-10 sm:px-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-teal-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl" />
        <div className="relative w-full max-w-md">
          <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800 lg:hidden">
            <ArrowLeft size={16} /> Retour à l'accueil
          </Link>

          <div className="lg:hidden">
            <Logo />
          </div>

          <h1 className="mt-6 font-display text-2xl font-bold text-ink-900 sm:text-3xl">
            {mode === 'login' ? 'Bon retour parmi nous' : 'Créer un compte'}
          </h1>
          <p className="mt-1.5 text-sm text-ink-500">
            {mode === 'login'
              ? 'Connectez-vous pour accéder à votre espace.'
              : "Quelques informations et c'est parti."}
          </p>

          {errorMsg && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-medium animate-scale-in">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 font-medium shadow-soft animate-scale-in">
              {successMsg}
            </div>
          )}

          <div className="mt-6">
            <span className="label">Je suis un…</span>
            <div className="grid grid-cols-3 gap-2.5">
              {roleOptions.map((r) => {
                const active = role === r.key
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => {
                      setRole(r.key)
                      setIdentifier('')
                      setEmail('')
                      setPhone('')
                      setErrorMsg('')
                      setSuccessMsg('')
                    }}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-center transition-all duration-200 ${
                      active
                        ? 'border-teal-700 bg-teal-50 shadow-soft'
                        : 'border-ink-200 bg-white hover:border-ink-300'
                    }`}
                  >
                    <span className={`h-10 w-10 overflow-hidden rounded-xl ring-2 transition-all ${
                      active ? 'ring-teal-700' : 'ring-transparent'
                    }`}>
                      <img src={r.image} alt={r.label} className="h-full w-full object-cover" />
                    </span>
                    <span className={`text-sm font-semibold ${active ? 'text-teal-800' : 'text-ink-700'}`}>
                      {r.label}
                    </span>
                    <span className="hidden text-[11px] leading-tight text-ink-400 sm:block">{r.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <form onSubmit={submit} autoComplete="off" className="mt-6 space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="name" className="label">Nom complet</label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    id="name"
                    className="input pl-10"
                    placeholder="Ex. Aïcha Dossou"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>
            )}

            {mode === 'login' ? (
              <div>
                <label htmlFor="identifier" className="label">Numéro de téléphone ou email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    id="identifier"
                    className="input pl-10"
                    placeholder="Ex: +229 97 00 00 00 ou admin@benimarket.bj"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>
            ) : (
              <>
                {role !== 'client' && (
                  <>
                    <div>
                      <label htmlFor="phone" className="label">Numéro de téléphone (obligatoire)</label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                        <input
                          id="phone"
                          type="tel"
                          inputMode="numeric"
                          className={`input pl-10 ${phoneError ? 'ring-2 ring-red-300 border-red-300' : ''}`}
                          placeholder="Ex: 0142162127"
                          value={phone}
                          onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                          autoComplete="off"
                          required
                          maxLength={10}
                        />
                      </div>
                      {phoneError && (
                        <p className="mt-1 text-xs text-red-500 font-medium">{phoneError}</p>
                      )}
                    </div>

                    {role === 'courier' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="vehicle_brand" className="label">Marque du véhicule</label>
                          <div className="relative">
                            <Car size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                            <input
                              id="vehicle_brand"
                              className="input pl-10"
                              placeholder="Honda, Yamaha…"
                              value={vehicleBrand}
                              onChange={(e) => setVehicleBrand(e.target.value)}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="plate_number" className="label">Plaque d'immatriculation</label>
                          <div className="relative">
                            <Car size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                            <input
                              id="plate_number"
                              className="input pl-10"
                              placeholder="BJ-12345"
                              value={plateNumber}
                              onChange={(e) => setPlateNumber(e.target.value)}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Photo de profil optionnelle pour vendeur / livreur */}
                <div>
                  <label className="label">
                    Photo de profil <span className="text-ink-400 font-normal">(optionnelle)</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div
                        className="h-16 w-16 rounded-full overflow-hidden bg-ink-100 border-2 border-dashed border-ink-300 flex items-center justify-center cursor-pointer hover:border-teal-500 transition-colors"
                        onClick={() => avatarRef.current?.click()}
                      >
                        {avatarPreview
                          ? <img src={avatarPreview} alt="Aperçu" className="h-full w-full object-cover" />
                          : <Camera size={22} className="text-ink-400" />
                        }
                      </div>
                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={() => { setAvatarFile(null); setAvatarPreview(null) }}
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                        >
                          <X size={10} />
                        </button>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-ink-500">
                        JPG, PNG, max 2 Mo. Cette photo sera affichée sur votre profil.
                      </p>
                      <button
                        type="button"
                        onClick={() => avatarRef.current?.click()}
                        className="mt-1 text-xs text-teal-700 hover:underline font-medium"
                      >
                        Choisir une photo
                      </button>
                    </div>
                    <input
                      ref={avatarRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setAvatarFile(file)
                        setAvatarPreview(URL.createObjectURL(file))
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="label">
                    {role === 'client' ? 'Adresse e-mail' : 'Email (facultatif)'}
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      className="input pl-10"
                      placeholder="vous@exemple.bj"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="off"
                      required={role === 'client'}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="pwd" className="label mb-0">Mot de passe</label>
                {mode === 'login' && (
                  <button type="button" className="text-xs font-semibold text-teal-700 hover:underline">
                    Oublié ?
                  </button>
                )}
              </div>
              <div className="relative mt-1.5">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  id="pwd"
                  type={showPwd ? 'text' : 'password'}
                  className="input pl-10 pr-11"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => { setShowPwd((s) => !s) }}
                  className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-ink-400 hover:bg-ink-100"
                  aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <label className="flex items-start gap-2.5 text-sm text-ink-600">
                <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-ink-300 text-teal-700 focus:ring-teal-600" />
                <span>J'accepte les <span className="font-semibold text-teal-700">conditions d'utilisation</span> de BeniMarket.</span>
              </label>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-primary btn-lg w-full bg-gradient-to-r from-teal-600 to-emerald-600 shadow-soft transition hover:shadow-glow hover:brightness-110 disabled:opacity-50">
              {isSubmitting ? 'Traitement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            {mode === 'login' ? 'Pas encore de compte ?' : 'Vous avez déjà un compte ?'}{' '}
            <button
              type="button"
              onClick={() => {
                setMode((m) => (m === 'login' ? 'register' : 'login'))
                setIdentifier('')
                setEmail('')
                setPhone('')
                setErrorMsg('')
                setSuccessMsg('')
              }}
              className="font-semibold text-teal-700 hover:underline"
            >
              {mode === 'login' ? 'Inscrivez-vous' : 'Connectez-vous'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
