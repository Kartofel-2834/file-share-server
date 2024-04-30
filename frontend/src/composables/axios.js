// Libraries
import axios from 'axios';

// Vue
import { useRouter } from 'vue-router';

export const apiUrl = import.meta.env.DEV ?
    import.meta.env.VITE_DEV_MODE_API_URL :
    import.meta.env.VITE_BUILD_MODE_API_URL;

export function useAxios() {
    const router = useRouter();
    const $axios = axios.create({
        baseURL: apiUrl,
        timeout: 5000,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    });

    $axios.interceptors.response.use(res => res, error => {
        const status = error?.response?.status;

        if (status === 403) {
            router.push('/auth/login/');
        }

        return Promise.reject({
            res: error?.response?.data,
            status: error?.response?.status,
            error,
        });
    });

    return $axios;
}
