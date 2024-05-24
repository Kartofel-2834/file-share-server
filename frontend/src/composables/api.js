// Constants
import {
    $authApi,
    $filesApi,
} from '@/assets/constants/api-constants';

const $api = {
    auth: $authApi,
    files: $filesApi,
};

export function useApi() {
    return $api;
}
