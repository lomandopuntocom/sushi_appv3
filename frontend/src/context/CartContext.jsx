import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // 1. CARGA INICIAL: Al arrancar, buscamos si ya había un carrito guardado
  const [cartItems, setCartItems] = useState(() => {
    try {
      const item = localStorage.getItem('carritoSushiApp');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.warn('Error leyendo el localStorage', error);
      return [];
    }
  });

  // 2. GUARDADO AUTOMÁTICO: Cada vez que cartItems cambie, lo guardamos
  useEffect(() => {
    localStorage.setItem('carritoSushiApp', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (plato) => {
    setCartItems((prevItems) => {
      const itemExistente = prevItems.find((item) => item.id === plato.id);
      if (itemExistente) {
        return prevItems.map((item) =>
          item.id === plato.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prevItems, { ...plato, cantidad: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    // Opcional: limpiar también la clave específica en lugar de esperar al useEffect
    localStorage.removeItem('carritoSushiApp'); 
  };

  const total = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};