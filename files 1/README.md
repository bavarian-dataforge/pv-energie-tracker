# ⚡ PV Energie-Tracker

**Interaktives Dashboard für Photovoltaik-Anlagen mit Batteriespeicher**

Ein reaktives Web-Dashboard zur Analyse und Optimierung deiner PV-Anlage. Berechnet Autarkiegrad, Eigenverbrauchsquote, Netto-Stromkosten und visualisiert alle Energieflüsse in Echtzeit.

![Version](https://img.shields.io/badge/Version-1.0.0-06b6d4)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2-22B5BF)
![License](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey)

**Autor:** [Florian Englmeier](https://github.com/bavarian-dataforge) · bavarian-dataforge

---

## 🎯 Features

- **📊 Live-Dashboard** — 5 interaktive Diagramme (Balken, Linien, Flächen, Torte) die sich bei jeder Eingabe sofort aktualisieren
- **⚙️ Anlagenparameter** — PV-Leistung, Speicherkapazität, Roundtrip-Effizienz, Degradation und Stromtarif frei konfigurierbar
- **📅 Monatsdaten** — Editierbare Tabelle mit automatischer Berechnung aller Kennzahlen
- **🛡️ Autarkiegrad** — Farbcodierte Darstellung (🟢 >70% · 🟡 40-70% · 🔴 <40%)
- **💶 Kostenrechnung** — Bezugskosten, Einspeiseerlöse und Netto-Jahreskosten
- **🔋 Speicher-Analyse** — Lade-/Entladezyklen mit Effizienzverlusten
- **📱 Responsive** — Funktioniert auf Desktop und mobilen Geräten

## 🚀 Schnellstart

```bash
# Repository klonen
git clone https://github.com/bavarian-dataforge/pv-energie-tracker.git
cd pv-energie-tracker

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die App öffnet sich automatisch unter `http://localhost:3000`.

## 📦 Build für Produktion

```bash
npm run build
npm run preview
```

Der Build landet in `dist/` und kann auf jedem statischen Webserver (Netlify, Vercel, GitHub Pages) gehostet werden.

## 🏗️ Projektstruktur

```
pv-energie-tracker/
├── index.html              # HTML Entry Point
├── package.json            # Dependencies & Scripts
├── vite.config.js          # Vite Konfiguration
├── src/
│   ├── main.jsx            # React Entry + Global Styles
│   └── PVDashboard.jsx     # Haupt-Dashboard-Komponente
├── LICENSE                 # MIT Lizenz
└── README.md
```

## 🔧 Standard-Konfiguration

Die App ist vorkonfiguriert für ein typisches österreichisches PV-Setup:

| Parameter | Standardwert | Beschreibung |
|-----------|-------------|--------------|
| PV-Leistung | 4,6 kWp | Nennleistung der Module |
| Spez. Ertrag | 1.050 kWh/kWp | Typisch für Wien/NÖ |
| Speicher | 9,6 kWh | Nutzbare Kapazität (LiFePO4) |
| Roundtrip-Effizienz | 90% | Lade-/Entladeverluste |
| Arbeitspreis | 24,95 ct/kWh | Brutto inkl. Netzentgelt |
| Grundpreis | 14,90 €/Monat | Brutto |
| Einspeisevergütung | 5,0 ct/kWh | OeMAG / Marktpreis |

Alle Werte sind im **Anlage**-Tab frei anpassbar.

## 📊 Dashboard-Übersicht

### KPI-Karten
Jahresüberblick auf einen Blick: PV-Ertrag, Verbrauch, Autarkiegrad, Eigenverbrauchsquote und Netto-Kosten.

### Diagramme
1. **PV vs. Verbrauch vs. Netzbezug** — Kombi-Chart (Balken + Linie)
2. **Autarkiegrad & EV-Quote** — Area-Chart mit Jahres-Referenzlinie
3. **Kosten & Erlöse** — Monatliche Gegenüberstellung
4. **Energiefluss** — Tortendiagramm der Jahresverteilung
5. **Speicher-Zyklen** — Lade- und Entlademengen pro Monat

## 🧮 Berechnungslogik

```
Speicherentladung  = Speicherladung × Roundtrip-Effizienz
Netzbezug          = max(0, Verbrauch − PV + Speicherladung − Speicherentladung)
Einspeisung        = max(0, PV − Verbrauch − Speicherladung + Speicherentladung)
Eigenverbrauch     = Verbrauch − Netzbezug
Autarkiegrad       = Eigenverbrauch / Verbrauch
EV-Quote           = (PV − Einspeisung) / PV
Bezugskosten       = Netzbezug × Arbeitspreis + Grundpreis
Einspeiseerlös     = Einspeisung × Einspeisevergütung
Netto-Kosten       = Bezugskosten − Einspeiseerlös
```

## 🤝 Contributing

Pull Requests und Issues sind willkommen! Ideen für Erweiterungen:

- [ ] CSV/JSON Import von Victron VRM Daten
- [ ] Spotmarkt-Preisvergleich (aWATTar / Tibber)
- [ ] Jahresvergleich über mehrere Jahre
- [ ] Dark/Light Theme Toggle
- [ ] PWA-Support für Offline-Nutzung
- [ ] Export als PDF-Report

## 📝 Lizenz

**CC BY-NC-SA 4.0** — siehe [LICENSE](LICENSE).

Private Nutzung, Anpassung und Weitergabe: ✅ erlaubt  
Kommerzielle Nutzung / Verkauf: ❌ nicht erlaubt

## 🏷️ Versionierung

Dieses Projekt verwendet [Semantic Versioning](https://semver.org/):

- **MAJOR** (x.0.0) — Breaking Changes, große Umbauten
- **MINOR** (0.x.0) — Neue Features, rückwärtskompatibel
- **PATCH** (0.0.x) — Bugfixes, kleine Verbesserungen

Die aktuelle Version ist in der App (Header + Footer) und in der `package.json` sichtbar.

### Changelog

| Version | Datum | Änderungen |
|---------|-------|------------|
| 1.0.0 | 2026-05-25 | Initial Release — Dashboard, Anlagenparameter, Monatsdaten, 5 Diagramme |

---

*Erstellt von [Florian Englmeier](https://github.com/bavarian-dataforge) mit 🤖 Claude (Jacky) + ☀️ Solarenergie-Begeisterung*
