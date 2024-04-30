import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useNotificationsStore = defineStore('notifications', () => {
    const list = ref([]);

    // Добавление уведомления
    function add({
        status,
        title = '',
        description = '',
        delay = 3000,
    }) {
        const id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const updatedStatus = ['error', 'info', 'success'].includes(status) ? status : 'info';
        
        const newNotification = {
            id,
            status: updatedStatus,
            title,
            description,
        }; 

        list.value = [
            ...list.value,
            newNotification,
        ];

        setTimeout(() => {
            list.value = list.value.filter(notification => notification.id !== id);
        }, delay);
    }

    // Удаление последнего в списке уведомления
    function pop() {
        const update = [...list.value];
        update.pop();
        list.value = update;
    }

    return { list, add, pop };
});
