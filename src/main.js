import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

// Importar Bootstrap CSS y JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Importar Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css';

// Importar estilos personalizados
import './assets/styles.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');