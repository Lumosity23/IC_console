#!/bin/bash
# Script pour démarrer le serveur web pour le BOM Manager

# Se déplace dans le répertoire du script pour s'assurer que les chemins sont corrects
cd "$(dirname "$0")"

# Lance le serveur Python sur le port 8000
echo "Démarrage du serveur sur http://localhost:8000/BOM_manager_functional.html"
python3 -m http.server 8000
