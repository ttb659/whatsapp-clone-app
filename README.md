# WhatsApp Clone

Une application de messagerie inspirée de WhatsApp, développée avec Laravel pour le backend et Angular pour le frontend.

## Fonctionnalités

- **Authentification** : Inscription, connexion, déconnexion avec Laravel Sanctum
- **Messagerie en temps réel** : Communication instantanée via WebSockets
- **Gestion des groupes** : Création et gestion de groupes de discussion
- **Partage de fichiers** : Envoi d'images, vidéos et documents
- **Notifications push** : Alertes pour les nouveaux messages

## Structure du projet

Le projet est divisé en deux parties principales :

- **Backend** : API Laravel avec Sanctum et WebSockets
- **Frontend** : Application Angular avec Material UI

## Installation

### Prérequis

- PHP 8.2+
- Composer
- Node.js et npm
- Angular CLI
- MySQL ou SQLite

### Backend (Laravel)

```bash
cd whatsapp-clone-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve --port=12000
```

### Frontend (Angular)

```bash
cd whatsapp-clone-frontend
npm install
ng serve --port 12001 --host 0.0.0.0 --disable-host-check
```

## Utilisation

1. Créez un compte utilisateur
2. Connectez-vous à l'application
3. Commencez à discuter avec d'autres utilisateurs
4. Créez des groupes pour les discussions de groupe
5. Partagez des fichiers dans les conversations

## Développement

### Backend

Le backend est construit avec Laravel 12 et utilise :
- Laravel Sanctum pour l'authentification API
- Pusher pour les WebSockets
- SQLite pour la base de données

### Frontend

Le frontend est développé avec Angular 17 et utilise :
- Angular Material pour l'interface utilisateur
- Socket.io pour la communication en temps réel
- RxJS pour la programmation réactive

## Licence

Ce projet est sous licence MIT.