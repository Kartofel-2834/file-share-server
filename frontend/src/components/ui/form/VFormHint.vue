<template>
    <div :class="[$style.FormHint, 'v-form-hint']">
        <!-- Label -->
        <slot name="label">
            <div
                v-if="label"
                :class="[$style.label, 'form-hint-label']"
                v-html="label"
            />
        </slot>

        <!-- Form hint content -->
        <slot />

        <!-- Description & Errors -->
        <transition-group
            name="fade"
            tag="div"
            :class="$style.descriptionWrapper"
        >
            <div
                v-if="description || $slots?.description"
                v-show="disabled || !error?.length"
                key="FormHintDescription"
                :class="[$style.description, 'form-hint-description']"
            >
                <slot name="description">
                    {{ description }}
                </slot>
            </div>

            <div
                v-if="error?.length || $slots?.error"
                v-show="!disabled && error"
                key="FormHintErrorDescription"
                :class="[$style.description, $style._errorDesc, 'form-hint-error']"
            >
                <slot name="error">
                    {{ error }}
                </slot>
            </div>
        </transition-group>
    </div>
</template>

<script>
export default {
    name: 'VFormHint',
};
</script>

<script setup>
// Props
defineProps({
    label: {
        type: String,
        default: '',
    },

    description: {
        type: String,
        default: '',
    },

    error: {
        type: String,
        default: '',
    },

    disabled: Boolean,
});
</script>

<style lang="scss" module>
    .VFormHint {
        //
    }

    .descriptionWrapper {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;

        & > * {
            grid-column: 1 / 2;
            grid-row: 1 / 2;
        }
    }

    .label,
    .description {
        font-size: 1.4rem;
        font-weight: 500;
        line-height: 112%;
    }

    .label {
        margin-bottom: .8rem;
    }

    .description {
        margin-top: .8rem;
        color: $base-400;
        transition: opacity $default-transition;

        &._errorDesc {
            z-index: 2;
            color: $error-500;
        }
    }
</style>
