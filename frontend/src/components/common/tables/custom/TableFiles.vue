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
        <template #actions="{ item: file }">
            <VButton
                v-if="getDownloadLink(file)"
                :href="getDownloadLink(file)"
                tag="a"
                target="_blank"
                size="size-36"
            >
                Скачать
            </VButton>

            <VButton
                v-if="checkIsDeleteAllowed(file)"
                color="error"
                size="size-36"
                @click="openDeleteModal(file)"
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
import { useModalStore } from '@/stores/modal';

// Composables
import { apiUrl } from '@/composables/axios';

// Modals
const ModalAccept = defineAsyncComponent(() => import('@/components/layouts/modal/ModalAccept.vue'));

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
const $modal = useModalStore();

// Computed
const updatedFields = computed(() => {
    const result = { ...filesTableFields };

    if (!$user.isAdmin) {
        delete result.is_viewed;
        delete result.is_downloaded;
    }

    return result;
});

// Methods
function checkIsDeleteAllowed(file) {
    return $user.isAdmin || (file?.owner_id && file?.owner_id === $user.data.id);
}

function getDownloadLink(file) {
    if (!window) {
        return null;
    }

    const token = window?.localStorage?.getItem('accessToken');

    if (!token || !file?.id) {
        return null;
    }

    return `${apiUrl}files/${file.id}/content/?token=${encodeURIComponent(token)}`;
}

function openDeleteModal(file) {
    $modal.open({
        component: ModalAccept,
        attributes: {
            onAccept: () => alert(file.id),
            onReject: $modal.close,
        },
    });
}
</script>

<style lang="scss" module>
    .TableFiles:global(.v-table) {
        :global {
            .v-table-cell_actions .v-table-cell-content {
                flex-direction: column;
            }
        }
    }
</style>
