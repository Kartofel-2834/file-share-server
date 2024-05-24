// Store
import { defineStore } from 'pinia';

// Vue
import { ref, computed } from 'vue';

// Composables
import { useAxios } from '@/composables/axios';
import { useApi } from '@/composables/api';

export const useUserStore = defineStore('user', () => {
    const $axios = useAxios();
    const $api = useApi();

    const data = ref(null);

    // Computed
    const isAdmin = computed(() => data?.value?.role === 'admin');
    const isModerator = computed(() => data?.value?.role === 'moderator');
    const isSimpleUser = computed(() => data?.value?.role === 'user');

    // Methods
    function set(newUser) {
        data.value = newUser;
    }

    async function fetchUserInfo() {
        try {
            const { data: userInfo } = await $axios.get($api.auth.me);

            data.value = userInfo;
        } catch (err) {
            console.warn('[usersStore/fetchUserInfo] request failed: ', err);
        }
    }

    if (!data.value?.role || !data.value?.id) {
        fetchUserInfo();
    }

    return {
        data,
        isAdmin,
        isModerator,
        isSimpleUser,
        
        set,
        fetchUserInfo,
    };
});
