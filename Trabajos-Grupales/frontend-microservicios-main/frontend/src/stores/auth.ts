// src/stores/auth.ts
import { defineStore } from 'pinia'
import { AuthService } from '@/services/auth.service'
import type { Role } from '@/types/auth'

type Status = 'idle' | 'authenticating' | 'authenticated' | 'error'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    status: 'idle' as Status,
    errorMsg: '' as string,
    userId: null as string | null,
    role: null as Role | null,
    name: '' as string,
    email: '' as string,
  }),

  getters: {
    isAuthenticated: (s) => s.status === 'authenticated' && !!s.userId,
    hasRole: (s) => (roles: Role[]) => !!s.role && roles.includes(s.role),
  },

  actions: {
    async login(email: string, password: string) {
      this.status = 'authenticating'
      this.errorMsg = ''
      try {
        const res = await AuthService.login({ email, password })
        // Preferimos claims del token (fuente de verdad del back)
        const me = await AuthService.meFromToken()
        if (me) {
          this.userId = me.id
          this.role = me.role
        } else {
          // fallback a lo que devuelve login.user
          this.userId = res.user.id
          this.role = res.user.role
          this.name = res.user.name
          this.email = res.user.email
        }
        this.status = 'authenticated'
      } catch (err: unknown) {
        this.status = 'error'
        interface ErrorResponse {
          response?: {
            data?: {
              message?: string
            }
          }
        }
        const error = err as ErrorResponse
        if (
          typeof err === 'object' &&
          err !== null &&
          'response' in err &&
          typeof error.response === 'object' &&
          error.response !== null &&
          'data' in error.response &&
          typeof error.response.data === 'object' &&
          error.response.data !== null &&
          'message' in error.response.data
        ) {
          this.errorMsg = error.response.data?.message || 'Credenciales inválidas'
        } else {
          this.errorMsg = 'Credenciales inválidas'
        }
        throw err
      }
    },

    async hydrateFromStorage() {
      const me = await AuthService.meFromToken()
      if (me) {
        this.userId = me.id
        this.role = me.role
        this.status = 'authenticated'
      } else {
        this.$reset()
      }
    },

    async logout() {
      await AuthService.logout()
      this.$reset()
    },
  },
})
