<template>
    <VInput
        :class="[$style.VInputPassword, classList]"
        :type="inputType"
        :icon-size="iconSize"
        :error="error"
        @icon-click="toggleType"
    >
        <template #icon>
            <VIcon
                :class="$style.eyeIcon"
                :name="eyeIcon"
                :size="iconSize"
                @click="toggleType"
            />
        </template>
    </VInput>
</template>

<script>
export default {
    name: 'VInputPassword',
};
</script>

<script setup>
// Vue
import { defineAsyncComponent, ref, useCssModule, computed } from 'vue';

// Components
const VInput = defineAsyncComponent(() => import('@/components/ui/input/VInput.vue'));
const VIcon = defineAsyncComponent(() => import('@/components/ui/icon/VIcon.vue'));

// Props
const $props = defineProps({
    iconSize: {
        type: String,
        default: 'size-20',
    },

    eyeIcon: {
        type: String,
        default: 'eye',
    },

    error: Boolean,
});

const $style = useCssModule();

// Data
const inputType = ref('password');

// Computed
const classList = computed(() => ({
    [$style._eyeActive]: inputType.value !== 'password',
    [$style._withError]: $props.error,
}));

// Methods
function toggleType() {
    inputType.value = inputType.value === 'password' ? 'text' : 'password';
}
</script>

<style lang="scss" module>
    .VInputPassword {
        /* --- Modificators --- */
        &._eyeActive {
            .eyeIcon {
                color: $primary-hover;
            }
        }

        &._withError {
            .eyeIcon {
                opacity: 0;
            }
        }
    }

    .eyeIcon:global(.v-icon) {
        color: $base-400;
        cursor: pointer;
        transition:
            opacity $default-transition,
            color $default-transition;
    }
</style>
