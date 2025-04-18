# Instructions pour pousser le projet vers GitHub

Une fois que vous avez créé votre dépôt GitHub "whatsapp-clone", suivez ces étapes pour y pousser votre code :

1. Connectez votre dépôt local à GitHub :
```bash
git remote add origin https://github.com/VOTRE_NOM_UTILISATEUR/whatsapp-clone.git
```

2. Poussez votre code vers GitHub :
```bash
git push -u origin master
```

3. Vérifiez que votre code a bien été poussé en visitant :
```
https://github.com/VOTRE_NOM_UTILISATEUR/whatsapp-clone
```

## Remarques importantes

- Remplacez `VOTRE_NOM_UTILISATEUR` par votre nom d'utilisateur GitHub
- Si vous êtes invité à entrer vos identifiants GitHub, utilisez votre nom d'utilisateur et votre token d'accès personnel (et non votre mot de passe)
- Si vous préférez utiliser SSH plutôt que HTTPS, utilisez cette commande à la place :
```bash
git remote add origin git@github.com:VOTRE_NOM_UTILISATEUR/whatsapp-clone.git
```

## Création d'un token d'accès personnel (si nécessaire)

Si vous n'avez pas encore de token d'accès personnel GitHub :

1. Allez dans Paramètres > Paramètres du développeur > Tokens d'accès personnel
2. Cliquez sur "Générer un nouveau token"
3. Donnez un nom à votre token et sélectionnez les autorisations "repo"
4. Cliquez sur "Générer un token" et copiez-le (vous ne pourrez plus le voir après avoir quitté la page)
