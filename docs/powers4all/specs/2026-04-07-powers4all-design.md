# Powers4All — Design Spec

## Vision

Fork de powers4all adapte pour les profils non-dev (chefs de projet, product owners, managers). Le navigateur (localhost) est l'interface principale. Le terminal devient un backend silencieux. L'agent communique exclusivement en logique metier et produit.

## Cas d'usage prioritaires

1. **Resolution de bugs** — l'utilisateur signale un probleme en langage naturel, l'agent investigue, diagnostique, propose une correction en termes metier, et implemente apres validation.
2. **Questions fonctionnelles** — "comment marche X ?", "comment faire Y ?" — l'agent repond avec des explications visuelles, schemas, diagrammes de flux metier.
3. **Evolutions de style** — changements visuels (couleurs, arrondis, espacements) avec preview avant/apres dans le navigateur.
4. **Evolutions fonctionnelles mineures** — ajout de fonctionnalites simples via un workflow brainstorming allege puis specs/plan/implementation.

## Architecture

```
+-------------------+     +------------------+     +-----------------+
|   Navigateur      |<--->|  Serveur local   |<--->|   Claude Code   |
|  (interface       | WS  |  (Node.js,       | FS  |   (skills +     |
|   principale)     |     |   fork du server  |     |    agent)       |
|                   |     |   existant)       |     |                 |
+-------------------+     +------------------+     +-----------------+
     L'utilisateur            Le pont              Le cerveau
     voit et clique       sert les pages         lit le code, raisonne,
                          relaye les events      genere les pages
```

### Flux general

1. L'utilisateur tape `/pa:start <demande>` dans Claude Code
2. Le skill `pa-start` lance le serveur localhost et ouvre le navigateur
3. L'agent classifie la demande (bug / question / style / evolution)
4. L'agent pousse des pages HTML dans le navigateur pour echanger avec l'utilisateur
5. L'utilisateur interagit via clics et saisie texte dans le navigateur
6. Quand l'agent a suffisamment de contexte : specs, plan, implementation (comme powers4all)
7. Chaque etape s'affiche dans le navigateur avec des composants adaptes

### Principe de communication

L'agent ne mentionne jamais de noms de fichiers, lignes de code, ou termes techniques. Il parle en termes de :
- **Modules** ("le module de paiement", "la gestion des utilisateurs")
- **Ecrans** ("l'ecran de connexion", "la liste des commandes")
- **Fonctionnalites** ("le filtre par date", "l'export PDF")
- **Comportements** ("quand l'utilisateur clique sur...", "apres la validation du formulaire...")

Exemples :

| Ne dit PAS | Dit |
|---|---|
| "Bug dans `PayButton.tsx` ligne 42" | "Le bouton de paiement a un probleme" |
| "Le composant `UserList` ne filtre pas" | "La liste des utilisateurs ne filtre pas correctement" |
| "Je vais modifier `src/styles/theme.css`" | "Je vais modifier le style du theme global" |
| "3 fichiers modifies, 12 insertions" | "3 elements de l'application ont ete ajustes" |

## Stack technique

- Serveur localhost Node.js (fork du serveur existant de powers4all/brainstorming)
- WebSocket pour la communication temps reel navigateur <-> serveur
- HTML/CSS genere dynamiquement par l'agent (zero framework frontend)
- Zero dependances externes

## Serveur localhost — Modifications

### Ce qui reste inchange
- Architecture HTTP + WebSocket du `server.cjs`
- Mecanisme de file watching (content_dir)
- Events ecrits dans `state_dir/events`
- Auto-shutdown apres inactivite
- Frame template avec injection automatique

### Ajout : support saisie texte

Nouveau type d'event WebSocket envoye par le navigateur :
```json
{"type": "text-input", "value": "Le bug arrive quand je clique deux fois", "timestamp": 1706000101}
```

Le `helper.js` est enrichi pour :
- Capturer la soumission de formulaires de saisie texte
- Envoyer l'event `text-input` via WebSocket
- Ecrire dans `state_dir/events` comme les clics

### Ajout : nouveaux composants CSS dans frame-template.html

#### Chat / Fil de conversation
```html
<div class="chat">
  <div class="chat-message chat-user">
    <div class="chat-bubble">Le bouton paiement ne marche pas</div>
  </div>
  <div class="chat-message chat-agent">
    <div class="chat-bubble">J'ai identifie le probleme...</div>
  </div>
</div>
```

#### Diff viewer metier (avant/apres)
```html
<div class="change-summary">
  <div class="change-item">
    <div class="change-location">Module de paiement</div>
    <div class="split">
      <div class="change-before">
        <h4>Avant</h4>
        <p>Le bouton envoie la commande meme si le panier est vide</p>
      </div>
      <div class="change-after">
        <h4>Apres</h4>
        <p>Le bouton verifie que le panier contient au moins un article</p>
      </div>
    </div>
    <div class="change-actions">
      <button data-choice="apply" onclick="toggleSelect(this)">Appliquer</button>
      <button data-choice="reject" onclick="toggleSelect(this)">Refuser</button>
    </div>
  </div>
</div>
```

