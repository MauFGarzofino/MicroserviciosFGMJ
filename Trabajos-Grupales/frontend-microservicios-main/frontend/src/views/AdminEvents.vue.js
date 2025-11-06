import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { UsersService } from '@/services/users.service';
import { EventoService } from '@/services/eventos.service';
import '@/assets/styles/views/admin.css';
defineOptions({ name: 'AdminEvents' });
const router = useRouter();
const auth = useAuthStore();
const me = ref(null);
const error = ref('');
const loading = ref(false);
// Estado para eventos
const events = ref([]);
const form = ref({ nombre: '', fecha: '', lugar: '', capacidad: 0, precio: 0 });
// Estados para creación
const showCreateModal = ref(false);
// Estados para edición
const showEditModal = ref(false);
const editingEvent = ref(null);
const editForm = ref({ nombre: '', fecha: '', lugar: '', capacidad: 0, precio: 0 });
// Estados para eliminación
const showDeleteModal = ref(false);
const deletingEvent = ref(null);
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
// 🔹 Cargar solo la información del admin logueado
onMounted(async () => {
    try {
        const meRes = await UsersService.getById(auth.userId);
        me.value = meRes.data;
        await loadEvents();
    }
    catch (e) {
        const err = e;
        error.value = err?.response?.data?.message || 'Error cargando datos del usuario';
    }
});
// CRUD Eventos
async function loadEvents() {
    try {
        loading.value = true;
        const data = await EventoService.getAll();
        events.value = data;
    }
    catch (e) {
        const err = e;
        error.value = err?.response?.data?.message || 'Error cargando eventos';
    }
    finally {
        loading.value = false;
    }
}
// 🔹 Abrir modal de creación
function openCreateModal() {
    form.value = { nombre: '', fecha: '', lugar: '', capacidad: 0, precio: 0 };
    showCreateModal.value = true;
}
// 🔹 Crear nuevo evento
async function onCreate() {
    try {
        loading.value = true;
        error.value = '';
        await EventoService.create(form.value);
        await loadEvents();
        showCreateModal.value = false;
    }
    catch (e) {
        const err = e;
        error.value = err?.response?.data?.message || 'No se pudo crear el evento';
    }
    finally {
        loading.value = false;
    }
}
// 🔹 Cancelar creación
function cancelCreate() {
    showCreateModal.value = false;
}
// 🔹 Abrir modal de edición
function openEditModal(ev) {
    editingEvent.value = ev;
    editForm.value = {
        nombre: ev.nombre,
        fecha: ev.fecha,
        lugar: ev.lugar,
        capacidad: ev.capacidad,
        precio: ev.precio,
    };
    showEditModal.value = true;
}
// 🔹 Guardar cambios de edición
async function saveEdit() {
    if (!editingEvent.value)
        return;
    try {
        loading.value = true;
        error.value = '';
        await EventoService.update(editingEvent.value.id, editForm.value);
        await loadEvents();
        showEditModal.value = false;
    }
    catch (e) {
        const err = e;
        error.value = err?.response?.data?.message || 'No se pudo actualizar el evento';
    }
    finally {
        loading.value = false;
    }
}
// 🔹 Cancelar edición
function cancelEdit() {
    showEditModal.value = false;
    editingEvent.value = null;
}
// 🔹 Abrir modal de confirmación de eliminación
function openDeleteModal(ev) {
    deletingEvent.value = ev;
    showDeleteModal.value = true;
}
// 🔹 Confirmar eliminación
async function confirmDelete() {
    if (!deletingEvent.value)
        return;
    try {
        loading.value = true;
        error.value = '';
        await EventoService.delete(deletingEvent.value.id);
        await loadEvents();
        showDeleteModal.value = false;
    }
    catch (e) {
        const err = e;
        error.value = err?.response?.data?.message || 'No se pudo eliminar el evento';
    }
    finally {
        loading.value = false;
    }
}
// 🔹 Cancelar eliminación
function cancelDelete() {
    showDeleteModal.value = false;
    deletingEvent.value = null;
}
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
    ...{ onClick: (__VLS_ctx.openCreateModal) },
    ...{ class: "btn primary" },
});
// @ts-ignore
[openCreateModal,];
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
__VLS_asFunctionalElement(__VLS_elements.hr)({
    ...{ class: "divider" },
});
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
}
else {
    __VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)({
        ...{ class: "list" },
    });
    for (const [ev] of __VLS_getVForSourceType((__VLS_ctx.events))) {
        // @ts-ignore
        [events,];
        __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
            key: (ev.id),
            ...{ class: "list-item" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "item-main" },
        });
        __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({});
        (ev.nombre);
        if (ev.fecha) {
            __VLS_asFunctionalElement(__VLS_elements.small, __VLS_elements.small)({});
            (ev.fecha);
        }
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        if (ev.lugar) {
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
            (ev.lugar);
        }
        (ev.capacidad);
        (ev.precio);
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "item-actions" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    __VLS_ctx.openEditModal(ev);
                    // @ts-ignore
                    [openEditModal,];
                } },
            ...{ class: "btn secondary" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    __VLS_ctx.openDeleteModal(ev);
                    // @ts-ignore
                    [openDeleteModal,];
                } },
            ...{ class: "btn danger" },
        });
    }
    if (__VLS_ctx.events.length === 0) {
        // @ts-ignore
        [events,];
        __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
            ...{ class: "empty" },
        });
    }
}
if (__VLS_ctx.showCreateModal) {
    // @ts-ignore
    [showCreateModal,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (__VLS_ctx.cancelCreate) },
        ...{ class: "modal-overlay" },
    });
    // @ts-ignore
    [cancelCreate,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal-head" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.cancelCreate) },
        ...{ class: "modal-close" },
    });
    // @ts-ignore
    [cancelCreate,];
    __VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
        ...{ onSubmit: (__VLS_ctx.onCreate) },
        ...{ class: "form-grid" },
    });
    // @ts-ignore
    [onCreate,];
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.input)({
        value: (__VLS_ctx.form.nombre),
        type: "text",
        placeholder: "Nombre del evento",
        required: true,
    });
    // @ts-ignore
    [form,];
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.input)({
        type: "date",
    });
    (__VLS_ctx.form.fecha);
    // @ts-ignore
    [form,];
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.input)({
        value: (__VLS_ctx.form.lugar),
        type: "text",
        placeholder: "Lugar",
    });
    // @ts-ignore
    [form,];
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.input)({
        type: "number",
        min: "0",
        step: "1",
        placeholder: "0",
    });
    (__VLS_ctx.form.capacidad);
    // @ts-ignore
    [form,];
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.input)({
        type: "number",
        min: "0",
        step: "0.01",
        placeholder: "0.00",
    });
    (__VLS_ctx.form.precio);
    // @ts-ignore
    [form,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "actions" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.cancelCreate) },
        type: "button",
        ...{ class: "btn" },
        disabled: (__VLS_ctx.loading),
    });
    // @ts-ignore
    [loading, cancelCreate,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ class: "btn primary" },
        type: "submit",
        disabled: (__VLS_ctx.loading),
    });
    // @ts-ignore
    [loading,];
    (__VLS_ctx.loading ? 'Creando…' : 'Crear');
    // @ts-ignore
    [loading,];
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
        value: (__VLS_ctx.editForm.nombre),
        type: "text",
        placeholder: "Nombre del evento",
        required: true,
    });
    // @ts-ignore
    [editForm,];
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.input)({
        type: "date",
    });
    (__VLS_ctx.editForm.fecha);
    // @ts-ignore
    [editForm,];
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.input)({
        value: (__VLS_ctx.editForm.lugar),
        type: "text",
        placeholder: "Lugar",
    });
    // @ts-ignore
    [editForm,];
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.input)({
        type: "number",
        min: "0",
        step: "1",
        placeholder: "0",
    });
    (__VLS_ctx.editForm.capacidad);
    // @ts-ignore
    [editForm,];
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.input)({
        type: "number",
        min: "0",
        step: "0.01",
        placeholder: "0.00",
    });
    (__VLS_ctx.editForm.precio);
    // @ts-ignore
    [editForm,];
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
    [loading, cancelEdit,];
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
    (__VLS_ctx.deletingEvent?.nombre);
    // @ts-ignore
    [deletingEvent,];
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
/** @type {__VLS_StyleScopedClasses['divider']} */ ;
/** @type {__VLS_StyleScopedClasses['list']} */ ;
/** @type {__VLS_StyleScopedClasses['list-item']} */ ;
/** @type {__VLS_StyleScopedClasses['item-main']} */ ;
/** @type {__VLS_StyleScopedClasses['item-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
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
