# CamerEdu — Site éducatif pour les terminales et les étudiants mal orientés au Cameroun

Ce projet est un site statique simple conçu pour les élèves de terminale et les étudiants universitaires mal orientés au Cameroun.

## Contenu
- `index.html` : page principale du site
- `styles.css` : styles visuels et responsive
- `script.js` : interactions légères pour le menu mobile, la recherche et le formulaire
- `server.js` : serveur de développement local simple

## Exécution locale
1. Ouvrez le dossier `CameroonTerminaleSite`.
2. Ouvrez `index.html` dans un navigateur web, ou utilisez le serveur local :
   ```bash
   node server.js
   ```
3. Ouvrez `http://localhost:8080` dans votre navigateur.

## Déploiement GitHub
1. Créez un dépôt sur GitHub.
2. Dans le dossier `CameroonTerminaleSite`, exécutez :
   ```bash
   git remote add origin https://github.com/<votre-utilisateur>/<nom-du-repo>.git
   git branch -M main
   git push -u origin main
   ```

## Déploiement sur Netlify
1. Créez un compte sur https://www.netlify.com.
2. Cliquez sur `Add new site` → `Import from Git`.
3. Connectez Netlify à GitHub et autorisez l’accès à votre compte.
4. Sélectionnez le dépôt `CameroonTerminaleSite` ou `Cameroun-Education-Site-App`.
5. Dans les paramètres de build :
   - Build command : laissez vide
   - Publish directory : laissez vide ou mettez `/`
6. Cliquez sur `Deploy site`.
7. Une fois le déploiement terminé, copiez l’URL publique fournie.

## Netlify Forms
Le formulaire de contact est déjà configuré pour Netlify avec :
- `data-netlify="true"`
- `name="contact"`
- `netlify-honeypot="bot-field"`

Après le premier déploiement :
1. Ouvrez le site deployé sur Netlify.
2. Allez dans l’onglet `Forms` du tableau de bord Netlify.
3. Vérifiez que le formulaire `contact` apparaît.
4. Testez l’envoi depuis le site et vérifiez la soumission dans Netlify.

## Remarque
Si Netlify ne détecte pas le formulaire immédiatement, faites une soumission test depuis le site déployé. Le formulaire doit être visible dans le dashboard Netlify après une première soumission.
