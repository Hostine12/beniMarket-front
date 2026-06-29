import { useState, useEffect, useRef } from 'react'
import { AlertTriangle, MessageSquare, Paperclip, Send, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import api from '../../api/axios'
import { formatDate } from '../../utils/format'
import Avatar from '../ui/Avatar'
import StatusBadge from '../ui/StatusBadge'
import { useToast } from '../../context/ToastContext'

const DISPUTE_STATUSES = {
  open:       { label: 'Ouvert',       color: 'bg-amber-100 text-amber-700' },
  in_review:  { label: 'En examen',    color: 'bg-blue-100 text-blue-700' },
  resolved:   { label: 'Résolu',       color: 'bg-teal-100 text-teal-700' },
  closed:     { label: 'Clôturé',      color: 'bg-ink-100 text-ink-600' },
}

const RESOLUTION_LABELS = {
  full_refund:    '✅ Remboursement total accordé',
  partial_refund: '🔸 Remboursement partiel accordé',
  rejected:       '❌ Réclamation non retenue',
  pending:        'En attente de décision',
}

const ROLE_LABELS = {
  client:  'le client',
  vendor:  'le vendeur',
  courier: 'le livreur',
}

const REASONS_BY_ROLE = {
  client: [
    'Colis non reçu',
    'Produit endommagé',
    'Produit incorrect',
    'Retard de livraison',
    'Autre',
  ],
  vendor: [
    'Problème de paiement',
    'Refus injustifié de commande',
    'Colis perdu',
    'Litige avec le livreur',
    'Autre',
  ],
  courier: [
    'Adresse introuvable',
    'Client injoignable',
    'Colis indisponible chez le vendeur',
    'Litige avec le vendeur',
    'Autre',
  ],
}

function DisputeCard({ dispute, onSelect, selected }) {
  const st = DISPUTE_STATUSES[dispute.status] || DISPUTE_STATUSES.open
  return (
    <button
      onClick={() => onSelect(dispute)}
      className={`w-full text-left p-4 rounded-xl border transition-colors ${
        selected ? 'border-teal-500 bg-teal-50' : 'border-ink-100 bg-white hover:border-ink-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-sm text-ink-900">
            Litige #{dispute.id} — {dispute.order?.reference}
          </p>
          <p className="text-xs text-ink-500 mt-0.5 line-clamp-1">{dispute.reason}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${st.color}`}>
          {st.label}
        </span>
      </div>
      <p className="text-xs text-ink-400 mt-2">
        {formatDate(dispute.created_at)}
        {dispute.opened_by_role && ` · Ouvert par ${ROLE_LABELS[dispute.opened_by_role] || dispute.opened_by_role}`}
      </p>
    </button>
  )
}

function MessageBubble({ msg, currentUserId }) {
  const isMe = msg.sender_id === currentUserId
  return (
    <div className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
      <Avatar src={msg.sender?.avatar} name={msg.sender?.name} size="xs" />
      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
        isMe ? 'bg-teal-600 text-white rounded-tr-sm' : 'bg-ink-100 text-ink-800 rounded-tl-sm'
      }`}>
        {!isMe && (
          <p className={`text-xs font-semibold mb-1 ${isMe ? 'text-teal-100' : 'text-ink-500'}`}>
            {msg.sender?.name} ({msg.sender_role})
          </p>
        )}
        <p className="leading-relaxed">{msg.message}</p>
        <p className={`text-[10px] mt-1 ${isMe ? 'text-teal-200' : 'text-ink-400'}`}>
          {formatDate(msg.created_at)}
        </p>
      </div>
    </div>
  )
}

export default function DisputePanel({ user, orders }) {
  const toast = useToast()
  const [disputes, setDisputes] = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [evidences, setEvidences] = useState([])
  const [newMsg, setNewMsg] = useState('')
  const [sendingMsg, setSendingMsg] = useState(false)
  const [showNewForm, setShowNewForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ order_id: '', reason: '', description: '', priority: 'Moyenne' })
  const [evidenceFile, setEvidenceFile] = useState(null)
  const [uploadingEvidence, setUploadingEvidence] = useState(false)
  const evidenceRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    api.get('/disputes').then(r => setDisputes(r.data.data || r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selected) return
    api.get(`/disputes/${selected.id}`)
      .then(r => {
        setMessages(r.data.messages || [])
        setEvidences(r.data.evidences || [])
      })
      .catch(() => {})
  }, [selected])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMsg.trim() || !selected) return
    setSendingMsg(true)
    try {
      const r = await api.post(`/disputes/${selected.id}/messages`, { message: newMsg })
      setMessages(prev => [...prev, r.data])
      setNewMsg('')
    } catch { /* silencieux */ }
    finally { setSendingMsg(false) }
  }

  const handleUploadEvidence = async () => {
    if (!evidenceFile || !selected) return
    setUploadingEvidence(true)
    const fd = new FormData()
    fd.append('file', evidenceFile)
    try {
      const r = await api.post(`/disputes/${selected.id}/evidences`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setEvidences(prev => [...prev, r.data.evidence])
      setEvidenceFile(null)
    } catch { /* silencieux */ }
    finally { setUploadingEvidence(false) }
  }

  const handleSubmitDispute = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const r = await api.post('/disputes', form)
      setDisputes(prev => [r.data, ...prev])
      setShowNewForm(false)
      setSelected(r.data)
      setForm({ order_id: '', reason: '', description: '', priority: 'Moyenne' })
      toast.success('Litige soumis avec succès. L\'administration a été notifiée.')
    } catch {
      toast.error('Une erreur est survenue. Veuillez réessayer.')
    }
    finally { setSubmitting(false) }
  }

  const statusInfo = selected ? (DISPUTE_STATUSES[selected.status] || DISPUTE_STATUSES.open) : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 animate-fade-in">

      {/* Colonne gauche — liste des litiges */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-ink-900">Mes litiges</h3>
          <button
            onClick={() => setShowNewForm(v => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl border border-teal-100"
          >
            <Plus size={13} /> Nouveau
          </button>
        </div>

        {/* Formulaire nouveau litige */}
        {showNewForm && (
          <form onSubmit={handleSubmitDispute} className="card p-4 border border-red-100 space-y-3">
            <h4 className="text-sm font-bold text-red-700 flex items-center gap-1.5">
              <AlertTriangle size={14} /> Ouvrir un litige
            </h4>
            <div>
              <label className="label text-xs">Commande</label>
              <select
                className="input text-sm"
                value={form.order_id}
                onChange={e => setForm(f => ({ ...f, order_id: e.target.value }))}
                required
              >
                <option value="">Sélectionnez…</option>
                {orders.map(o => (
                  <option key={o.id} value={o.id}>{o.reference}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label text-xs">Motif</label>
              <select
                className="input text-sm"
                value={form.reason}
                onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                required
              >
                <option value="">Choisissez…</option>
                {(REASONS_BY_ROLE[user?.role] || REASONS_BY_ROLE.client).map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label text-xs">Priorité</label>
              <select
                className="input text-sm"
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
              >
                <option value="Basse">Basse</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Haute">Haute</option>
              </select>
            </div>
            <div>
              <label className="label text-xs">Description</label>
              <textarea
                className="input text-sm min-h-[70px] resize-none py-2"
                placeholder="Décrivez le problème…"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full bg-red-600 hover:bg-red-700 text-sm"
            >
              {submitting ? 'Envoi…' : 'Transmettre'}
            </button>
          </form>
        )}

        {disputes.length === 0 && !showNewForm && (
          <p className="text-sm text-ink-400 py-4 text-center">Aucun litige enregistré.</p>
        )}
        {disputes.map(d => (
          <DisputeCard
            key={d.id}
            dispute={d}
            selected={selected?.id === d.id}
            onSelect={setSelected}
          />
        ))}
      </div>

      {/* Colonne droite — détail + messagerie */}
      {selected ? (
        <div className="card overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-rose-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">Litige #{selected.id}</h4>
                <p className="text-xs text-red-100">{selected.reason}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusInfo?.color || ''}`}>
                {statusInfo?.label}
              </span>
            </div>
            {/* Décision finale */}
            {selected.resolution_type && selected.resolution_type !== 'pending' && (
              <div className="mt-3 bg-white/10 rounded-xl px-3 py-2 text-xs text-white">
                {RESOLUTION_LABELS[selected.resolution_type]}
                {selected.refund_amount > 0 && ` — ${selected.refund_amount?.toLocaleString()} FCFA`}
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto max-h-80 p-4 space-y-3 bg-ink-50/50">
            {messages.length === 0 && (
              <p className="text-center text-sm text-ink-400 py-6">
                Aucun message pour l'instant. Commencez la discussion.
              </p>
            )}
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} currentUserId={user?.id} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Zone de saisie */}
          {!['resolved', 'closed'].includes(selected.status) && (
            <div className="border-t border-ink-100 p-3">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  className="input flex-1 text-sm"
                  placeholder="Votre message…"
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={sendingMsg || !newMsg.trim()}
                  className="p-2.5 rounded-xl bg-teal-600 text-white disabled:opacity-40 hover:bg-teal-700"
                >
                  <Send size={16} />
                </button>
              </form>

              {/* Upload de preuve */}
              <div className="mt-2 flex items-center gap-2">
                <input
                  ref={evidenceRef}
                  type="file"
                  accept="image/*,video/*,.pdf"
                  className="hidden"
                  onChange={e => setEvidenceFile(e.target.files?.[0] || null)}
                />
                {evidenceFile ? (
                  <div className="flex items-center gap-2 text-xs text-ink-600">
                    <span className="truncate max-w-[160px]">{evidenceFile.name}</span>
                    <button
                      type="button"
                      onClick={handleUploadEvidence}
                      disabled={uploadingEvidence}
                      className="text-teal-700 font-semibold hover:underline"
                    >
                      {uploadingEvidence ? 'Envoi…' : 'Envoyer'}
                    </button>
                    <button onClick={() => setEvidenceFile(null)} className="text-ink-400 hover:text-red-500">✕</button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => evidenceRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs text-ink-500 hover:text-teal-700 transition-colors"
                  >
                    <Paperclip size={13} /> Joindre une preuve (photo, vidéo, PDF)
                  </button>
                )}
              </div>

              {/* Liste des preuves */}
              {evidences.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-ink-400 font-semibold uppercase tracking-wider">Preuves jointes</p>
                  {evidences.map(ev => (
                    <div key={ev.id} className="flex items-center gap-2 text-xs text-ink-600">
                      <Paperclip size={11} />
                      <span className="truncate">{ev.file_name}</span>
                      {ev.description && <span className="text-ink-400">— {ev.description}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {['resolved', 'closed'].includes(selected.status) && selected.admin_note && (
            <div className="border-t border-ink-100 p-4 bg-ink-50">
              <p className="text-xs font-semibold text-ink-500 uppercase mb-1">Note de l'administration</p>
              <p className="text-sm text-ink-700">{selected.admin_note}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="card flex items-center justify-center py-20 text-center">
          <div>
            <MessageSquare size={40} className="mx-auto text-ink-200 mb-3" />
            <p className="text-ink-400 text-sm">Sélectionnez un litige ou ouvrez-en un nouveau.</p>
          </div>
        </div>
      )}
    </div>
  )
}
