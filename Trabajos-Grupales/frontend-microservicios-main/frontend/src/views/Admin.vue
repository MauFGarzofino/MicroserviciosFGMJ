<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UsersService } from '@/services/users.service'
import '@/assets/styles/views/admin.css'

defineOptions({ name: 'AdminPanel' })

interface User {
  _id: string
  name: string
  email: string
  role: 'admin'| 'buyer'
  state: 'active' | 'inactive'
}

const router = useRouter()
const auth = useAuthStore()
const me = ref<User | null>(null)
const users = ref<User[]>([])
const error = ref('')

// Estados para edición
const showEditModal = ref(false)
const editingUser = ref<User | null>(null)
const editForm = ref({ name: '', email: '', role: '' as 'admin'| 'buyer', state: '' as 'active' | 'inactive' })

// Estados para eliminación
const showDeleteModal = ref(false)
const deletingUser = ref<User | null>(null)
const loading = ref(false)

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

// 🔹 Abrir modal de edición
function openEditModal(user: User) {
  editingUser.value = user
  editForm.value = {
    name: user.name,
    email: user.email,
    role: user.role,
    state: user.state,
  }
  showEditModal.value = true
}

// 🔹 Guardar cambios de edición
async function saveEdit() {
  if (!editingUser.value) return
  try {
    loading.value = true
    error.value = ''
    await UsersService.update(editingUser.value._id, editForm.value)
    // Actualizar en la lista local
    const idx = users.value.findIndex((u: User) => u._id === editingUser.value?._id)
    if (idx !== -1) {
      users.value[idx] = { ...users.value[idx], ...editForm.value }
    }
    showEditModal.value = false
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } }
    error.value = err?.response?.data?.message || 'Error al actualizar usuario'
  } finally {
    loading.value = false
  }
}

// 🔹 Cancelar edición
function cancelEdit() {
  showEditModal.value = false
  editingUser.value = null
}

// 🔹 Abrir modal de confirmación de eliminación
function openDeleteModal(user: User) {
  deletingUser.value = user
  showDeleteModal.value = true
}

// 🔹 Confirmar eliminación
async function confirmDelete() {
  if (!deletingUser.value) return
  try {
    loading.value = true
    error.value = ''
    await UsersService.delete(deletingUser.value._id)
    // Remover de la lista local
    users.value = users.value.filter((u: User) => u._id !== deletingUser.value?._id)
    showDeleteModal.value = false
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } }
    error.value = err?.response?.data?.message || 'Error al eliminar usuario'
  } finally {
    loading.value = false
  }
}

// 🔹 Cancelar eliminación
function cancelDelete() {
  showDeleteModal.value = false
  deletingUser.value = null
}

onMounted(async () => {
  try {
    const [meRes, listRes] = await Promise.all([
      UsersService.getById(auth.userId as string),
      UsersService.listAll(),
    ])
    me.value = meRes.data as User
    users.value = listRes.data as User[]
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } }
    error.value = err?.response?.data?.message || 'Error cargando datos'
  }
})
</script>

<template>
  <section class="admin-page">
    <!-- Topbar -->
    <header class="topbar">
      <div class="brand">
        <div class="brand-icon" aria-hidden="true">🎓</div>
        <span class="brand-text">ADMIN</span>
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
        <h2>Gestión de Usuarios</h2>
        <span class="subtitle">Lista de usuarios</span>
      </div>
      <button class="icon-btn" aria-label="Home" @click="router.push('/admin')">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </button>
    </div>

    <!-- Card base -->
    <main class="card">
      <div class="card-head">Usuarios</div>

      <div class="actions" style="padding: 0 18px 12px;">
        <button class="btn primary" @click="router.push('/admin/users/new')">Agregar usuario</button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      <div v-else-if="users.length === 0" class="empty">Sin usuarios registrados.</div>
      <div v-else class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u._id">
              <td>{{ u.name }}</td>
              <td>{{ u.email }}</td>
              <td class="role">{{ u.role }}</td>
              <td>
                <span class="state" :data-state="u.state">{{ u.state }}</span>
              </td>
              <td>
                <div class="item-actions">
                  <button class="btn secondary" @click="openEditModal(u)">Editar</button>
                  <button class="btn danger" @click="openDeleteModal(u)">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Modal de Edición -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="cancelEdit">
      <div class="modal">
        <div class="modal-head">
          <h3>Editar Usuario</h3>
          <button class="modal-close" @click="cancelEdit">✕</button>
        </div>
        <form class="form-grid" @submit.prevent="saveEdit">
          <label>
            Nombre
            <input v-model="editForm.name" type="text" placeholder="Nombre completo" required />
          </label>
          <label>
            Email
            <input v-model="editForm.email" type="email" placeholder="correo@ejemplo.com" required />
          </label>
          <label>
            Rol
            <select v-model="editForm.role" required>
              <option value="admin">Admin</option>
              <option value="buyer">Comprador</option>
            </select>
          </label>
          <label>
            Estado
            <select v-model="editForm.state" required>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
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
          ¿Estás seguro de que deseas eliminar al usuario <strong>{{ deletingUser?.name }}</strong>?
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
