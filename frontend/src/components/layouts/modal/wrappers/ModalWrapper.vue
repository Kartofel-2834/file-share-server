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
        max-height: calc(100vh - 8rem);
        padding: 4rem 2rem 2rem 2rem;
        border-radius: .8rem;
        background-color: $white;

        @include respond-to(tablet) {
            overflow: auto;
            right: unset;
            left: 50%;
            min-width: 0;
            max-width: calc(100% - 4rem);
            max-height: calc(100dvh - 4rem);
            transform: translate(-50%, -50%);
        }
    }
</style>
