import { createRouter, createWebHistory } from 'vue-router';

// Routes
import homeRoutes from '@/router/home';
import authRoutes from '@/router/auth';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        ...homeRoutes,
        ...authRoutes,
    ],
});

export default router;
