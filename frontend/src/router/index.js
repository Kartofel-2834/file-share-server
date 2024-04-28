import { createRouter, createWebHistory } from 'vue-router';

// Pages
const LoginPage = () => import('@/views/login.vue');
const IndexPage = () => import('@/views/index.vue');

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: IndexPage,
        },

        {
            path: '/login/',
            name: 'login',
            component: LoginPage,
        },
    ],
});

export default router;
