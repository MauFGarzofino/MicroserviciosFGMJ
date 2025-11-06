// src/stores/auth.ts
import { defineStore } from 'pinia';
import { AuthService } from '@/services/auth.service';
export const useAuthStore = defineStore('auth', {
    state: () => ({
        status: 'idle',
        errorMsg: '',
        userId: null,
        role: null,
        name: '',
        email: '',
    }),
    getters: {
        isAuthenticated: (s) => s.status === 'authenticated' && !!s.userId,
        hasRole: (s) => (roles) => !!s.role && roles.includes(s.role),
    },
    actions: {
        async login(email, password) {
            this.status = 'authenticating';
            this.errorMsg = '';
            try {
                const res = await AuthService.login({ email, password });
                // Preferimos claims del token (fuente de verdad del back)
                const me = await AuthService.meFromToken();
                if (me) {
                    this.userId = me.id;
                    this.role = me.role;
                }
                else {
                    // fallback a lo que devuelve login.user
                    this.userId = res.user.id;
                    this.role = res.user.role;
                    this.name = res.user.name;
                    this.email = res.user.email;
                }
                this.status = 'authenticated';
            }
            catch (err) {
                this.status = 'error';
                const error = err;
                if (typeof err === 'object' &&
                    err !== null &&
                    'response' in err &&
                    typeof error.response === 'object' &&
                    error.response !== null &&
                    'data' in error.response &&
                    typeof error.response.data === 'object' &&
                    error.response.data !== null &&
                    'message' in error.response.data) {
                    this.errorMsg = error.response.data?.message || 'Credenciales inválidas';
                }
                else {
                    this.errorMsg = 'Credenciales inválidas';
                }
                throw err;
            }
        },
        async hydrateFromStorage() {
            const me = await AuthService.meFromToken();
            if (me) {
                this.userId = me.id;
                this.role = me.role;
                this.status = 'authenticated';
            }
            else {
                this.$reset();
            }
        },
        async logout() {
            await AuthService.logout();
            this.$reset();
        },
    },
});
