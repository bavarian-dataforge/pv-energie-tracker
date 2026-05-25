# ⚡ PV Energy Tracker

**Interactive dashboard for photovoltaic systems with battery storage**

A reactive web dashboard for analyzing and optimizing your solar energy setup. Calculates self-sufficiency rate, self-consumption ratio, net electricity costs, and visualizes all energy flows in real time.

![Version](https://img.shields.io/badge/Version-0.2.0-06b6d4)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2-22B5BF)
![License](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey)

**Author:** [Florian Englmeier](https://github.com/bavarian-dataforge) · bavarian-dataforge

---

## 🎯 Features

- **📊 Live Dashboard** — 5 interactive charts (bar, line, area, pie) that update instantly on every input change
- **⚙️ System Parameters** — PV capacity, battery size, round-trip efficiency, degradation, and electricity tariff fully configurable
- **📅 Monthly Data** — Editable table with automatic calculation of all key metrics
- **🛡️ Self-Sufficiency Rate** — Color-coded display (🟢 >70% · 🟡 40-70% · 🔴 <40%)
- **💶 Cost Calculation** — Grid import costs, feed-in revenue, and net annual costs
- **🔋 Battery Analysis** — Charge/discharge cycles with efficiency losses
- **📱 Responsive** — Works on desktop and mobile devices

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/bavarian-dataforge/pv-energie-tracker.git
cd pv-energie-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

The app opens automatically at `http://localhost:3000`.

## 📦 Production Build

```bash
npm run build
npm run preview
```

The build output goes to `dist/` and can be deployed on any static web host (Netlify, Vercel, GitHub Pages).

## 🏗️ Project Structure

```
pv-energie-tracker/
├── index.html              # HTML entry point
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite configuration
├── src/
│   ├── main.jsx            # React entry + global styles
│   └── PVDashboard.jsx     # Main dashboard component
├── LICENSE                 # CC BY-NC-SA 4.0
└── README.md
```

## 🔧 Default Configuration

The app comes pre-configured for a typical Austrian residential PV setup:

| Parameter | Default | Description |
|-----------|---------|-------------|
| PV Capacity | 4.6 kWp | Nominal module power |
| Specific Yield | 1,050 kWh/kWp | Typical for Vienna / Lower Austria |
| Battery | 9.6 kWh | Usable capacity (LiFePO4) |
| Round-Trip Efficiency | 90% | Charge/discharge losses |
| Import Price | 24.95 ct/kWh | Gross incl. grid fees |
| Monthly Base Fee | €14.90/month | Gross |
| Feed-In Tariff | 5.0 ct/kWh | OeMAG / market rate |

All values are freely adjustable in the **System** tab.

## 📊 Dashboard Overview

### KPI Cards
Annual overview at a glance: PV yield, consumption, self-sufficiency rate, self-consumption ratio, and net costs.

### Charts
1. **PV vs. Consumption vs. Grid Import** — Combined bar + line chart
2. **Self-Sufficiency & Self-Consumption Rate** — Area chart with annual reference line
3. **Costs & Revenue** — Monthly comparison
4. **Energy Flow** — Pie chart of annual distribution
5. **Battery Cycles** — Monthly charge and discharge amounts

## 🧮 Calculation Logic

```
Battery Discharge  = Battery Charge × Round-Trip Efficiency
Grid Import        = max(0, Consumption − PV + Charge − Discharge)
Feed-In            = max(0, PV − Consumption − Charge + Discharge)
Self-Consumption   = Consumption − Grid Import
Self-Sufficiency   = Self-Consumption / Consumption
SC Ratio           = (PV − Feed-In) / PV
Import Cost        = Grid Import × Import Price + Monthly Fee
Feed-In Revenue    = Feed-In × Feed-In Tariff
Net Cost           = Import Cost − Feed-In Revenue
```

## 🤝 Contributing

Pull requests and issues are welcome! Ideas for future features:

- [ ] CSV/JSON import from Victron VRM data
- [ ] Spot market price comparison (aWATTar / Tibber)
- [ ] Multi-year comparison view
- [ ] Dark/Light theme toggle
- [ ] PWA support for offline use
- [ ] PDF report export
- [ ] Modbus / live data integration from inverter systems

## 🏷️ Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** (x.0.0) — Breaking changes, major redesigns
- **MINOR** (0.x.0) — New features, backward-compatible
- **PATCH** (0.0.x) — Bug fixes, minor improvements

The current version is displayed in the app header, footer, and in `package.json`.

### Changelog

| Version | Date | Changes |
|---------|------|---------|
| 0.2.0 | 2026-05-25 | Added SVG logo, version badge in header/footer, author credits, changelog, English README, license changed to CC BY-NC-SA 4.0 |
| 0.1.0 | 2026-05-25 | Initial release — interactive dashboard with 3 tabs (Dashboard, System, Monthly Data), 5 chart types, editable monthly inputs, KPI cards, cost calculation |

## 📝 License

**CC BY-NC-SA 4.0** — see [LICENSE](LICENSE).

✅ Private use, modification, and sharing permitted  
❌ Commercial use / resale not permitted

---

*Created by [Florian Englmeier](https://github.com/bavarian-dataforge) with 🤖 Claude (Jacky) + ☀️ solar energy enthusiasm*
