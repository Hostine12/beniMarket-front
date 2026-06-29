export const products = [
  {
    id: 'p1',
    name: 'Tomates fraîches',
    category: 'frais',
    image: '/tomates.webp',
    tags: ['Bio', 'Récolte du jour'],
    description: "Tomates mûries au soleil, cueillies le matin même. Parfaites pour vos sauces, salades et plats mijotés.",
    price: 500,
    stock: 24,
    options: [
      { id: 'tas', label: 'Le Tas', multiplier: 1 },
      { id: 'panier', label: 'Le Panier', multiplier: 4 },
      { id: 'sac', label: 'Le Sac', multiplier: 10 }
    ],
    vendors: [
      { vendorId: 'v1', option: 'Tas', pricePerUnit: 500, stock: 24 },
      { vendorId: 'v3', option: 'Panier', pricePerUnit: 2000, stock: 15 },
      { vendorId: 'v5', option: 'Sac', pricePerUnit: 5000, stock: 10 }
    ]
  },
  {
    id: 'p2',
    name: 'Bananes plantain',
    category: 'fruits',
    image: 'photo-1603833665858-e61d17a86224',
    tags: ['Local'],
    description: 'Bananes plantain bien mûres, idéales pour alloco et accompagnements.',
    price: 450,
    stock: 20,
    options: [
      { id: 'tas', label: 'Le Tas', multiplier: 1 },
      { id: 'regime', label: 'Le Régime', multiplier: 5 }
    ],
    vendors: [
      { vendorId: 'v2', option: 'Tas', pricePerUnit: 450, stock: 20 },
      { vendorId: 'v3', option: 'Régime', pricePerUnit: 2200, stock: 12 }
    ]
  },
  {
    id: 'p3',
    name: 'Oignon Violet',
    category: 'frais',
    image: '/oignon violet.jpg',
    tags: ['Légumes'],
    description: 'Oignons violets de Parakou, très parfumés et parfaits pour vos assaisonnements.',
    price: 400,
    stock: 50,
    options: [
      { id: 'tas', label: 'Le Tas', multiplier: 1 },
      { id: 'panier', label: 'Le Panier', multiplier: 4.5 },
      { id: 'sac', label: 'Le Sac', multiplier: 12 }
    ],
    vendors: [
      { vendorId: 'v1', option: 'Tas', pricePerUnit: 400, stock: 50 },
      { vendorId: 'v2', option: 'Panier', pricePerUnit: 1800, stock: 20 },
      { vendorId: 'v3', option: 'Sac', pricePerUnit: 4800, stock: 8 }
    ]
  },
  {
    id: 'p4',
    name: 'Gingembre frais',
    category: 'epices',
    image: '/gingembre.jpg',
    tags: ['Épices', 'Bio'],
    description: 'Gingembre frais de qualité, idéal pour vos tisanes, marinades et plats épicés.',
    price: 300,
    stock: 40,
    options: [
      { id: 'tas', label: 'Le Tas', multiplier: 1 },
      { id: 'panier', label: 'Le Panier', multiplier: 5 }
    ],
    vendors: [
      { vendorId: 'v1', option: 'Tas', pricePerUnit: 300, stock: 40 },
      { vendorId: 'v3', option: 'Panier', pricePerUnit: 1500, stock: 18 }
    ]
  },
  {
    id: 'p5',
    name: 'Riz local',
    category: 'frais',
    image: '/riz.jpg',
    tags: ['Céréales', 'Local'],
    description: 'Riz local produit au Bénin, savoureux et parfait pour tous vos plats du quotidien.',
    price: 600,
    stock: 100,
    options: [
      { id: 'bol', label: 'Le Bol', multiplier: 1 },
      { id: 'sac5', label: 'Sac 5 kg', multiplier: 10 },
      { id: 'sac25', label: 'Sac 25 kg', multiplier: 45 }
    ],
    vendors: [
      { vendorId: 'v2', option: 'Bol', pricePerUnit: 600, stock: 100 },
      { vendorId: 'v3', option: 'Sac 5 kg', pricePerUnit: 6000, stock: 30 },
      { vendorId: 'v1', option: 'Sac 25 kg', pricePerUnit: 27000, stock: 15 }
    ]
  },
  {
    id: 'p6',
    name: 'Piment rouge séché',
    category: 'epices',
    image: '/epicette-piment-rouge-seche-1.jpg',
    tags: ['Épices', 'Séché'],
    description: 'Piment rouge séché, très fort et parfumé. Indispensable pour relever vos sauces et ragoûts.',
    price: 250,
    stock: 60,
    options: [
      { id: 'tas', label: 'Le Tas', multiplier: 1 },
      { id: 'panier', label: 'Le Panier', multiplier: 6 }
    ],
    vendors: [
      { vendorId: 'v3', option: 'Tas', pricePerUnit: 250, stock: 60 },
      { vendorId: 'v1', option: 'Panier', pricePerUnit: 1500, stock: 25 }
    ]
  },
  {
    id: 'p7',
    name: 'Jus de Bissap',
    category: 'boissons',
    image: '/photo_jus_bissap_cuisinovores-500x375.webp',
    tags: ['Boisson', 'Naturel'],
    description: 'Jus de bissap (hibiscus) fait maison, rafraîchissant et riche en antioxydants.',
    price: 500,
    stock: 30,
    options: [
      { id: 'bouteille', label: 'Bouteille 50cl', multiplier: 1 },
      { id: 'bidon', label: 'Bidon 1L', multiplier: 2 }
    ],
    vendors: [
      { vendorId: 'v2', option: 'Bouteille 50cl', pricePerUnit: 500, stock: 30 },
      { vendorId: 'v3', option: 'Bidon 1L', pricePerUnit: 1000, stock: 15 }
    ]
  },
  {
    id: 'p8',
    name: 'Beurre de Karité',
    category: 'cosmetiques',
    image: '/beurre de karité.jpg',
    tags: ['Cosmétique', 'Naturel', 'Bio'],
    description: 'Beurre de karité pur et naturel du Bénin. Hydratant, nourrissant pour la peau et les cheveux.',
    price: 1000,
    stock: 25,
    options: [
      { id: 'pot100', label: 'Pot 100g', multiplier: 1 },
      { id: 'pot250', label: 'Pot 250g', multiplier: 2.5 },
      { id: 'pot500', label: 'Pot 500g', multiplier: 5 }
    ],
    vendors: [
      { vendorId: 'v1', option: 'Pot 100g', pricePerUnit: 1000, stock: 25 },
      { vendorId: 'v2', option: 'Pot 250g', pricePerUnit: 2500, stock: 15 },
      { vendorId: 'v3', option: 'Pot 500g', pricePerUnit: 5000, stock: 10 }
    ]
  },
  {
    id: 'p9',
    name: 'Savon noir',
    category: 'cosmetiques',
    image: '/savoir noir.webp',
    tags: ['Cosmétique', 'Traditionnel'],
    description: 'Savon noir africain traditionnel, idéal pour le nettoyage en profondeur de la peau.',
    price: 800,
    stock: 35,
    options: [
      { id: 'petit', label: 'Petit format', multiplier: 1 },
      { id: 'grand', label: 'Grand format', multiplier: 2.5 }
    ],
    vendors: [
      { vendorId: 'v1', option: 'Petit format', pricePerUnit: 800, stock: 35 },
      { vendorId: 'v3', option: 'Grand format', pricePerUnit: 2000, stock: 18 }
    ]
  },
]

export function getProductById(id) {
  return products.find((p) => p.id === id)
}

export function getRelated(product, n = 4) {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, n)
}

export function getProductsByVendor(vendorId) {
  return products
    .filter(p => p.vendors?.some(v => v.vendorId === vendorId))
    .map(p => {
      const vendorInfo = p.vendors.find(v => v.vendorId === vendorId)
      return {
        ...p,
        price: vendorInfo.pricePerUnit,
        stock: vendorInfo.stock
      }
    })
}
