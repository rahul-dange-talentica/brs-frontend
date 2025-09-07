import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import theme from './theme'
import { store } from './store'
import { initializeApp } from './utils/appInitializer'

// Initialize the app (including authentication verification)
initializeApp().then(() => {
  console.log('🚀 App initialized successfully');
}).catch((error) => {
  console.error('❌ App initialization failed:', error);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
