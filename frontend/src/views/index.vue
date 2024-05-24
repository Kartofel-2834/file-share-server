<template>
    <div :class="$style.IndexPage">
        INDEX {{ files }}
    </div>
</template>

<script>
export default {
    name: 'IndexPage',
};
</script>

<script setup>
// Vue
import { onMounted, ref } from 'vue';

// Composables
import { useApi } from '@/composables/api.js';
import { useAxios } from '@/composables/axios.js';
import { useNotify } from '@/composables/notify.js';

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
       //
    }
</style>
