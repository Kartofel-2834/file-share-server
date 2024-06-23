<template>
    <component
        :is="tag"
        :class="[$style.VButton, classList, 'v-button']"
    >
        <slot name="preicon">
            <VIcon
                v-if="preicon"
                :class="$style.icon"
                :name="preicon"
                :size="iconSize"
            />
        </slot>

        <div
            v-if="$slots.default"
            :class="[$style.label, 'v-button-label']"
        >
            <slot></slot>
        </div>

        <slot name="icon">
            <VIcon
                v-if="icon"
                :class="$style.icon"
                :name="icon"
                :size="iconSize"
            />
        </slot>

        <transition name="fade">
            <div
                v-if="loading !== null"
                v-show="loading"
                :class="$style.loader"
            >
                <VIcon
                    name="loader"
                    :class="$style.loaderSvg"
                    :size="iconSize"
                />
            </div>
        </transition>
    </component>
</template>

<script>
export default {
    name: 'VButton',
};
</script>

<script setup>
// Vue
import { useCssModule, computed, defineAsyncComponent } from 'vue';

// Components
const VIcon = defineAsyncComponent(() => import('@/components/ui/icon/VIcon.vue'));

const $props = defineProps({
    tag: {
        type: String,
        default: 'button',
        validator: v => [
            'button',
            'div',
            'a',
            'router-link',
        ].includes(v),  
    },

    color: {
        type: String,
        default: 'primary',
        validator: v => [
            'primary',
            'error',
        ].includes(v),
    },

    size: {
        type: String,
        default: 'size-32',
        validator: v => [
            'size-32',
            'size-36',
            'size-48',
            'size-56',
        ].includes(v),
    },

    iconSize: {
        type: String,
        default: 'size-24',
    },

    icon: {
        type: String,
        default: '',
    },

    preicon: {
        type: String,
        default: '',
    },

    loading: {
        type: Boolean,
        default: null,
    },

    disabled: Boolean,
});

const $style = useCssModule();

// Computed
const classList = computed(() => ({
    [$style[`_${$props.color}`]]: $props.color,
    [$style[`_${$props.size}`]]: $props.size,
    [$style._disabled]: $props.disabled,
    [$style._loading]: $props.loading,
}));
</script>

<style lang="scss" module>
    .VButton {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        gap: 1.2rem;
        border-radius: .8rem;
        border: 1px solid transparent;
        font-weight: 500;
        transition: $default-transition;
        cursor: pointer;
        user-select: none;

        /* --- Sizes --- */
        &._size-32 {
            font-size: 1.4rem;
            height: 3.2rem;
            padding: 0 2rem;
        }

        &._size-36 {
            font-size: 1.4rem;
            height: 3.6rem;
            padding: 0 2rem;
        }

        &._size-48 {
            font-size: 1.6rem;
            height: 4.8rem;
            padding: 0 2rem;
        }

        &._size-56 {
            font-size: 1.8rem;
            height: 5.6rem;
            padding: 0 4rem;
        }

        /* --- Colors --- */
        &._primary,
        &._error {
            &._disabled {
                background-color: $base-300;
            }
        }

        &._primary {
            background-color: $primary;
            color: $white;

            &:hover:not(:active) {
                background-color: $primary-hover;
            }

            &:active {
                background-color: $primary-active;
            }
        }

        &._error {
            background-color: $error-500;
            color: $white;
        }

        /* --- Modificators --- */
        &._loading,
        &._disabled {
            pointer-events: none;
        }

        &._loading {
            .icon,
            .label {
                opacity: 0;
            }
        }
    }

    .icon,
    .label {
        transition: opacity $default-transition;
    }

    .label {
        font-size: inherit;
        font-weight: inherit;
    }

    .loader {
        position: absolute;
        top: 50%;
        left: 50%;
        display: flex;
        color: inherit;
        transform: translate(-50%, -50%);
    }

    .loaderSvg {
        animation: rotate 1.8s linear infinite;
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }
    }
</style>
