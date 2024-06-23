<template>
    <table :class="[$style.VTable, 'v-table']">
        <!-- Header -->
        <thead v-if="fieldsList?.length">
            <tr :class="[$style.headRow, 'v-table-head-row']">
                <slot
                    v-for="field of fieldsList"
                    :name="`${field}-head`"
                    :field="field"
                >
                    <VTableLabel
                        :key="`VTable-${field}-head`"
                        v-bind="getCellAttributes(field)"
                    >
                        {{ fields[field]?.label || field }}
                    </VTableLabel>
                </slot>
            </tr>
        </thead>

        <!-- Rows -->
        <transition-group
            v-if="data?.length"
            tag="tbody"
            name="fade"
        >
            <tr
                v-for="(item, index) of data"
                :key="`VTable_row_${getItemKey(item, index)}`"
                class="v-table-row"
            >
                <!-- Cell -->
                <slot
                    v-for="field of fieldsList"
                    :name="`${field}-cell`"
                    :value="item?.[field]"
                    :item="item"
                    :index="index"
                >
                    <VTableCell
                        :key="`VTable_cell_${getItemKey(item, index)}_field`"
                        v-bind="getCellAttributes(field)"
                        :class="['v-table-cell', `v-table-cell_${field}`]"
                    >
                        <slot
                            :name="`${field}`"
                            :value="item?.[field]"
                            :item="item"
                            :index="index"
                        >
                            {{ getItemLabel(item, field) }}
                        </slot>
                    </VTableCell>
                </slot>
            </tr>
        </transition-group>

        <!-- Footer -->
        <tfoot v-if="$slots?.footer">
            <slot name="footer" />
        </tfoot>
    </table>
</template>

<script>
export default {
    name: 'VTable',
};
</script>

<script setup>
// Vue
import { computed, defineAsyncComponent } from 'vue';

// UI Components
const VTableLabel = defineAsyncComponent(() => import('@/components/ui/table/VTableLabel.vue'));
const VTableCell = defineAsyncComponent(() => import('@/components/ui/table/VTableCell.vue'));

// const $style = useCssModule()

const $props = defineProps({
    fields: {
        type: Object,
        default: () => ({}),
    },

    data: {
        type: Array,
        default: () => [],
    },

    keymap: {
        type: [String, Function],
        default: (item, index) => item?.id || index,
    },

    emptyLabel: {
        type: String,
        default: 'Нет',
    },
});

// Computed
const fieldsList = computed(() => {
    try {
        return [...new Set(Object.keys($props.fields))];
    } catch (err) {
        return [];
    }
});

// Methods
function getItemLabel(item, field) {
    const fieldData = $props.fields?.[field];
    const formatter = fieldData?.formatter;

    if (typeof formatter === 'function') {
        return formatter(item?.[field], item);
    }

    return item?.[field] ?? fieldData?.emptyLabel ?? $props.emptyLabel;
}

function getItemKey(item, index) {
    if (typeof $props.keymap === 'function') {
        return $props.keymap(item, index);
    }

    return item?.[$props.keymap] || index;
}

function getCellAttributes(field) {
    const fieldData = $props.fields?.[field];
    const result = {};

    // Align
    if (['start', 'end'].includes(fieldData?.align)) {
        result.align = fieldData.align;
    }

    // Justify
    if (['start', 'end'].includes(fieldData?.justify)) {
        result.justify = fieldData.justify;
    }

    return result;
}
</script>

<style lang="scss" module>
    .VTable {
        border-spacing: 0;
    }
</style>
