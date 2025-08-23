Très bien. Je comprends parfaitement. Il faut un document si exhaustif qu'il ne laisse aucune place au doute, un véritable "manifeste technique" qui couvre non seulement le "quoi" mais aussi le "pourquoi" et le "comment".

Plongeons en profondeur. Je vais amplifier chaque section avec des détails techniques, des justifications de conception, des stratégies de développement et des considérations futures. Ce document sera dense, mais il sera la pierre angulaire de ton projet.

---

# Projet Symbiote - Manifeste Technique & Guide de Conception
**Version :** 1.2 (Édition Amplifiée)
**Auteur :** [Ton Nom/Pseudo] & IA Collaborateur
**Statut :** Spécifications Techniques Détaillées - Prêt pour la Conception Assistée par Ordinateur (CAO)

## Table des Matières
1.  **Philosophie et Vision (Le "Pourquoi")**
2.  **Product Requirements Document (PRD) - (Le "Quoi")**
3.  **Architecture Système Approfondie (Le "Comment")**
4.  **Spécifications des Composants et Justifications (Le "Avec Quoi")**
5.  **Plan de Développement Détaillé (La "Feuille de Route")**
6.  **Stratégie Open Source et Communautaire (Le "Pour Qui")**

---

## 1. Philosophie et Vision (Le "Pourquoi")

Le **Projet Symbiote** est né d'un constat : les outils de création de jeux sont souvent déconnectés du matériel sur lequel ils tournent. Notre mission est de **réunir le matériel et le logiciel dans une relation symbiotique, tangible et éducative**. Ce n'est pas seulement une console pour *jouer*, c'est une plateforme pour *apprendre, créer et expérimenter*.

**La Dualité Hôte/Symbiote :** Le cœur de notre philosophie est l'interaction entre la **Console Hôte**, puissante et immersive, et la **Cartouche Intelligente**, personnelle et persistente. La cartouche n'est pas un simple support de stockage ; c'est une entité vivante, le "Symbiote". Elle porte les jeux, mais aussi une personnalité (le "Compagnon"), créant un lien émotionnel avec l'utilisateur. Cette interaction physique et numérique est ce qui définit l'expérience Symbiote.

**L'Open Source comme Acte de Foi :** Nous croyons que la connaissance ne doit pas être enfermée. Chaque schéma, chaque ligne de code, chaque décision de conception sera transparent. L'objectif n'est pas seulement de livrer un produit fini, mais de fournir un "kit de Lego" matériel et logiciel complet, invitant chacun à construire, déconstruire et réimaginer.

---

## 2. Product Requirements Document (PRD) - (Le "Quoi")

### 2.1. Expérience Utilisateur Cible
L'utilisateur doit ressentir un plaisir tactile et une curiosité immédiate. Le "clic" satisfaisant de l'interrupteur, la connexion magnétique douce de la cartouche, et la double-surprise de découvrir que la cartouche est elle-même une console, sont des moments clés de l'expérience.

### 2.2. Scénarios d'Utilisation Détaillés

*   **Scénario "Découverte" :**
    1.  L'utilisateur déballe la console et la cartouche.
    2.  Il allume la cartouche seule via son port USB-C. L'écran OLED s'anime, présentant le Compagnon et la liste des jeux pré-chargés.
    3.  Il explore le mini-jeu caché sur la cartouche.
    4.  Il insère la cartouche dans la console. La connexion magnétique guide la cartouche en place.
    5.  Il allume la console. Le logo Symbiote apparaît sur l'écran principal, tandis que le Compagnon sur la cartouche "s'éveille" et regarde vers l'écran principal.

*   **Scénario "Session de Jeu" :**
    1.  Le joueur navigue dans le menu principal sur la console pour choisir un jeu.
    2.  Pendant le chargement, une animation de transfert de données est synchronisée entre les deux écrans.
    3.  En jeu, le Compagnon réagit dynamiquement : il sourit lors d'une victoire, a l'air inquiet lorsque le joueur a peu de vie, ou affiche une carte contextuelle.
    4.  Le joueur met la console en veille. Le Compagnon sur la cartouche s'endort.

