import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import router from './router'
import 'animate.css';
import { createPinia } from 'pinia';

createApp(App).use(router).use(createPinia).mount('#app')
