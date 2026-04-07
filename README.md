# Powers4All

Powers4All est un fork de [Superpowers](https://github.com/obra/superpowers) adapte pour les **profils tech non-developpeurs** : chefs de projet, product owners, managers, et toute personne qui a besoin d'interagir avec un codebase sans ecrire de code.

## Comment ca marche

Au lieu du terminal, Powers4All utilise une **interface navigateur** (localhost) comme surface d'interaction principale. Vous lancez une commande, et tout se passe dans votre navigateur : questions, reponses, previews, suivi d'avancement.

L'agent communique en **langage metier** — jamais de noms de fichiers, de code, ou de jargon technique. Il parle de modules, d'ecrans, de fonctionnalites et de comportements.

### Le workflow

1. Vous tapez `/pa:start Le filtre par date ne marche pas` dans Claude Code
2. Le navigateur s'ouvre avec une interface visuelle
3. L'agent vous pose des questions de clarification (clics ou texte libre)
4. Il investigue, diagnostique, et vous presente ses trouvailles en langage clair
5. Apres votre validation, il implemente la correction
6. Vous voyez l'avancement en temps reel dans le navigateur

## Cas d'usage

| Type | Exemple | Ce qui se passe |
|---|---|---|
| **Bug** | "Le bouton de paiement ne marche plus" | Investigation, diagnostic metier, correction apres validation |
| **Question** | "Comment marche le systeme de notifications ?" | Explication visuelle avec schemas et flux |
| **Style** | "Rendre les boutons plus arrondis et bleus" | Preview avant/apres dans le navigateur |
| **Evolution** | "Ajouter un export PDF sur les factures" | Brainstorming allege, specs, plan, implementation |

## Installation

### Claude Code (via Plugin Marketplace)

Enregistrez le marketplace :

```bash
/plugin marketplace add alex/powers4all
```

Puis installez le plugin :

```bash
/plugin install powers4all@powers4all
```

### Installation locale (developpement)

Clonez le repo et enregistrez-le comme marketplace local :

```bash
git clone https://github.com/alex/powers4all.git
/plugin marketplace add /chemin/vers/powers4all
/plugin install powers4all@powers4all-dev
```

### Verification

Lancez une nouvelle session Claude Code dans un projet et tapez :

```
/pa:start Comment marche cette application ?
```

L'interface navigateur devrait se lancer automatiquement.

## Skills

### Skills Powers4All

| Skill | Role |
|---|---|
| `pa-start` | Point d'entree — classifie la demande, lance le navigateur, orchestre le workflow |
| `pa-investigate` | Diagnostic de bugs en langage metier |
| `pa-explain` | Reponses aux questions fonctionnelles avec explications visuelles |
| `pa-preview` | Preview de changements de style avant/apres |
| `using-powers4all` | Introduction au systeme de skills |

### Skills herites de Superpowers

| Skill | Role |
|---|---|
| `writing-plans` | Plans d'implementation detailles |
| `executing-plans` | Execution par batches avec checkpoints |
| `subagent-driven-development` | Sous-agents pour les taches d'implementation |
| `requesting-code-review` | Review automatique du code |
| `verification-before-completion` | Verification avant de declarer termine |
| `dispatching-parallel-agents` | Taches paralleles |

## Interface navigateur

L'interface utilise un serveur localhost leger (zero dependances) qui sert des pages HTML generees par l'agent. Les composants disponibles :

- **Chat** — fil de conversation entre l'utilisateur et l'agent
- **Options** — choix cliquables A/B/C
- **Change Summary** — description avant/apres en langage metier
- **Progress Tracker** — barre d'avancement des etapes
- **Text Input** — saisie libre dans le navigateur
- **Preview** — apercu visuel cote a cote (avant/apres)
- **Cards** — variantes visuelles a choisir

L'agent peut aussi generer du HTML/CSS libre pour des besoins specifiques.

## Philosophie

- **Navigateur d'abord** — le terminal est le backend, pas l'interface
- **Langage metier** — jamais de jargon technique
- **Zero dependances** — rien a installer, aucun framework
- **Base sur Superpowers** — workflow eprouve (specs, plans, implementation)

## Credits

Powers4All est un fork de [Superpowers](https://github.com/obra/superpowers) par [Jesse Vincent](https://blog.fsck.com). Merci a lui pour le systeme de skills et le workflow qui servent de fondation a ce projet.

## Licence

MIT License — voir le fichier LICENSE pour les details.
