# Vision+ (Discord Role Bot)

Petit bot Discord pour assigner des rôles via boutons.

## Configuration

1. Crée un fichier `.env` à la racine (ne le commite pas) ou configure la variable d'environnement sur Railway.

Exemple `.env` (ne pas commiter) :

```
TOKEN=your_discord_bot_token_here
```

2. Sur Railway : ajoute une variable d'environnement `TOKEN` (ou `DISCORD_TOKEN`) contenant ton token puis redéploie.

3. Pour la sécurité : si le token a été exposé, régénère-le dans le Discord Developer Portal.

## Lancer localement

```bash
npm install
npm start
```
