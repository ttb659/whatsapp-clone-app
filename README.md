# WhatsApp Clone App

Une application de messagerie en temps réel inspirée de WhatsApp, construite avec Laravel (backend) et Angular (frontend).

## Démo en ligne

Vous pouvez accéder à une démo de l'application à l'adresse suivante :
- Frontend : https://ttb659.github.io/whatsapp-clone-app

La démo fonctionne entièrement dans le navigateur sans nécessiter de backend, grâce au mode démo qui simule toutes les fonctionnalités avec des données fictives.

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
git clone https://github.com/ttb659/whatsapp-clone-app.git
cd whatsapp-clone-app
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
php artisan serve --host=0.0.0.0 --port=8000
```

2. Frontend :
```bash
cd whatsapp-clone-frontend
ng serve --host 0.0.0.0 --port=4200
```

### Mode démo (sans backend)

Pour utiliser l'application en mode démo sans backend :

1. Construire l'application en mode démo :
```bash
cd whatsapp-clone-frontend
./build-demo.sh
```

2. Les fichiers générés se trouvent dans le dossier `docs/` et peuvent être servis par n'importe quel serveur web statique.

3. Pour tester localement :
```bash
cd docs
npx http-server -p 8080
```

4. Accédez à l'application à l'adresse http://localhost:8080

### Déploiement sur GitHub Pages

Pour déployer l'application en mode démo sur GitHub Pages :

1. Construire l'application en mode démo :
```bash
cd whatsapp-clone-frontend
./build-demo.sh
```

2. Pousser le contenu du dossier `docs/` sur la branche `gh-pages` :
```bash
git checkout -b gh-pages
git add docs/
git commit -m "Mise à jour de la démo"
git push origin gh-pages
```

3. Configurer GitHub Pages dans les paramètres du dépôt pour utiliser la branche `gh-pages` et le dossier racine.

4. L'application sera disponible à l'adresse https://[votre-nom-utilisateur].github.io/whatsapp-clone-app/

## Accès à l'application

- Backend API : http://localhost:8000
- Frontend : http://localhost:4200

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

## Captures d'écran

*À venir*

## Développement futur

- Implémentation des notifications push avec Firebase Cloud Messaging
- Ajout de fonctionnalités de statut/stories
- Chiffrement de bout en bout des messages
- Appels audio et vidéo
- Mode sombre/clair
- Amélioration du mode démo avec plus de fonctionnalités simulées
- Déploiement du backend sur un service d'hébergement comme Heroku ou DigitalOcean

## Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

Ce projet est sous licence MIT.
