// src/services/eventos.service.ts
import axios from 'axios'
import type { Event } from '@/types/home'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // p.ej. http://eventos.localhost:3050/api
  timeout: 20000,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

export const EventoService = {
  async getAll(): Promise<Event[]> {
    try {
      const { data } = await http.get<Event[]>('/events/') // SIN barra final
      return data
    } catch (err: any) {
      console.error('Error al obtener eventos:', err?.response?.data ?? err)
      return []
    }
  },
  async create(evento: Omit<Event, 'id'>): Promise<Event | null> {
    try {
      const { data } = await http.post<Event>('/events/', evento) // SIN barra final
      return data
    } catch (err: any) {
      console.error('Error al crear evento:', err?.response?.data ?? err)
      return null
    }
  },
  async update(id: number, evento: Partial<Event>): Promise<boolean> {
    try {
      await http.put(`/events/${id}/`, evento)
      return true
    } catch (err: any) {
      console.error('Error al actualizar evento:', err?.response?.data ?? err)
      return false
    }
  },
  async delete(id: number): Promise<boolean> {
    try {
      await http.delete(`/events/${id}`)
      return true
    } catch (err: any) {
      console.error('Error al eliminar evento:', err?.response?.data ?? err)
      return false
    }
  },
}
