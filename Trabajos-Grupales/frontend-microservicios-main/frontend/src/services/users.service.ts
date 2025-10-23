import { http } from '@/lib/http'

export const UsersService = {
  listAll() {
    // GET /api/v1/users (protegido: admin)
    return http.get('/users')
  },
  getById(id: string) {
    // GET /api/v1/users/:id (protegido: admin o dueño)
    return http.get(`/users/${id}`)
  },
  create(data: { name: string; email: string; password: string; role: string }) {
    // POST /api/v1/users (registro público)
    return http.post('/users', data)
  },
  update(id: string, data: { name?: string; email?: string; role?: string; state?: string }) {
    // PUT /api/v1/users/:id (protegido: admin)
    return http.put(`/users/${id}`, data)
  },
  delete(id: string) {
    // DELETE /api/v1/users/:id (protegido: admin)
    return http.delete(`/users/${id}`)
  },
}