#### Formulaire de saisie texte
```html
<div class="text-input-form">
  <textarea id="user-input" placeholder="Decrivez votre besoin..."></textarea>
  <button onclick="submitTextInput()">Envoyer</button>
</div>
```

#### Barre de progression
```html
<div class="progress-tracker">
  <div class="progress-step completed">Diagnostic confirme</div>
  <div class="progress-step completed">Correction preparee</div>
  <div class="progress-step active">Verification en cours...</div>
  <div class="progress-step pending">Finalisation</div>
</div>
```

#### Preview visuel
Utilise les composants existants (mockup, split view) pour afficher des previews avant/apres de changements de style.

L'agent reste libre de creer du HTML/CSS arbitraire pour des besoins non couverts par les composants pre-definis.

## Skills

### Skills crees

#### `pa-start` — Point d'entree et orchestration
- Recoit la demande en texte libre
- Classifie : bug / question / style / evolution
- Lance le serveur localhost
- Pousse la premiere page (confirmation + premiere question)
- Orchestre le workflow selon le type
- Gere la boucle d'echange navigateur (lecture events, generation pages)

#### `pa-investigate` — Diagnostic de bugs
- Explore le code source et les logs en arriere-plan
- Presente le diagnostic en langage metier dans le navigateur
- Propose une correction avec description avant/apres
- Apres validation : implemente, verifie, confirme

#### `pa-explain` — Questions fonctionnelles
- Analyse le code pour comprendre le fonctionnement
- Genere des explications visuelles : schemas, diagrammes, flux
- Repond en une ou plusieurs pages selon la complexite
- Utilise des analogies et du vocabulaire metier

#### `pa-preview` — Preview de changements de style
- Identifie les elements concernes
- Genere un preview avant/apres dans le navigateur
- Propose des variantes si pertinent
- Apres validation : applique le changement

### Skills conserves de powers4all (sans modification)
- `writing-plans` — plans d'implementation detailles
- `executing-plans` — execution par batches avec checkpoints
- `subagent-driven-development` — subagents pour les taches d'implementation
- `requesting-code-review` — review automatique
- `verification-before-completion` — verification avant de declarer termine
- `dispatching-parallel-agents` — taches paralleles

### Skills supprimes (non pertinents pour les non-dev)
- `test-driven-development`
- `systematic-debugging` (remplace par `pa-investigate`)
- `using-git-worktrees`
- `finishing-a-development-branch`
- `receiving-code-review`
- `writing-skills`
- `using-powers4all` (remplace l'ancien equivalent)

## Structure du projet

```
powers4all/
  skills/
    pa-start/
      SKILL.md
    pa-investigate/
      SKILL.md
    pa-explain/
      SKILL.md
    pa-preview/
      SKILL.md
    writing-plans/           (conserve)
      SKILL.md
    executing-plans/         (conserve)
      SKILL.md
    subagent-driven-development/  (conserve)
      ...
    requesting-code-review/       (conserve)
      ...
    verification-before-completion/ (conserve)
      SKILL.md
    dispatching-parallel-agents/   (conserve)
      SKILL.md
  scripts/
    server.cjs               (enrichi)
    helper.js                (enrichi)
    frame-template.html      (enrichi)
    start-server.sh          (conserve)
    stop-server.sh           (conserve)
  commands/
    pa-start.md              (nouveau)
  CLAUDE.md                  (adapte pour powers4all)
```

## Workflows detailles

### Bug
```
/pa:start "Le filtre par date ne marche pas"
  -> Classification : bug
  -> Page 1 : Confirmation + question de clarification (clics)
  -> Page 2 : Diagnostic en langage metier + proposition (avant/apres)
  -> Page 3 : Progression de la correction
  -> Page 4 : Confirmation finale
```

### Question fonctionnelle
```
/pa:start "Comment marche le systeme de notifications ?"
  -> Classification : question
  -> Page(s) : Explication visuelle avec schemas et flux metier
```

### Evolution de style
```
/pa:start "Boutons plus arrondis et bleus"
  -> Classification : style
  -> Page 1 : Preview avant/apres avec variantes
  -> Page 2 : Progression + confirmation
```

### Evolution fonctionnelle
```
/pa:start "Ajouter un export PDF sur les factures"
  -> Classification : evolution
  -> Pages brainstorming : 2-3 questions max
  -> Page specs : Resume metier a valider
  -> Page plan : Liste de taches a valider
  -> Pages progression : Barre d'avancement
  -> Page finale : Resume des changements
```

## Mecanisme d'attente navigateur

L'agent doit attendre la reponse de l'utilisateur dans le navigateur avant de continuer. Le mecanisme :

1. L'agent pousse une page avec des options cliquables ou un formulaire
2. L'agent demande dans le terminal : "Repondez dans le navigateur puis appuyez sur Entree ici"
3. L'utilisateur interagit dans le navigateur (clic ou texte)
4. L'utilisateur appuie sur Entree dans le terminal pour signaler qu'il a repondu
5. L'agent lit `state_dir/events` et continue

Alternative possible pour le futur : un mecanisme de polling automatique des events sans intervention terminal, mais la solution "Entree pour continuer" est simple et fiable pour la v1.
