import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            
            {/* Main Application routing */}
            <AppRoutes />

            {/* Global notification toaster */}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: '#1e293b',
                  color: '#fff',
                  borderRadius: '12px',
                  fontSize: '13px',
                },
                success: {
                  iconTheme: {
                    primary: '#14b8a6',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                }
              }}
            />

          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
