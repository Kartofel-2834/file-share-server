import '@/assets/styles/reset.scss';
import '@/assets/styles/default.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from '@/router';

import App from '@/App.vue';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
