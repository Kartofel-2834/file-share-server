<template>
    <component :is="tag">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'VLinkLine',
};
</script>

<script setup>
defineProps({

});
</script>
