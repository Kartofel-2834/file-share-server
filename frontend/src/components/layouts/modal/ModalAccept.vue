<template>
    <div :class="$style.ModalAccept">
        <div
            v-if="question"
            :class="$style.question"
            v-html="question"
        />

        <div
            v-if="acceptText || rejectText"
            :class="$style.buttonsWrapper"
        >
            <VButton
                v-if="acceptText"
                @click="$emit('accept')"
            >
                {{ acceptText }}
            </VButton>

            <VButton
                v-if="rejectText"
                color="error"
                @click="$emit('reject')"
            >
                {{ rejectText }}
            </VButton>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ModalAccept',
};
</script>

<script setup>
import { defineAsyncComponent } from 'vue';

// UI Components
const VButton = defineAsyncComponent(() => import('@/components/ui/button/VButton.vue'));

const $emit = defineEmits(['accept', 'reject']);

defineProps({
    question: {
        type: String,
        default: 'Вы уверены?',
    },

    acceptText: {
        type: String,
        default: 'Да',
    },

    rejectText: {
        type: String,
        default: 'Нет',
    },
}); 
</script>

<style lang="scss" module>
    .ModalAccept {
        //
    }
</style>
