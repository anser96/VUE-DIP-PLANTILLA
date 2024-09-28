import './style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios, { AxiosInstance } from 'axios'

// Configuración global de Axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
})

const app = createApp(App)

// Registrar Axios en Vue como un plugin (opcional)
app.config.globalProperties.$axios = axiosInstance

app.use(router)
app.mount('#app')
