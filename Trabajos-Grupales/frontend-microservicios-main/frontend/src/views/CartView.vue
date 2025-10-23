<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { CartItem } from '@/types/home'
import { fetchCartWithEventDetails } from '@/services/cart-with-events.service'
import { CartService } from '@/services/compra.service'
import '@/assets/styles/views/cart.css'

const cart = ref<CartItem[]>([])
const loading = ref(true)

// 🔹 Modal de pago
const showPaymentModal = ref(false)
const selectedItem = ref<CartItem | null>(null) // item que se va a pagar
const processingPayment = ref(false)


// 🔹 Acciones
async function removeItem(item: CartItem) {
  try {
    await CartService.delete(item.id)
    cart.value = cart.value.filter(c => c.id !== item.id)
  } catch (err) {
    console.error('Error al eliminar item del carrito:', err)
  }
}

// 🔹 Abrir modal de pago
function openPaymentModal(item: CartItem) {
  selectedItem.value = item
  showPaymentModal.value = true
}

// 🔹 Confirmar pago
async function confirmPayment() {
  if (!selectedItem.value) return
  processingPayment.value = true
  try {
    await CartService.pay(selectedItem.value.id)
    cart.value = cart.value.filter(c => c.id !== selectedItem.value!.id)
    showPaymentModal.value = false
    selectedItem.value = null
  } catch (err) {
    console.error('Error al procesar el pago:', err)
  } finally {
    processingPayment.value = false
  }
}

// 🔹 Cancelar pago
function cancelPayment() {
  showPaymentModal.value = false
  selectedItem.value = null
}

// 🔹 Traer datos al montar
onMounted(async () => {
  loading.value = true
  cart.value = await fetchCartWithEventDetails()
  loading.value = false
})
</script>

<template>
  <section class="cart-section">
    <div class="card">
      <div class="card-head">🛒 Carrito de compras</div>

      <div v-if="loading" class="empty">Cargando carrito...</div>

      <!-- Tabla de compras -->
      <div v-if="!loading && cart.length" class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Evento</th>
              <th>Precio unitario</th>
              <th>Fecha</th>
              <th>Lugar</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cart" :key="item.id">
              <td>{{ item.nombre }}</td>
              <td>${{ item.precio.toFixed(2) }}</td>
              <td>{{ item.fecha }}</td>
              <td>{{ item.lugar }}</td>
              <td>{{ item.quantity }}</td>
              <td>${{ (item.precio * item.quantity).toFixed(2) }}</td>
              <td class="item-actions">
                <button class="btn danger" @click="removeItem(item)">🗑</button>
                <button class="btn primary" @click="openPaymentModal(item)" :disabled="item.pagado">
                  {{ item.pagado ? 'Pagado' : 'Comprar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!loading && cart.length === 0" class="empty">No hay compras pendientes.</div>

      <div class="actions">
        <button class="btn secondary" @click="$emit('close-cart')">Volver a eventos</button>
      </div>
    </div>

    <!-- Modal de pago -->
    <div v-if="showPaymentModal" class="modal-overlay">
      <div class="modal-content">
        <div class="card-head">Confirmar pago</div>
        <p>Estás a punto de pagar <strong>{{ selectedItem?.nombre }}</strong> por ${{ (selectedItem?.precio! * selectedItem?.quantity!).toFixed(2) }}</p>
        <div class="modal-actions">
          <button class="btn" @click="cancelPayment" :disabled="processingPayment">Cancelar</button>
          <button class="btn primary" @click="confirmPayment" :disabled="processingPayment">
            {{ processingPayment ? 'Procesando...' : 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
