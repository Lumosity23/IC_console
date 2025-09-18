# Pinout du Projet Symbiote v1.0

*Dernière mise à jour : [Date du jour]*
*Décision clé : Communication via SPI complet (6 pins).*

---

## 1. Console Hôte (MCU: ESP32-S3-WROOM-1)

L'ESP32-S3 utilise le bus **SPI2 (FSPI)** par défaut pour le flash interne. Nous utiliserons le bus **SPI3 (HSPI)** pour la communication avec la cartouche et un autre bus SPI pour l'écran pour des performances maximales.

| GPIO     | Fonction Primaire        | Composant Connecté         | Notes / Contraintes                                     |
| :------- | :----------------------- | :------------------------- | :------------------------------------------------------ |
| **Écran LCD (Bus SPI dédié)** |
| `GPIO 35`| `SPI_SCK`                | Écran LCD (SCK)            | Bus SPI rapide et dédié pour l'affichage.               |
| `GPIO 36`| `SPI_MOSI`               | Écran LCD (MOSI/SDA)       |                                                         |
| `GPIO 37`| `SPI_MISO` (Optionnel)   | Écran LCD (MISO)           | Non utilisé par beaucoup d'écrans, mais bon à câbler. |
| `GPIO 34`| `LCD_CS`                 | Écran LCD (Chip Select)    |                                                         |
| `GPIO 33`| `LCD_DC`                 | Écran LCD (Data/Command)   |                                                         |
| `GPIO 48`| `LCD_RST`                | Écran LCD (Reset)          | Pin de bas numéro, souvent sûr.                         |
| `GPIO 47`| `LCD_BL` (PWM)           | Écran LCD (Backlight)      | Pin avec capacité PWM pour le contrôle de la luminosité.|
| **Communication Cartouche (Bus SPI3)** |
| `GPIO 12`| `SPI3_SCK`               | Connecteur Cartouche (SCK) | **Maître SPI**. Bus dédié à la cartouche.              |
| `GPIO 11`| `SPI3_MOSI`              | Connecteur Cartouche (MOSI)|                                                         |
| `GPIO 13`| `SPI3_MISO`              | Connecteur Cartouche (MISO)|                                                         |
| `GPIO 10`| `CART_CS`                | Connecteur Cartouche (CS)  |                                                         |
| **Audio (I2S0)** |
| `GPIO 15`| `I2S0_BCLK`              | Ampli I2S (MAX98357)       | Pins I2S standards.                                     |
| `GPIO 16`| `I2S0_LRC`               | Ampli I2S (MAX98357)       |                                                         |
| `GPIO 17`| `I2S0_DOUT`              | Ampli I2S (MAX98357)       |                                                         |
| **Inputs** |
| `GPIO 4` | `INPUT` (ADC1_CH3)       | Joystick X                 | Pin ADC.                                                |
| `GPIO 5` | `INPUT` (ADC1_CH4)       | Joystick Y                 | Pin ADC.                                                |
| `GPIO 6` | `INPUT`                  | Bouton Joystick            | Pull-up interne activé.                                 |
| `GPIO 7` | `INPUT`                  | Bouton A                   | Pull-up interne activé.                                 |
| `GPIO 8` | `INPUT`                  | Bouton B                   | Pull-up interne activé.                                 |
| `GPIO 18`| `INPUT`                  | Bouton X                   | Pull-up interne activé.                                 |
| `GPIO 21`| `INPUT`                  | Bouton Y                   | Pull-up interne activé.                                 |
| `GPIO 1` | `INPUT`                  | Bouton Start               | Pull-up interne activé.                                 |
| `GPIO 2` | `INPUT`                  | Bouton Select              | Pull-up interne activé.                                 |
| **Gestion Alimentation & USB** |
| `GPIO 38`| `USB_D-`                 | USB-C Natif                | **FIXE - Ne pas changer.**                              |
| `GPIO 39`| `USB_D+`                 | USB-C Natif                | **FIXE - Ne pas changer.**                              |
| `GPIO 14`| `LED_RGB`                | LED de statut (Neopixel)   | Pin RMT-capable.                                        |
| `GPIOxx` | `IP5306_IRQ` (Optionnel) | IP5306                     | Pour détecter les changements d'état de la batterie.    |

---

## 2. Cartouche Intelligente (MCU: ESP32-C3-MINI-1)

L'ESP32-C3 a un seul bus SPI (SPI2/FSPI) qui est partagé entre le flash interne et les périphériques (mode "MSPI"). C'est une contrainte importante. On doit gérer le partage de ce bus entre la communication avec la console et l'accès à la carte SD. C'est tout à fait faisable en gérant bien les Chip Select (CS).

| GPIO     | Fonction Primaire        | Composant Connecté         | Notes / Contraintes                                     |
| :------- | :----------------------- | :------------------------- | :------------------------------------------------------ |
| **Bus SPI partagé (SPI2)** |
| `GPIO 6` | `SPI2_SCK`               | Connecteur & SD Card (SCK) | **Esclave SPI** pour la console, **Maître** pour la SD.  |
| `GPIO 7` | `SPI2_MOSI`              | Connecteur & SD Card (MOSI)|                                                         |
| `GPIO 2` | `SPI2_MISO`              | Connecteur & SD Card (MISO)|                                                         |
| `GPIO 10`| `CONSOLE_CS`             | Connecteur (CS)            | **Pin CS pour l'esclave.** Doit être un pin d'entrée.   |
| `GPIO 1` | `SD_CS`                  | Lecteur MicroSD (CS)       | Pin CS pour la carte SD.                                |
| **Écran OLED (I2C0)** |
| `GPIO 4` | `I2C_SDA`                | Écran OLED (SDA)           |                                                         |
| `GPIO 5` | `I2C_SCL`                | Écran OLED (SCL)           |                                                         |
| **Autres** |
| `GPIO 3` | `BUZZER` (PWM)           | Piezo Buzzer               |                                                         |
| **Gestion Alimentation & USB** |
| `GPIO 18`| `USB_D-`                 | USB-C Natif                | **FIXE - Ne pas changer.**                              |
| `GPIO 19`| `USB_D+`                 | USB-C Natif                | **FIXE - Ne pas changer.**                              |
| `GPIO 20`| `UART0_TX` (Debug)       | Header de debug (Optionnel)| Pour voir les logs au démarrage.                        |
| `GPIO 21`| `UART0_RX` (Debug)       | Header de debug (Optionnel)|                                                         |
