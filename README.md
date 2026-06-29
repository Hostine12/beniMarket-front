# 🛒 Marketou — Guide complet de la plateforme

> **Pour débutants** — Ce guide explique comment fonctionne la plateforme Marketou de A à Z, toutes les fonctionnalités disponibles, et les scénarios d'utilisation pour chaque type d'utilisateur.

> 🚀 **Tu veux juste installer et tester le projet ?** → Suis le guide pas à pas [INSTALLATION.md](INSTALLATION.md) (prérequis, installation, comptes de test, 11 scénarios de test complets).

---

## 📋 Table des matières

1. [Qu'est-ce que Marketou ?](#1-quest-ce-que-marketou-)
2. [Architecture technique](#2-architecture-technique)
3. [Les 4 types d'utilisateurs](#3-les-4-types-dutilisateurs)
4. [Scénario Client — Acheter un produit](#4-scénario-client--acheter-un-produit)
5. [Scénario Vendeur — Vendre ses produits](#5-scénario-vendeur--vendre-ses-produits)
6. [Scénario Livreur — Effectuer des livraisons](#6-scénario-livreur--effectuer-des-livraisons)
7. [Scénario Administrateur — Gérer la plateforme](#7-scénario-administrateur--gérer-la-plateforme)
8. [Système de stock](#8-système-de-stock)
9. [Système de paiement et séquestre (Escrow)](#9-système-de-paiement-et-séquestre-escrow)
10. [Frais de livraison intelligents](#10-frais-de-livraison-intelligents)
11. [Catégories et sous-catégories](#11-catégories-et-sous-catégories)
12. [Recommandations de produits](#12-recommandations-de-produits)
13. [Module de litiges](#13-module-de-litiges)
14. [Réinitialisation de mot de passe](#14-réinitialisation-de-mot-de-passe)
15. [Photos de profil](#15-photos-de-profil)
16. [Toutes les pages de l'application](#16-toutes-les-pages-de-lapplication)
17. [Toutes les routes API](#17-toutes-les-routes-api)
18. [Installation et démarrage](#18-installation-et-démarrage)
19. [Base de données — toutes les tables](#19-base-de-données--toutes-les-tables)
20. [Glossaire](#20-glossaire)

---

## 1. Qu'est-ce que Marketou ?

**Marketou** (nom de code : Guéma) est une marketplace locale basée à **Parakou, Bénin**. C'est une plateforme qui met en relation :

- Des **clients** qui veulent acheter des produits locaux
- Des **vendeurs** qui veulent vendre leurs produits
- Des **livreurs** qui assurent la livraison des commandes

Le paiement se fait via **Mobile Money** (MTN MoMo, Moov Money, Celtiis Cash) — les opérateurs béninois.

**Ce qui rend Marketou unique :**
- Les fonds sont **sécurisés** : l'argent n'est jamais versé directement au vendeur. Il est bloqué sur la plateforme jusqu'à ce que le client confirme avoir bien reçu sa commande.
- Les produits sont organisés par **catégories et sous-catégories** pour faciliter la recherche.
- Un système de **recommandations** suggère d'autres produits du même vendeur après un achat.
- Un module complet de **gestion des litiges** permet de résoudre les conflits.

---

## 2. Architecture technique

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│   React 18 + Vite + Tailwind CSS + React Router      │
│   Dossier : C:\Users\ismael\Desktop\guemamarket       │
│   URL dev  : http://localhost:5173                   │
└────────────────────┬────────────────────────────────┘
                     │  HTTP / JSON (Axios)
                     │  Authorization: Bearer {token}
┌────────────────────▼────────────────────────────────┐
│                    BACKEND                           │
│   Laravel 13 + PHP + Laravel Sanctum (auth tokens)   │
│   Dossier : C:\laragon\www\guema-api                 │
│   URL dev  : http://127.0.0.1:8000/api               │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│                  BASE DE DONNÉES                     │
│   MySQL (Laragon) — 16 tables                        │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│               SERVICES EXTERNES                      │
│   FedaPay — Paiement Mobile Money (MTN/Moov/Celtiis) │
│   OpenStreetMap / Nominatim — Géocodage adresses     │
└─────────────────────────────────────────────────────┘
```

---

## 3. Les 4 types d'utilisateurs

| Rôle | Accès | Tableau de bord | Ce qu'il peut faire |
|------|-------|-----------------|---------------------|
| **Client** | Email requis, accès immédiat | `/compte` | Acheter, suivre commandes, ouvrir litiges |
| **Vendeur** | Téléphone requis, validation admin sous 72h | `/vendeur` | Créer boutique, ajouter produits, voir ses ventes |
| **Livreur** | Téléphone + véhicule, validation admin | `/livreur` | Accepter livraisons, vérifier OTP |
| **Admin** | Compte créé manuellement | `/admin` | Tout gérer, valider comptes, résoudre litiges |

### Comment s'inscrire ?

1. Aller sur `/connexion`
2. Choisir son rôle (Client / Vendeur / Livreur)
3. Remplir le formulaire
4. **Client** → accès immédiat
5. **Vendeur/Livreur** → attendre la validation admin (max 72h)

---

## 4. Scénario Client — Acheter un produit

### Étape 1 — Créer un compte client

- Aller sur `/connexion` → onglet "S'inscrire"
- Sélectionner **"Client"**
- Renseigner : nom complet, email, mot de passe
- Cliquer "Créer mon compte" → connexion automatique

### Étape 2 — Trouver un produit

**Option A — Par catégorie (recommandée) :**

1. Sur la page d'accueil `/`, chaque catégorie affiche un chevron ▼
2. Cliquer sur le chevron → les sous-catégories se déroulent (ex : "Tomates", "Légumes", "Céréales")
3. Cliquer sur **"Tomates"** → page `/categorie/:id/vendeurs`
4. Voir tous les **vendeurs** qui proposent des tomates avec :
   - Fourchette de prix (min → max)
   - Note moyenne (étoiles)
   - Quantité disponible en stock
   - Aperçu des produits proposés
5. Choisir un vendeur → cliquer "Voir la boutique"

**Option B — Par recherche :**
- Aller sur `/catalogue`
- Taper dans la barre de recherche ou filtrer par catégorie, prix, note

**Option C — Par boutique directe :**
- Cliquer sur le nom d'une boutique → `/boutique/:id`
- Voir tous les produits d'un vendeur spécifique

### Étape 3 — Voir le détail d'un produit

- Cliquer sur un produit → `/produit/:id`
- Voir : photos, description, prix, stock disponible, note
- **Si le produit est en rupture de stock** → bouton grisé, impossible d'ajouter
- Choisir la quantité → "Ajouter au panier"
- En bas de page : section **"Autres produits de cette boutique"** (recommandations)

### Étape 4 — Le panier (`/panier`)

- Modifier les quantités ou supprimer des articles
- Récapitulatif : sous-total, frais de service (15%), frais de livraison
- Cliquer "Passer commande" → redirigé vers le checkout (connexion requise)

### Étape 5 — Le checkout (`/paiement`) — 3 étapes

**Étape 1/3 — Adresse de livraison :**

| Champ | Obligatoire | Description |
|-------|-------------|-------------|
| Nom complet | Oui | Personne qui reçoit la commande |
| Téléphone | Oui | Numéro de contact pour la livraison |
| Quartier | Oui | Ex. Albarika, Titirou, Zongo... |
| Zone | Oui | Centre-ville / Périphérie / Rural / Difficile d'accès |
| Position carte | Non | Épingler l'adresse exacte sur la carte |
| Instructions | Non | Précisions pour le livreur |

Après avoir sélectionné la **zone**, les frais de livraison sont calculés et affichés.

**Étape 2/3 — Paiement Mobile Money :**

- Choisir l'opérateur : **MTN MoMo**, **Moov Money**, ou **Celtiis Cash**
- Saisir le numéro Mobile Money
- Lire le bandeau de sécurité : *"Vos fonds restent sécurisés jusqu'à confirmation de livraison"*
- Cliquer "Payer"

**Étape 3/3 — Confirmation :**

- La commande est créée avec une référence unique (ex : `GM-A1B2C3D4`)
- Un SMS est envoyé sur le téléphone Mobile Money
- Le client confirme le paiement sur son téléphone
- Redirection vers la page de suivi

### Étape 6 — Suivi de commande (`/suivi/:id`)

Le statut évolue ainsi :

```
⏳ En attente
    ↓  (paiement reçu)
✅ Confirmée
    ↓  (vendeur prépare)
📦 En préparation
    ↓  (livreur prend en charge)
🚚 En livraison
    ↓  (OTP vérifié)
🎉 Livrée
```

Quand le livreur arrive, un **bandeau rouge urgent** s'affiche avec le code OTP à communiquer.

### Étape 7 — Confirmer la réception (IMPORTANT)

Après livraison, deux façons de confirmer :
1. **Le livreur** saisit le code OTP → libération automatique des fonds
2. **Le client** clique "J'ai reçu ma commande" en haut de la page de suivi

> Sans cette confirmation, les fonds restent bloqués et le vendeur ne reçoit rien.

Après confirmation, des **recommandations** de produits des mêmes vendeurs apparaissent en bas.

### Étape 8 — Que faire en cas de problème ?

Aller sur `/compte` → onglet "Litiges" → voir la [section litiges](#13-module-de-litiges).

---

## 5. Scénario Vendeur — Vendre ses produits

### Étape 1 — S'inscrire comme vendeur

- `/connexion` → "S'inscrire" → sélectionner **"Vendeur"**
- Renseigner : nom, téléphone (**obligatoire**), email (optionnel), mot de passe
- **Photo de profil** : cliquer sur le cercle pour uploader une photo (optionnel)
- Soumettre → message "En attente de validation (72h)"

### Étape 2 — Attendre la validation admin

- L'admin reçoit une notification dans son tableau de bord
- Il consulte le profil et valide ou rejette le compte
- Le vendeur reçoit une notification par l'application

### Étape 3 — Créer sa boutique (`/vendeur`)

Onglet **"Ma Boutique"** → remplir :
- Nom de la boutique, description
- Ville (Parakou), adresse physique
- Téléphone de contact
- Logo et photo de couverture
- Soumettre → en attente de validation de la boutique

### Étape 4 — Ajouter des produits

Onglet **"Mes Produits"** → "Ajouter un produit" :

| Champ | Description |
|-------|-------------|
| Nom | Nom commercial du produit |
| Catégorie | Catégorie/sous-catégorie (permet d'apparaître dans les recherches) |
| Description | Détails, origine, mode de conservation... |
| Prix | En FCFA |
| **Stock** | Quantité disponible — décrémenté automatiquement à chaque commande |
| Photos | Images du produit |
| Options | Variantes (taille, conditionnement...) |

> **Important :** Bien renseigner le stock. Quand il atteint 0, le produit passe automatiquement en "Rupture de stock".

### Étape 5 — Gérer les commandes

- Dashboard vendeur → voir toutes les commandes pour ses produits
- Mettre à jour le statut au fur et à mesure

### Étape 6 — Recevoir les fonds

- Les fonds sont **bloqués** tant que le client n'a pas confirmé la réception
- Après confirmation OTP ou bouton client → fonds libérés + notification
- En cas de litige → les fonds restent bloqués jusqu'à la décision admin

---

## 6. Scénario Livreur — Effectuer des livraisons

### Étape 1 — S'inscrire comme livreur

- `/connexion` → "S'inscrire" → sélectionner **"Livreur"**
- Renseigner : nom, téléphone, marque du véhicule, plaque d'immatriculation
- **Photo de profil optionnelle**
- Attendre la validation admin

### Étape 2 — Voir les livraisons disponibles (`/livreur`)

- Onglet **"Disponibles"** : commandes payées sans livreur assigné
- Voir : adresse de livraison, quartier, articles de la commande

### Étape 3 — Accepter une livraison

- Cliquer "Accepter" sur une livraison disponible
- La commande passe en statut "En livraison"
- Le client reçoit une notification "Un livreur est en route"

### Étape 4 — Livrer la commande (processus OTP)

```
1. Arriver à l'adresse du client
2. Dans l'app : cliquer "Demander le code OTP"
   → Le client reçoit une notification avec son code à 4 chiffres
3. Le client communique verbalement le code au livreur
4. Le livreur saisit le code dans l'app
5. Code correct → livraison confirmée, fonds libérés au vendeur
   Code incorrect → message d'erreur, réessayer
```

### Étape 5 — Après la livraison

- La livraison apparaît dans l'historique
- Les fonds sont automatiquement libérés au vendeur

---

## 7. Scénario Administrateur — Gérer la plateforme

L'admin se connecte sur `/admin` avec un compte créé manuellement (voir [Installation](#18-installation-et-démarrage)).

### Tableau de bord — Vue d'ensemble

- **Statistiques** : utilisateurs, commandes, chiffre d'affaires, litiges
- **Graphique** : ventes mensuelles de l'année en cours
- **Top vendeurs** : classement par revenus
- **Commandes récentes** : 10 dernières commandes

### Valider les nouveaux comptes

Onglet **"Vendeurs en attente"** / **"Livreurs en attente"** :
- Voir les informations soumises (nom, téléphone, véhicule...)
- Cliquer **"Valider"** → compte activé, utilisateur peut se connecter
- Cliquer **"Rejeter"** → compte refusé avec message d'explication

### Valider les boutiques

Onglet **"Boutiques en attente"** :
- Vérifier les informations de la boutique
- **Valider** → boutique active, vendeur peut ajouter des produits
- **Rejeter** → avec motif de rejet (communiqué au vendeur)

### Gérer les utilisateurs

Onglet **"Utilisateurs"** :
- Rechercher par nom, email ou téléphone
- **Activer** un compte banni
- **Bannir** un compte problématique
- **Générer un lien de réinitialisation de mot de passe** :
  - Cliquer "Reset mdp" sur un utilisateur
  - Un lien sécurisé (valable 24h) est généré et copié dans le presse-papier
  - Transmettre le lien à l'utilisateur par SMS ou email
  - L'utilisateur crée son nouveau mot de passe sans que l'admin ne le voie jamais

### Gérer les litiges

Onglet **"Litiges"** :
- Voir tous les litiges avec priorité (Haute / Moyenne / Basse)
- Cliquer **"Traiter"** sur un litige ouvert
- Choisir la décision :
  - **Remboursement total** → 100% retourne au client
  - **Remboursement partiel** → saisir le montant exact
  - **Réclamation rejetée** → fonds libérés intégralement au vendeur
- Ajouter une note administrative (visible par client et vendeur)
- Changer le statut : En révision / Résolu / Clôturé

---

## 8. Système de stock

### Comment ça fonctionne ?

Chaque produit a un **stock** (entier) et un **statut** :

| Statut | Signification |
|--------|---------------|
| `active` | Produit en vente, stock > 0 |
| `inactive` | Produit masqué par le vendeur |
| `out_of_stock` | Rupture automatique, stock = 0 |

### Règles appliquées à chaque commande

**1. Vérification AVANT création de commande :**

```
Pour chaque article dans le panier :
  → Produit existe ?            Non → Erreur "Produit introuvable"
  → Statut = out_of_stock ?      Oui → Erreur "Produit en rupture"
  → Stock >= quantité demandée ? Non → Erreur "Stock insuffisant (dispo: X, demandé: Y)"
Tout passe → commande créée
```

**2. Décrémentation APRÈS création :**

```
Pour chaque article commandé :
  nouveau_stock = stock_actuel - quantité_commandée
  Si nouveau_stock == 0 → statut = "out_of_stock"
```

**3. Restauration en cas d'annulation :**

```
Pour chaque article annulé :
  nouveau_stock = stock_actuel + quantité_annulée
  Si statut était "out_of_stock" → statut = "active"
```

### Ce que voit le client

- Produit en rupture → badge "Rupture de stock" + bouton ajout panier désactivé
- Page vendeurs/catégorie → stock affiché pour chaque produit
- Erreur claire si le stock change entre l'ajout au panier et la validation de commande

---

## 9. Système de paiement et séquestre (Escrow)

### Qu'est-ce que l'escrow ?

L'**escrow** (séquestre) est le mécanisme de sécurité central de Marketou. Quand un client paie, **l'argent ne va pas directement au vendeur**. Il est retenu sur la plateforme jusqu'à confirmation de livraison.

### Cycle de vie complet des fonds

```
CLIENT PAIE
     │
     ▼
[escrow_status = "held"]
Fonds bloqués sur la plateforme
     │
     ├──── Livraison confirmée (OTP du livreur OU bouton client)
     │          ↓
     │    [escrow_status = "released"]
     │    Fonds libérés au vendeur + notification
     │
     ├──── Client ouvre un litige
     │          ↓
     │    [escrow_status = "disputed"]
     │    Fonds gelés pendant l'examen admin
     │          │
     │          ├── Admin → Remboursement total
     │          │     [escrow_status = "refunded"]
     │          │     100% remboursé au client
     │          │
     │          ├── Admin → Remboursement partiel
     │          │     [escrow_status = "refunded"]
     │          │     Montant défini remboursé au client
     │          │
     │          └── Admin → Rejet de la réclamation
     │                [escrow_status = "released"]
     │                Fonds libérés au vendeur
     │
     └──── Commande annulée (si déjà payée)
               ↓
         [escrow_status = "refunded"]
         Fonds remboursés au client
```

### Opérateurs de paiement supportés

| Opérateur | Code API | Logo |
|-----------|----------|------|
| MTN Mobile Money | `mtn` | `/mtn-momo-mobile-money-uganda-logo...` |
| Moov Money | `moov` | `/moov.png` |
| Celtiis Cash | `celtiis` | `/celtis.png` |

---

## 10. Frais de livraison intelligents

### Formule de calcul

```
Frais bruts = (300 + distance_km × 80 + max(0, poids_kg - 1) × 50
              + max(0, nb_articles - 3) × 25) × multiplicateur_zone

Frais finaux = max(300, min(5000, arrondi(Frais bruts)))
```

### Multiplicateurs par zone

| Zone | Multiplicateur | Exemple : 3 km, 2 kg, 5 articles |
|------|:--------------:|:---------------------------------:|
| Centre-ville | × 1.0 | `(300 + 240 + 50 + 50) × 1.0` = **640 FCFA** |
| Périphérie | × 1.3 | `(640) × 1.3` = **832 FCFA** |
| Zone rurale | × 1.8 | `(640) × 1.8` = **1 152 FCFA** |
| Zone difficile | × 2.5 | `(640) × 2.5` = **1 600 FCFA** |

**Plancher : 300 FCFA — Plafond : 5 000 FCFA**

### Répartition des frais

```
Total frais de livraison
       │
       ├── 70% → CLIENT         (affiché dans le checkout)
       ├── 20% → VENDEUR        (déduit de son versement)
       └── 10% → LIVREUR        (rémunération)
```

---

## 11. Catégories et sous-catégories

### Structure hiérarchique

```
📂 Catégorie parente (ex: Alimentation)
├── 📁 Sous-catégorie (ex: Tomates)
├── 📁 Sous-catégorie (ex: Légumes verts)
└── 📁 Sous-catégorie (ex: Céréales)

📂 Catégorie parente (ex: Construction)
├── 📁 Matériaux
├── 📁 Quincaillerie
└── 📁 Menuiserie
```

### Navigation depuis l'accueil

1. Page d'accueil → grille de catégories
2. Chaque catégorie avec sous-catégories affiche un **chevron ▼**
3. Cliquer sur le chevron → sous-catégories avec nombre de produits
4. Cliquer sur une sous-catégorie → `/categorie/:id/vendeurs`

### Page vendeurs par catégorie

Pour chaque vendeur proposant des produits dans la catégorie :

| Information affichée | Description |
|----------------------|-------------|
| Photo du vendeur | Avatar ou initiales si pas de photo |
| Nom de la boutique | + ville |
| Fourchette de prix | Prix minimum → maximum des produits |
| Note moyenne | Moyenne des notes de tous les produits |
| Stock total | Somme des stocks disponibles |
| Aperçu produits | Les 3 premiers produits avec prix et stock |

**Filtres disponibles sur la page :**
- Boutons sous-catégories en haut
- Barre de recherche (par nom de boutique ou vendeur)
- Tri : Mieux notés / Prix le plus bas / Plus de stock

---

## 12. Recommandations de produits

### Sur la page produit (`/produit/:id`)

Section "Autres produits de cette boutique" :
- Jusqu'à **8 produits** du même vendeur
- Triés par note décroissante
- Bouton "Ajouter au panier" rapide

### Après un achat (`/suivi/:id`)

Section "Autres produits de ces vendeurs" :
- Produits des vendeurs de la commande (excluant les produits déjà achetés)
- Jusqu'à **12 suggestions**
- Objectif : fidéliser le client chez les mêmes vendeurs

---

## 13. Module de litiges

### Quand ouvrir un litige ?

Un client peut ouvrir un litige si :
- Le produit reçu est abîmé ou impropre à la consommation
- Des articles manquent dans la commande
- Le livreur n'est jamais venu
- Le prix facturé est incorrect
- Tout autre problème lié à la commande

### Ouvrir un litige (client)

1. `/compte` → onglet **"Litiges"**
2. Cliquer **"Nouveau"**
3. Sélectionner la commande concernée
4. Choisir le motif et la priorité (Basse / Moyenne / Haute)
5. Décrire le problème en détail
6. Soumettre

À l'ouverture : les fonds de la commande sont **gelés** automatiquement.

### Espace de messagerie

Après ouverture, un fil de discussion s'ouvre entre les 3 parties :

```
CLIENT          VENDEUR         ADMIN
   ↕               ↕               ↕
   └───────────────┴───────────────┘
       Messagerie commune du litige
```

- Envoyer des messages texte
- **Joindre des preuves** : photos, vidéos, PDF (max 5 Mo)
- L'admin peut ajouter des notes internes (non visibles par client/vendeur)

### Statuts du litige

| Statut | Couleur | Signification |
|--------|---------|---------------|
| `open` | Amber | Litige ouvert, en attente |
| `in_review` | Bleu | Admin examine le dossier |
| `resolved` | Vert | Décision rendue |
| `closed` | Gris | Définitivement clôturé |

### Décisions admin et effet sur les fonds

| Décision | Fonds | Message affiché |
|----------|-------|-----------------|
| Remboursement total | 100% au client | "Remboursement total accordé pour la commande GM-XXXX" |
| Remboursement partiel | Montant défini au client | "Remboursement partiel accordé pour la commande GM-XXXX" |
| Réclamation rejetée | 100% au vendeur | "Votre réclamation pour la commande GM-XXXX n'a pas été retenue" |

---

## 14. Réinitialisation de mot de passe

### Flux sécurisé — aucun mot de passe en clair

```
1. ADMIN clique "Reset mdp" sur un utilisateur
         ↓
2. SYSTÈME génère un token aléatoire de 64 caractères
   → Stocké hashé en base de données (jamais en clair)
   → Expiration : 24 heures
         ↓
3. SYSTÈME construit l'URL :
   /reset-password?token=XXXX&uid=YY
   → Copiée dans le presse-papier de l'admin
         ↓
4. ADMIN transmet l'URL par SMS ou email
         ↓
5. UTILISATEUR clique sur le lien → page /reset-password
   → Saisit nouveau mot de passe (min 8 caractères)
   → Confirme le mot de passe
         ↓
6. SYSTÈME vérifie le token et son expiration
   → Invalide tous les tokens de session existants
   → Mot de passe mis à jour
         ↓
7. UTILISATEUR redirigé vers la connexion
```

**Sécurités en place :**
- Token hashé en BDD (bcrypt)
- Expiration stricte après 24h
- Invalidation de toutes les sessions après réinitialisation
- Zéro affichage de mot de passe en clair à tout moment

---

## 15. Photos de profil

### Inscription vendeur / livreur

Dans le formulaire d'inscription (rôle Vendeur ou Livreur) :

1. Un cercle avec icône caméra apparaît dans le formulaire
2. Cliquer sur le cercle → sélecteur de fichier image
3. Formats acceptés : JPG, PNG (max 2 Mo)
4. **Prévisualisation immédiate** dans le cercle
5. Croix ✕ pour supprimer la photo choisie
6. La photo est uploadée avec l'inscription via `multipart/form-data`

### Affichage sur la plateforme

| Endroit | Ce qui s'affiche |
|---------|-----------------|
| Page vendeurs par catégorie | Miniature ronde |
| Recommandations produits | Miniature ronde |
| Dashboard du vendeur/livreur | Photo en haut de page |

**Sans photo :** un avatar coloré avec les initiales du nom est généré automatiquement.

---

## 16. Toutes les pages de l'application

### Pages publiques

| URL | Nom | Description |
|-----|-----|-------------|
| `/` | Accueil | Hero, catégories expandables, produits vedettes, témoignages |
| `/catalogue` | Catalogue | Tous les produits actifs, filtres, recherche |
| `/categorie/:id/vendeurs` | Vendeurs par catégorie | Vendeurs proposant cette catégorie/sous-catégorie |
| `/produit/:id` | Détail produit | Photos, infos, ajout panier, recommandations |
| `/boutique/:id` | Boutique | Tous les produits d'un vendeur |
| `/panier` | Panier | Articles, quantités, récapitulatif |
| `/suivi/:id` | Suivi commande | Statut, OTP, confirmation réception, recommandations |
| `/aide` | Aide / FAQ | Questions fréquentes |
| `/vendre` | Devenir vendeur | Informations pour les futurs vendeurs |
| `/connexion` | Connexion/Inscription | Formulaire d'auth avec sélection de rôle |
| `/reset-password` | Réinitialisation mdp | Formulaire avec token (depuis lien admin) |

### Pages protégées

| URL | Rôle requis | Description |
|-----|-------------|-------------|
| `/paiement` | Client | Checkout 3 étapes (livraison → paiement → confirmation) |
| `/compte` | Client | Commandes, notifications, litiges complet |
| `/vendeur` | Vendeur | Boutique, produits, statistiques de ventes |
| `/livreur` | Livreur | Livraisons disponibles, en cours, historique |
| `/admin` | Admin | Tableau de bord complet |
| `/admin/login` | — | Connexion admin séparée |

---

## 17. Toutes les routes API

### Routes publiques

```http
POST   /api/register                       Inscription (multipart/form-data pour avatar)
POST   /api/login                          Connexion → retourne token + user
POST   /api/password/reset                 Réinitialiser mdp avec token
POST   /api/payments/callback              Webhook FedaPay (appelé automatiquement)
GET    /api/categories                     Catégories parentes avec sous-catégories
GET    /api/categories/:id                 Détail d'une catégorie
GET    /api/categories/:id/sellers         Vendeurs proposant cette catégorie
GET    /api/categories/:id/products        Produits d'une catégorie (filtrable)
GET    /api/products                       Liste produits (search, category, shop_id)
GET    /api/products/:id                   Détail produit
GET    /api/products/:id/recommendations   Autres produits du même vendeur
GET    /api/shops                          Liste des boutiques actives
GET    /api/shops/:id                      Détail d'une boutique
POST   /api/delivery-fee/quote             Devis frais de livraison
```

### Routes authentifiées (header requis : `Authorization: Bearer TOKEN`)

```http
# Profil
POST   /api/logout                         Déconnecter (invalide le token)
GET    /api/me                             Profil utilisateur connecté
POST   /api/password/change                Changer son propre mot de passe

# Panier
GET    /api/cart                           Voir son panier
POST   /api/cart                           Ajouter un article
PUT    /api/cart/:id                       Modifier la quantité
DELETE /api/cart/:id                       Supprimer un article
DELETE /api/cart/clear                     Vider entièrement le panier

# Commandes
GET    /api/orders                         Mes commandes (paginées)
POST   /api/orders                         Créer une commande (vérifie stock)
GET    /api/orders/:id                     Détail d'une commande
PUT    /api/orders/:id/status              Mettre à jour le statut
POST   /api/orders/:id/confirm-received    Confirmer réception → libère les fonds
GET    /api/orders/recommendations         Recommandations post-achat (?order_id=X)

# Paiements
POST   /api/payments/initiate/:orderId     Initier paiement Mobile Money
GET    /api/payments/status/:orderId       Statut paiement + escrow_status

# Livraisons (livreur uniquement)
GET    /api/deliveries                     Disponibles + en cours + historique
PUT    /api/deliveries/:id/accept          Accepter une livraison
PUT    /api/deliveries/:id/request-otp     Demander OTP au client
PUT    /api/deliveries/:id/verify-otp      Vérifier OTP → confirme livraison

# Notifications
GET    /api/notifications                  Mes notifications
PUT    /api/notifications/read-all         Marquer tout comme lu
PUT    /api/notifications/:id/read         Marquer une notification comme lue
DELETE /api/notifications/:id              Supprimer une notification

# Boutique (vendeur uniquement)
POST   /api/shops                          Créer sa boutique
PUT    /api/shops/:id                      Modifier sa boutique
DELETE /api/shops/:id                      Supprimer sa boutique
GET    /api/vendor/shop                    Voir sa propre boutique

# Produits (vendeur uniquement)
POST   /api/products                       Ajouter un produit
PUT    /api/products/:id                   Modifier un produit
DELETE /api/products/:id                   Supprimer un produit
GET    /api/vendor/products                Voir ses produits

# Litiges
GET    /api/disputes                       Mes litiges
POST   /api/disputes                       Ouvrir un litige
GET    /api/disputes/:id                   Détail + messages + preuves
POST   /api/disputes/:id/messages          Envoyer un message
POST   /api/disputes/:id/evidences         Joindre une preuve (multipart)
```

### Routes admin (`role:admin` requis)

```http
GET    /api/admin/stats                       Statistiques globales
GET    /api/admin/users                       Tous les utilisateurs
PUT    /api/admin/users/:id/status            Activer ou bannir
POST   /api/admin/users/:id/password-reset    Générer lien reset mdp
GET    /api/admin/vendors/pending             Vendeurs en attente
GET    /api/admin/couriers/pending            Livreurs en attente
PUT    /api/admin/accounts/:id/validate       Valider ou rejeter un compte
GET    /api/admin/shops/pending               Boutiques en attente
PUT    /api/admin/shops/:id/validate          Valider ou rejeter une boutique
GET    /api/admin/shops                       Toutes les boutiques
GET    /api/admin/disputes                    Tous les litiges
PUT    /api/admin/disputes/:id/resolve        Résoudre un litige (+ type + montant)
POST   /api/admin/categories                  Créer une catégorie/sous-catégorie
```

---

## 18. Installation et démarrage

### Prérequis logiciels

| Logiciel | Version | Utilité |
|----------|---------|---------|
| Node.js | 18+ | Exécuter le frontend React |
| PHP | 8.2+ | Exécuter le backend Laravel |
| Composer | Latest | Gestionnaire de paquets PHP |
| Laragon | Latest | Serveur local (MySQL + Apache) |

### Backend — Laravel

```bash
# 1. Se placer dans le dossier
cd C:\laragon\www\guema-api

# 2. Installer les dépendances PHP
composer install

# 3. Copier la configuration
cp .env.example .env
# Ou sur Windows :
copy .env.example .env

# 4. Configurer .env :
#    APP_URL=http://127.0.0.1:8000
#    DB_DATABASE=guema_api
#    DB_USERNAME=root
#    DB_PASSWORD=
#    FEDAPAY_KEY=votre_cle_fedapay
#    FEDAPAY_ENV=sandbox

# 5. Générer la clé de l'application
php artisan key:generate

# 6. Créer les tables en base de données
php artisan migrate

# 7. Démarrer le serveur
php artisan serve
# → Accessible sur http://127.0.0.1:8000
```

### Frontend — React

```bash
# 1. Se placer dans le dossier
cd C:\Users\ismael\Desktop\guemamarket

# 2. Installer les dépendances JavaScript
npm install

# 3. Démarrer le serveur de développement
npm run dev
# → Accessible sur http://localhost:5173

# Construire pour la production :
npm run build
```

### Créer le premier compte administrateur

```bash
# Dans le terminal du backend :
php artisan tinker
```

```php
App\Models\User::create([
    'name'     => 'Admin Marketou',
    'email'    => 'admin@marketou.bj',
    'password' => 'MotDePasseSécurisé123',
    'role'     => 'admin',
    'status'   => 'actif',
]);
```

### Configurer le stockage des fichiers (avatars, preuves)

```bash
# Créer le lien symbolique pour les fichiers uploadés
php artisan storage:link
# → Les fichiers seront accessibles sur /storage/...
```

---

## 19. Base de données — toutes les tables

| Table | Rôle | Colonnes clés |
|-------|------|---------------|
| `users` | Tous les utilisateurs | `role`, `status`, `avatar`, `must_change_password`, `reset_token` |
| `shops` | Boutiques des vendeurs | `vendor_id`, `status`, `slug` |
| `categories` | Catégories et sous-catégories | `parent_id` (null = catégorie parente) |
| `products` | Produits | `shop_id`, `category_id`, `stock`, `status` |
| `cart_items` | Panier persistant | `user_id`, `product_id`, `qty` |
| `orders` | Commandes | `escrow_status`, `delivery_zone`, `delivery_fee_breakdown` |
| `order_items` | Articles d'une commande | `order_id`, `product_id`, `qty`, `unit_price` |
| `deliveries` | Livraisons | `order_id`, `courier_id`, `status`, `otp_verified_at` |
| `payments` | Transactions FedaPay | `fedapay_id`, `status`, `operator` |
| `notifications` | Notifications | `user_id`, `type`, `read_at` |
| `disputes` | Litiges | `resolution_type`, `refund_amount`, `vendor_id` |
| `dispute_messages` | Messages d'un litige | `dispute_id`, `sender_id`, `sender_role`, `is_internal` |
| `dispute_evidences` | Pièces jointes d'un litige | `dispute_id`, `file_path`, `mime_type` |
| `personal_access_tokens` | Tokens d'auth Sanctum | `tokenable_id`, `token` (hashé) |
| `cache` | Cache Laravel | — |
| `jobs` | File d'attente | — |

---

## 20. Glossaire

| Terme | Définition simple |
|-------|-------------------|
| **Escrow** | L'argent du client est retenu sur la plateforme jusqu'à confirmation de livraison |
| **OTP** | Code à 4 chiffres envoyé au client, à communiquer au livreur pour valider la livraison |
| **Token** | Clé secrète générée à la connexion, envoyée avec chaque requête API pour prouver l'identité |
| **Sanctum** | Système d'authentification par tokens de Laravel |
| **FedaPay** | Service de paiement Mobile Money pour l'Afrique de l'Ouest |
| **FCFA** | Franc CFA — monnaie utilisée au Bénin |
| **GMV** | Gross Merchandise Value — valeur totale de toutes les ventes |
| **Webhook** | URL appelée automatiquement par FedaPay quand un paiement est confirmé ou refusé |
| **Migration** | Script qui crée ou modifie des tables en base de données |
| **Middleware** | Code qui s'exécute avant une requête (vérifie le token, le rôle, les permissions...) |
| **Multipart/form-data** | Format de requête HTTP qui permet d'envoyer des fichiers (photos, documents) |
| **Slug** | Version URL d'un nom (ex : "Alimentation Parakou" → `alimentation-parakou`) |
| **Escrow held** | Fonds bloqués sur la plateforme |
| **Escrow released** | Fonds libérés au vendeur |
| **Escrow disputed** | Fonds gelés pendant un litige |
| **Escrow refunded** | Fonds remboursés au client |
| **DXA** | Unité de mesure dans les documents Word (1440 DXA = 1 pouce) |

---

*Documentation Marketou — Plateforme de commerce local, Parakou, Bénin.*
*Dernière mise à jour : Juin 2026*
