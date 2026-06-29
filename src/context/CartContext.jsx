import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Le panier contient des objets sous la forme : { product, qty }
  const [items, setItems] = useState(() => {
    const localData = localStorage.getItem('gobuy_cart');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('gobuy_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const handler = () => setItems([]);
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, []);

  // 1. Ajouter un produit au panier
  const addItem = (product, qty = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      // On initialise les consignes (customerNotes) si non présentes
      return [...prevItems, { product: { ...product, customerNotes: '' }, qty }];
    });
  };

  // 2. Modifier la quantité
  const updateQty = (productId, qty) => {
    if (qty <= 0) return;
    setItems((prevItems) =>
      prevItems.map((item) => (item.product.id === productId ? { ...item, qty } : item))
    );
  };

  // 3. Supprimer un produit
  const removeItem = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  // 4. METTRE À JOUR LES CONSIGNES DE RÉCOLTE (Demandé par ton Cart.jsx)
  const updateNotes = (productId, note) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId
          ? { ...item, product: { ...item.product, customerNotes: note } }
          : item
      )
    );
  };

  // 5. Vider le panier après paiement réussi
  const clearCart = () => setItems([]);

  // ==========================================
  // CALCULS DES TOTAUX (Règles Métier)
  // ==========================================
  const calculateTotals = () => {
    // A. Nombre total d'articles
    const count = items.reduce((sum, item) => sum + item.qty, 0);

    // B. Sous-total des articles
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);

    // C. Frais de service : 15% du sous-total
    const service = Math.round(subtotal * 0.15);

    // D. Frais de livraison fixes : 600 FCFA (reversés au livreur)
    const delivery = 600;

    // E. Total Général
    const total = subtotal + service + delivery;

    return { count, subtotal, service, delivery, total };
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQty,
        removeItem,
        updateNotes,
        clearCart,
        totals: calculateTotals(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}