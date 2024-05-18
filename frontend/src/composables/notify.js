// Store
import { useNotificationsStore } from '@/stores/notifications';

export function useNotify() {
    const notifications = useNotificationsStore();

    function notify(title, description, delay = 3000) {
        notifications.add({
            status: this.type,
            title,
            description,
            delay,
        });
    }

    return {
        info: notify.bind({ type: 'info' }),
        success: notify.bind({ type: 'success' }),
        error: notify.bind({ type: 'error' }),
    };
}
