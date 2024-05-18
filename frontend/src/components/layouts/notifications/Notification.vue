<template>
    <div
        :class="[$style.Notification, classList]"
        @click="onNotificationClick"
    >
        <div
            v-if="title"
            :class="$style.title"
            v-html="title"
        />
        
        <div
            v-if="description"
            :class="$style.description"
            v-html="description"
        />

        <VIcon
            v-if="currentIcon"
            :class="$style.icon"
            :name="currentIcon"
            :size="iconSize"
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
import { computed, useCssModule } from 'vue';

// Components
import VIcon from '@/components/ui/icon/VIcon.vue';

const statusIcons = {
    error: 'warning',
    info: 'info',
    success: 'check',
};

// Props
const $props = defineProps({
    title: {
        type: String,
        default: '',
    },

    description: {
        type: String,
        default: '',
    },

    status: {
        type: String,
        default: 'error',
    },

    iconSize: {
        type: String,
        default: 'size-36',
    },
});

const $style = useCssModule();

// Computed
// radjab loh a ilmu top
const currentIcon = computed(() => statusIcons?.[$props.status] || null);

const classList = computed(() => ({
    [$style[`_${$props.status}`]]: $props.status,
}));
</script>

<style lang="scss" module>
    .Notification {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        width: 36rem;
        max-width: 36rem;
        min-height: 8rem;
        padding: 2rem;
        border-radius: 0.8rem;
        background-color: $white;
        cursor: pointer;
        user-select: none;
        box-shadow: $drop-shadow-m;
        opacity: 0;
        transition: opacity $default-transition, transform $default-transition;

        /* --- Modificators --- */
        &._error {
            .icon {
                color: $error-500;
            }
        }

        &._success {
            .icon {
                color: $success-500;
            }
        }

        &._info {
            .icon {
                color: $primary;
            }
        }
    }

    .icon {
        flex-shrink: 0;
        margin-top: 1rem;
        margin-left: auto;
    }

    .title,
    .description {
        hyphens: auto;
        word-break: break-word;
    }

    .title {
        @include text(p, 1);
        @include text-ellipsis(3);

        font-weight: 500;
    }

    .description {
        @include text(p, 3);
        @include text-ellipsis(4);

        margin-top: 1.4rem;
        line-height: 112%;
        color: $base-500;
    }
</style>
