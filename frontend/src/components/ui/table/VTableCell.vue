<template>
    <component
        :is="tag"
        :class="[$style.VTableCell, 'v-table-cell', classList]"
    >
        <div :class="[$style.content, 'v-table-cell-content']">
            <slot />
        </div>
    </component>
</template>

<script>
export default {
    name: 'VTableCell',
};
</script>

<script setup>
// Vue
import { computed, useCssModule } from 'vue';

const $style = useCssModule();

const $props = defineProps({
    tag: { 
        type: String,
        default: 'td',
    },

    align: {
        type: String,
        default: null,
        validator: v => [
            'start',
            'end',
        ].includes(v),
    },

    justify: {
        type: String,
        default: null,
        validator: v => [
            'start',
            'end',
        ].includes(v),
    },
});

const classList = computed(() => ({
    [$style[`_align-${$props.align}`]]: $props.align,
    [$style[`_justify-${$props.justify}`]]: $props.justify,
}));
</script>

<style lang="scss" module>
    .VTableCell {
        border-bottom: 1px solid $base-200;

        /* --- Modificators --- */
        &._justify-start .content {
            justify-content: flex-start;
        }

        &._justify-end .content {
            justify-content: flex-end;
        }

        &._align-start .content {
            align-items: flex-start;
        }

        &._align-end .content {
            align-items: flex-end;
        }
    }

    .content {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: .8rem;
        padding: 1.6rem 2rem;
        font-size: 1.4rem;
    }
</style>
