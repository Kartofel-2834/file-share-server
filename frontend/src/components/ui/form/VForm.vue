<template>
    <div :class="[$style.VForm, 'v-form']">
        <!-- Form fields -->
        <transition-group
            :class="[$style.formInputs, 'v-form-inputs']"
            tag="div"
            name="fade"
            mode="out-in"
        >
            <VFormHint
                v-for="field in fieldsList"
                :key="`VFormField_${field}`"
                :class="[$style.field, 'v-form-field', `v-form-field_${field}`]"
                :label="fields?.[field]?.label"
                :description="fields?.[field]?.description"
                :error="typeof errors?.[field] === 'string' ? errors?.[field] : ''"
            >
                <slot
                    :name="`field-${field}`"
                    :value="values?.[field]"
                    :field="fields?.[field]"
                    :error="errors?.[field] || ''"
                    :attributes="getFieldAttributes(field)"
                    :on-input="customValue => onInput(customValue, field)"
                    :on-blur="() => onBlur(field)"
                >
                    <!-- Password field -->
                    <VInputPassword
                        v-if="fields?.[field]?.type === 'password'"            
                        :value="values?.[field]"
                        :error="Boolean(errors?.[field])"
                        v-bind="getFieldAttributes(field)"
                        @input="onInput($event, field)"
                        @blur="onBlur(field)"
                    />

                    <!-- Text field -->
                    <VInput
                        v-else
                        :value="values?.[field]"
                        :error="Boolean(errors?.[field])"
                        v-bind="getFieldAttributes(field)"
                        @input="onInput($event, field)"
                        @blur="onBlur(field)"
                    />
                </slot>
            </VFormHint>
        </transition-group>

        <slot
            name="submit"
            :on-submit="onSubmit"
            :is-form-valid="isFormValid"
            :disabled="!isFormValid"
        >
            <VButton
                v-if="!noSubmit"
                :class="$style.submitButton"
                v-bind="getButtonAttributes()"
                :disabled="!isFormValid"
                @click="onSubmit"
            >
                <slot name="submit-text">
                    Отправить
                </slot>
            </VButton>
        </slot>
    </div>
</template>

<script>
export default {
    name: 'VForm',
};
</script>

<script setup>
// Vue
import { ref, computed, watch, defineAsyncComponent, onMounted } from 'vue';

// Components
const VFormHint = defineAsyncComponent(() => import('@/components/ui/form/VFormHint.vue'));
const VButton = defineAsyncComponent(() => import('@/components/ui/button/VButton.vue'));
const VInput = defineAsyncComponent(() => import('@/components/ui/input/VInput.vue'));
const VInputPassword = defineAsyncComponent(() => import('@/components/ui/input/VInputPassword.vue'));

const $props = defineProps({
    values: {
        type: Object,
        default: () => ({}),
    },

    fields: {
        type: Object,
        default: () => ({}),
    },

    requiredMessage: {
        type: String,
        default: 'Пожалуйста, заполните это поле',
    },

    submitButtonAttributes: {
        type: Object,
        default: (isFormValid, values, errors) => ({
            size: 'size-56',
        }),
    },

    validateOnInput: Boolean,
    noBlurValidate: Boolean,
    noSubmit: Boolean,
});

// Emits
const $emit = defineEmits(['change', 'validate', 'submit']);

// Data
const errors = ref({});
const hiddenErrors = ref({});

// Lifecycle hooks
onMounted(() => {
    validateAll();
});

// Computed
const fieldsList = computed(() => Array.from(new Set(Object.keys($props.fields))));
const isFormValid = computed(() => !fieldsList.value.some(field => Boolean(hiddenErrors.value?.[field])));

// Watch
watch(() => $props.values, () => validateAll());
watch(() => $props.fields, () => validateAll());

// Methods
function onInput(newValue, field) {
    const isInputValidate = $props.fields?.[field]?.validateOnInput || $props.validateOnInput;

    validateField(field, newValue);

    if (isInputValidate || errors.value?.[field]) {
        showErrors([field]);
    }

    $emit('change', {
        ...$props.values,
        [field]: newValue,
    }, hiddenErrors.value);
}

function onBlur(field, newValue = null) {
    const value = newValue || $props.values?.[field];

    if (!value || $props.fields?.[field]?.noBlurValidate) {
        return;
    }

    showErrors([field]);
}

function onSubmit(startSubmitTimer, removeSubmitTimer) {
    if (!isFormValid.value) {
        return;
    }

    $emit('submit', $props.values, errors.value);
}

function showErrors(fieldsList = []) {
    const fieldsNames = Array.isArray(fieldsList) ? fieldsList : [];

    const result = { ...(fieldsNames.length ? errors.value : hiddenErrors.value) };

    for (const field of fieldsNames) {
        result[field] = hiddenErrors.value?.[field] || '';
    }

    errors.value = result;
    $emit('validate', isFormValid.value, hiddenErrors.value);
}

function validateAll() {
    const updatedErrors = {};
    let result = true;

    for (const field in $props.fields) {
        const currentError = validateField(field, null, false);
        updatedErrors[field] = currentError || '';

        if (result && currentError) {
            result = false;
        }
    }

    hiddenErrors.value = updatedErrors;
    $emit('validate', result, updatedErrors);

    return result;
}

function validateField(field, newValue = null, withEmit = true) {
    const options = $props.fields?.[field];
    const value = newValue ?? $props.values?.[field];

    let currentError;

    if (options?.validate === true) {
        currentError = value ? '' : $props.requiredMessage;
    } else if (typeof options?.validate !== 'function') {
        return '';
    } else {
        currentError = options.validate(value, field, hiddenErrors.value, $props.values);
    }

    if (withEmit) {
        const updatedErrors = {
            ...hiddenErrors.value,
            [field]: currentError,
        };

        hiddenErrors.value = updatedErrors;
        $emit('validate', isFormValid.value, updatedErrors);
    }

    return currentError;
}

function getFieldAttributes(field) {
    const options = $props.fields?.[field];

    if (typeof options?.attributes === 'function') {
        return options.attributes($props.values?.[field], field, $props.values);
    }

    return options?.attributes || {};
}

function getButtonAttributes() {
    if (typeof $props.submitButtonAttributes === 'function') {
        return $props.submitButtonAttributes(isFormValid.value, $props.values, hiddenErrors.value);
    }

    return $props.submitButtonAttributes || {};
}
</script>

<style lang="scss" module>
    .VForm {
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .formInputs {
        display: grid;
        grid-auto-flow: row;
        column-gap: .8rem;
        row-gap: 1.2rem;
    }

    .submitButton {
        width: 100%;
        margin-top: 4rem;
    } 
</style>
