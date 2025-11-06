import { ref, onMounted } from 'vue';
import { fetchCartWithEventDetails } from '@/services/cart-with-events.service';
import { CartService } from '@/services/compra.service';
import '@/assets/styles/views/cart.css';
const cart = ref([]);
const loading = ref(true);
// 🔹 Modal de pago
const showPaymentModal = ref(false);
const selectedItem = ref(null); // item que se va a pagar
const processingPayment = ref(false);
// 🔹 Acciones
async function removeItem(item) {
    try {
        await CartService.delete(item.id);
        cart.value = cart.value.filter(c => c.id !== item.id);
    }
    catch (err) {
        console.error('Error al eliminar item del carrito:', err);
    }
}
// 🔹 Abrir modal de pago
function openPaymentModal(item) {
    selectedItem.value = item;
    showPaymentModal.value = true;
}
// 🔹 Confirmar pago
async function confirmPayment() {
    if (!selectedItem.value)
        return;
    processingPayment.value = true;
    try {
        await CartService.pay(selectedItem.value.id);
        cart.value = cart.value.filter(c => c.id !== selectedItem.value.id);
        showPaymentModal.value = false;
        selectedItem.value = null;
    }
    catch (err) {
        console.error('Error al procesar el pago:', err);
    }
    finally {
        processingPayment.value = false;
    }
}
// 🔹 Cancelar pago
function cancelPayment() {
    showPaymentModal.value = false;
    selectedItem.value = null;
}
// 🔹 Traer datos al montar
onMounted(async () => {
    loading.value = true;
    cart.value = await fetchCartWithEventDetails();
    loading.value = false;
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
    ...{ class: "cart-section" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "card" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "card-head" },
});
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "empty" },
    });
}
if (!__VLS_ctx.loading && __VLS_ctx.cart.length) {
    // @ts-ignore
    [loading, cart,];
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
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({});
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({});
    __VLS_asFunctionalElement(__VLS_elements.tbody, __VLS_elements.tbody)({});
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.cart))) {
        // @ts-ignore
        [cart,];
        __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({
            key: (item.id),
        });
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        (item.nombre);
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        (item.precio.toFixed(2));
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        (item.fecha);
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        (item.lugar);
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        (item.quantity);
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        ((item.precio * item.quantity).toFixed(2));
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
            ...{ class: "item-actions" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.loading && __VLS_ctx.cart.length))
                        return;
                    __VLS_ctx.removeItem(item);
                    // @ts-ignore
                    [removeItem,];
                } },
            ...{ class: "btn danger" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.loading && __VLS_ctx.cart.length))
                        return;
                    __VLS_ctx.openPaymentModal(item);
                    // @ts-ignore
                    [openPaymentModal,];
                } },
            ...{ class: "btn primary" },
            disabled: (item.pagado),
        });
        (item.pagado ? 'Pagado' : 'Comprar');
    }
}
if (!__VLS_ctx.loading && __VLS_ctx.cart.length === 0) {
    // @ts-ignore
    [loading, cart,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "empty" },
    });
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "actions" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('close-cart');
            // @ts-ignore
            [$emit,];
        } },
    ...{ class: "btn secondary" },
});
if (__VLS_ctx.showPaymentModal) {
    // @ts-ignore
    [showPaymentModal,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal-overlay" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal-content" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "card-head" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({});
    (__VLS_ctx.selectedItem?.nombre);
    // @ts-ignore
    [selectedItem,];
    ((__VLS_ctx.selectedItem?.precio * __VLS_ctx.selectedItem?.quantity).toFixed(2));
    // @ts-ignore
    [selectedItem, selectedItem,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal-actions" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.cancelPayment) },
        ...{ class: "btn" },
        disabled: (__VLS_ctx.processingPayment),
    });
    // @ts-ignore
    [cancelPayment, processingPayment,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.confirmPayment) },
        ...{ class: "btn primary" },
        disabled: (__VLS_ctx.processingPayment),
    });
    // @ts-ignore
    [processingPayment, confirmPayment,];
    (__VLS_ctx.processingPayment ? 'Procesando...' : 'Confirmar');
    // @ts-ignore
    [processingPayment,];
}
/** @type {__VLS_StyleScopedClasses['cart-section']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-head']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['table-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['table']} */ ;
/** @type {__VLS_StyleScopedClasses['item-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['card-head']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
