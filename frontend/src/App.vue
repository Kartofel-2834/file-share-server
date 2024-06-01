<template>
    <main id="app">
        <RouterView />

        <TheModal />

        <TheNotifications />
    </main>
</template>

<script>
export default {
    name: 'App',
};
</script>

<script setup>
// Vue
import { defineAsyncComponent } from 'vue';

// Components
const TheNotifications = defineAsyncComponent(() => import('@/components/layouts/TheNotifications.vue'));
const TheModal = defineAsyncComponent(() => import('@/components/layouts/TheModal.vue'));
</script>
