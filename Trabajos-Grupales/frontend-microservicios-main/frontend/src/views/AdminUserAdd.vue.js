import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { UsersService } from '@/services/users.service';
import '@/assets/styles/views/admin-user-add.css';
defineOptions({ name: 'AdminUserAdd' });
const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('buyer');
const loading = ref(false);
const error = ref('');
const success = ref('');
const router = useRouter();
const auth = useAuthStore();
const initials = computed(() => {
    const n = auth.user?.name?.trim() || '';
    const [a = '', b = ''] = n.split(' ');
    return (a[0] || '').concat(b[0] || '').toUpperCase() || 'A';
});
async function onSubmit() {
    error.value = '';
    success.value = '';
    if (!name.value.trim()) {
        error.value = 'Ingresa el nombre completo.';
        return;
    }
    if (!email.value.trim()) {
        error.value = 'Ingresa el correo.';
        return;
    }
    if (password.value.length < 6) {
        error.value = 'La contraseña debe tener al menos 6 caracteres.';
        return;
    }
    loading.value = true;
    try {
        await UsersService.create({
            name: name.value.trim(),
            email: email.value.trim(),
            password: password.value,
            role: role.value,
        });
        success.value = 'Usuario creado correctamente.';
        setTimeout(() => router.back(), 400);
    }
    catch (err) {
        if (typeof err === 'object' && err !== null) {
            const errorObj = err;
            error.value =
                errorObj?.response?.data?.message ||
                    errorObj?.response?.data?.error ||
                    errorObj?.message ||
                    'No se pudo crear el usuario';
        }
        else {
            error.value = 'No se pudo crear el usuario';
        }
    }
    finally {
        loading.value = false;
    }
}
function onCancel() {
    router.back();
}
async function onLogout() {
    await auth.logout();
    router.replace({ name: 'auth.login' });
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
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.router.push('/admin/events');
            // @ts-ignore
            [router,];
        } },
    ...{ class: "btn" },
});
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
if (__VLS_ctx.auth.user) {
    // @ts-ignore
    [auth,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "profile-meta" },
    });
    __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({
        ...{ class: "profile-name" },
    });
    (__VLS_ctx.auth.user.name);
    // @ts-ignore
    [auth,];
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
__VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
    ...{ onSubmit: (__VLS_ctx.onSubmit) },
    ...{ class: "form-grid" },
});
// @ts-ignore
[onSubmit,];
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "text",
    placeholder: "Nombre completo",
    value: (__VLS_ctx.name),
    required: true,
});
// @ts-ignore
[name,];
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "email",
    placeholder: "correo@ejemplo.com",
    required: true,
});
(__VLS_ctx.email);
// @ts-ignore
[email,];
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "password",
    placeholder: "Mínimo 6 caracteres",
    required: true,
});
(__VLS_ctx.password);
// @ts-ignore
[password,];
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
__VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
    value: (__VLS_ctx.role),
    required: true,
});
// @ts-ignore
[role,];
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "admin",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "buyer",
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "actions" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.onCancel) },
    type: "button",
    ...{ class: "btn" },
    disabled: (__VLS_ctx.loading),
});
// @ts-ignore
[onCancel, loading,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ class: "btn primary" },
    type: "submit",
    disabled: (__VLS_ctx.loading),
});
// @ts-ignore
[loading,];
(__VLS_ctx.loading ? 'Guardando…' : 'Agregar');
// @ts-ignore
[loading,];
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
if (__VLS_ctx.success) {
    // @ts-ignore
    [success,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "success" },
    });
    (__VLS_ctx.success);
    // @ts-ignore
    [success,];
}
/** @type {__VLS_StyleScopedClasses['admin-page']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-text']} */ ;
/** @type {__VLS_StyleScopedClasses['top-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
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
/** @type {__VLS_StyleScopedClasses['form-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
