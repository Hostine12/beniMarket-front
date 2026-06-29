// Commandes, livraisons, témoignages et données de tableaux de bord — tout est mocké.

export const orderStatuses = [
  { key: 'confirmed', label: 'Confirmée', desc: 'Paiement reçu' },
  { key: 'preparing', label: 'En préparation', desc: 'Le vendeur prépare votre colis' },
  { key: 'shipping', label: 'En livraison', desc: 'Le livreur est en route' },
  { key: 'delivered', label: 'Livrée', desc: 'Colis remis avec code OTP' },
]

export const orders = [
  {
    id: 'GU-10248',
    date: '2026-06-03',
    status: 'shipping',
    total: 7800,
    otp: '4821',
    courier: 'Moussa T.',
    items: [
      { name: 'Panier de tomates fraîches (3 kg)', qty: 1, price: 2500, image: 'photo-1592924357228-91a4daadcfea' },
      { name: 'Jus de bissap artisanal (1,5 L)', qty: 2, price: 1500, image: 'photo-1497534446932-c925b458314a' },
    ],
    timeline: [
      { key: 'confirmed', at: '03 juin, 09:12' },
      { key: 'preparing', at: '03 juin, 10:05' },
      { key: 'shipping', at: '03 juin, 14:30' },
    ],
  },
  {
    id: 'GU-10231',
    date: '2026-05-29',
    status: 'delivered',
    total: 9500,
    otp: '7390',
    courier: 'Fatou B.',
    items: [{ name: 'Tissu Wax premium (6 yards)', qty: 1, price: 9500, image: 'photo-1620916566398-39f1143ab7be' }],
    timeline: [
      { key: 'confirmed', at: '29 mai, 11:00' },
      { key: 'preparing', at: '29 mai, 12:10' },
      { key: 'shipping', at: '29 mai, 15:00' },
      { key: 'delivered', at: '30 mai, 10:22' },
    ],
  },
  {
    id: 'GU-10199',
    date: '2026-05-18',
    status: 'delivered',
    total: 3500,
    otp: '1024',
    courier: 'Moussa T.',
    items: [{ name: 'Beurre de karité brut (500 g)', qty: 1, price: 3500, image: 'photo-1556228578-8c89e6adf883' }],
    timeline: [
      { key: 'confirmed', at: '18 mai, 08:40' },
      { key: 'preparing', at: '18 mai, 09:30' },
      { key: 'shipping', at: '18 mai, 13:15' },
      { key: 'delivered', at: '18 mai, 17:50' },
    ],
  },
]

export function getOrder(id) {
  return orders.find((o) => o.id === id) || orders[0]
}

// --- Espace livreur ---
export const deliveries = [
  { id: 'GU-10248', client: 'Aïcha Dossou', address: 'Quartier Haie Vive, Cotonou', distance: '3,2 km', amount: 7800, status: 'in_progress', otp: '4821', phone: '+229 97 12 34 56' },
  { id: 'GU-10255', client: 'Pascal Adjovi', address: 'Akpakpa, Cotonou', distance: '5,8 km', amount: 4200, status: 'pending', otp: '6643', phone: '+229 96 55 44 33' },
  { id: 'GU-10260', client: 'Reine Sossou', address: 'Cadjèhoun, Cotonou', distance: '2,1 km', amount: 11000, status: 'pending', otp: '9012', phone: '+229 95 11 22 33' },
]

export const deliveryHistory = [
  { id: 'GU-10231', client: 'Mariam S.', date: '30 mai', amount: 9500, rating: 5 },
  { id: 'GU-10199', client: 'Koffi A.', date: '18 mai', amount: 3500, rating: 4 },
  { id: 'GU-10180', client: 'Jean H.', date: '12 mai', amount: 6500, rating: 5 },
]

// --- Témoignages page d'accueil ---
export const testimonials = [
  { name: 'Aïcha D.', role: 'Cliente · Cotonou', text: 'Je fais mon marché depuis mon téléphone le matin, tout arrive frais avant midi. Un vrai gain de temps.', avatar: 'photo-1531123897727-8f129e1688ce', rating: 5 },
  { name: 'Mama Aïssa', role: 'Vendeuse · Saveurs de Mama Aïssa', text: 'BeniMarket m’a ouvert une clientèle bien au-delà de mon quartier. Mes ventes ont doublé en six mois.', avatar: 'photo-1544005313-94ddf0286df2', rating: 5 },
  { name: 'Moussa T.', role: 'Livreur · Cotonou', text: 'Les courses sont bien organisées et le code OTP me sécurise à chaque remise. Je travaille sereinement.', avatar: 'photo-1506794778202-cad84cf45f1d', rating: 5 },
]

// --- KPIs vendeur ---
export const vendorStats = {
  revenue: 1284500,
  revenueChange: 12.4,
  orders: 342,
  ordersChange: 8.1,
  products: 28,
  rating: 4.8,
  pendingOrders: 6,
  lowStock: 3,
  salesByMonth: [42, 55, 48, 67, 72, 65, 80, 78, 92, 88, 101, 96],
  recentOrders: [
    { id: 'GU-10248', client: 'Aïcha D.', product: 'Tomates fraîches', amount: 2500, status: 'shipping' },
    { id: 'GU-10247', client: 'Pascal A.', product: 'Riz parfumé 10kg', amount: 8500, status: 'preparing' },
    { id: 'GU-10245', client: 'Reine S.', product: 'Miel pur 1L', amount: 5000, status: 'delivered' },
    { id: 'GU-10243', client: 'Jean H.', product: 'Bissap 1,5L', amount: 3000, status: 'delivered' },
  ],
}

// --- KPIs admin ---
export const adminStats = {
  gmv: 48250000,
  gmvChange: 18.2,
  users: 12480,
  usersChange: 6.7,
  vendors: 386,
  pendingVendors: 14,
  flaggedProducts: 5,
  openDisputes: 3,
  topVendors: [
    { name: 'Saveurs de Mama Aïssa', sales: 2110, revenue: 4200000 },
    { name: 'Karité Nature', sales: 1680, revenue: 3850000 },
    { name: 'Ferme Sèmè Bio', sales: 1240, revenue: 2900000 },
  ],
  pendingValidation: [
    { id: 'v7', name: 'Délices du Nord', city: 'Parakou', date: '05 juin', docs: true },
    { id: 'v8', name: 'Boutique Zen', city: 'Cotonou', date: '04 juin', docs: true },
    { id: 'v9', name: 'AgroFrais SARL', city: 'Bohicon', date: '03 juin', docs: false },
  ],
  disputes: [
    { id: 'D-0042', order: 'GU-10210', client: 'Sylvie K.', reason: 'Colis incomplet', priority: 'Haute' },
    { id: 'D-0041', order: 'GU-10188', client: 'Eric M.', reason: 'Retard de livraison', priority: 'Moyenne' },
    { id: 'D-0039', order: 'GU-10150', client: 'Ben A.', reason: 'Produit non conforme', priority: 'Basse' },
  ],
}
