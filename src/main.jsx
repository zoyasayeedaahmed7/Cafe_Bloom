import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { initSmoothScroll } from './utils/smoothScroll'

// Lenis drives page scrolling. Everything that moves the page goes through
// src/utils/smoothScroll.js so nothing competes with it.
initSmoothScroll()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
