import { createRoot } from 'react-dom/client';
import { setAuthTokenGetter } from '@workspace/api-client-react';
import App from './App';
import './index.css';

// Configure the API client to automatically send the admin token
const TOKEN_KEY = 'intarno_admin_token';
setAuthTokenGetter(() => localStorage.getItem(TOKEN_KEY));

createRoot(document.getElementById('root')!).render(<App />);
