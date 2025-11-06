import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { UsersService } from '@/services/users.service';
import '@/assets/styles/views/admin.css';
defineOptions({ name: 'AdminPanel' });
const router = useRouter();
const auth = useAuthStore();
const me = ref(null);
const users = ref([]);
const error = ref('');
// Estados para edición
const showEditModal = ref(false);
const editingUser = ref(null);
const editForm = ref({ name: '', email: '', role: '', state: '' });
// Estados para eliminación
const showDeleteModal = ref(false);
const deletingUser = ref(null);
const loading = ref(false);
const initials = computed(() => {
    const n = me.value?.name?.trim() || '';
    const [a = '', b = ''] = n.split(' ');
    return (a[0] || '').concat(b[0] || '').toUpperCase() || 'A';
});
// 🔹 Cerrar sesión
async function onLogout() {
    await auth.logout();
    router.replace({ name: 'auth.login' });
}
// 🔹 Abrir modal de edición
function openEditModal(user) {
    editingUser.value = user;
    editForm.value = {
        name: user.name,
        email: user.email,
        role: user.role,
        state: user.state,
    };
    showEditModal.value = true;
}
// 🔹 Guardar cambios de edición
async function saveEdit() {
    if (!editingUser.value)
        return;
    try {
        loading.value = true;
        error.value = '';
        await UsersService.update(editingUser.value._id, editForm.value);
        // Actualizar en la lista local
        const idx = users.value.findIndex((u) => u._id === editingUser.value?._id);
        if (idx !== -1) {
            users.value[idx] = { ...users.value[idx], ...editForm.value };
        }
        showEditModal.value = false;
    }
    catch (e) {
        const err = e;
        error.value = err?.response?.data?.message || 'Error al actualizar usuario';
    }
    finally {
        loading.value = false;
    }
}
// 🔹 Cancelar edición
function cancelEdit() {
    showEditModal.value = false;
    editingUser.value = null;
}
// 🔹 Abrir modal de confirmación de eliminación
function openDeleteModal(user) {
    deletingUser.value = user;
    showDeleteModal.value = true;
}
// 🔹 Confirmar eliminación
async function confirmDelete() {
    if (!deletingUser.value)
        return;
    try {
        loading.value = true;
        error.value = '';
        await UsersService.delete(deletingUser.value._id);
        // Remover de la lista local
        users.value = users.value.filter((u) => u._id !== deletingUser.value?._id);
        showDeleteModal.value = false;
    }
    catch (e) {
        const err = e;
        error.value = err?.response?.data?.message || 'Error al eliminar usuario';
    }
    finally {
        loading.value = false;
    }
}
// 🔹 Cancelar eliminación
function cancelDelete() {
    showDeleteModal.value = false;
    deletingUser.value = null;
}
onMounted(async () => {
    try {
        const [meRes, listRes] = await Promise.all([
            UsersService.getById(auth.userId),
            UsersService.listAll(),
        ]);
        me.value = meRes.data;
        users.value = listRes.data;
    }
    catch (e) {
        const err = e;
        error.value = err?.response?.data?.message || 'Error cargando datos';
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)({
    ...{ class: "admin-page" },
});
__VLS_asFunctionalElement(__VLS_elements.header, __VLS_elements.header)({
    ...{ class: "topbar" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "brand" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "brand-icon" },
    'aria-hidden': "true",
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "brand-text" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "top-actions" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "btn-tabs" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.router.push('/admin');
            // @ts-ignore
            [router,];
        } },
    ...{ class: "btn" },
    ...{ class: ({ active: __VLS_ctx.$route.path === '/admin' }) },
});
// @ts-ignore
[$route,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.router.push('/admin/events');
            // @ts-ignore
            [router,];
        } },
    ...{ class: "btn" },
    ...{ class: ({ active: __VLS_ctx.$route.path === '/admin/events' }) },
});
// @ts-ignore
[$route,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "profile" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "avatar" },
    'aria-hidden': "true",
});
(__VLS_ctx.initials);
// @ts-ignore
[initials,];
if (__VLS_ctx.me) {
    // @ts-ignore
    [me,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "profile-meta" },
    });
    __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({
        ...{ class: "profile-name" },
    });
    (__VLS_ctx.me.name);
    // @ts-ignore
    [me,];
    __VLS_asFunctionalElement(__VLS_elements.small, __VLS_elements.small)({
        ...{ class: "profile-role" },
    });
}
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.onLogout) },
    ...{ class: "logout-btn" },
    title: "Cerrar sesión",
});
// @ts-ignore
[onLogout,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "page-head" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "page-titles" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "subtitle" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.router.push('/admin');
            // @ts-ignore
            [router,];
        } },
    ...{ class: "icon-btn" },
    'aria-label': "Home",
});
__VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
    viewBox: "0 0 24 24",
    width: "22",
    height: "22",
    fill: "currentColor",
    'aria-hidden': "true",
});
__VLS_asFunctionalElement(__VLS_elements.path)({
    d: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
});
__VLS_asFunctionalElement(__VLS_elements.main, __VLS_elements.main)({
    ...{ class: "card" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "card-head" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "actions" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.router.push('/admin/users/new');
            // @ts-ignore
            [router,];
        } },
    ...{ class: "btn primary" },
});
if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "error" },
    });
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
}
else if (__VLS_ctx.users.length === 0) {
    // @ts-ignore
    [users,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "empty" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "table-wrap" },
    });
    __VLS_asFunctionalElement(__VLS_elements.table, __VLS_elements.table)({
        ...{ class: "table" },
    });
    __VLS_asFunctionalElement(__VLS_elements.thead, __VLS_elements.thead)({});
    __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({});
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({});
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({});
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({});
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({});
    __VLS_asFunctionalElement(__VLS_elements.tbody, __VLS_elements.tbody)({});
    for (const [u] of __VLS_getVForSourceType((__VLS_ctx.users))) {
        // @ts-ignore
        [users,];
        __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({
            key: (u._id),
        });
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        (u.name);
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        (u.email);
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
            ...{ class: "role" },
        });
        (u.role);
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "state" },
            'data-state': (u.state),
        });
        (u.state);
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "item-actions" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.error))
                        return;
                    if (!!(__VLS_ctx.users.length === 0))
                        return;
                    __VLS_ctx.openEditModal(u);
                    // @ts-ignore
                    [openEditModal,];
                } },
            ...{ class: "btn secondary" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.error))
                        return;
                    if (!!(__VLS_ctx.users.length === 0))
                        return;
                    __VLS_ctx.openDeleteModal(u);
                    // @ts-ignore
                    [openDeleteModal,];
                } },
            ...{ class: "btn danger" },
        });
    }
}
if (__VLS_ctx.showEditModal) {
    // @ts-ignore
    [showEditModal,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (__VLS_ctx.cancelEdit) },
        ...{ class: "modal-overlay" },
    });
    // @ts-ignore
    [cancelEdit,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal-head" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.cancelEdit) },
        ...{ class: "modal-close" },
    });
    // @ts-ignore
    [cancelEdit,];
    __VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
        ...{ onSubmit: (__VLS_ctx.saveEdit) },
        ...{ class: "form-grid" },
    });
    // @ts-ignore
    [saveEdit,];
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.input)({
        value: (__VLS_ctx.editForm.name),
        type: "text",
        placeholder: "Nombre completo",
        required: true,
    });
    // @ts-ignore
    [editForm,];
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.input)({
        type: "email",
        placeholder: "correo@ejemplo.com",
        required: true,
    });
    (__VLS_ctx.editForm.email);
    // @ts-ignore
    [editForm,];
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
        value: (__VLS_ctx.editForm.role),
        required: true,
    });
    // @ts-ignore
    [editForm,];
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "admin",
    });
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "buyer",
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
        value: (__VLS_ctx.editForm.state),
        required: true,
    });
    // @ts-ignore
    [editForm,];
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "active",
    });
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "inactive",
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "actions" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.cancelEdit) },
        type: "button",
        ...{ class: "btn" },
        disabled: (__VLS_ctx.loading),
    });
    // @ts-ignore
    [cancelEdit, loading,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ class: "btn primary" },
        type: "submit",
        disabled: (__VLS_ctx.loading),
    });
    // @ts-ignore
    [loading,];
    (__VLS_ctx.loading ? 'Guardando…' : 'Guardar');
    // @ts-ignore
    [loading,];
}
if (__VLS_ctx.showDeleteModal) {
    // @ts-ignore
    [showDeleteModal,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (__VLS_ctx.cancelDelete) },
        ...{ class: "modal-overlay" },
    });
    // @ts-ignore
    [cancelDelete,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal-head" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.cancelDelete) },
        ...{ class: "modal-close" },
    });
    // @ts-ignore
    [cancelDelete,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({});
    (__VLS_ctx.deletingUser?.name);
    // @ts-ignore
    [deletingUser,];
    __VLS_asFunctionalElement(__VLS_elements.br)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "actions" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.cancelDelete) },
        ...{ class: "btn" },
        disabled: (__VLS_ctx.loading),
    });
    // @ts-ignore
    [loading, cancelDelete,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.confirmDelete) },
        ...{ class: "btn danger" },
        disabled: (__VLS_ctx.loading),
    });
    // @ts-ignore
    [loading, confirmDelete,];
    (__VLS_ctx.loading ? 'Eliminando…' : 'Eliminar');
    // @ts-ignore
    [loading,];
}
/** @type {__VLS_StyleScopedClasses['admin-page']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-text']} */ ;
/** @type {__VLS_StyleScopedClasses['top-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['profile']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-name']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-role']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['page-head']} */ ;
/** @type {__VLS_StyleScopedClasses['page-titles']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-head']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['table-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['table']} */ ;
/** @type {__VLS_StyleScopedClasses['role']} */ ;
/** @type {__VLS_StyleScopedClasses['state']} */ ;
/** @type {__VLS_StyleScopedClasses['item-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['modal']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-head']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-close']} */ ;
/** @type {__VLS_StyleScopedClasses['form-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['modal']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-head']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-close']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
