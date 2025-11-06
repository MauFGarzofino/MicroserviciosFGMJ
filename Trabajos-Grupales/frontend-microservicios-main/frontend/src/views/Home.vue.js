import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import CartView from './CartView.vue';
import { CartService } from '@/services/compra.service';
import { EventoService } from '@/services/eventos.service';
import { UsersService } from '@/services/users.service';
import '@/assets/styles/views/home.css';
defineOptions({ name: 'HomeView' });
const auth = useAuthStore();
const router = useRouter();
const events = ref([]);
const currentIndex = ref(0);
const showCart = ref(false);
const quantity = ref(1);
const cart = ref([]);
const displayName = ref('');
const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0));
async function loadData() {
    events.value = await EventoService.getAll();
    const compras = await CartService.fetchPending();
    cart.value = compras.map((compra) => {
        const evento = events.value.find((e) => e.id === Number(compra.evento_id));
        return {
            id: compra.id,
            nombre: evento?.nombre || 'Evento desconocido',
            fecha: evento?.fecha || '-',
            lugar: evento?.lugar || '-',
            capacidad: evento?.capacidad || 0,
            precio: evento?.precio || 0,
            quantity: compra.cantidad || 1,
            pagado: Boolean(compra.pagado)
        };
    });
}
async function loadProfileName() {
    try {
        if (auth.name) {
            displayName.value = auth.name;
            return;
        }
        if (auth.userId) {
            const res = await UsersService.getById(auth.userId);
            const data = res.data;
            const name = data?.name || '';
            const email = data?.email || '';
            auth.name = name;
            if (!auth.email)
                auth.email = email;
            displayName.value = name;
        }
    }
    catch {
        // silencioso; mantenemos fallback
    }
}
function prevEvent() {
    if (!events.value.length)
        return;
    currentIndex.value = (currentIndex.value - 1 + events.value.length) % events.value.length;
    quantity.value = 1;
}
function nextEvent() {
    if (!events.value.length)
        return;
    currentIndex.value = (currentIndex.value + 1) % events.value.length;
    quantity.value = 1;
}
async function addToCart(event, qty) {
    const newItem = await CartService.add(event.id, qty);
    if (newItem) {
        const existing = cart.value.find((e) => e.id === newItem.id);
        if (existing) {
            existing.quantity += qty;
        }
        else {
            cart.value.push({
                id: newItem.id,
                evento_id: event.id,
                nombre: event.nombre,
                fecha: event.fecha,
                lugar: event.lugar,
                capacidad: event.capacidad,
                precio: event.precio,
                quantity: qty,
                pagado: false
            });
        }
    }
    quantity.value = 1;
}
async function purchaseCart(item) {
    if (!item)
        return;
    await CartService.pay(item.id);
    cart.value = cart.value.filter((i) => i.id !== item.id);
}
function toggleCart() {
    showCart.value = !showCart.value;
}
async function onLogout() {
    await auth.logout();
    router.replace({ name: 'auth.login' });
}
onMounted(async () => {
    // Asegura que el store tenga userId/role si solo hay token en storage
    try {
        await auth.hydrateFromStorage();
    }
    catch { }
    await loadProfileName();
    await loadData();
    setInterval(loadData, 1000);
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
    ...{ class: "home-page" },
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
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.toggleCart) },
    ...{ class: "btn primary" },
});
// @ts-ignore
[toggleCart,];
(__VLS_ctx.cartCount);
// @ts-ignore
[cartCount,];
if (__VLS_ctx.auth.hasRole(['admin'])) {
    // @ts-ignore
    [auth,];
    const __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    RouterLink;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        to: "/admin",
        ...{ class: "btn primary" },
    }));
    const __VLS_2 = __VLS_1({
        to: "/admin",
        ...{ class: "btn primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const { default: __VLS_4 } = __VLS_3.slots;
    var __VLS_3;
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "profile" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "avatar" },
    'aria-hidden': "true",
});
((__VLS_ctx.displayName && __VLS_ctx.displayName[0]?.toUpperCase()) || 'U');
// @ts-ignore
[displayName, displayName,];
if (__VLS_ctx.auth.userId) {
    // @ts-ignore
    [auth,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "profile-meta" },
    });
    __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({
        ...{ class: "profile-name" },
    });
    (__VLS_ctx.displayName || __VLS_ctx.auth.name || 'Usuario');
    // @ts-ignore
    [auth, displayName,];
    __VLS_asFunctionalElement(__VLS_elements.small, __VLS_elements.small)({
        ...{ class: "profile-role" },
    });
    (__VLS_ctx.auth.role);
    // @ts-ignore
    [auth,];
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
if (__VLS_ctx.showCart) {
    // @ts-ignore
    [showCart,];
    /** @type {[typeof CartView, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(CartView, new CartView({
        ...{ 'onCloseCart': {} },
        ...{ 'onPurchase': {} },
        cart: (__VLS_ctx.cart),
    }));
    const __VLS_6 = __VLS_5({
        ...{ 'onCloseCart': {} },
        ...{ 'onPurchase': {} },
        cart: (__VLS_ctx.cart),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    let __VLS_8;
    let __VLS_9;
    const __VLS_10 = ({ closeCart: {} },
        { onCloseCart: (...[$event]) => {
                if (!(__VLS_ctx.showCart))
                    return;
                __VLS_ctx.showCart = false;
                // @ts-ignore
                [showCart, cart,];
            } });
    const __VLS_11 = ({ purchase: {} },
        { onPurchase: (__VLS_ctx.purchaseCart) });
    // @ts-ignore
    [purchaseCart,];
    var __VLS_7;
}
else {
    __VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)({
        ...{ class: "carousel" },
    });
    if (__VLS_ctx.events.length) {
        // @ts-ignore
        [events,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.prevEvent) },
            ...{ class: "carousel-btn prev" },
        });
        // @ts-ignore
        [prevEvent,];
        for (const [event, index] of __VLS_getVForSourceType((__VLS_ctx.events))) {
            // @ts-ignore
            [events,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                key: (event.id),
                ...{ class: "carousel-slide card" },
                ...{ class: ({
                        'slide-center': index === __VLS_ctx.currentIndex,
                        'slide-left': index === (__VLS_ctx.currentIndex - 1 + __VLS_ctx.events.length) % __VLS_ctx.events.length,
                        'slide-right': index === (__VLS_ctx.currentIndex + 1) % __VLS_ctx.events.length,
                        'slide-back': index !== __VLS_ctx.currentIndex &&
                            index !== (__VLS_ctx.currentIndex - 1 + __VLS_ctx.events.length) % __VLS_ctx.events.length &&
                            index !== (__VLS_ctx.currentIndex + 1) % __VLS_ctx.events.length
                    }) },
            });
            // @ts-ignore
            [events, events, events, events, events, events, currentIndex, currentIndex, currentIndex, currentIndex, currentIndex, currentIndex,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "card-head" },
            });
            (event.nombre);
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "item-main" },
            });
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
            (event.fecha);
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
            (event.lugar);
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
            (event.precio);
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
            (event.capacidad);
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "form-grid" },
            });
            __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
            __VLS_asFunctionalElement(__VLS_elements.input)({
                ...{ style: {} },
                type: "number",
                min: "1",
            });
            (__VLS_ctx.quantity);
            // @ts-ignore
            [quantity,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "actions" },
            });
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.showCart))
                            return;
                        if (!(__VLS_ctx.events.length))
                            return;
                        __VLS_ctx.addToCart(event, __VLS_ctx.quantity);
                        // @ts-ignore
                        [quantity, addToCart,];
                    } },
                ...{ class: "btn secondary" },
            });
        }
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.nextEvent) },
            ...{ class: "carousel-btn next" },
        });
        // @ts-ignore
        [nextEvent,];
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "empty" },
        });
    }
}
/** @type {__VLS_StyleScopedClasses['home-page']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-text']} */ ;
/** @type {__VLS_StyleScopedClasses['top-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['profile']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-name']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-role']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['page-head']} */ ;
/** @type {__VLS_StyleScopedClasses['page-titles']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['carousel']} */ ;
/** @type {__VLS_StyleScopedClasses['carousel-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['prev']} */ ;
/** @type {__VLS_StyleScopedClasses['carousel-slide']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['slide-center']} */ ;
/** @type {__VLS_StyleScopedClasses['slide-left']} */ ;
/** @type {__VLS_StyleScopedClasses['slide-right']} */ ;
/** @type {__VLS_StyleScopedClasses['slide-back']} */ ;
/** @type {__VLS_StyleScopedClasses['card-head']} */ ;
/** @type {__VLS_StyleScopedClasses['item-main']} */ ;
/** @type {__VLS_StyleScopedClasses['form-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['carousel-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['next']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
