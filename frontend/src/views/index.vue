<template>
    <div :class="$style.IndexPage">
        {{ $user.data }}

        <VButtonIcon
            v-if="!$user.isSimpleUser"
            :class="$style.addFileButton"
            size="size-72"
            icon="plus"
            icon-size="size-36"
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

// Composables
import { useApi } from '@/composables/api.js';
import { useAxios } from '@/composables/axios.js';
import { useNotify } from '@/composables/notify.js';

// UI Components
const VButtonIcon = defineAsyncComponent(() => import('@/components/ui/button/VButtonIcon.vue'));

const $user = useUserStore();

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
