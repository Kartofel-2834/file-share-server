<template>
    <component
        :is="tag"
        :class="[$style.VButtonIcon, classList]"
    >
        <slot>
            <VIcon
                v-if="icon"
                :name="icon"
                :size="iconSize"
            />
        </slot> 
    </component>
</template>

<script>
export default {
    name: 'VButtonIcon',
};
</script>

<script setup>
// Vue
import { defineAsyncComponent, computed, useCssModule } from 'vue';

// UI Components
const VIcon = defineAsyncComponent(() => import('@/components/ui/icon/VIcon.vue'));

// Props
const $props = defineProps({
    tag: {
        type: String,
        default: 'button',
    },

    color: {
        type: String,
        default: 'primary',
        validator: v => [
            'primary',
        ].includes(v),
    },

    size: {
        type: String,
        default: 'size-56',
        validator: v => [
            'size-56',
            'size-72',
        ].includes(v),
    },


    icon: {
        type: String,
        default: 'heart',
    },

    iconSize: {
        type: String,
        default: 'size-28',
    },

    disabled: Boolean,
});

const $style = useCssModule();

// Computed
const classList = computed(() => ({
    [$style._disabled]: $props.disabled,
    [$style[`_${$props.color}`]]: $props.color,
    [$style[`_${$props.size}`]]: $props.size,
}));
</script>

<style lang="scss" module>
    .VButtonIcon {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100rem;
        border: 1px solid transparent;
        transition: $default-transition;
        cursor: pointer;
        user-select: none;

        /* --- Sizes --- */
        &._size-56 {
            width: 5.6rem;
            height: 5.6rem;
        }

        &._size-72 {
            width: 7.2rem;
            height: 7.2rem;
        }

        /* --- Colors --- */
        &._primary {
            background-color: $primary;
            color: $white;

            &:hover:not(:active) {
                background-color: $primary-hover;
            }

            &:active {
                background-color: $primary-active;
            }

            &._disabled {
                background-color: $base-300;
            }
        }

        /* --- Modificators --- */
        &._disabled {
            pointer-events: none;
        }
    }
</style>
