<template>
    <AuthWrapper :class="[$style.RecoveryPage, classList]">
        <template #title>
            Восстановление пароля
        </template>

        <InfoPane :class="$style.infoPane">
            Эта опция доступна только администраторам
        </InfoPane>

        <VForm
            :class="$style.form"
            :values="values"
            :fields="recoveryFormFields"
            :loading="isLoading"
            @submit="onFormSubmit"
            @change="values = $event"
            @validate="isFormValid = $event"
        >
            <template #submit="{ loading, onSubmit }">
                <VButton
                    :class="$style.submitButton"
                    :disabled="isSubmitDisabled"
                    :loading="loading"
                    size="size-56"
                    @click="onSubmit"
                >
                    {{ submitText }}
                </VButton>
            </template>
        </VForm>
    </AuthWrapper>
</template>

<script>
export default {
    name: 'RecoveryPage',
};
</script>

<script setup>
// Vue
import { defineAsyncComponent, ref, computed, useCssModule } from 'vue';
import { useRouter } from 'vue-router';

// Constants
import { recoveryFormFields } from '@/assets/constants/form-constants';
import { emailSendMessages, passwordChangeMessages } from '@/assets/constants/message-constants';

// Utils
import { parseError } from '@/assets/utils/request-utils';

// Composables
import { useApi } from '@/composables/api';
import { useAxios } from '@/composables/axios';
import { useNotify } from '@/composables/notify';
import { useTimer } from '@/composables/timer';

// Components
const AuthWrapper = defineAsyncComponent(() => import('@/components/pages/auth/AuthWrapper.vue'));
const InfoPane = defineAsyncComponent(() => import('@/components/common/InfoPane.vue'));

// UI Components
const VForm = defineAsyncComponent(() => import('@/components/ui/form/VForm.vue'));
const VButton = defineAsyncComponent(() => import('@/components/ui/button/VButton.vue'));

const $style = useCssModule();

const $api = useApi();
const $axios = useAxios();
const $notify = useNotify();
const $codeTimer = useTimer();
const $router = useRouter();

const values = ref({});
const isLoading = ref(false);
const isFormValid = ref(false);
const isCodeSended = ref(false);

// Computed
const classList = computed(() => ({
    [$style._withCode]: isCodeSended.value,
}));

const isCodeValid = computed(() => /^[0-9]{4}$/.test(values.value?.code));

const isSubmitDisabled = computed(() => {
    if (isLoading.value) {
        return true;
    }

    if (!isFormValid.value) {
        return true;
    }

    if (isCodeSended.value && isCodeValid.value) {
        return false;
    }
    
    return Boolean($codeTimer.time.value);
});

const submitText = computed(() => {
    if (isCodeValid.value && isCodeSended.value) {
        return 'Восстановить пароль';
    }
    
    if ($codeTimer.time.value) {
        return `Выслать код повторно ${$codeTimer.formattedTime.value}`;
    }

    return 'Получить код подтверждения';
});

// Methods
async function onFormSubmit(values) {
    if (isSubmitDisabled.value) {
        return;
    }

    try {
        isLoading.value = true;

        if (isCodeSended.value) {
            await changePassword();
        } else {
            await sendEmailCode();
        }
    } catch (err) {
        const { title, description } = parseError(err);
        
        $notify.error(title, description);
        console.warn('[RecoveryPage/onFormSubmit] request failed: ', err);
    } finally {
        isLoading.value = false;
    }
}

async function changePassword() {
    await $axios.post($api.auth.passwordRecovery, values.value);

    $notify.success(passwordChangeMessages.title, passwordChangeMessages.description, 5000);
    $router.push('/auth/login/');
}

async function sendEmailCode() {
    await $axios.post($api.auth.emailVerify, {
        login: values.value.login,
    });

    isCodeSended.value = true;
    
    $codeTimer.start(60);
    $notify.info(emailSendMessages.title, emailSendMessages.description, 15000);
}
</script>

<style lang="scss" module>
    .RecoveryPage:global(.auth-wrapper) {
        :global(.auth-wrapper-title) {
            margin-bottom: 4rem;
        }

        /* --- Modificators --- */
        &._withCode {
            .form :global(.v-form-field_code) {
                opacity: 1;
                pointer-events: all;
            }
        }
    }

    .infoPane {
        margin-bottom: 3rem;
    }

    .form :global(.v-form-field_code) {
        opacity: 0;
        pointer-events: none;
    }

    .submitButton {
        width: 100%;
        margin-top: 4rem;
    } 
</style>
