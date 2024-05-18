// Pages
const HomePage = () => import('@/views/index.vue');

// Routes
export default [
    {
        path: '/',
        name: 'home',
        component: HomePage,
    },
];
