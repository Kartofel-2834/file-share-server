<template>
    <div :class="$style.IndexPage">
        <VButtonIcon
            v-if="!$user.isSimpleUser"
            :class="$style.addFileButton"
            size="size-72"
            icon="plus"
            icon-size="size-36"
            @click="openModal"
        />
    </div>
</template>

<script>
export default {
    name: 'IndexPage',
};
</script>

<script setup>
// Vue
import { onMounted, ref, defineAsyncComponent } from 'vue';

// Store
import { useUserStore } from '@/stores/user';
import { useModalStore } from '@/stores/modal';

// Composables
import { useApi } from '@/composables/api';
import { useAxios } from '@/composables/axios';
import { useNotify } from '@/composables/notify';

// Modals
const ModalFileAdd = defineAsyncComponent(() => import('@/components/layouts/modal/ModalFileAdd.vue'));

// UI Components
const VButtonIcon = defineAsyncComponent(() => import('@/components/ui/button/VButtonIcon.vue'));

const $user = useUserStore();
const $modal = useModalStore();

const $api = useApi();
const $axios = useAxios();
const $notify = useNotify();

const files = ref([]);
const isLoading = ref(false);

// Lifecycle hooks
onMounted(() => {
    fetchFiles();
});

// Methods
async function fetchFiles() {
    isLoading.value = true;

    try {
        const { data } = await $axios.get($api.files.list);
        
        files.value = Array.isArray(data) ? data : [];
    } catch (err) {
        $notify.parseError(err);
        console.warn('[IndexPage/fetchFiles] request failed: ', err);
    } finally {
        isLoading.value = false;
    }
}

function openModal() {
    $modal.open({
        component: ModalFileAdd,
    });
}
</script>

<style lang="scss" module>
    .IndexPage {
       position: relative;
       min-height: 100dvh;
    }

    .addFileButton {
        position: absolute;
        right: 4rem;
        bottom: 4rem;
    }
</style>
