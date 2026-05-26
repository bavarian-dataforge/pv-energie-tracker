import React from 'react'
import ReactDOM from 'react-dom/client'
import PVDashboard from "./components/PVDashboard";

const style = document.createElement('style')
style.textContent = `
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html, body, #root {
    height: 100%;
    width: 100%;
  }
  body {
    background: #0a0e1a;
    color: #e2e8f0;
    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  input:focus {
    outline: none;
    border-color: #06b6d4 !important;
    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2);
  }
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #111827;
  }
  ::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #475569;
  }
`
document.head.appendChild(style)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PVDashboard />
  </React.StrictMode>
)
