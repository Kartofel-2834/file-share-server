<template>
    <VTableCell
        :class="[$style.VTableLabel, 'v-table-label']"
        tag="th"
    >
        <slot />
    </VTableCell>
</template>

<script>
export default {
    name: 'VTableLabel',
};
</script>

<script setup>
// Vue
import { defineAsyncComponent } from 'vue';

// UI Components
const VTableCell = defineAsyncComponent(() => import('@/components/ui/table/VTableCell.vue'));

defineProps({
    sortable: Boolean,
});
</script>

<style lang="scss" module>
    .VTableLabel:global(.v-table-label) {
        border-bottom: 2px solid $primary;
        user-select: none;
        pointer-events: none;
    }
</style>
