import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import store from './Redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist'; // ✅ CORRECT IMPORT

const persistor = persistStore(store); // ✅ USING CORRECT FUNCTION

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Toaster />
      </PersistGate>
    </Provider>
  </StrictMode>
);
