<template>
    <VTable
        :class="$style.TableFiles"
        :data="data"
        :fields="updatedFields"
    >
        <!-- Просматривали ли файл когда-то -->
        <template #is_viewed="{ value }">
            <TableBooleanCell
                :value="value"
            />
        </template>

        <!-- Был ли файл скачан когда-то -->
        <template #is_downloaded="{ value }">
            <TableBooleanCell
                :value="value"
            />
        </template>

        <!-- Действия -->
        <template #actions>
            <VButton size="size-36">
                Скачать
            </VButton>

            <VButton
                color="error"
                size="size-36"
            >
                Удалить
            </VButton>
        </template>
    </VTable>
</template>

<script>
export default {
    name: 'TableFiles',
};
</script>

<script setup>
// Vue
import { defineAsyncComponent, computed } from 'vue';

// Constants
import { filesTableFields } from '@/assets/constants/table-constants';

// Store
import { useUserStore } from '@/stores/user';

// Components
const TableBooleanCell = defineAsyncComponent(() => import('@/components/common/tables/TableBooleanCell.vue'));

// UI Components
const VTable = defineAsyncComponent(() => import('@/components/ui/table/VTable.vue'));
const VButton = defineAsyncComponent(() => import('@/components/ui/button/VButton.vue'));

defineProps({
    data: {
        type: Array,
        default: () => [],
    },
});

const $user = useUserStore();

// Computed
const updatedFields = computed(() => {
    const result = { ...filesTableFields };

    if (!$user.isAdmin) {
        delete result.is_viewed;
        delete result.is_downloaded;
    }

    return result;
});
</script>

<style lang="scss" module>
    .TableFiles {
        //
    }
</style>
