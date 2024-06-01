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
            @change="values = $event"
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

// UI components
const VForm = defineAsyncComponent(() => import('@/components/ui/form/VForm.vue'));

const values = ref({});
const isLoading = ref(false);

// Methods
function onSubmit() {
    console.log('submit');
}
</script>

<style lang="scss" module>
    .ModalFileAdd {
        //
    }

    .title {
        @include text(h, 4);

        width: 100%;
        margin-bottom: 4rem;
        text-align: center;
    }
</style>
