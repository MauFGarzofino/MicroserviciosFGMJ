// src/services/eventos.service.ts
import axios from 'axios';
const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // p.ej. http://eventos.localhost:3050/api
    timeout: 20000,
});
http.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers = config.headers ?? {};
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});
export const EventoService = {
    async getAll() {
        try {
            const { data } = await http.get('/events/'); // SIN barra final
            return data;
        }
        catch (err) {
            console.error('Error al obtener eventos:', err?.response?.data ?? err);
            return [];
        }
    },
    async create(evento) {
        try {
            const { data } = await http.post('/events/', evento); // SIN barra final
            return data;
        }
        catch (err) {
            console.error('Error al crear evento:', err?.response?.data ?? err);
            return null;
        }
    },
    async update(id, evento) {
        try {
            await http.put(`/events/${id}/`, evento);
            return true;
        }
        catch (err) {
            console.error('Error al actualizar evento:', err?.response?.data ?? err);
            return false;
        }
    },
    async delete(id) {
        try {
            await http.delete(`/events/${id}`);
            return true;
        }
        catch (err) {
            console.error('Error al eliminar evento:', err?.response?.data ?? err);
            return false;
        }
    },
};
