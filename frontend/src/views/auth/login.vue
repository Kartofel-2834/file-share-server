<template>
    <AuthWrapper :class="$style.LoginPage">
        <template #title>
            Авторизация
        </template>

        <VForm
            :values="values"
            :fields="loginFormFields"
            :loading="isLoading"
            @change="onChange"
            @submit="onSubmit"
        >
            <template #submit-text>
                Вход
            </template>
        </VForm>

        <div :class="$style.recoveryMessage">
            Если вы администратор и забыли пароль, то вы можете
            <VLinkLine
                to="/auth/recovery/"
            >
                восстановить пароль
            </VLinkLine>
        </div>
    </AuthWrapper>
</template>

<script>
export default {
    name: 'LoginPage',
};
</script>

<script setup>
// Vue
import { defineAsyncComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

// Constants
import { loginFormFields } from '@/assets/constants/form-constants.js';

// Utils
import { statusMessages } from '@/assets/utils/request-utils';

// Composables
import { useApi } from '@/composables/api.js';
import { useAxios } from '@/composables/axios.js';
import { useNotify } from '@/composables/notify.js';

// Components
const AuthWrapper = defineAsyncComponent(() => import('@/components/pages/auth/AuthWrapper.vue'));

// UI Components
const VForm = defineAsyncComponent(() => import('@/components/ui/form/VForm.vue'));
const VLinkLine = defineAsyncComponent(() => import('@/components/ui/link/VLinkLine.vue'));

const $api = useApi();
const $axios = useAxios();
const $notify = useNotify();
const $router = useRouter();

const values = ref({});
const isLoading = ref(false);

// Methods
async function onSubmit(values) {
    try {
        isLoading.value = true;

        const res = await $axios.post($api.auth.login, values);
        const token = res?.data?.token;

        if (!token?.length) {
            return $notify.error(statusMessages[500], 'отсутствует токен доступа');
        }

        window.localStorage.setItem('accessToken', token);
        $router.push('/');
    } catch (err) {
        $notify.parseError(err);
        console.warn('[LoginPage/onSubmit] request failed: ', err);
    } finally {
        isLoading.value = false;
    }
}

function onChange(newValues) {
    values.value = newValues;
}
</script>

<style lang="scss" module>
    .LoginPage {
       //
    }

    .submit {
        margin-top: 4rem;
        width: 100%;
    }

    .recoveryMessage {
        margin-top: 2rem;
        text-align: center;
        font-size: 1.6rem;
        line-height: 124%;
        color: $base-500;
    }
</style>
