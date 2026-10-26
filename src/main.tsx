
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import App from './App.tsx';
import './css/index.css';
import './i18n.ts';
import { store } from './store.ts';

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </HelmetProvider>
);