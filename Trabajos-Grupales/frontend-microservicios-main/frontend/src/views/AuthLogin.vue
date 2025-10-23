<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'
import '@/assets/styles/views/auth-login.css'

defineOptions({ name: 'AuthLogin' })

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value.trim(), password.value)
    const redirect = (route.query.redirect as string) || '/'
    router.replace(redirect)
  } catch {
    error.value = auth.errorMsg || 'Error de autenticación'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-grid">
    <div class="auth-illustration">
      <img src="./images/login/login-illustration.svg" alt="Login Illustration" />
    </div>

    <div class="auth-panel">
      <div class="card">
        <div class="card-head">Iniciar Sesión</div>
        <p class="subtitle">Ingresa a la plataforma con tus datos de registro</p>

        <form @submit.prevent="onSubmit" class="form-grid">
          <label>
            Correo
            <input type="email" placeholder="correo@ejemplo.com" v-model="email" required />
          </label>

          <label>
            Contraseña
            <input type="password" placeholder="Mínimo 6 caracteres" v-model="password" required />
          </label>

          <div class="actions">
            <button class="btn primary" :disabled="loading">
              {{ loading ? 'Ingresando…' : 'Iniciar Sesión' }}
            </button>
          </div>

          <p v-if="error" class="error">{{ error }}</p>

          <p class="hint">
            ¿Aún no estás registrado?
            <RouterLink to="/auth/register">Regístrate aquí</RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
