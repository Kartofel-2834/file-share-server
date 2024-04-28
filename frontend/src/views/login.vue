<template>
    <div :class="$style.LoginPage">
        <div :class="$style.loginForm">
            <h1 :class="$style.title">
                Авторизация
            </h1>

            <VForm
                :values="values"
                :fields="loginFields"
                @change="values = $event"
                @submit="onSubmit"
            >
                <template #submit-text>
                    Вход
                </template>
            </VForm>
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
import { loginFields } from '@/assets/constants/form-constants.js';

// Components
const VForm = defineAsyncComponent(() => import('@/components/ui/form/VForm.vue'));

// Data
const values = ref({});

// Methods
function onSubmit(values) {
    alert(2);
    console.log(values);
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
        min-width: 48rem;
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
</style>
