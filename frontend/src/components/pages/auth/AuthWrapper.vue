<template>
    <div :class="[$style.AuthWrapper, 'auth-wrapper']">
        <div :class="[$style.form, 'auth-wrapper-form']">
            <!-- Title -->
            <h1
                v-if="$slots?.title"
                :class="[$style.title, 'auth-wrapper-title']"
            >
                <slot name="title" />
            </h1>

            <!-- Content -->
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'AuthWrapper',
};
</script>

<style lang="scss" module>
    .AuthWrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background-color: $base-100;
    }

    .form {
        width: 52rem;
        max-width: 52rem;
        padding: 4rem;
        border-radius: .8rem;
        background-color: $white;
    }

    .title {
        margin-bottom: 8rem;
        text-align: center;
        line-height: 1;

        @include text(h, 3);
    }
</style>
