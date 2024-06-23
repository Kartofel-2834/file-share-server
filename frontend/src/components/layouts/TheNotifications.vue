<template>
    <transition-group
        :class="$style.TheNotifications"
        name="notification"
        tag="div"
    >
        <Notification
            v-for="(notification, index) of updatedNotifications"
            :key="`Notification_${notification.id}`"
            :class="[$style.notification, getNotificationClassList(index)]"
            :status="notification?.status"
            :title="notification?.title"
            :description="notification?.description"
            @click="onNotificationClick"
        />
    </transition-group>
</template>

<script>
export default {
    name: 'TheNotifications',
};
</script>

<script setup>
// Vue
import { computed, useCssModule } from 'vue';

// Store
import { useNotificationsStore } from '@/stores/notifications';

// Components
import Notification from '@/components/layouts/notifications/Notification.vue';

const $style = useCssModule();

const $notifications = useNotificationsStore();

// Computed
const updatedNotifications = computed(() => {
    if (!Array.isArray($notifications.list)) {
        return [];
    }

    if ($notifications.list.length <= 5) {
        return $notifications.list;
    }

    return $notifications.list.slice($notifications.list.length - 5);
});

// Methods
function onNotificationClick() {
    $notifications.pop();
}

function getNotificationClassList(index) {
    return {
        [$style._first]: index === $notifications.list.length - 1,
        [$style._second]: index === $notifications.list.length - 2,
        [$style._third]: index === $notifications.list.length - 3,
    };
}
</script>

<style lang="scss" module>
    .TheNotifications {
        //
    }

    .notification {
        position: fixed;
        right: 2rem;
        bottom: 2rem;
        z-index: 200;
        transform: translateY(-100px);

        /* --- Transition --- */
        :global {
            .notification-enter-active,
            .notification-leave-active {
                transition: opacity $default-transition,
                    transform $default-transition;
            }
        }

        &:global(.notification-enter-from),
        &:global(.notification-leave-to) {
            opacity: 0;
            transform: translateY(4rem);
        }

        &:global(.notification-enter-to),
        &:global(.notification-leave-from) {
            opacity: 1;
            transform: translateY(0);
        }

        /* --- Modificators --- */
        &._first {
            opacity: 1;
            transform: translateY(0);

            &:global(.notification-enter-from),
            &:global(.notification-leave-to) {
                opacity: 0;
                transform: translateY(50px);
            }
        }

        &._second {
            opacity: 0.5;
            transform: translateY(-50px);

            &:global(.notification-enter-from),
            &:global(.notification-leave-to) {
                opacity: 0;
                transform: translateY(0);
            }
        }

        &._third {
            opacity: 0.2;
            transform: translateY(-100px);

            &:global(.notification-enter-from),
            &:global(.notification-leave-to) {
                opacity: 0;
                transform: translateY(-50px);
            }
        }
    }
</style>
