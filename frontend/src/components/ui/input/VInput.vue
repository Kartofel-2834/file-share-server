<template>
    <label :class="[$style.VInput, 'v-input', classList]">
        <slot name="preicon">
            <VIcon
                v-if="preicon"
                :size="iconSize"
                :name="preicon"
                :class="[$style.icon, 'v-input-icon', $style._left]"
            />
        </slot>

        <div :class="$style.inputWrapper">
            <input
                :class="$style.input"
                :tabindex="0"
                :spellcheck="false"
                :value="value"
                v-bind="$attrs"
                @input="onInput"
                @change="onChange"
                @blur="$emit('blur', $event)"
                @focus="$emit('focus', $event)"
            />
        </div>

        <slot name="icon">
            <VIcon
                v-if="icon"
                :class="[$style.icon, 'v-input-icon', $style._right]"
                :name="icon"
                :size="iconSize"
            />
        </slot>

        <transition name="fade">
            <VIcon
                v-if="errorIcon"
                v-show="!disabled && error"
                :class="[$style.errorIcon, 'v-input-icon', 'v-input-icon_error']"
                :name="errorIcon"
                :size="iconSize"
            />
        </transition>
    </label>
</template>

<script>
export default {
    name: 'VInput',
};
</script>

<script setup>
// Vue
import { computed, defineAsyncComponent, useCssModule } from 'vue';

// Components
const VIcon = defineAsyncComponent(() => import('@/components/ui/icon/VIcon.vue'));

// Emits
const $emit = defineEmits(['input', 'change', 'blur', 'focus']);

// Props
const $props = defineProps({
    value: {
        type: String,
        default: '',
    },

    iconSize: {
        type: String,
        default: 'size-20',
    },

    errorIcon: {
        type: String,
        default: 'error',
    },

    icon: {
        type: String,
        default: '',
    },

    preicon: {
        type: String,
        default: '',
    },

    error: Boolean,
    disabled: Boolean,
});

const $style = useCssModule();

// Computed
const classList = computed(() => ({
    [$style._error]: $props.error,
    [$style._disabled]: $props.disabled,
}));

// Methods
function onInput(event) {
    $emit('input', event.target.value);
}

function onChange(event) {
    $emit('change', event.target.value);
}
</script>

<style lang="scss" module>
    .VInput {
        position: relative;
        display: flex;
        align-items: center;
        height: 4.8rem;
        padding: 0 2rem;
        border-radius: .8rem;
        border: 2px solid $base-300;
        font-size: 1.6rem;
        font-weight: 500;
        transition:
            opacity $default-transition,
            border-color $default-transition;

        &:has(.input:focus) {
            &:not(._error) {
                border-color: $base-400;
            }
        }

        /* --- Modificators --- */
        &._disabled {
            user-select: none;
            pointer-events: none;
            color: $base-300;
            opacity: .6;
        }

        &._error:not(._disabled) {
            border-color: $error-500;

            .input {
                width: calc(100% - 3rem);
            }

            .icon._right {
                opacity: 0;
            }
        }

        @include respond-to(tablet) {
            font-size: 16px;
        }
    }

    .inputWrapper {
        width: 100%;
    }

    .input {
        flex-shrink: 0;
        width: 100%;
        font-size: inherit;
        font-weight: inherit;

        &::placeholder {
            user-select: none;
        }
    }

    .icon {
        color: inherit;
        transition: opacity $default-transition;

        &._left {
            margin-right: .8rem;
        }

        &._right {
            margin-left: .8rem;
        }
    }

    .errorIcon {
        position: absolute;
        right: 2rem;
        z-index: 1;
    }
</style>
