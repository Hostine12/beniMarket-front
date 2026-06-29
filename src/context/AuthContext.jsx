// import { createContext, useContext, useState, useEffect } from 'react'
import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // Évite les clignotements au rechargement

  // Au démarrage, on vérifie si un utilisateur est déjà connecté localement
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // Fonction de connexion globale connectée au Backend
  const loginUser = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  // Met à jour l'utilisateur courant (après modification du profil)
  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch (error) {
      console.error("Erreur lors de la déconnexion sur le serveur", error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      window.dispatchEvent(new Event('auth:logout'))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login: loginUser, updateUser, logout, isAuthed: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export const ROLES = {
  client: { label: 'Client', dashboard: '/compte' },
  vendor: { label: 'Vendeur', dashboard: '/vendeur' },
  courier: { label: 'Livreur', dashboard: '/livreur' },
  admin: { label: 'Administrateur', dashboard: '/admin' },
}