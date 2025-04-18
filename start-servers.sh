#!/bin/bash

# Démarrer le serveur backend Laravel
echo "Démarrage du serveur backend Laravel..."
cd /workspace/whatsapp-clone-backend
php artisan serve --port=12000 --host=0.0.0.0 &
BACKEND_PID=$!

# Démarrer le serveur frontend Angular
echo "Démarrage du serveur frontend Angular..."
cd /workspace/whatsapp-clone-frontend
ng serve --port=12001 --host=0.0.0.0 --disable-host-check &
FRONTEND_PID=$!

# Fonction pour arrêter les serveurs
function cleanup {
  echo "Arrêt des serveurs..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Capturer les signaux pour arrêter proprement les serveurs
trap cleanup SIGINT SIGTERM

# Attendre indéfiniment
echo "Les serveurs sont démarrés !"
echo "Backend: http://localhost:12000"
echo "Frontend: http://localhost:12001"
wait