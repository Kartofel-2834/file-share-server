// Store
import { defineStore } from 'pinia';

// Vue
import { ref, shallowRef } from 'vue';

export const useModalStore = defineStore('modal', () => {
    const modalComponent = ref(null);
    const modalWrapper = shallowRef(null);

    const isOpen = ref(false);
    const data = ref({
        config: {},
        attributes: {},
    });

    // Methods 
    function open({ component = null, attributes = {}, config = {} }) {
        console.log(component);

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
        modalComponent,
        wrapper: modalWrapper,

        open,
        close,
    };
});
