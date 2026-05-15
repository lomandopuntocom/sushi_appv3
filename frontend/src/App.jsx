// frontend/src/App.jsx
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    // App.jsx ahora es el punto de entrada maestro para los proveedores de estado
    <CartProvider>
      <AppRoutes />
    </CartProvider>
  );
}

export default App;