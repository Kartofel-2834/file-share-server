<template>
    <main id="app">
        <RouterView />

        <Notifications />
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
const Notifications = defineAsyncComponent(() => import('@/components/layouts/Notifications.vue'));
</script>
