<template>
    <label :class="[$style.VInputCode, 'v-input-code', classList]">
        <input
            ref="input"
            :value="value"
            :class="[$style.input, 'v-input-code-native']"
            type="tel"
            @keydown="onKeydown"
            @focus="onFocus"
            @blur="onBlur"
        />

        <div
            v-for="cellNumber in length"
            :key="`VInputCodeCell_${cellNumber}`"
            :class="[$style.cell, 'v-input-code-cell', getCellClassList(cellNumber)]"
            @click="onCellClick(cellNumber)"
        >
            {{ value?.[cellNumber - 1] || '' }}

            <div
                v-if="placeholder?.[cellNumber - 1]"
                :class="$style.placeholder"
            >
                {{ placeholder[cellNumber - 1] }}
            </div>
        </div>
    </label>
</template>

<script>
export default {
    name: 'VInputCode',
};
</script>

<script setup>
// Vue
import { ref, computed, watch, useCssModule, defineEmits } from 'vue';

// Props
const $props = defineProps({
    value: {
        type: String,
        default: '',
    },

    placeholder: {
        type: String,
        default: '0000',
    },

    length: {
        type: Number,
        default: 4,
    },

    error: {
        type: Boolean,
        default: false,
    },
});

const $emit = defineEmits(['input', 'change', 'focus', 'blur', 'keydown']);
const $style = useCssModule();

// Data
const cursor = ref(0);
const isFocus = ref(false);

const bindedKeys = {
    Backspace: onBackspace,
    ArrowLeft: cursorDown,
    ArrowRight: () => {
        if (cursor.value >= $props.value.length) {
            return;
        }

        cursorUp();
    },
};

// Computed
const classList = computed(() => ({
    [$style._focus]: isFocus.value,
    [$style._error]: $props.error,
}));

// Watch
watch(() => $props.value, onValueUpdate, {
    immediate: true,
});

// Methods
function onValueUpdate(newValue) {
    let updatedValue = `${newValue}`;
    updatedValue = updatedValue.replace(/[^0-9]/g, '');
    updatedValue = updatedValue.slice(0, $props.length);

    if (updatedValue !== newValue) {
        onChange(updatedValue);
    }
}

function getCellClassList(cellNumber) {
    return {
        [$style._target]: cellNumber === cursor.value + 1,
        [$style._empty]: !$props.value?.[cellNumber - 1],
    };
}

function onCellClick(cellNumber) {
    const index = cellNumber - 1;

    if (
        isNaN(index) ||
        index < 0 ||
        index > $props.value.length ||
        index >= $props.length
    ) {
        return;
    }

    cursor.value = index;
}

function onFocus(event) {
    isFocus.value = true;
    $emit('focus', event);
}

function onBlur(event) {
    isFocus.value = false;
    $emit('blur', event);
}

function onChange(newValue) {
    $emit('input', newValue);
    $emit('change', newValue);
}

function onKeydown(event) {
    const { key } = event;

    event.preventDefault();
    $emit('keydown', event);

    if (/^[0-9]$/.test(key)) {
        return onInput(key);
    }

    if (!bindedKeys?.[key]) {
        return;
    }

    bindedKeys[key]();
}

function onInput(key = '') {
    const offset = Number($props.value.length < $props.length);
    const updatedValue = $props.value.slice(0, cursor.value + offset) + key + $props.value.slice(cursor.value + offset);

    onChange(updatedValue.slice(0, $props.length));
    cursorUp();
}

function onBackspace() {
    const updatedValue = $props.value.slice(0, cursor.value) + $props.value.slice(cursor.value + 1);

    onChange(updatedValue);
    cursorDown();
}

function cursorUp() {
    cursor.value += Number(cursor.value < $props.length - 1);
}

function cursorDown() {
    cursor.value -= Number(cursor.value > 0);
}
</script>

<style lang="scss" module>
    @keyframes cursor {
        0% {
            opacity: 1;
        }

        50% {
            opacity: 0;
        }

        100% {
            opacity: 1;
        }
    }

    .VInputCode {
        display: grid;
        grid-auto-columns: 1fr;
        grid-template-rows: 1fr;
        grid-auto-flow: column;
        height: 4.8rem;
        border-radius: .8rem;
        border: 2px solid $base-300;
        font-size: 1.6rem;
        font-weight: 500;
        transition:
            opacity $default-transition,
            border-color $default-transition;

        &._error {
            border-color: $error-500;
        }

        &._focus {
            &:not(._error) {
                border-color: $base-400;
            }

            // Cursor display
            .cell._target {
                &:after {
                    display: block;
                }

                &._empty {
                    .placeholder {
                        opacity: 0;
                    }
                }
            }
        }
    }

    .input {
        position: absolute;
        width: 0;
        height: 0;
        opacity: 0;
    }

    .cell {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1em;
        font-weight: inherit;
        user-select: none;

        // Cursor
        &:after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            display: none;
            width: 1px;
            height: 1em;
            background-color: $base-600;
            transform: translate(-50%, -50%);
            animation: cursor 1.2s step-start infinite;
            animation-delay: .6s;
        }

        // Separator
        &:not(:last-child):before {
            content: "";
            position: absolute;
            top: 50%;
            right: 0;
            width: 1px;
            height: 1.2rem;
            border-radius: 100rem;
            background-color: $base-300;
            transform: translateY(-50%);
        }

        &._empty {
            .placeholder {
                opacity: 1;
            }
        }

        &._target {
            &:not(._empty) {
                &:after {
                    transform: translate(calc(-50% + .6rem), -50%);
                }
            }
        }

        @include respond-to(mobile) {
            font-size: 16px;
        }
    }

    .placeholder {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 1em;
        font-weight: inherit;
        color: $base-400;
        opacity: 0;
        transform: translate(-50%, -50%);
    }
</style>
