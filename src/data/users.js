// Liste de tes utilisateurs / vendeuses du marché
export const users = [
  {
    id: 'v1',
    name: 'Maman Chantal',
    role: 'vendor',
    shopNumber: 'Stand N° 12, Allée A',
    avatar: 'photo-1544005313-94ddf0286df2'
  },
  {
    id: 'v2',
    name: 'Tantie Reine',
    role: 'vendor',
    shopNumber: 'Stand N° 05, Zone Fruits',
    avatar: 'photo-1506794778202-cad84cf45f1d'
  },
  {
    id: 'v3',
    name: 'Maman Beni',
    role: 'vendor',
    shopNumber: 'Stand N° 24, Secteur Épices',
    avatar: 'photo-1531746020798-e6953c6e8e04'
  }
];

// L'export qui te manquait et qui causait l'écran blanc !
// On définit un utilisateur connecté par défaut pour ton AuthContext
export const currentUser = {
  id: 'u-client-01',
  name: 'Hostine Fadegnon',
  role: 'client',
  email: 'hostine@example.com'
};

// Fonction utilitaire pour récupérer une vendeuse par son ID
export function getVendor(id) {
  return users.find(user => user.id === id && user.role === 'vendor');
}