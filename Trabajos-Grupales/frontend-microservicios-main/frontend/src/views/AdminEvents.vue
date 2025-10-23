<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UsersService } from '@/services/users.service'
import { EventoService } from '@/services/eventos.service'
import type { Event } from '@/types/home'
import '@/assets/styles/views/admin.css'

defineOptions({ name: 'AdminEvents' })

interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'seller' | 'buyer'
  state: 'active' | 'inactive'
}

const router = useRouter()
const auth = useAuthStore()
const me = ref<User | null>(null)
const error = ref('')
const loading = ref(false)

// Estado para eventos
const events = ref<Event[]>([])
const form = ref<Omit<Event, 'id'>>({ nombre: '', fecha: '', lugar: '', capacidad: 0, precio: 0 })

// Estados para creación
const showCreateModal = ref(false)

// Estados para edición
const showEditModal = ref(false)
const editingEvent = ref<Event | null>(null)
const editForm = ref<Omit<Event, 'id'>>({ nombre: '', fecha: '', lugar: '', capacidad: 0, precio: 0 })

// Estados para eliminación
const showDeleteModal = ref(false)
const deletingEvent = ref<Event | null>(null)

const initials = computed(() => {
  const n = me.value?.name?.trim() || ''
  const [a = '', b = ''] = n.split(' ')
  return (a[0] || '').concat(b[0] || '').toUpperCase() || 'A'
})

// 🔹 Cerrar sesión
async function onLogout() {
  await auth.logout()
  router.replace({ name: 'auth.login' })
}

// 🔹 Cargar solo la información del admin logueado
onMounted(async () => {
  try {
    const meRes = await UsersService.getById(auth.userId as string)
    me.value = meRes.data as User
    await loadEvents()
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } }
    error.value = err?.response?.data?.message || 'Error cargando datos del usuario'
  }
})

// CRUD Eventos
async function loadEvents() {
  try {
    loading.value = true
    const data = await EventoService.getAll()
    events.value = data
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } }
    error.value = err?.response?.data?.message || 'Error cargando eventos'
  } finally {
    loading.value = false
  }
}

// 🔹 Abrir modal de creación
function openCreateModal() {
  form.value = { nombre: '', fecha: '', lugar: '', capacidad: 0, precio: 0 }
  showCreateModal.value = true
}

// 🔹 Crear nuevo evento
async function onCreate() {
  try {
    loading.value = true
    error.value = ''
    await EventoService.create(form.value)
    await loadEvents()
    showCreateModal.value = false
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } }
    error.value = err?.response?.data?.message || 'No se pudo crear el evento'
  } finally {
    loading.value = false
  }
}

// 🔹 Cancelar creación
function cancelCreate() {
  showCreateModal.value = false
}

// 🔹 Abrir modal de edición
function openEditModal(ev: Event) {
  editingEvent.value = ev
  editForm.value = {
    nombre: ev.nombre,
    fecha: ev.fecha,
    lugar: ev.lugar,
    capacidad: ev.capacidad,
    precio: ev.precio,
  }
  showEditModal.value = true
}

// 🔹 Guardar cambios de edición
async function saveEdit() {
  if (!editingEvent.value) return
  try {
    loading.value = true
    error.value = ''
    await EventoService.update(editingEvent.value.id, editForm.value)
    await loadEvents()
    showEditModal.value = false
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } }
    error.value = err?.response?.data?.message || 'No se pudo actualizar el evento'
  } finally {
    loading.value = false
  }
}

// 🔹 Cancelar edición
function cancelEdit() {
  showEditModal.value = false
  editingEvent.value = null
}

// 🔹 Abrir modal de confirmación de eliminación
function openDeleteModal(ev: Event) {
  deletingEvent.value = ev
  showDeleteModal.value = true
}

// 🔹 Confirmar eliminación
async function confirmDelete() {
  if (!deletingEvent.value) return
  try {
    loading.value = true
    error.value = ''
    await EventoService.delete(deletingEvent.value.id)
    await loadEvents()
    showDeleteModal.value = false
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } }
    error.value = err?.response?.data?.message || 'No se pudo eliminar el evento'
  } finally {
    loading.value = false
  }
}

// 🔹 Cancelar eliminación
function cancelDelete() {
  showDeleteModal.value = false
  deletingEvent.value = null
}
</script>

