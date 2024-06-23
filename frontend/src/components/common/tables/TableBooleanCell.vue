<template>
    <div
        :class="[$style.TableBooleanCell, classList]"
    >
        {{ value ? trueLabel : falseLabel }}
    </div>
</template>

<script>
export default {
    name: 'TableBooleanCell',
};
</script>

<script setup>
// Vue
import { useCssModule, computed } from 'vue';

const $style = useCssModule();

const $props = defineProps({
    value: {
        type: Boolean,
        default: false,
    },

    trueLabel: {
        type: String,
        default: 'Да',
    },

    falseLabel: {
        type: String,
        default: 'Нет',
    },
});

// Computed
const classList = computed(() => ({
    [$style._active]: $props.value,
}));
</script>

<style lang="scss" module>
    .TableBooleanCell {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 3.2rem;
        padding: 0 1.6rem;
        border-radius: .8rem;
        font-size: 1.2rem;
        font-weight: 500;
        background-color: $base-400;
        color: $white;
        text-align: center;
        user-select: none;
        pointer-events: none;

        /* --- Modificators --- */
        &._active {
            background-color: $success-500;
        }
    }
</style>
