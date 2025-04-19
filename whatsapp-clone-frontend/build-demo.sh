#!/bin/bash

# Script pour construire l'application en mode démo pour GitHub Pages

echo "Construction de l'application WhatsApp Clone en mode démo..."

# Vérifier si le fichier environment.prod.ts existe
if [ ! -f "src/environments/environment.prod.ts" ]; then
  echo "Création du fichier environment.prod.ts..."
  cat > src/environments/environment.prod.ts << EOF
export const environment = {
  production: true,
  demoMode: true,
  apiUrl: 'https://api.example.com',
  pusherKey: 'demo-key',
  pusherCluster: 'eu',
  pusherHost: '',
  pusherPort: 443,
  pusherTLS: true
};
EOF
else
  # Mettre à jour le fichier environment.prod.ts pour activer le mode démo
  echo "Mise à jour du fichier environment.prod.ts..."
  sed -i 's/demoMode: false/demoMode: true/g' src/environments/environment.prod.ts
fi

# Construire l'application avec la configuration de production
echo "Construction de l'application Angular..."
ng build --configuration production --base-href "/whatsapp-clone-app/"

# Créer le dossier docs pour GitHub Pages
echo "Copie des fichiers dans le dossier docs..."
mkdir -p docs
cp -r dist/whatsapp-clone-frontend/* docs/

# Copier le contenu du dossier browser dans le dossier racine docs
if [ -d "docs/browser" ]; then
  cp -r docs/browser/* docs/
  # Garder une copie du dossier browser pour compatibilité
fi

# Créer un fichier .nojekyll pour GitHub Pages
touch docs/.nojekyll

# Créer un fichier 404.html qui redirige vers index.html pour le routage SPA
cat > docs/404.html << EOF
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>WhatsApp Clone</title>
  <script>
    // Redirection vers index.html pour le routage SPA
    sessionStorage.setItem('redirectUrl', window.location.href);
    window.location.href = '/whatsapp-clone-app/';
  </script>
</head>
<body>
  <p>Redirection en cours...</p>
</body>
</html>
EOF

echo "Construction terminée ! Les fichiers sont disponibles dans le dossier docs/"
echo "Pour déployer sur GitHub Pages, poussez le contenu du dossier docs/ sur la branche gh-pages."