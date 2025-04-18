# WhatsApp Clone

Une application de messagerie en temps réel inspirée de WhatsApp, construite avec Laravel (backend) et Angular (frontend).

## Fonctionnalités

- **Authentification** : Inscription, connexion et déconnexion sécurisées avec Laravel Sanctum
- **Messagerie en temps réel** : Communication instantanée via WebSockets (Pusher)
- **Conversations privées** : Discussions en tête-à-tête entre utilisateurs
- **Groupes de discussion** : Création et gestion de groupes avec plusieurs participants
- **Partage de fichiers** : Envoi d'images, vidéos et documents
- **Interface responsive** : Adaptée aux appareils mobiles et desktop

## Technologies utilisées

### Backend (Laravel)
- Laravel 12
- Laravel Sanctum pour l'authentification
- Pusher pour les WebSockets
- SQLite pour la base de données

### Frontend (Angular)
- Angular 17
- Angular Material pour l'interface utilisateur
- Socket.io-client pour la connexion WebSocket
- RxJS pour la programmation réactive

## Installation et démarrage

### Prérequis
- PHP 8.2 ou supérieur
- Composer
- Node.js et npm
- Angular CLI

### Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/votre-utilisateur/whatsapp-clone.git
cd whatsapp-clone
```

2. Installer les dépendances du backend :
```bash
cd whatsapp-clone-backend
composer install
cp .env.example .env
php artisan key:generate
```

3. Configurer la base de données dans le fichier .env :
```
DB_CONNECTION=sqlite
DB_DATABASE=/chemin/absolu/vers/database.sqlite
```

4. Créer le fichier de base de données SQLite :
```bash
touch database/database.sqlite
```

5. Exécuter les migrations :
```bash
php artisan migrate --seed
```

6. Installer les dépendances du frontend :
```bash
cd ../whatsapp-clone-frontend
npm install
```

### Démarrage

Utilisez le script de démarrage pour lancer les deux serveurs :
```bash
./start-servers.sh
```

Ou démarrez-les séparément :

1. Backend :
```bash
cd whatsapp-clone-backend
php artisan serve --host=0.0.0.0 --port=12000
```

2. Frontend :
```bash
cd whatsapp-clone-frontend
ng serve --host 0.0.0.0 --port 12001 --disable-host-check
```

## Accès à l'application

- Backend API : http://localhost:12000
- Frontend : http://localhost:12001

## Structure du projet

### Backend (Laravel)
- `app/Models` : Définitions des modèles (User, Message, Conversation, Group, File)
- `app/Http/Controllers` : Contrôleurs pour gérer les requêtes API
- `app/Events` : Événements pour la messagerie en temps réel
- `database/migrations` : Migrations pour la structure de la base de données
- `routes/api.php` : Définition des routes API

### Frontend (Angular)
- `src/app/models` : Interfaces TypeScript pour les modèles de données
- `src/app/services` : Services pour la communication avec l'API
- `src/app/auth` : Composants d'authentification (login, register)
- `src/app/chat` : Composants de l'interface de chat
- `src/app/guards` : Gardes pour protéger les routes
- `src/app/interceptors` : Intercepteurs HTTP pour l'authentification

## Développement futur

- Implémentation des notifications push avec Firebase Cloud Messaging
- Ajout de fonctionnalités de statut/stories
- Chiffrement de bout en bout des messages
- Appels audio et vidéo
- Mode sombre/clair

## Licence

Ce projet est sous licence MIT.
