// Libraries
import axios from 'axios';

// Vue
import { useRouter } from 'vue-router';

export const apiUrl = import.meta.env.DEV ?
    import.meta.env.VITE_DEV_MODE_API_URL :
    import.meta.env.VITE_BUILD_MODE_API_URL;

export function useAxios() {
    const $router = useRouter();
    const $axios = axios.create({
        baseURL: apiUrl,
        timeout: 5000,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    });

    // Вставка токена доступа в хедеры запросов
    $axios.interceptors.request.use(config => {
        if (!window) {
            return config;
        }

        const token = window?.localStorage?.getItem('accessToken');
        
        if (!token?.length) {
            return config;
        }

        const updatedConfig = { ...config };
        updatedConfig.headers.Authorization = `Bearer ${token}`;

        return updatedConfig;
    });

    // При отказе в доступе со стороны сервера
    $axios.interceptors.response.use(res => res, error => {
        const status = error?.response?.status;

        if (status === 403) {
            $router.push('/auth/login/');
        }

        return Promise.reject({
            res: error?.response?.data,
            status: error?.response?.status,
            error,
        });
    });

    return $axios;
}
