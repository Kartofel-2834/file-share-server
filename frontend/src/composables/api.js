// Constants
import { $authApi } from '@/assets/constants/api-constants';

const $api = {
    auth: $authApi,
};

export function useApi() {
    return $api;
}
