<template>
    <div :class="$style.ModalWrapper">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'ModalWrapper',
};
</script>

<style lang="scss" module>
    .ModalWrapper {
        position: fixed;
        top: 50%;
        right: 2rem;
        transform: translateY(-50%);
        min-width: 40rem;
        padding: 4rem 2rem 2rem 2rem;
        border-radius: .8rem;
        background-color: $white;
    }
</style>
