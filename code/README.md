# Projet Symbiote : Console de Développement Rétro Modulaire

 <!-- Tu pourras remplacer ce lien par un croquis ou un rendu 3D plus tard -->

## 📜 Vision du Projet

**Projet Symbiote** est une console de jeu portable, open-source et rétro, conçue avant tout pour les développeurs, les créateurs et les passionnés. Son architecture unique est basée sur une **Console Hôte** et une **Cartouche Intelligente**, créant une interaction symbiotique entre les deux.

L'objectif est de fournir une plateforme matérielle et logicielle entièrement documentée, facile à prendre en main, et propice à l'expérimentation pour créer des jeux et des expériences interactives uniques.

### Principes Fondamentaux
*   **Totalement Open Source :** Schemas matériels (KiCad/EasyEDA), code du firmware, game engine, et outils de développement.
*   **Documentation Exemplaire :** Chaque aspect du projet doit être documenté pour permettre à quiconque de construire, modifier ou développer pour la console.
*   **Centré sur le Développeur :** L'écosystème logiciel (éditeur, simulateur) est aussi important que le matériel.
*   **Modularité et Hackabilité :** La console et la cartouche sont conçues pour être comprises et modifiées.

---

## ✨ Concepts Clés

### 1. La Console Hôte (La Mère)

C'est l'interface de jeu principale. Elle fournit la puissance de calcul, les contrôles principaux et l'expérience de jeu immersive.

*   **Contrôles :**
    *   1x Joystick analogique
    *   4x Boutons d'action (A, B, X, Y)
    *   Boutons `Start` & `Select`
    *   1x Switch d'alimentation physique
*   **Affichage :** Écran LCD couleur principal (ex: 3.5 pouces, 320x240).
*   **Audio :** Système audio mono ou stéréo avec haut-parleur intégré et prise jack 3.5mm.
*   **Connectique :**
    *   Port USB-C pour la charge et le transfert de données/debug.
    *   Connecteur de cartouche robuste.
*   **Indicateurs :** 1x LED RGB de statut (charge, activité, debug).

### 2. La Cartouche Intelligente (Le Symbiote)

Plus qu'un simple support de stockage, la cartouche est une mini-console autonome.

*   **Fonctionnalités Autonomes :**
    *   **Mini-écran :** Petit écran OLED secondaire (ex: 128x64).
    *   **Le "Compagnon" :** Affiche un personnage (style Tamagotchi) avec des animations et des émotions.
    *   **Mini-jeu caché :** Un petit jeu simple accessible lorsque la cartouche n'est pas dans la console.
    *   **Explorateur de jeux :** Permet de lister les jeux présents sur la carte microSD.
*   **Fonctionnalités en Symbiose :**
    *   **Stockage Principal :** Contient le lecteur de carte microSD où les jeux sont stockés.
    *   **Interaction avec la Console Hôte :** Le Compagnon réagit aux événements du jeu en cours (ex: il a peur si le joueur prend des dégâts, il est content si on réussit un niveau).
    *   **Affichage Secondaire :** L'écran peut afficher des informations contextuelles (inventaire, carte, stats).
*   **Connectique :** Port USB-C pour la gestion des jeux sur PC sans la console.

---

## 🛠️ Architecture Technique (Propositions)

### Matériel (Hardware)

| Composant                 | Console Hôte                                | Cartouche Intelligente                          |
| ------------------------- | ------------------------------------------- | ----------------------------------------------- |
| **Microcontrôleur (MCU)** | **ESP32-S3** ou **STM32H7** (puissant)      | **RP2040** ou **ESP32-C3** (efficace et compact)  |
| **Écran**                 | LCD IPS 3.5" (SPI, 320x240)                 | OLED 0.96" ou 1.3" (I2C, 128x64)                 |
| **Stockage**              | Flash interne du MCU (pour le firmware)     | **Lecteur de carte microSD** (pour les jeux)    |
| **Audio**                 | DAC I2S + Ampli (ex: MAX98357) + Haut-parleur | Piezzo Buzzer (simple)                          |
| **Batterie**              | LiPo ~2000-4000mAh                          | LiPo ~200-500mAh                                |
| **Chargeur**              | Circuit de charge LiPo (ex: TP4056)         | Circuit de charge LiPo (ex: TP4056)             |
| **Connecteur Principal**  | Port propriétaire 30-40 pins (mâle)         | Port propriétaire 30-40 pins (femelle)          |
| **Connectique Externe**   | USB-C (Données + Charge)                    | USB-C (Données + Charge)                        |
| **Communication**         | **SPI** (Maître)                            | **SPI** (Esclave)                               |

### Logiciel (Software)

