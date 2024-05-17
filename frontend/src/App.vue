<template>
    <main id="app">
        <RouterView />

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
</script>
