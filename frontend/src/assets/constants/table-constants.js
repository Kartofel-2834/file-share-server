// Utils
import { formatFileSize } from '@/assets/utils/numbers-utils';

export const filesTableFields = {
    id: {
        label: 'id',
    },

    name: {
        label: 'Название',
    },

    size: {
        label: 'Размер',
        formatter: v => formatFileSize(v),
    },

    owner: {
        label: 'Добавлен',
        formatter: (v, file) => `${file?.owner_name} ${file?.owner_surname}`, 
    },

    is_downloaded: {
        label: 'Скачан',
        formatter: v => v ? 'Да' : 'Нет',
    },

    is_viewed: {
        label: 'Просмотрен',
        formatter: v => v ? 'Да' : 'Нет',
    },

    created_at: {
        label: 'Дата',
        formatter: v => new Date(v)?.toLocaleString(),
    },

    actions: {
        label: 'Действия',
    },
};
