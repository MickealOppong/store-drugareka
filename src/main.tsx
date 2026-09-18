
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import './css/index.css';
import './i18n.ts';
import { store } from './store.ts';

createRoot(document.getElementById('root')!).render(
  <Provider store={store} ><App/></Provider>
)