L'architecture logicielle sera basée sur **FreeRTOS** pour la gestion des tâches temps réel sur les deux unités.

#### Pile Logicielle
```
+-----------------------------------+
|       JEU / APPLICATION           |  <-- Couche la plus haute
+-----------------------------------+
|          GAME ENGINE              |  (Graphismes, Audio, Physique, Scènes)
+-----------------------------------+
|          MIDDLEWARE               |  (Système de fichiers, API Symbiote)
+-----------------------------------+
|           DRIVERS                 |  (Écran, SD, Audio, Input)
+-----------------------------------+
|   HAL (Hardware Abstraction Layer)|
+-----------------------------------+
|             FreeRTOS              |  (Gestion des tâches)
+-----------------------------------+
|              MATÉRIEL             |  <-- Couche la plus basse
+-----------------------------------+
```

#### Communication Console Hôte <-> Cartouche (Protocole SPI)
*   **Console (Maître) :**
    *   Envoie des commandes : `LOAD_GAME(game_path)`, `GET_GAME_LIST()`, `UPDATE_COMPANION_STATE(emotion)`.
    *   Lit les données de la carte SD via la cartouche.
*   **Cartouche (Esclave) :**
    *   Exécute les commandes reçues.
    *   Sert de pont entre la console et la carte microSD.
    *   Met à jour l'état de son "Compagnon" et de son écran.

---

## 🚀 Écosystème de Développement

### Le SDK Symbiote
Un ensemble de librairies en C/C++ pour interagir avec le matériel et le game engine.
*   `libsymbiote-core` : Fonctions de bas niveau (accès direct au matériel).
*   `libsymbiote-engine` : API du game engine (sprites, audio, scènes...).
*   `libsymbiote-link` : API pour la communication entre la console et la cartouche.

### L'Éditeur : "Symbiote Studio"
Une application de bureau (basée sur Electron ou en natif) pour créer des jeux.
*   **Éditeur de code** intégré ou liaison avec VSCode/PlatformIO.
*   **Gestionnaire d'assets** (images, tuiles, sons).
*   **Éditeur de niveaux/scènes** visuel.
*   **Le Simulateur Double :**
    *   Une fenêtre simule l'écran, les LEDs et les entrées de la Console Hôte.
    *   Une seconde fenêtre simule l'écran de la Cartouche Intelligente.
    *   Les deux simulateurs communiquent pour un débogage parfait de l'expérience complète.

---

## 🗺️ Feuille de Route (Roadmap)

### ✅ Phase 1 : Conception et Prototypage (Nous sommes ici)
- [x] Définition du concept général.
- [ ] Finalisation des choix de composants (MCU, écrans, etc.).
- [ ] Conception du schéma électronique (KiCad/EasyEDA).
- [ ] Routage du PCB pour la Console Hôte.
- [ ] Routage du PCB pour la Cartouche Intelligente.
- [ ] Commande des prototypes chez un fabricant (ex: JLCPCB).

### ☐ Phase 2 : Firmware de Base ("Bring-up")
- [ ] Écriture du bootloader.
- [ ] Port de FreeRTOS sur les deux MCUs.
- [ ] Développement des drivers (HAL) pour chaque périphérique (écrans, SD, audio...).
- [ ] Implémentation du protocole de communication SPI Maître/Esclave.
- [ ] Test : "Hello World" sur les deux écrans, lecture de la carte SD.

### ☐ Phase 3 : Game Engine et SDK
- [ ] Développement du moteur de rendu 2D (sprites, tilemaps).
- [ ] Développement du moteur audio.
- [ ] Gestion des inputs.
- [ ] Création de l'API publique du SDK.
- [ ] Création d'un jeu de démonstration simple.

### ☐ Phase 4 : Outils de Développement ("Symbiote Studio")
- [ ] Développement du simulateur double.
- [ ] Création de l'interface de l'éditeur.
- [ ] Intégration d'un compilateur (toolchain ARM/Xtensa).
- [ ] Packaging des jeux au format `.sym` (par exemple).

### ☐ Phase 5 : Communauté et Documentation
- [ ] Rédaction de la documentation complète sur GitBook ou un site web.
- [ ] Création de tutoriels (écrit et vidéo).
- [ ] Publication de tous les fichiers sources (hardware et software).

---

## 🤝 Contribuer

Ce projet est ouvert à tous. Pour contribuer, veuillez consulter le fichier `CONTRIBUTING.md` (à créer).

## 📄 Licence

Le projet sera publié sous une licence open source permissive.
*   **Matériel :** CERN Open Hardware Licence v2 - Permissive (CERN-OHL-P).
*   **Logiciel :** MIT License.