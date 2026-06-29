# 🚀 Guéma Market — Guide d'installation et de test complet

> Ce guide t'explique **pas à pas** comment installer le projet sur ton PC, le démarrer, et tester **toutes les fonctionnalités** de la plateforme. Aucune connaissance avancée requise — suis simplement les étapes dans l'ordre.

---

## 📦 Ce que contient le projet

Le projet est composé de **2 dossiers** :

| Dossier | Rôle | Technologie |
|---------|------|-------------|
| `guemamarket` | Frontend (le site que tu vois) | React + Vite |
| `guema-api` | Backend (l'API + base de données) | Laravel + MySQL |

**Les deux doivent tourner en même temps** pour que la plateforme fonctionne.

---

## 1️⃣ Prérequis — à installer d'abord

### a) Laragon (serveur local : PHP + MySQL)

1. Télécharge **Laragon Full** : https://laragon.org/download/
2. Installe-le (laisse les options par défaut → il s'installe dans `C:\laragon`)
3. Lance Laragon et clique sur **"Démarrer Tout"** (Start All) — Apache et MySQL doivent passer au vert

> Laragon inclut PHP et MySQL. Vérifie que ta version de PHP est **8.2 ou plus** : ouvre un terminal et tape `php -v`

### b) Composer (gestionnaire de paquets PHP)

1. Télécharge : https://getcomposer.org/Composer-Setup.exe
2. Installe (il détectera le PHP de Laragon automatiquement)
3. Vérifie : ouvre un terminal et tape `composer -V`

### c) Node.js (pour le frontend React)

1. Télécharge la version **LTS** : https://nodejs.org/
2. Installe (options par défaut)
3. Vérifie : `node -v` (doit afficher v18 ou plus) et `npm -v`

---

## 2️⃣ Placer les dossiers au bon endroit

1. Copie le dossier **`guema-api`** dans `C:\laragon\www\`
   → Résultat : `C:\laragon\www\guema-api`

2. Copie le dossier **`guemamarket`** où tu veux (par exemple sur le Bureau)
   → Résultat : `C:\Users\TON_NOM\Desktop\guemamarket`

---

## 3️⃣ Installer le Backend (guema-api)

Ouvre un terminal (**cmd** ou **PowerShell**) et exécute ligne par ligne :

```bash
cd C:\laragon\www\guema-api

# 1. Installer les dépendances PHP
composer install

# 2. Créer le fichier de configuration
copy .env.example .env

# 3. Générer la clé de sécurité de l'application
php artisan key:generate
```

### Configurer la base de données

1. Ouvre le fichier `C:\laragon\www\guema-api\.env` avec un éditeur de texte (Notepad, VS Code…)
2. Vérifie/modifie ces lignes :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=guema_market
DB_USERNAME=root
DB_PASSWORD=
```

> Avec Laragon, l'utilisateur est `root` **sans mot de passe** par défaut.

3. Crée la base de données : dans Laragon, clique sur **Menu → MySQL → Créer une base de données** et nomme-la **`guema_market`**
   *(ou bien dans un terminal : `mysql -u root -e "CREATE DATABASE guema_market;"`)*

### Créer les tables + données de test

```bash
# Créer toutes les tables
php artisan migrate

# Remplir avec les données de test (comptes, boutiques, produits)
php artisan db:seed

# Activer l'accès aux fichiers uploadés (photos, preuves de litiges)
php artisan storage:link
```

### Démarrer le serveur backend

```bash
php artisan serve
```

✅ Le backend tourne maintenant sur **http://127.0.0.1:8000** — **laisse ce terminal ouvert !**

---

## 4️⃣ Installer le Frontend (guemamarket)

Ouvre un **NOUVEAU terminal** (sans fermer le premier) :

```bash
cd C:\Users\TON_NOM\Desktop\guemamarket

# 1. Installer les dépendances JavaScript (peut prendre 2-3 minutes)
npm install
```

### Créer le fichier .env du frontend

Crée un fichier nommé `.env` à la racine du dossier `guemamarket` avec ce contenu :

```env
VITE_GOOGLE_MAPS_API_KEY=ta_cle_google_maps_ici
```

> ⚠️ Demande la clé Google Maps au propriétaire du projet, ou crée la tienne sur https://console.cloud.google.com (API "Maps JavaScript" + "Geocoding"). Sans cette clé, tout fonctionne sauf la carte de localisation au moment du paiement.

### Démarrer le frontend

```bash
npm run dev
```

✅ Le site est accessible sur **http://localhost:5173** — ouvre cette adresse dans ton navigateur !

---

## 5️⃣ Comptes de test (créés automatiquement par le seeder)

| Rôle | Identifiant | Mot de passe | Où se connecter |
|------|-------------|--------------|------------------|
| 👑 **Admin** | `admin@guema.bj` | `admin123` | http://localhost:5173/admin/login |
| 🛒 **Client** | `client@guema.bj` | `client123` | http://localhost:5173/connexion |
| 🏪 **Vendeur 1** | `+22997111111` | `vendor123` | http://localhost:5173/connexion |
| 🏪 **Vendeur 2** | `+22997222222` | `vendor123` | http://localhost:5173/connexion |
| 🏪 **Vendeur 3** | `+22997333333` | `vendor123` | http://localhost:5173/connexion |
| 🏪 **Vendeur 4** | `+22997444444` | `vendor123` | http://localhost:5173/connexion |
| 🚴 **Livreur** | `+22997666666` | `courier123` | http://localhost:5173/connexion |

> 💡 Astuce : ouvre plusieurs navigateurs (ou fenêtres de navigation privée) pour être connecté avec plusieurs rôles en même temps.

---

## 6️⃣ Tester toutes les fonctionnalités — scénarios pas à pas

### 🧪 Test 1 — Navigation par catégories (sans connexion)

1. Va sur http://localhost:5173
2. Descends à la section **"Explorez par catégorie"** — les cartes affichent de vraies images
3. Clique sur une carte (ex : **Produits frais**) → tu vois les **vendeurs** qui proposent cette catégorie avec leurs prix, notes et stocks
4. Va sur **Catalogue** dans le menu → les produits sont regroupés par catégories et sous-catégories
5. Clique sur la sous-catégorie **"Tomates"** → tu vois 6 produits de tomates venant de **4 boutiques différentes**, chaque carte indique « Disponible chez [nom de la boutique] »
6. Utilise la barre de recherche du catalogue (ex : tape "karité")

### 🧪 Test 2 — Parcours d'achat complet (client) avec escrow

1. Connecte-toi en **client** (`client@guema.bj` / `client123`)
2. Ajoute 2-3 produits au panier (depuis le catalogue ou une boutique)
3. Va dans le **Panier** → clique "Passer commande"
4. **Étape Livraison** :
   - Remplis nom + téléphone
   - Clique sur la **carte Google Maps** pour épingler ta position (le quartier se remplit tout seul)
   - Tu verras le bandeau **"Frais de livraison — 500 FCFA"** (fixe pour toutes les commandes)
5. **Étape Paiement** : choisis MTN/Moov/Celtiis, entre un numéro (ex : 97000000)
   - Note le bandeau : *"Vos fonds restent sécurisés jusqu'à confirmation de livraison"* → c'est l'**escrow**
6. Valide → la commande est créée avec une référence `GM-XXXXXXXX`
7. ✅ **Vérification du stock** : retourne voir le produit acheté → son stock a **diminué automatiquement**

### 🧪 Test 3 — Rupture de stock automatique

1. En client, achète **la totalité du stock** d'un produit (ex : un produit avec 8 en stock → commande 8)
2. Retourne sur la page du produit → badge **"Épuisé"**, bouton panier désactivé
3. Essaie d'acheter plus que le stock disponible → la commande est **refusée** avec un message d'erreur clair

### 🧪 Test 4 — Côté vendeur et séquestre des fonds

1. Connecte-toi en **vendeur** (`+22997111111` / `vendor123`)
2. Tu arrives sur le dashboard : encaissés, commandes, produits, stock bas
3. Regarde la bannière verte **"Revenus encaissés"** :
   - Après une commande payée mais pas encore livrée → tu dois voir **"X FCFA en séquestre · libéré après confirmation de livraison"**
   - Cela confirme que le vendeur ne touche **rien** tant que la livraison n'est pas confirmée
   - Après confirmation OTP → le montant passe dans "Revenus encaissés"
4. Onglet **"Commandes"** → tu vois la commande du client → clique **"Préparer"**
5. Onglet **"Mes produits"** → clique **"Ajouter un produit"** :
   - Choisis une **catégorie** (ex : Produits frais) → un 2ᵉ menu **sous-catégorie** apparaît (ex : Tomates)
   - Ajoute photo, prix, stock → publie
6. ✅ Va sur le catalogue (en navigation privée) → ton nouveau produit apparaît dans sa sous-catégorie

### 🧪 Test 5 — Côté livreur + infos vendeur + OTP + libération des fonds

1. Connecte-toi en **livreur** (`+22997666666` / `courier123`)
2. Onglet **"Mes missions"** → section "Disponibles" → tu vois la commande payée
3. Clique **"Voir sur la carte"** → Google Maps s'ouvre avec la position du client
4. Clique **"Accepter cette livraison"**
5. La mission passe "En cours" → tu dois voir un bloc **"Colis à récupérer"** avec :
   - Le nom de la boutique du vendeur
   - Son numéro de téléphone
   - Son adresse (ex : "Stand N°12, Allée A, Marché Central")
   - La liste des articles à récupérer chez lui
   - Si plusieurs vendeurs : les étapes sont numérotées (Étape 1, Étape 2…)
6. Clique **"Itinéraire"** pour la navigation GPS vers le client
7. Clique **"Arrivé — Envoyer OTP"** → le client reçoit un code à 4 chiffres
8. **Côté client** : va sur le suivi de commande → un bandeau rouge affiche le **code OTP**
9. **Côté livreur** : clique "Saisir code OTP" → entre le code
10. ✅ La livraison est confirmée, les **fonds sont libérés au vendeur** (notification)

### 🧪 Test 6 — Confirmation de réception par le client (alternative à l'OTP)

1. Refais une commande en client
2. Sur la page de suivi (`/suivi/ID`), clique **"J'ai reçu ma commande"**
3. ✅ Badge "Réception confirmée" → fonds libérés au vendeur

### 🧪 Test 7 — Litiges avec formulaires adaptés à chaque rôle

1. **En client** : va sur Mon compte → onglet **"Litiges"** → clique **"Nouveau"**
2. Observe les motifs proposés — ils sont spécifiques au **client** :
   - Colis non reçu / Produit endommagé / Produit incorrect / Retard de livraison / Autre
3. Sélectionne une commande, un motif, une priorité, décris le problème → Transmettre
4. ✅ Un message de succès apparaît : *"Litige soumis avec succès. L'administration a été notifiée."*
5. ✅ Le formulaire se ferme et le litige apparaît dans la liste — les fonds sont **gelés**
6. **En vendeur** : dashboard → onglet **"Litiges"** → clique "Nouveau" → les motifs sont différents :
   - Problème de paiement / Refus injustifié / Colis perdu / Litige avec le livreur / Autre
7. **En livreur** : onglet "Litiges" → les motifs sont encore différents :
   - Adresse introuvable / Client injoignable / Colis indisponible chez le vendeur / Litige avec le vendeur / Autre
8. **En admin** (http://localhost:5173/admin/login) : onglet Litiges → clique **"Traiter"** :
   - **Remboursement total** → 100% au client
   - **Remboursement partiel** → montant de ton choix
   - **Rejeté** → fonds libérés au vendeur
9. ✅ Les deux parties reçoivent une notification avec la décision

### 🧪 Test 8 — Inscription vendeur/livreur avec photo + validation admin

1. En navigation privée : http://localhost:5173/connexion → "S'inscrire" → choisis **Vendeur**
2. Remplis le formulaire et clique sur le **cercle photo** pour ajouter une photo de profil (optionnel)
3. Soumets → message "En attente de validation (72h)"
4. **En admin** : onglet "Vendeurs en attente" → tu vois le nouveau compte avec sa photo → **Valider**
5. ✅ Le nouveau vendeur peut maintenant se connecter et créer sa boutique (elle aussi devra être validée par l'admin)

### 🧪 Test 9 — Réinitialisation de mot de passe sécurisée (admin)

1. **En admin** : onglet "Utilisateurs" → trouve un utilisateur → clique **"Reset mdp"**
2. Un lien sécurisé est **copié dans ton presse-papier** (valable 24h)
3. Colle ce lien dans un autre navigateur → page de réinitialisation
4. Entre un nouveau mot de passe (min 8 caractères) → confirme
5. ✅ Connecte-toi avec le nouveau mot de passe. À aucun moment le mot de passe n'apparaît en clair.

### 🧪 Test 10 — Recommandations vendeur

1. Va sur n'importe quelle page produit
2. ✅ En bas : section **"Autres produits de cette boutique"** (jusqu'à 8 produits du même vendeur)
3. Après un achat, sur la page de suivi : recommandations des vendeurs de ta commande (en excluant ce que tu as déjà acheté)

### 🧪 Test 11 — Frais de livraison fixes

Au checkout, vérifie que les frais de livraison affichés sont toujours **500 FCFA**, quelle que soit la commande.

Dans le récapitulatif du paiement (colonne de droite) :
- Sous-total : montant de tes articles
- Service : 15% du sous-total
- Livraison : **500 FCFA** (fixe, toujours)
- Total = sous-total + service + 500

> 💡 Ce montant est le même pour toutes les commandes : petite ou grande, proche ou éloignée — 500 FCFA.

---

## 🛠️ Problèmes courants

| Problème | Solution |
|----------|----------|
| `composer install` échoue | Vérifie que PHP ≥ 8.2 (`php -v`). Dans Laragon : Menu → PHP → Version |
| Erreur "Connection refused" au login | Le backend n'est pas démarré → `php artisan serve` dans `guema-api` |
| Page blanche / pas de produits | La base est vide → `php artisan migrate` puis `php artisan db:seed` |
| Erreur CORS dans la console | Le frontend doit tourner sur le port **5173** (`npm run dev`) |
| Les images de produits ne s'affichent pas | Normal pour certaines : elles pointent vers `/public`. Vérifie que tu as bien tout le dossier `public/` |
| La carte Google Maps ne s'affiche pas | Il manque le fichier `.env` du frontend avec `VITE_GOOGLE_MAPS_API_KEY` |
| "SQLSTATE Unknown database" | Crée la base **`guema_market`** dans Laragon (Menu → MySQL) |
| Tout réinitialiser | `php artisan migrate:fresh --seed` (⚠️ efface toutes les données) |

---

## 📋 Récap démarrage rapide (après la 1ʳᵉ installation)

À chaque fois que tu veux lancer le projet :

```bash
# 1. Démarre Laragon (bouton "Démarrer Tout")

# 2. Terminal 1 — Backend
cd C:\laragon\www\guema-api
php artisan serve

# 3. Terminal 2 — Frontend
cd C:\Users\TON_NOM\Desktop\guemamarket
npm run dev

# 4. Ouvre http://localhost:5173
```

Bon test ! 🎉

> 📖 Pour comprendre le fonctionnement détaillé de la plateforme (architecture, API, base de données), consulte le fichier [README.md](README.md).