*   **Scénario "Développement" :**
    1.  Le développeur connecte la console via USB-C à son PC. Elle est reconnue comme un appareil série pour le flashage et le débogage.
    2.  Il lance "Symbiote Studio", l'éditeur de jeu.
    3.  Il écrit du code et le teste instantanément dans le **Simulateur Double**, qui affiche une fenêtre pour la console et une pour la cartouche, communiquant en temps réel.
    4.  Il "compile et flashe" le jeu, qui est transféré sur la carte SD de la cartouche via la console.

---

## 3. Architecture Système Approfondie (Le "Comment")

### 3.1. Flux d'Alimentation Détaillé (`Power Tree`)

Un flux d'alimentation robuste est non-négociable.
*   **Console Hôte :**
    *   `USB-C (5V)` -> `MCP73871 (IN)`
    *   `Batterie (3.0-4.2V)` -> `MCP73871 (BAT)`
    *   `MCP73871 (OUT)` -> `V_SYS`
    *   `V_SYS` -> `Interrupteur Physique` -> `V_SYS_SW`
    *   `V_SYS_SW` -> `Entrée Buck-Boost` -> `Sortie +3V3` (Alimente ESP32-S3, LCD, Logique)
    *   `V_SYS_SW` -> `Entrée Boost` -> `Sortie +5V` (Alimente Connecteur Cartouche, Ampli Audio)
*   **Cartouche Intelligente :**
    *   `Connecteur (5V)` ou `USB-C (5V)` -> `MCP73871 (IN)`
    *   `Batterie Interne (3.0-4.2V)` -> `MCP73871 (BAT)`
    *   `MCP73871 (OUT)` -> `V_SYS_CART`
    *   `V_SYS_CART` -> `Entrée LDO/Buck-Boost` -> `Sortie +3V3_CART` (Alimente ESP32-C3, OLED, MicroSD)

### 3.2. Topologie de Communication

La communication est le sang du système.
*   **Console (Maître) <-> Cartouche (Esclave) :**
    *   **Lien Physique :** Bus SPI (Serial Peripheral Interface) sur le connecteur 6-pin. Ce choix est délibéré pour sa haute vitesse, essentielle pour charger les assets des jeux (textures, sons) depuis la carte SD de la cartouche vers la RAM de la console sans latence perceptible.
    *   **Protocole Logique :** Un protocole commande-réponse sera défini.
        *   Exemples de commandes de la Console : `CMD_GET_GAME_LIST`, `CMD_READ_FILE(path)`, `CMD_UPDATE_COMPANION(state)`.
        *   Exemples de réponses de la Cartouche : `RESP_GAME_LIST(data)`, `RESP_FILE_CHUNK(data)`, `RESP_ACK`.
*   **Cartouche (Maître) <-> Carte MicroSD (Esclave) :**
    *   **Lien Physique :** Bus SPI. L'ESP32-C3 partagera son unique bus SPI matériel.
    *   **Arbitrage :** La gestion des lignes Chip Select (`CS_CONSOLE` et `CS_SD`) est critique. Le firmware de la cartouche devra s'assurer qu'une seule de ces lignes est active à un instant `t` pour éviter les conflits sur le bus.

### 3.3. Architecture Firmware (FreeRTOS)

L'utilisation de FreeRTOS permet de paralléliser les tâches et de garantir la réactivité.
*   **Console Hôte - Tâches Principales :**
    *   `Task_Input (Prio 3)` : Scanne les boutons et le joystick à haute fréquence.
    *   `Task_GameLogic (Prio 2)` : Fait tourner la boucle de jeu principale.
    *   `Task_Renderer (Prio 2)` : Gère le double-buffering et l'envoi des données à l'écran LCD via SPI.
    *   `Task_Audio (Prio 3)` : Envoie le flux audio à l'ampli I2S.
    *   `Task_SymbioteLink (Prio 1)` : Gère la communication avec la cartouche.
*   **Cartouche Intelligente - Tâches Principales :**
    *   `Task_SPI_Slave (Prio 3)` : Écoute en permanence les commandes de la console.
    *   `Task_OLED_Display (Prio 2)` : Met à jour l'écran OLED avec l'état du Compagnon.
    *   `Task_SD_Manager (Prio 1)` : Gère les accès à la carte SD, déclenchés par la tâche esclave.
    *   `Task_CompanionAI (Prio 1)` : Gère la logique interne du Compagnon (animations, états).

---

## 4. Spécifications des Composants et Justifications (Le "Avec Quoi")

Chaque composant a été choisi pour une raison précise.

