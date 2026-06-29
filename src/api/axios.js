// src/api/axios.js
import axios from 'axios';

// 1. On crée d'abord l'instance proprement
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false
});

// 2. On configure l'intercepteur après la création
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 3. On définit et exporte les variables globales à la toute fin
export const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default api;