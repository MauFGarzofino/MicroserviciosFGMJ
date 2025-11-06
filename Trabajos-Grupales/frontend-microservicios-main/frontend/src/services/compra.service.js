import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_COMPRAS;
const http = axios.create({ baseURL, timeout: 20000 });
http.interceptors.request.use(config => {
    // Verifica si hay token en localStorage
    const token = localStorage.getItem('access_token');
    if (token) {
        // Adiciona el token al header Authorization
        config.headers = config.headers ?? {};
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});
export const CartService = {
    // Hace un get para traer las compras pendientes (no pagadas)
    async fetchPending() {
        try {
            const { data } = await http.get('/compras');
            // Mapea correctamente las propiedades que vienen del backend
            return data
                .filter((item) => !item.pagado)
                .map((item) => ({
                id: item.id,
                evento_id: item.evento_id,
                nombre: item.nombre || item.evento?.nombre || '',
                fecha: item.fecha || item.evento?.fecha || '',
                lugar: item.lugar || item.evento?.lugar || '',
                capacidad: item.capacidad || item.evento?.capacidad || 0,
                precio: item.precio || item.evento?.precio || 0,
                quantity: item.cantidad ?? 1,
                pagado: item.pagado,
            }));
        }
        catch (err) {
            console.error('Error al cargar el carrito:', err);
            return [];
        }
    },
    // Hace un post para agregar una compra al carrito
    async add(evento_id, cantidad) {
        try {
            const { data } = await http.post('/compras', { evento_id, cantidad });
            // También mapeamos aquí
            return {
                id: data.id,
                evento_id: data.evento_id,
                nombre: data.nombre || data.evento?.nombre || '',
                fecha: data.fecha || data.evento?.fecha || '',
                lugar: data.lugar || data.evento?.lugar || '',
                capacidad: data.capacidad || data.evento?.capacidad || 0,
                precio: data.precio || data.evento?.precio || 0,
                quantity: data.cantidad ?? cantidad,
                pagado: data.pagado ?? false,
            };
        }
        catch (err) {
            console.error('Error al agregar al carrito:', err);
            return null;
        }
    },
    // Hace un post para pagar una compra específica
    async pay(itemId) {
        await http.post(`/compras/${itemId}/pagar`);
    },
    // Hace un delete para eliminar una compra del carrito
    async delete(itemId) {
        await http.delete(`/compras/${itemId}`);
    }
};