*   **MCU Console (ESP32-S3-WROOM-1) :**
    *   **Justification :** Le meilleur compromis performance/prix/écosystème. Ses cœurs Xtensa LX7 à 240MHz sont plus que suffisants. Ses 8MB de PSRAM (sur certaines versions) sont un atout majeur pour les jeux riches en assets. Le support LCD et USB natif simplifie drastiquement le matériel.
*   **MCU Cartouche (ESP32-C3-MINI-1) :**
    *   **Justification :** Économie d'énergie et taille compacte. Le cœur RISC-V est moderne et efficace. Sa puissance est suffisante pour gérer l'écran OLED, la SD, et la communication esclave.
*   **Gestion d'Alimentation (MCP73871) :**
    *   **Justification :** La gestion du "Power Path" est une fonctionnalité non-négociable pour une expérience utilisateur fluide. Ce composant est un standard de l'industrie, fiable et bien documenté, qui résout ce problème complexe en un seul chip.
*   **Amplificateur Audio (MAX98357A) :**
    *   **Justification :** L'audio I2S offre une qualité numérique supérieure au DAC PWM de base. Ce composant intègre le DAC et l'amplificateur de classe D, réduisant le nombre de composants et simplifiant le routage, tout en offrant un son clair et puissant.

---

## 5. Plan de Développement Détaillé (La "Feuille de Route")

Ceci est une expansion de la `TODO` list.

### Phase 1 : Conception & Prototypage Virtuel (En cours)
*   **Tâche 1.1 :** Finaliser le schéma de la Console Hôte sur KiCad.
    *   *Livrable :* Fichier `.kicad_sch` complet et annoté.
*   **Tâche 1.2 :** Faire de même pour la Cartouche.
    *   *Livrable :* Fichier `.kicad_sch` complet.
*   **Tâche 1.3 :** Sélectionner les empreintes (footprints) PCB pour chaque composant.
    *   *Livrable :* Schémas avec empreintes assignées, prêts pour le layout.

### Phase 2 : Prototypage Physique
*   **Tâche 2.1 :** Routage du PCB de la Console.
    *   *Défis :* Placement des composants pour une bonne ergonomie, routage des signaux haute vitesse (SPI), plan de masse solide.
*   **Tâche 2.2 :** Routage du PCB de la Cartouche.
    *   *Défis :* Densité élevée, isolation du bus SPI.
*   **Tâche 2.3 :** Commande et Assemblage.
    *   *Stratégie :* Commande des PCB chez JLCPCB, des composants chez LCSC/Mouser. Assemblage manuel du premier prototype.

### Phase 3 : Firmware et Validation Matérielle
*   **Tâche 3.1 :** Écriture d'un "Firmware de Test Usine".
    *   *Objectif :* Un programme simple qui teste chaque sous-système un par un (l'écran affiche des couleurs, l'audio émet un bip, chaque bouton est détecté). C'est essentiel pour valider que le matériel est fonctionnel.
*   **Tâche 3.2 :** Développement des Drivers de Base.
    *   *Livrable :* Une bibliothèque `HAL_Symbiote` contenant des fonctions simples comme `display_draw_pixel()`, `audio_play_buffer()`, `input_get_state()`.

*(Les phases 4, 5 et 6 suivent comme précédemment, mais construites sur cette base solide)*

---

## 6. Stratégie Open Source et Communautaire (Le "Pour Qui")

**Licences :**
*   **Matériel :** CERN Open Hardware Licence v2 - Permissive (CERN-OHL-P). Elle exige l'attribution mais permet l'usage commercial des dérivés.
*   **Logiciel :** MIT License. Extrêmement permissive pour encourager l'adoption et l'expérimentation.

**Plateforme Communautaire :**
*   **Dépôt Central :** Un dépôt GitHub sera la source de vérité pour tous les fichiers (`hardware/`, `firmware/`, etc.).
*   **Documentation :** Un site dédié (utilisant GitBook ou MkDocs) sera créé à partir des fichiers Markdown du dépôt `docs/`. Il contiendra des tutoriels, les schémas, et des explications de conception.
*   **Communication :** Un serveur Discord ou un forum sera mis en place pour permettre aux constructeurs et développeurs d'échanger.

Ce document constitue la fondation. Chaque nouvelle étape, chaque nouvelle décision peut y être ajoutée. C'est un document vivant, mais il nous donne une direction claire et une ambition définie.
