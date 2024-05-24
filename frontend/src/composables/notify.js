// Store
import { useNotificationsStore } from '@/stores/notifications';

// Utils
import { parseError } from '@/assets/utils/request-utils';

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

    const errorNotify = notify.bind({ type: 'error' });

    function parseErrorNotify(err, delay = 3000) {
        const { title, description } = parseError(err);
 
        return errorNotify(title, description, delay);
    }

    return {
        info: notify.bind({ type: 'info' }),
        success: notify.bind({ type: 'success' }),
        error: errorNotify,
        parseError: parseErrorNotify,
    };
}
