import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'
import ShareView from '../views/ShareView.vue';

const routes = [
    {
        path: '/',
        component: HomeView,
    },
    {
        path: '/:telegramId',
        component: ShareView,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;