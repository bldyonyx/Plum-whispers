# Audit de centralisation — Plum Whispers

Les 13 fichiers CSS de `src/base/` et `src/themes/` ont été analysés. Les couleurs personnalisées littérales sont maintenant toutes définies dans `src/base/variables.css`, y compris la transparence et les halos. Les couleurs trouvées étaient des HEX, RGBA et le mot-clé `transparent` ; aucun autre format de couleur littérale n’a été relevé dans les déclarations.

Les variables `--my-*` conservent leurs valeurs exactes. Les variables de couleur existantes `--pw-*` et `--username-color` ont été déplacées sans renommage. Les variables de durée, courbe, police et taille restent dans leurs modules. Les variables natives de Discord restent affectées dans leur portée initiale (`body, .theme-dark` ou `#app-mount`).

## Doublons et indépendance

Les couleurs partagées au sein d’un même rôle sont réutilisées : survol et focus des menus, halos des liens au survol et au focus, contours Rose Whisper des canaux et amis. Les contrôles possèdent des alias sémantiques vers la palette `--my-*`. Les couleurs identiques de composants indépendants (réactions, mentions, menus, contrôles, titres) gardent des variables distinctes.

Les actions des messages partagent volontairement les couleurs de survol des menus, conformément au commentaire existant « Match the context menu appearance ». Le texte des réactions et leur bordure au survol partagent la même couleur claire.

## Conflits et sélecteurs

Aucune définition multiple de variable `:root` n’a été trouvée. Aucun cycle d’alias n’a été introduit.

Chevauchements préexistants conservés :

- `backgrounds.css` et `panels.css` définissent tous deux le fond de la barre des serveurs avec `--my-server-sidebar` ; les valeurs concordent.
- Le titre Direct Messages reçoit une couleur dans `decorative-fonts.css` et dans `components.css`. La cascade existante reste inchangée ; les variables de ces deux rôles restent indépendantes.
- Le fond général de survol des conversations est complété par les règles Rose Whisper plus spécifiques. Leur ordre et leur spécificité restent inchangés.

Tous les sélecteurs sont conservés à l’identique, y compris les attributs `style` utilisés pour détecter l’état des switches. Aucun sélecteur contenant une couleur native à remplacer n’a été trouvé. Les règles Nitro et les ressources d’images, textures et polices sont préservées.

## Nouvelles variables

| Variable | Valeur initiale |
| --- | --- |
| `--pw-interactive-hover` | `var(--my-selected)` |
| `--pw-interactive-active` | `#55404c` |
| `--pw-overlay-hover` | `rgba(217, 174, 191, 0.1)` |
| `--pw-overlay-active` | `rgba(217, 174, 191, 0.16)` |
| `--pw-overlay-selected` | `rgba(217, 174, 191, 0.14)` |
| `--pw-menu-item-background` | `#69475e` |
| `--pw-menu-item-text` | `#f5c9dd` |
| `--pw-menu-item-icon` | `#e8aec9` |
| `--pw-message-actions-background` | `#382f38` |
| `--pw-message-actions-border` | `#514650` |
| `--pw-message-actions-shadow` | `rgba(0, 0, 0, 0.2)` |
| `--pw-link` | `#e65a8b` |
| `--pw-link-hover` | `#ffe1f0` |
| `--pw-link-glow-inner` | `rgba(255, 160, 210, 0.8)` |
| `--pw-link-glow-outer` | `rgba(230, 120, 190, 0.5)` |
| `--pw-reaction-background` | `#69475e` |
| `--pw-reaction-border` | `#e8aec9` |
| `--pw-reaction-text` | `#f5c9dd` |
| `--pw-reaction-background-hover` | `#85566f` |
| `--pw-reply-background` | `rgba(155, 70, 105, 0.16)` |
| `--pw-reply-background-hover` | `rgba(155, 70, 105, 0.24)` |
| `--pw-reply-accent` | `#c986a4` |
| `--pw-member-hover` | `rgba(217, 174, 191, 0.12)` |
| `--pw-member-focus` | `rgba(217, 174, 191, 0.16)` |
| `--pw-navigation-glow` | `rgba(255, 130, 218, 0.2)` |
| `--pw-home-hover-glow` | `rgba(255, 130, 218, 0.25)` |
| `--pw-control-button-hover` | `#58424f` |
| `--pw-control-button-active` | `#69475e` |
| `--pw-control-radio-dot` | `#ffffff` |
| `--pw-decorative-text` | `#e8aec9` |
| `--pw-decorative-text-hover` | `#f5c9dd` |
| `--pw-bloom-border` | `rgba(217, 174, 191, 0.45)` |
| `--pw-bloom-glow` | `rgba(217, 174, 191, 0.25)` |
| `--pw-transparent` | `transparent` |

## Vérifications

- `npm run build` : réussi. Avertissement : `transparency.css` est vide ; ce fichier était déjà vide avant le refactoring.
- `git diff --check` : réussi.
- Comparaison structurelle via PostCSS des 13 fichiers avec HEAD : mêmes sélecteurs, ordre des déclarations hors `:root`, valeurs après résolution récursive des variables et marqueurs `!important`. Toutes les anciennes variables `:root` conservent leur valeur résolue. Les imports locaux existent et les imports de polices restent identiques.
- Aucune couleur littérale HEX ou fonction de couleur ne subsiste dans les déclarations hors `variables.css`.

La vérification visuelle dans Discord reste à effectuer. Le déplacement des variables suppose de charger `variables.css` avant les modules, comme le fait déjà `plum-whispers.css`. Les modules utilisés isolément doivent également importer cette palette. Aucun commit ni push n’a été effectué.
