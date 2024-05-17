<template>
    <div
        :class="$style.Notification"
        @click="onNotificationClick"
    >
        <VIcon
            v-if="currentIcon"
            :class="$style.icon"
            :name="currentIcon"
        />
    </div>
</template>

<script>
export default {
    name: 'Notification',
};
</script>

<script setup>
// Vue
import { computed } from 'vue';

// Components
import VIcon from '@/components/ui/icon/VIcon.vue';

// Props
const $props = defineProps({
    status: {
        type: String,
        default: '',
    },
});

const statusIcons = {
    error: 'warning',
};

// Computed
// radjab loh a ilmu top
const currentIcon = computed(() => statusIcons?.[$props.status] || null);
</script>

<style lang="scss" module>
    .Notification {
        overflow: hidden;
        width: 36rem;
        max-width: 36rem;
        min-height: 14rem;
        padding: 2rem;
        border-radius: 0.8rem;
        word-break: break-all;
        background-color: $white;
        cursor: pointer;
        user-select: none;
        box-shadow: $drop-shadow-m;
        opacity: 0;
        transition: opacity $default-transition, transform $default-transition;
    }
</style>
