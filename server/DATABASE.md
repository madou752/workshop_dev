# La base de données — Lahist'air

## En une phrase

Avant, les données vivaient dans un fichier `db.json` posé sur le disque.
Maintenant elles vivent dans **MongoDB**, une base hébergée gratuitement sur
MongoDB Atlas, partagée par toute l'équipe.

## Pourquoi MongoDB et pas du SQL

MongoDB stocke des **documents JSON**. Or nos données sont déjà du JSON avec
des listes imbriquées : un produit contient sa liste de formats (`sizes`) et
sa liste de notes olfactives (`notes`), une commande contient sa liste
d'articles (`items`).

En SQL il aurait fallu éclater ça en 5 tables reliées par des clés étrangères
(`products`, `product_sizes`, `orders`, `order_items`, + les champs client).
En MongoDB, **un produit = un document**, tel quel. Aucune transformation.

## La structure : 2 collections

Une *collection*, c'est une liste de documents. On en a deux.

### `products` — le catalogue (12 produits)

```json
{
  "id": "sahara",
  "slug": "sahara-desert-air",
  "name": "Aube du Sahara",
  "category": "desert",
  "tagline": "Chaleur sèche, captée au levant.",
  "description": "Capté au lever du soleil au-dessus des dunes de Merzouga...",
  "origin": "Merzouga, Maroc",
  "altitude": "560 m",
  "composition": "78 % N₂ · 21 % O₂ · 1 % sable fin",
  "lotNumber": "N° 0001",
  "notes": ["Sec", "Minéral", "Silencieux"],
  "sizes": [
    { "id": "sm", "label": "Format Voyage", "volumeMl": 50,  "priceEUR": 50  },
    { "id": "md", "label": "Signature",     "volumeMl": 150, "priceEUR": 120 },
    { "id": "lg", "label": "Cave",          "volumeMl": 500, "priceEUR": 350 }
  ]
}
```

Un **index unique sur `slug`** empêche deux produits d'avoir la même URL.

### `orders` — les commandes passées

```json
{
  "orderId": "LHA-K7M2P9XQ",
  "createdAt": "2026-09-22T13:51:58.000Z",
  "items": [{ "productId": "sahara", "sizeId": "sm", "quantity": 1 }],
  "customer": { "fullName": "...", "email": "...", "address": "...",
                "city": "...", "postalCode": "...", "country": "..." },
  "payment":  { "cardholderName": "...", "cardNumberLast4": "4242" },
  "totalEUR": 50,
  "status": "confirmed"
}
```

> Seuls les **4 derniers chiffres** de la carte sont conservés. Le numéro
> complet et le CVC ne sont jamais stockés.

## Comment le code y accède

Tout passe par `server/src/db.ts`, qui ouvre **une seule connexion** au
démarrage et expose les deux collections plus quelques fonctions courtes :

| Fonction | Ce qu'elle fait | Requête Mongo |
|---|---|---|
| `findAllProducts()` | tout le catalogue | `find({})` |
| `findProductBySlug(slug)` | la fiche produit | `findOne({ slug })` |
| `findProductById(id)` | vérifier un article du panier | `findOne({ id })` |
| `insertOrder(order)` | enregistrer une commande | `insertOne(order)` |
| `findOrderById(orderId)` | retrouver une commande | `findOne({ orderId })` |

Les routes (`routes/products.ts`, `routes/orders.ts`) appellent uniquement ces
fonctions — elles ne connaissent pas MongoDB. Si on changeait de base demain,
seul `db.ts` bougerait.

### Le détail du `_id`

MongoDB ajoute automatiquement un champ technique `_id` à chaque document.
L'API ne doit pas l'exposer, donc chaque lecture utilise la projection
`{ projection: { _id: 0 } }` — c'est la constante `withoutMongoId`.

## Installation (à faire une fois)

