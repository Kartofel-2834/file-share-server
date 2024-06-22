<template>
    <div :class="$style.ModalFileAdd">
        <div :class="$style.title">
            Добавить файл
        </div>

        <VForm
            :values="values"
            :fields="fileAddFields"
            :loading="isLoading"
            :submit-button-attributes="{ size: 'size-48' }"
            @change="onChange"
            @submit="onSubmit"
        >
            <template #submit-text>
                Добавить
            </template>
        </VForm>
    </div>
</template>

<script>
export default {
    name: 'ModalFileAdd',
};
</script>

<script setup>
// Vue
import { ref, defineAsyncComponent } from 'vue';

// Constants
import { fileAddFields } from '@/assets/constants/form-constants';

// Store
import { useModalStore } from '@/stores/modal';

// Composables
import { useApi } from '@/composables/api';
import { useAxios } from '@/composables/axios';
import { useNotify } from '@/composables/notify';

// UI components
const VForm = defineAsyncComponent(() => import('@/components/ui/form/VForm.vue'));

const $modal = useModalStore();

const $axios = useAxios();
const $api = useApi();
const $notify = useNotify();


const values = ref({});
const isLoading = ref(false);

// Methods
function onChange(newValues) {
    const updatedValues = { ...newValues };

    // Если был выбран файл, а поле name еще не заполнено,
    // то заполняем его системным названием файла
    if (
        updatedValues?.file instanceof File &&
        !(values.value?.file instanceof File) &&
        !values.value?.name
    ) {
        updatedValues.name = updatedValues.file.name;
    }

    values.value = updatedValues;
}

async function onSubmit() {
    const formData = new FormData();
    isLoading.value = true;

    try {
        for (const key in values.value) {
            formData.append(key, values.value[key]);
        }

        await $axios.post($api.files.list, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        $modal.close();
        $notify.success('Файл добавлен', 'Выгрузка файла прошла успешно');
    } catch (err) {
        $notify.parseError(err);
        console.warn('[ModalFileAdd/onSubmit] request failed: ', err);
    } finally {
        isLoading.value = false;
    }
}
</script>

<style lang="scss" module>
    .ModalFileAdd {
        width: 36rem;
        max-width: 100%;
    }

    .title {
        @include text(h, 4);

        width: 100%;
        margin-bottom: 4rem;
        text-align: center;
    }
</style>
