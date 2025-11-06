import { CartService } from './compra.service';
import { EventoService } from './eventos.service';
export async function fetchCartWithEventDetails() {
    // 1️⃣ Traer compras pendientes
    const cartItems = await CartService.fetchPending();
    // 2️⃣ Traer todos los eventos
    const events = await EventoService.getAll();
    // 3️⃣ Mapear cada item del carrito con su evento correspondiente
    const mappedCart = cartItems.map(item => {
        const event = events.find(e => e.id === item.id || e.id === item.evento_id);
        return {
            ...item,
            nombre: item.nombre || event?.nombre || 'Evento desconocido',
            precio: item.precio || event?.precio || 0,
            fecha: item.fecha || event?.fecha || '-',
            lugar: item.lugar || event?.lugar || '-',
            capacidad: item.capacidad || event?.capacidad || 0,
        };
    });
    return mappedCart;
}
