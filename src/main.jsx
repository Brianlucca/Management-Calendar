import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import './css/scrollBar.css'
import './css/headerToolbarCalendar.css'
import './css/showNotification.css'
import App from './App.jsx'
import moment from 'moment';
import 'moment/locale/pt-br';

moment.locale('pt-br');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
