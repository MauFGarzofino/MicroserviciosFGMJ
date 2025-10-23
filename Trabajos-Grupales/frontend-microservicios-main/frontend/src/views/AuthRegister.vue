<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UsersService } from '@/services/users.service'
import '@/assets/styles/views/auth-register.css'

defineOptions({ name: 'AuthRegister' })

const name = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const router = useRouter()
const FIXED_ROLE = 'buyer'

async function onSubmit() {
  error.value = ''
  success.value = ''

  if (!name.value.trim()) {
    error.value = 'Ingresa tu nombre y apellido.'
    return
  }
  if (password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }
  if (password.value !== confirm.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }

  loading.value = true
  try {
    await UsersService.create({
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value,
      role: FIXED_ROLE,
    })

    success.value = 'Registro completado. Ahora puedes iniciar sesión.'
    setTimeout(() => router.replace('/auth/login'), 600)
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null) {
      const axiosErr = err as {
        response?: { data?: { message?: string; error?: string } }
        message?: string
      }
      error.value =
        axiosErr?.response?.data?.message ||
        axiosErr?.response?.data?.error ||
        axiosErr?.message ||
        'Error al registrar usuario'
    } else {
      error.value = 'Error al registrar usuario'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-grid">
    <div class="auth-illustration">
      <img src="./images/register/register-illustration.svg" alt="Registro de usuario" />
    </div>

    <div class="auth-panel">
      <div class="card">
        <div class="card-head">Registro de Usuario</div>
        <p class="subtitle">Regístrate con tus datos correspondientes</p>

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
            Confirmar Contraseña
            <input type="password" placeholder="Repite la contraseña" v-model="confirm" required />
          </label>
          <input type="hidden" :value="FIXED_ROLE" />

          <div class="actions">
            <button class="btn primary" :disabled="loading">
              {{ loading ? 'Registrando…' : 'Completar Registro' }}
            </button>
          </div>

          <p v-if="error" class="error">{{ error }}</p>
          <p v-if="success" class="success">{{ success }}</p>

          <p class="hint">
            ¿Ya estás registrado?
            <RouterLink to="/auth/login">Inicia sesión aquí</RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