<template>
  <section class="admin-page">
    <!-- Topbar -->
    <header class="topbar">
      <div class="brand">
        <div class="brand-icon" aria-hidden="true">🎟️</div>
        <span class="brand-text">EVENTOS</span>
      </div>

      <div class="top-actions">
        <div class="btn-tabs">
            <button
              class="btn"
              :class="{ active: $route.path === '/admin' }"
              @click="router.push('/admin')"
            >
              Usuarios
            </button>
            <button
              class="btn"
              :class="{ active: $route.path === '/admin/events' }"
              @click="router.push('/admin/events')"
            >
              Eventos
            </button>
        </div>
      </div>

      <div class="profile">
        <div class="avatar" aria-hidden="true">{{ initials }}</div>
        <div class="profile-meta" v-if="me">
          <strong class="profile-name">{{ me.name }}</strong>
          <small class="profile-role">Admin</small>
        </div>
        <button class="logout-btn" @click="onLogout" title="Cerrar sesión">⎋</button>
      </div>
    </header>

    <!-- Header -->
    <div class="page-head">
      <div class="page-titles">
        <h2>Gestión de Eventos</h2>
        <span class="subtitle">Lista de eventos</span>
      </div>
      <button class="icon-btn" aria-label="Home" @click="router.push('/admin')">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </button>
    </div>

    <!-- Card base -->
    <main class="card">
      <div class="card-head">Eventos</div>

      <div class="actions" style="padding: 0 18px 12px;">
        <button class="btn primary" @click="openCreateModal">
          Crear nuevo evento
        </button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <hr class="divider" />

      <!-- Listado -->
      <div v-if="loading">Cargando...</div>
      <ul v-else class="list">
        <li v-for="ev in events" :key="ev.id" class="list-item">
          <div class="item-main">
            <strong>{{ ev.nombre }}</strong>
            <small v-if="ev.fecha">{{ ev.fecha }}</small>
            <p>
              <span v-if="ev.lugar">Lugar: {{ ev.lugar }} · </span>
              Capacidad: {{ ev.capacidad }} · Precio: {{ ev.precio }}
            </p>
          </div>
          <div class="item-actions">
            <button class="btn secondary" @click="openEditModal(ev)">Editar</button>
            <button class="btn danger" @click="openDeleteModal(ev)">Eliminar</button>
          </div>
        </li>
        <li v-if="events.length === 0" class="empty">Sin eventos registrados.</li>
      </ul>
    </main>

    <!-- Modal de Creación -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="cancelCreate">
      <div class="modal">
        <div class="modal-head">
          <h3>Crear Nuevo Evento</h3>
          <button class="modal-close" @click="cancelCreate">✕</button>
        </div>
        <form class="form-grid" @submit.prevent="onCreate">
          <label>
            Nombre
            <input v-model="form.nombre" type="text" placeholder="Nombre del evento" required />
          </label>
          <label>
            Fecha
            <input v-model="form.fecha" type="date" />
          </label>
          <label>
            Lugar
            <input v-model="form.lugar" type="text" placeholder="Lugar" />
          </label>
          <label>
            Capacidad
            <input v-model.number="form.capacidad" type="number" min="0" step="1" placeholder="0" />
          </label>
          <label>
            Precio
            <input v-model.number="form.precio" type="number" min="0" step="0.01" placeholder="0.00" />
          </label>
          <div class="actions">
            <button type="button" class="btn" @click="cancelCreate" :disabled="loading">Cancelar</button>
            <button class="btn primary" type="submit" :disabled="loading">
              {{ loading ? 'Creando…' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Edición -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="cancelEdit">
      <div class="modal">
        <div class="modal-head">
          <h3>Editar Evento</h3>
          <button class="modal-close" @click="cancelEdit">✕</button>
        </div>
        <form class="form-grid" @submit.prevent="saveEdit">
          <label>
            Nombre
            <input v-model="editForm.nombre" type="text" placeholder="Nombre del evento" required />
          </label>
          <label>
            Fecha
            <input v-model="editForm.fecha" type="date" />
          </label>
          <label>
            Lugar
            <input v-model="editForm.lugar" type="text" placeholder="Lugar" />
          </label>
          <label>
            Capacidad
            <input v-model.number="editForm.capacidad" type="number" min="0" step="1" placeholder="0" />
          </label>
          <label>
            Precio
            <input v-model.number="editForm.precio" type="number" min="0" step="0.01" placeholder="0.00" />
          </label>
          <div class="actions">
            <button type="button" class="btn" @click="cancelEdit" :disabled="loading">Cancelar</button>
            <button class="btn primary" type="submit" :disabled="loading">
              {{ loading ? 'Guardando…' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Confirmación de Eliminación -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="cancelDelete">
      <div class="modal">
        <div class="modal-head">
          <h3>Confirmar Eliminación</h3>
          <button class="modal-close" @click="cancelDelete">✕</button>
        </div>
        <p style="padding: 20px;">
          ¿Estás seguro de que deseas eliminar el evento <strong>{{ deletingEvent?.nombre }}</strong>?
          <br />Esta acción no se puede deshacer.
        </p>
        <div class="actions" style="padding: 0 20px 20px;">
          <button class="btn" @click="cancelDelete" :disabled="loading">Cancelar</button>
          <button class="btn danger" @click="confirmDelete" :disabled="loading">
            {{ loading ? 'Eliminando…' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
