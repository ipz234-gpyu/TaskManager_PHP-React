import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './app/store';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <MantineProvider>
                <App/>
            </MantineProvider>
        </Provider>
    </StrictMode>,
)
