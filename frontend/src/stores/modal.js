// Store
import { defineStore } from 'pinia';

// Vue
import { ref, shallowRef } from 'vue';

// Modal config
// - wrapper: Компонент обертка для модалки | по-умолчанию: ModalWrapper
// - attributes: атрибуты прокидываемые в wrapper модалки | по-умолчанию: {}
// - zIndex: z-index модалки | по-умолчанию: 100

export const useModalStore = defineStore('modal', () => {
    const modalComponent = shallowRef(null);
    const modalWrapper = shallowRef(null);

    const isOpen = ref(false);
    const data = ref({
        config: {},
        attributes: {},
    });

    // Methods 
    function open({ component = null, attributes = {}, config = {} }) {
        isOpen.value = true;
        modalComponent.value = component;
        
        if (config?.wrapper) {
            modalWrapper.value = config.wrapper;
            delete config.wrapper;
        }

        data.value = {
            attributes,
            config,
        };
    }

    function close() {
        isOpen.value = false;
    }

    return {
        data,
        isOpen,
        component: modalComponent,
        wrapper: modalWrapper,

        open,
        close,
    };
});
