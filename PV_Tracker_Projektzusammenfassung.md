# PV Energie-Tracker — Projektzusammenfassung

## Status: v0.4.3 (2026-05-25)

## Repository
- **GitHub:** github.com/bavarian-dataforge/pv-energie-tracker
- **Tech Stack:** React 18 + Vite 5 + Recharts 2
- **Lizenz:** CC BY-NC-SA 4.0 (privat ✅, kommerziell ❌)
- **GitHub Pages:** noch nicht deployed (base-Pfad `/pv-energie-tracker/` in vite.config.js vorbereitet)

## Projektstruktur
```
pv-energie-tracker/
├── index.html
├── package.json
├── vite.config.js (mit base: '/pv-energie-tracker/')
├── public/
│   └── logo.png (bavarian-dataforge Logo, Fichtelgebirge/BF)
├── src/
│   ├── main.jsx (React entry + global styles, Spinner-Pfeile ausgeblendet)
│   └── PVDashboard.jsx (Haupt-Komponente, ~515 Zeilen)
├── LICENSE (CC BY-NC-SA 4.0)
├── .gitignore
└── README.md (Englisch, mit Changelog-Tabelle)
```

## Aktueller Funktionsumfang
- **3 Tabs:** Dashboard, Anlage, Monatsdaten
- **Dashboard:** 5 KPI-Karten + 5 interaktive Charts (ComposedChart, AreaChart, BarChart, PieChart)
- **Anlage-Tab:** PV-Parameter, Batteriespeicher, Stromtarif — alle editierbar
- **Monatsdaten-Tab:** 12-Monats-Tabelle mit editierbaren Eingaben (PV-Ertrag, Verbrauch, Speicherladung) und berechneten Werten (Netzbezug, Einspeisung, Eigenverbrauch, Autarkiegrad, EV-Quote, Kosten, Erlös, Netto)
- **Header:** bavarian-dataforge Logo + Titel + Version-Badge
- **Footer:** Author Credits (Florian Englmeier) + GitHub-Link + Lizenz

## Flo's System-Konfiguration (Defaults in der App)
- PV: 4.6 kWp, Growatt MIN 4200 (AC-Seite)
- Speicher: 9.6 kWh, Victron MultiPlus 48V/5000VA (DC-Seite), ESS aktiv, netzparallel
- Solarthermie: Wagner-Kollektoren für Warmwasser (gasfrei April–September)
- Gasheizung: ~20 Jahre alt
- Tarif: 24.95 ct/kWh brutto + 14.90 €/Monat Grundpreis (Fixpreis)
- Verbrauch: < 3.000 kWh/Jahr
- Einspeisung: aktiv
- Keine flexiblen Lasten (kein EV, keine WP, kein Boiler auf Strom)
- Standort: Marktredwitz, Fichtelgebirge, Bayern

## Changelog
| Version | Änderungen |
|---------|------------|
| 0.1.0 | Initial Release: 3 Tabs, 5 Charts, KPIs, Kostenrechnung |
| 0.2.0 | SVG Logo, Version-Badge, Author Credits, Lizenz → CC BY-NC-SA 4.0 |
| 0.3.0 | Saubere src/-Struktur, English README, Prerequisites dokumentiert |
| 0.4.0 | bavarian-dataforge Logo (PNG) in Header/Footer/Favicon/README |
| 0.4.1 | Eingabefelder verbreitert, Standort-Hint korrigiert |
| 0.4.2 | Padding-Fix für Spinner-Pfeile (nicht gelöst) |
| 0.4.3 | Spinner-Pfeile komplett entfernt, Einheiten in Tabellen-Header |

## Geplante Roadmap
| Version | Feature | Beschreibung |
|---------|---------|--------------|
| 0.5.0 | Setup-Wizard + PVGIS | Standort eingeben → automatische Ertragsprognose via PVGIS API |
| 0.6.0 | 48h Solar-Forecast | Wetterbasierte PV-Prognose (Open-Meteo / Solcast / forecast.solar) |
| 0.7.0 | Victron VRM API | Echte Daten aus dem VRM Portal (historisch + live) |
| 0.8.0 | Akku-Empfehlung | Intelligente SoC-Empfehlung basierend auf Forecast |
| 0.9.0 | Tarif-Vergleich | Fixpreis vs. dynamisch (aWATTar/Tibber) mit EPEX Spot Daten |
| 1.0.0 | Multi-Hersteller + PWA | Herstellerunabhängig (Fronius, SMA, Growatt, Huawei) + Offline |

## Erkenntnisse aus der Entwicklung
- **Vite `base`-Pfad:** Logo-Referenzen müssen `import.meta.env.BASE_URL + "logo.png"` nutzen statt `/logo.png`
- **GitHub Upload:** Dateien per `git push` hochladen, NICHT über die GitHub App (zerstört Ordnerstruktur)
- **HTTPS statt SSH:** Flo nutzt HTTPS + Personal Access Token für GitHub
- **Number-Input Spinner:** WebKit-Spinner überdecken Zahlen → komplett ausgeblendet via CSS
- **Lokaler Dev-Workflow:** Node.js auf Mac via `brew install node`, dann `npm install && npm run dev`

## Offene Fragen für nächste Session
- VRM API: Token erstellen, Endpunkte testen, welche historischen Daten verfügbar?
- PVGIS API: Braucht keinen Key, aber wie Standort-Eingabe UX-freundlich gestalten?
- Dynamic ESS Analyse: Bei < 3.000 kWh und keinen flexiblen Lasten aktuell marginaler Nutzen (30-60 €/Jahr). Erst mit E-Auto relevant.
- GitHub Pages Deployment: `npm run build && npx gh-pages -d dist` vorbereitet aber noch nicht ausgeführt
