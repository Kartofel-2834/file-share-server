<template>
    <transition-group
        :class="$style.Notifications"
        name="notification"
        tag="div"
    >
        <div
            v-for="(notification, index) of updatedNotifications"
            :key="`Notification_${notification.id}`"
            ref="notifications"
            :class="[$style.notification, getNotificationClassList(index)]"
            @click="onNotificationClick"
        >
            {{ notification }}
        </div>
    </transition-group>
</template>

<script>
export default {
    name: 'Notifications',
};
</script>

<script setup>
// Vue
import { computed, useCssModule } from 'vue';

// Store
import { useNotificationsStore } from '@/stores/notifications';

const notifications = useNotificationsStore();

const $style = useCssModule();

// Computed
const updatedNotifications = computed(() => {
    if (!Array.isArray(notifications.list)) {
        return [];
    }

    if (notifications.list.length <= 5) {
        return notifications.list;
    }

    return notifications.list.slice(notifications.list.length - 5);
});

// Methods
function onNotificationClick() {
    notifications.pop();
}

function getNotificationClassList(index) {
    return {
        [$style._first]: index === notifications.list.length - 1,
        [$style._second]: index === notifications.list.length - 2,
        [$style._third]: index === notifications.list.length - 3,
    };
}
</script>

<style lang="scss" module>
    .Notifications {
        //
    }

    .notification {
        position: fixed;
        right: 2rem;
        bottom: 2rem;
        overflow: hidden;
        width: 36rem;
        max-width: 36rem;
        min-height: 14rem;
        padding: 2rem;
        border-radius: .8rem;
        word-break: break-all;
        background-color: $white;
        cursor: pointer;
        user-select: none;
        box-shadow: $drop-shadow-m;
        opacity: 0;
        transform: translateY(-100px);
        transition:
            opacity $default-transition,
            transform $default-transition;

        /* --- Transition --- */
        :global {
            .notification-enter-active,
            .notification-leave-active {
                transition:
                    opacity $default-transition,
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
            opacity: .5;
            transform: translateY(-50px);

            &:global(.notification-enter-from),
            &:global(.notification-leave-to) {
                opacity: 0;
                transform: translateY(0);
            }
        }

        &._third {
            opacity: .2;
            transform: translateY(-100px);

            &:global(.notification-enter-from),
            &:global(.notification-leave-to) {
                opacity: 0;
                transform: translateY(-50px);
            }
        }
    }
</style>
