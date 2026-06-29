// Registre d'icônes explicite : on n'importe que ce qui est utilisé pour éviter
// d'embarquer toute la librairie lucide-react dans le bundle.
import {
  Activity, Apple, Award, BarChart3, Bell, Bike, Carrot, Circle, CheckCircle2,
  CupSoda, Flame, Heart, History, Home, LayoutDashboard, Navigation, Package,
  Palette, Settings, ShieldAlert, Shirt, ShoppingCart, Sparkles, Star, Store,
  Tag, TrendingUp, User, Users, Wallet,
} from 'lucide-react'

export const ICONS = {
  Activity, Apple, Award, BarChart3, Bell, Bike, Carrot, Circle, CheckCircle2,
  CupSoda, Flame, Heart, History, Home, LayoutDashboard, Navigation, Package,
  Palette, Settings, ShieldAlert, Shirt, ShoppingCart, Sparkles, Star, Store,
  Tag, TrendingUp, User, Users, Wallet,
}

export function getIcon(name, fallback = Circle) {
  return ICONS[name] || fallback
}
