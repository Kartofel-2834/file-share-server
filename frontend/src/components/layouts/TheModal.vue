<template>
    <div
        :class="$style.TheModal"
        :style="currentStyles"
    >
        <!-- Modal overlay -->
        <transition
            name="fade"
            mode="out-in"
        >
            <div
                v-show="$modal.isOpen"
                :class="$style.overlay"
                @click="$modal.close"
            />
        </transition>
        
        <!-- Modal wrapper -->
        <transition name="fade">
            <component
                :is="wrapper"
                v-if="$modal.isOpen && wrapper"
                :class="$style.wrapper"
            >
                <!-- Modal content -->
                <component
                    :is="$modal.component"
                    v-if="$modal?.component"
                    :class="$style.modal"
                />
            </component>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'TheModal',
};
</script>

<script setup>
// Store
import { useModalStore } from '@/stores/modal.js';

// Vue
import { computed, defineAsyncComponent, useCssModule } from 'vue';

// Components
const ModalWrapper = defineAsyncComponent(() => import('@/components/layouts/modal/wrappers/ModalWrapper.vue'));

const $modal = useModalStore();

const $style = useCssModule();

// Mounted
const wrapper = computed(() => $modal.wrapper || ModalWrapper);

const currentStyles = computed(() => ({
    zIndex: $modal.data?.config?.zIndex || 100,
}));
</script>

<style lang="scss" module>
    .TheModal {
        //
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        background-color: #00000066;
    }

    .wrapper {
        position: fixed;
        z-index: 2;
    }
</style>