1. Créer un compte gratuit sur <https://www.mongodb.com/cloud/atlas/register>
2. Créer un cluster **M0 (Free)**
3. **Database Access** → créer un utilisateur + mot de passe
4. **Network Access** → autoriser `0.0.0.0/0` (accès depuis n'importe où)
5. **Connect → Drivers** → copier la chaîne de connexion
6. Dans `server/`, copier `.env.example` vers `.env` et y coller la chaîne :

```bash
cp server/.env.example server/.env
```

7. Remplir la base avec le catalogue :

```bash
npm run seed --prefix server
```

Le fichier `.env` contient le mot de passe : il est dans `.gitignore`, il ne
doit **jamais** être commité.

## Pour mes collègues (les 2 autres devs)

La base est **partagée** : une seule base pour toute l'équipe, hébergée sur
Atlas. L'accès réseau est ouvert (`0.0.0.0/0`), donc pas de manipulation à
faire côté Atlas.

Chacun doit juste créer son propre `server/.env` :

```bash
cp server/.env.example server/.env
```

puis y coller la chaîne de connexion que je leur transmets **en privé**
(jamais sur GitHub, jamais dans le Slack du groupe).

Ensuite :

```bash
npm run install:all
npm run dev
```

Pas besoin de relancer `npm run seed` : le catalogue est déjà en base. Le
relancer effacerait et réinsérerait les mêmes 12 produits — sans casse, mais
inutile.

### Pourquoi `0.0.0.0/0` ?

Par défaut, Atlas n'autorise que l'adresse IP de celui qui a créé le cluster.
Mes collègues n'auraient pas pu se connecter. `0.0.0.0/0` autorise n'importe
quelle adresse IP — **mais l'identifiant et le mot de passe restent exigés**.
C'est la configuration normale pour un projet d'école ; sur un vrai projet en
production, on limiterait la liste aux IP des serveurs.

## Commandes utiles

| Commande | Effet |
|---|---|
| `npm run seed --prefix server` | (re)remplit `products` depuis `data/products.seed.ts` |
| `npm run dev` | lance le client et le serveur |

## Dépannage

### Le serveur affiche « Impossible de se connecter a MongoDB »

C'est un message volontaire : quand la base est injoignable, le serveur
explique et s'arrête proprement au lieu d'afficher une trace d'erreur. Les
causes habituelles sont listées dans le message lui-même.

Une fois la connexion établie, le driver MongoDB gère tout seul les coupures
réseau et se reconnecte. Le seul moment fragile est le démarrage.

### Erreur `querySrv ECONNREFUSED` (problème de DNS)

Elle apparaît quand le système annonce un serveur DNS que Node ne sait pas
utiliser (typiquement une adresse IPv6 link-local du type `fe80::...%en0`
fournie par une box).

Node a **deux** mécanismes de résolution :

| Mécanisme | Utilisé pour | Source |
|---|---|---|
| `dns.lookup()` | les noms d'hôtes ordinaires | resolveur du système |
| `dns.resolveSrv()` | les URI `mongodb+srv://` | `/etc/resolv.conf` |

Seul le second casse. D'où deux solutions :

**Solution 1 — utiliser une URI sans `+srv`** (c'est notre configuration
actuelle). Au lieu de demander au DNS la liste des serveurs, on l'écrit
directement :

```
mongodb://<user>:<password>@hote-00:27017,hote-01:27017,hote-02:27017/?ssl=true&replicaSet=...&authSource=admin
```

Atlas fournit cette forme dans **Connect → Drivers**, en choisissant une
version de driver antérieure à 3.6. Contrepartie : si Atlas renomme un jour
les serveurs du cluster, il faut mettre l'URI à jour — alors que `+srv` s'en
occuperait tout seul.

**Solution 2 — corriger le DNS de la machine**, en ajoutant un serveur IPv4
(`1.1.1.1`, `8.8.8.8`) dans Réglages Système → Wi-Fi → Détails → DNS. Cela
règle le problème pour tous les outils, pas seulement pour ce projet.

## Questions qu'on peut me poser

**Pourquoi une seule connexion ?** Ouvrir une connexion par requête serait
lent et saturerait le cluster. Le driver gère un *pool* de connexions.

**Où est passé lowdb ?** Désinstallé. `db.json` n'est plus utilisé.

**Le seed efface-t-il les commandes ?** Non, il ne touche qu'à `products`.

**Pourquoi le prix est-il recalculé côté serveur ?** Pour qu'un client ne
puisse pas envoyer un faux prix. Le serveur relit toujours le prix réel
depuis la collection `products`.
