<template>
    <div :class="$style.LoginPage">
        <div :class="$style.loginForm">
            <h1 :class="$style.title">
                Авторизация
            </h1>

            <VForm
                :values="values"
                :fields="loginFields"
                :loading="isLoading"
                @change="values = $event"
                @submit="onSubmit"
            >
                <template #submit-text>
                    Вход
                </template>
            </VForm>

            <div :class="$style.recoveryMessage">
                Если вы администратор и забыли пароль, то вы можете
                <RouterLink
                    :class="$style.recoveryLink"
                    to="/auth/recovery/"
                >
                    восстановить пароль
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoginPage',
};
</script>

<script setup>
// Vue
import { defineAsyncComponent, ref } from 'vue';

// Constants
import { $api } from '@/assets/constants/api-constants.js';
import { loginFields } from '@/assets/constants/form-constants.js';

// Composables
import { useAxios } from '@/composables/axios.js';
import { useNotify } from '@/composables/notify.js';

// Components
const VForm = defineAsyncComponent(() => import('@/components/ui/form/VForm.vue'));

const $axios = useAxios();
const $notify = useNotify();

const values = ref({});
const isLoading = ref(false);

// Methods
async function onSubmit(values) {
    try {
        isLoading.value = true;

        const res = await $axios.post($api.auth.login);
        console.log(res);
    } catch (err) {
        console.warn('[LoginPage/onSubmit] request failed: ', err);
        $notify.error(`Какая-то ошибка: ${err}`);
    } finally {
        isLoading.value = false;
    }
}
</script>

<style lang="scss" module>
    .LoginPage {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background-color: $base-100;
    }

    .loginForm {
        width: 52rem;
        max-width: 52rem;
        padding: 4rem;
        border-radius: .8rem;
        background-color: $white;
    }

    .title {
        margin-bottom: 8rem;
        font-size: 3.2rem;
        text-align: center;
        line-height: 1;

        @include text(h, 3);
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

    .recoveryLink {
        position: relative;
        display: inline-flex;
        flex-direction: column;
        font-weight: 500;
        color: $primary;
        transition: color $default-transition;

        &:hover {
            &:not(:active) {
                color: $primary-hover;
            }
        
            &:after {
                transform: scaleX(1);
            }
        }
        
        &:after {
            position: absolute;
            bottom: -.4rem;
            content: '';
            width: 100%;
            height: 2px;
            background-color: currentColor;
            color: inherit;
            transform-origin: center;
            transform: scaleX(0);
            transition: transform .2s ease;
        }
    }
</style>
