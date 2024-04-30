import { createRouter, createWebHistory } from 'vue-router';

// Auth pages
const LoginPage = () => import('@/views/auth/login.vue');

// Index page
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
            path: '/auth/login/',
            name: 'login',
            component: LoginPage,
        },
    ],
});

export default router;
