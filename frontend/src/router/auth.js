// Pages
const LoginPage = () => import('@/views/auth/login.vue');
const RecoveryPage = () => import('@/views/auth/recovery.vue');

// Routes
export default [
    {
        path: '/auth/login/',
        name: 'login',
        component: LoginPage,
    },

    {
        path: '/auth/recovery/',
        name: 'recovery',
        component: RecoveryPage,
    },
];
