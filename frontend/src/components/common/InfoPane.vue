<template>
    <div :class="$style.InfoPane">
        <VIcon
            :class="$style.icon"
            :name="icon"
            :size="iconSize"
        />
        
        <div :class="$style.text">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'InfoPane',
};
</script>

<script setup>
// Vue
import { defineAsyncComponent } from 'vue';

// UI Components
const VIcon = defineAsyncComponent(() => import('@/components/ui/icon/VIcon.vue'));

// Props
defineProps({
    icon: {
        type: String,
        default: 'info',
    },

    iconSize: {
        type: String,
        default: 'size-20',
    },
});
</script>

<style lang="scss" module>
    .InfoPane {
        display: flex;
        align-items: center;
        gap: 1.6rem;
        padding: 1.6rem 1.6rem;
        border-radius: .8rem;
        background-color: $base-100;
        color: $base-600;
        user-select: none;
    }

    .text {
        margin: auto;
    }
</style>
