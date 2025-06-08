import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import './assets/darkmode.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// Add Font Awesome
const fontAwesomeCDN = document.createElement('link')
fontAwesomeCDN.rel = 'stylesheet'
fontAwesomeCDN.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
document.head.appendChild(fontAwesomeCDN)
