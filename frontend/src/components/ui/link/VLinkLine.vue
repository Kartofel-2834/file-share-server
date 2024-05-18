<template>
    <component
        :is="tag"
        :class="[$style.VLinkLine, 'v-link-line']"
    >
        <slot />
    </component>
</template>

<script>
export default {
    name: 'VLinkLine',
};
</script>

<script setup>
// Components
import { RouterLink } from 'vue-router';

defineProps({
    tag: {
        type: [String, Object],
        default: RouterLink,
    },
});
</script>

<style lang="scss" module>
    .VLinkLine {
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
