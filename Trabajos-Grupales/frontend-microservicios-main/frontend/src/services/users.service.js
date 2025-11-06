import { http } from '@/lib/http';
export const UsersService = {
    listAll() {
        // GET /api/v1/users (protegido: admin)
        return http.get('/users');
    },
    getById(id) {
        // GET /api/v1/users/:id (protegido: admin o dueño)
        return http.get(`/users/${id}`);
    },
    create(data) {
        // POST /api/v1/users (registro público)
        return http.post('/users', data);
    },
    update(id, data) {
        // PUT /api/v1/users/:id (protegido: admin)
        return http.put(`/users/${id}`, data);
    },
    delete(id) {
        // DELETE /api/v1/users/:id (protegido: admin)
        return http.delete(`/users/${id}`);
    },
};
