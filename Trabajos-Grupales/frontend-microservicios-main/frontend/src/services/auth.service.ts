import { http } from '@/lib/http'
import type { LoginDto, LoginResponse, Me } from '@/types/auth'

export const AuthService = {
  async login(payload: LoginDto) {
    // Tu back: POST /api/v1/login -> { auth, token, user }
    const { data } = await http.post<LoginResponse>('/login', payload)
    // guarda token para siguientes requests
    localStorage.setItem('access_token', data.token)
    return data
  },

  // Tu back no tiene /auth/me, así que reusamos el user del login o
  // podrías crear un endpoint pequeño que decodifique el token y devuelva {id,role}
  async meFromToken(): Promise<Me | null> {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return null
      // el payload del token contiene { sub, role, exp, iat }
      const base64Payload = token.split('.')[1]
      if (!base64Payload) return null
      const payload = JSON.parse(atob(base64Payload))
      return {
        id: payload.sub,
        name: '', // si quieres, luego llamas GET /users/:id para traer el nombre
        email: '', // idem
        role: payload.role,
      }
    } catch {
      return null
    }
  },

  async logout() {
    localStorage.removeItem('access_token')
  },
}
