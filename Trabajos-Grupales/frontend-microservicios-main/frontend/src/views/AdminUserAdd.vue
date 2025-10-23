<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UsersService } from '@/services/users.service'
import '@/assets/styles/views/admin-user-add.css'

defineOptions({ name: 'AdminUserAdd' })

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref<'admin'| 'buyer'>('buyer')
const loading = ref(false)
const error = ref('')
const success = ref('')

const router = useRouter()
const auth = useAuthStore()

const initials = computed(() => {
  const n = auth.user?.name?.trim() || ''
  const [a = '', b = ''] = n.split(' ')
  return (a[0] || '').concat(b[0] || '').toUpperCase() || 'A'
})

async function onSubmit() {
  error.value = ''
  success.value = ''

  if (!name.value.trim()) {
    error.value = 'Ingresa el nombre completo.'
    return
  }
  if (!email.value.trim()) {
    error.value = 'Ingresa el correo.'
    return
  }
  if (password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }

  loading.value = true
  try {
    await UsersService.create({
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value,
      role: role.value,
    })
    success.value = 'Usuario creado correctamente.'
    setTimeout(() => router.back(), 400)
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null) {
      const errorObj = err as {
        response?: { data?: { message?: string; error?: string } }
        message?: string
      }
      error.value =
        errorObj?.response?.data?.message ||
        errorObj?.response?.data?.error ||
        errorObj?.message ||
        'No se pudo crear el usuario'
    } else {
      error.value = 'No se pudo crear el usuario'
    }
  } finally {
    loading.value = false
  }
}

function onCancel() {
  router.back()
}

async function onLogout() {
  await auth.logout()
  router.replace({ name: 'auth.login' })
}
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
          <button class="btn" @click="router.push('/admin')">Usuarios</button>
          <button class="btn" @click="router.push('/admin/events')">Eventos</button>
        </div>
      </div>

      <div class="profile">
        <div class="avatar" aria-hidden="true">{{ initials }}</div>
        <div class="profile-meta" v-if="auth.user">
          <strong class="profile-name">{{ auth.user.name }}</strong>
          <small class="profile-role">Admin</small>
        </div>
        <button class="logout-btn" @click="onLogout" title="Cerrar sesión">⎋</button>
      </div>
    </header>

    <!-- Header -->
    <div class="page-head">
      <div class="page-titles">
        <h2>Agregar Usuario</h2>
        <span class="subtitle">Crear nuevo usuario</span>
      </div>
      <button class="icon-btn" aria-label="Home" @click="router.push('/admin')">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </button>
    </div>

    <!-- Form Card -->
    <main class="card">
      <div class="card-head">Nuevo Usuario</div>
      <form class="form-grid" @submit.prevent="onSubmit">
        <label>
          Nombre y Apellido
          <input type="text" placeholder="Nombre completo" v-model="name" required />
        </label>
        <label>
          Correo
          <input type="email" placeholder="correo@ejemplo.com" v-model="email" required />
        </label>
        <label>
          Contraseña
          <input type="password" placeholder="Mínimo 6 caracteres" v-model="password" required />
        </label>
        <label>
          Rol
          <select v-model="role" required>
            <option value="admin">Admin</option>
            <option value="buyer">Comprador</option>
          </select>
        </label>
        <div class="actions">
          <button type="button" class="btn" @click="onCancel" :disabled="loading">
            Cancelar
          </button>
          <button class="btn primary" type="submit" :disabled="loading">
            {{ loading ? 'Guardando…' : 'Agregar' }}
          </button>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
      </form>
    </main>
  </section>
</template>
