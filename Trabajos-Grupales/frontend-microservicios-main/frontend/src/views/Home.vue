<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import CartView from './CartView.vue'
import type { Event, CartItem, CompraBackend } from '@/types/home'
import { CartService } from '@/services/compra.service'
import { EventoService } from '@/services/eventos.service'
import { UsersService } from '@/services/users.service'
import '@/assets/styles/views/home.css'

defineOptions({ name: 'HomeView' })

const auth = useAuthStore()
const router = useRouter()
const events = ref<Event[]>([])
const currentIndex = ref(0)
const showCart = ref(false)
const quantity = ref(1)
const cart = ref<CartItem[]>([])
const displayName = ref('')

const cartCount = computed(() =>
  cart.value.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
)

async function loadData() {
  events.value = await EventoService.getAll()
  const compras = await CartService.fetchPending() as unknown as CompraBackend[]
  cart.value = compras.map((compra: CompraBackend) => {
    const evento = events.value.find((e: Event) => e.id === Number(compra.evento_id))
    return {
      id: compra.id,
      nombre: evento?.nombre || 'Evento desconocido',
      fecha: evento?.fecha || '-',
      lugar: evento?.lugar || '-',
      capacidad: evento?.capacidad || 0,
      precio: evento?.precio || 0,
      quantity: compra.cantidad || 1,
      pagado: Boolean(compra.pagado)
    } as CartItem
  })
}

async function loadProfileName() {
  try {
    if (auth.name) {
      displayName.value = auth.name
      return
    }
    if (auth.userId) {
      const res = await UsersService.getById(auth.userId)
      const data = res.data as { name?: string; email?: string }
      const name = data?.name || ''
      const email = data?.email || ''
      auth.name = name
      if (!auth.email) auth.email = email
      displayName.value = name
    }
  } catch {
    // silencioso; mantenemos fallback
  }
}

function prevEvent() {
  if (!events.value.length) return
  currentIndex.value = (currentIndex.value - 1 + events.value.length) % events.value.length
  quantity.value = 1
}

function nextEvent() {
  if (!events.value.length) return
  currentIndex.value = (currentIndex.value + 1) % events.value.length
  quantity.value = 1
}

async function addToCart(event: Event, qty: number) {
  const newItem = await CartService.add(event.id, qty)
  if (newItem) {
    const existing = cart.value.find((e: CartItem) => e.id === newItem.id)
    if (existing) {
      existing.quantity += qty
    } else {
      cart.value.push({
        id: newItem.id,
        evento_id: event.id,
        nombre: event.nombre,
        fecha: event.fecha,
        lugar: event.lugar,
        capacidad: event.capacidad,
        precio: event.precio,
        quantity: qty,
        pagado: false
      })
    }
  }
  quantity.value = 1
}

async function purchaseCart(item?: CartItem) {
  if (!item) return
  await CartService.pay(item.id)
  cart.value = cart.value.filter((i: CartItem) => i.id !== item.id)
}

function toggleCart() {
  showCart.value = !showCart.value
}

async function onLogout() {
  await auth.logout()
  router.replace({ name: 'auth.login' })
}

onMounted(async () => {
  // Asegura que el store tenga userId/role si solo hay token en storage
  try { await auth.hydrateFromStorage() } catch {}
  await loadProfileName()
  await loadData()
  setInterval(loadData, 1000)
})
</script>

<template>
  <section class="home-page">
    <!-- Topbar -->
    <header class="topbar">
      <div class="brand">
        <div class="brand-icon" aria-hidden="true">🎟️</div>
        <span class="brand-text">COMPRAS</span>
      </div>

      <div class="top-actions">
        <button class="btn primary" @click="toggleCart">
          Carrito 🛒 {{ cartCount }}
        </button>
        <router-link v-if="auth.hasRole(['admin'])" to="/admin" class="btn primary">
          Panel Admin
        </router-link>
      </div>

      <div class="profile">
        <div class="avatar" aria-hidden="true">{{ (displayName && displayName[0]?.toUpperCase()) || 'U' }}</div>
        <div class="profile-meta" v-if="auth.userId">
          <strong class="profile-name">{{ displayName || auth.name || 'Usuario' }}</strong>
          <small class="profile-role">{{ auth.role }}</small>
        </div>
        <button class="logout-btn" @click="onLogout" title="Cerrar sesión">⎋</button>
      </div>
    </header>

    <!-- Header -->
    <div class="page-head">
      <div class="page-titles">
        <h2>Bienvenido</h2>
        <span class="subtitle">Compra boletos</span>
      </div>

    </div>

    <!-- Cart -->
    <CartView
      v-if="showCart"
      :cart="cart"
      @close-cart="showCart = false"
      @purchase="purchaseCart"
    />

    <!-- Carousel -->
    <section v-else class="carousel">
      <template v-if="events.length">
        <button class="carousel-btn prev" @click="prevEvent">‹</button>
        <div
          v-for="(event, index) in events"
          :key="event.id"
          class="carousel-slide card"
          :class="{
            'slide-center': index === currentIndex,
            'slide-left': index === (currentIndex - 1 + events.length) % events.length,
            'slide-right': index === (currentIndex + 1) % events.length,
            'slide-back':
              index !== currentIndex &&
              index !== (currentIndex - 1 + events.length) % events.length &&
              index !== (currentIndex + 1) % events.length
          }"
        >
          <div class="card-head">{{ event.nombre }}</div>
          <div class="item-main">
            <p>📅 Fecha: {{ event.fecha }}</p>
            <p>📍 Lugar: {{ event.lugar }}</p>
            <p>💰 Precio: ${{ event.precio }}</p>
            <p>👥 Capacidad: {{ event.capacidad }}</p>
          </div>
          <div class="form-grid">
            <label>
              Cantidad
              <input style="text-align: center;" type="number" min="1" v-model.number="quantity" />
            </label>
          </div>
          <div class="actions">
            <button class="btn secondary" @click="addToCart(event, quantity)">Comprar</button>
          </div>
        </div>
        <button class="carousel-btn next" @click="nextEvent">›</button>
      </template>
      <p v-else class="empty">Cargando eventos...</p>
    </section>
  </section>
</template>
