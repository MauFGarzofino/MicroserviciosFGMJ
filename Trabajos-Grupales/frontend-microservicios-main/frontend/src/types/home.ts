// src/types/home.ts

// 🔹 Tipo que representa un ítem del carrito (en el frontend)
export interface CartItem {
  id: number  
  evento_id: number               // ID de la compra (no del evento)
  nombre: string            // Nombre del evento
  fecha: string             // Fecha del evento
  lugar: string             // Lugar del evento
  capacidad: number         // Capacidad del evento
  precio: number            // Precio unitario
  quantity: number          // Cantidad de entradas compradas
  pagado: boolean           // Si ya fue pagado o no
}

// 🔹 Tipo de evento devuelto por la API Flask
export interface Event {
  id: number
  nombre: string
  fecha: string
  lugar: string
  capacidad: number
  precio: number
  pagado?: boolean           // Campo opcional, solo si el backend lo usa
}

// 🔹 Tipo de compra cruda proveniente del backend Laravel
export interface CompraBackend {
  id: number
  evento_id: number          // ID del evento comprado
  usuario_id: string         // ID del usuario que realizó la compra
  cantidad: number           // Cantidad de entradas compradas
  pagado: boolean | number   // Puede venir como 0/1 o true/false
  created_at?: string
  updated_at?: string
}
