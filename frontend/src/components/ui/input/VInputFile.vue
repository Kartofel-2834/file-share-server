<template>
    <label :class="[$style.VInputFile, 'v-input-file', classList]">
        <input
            ref="fileInput"
            :class="[$style.input, 'v-input-file-target']"
            type="file"
            v-bind="$attrs"
            @change="onChange"
            @cancel="$emit('blur', $event)"
        />

        <div :class="$style.filename">
            <div :class="$style.text">
                <slot
                    :file="value"
                    :placeholder="placeholder"
                    name="filename"
                >
                    {{ value?.name || placeholder }}
                </slot>
            </div>
        </div>

        <VButton
            :class="[$style.button, 'v-input-file-button']"
            :color="error ? 'error' : 'primary'"
            :disabled="disabled"
            tag="div"
            size="size-48"
        >
            <slot name="button-text">
                Выбрать
            </slot>
        </VButton>
    </label>
</template>

<script>
export default {
    name: 'VInputFile',
};
</script>

<script setup>
// Vue
import { ref, defineAsyncComponent, watch, computed, useCssModule, nextTick } from 'vue';

// UI components
const VButton = defineAsyncComponent(() => import('@/components/ui/button/VButton.vue'));

// Props
const $props = defineProps({
    value: {
        type: Object,
        default: null,
    },

    placeholder: {
        type: String,
        default: 'Файл',
    },

    size: {
        type: String,
        default: 'size-48',
        validator: v => [
            'size-48',
        ].includes(v),
    },

    error: Boolean,
    disabled: Boolean,
});

const $emit = defineEmits(['input', 'change', 'blur']);
const $style = useCssModule();

const fileInput = ref(null);

// Computed
const classList = computed(() => ({
    [$style[`_${$props.size}`]]: $props.size,
    [$style._noFile]: !($props.value instanceof File),
    [$style._error]: $props.error,
    [$style._disabled]: $props.disabled,
}));

// Watchers
watch(() => $props?.value, async (newValue, oldValue) => {
    if (oldValue === undefined) {
        await nextTick();
    }

    if (!fileInput.value) {
        return;
    }

    if (!(newValue instanceof File)) {
        return fileInput.value.value = '';
    }

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(newValue);
    
    fileInput.value.files = dataTransfer.files;
}, {
    immediate: true,
});

// Methods
function onChange(event) {
    event.preventDefault();

    if ($props.disabled) {
        return;
    }

    const file = event?.target?.files?.[0] ?? null;

    $emit('input', file);
    $emit('change', file);
}
</script>

<style lang="scss" module>
    .VInputFile {
        display: flex;
        align-items: center;
        cursor: pointer;

        /* --- Sizes --- */
        &._size-48 {
            height: 4.8rem;
        }

        /* --- Modificators --- */
        &._noFile {
            .filename {
                color: $base-400;
            }
        }

        &._error {
            .filename {
                border-color: $error-500;
            }
        }

        &._disabled {
            user-select: none;
            pointer-events: none;
            opacity: .6;

            .filename {
                color: $base-300;
            }
        }

        .button:global(.v-button) {
            height: 100%;
            border-radius: 0 .8rem .8rem 0;
        }

        &:not(._error):hover {
            .filename {
                border-color: $base-400;
            }
        }
    }
    
    .filename {
        overflow: hidden;
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 0 2rem;
        border-radius: .8rem 0 0 .8rem;
        border: 2px solid $base-300;
        border-right: 0;
        font-size: 1.6rem;
        font-weight: 500;
        pointer-events: none;
        transition:
            color $default-transition,
            border-color $default-transition;

        @include respond-to(mobile) {
            font-size: 16px;
        }
    }

    .text {
        @include text-ellipsis(1);
    }

    .input {
        display: none;
    }
</style>
