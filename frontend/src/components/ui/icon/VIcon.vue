<template>
    <component
        :is="currentIcon"
        :class="[$style.VIcon, 'v-icon']"  
        :style="currentStyles"
    />
</template>

<script>
export default {
    name: 'VIcon',
};
</script>

<script setup>
import { defineAsyncComponent, computed } from 'vue';

// Props
const $props = defineProps({
    name: {
        type: String,
        default: null,
    },

    size: {
        type: String,
        default: null,
        validator: v => (
            /^size-[0-9]+$/.test(v) ||
            v === null
        ),
    },
});

// Computed
const currentIcon = computed(() => {
    if (!$props.name || typeof $props.name !== 'string') {
        return 'div';
    }

    return defineAsyncComponent(() => import(`@/components/ui/icon/data/${$props.name}.vue`));
});

const currentStyles = computed(() => {
    if (!$props.size) {
        return null;
    }

    let sizeRem = $props.size ? $props.size.match(/(\d+)/)[0] / 10 : 0;
    sizeRem = sizeRem ? `${sizeRem}rem` : '';
    
    return {
        width: sizeRem,
        height: sizeRem,
    };
});
</script>

<style lang="scss" module>
    .VIcon {
        color: currentColor;
        width: 1em;
        height: 1em;
    }
</style>
