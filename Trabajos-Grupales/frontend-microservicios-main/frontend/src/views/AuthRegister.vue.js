import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { UsersService } from '@/services/users.service';
import '@/assets/styles/views/auth-register.css';
defineOptions({ name: 'AuthRegister' });
const name = ref('');
const email = ref('');
const password = ref('');
const confirm = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');
const router = useRouter();
const FIXED_ROLE = 'buyer';
async function onSubmit() {
    error.value = '';
    success.value = '';
    if (!name.value.trim()) {
        error.value = 'Ingresa tu nombre y apellido.';
        return;
    }
    if (password.value.length < 6) {
        error.value = 'La contraseña debe tener al menos 6 caracteres.';
        return;
    }
    if (password.value !== confirm.value) {
        error.value = 'Las contraseñas no coinciden.';
        return;
    }
    loading.value = true;
    try {
        await UsersService.create({
            name: name.value.trim(),
            email: email.value.trim(),
            password: password.value,
            role: FIXED_ROLE,
        });
        success.value = 'Registro completado. Ahora puedes iniciar sesión.';
        setTimeout(() => router.replace('/auth/login'), 600);
    }
    catch (err) {
        if (typeof err === 'object' && err !== null) {
            const axiosErr = err;
            error.value =
                axiosErr?.response?.data?.message ||
                    axiosErr?.response?.data?.error ||
                    axiosErr?.message ||
                    'Error al registrar usuario';
        }
        else {
            error.value = 'Error al registrar usuario';
        }
    }
    finally {
        loading.value = false;
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "auth-grid" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "auth-illustration" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "./images/register/register-illustration.svg",
    alt: "Registro de usuario",
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "auth-panel" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "card" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "card-head" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "subtitle" },
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
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "password",
    placeholder: "Repite la contraseña",
    required: true,
});
(__VLS_ctx.confirm);
// @ts-ignore
[confirm,];
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "hidden",
    value: (__VLS_ctx.FIXED_ROLE),
});
// @ts-ignore
[FIXED_ROLE,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "actions" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ class: "btn primary" },
    disabled: (__VLS_ctx.loading),
});
// @ts-ignore
[loading,];
(__VLS_ctx.loading ? 'Registrando…' : 'Completar Registro');
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
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "hint" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/auth/login",
}));
const __VLS_2 = __VLS_1({
    to: "/auth/login",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['auth-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-illustration']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-head']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['form-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
