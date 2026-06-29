import { createContext, useContext, useState, useCallback } from 'react'
import ToastContainer from '../components/ui/Toast'

const ToastContext = createContext(null)

let _id = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const add = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++_id
    setToasts(prev => [...prev, { id, message, type, duration }])
  }, [])

  const toast = {
    success: (msg, duration) => add(msg, 'success', duration),
    error:   (msg, duration) => add(msg, 'error',   duration),
    warning: (msg, duration) => add(msg, 'warning', duration),
    info:    (msg, duration) => add(msg, 'info',    duration),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
