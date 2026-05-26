import logoImage from "../assets/logo.png";
import { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart, ComposedChart, ReferenceLine
} from "recharts";

const APP_VERSION = "0.4.4";
const APP_NAME = "PV Energie-Tracker";

function BFLogo({ size = 40 }) {
  return (
    <img
      src={logoImage}
      alt="bavarian-dataforge"
      width={size}
      height={size}
      style={{ borderRadius: 8, objectFit: "contain" }}
    />
  );
}

const MONTHS = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
const MONTHS_FULL = ["Jänner","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const PV_FACTORS = [0.03,0.05,0.08,0.11,0.13,0.14,0.14,0.12,0.09,0.06,0.03,0.02];
const SEASON = [1.15,1.10,1.05,0.95,0.90,0.85,0.85,0.90,0.95,1.05,1.10,1.15];

const C = {
  bg: "#0a0e1a", card: "#111827", cardHover: "#1a2235", border: "#1e293b",
  text: "#e2e8f0", textDim: "#94a3b8", textMuted: "#64748b",
  solar: "#facc15", solarDim: "#a38a0f", consumption: "#3b82f6", consumptionDim: "#1e40af",
  grid: "#ef4444", gridDim: "#991b1b", feed: "#10b981", feedDim: "#065f46",
  battery: "#8b5cf6", batteryDim: "#5b21b6", accent: "#06b6d4", white: "#ffffff",
  inputBg: "#0f172a", inputBorder: "#334155", inputFocus: "#06b6d4",
};

const initSystem = () => ({
  pvKwp: 4.6, specYield: 1050, degradation: 0.5, age: 1,
  batteryKwh: 9.6, roundtrip: 90, cycleCost: 0.05,
  priceImport: 24.95, monthlyFee: 14.9, priceFeedIn: 5.0,
});

const initMonthly = (sys) => {
  const yearKwh = sys.pvKwp * sys.specYield * Math.pow(1 - sys.degradation/100, sys.age);
  return MONTHS.map((_, i) => ({
    pvErtrag: Math.round(yearKwh * PV_FACTORS[i]),
    verbrauch: Math.round(250 * SEASON[i]),
    speicherLadung: Math.round(Math.min(sys.batteryKwh * 28, yearKwh * PV_FACTORS[i] * 0.4)),
  }));
};

function NumberInput({ value, onChange, unit, min = 0, max = 99999, step = 1 }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      <input
        type="number" value={value} min={min} max={max} step={step}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        style={{
          width: 100, padding:"6px 10px", background:C.inputBg, border:`1px solid ${C.inputBorder}`,
          borderRadius:6, color:C.accent, fontSize:14, fontFamily:"'JetBrains Mono',monospace",
          textAlign:"right", outline:"none",
        }}
        onFocus={e => e.target.style.borderColor = C.inputFocus}
        onBlur={e => e.target.style.borderColor = C.inputBorder}
      />
      {unit && <span style={{ fontSize:12, color:C.textMuted }}>{unit}</span>}
    </div>
  );
}

function KpiCard({ label, value, unit, color, icon }) {
  return (
    <div style={{
      background: C.card, borderRadius: 12, padding: "16px 20px",
      border: `1px solid ${C.border}`, flex: "1 1 160px", minWidth: 160,
      position:"relative", overflow:"hidden",
    }}>
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:3,
        background: `linear-gradient(90deg, ${color}, transparent)`,
      }}/>
      <div style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize:24, fontWeight:700, color, fontFamily:"'JetBrains Mono',monospace" }}>
        {value}<span style={{ fontSize:13, color:C.textDim, marginLeft:4 }}>{unit}</span>
      </div>
    </div>
  );
}

function Section({ title, children, icon }) {
  return (
    <div style={{
      background: C.card, borderRadius: 14, padding: 24,
      border: `1px solid ${C.border}`, marginBottom: 20,
    }}>
      <h3 style={{
        fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 18px 0",
        display:"flex", alignItems:"center", gap:8, letterSpacing:0.5,
      }}>
        <span style={{ fontSize:18 }}>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}

const fmt = (v, d=0) => v.toLocaleString("de-AT", { minimumFractionDigits:d, maximumFractionDigits:d });
const fmtEur = v => v.toLocaleString("de-AT", { minimumFractionDigits:2, maximumFractionDigits:2 }) + " €";
const fmtPct = v => (v * 100).toFixed(1) + " %";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:"rgba(17,24,39,0.95)", border:`1px solid ${C.border}`,
      borderRadius:10, padding:"10px 14px", fontSize:12,
    }}>
      <div style={{ fontWeight:600, color:C.text, marginBottom:6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color:p.color, display:"flex", justifyContent:"space-between", gap:16, padding:"2px 0" }}>
          <span>{p.name}</span>
          <span style={{ fontFamily:"'JetBrains Mono',monospace" }}>{fmt(p.value, 1)}</span>
        </div>
      ))}
    </div>
  );
};

export default function PVDashboard() {
  const [sys, setSys] = useState(initSystem);
  const [monthly, setMonthly] = useState(() => initMonthly(initSystem()));
  const [tab, setTab] = useState("dashboard");

  const updateSys = useCallback((key, val) => {
    setSys(prev => {
      const next = { ...prev, [key]: val };
      if (["pvKwp","specYield","degradation","age","batteryKwh"].includes(key)) {
        setMonthly(initMonthly(next));
      }
      return next;
    });
  }, []);

  const updateMonth = useCallback((idx, key, val) => {
    setMonthly(prev => prev.map((m, i) => i === idx ? { ...m, [key]: val } : m));
  }, []);

  const computed = useMemo(() => {
    const eff = sys.roundtrip / 100;
    return monthly.map((m, i) => {
      const entladung = Math.round(m.speicherLadung * eff);
      const netzbezug = Math.max(0, m.verbrauch - m.pvErtrag - entladung + m.speicherLadung);
      const einspeisung = Math.max(0, m.pvErtrag - m.verbrauch - m.speicherLadung + entladung);
      const eigenverbrauch = m.verbrauch - netzbezug;
      const autarkie = m.verbrauch > 0 ? eigenverbrauch / m.verbrauch : 0;
      const evQuote = m.pvErtrag > 0 ? (m.pvErtrag - einspeisung) / m.pvErtrag : 0;
      const kosten = netzbezug * sys.priceImport / 100 + sys.monthlyFee;
      const erlos = einspeisung * sys.priceFeedIn / 100;
      return {
        name: MONTHS[i], fullName: MONTHS_FULL[i],
        pvErtrag: m.pvErtrag, verbrauch: m.verbrauch,
        speicherLadung: m.speicherLadung, entladung,
        netzbezug, einspeisung, eigenverbrauch,
        autarkie, evQuote, kosten, erlos, netto: kosten - erlos,
      };
    });
  }, [monthly, sys]);

  const totals = useMemo(() => {
    const t = computed.reduce((acc, m) => ({
      pv: acc.pv + m.pvErtrag, verb: acc.verb + m.verbrauch,
      netz: acc.netz + m.netzbezug, feed: acc.feed + m.einspeisung,
      eigen: acc.eigen + m.eigenverbrauch, kosten: acc.kosten + m.kosten,
      erlos: acc.erlos + m.erlos, laden: acc.laden + m.speicherLadung,
      entladen: acc.entladen + m.entladung,
    }), { pv:0, verb:0, netz:0, feed:0, eigen:0, kosten:0, erlos:0, laden:0, entladen:0 });
    t.autarkie = t.verb > 0 ? t.eigen / t.verb : 0;
    t.evQuote = t.pv > 0 ? (t.pv - t.feed) / t.pv : 0;
    t.netto = t.kosten - t.erlos;
    return t;
  }, [computed]);

  const pieData = [
    { name:"Direktverbrauch", value: Math.max(0, totals.eigen - totals.entladen), color: C.solar },
    { name:"Aus Speicher", value: totals.entladen, color: C.battery },
    { name:"Einspeisung", value: totals.feed, color: C.feed },
    { name:"Netzbezug", value: totals.netz, color: C.grid },
  ].filter(d => d.value > 0);

  const tabs = [
    { id:"dashboard", label:"Dashboard", icon:"📊" },
    { id:"anlage", label:"Anlage", icon:"⚙️" },
    { id:"monat", label:"Monatsdaten", icon:"📅" },
  ];

  return (
    <div style={{
      background: C.bg, minHeight: "100vh", color: C.text,
      fontFamily: "'Segoe UI','Helvetica Neue',sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${C.card} 0%, #0c1528 100%)`,
        borderBottom: `1px solid ${C.border}`, padding: "16px 24px",
        position:"sticky", top:0, zIndex:10,
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <BFLogo size={40} />
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <h1 style={{ margin:0, fontSize:20, fontWeight:700, letterSpacing:0.5 }}>
                  {APP_NAME}
                </h1>
                <span style={{
                  fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:20,
                  background:`${C.accent}22`, color:C.accent, border:`1px solid ${C.accent}44`,
                  fontFamily:"'JetBrains Mono',monospace", letterSpacing:0.5,
                }}>v{APP_VERSION}</span>
              </div>
              <div style={{ fontSize:12, color:C.textMuted, marginTop:3 }}>
                {sys.pvKwp} kWp · {sys.batteryKwh} kWh Speicher · Victron MultiPlus ESS
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:4, background:C.inputBg, borderRadius:10, padding:4 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding:"8px 16px", borderRadius:8, border:"none", cursor:"pointer",
                fontSize:13, fontWeight: tab === t.id ? 600 : 400, transition:"all 0.2s",
                background: tab === t.id ? C.accent : "transparent",
                color: tab === t.id ? C.bg : C.textDim,
              }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding:"20px 24px", maxWidth:1200, margin:"0 auto" }}>

        {/* ═══ DASHBOARD TAB ═══ */}
        {tab === "dashboard" && (
          <>
            {/* KPIs */}
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:20 }}>
              <KpiCard icon="☀️" label="PV-Ertrag" value={fmt(totals.pv)} unit="kWh/a" color={C.solar} />
              <KpiCard icon="🏠" label="Verbrauch" value={fmt(totals.verb)} unit="kWh/a" color={C.consumption} />
              <KpiCard icon="🛡️" label="Autarkiegrad" value={fmtPct(totals.autarkie)} unit="" color={C.feed} />
              <KpiCard icon="🔋" label="Eigenverbr." value={fmtPct(totals.evQuote)} unit="" color={C.battery} />
              <KpiCard icon="💰" label="Netto-Kosten" value={fmtEur(totals.netto)} unit="/a" color={C.grid} />
            </div>

            {/* Chart 1: PV vs Verbrauch vs Netzbezug */}
            <Section title="PV-Ertrag vs. Verbrauch vs. Netzbezug" icon="📊">
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={computed} margin={{ top:10, right:10, left:0, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="name" tick={{ fill:C.textMuted, fontSize:12 }} />
                  <YAxis tick={{ fill:C.textMuted, fontSize:11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize:12, color:C.textDim }} />
                  <Bar dataKey="pvErtrag" name="PV-Ertrag" fill={C.solar} radius={[4,4,0,0]} />
                  <Bar dataKey="verbrauch" name="Verbrauch" fill={C.consumption} radius={[4,4,0,0]} />
                  <Bar dataKey="netzbezug" name="Netzbezug" fill={C.grid} radius={[4,4,0,0]} opacity={0.8} />
                  <Line type="monotone" dataKey="einspeisung" name="Einspeisung" stroke={C.feed} strokeWidth={2} dot={{ r:3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </Section>

            {/* Chart 2: Autarkie & EV-Quote */}
            <Section title="Autarkiegrad & Eigenverbrauchsquote" icon="📈">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={computed} margin={{ top:10, right:10, left:0, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="name" tick={{ fill:C.textMuted, fontSize:12 }} />
                  <YAxis tickFormatter={v => (v*100).toFixed(0)+"%"} domain={[0,1]} tick={{ fill:C.textMuted, fontSize:11 }} />
                  <Tooltip formatter={(v) => fmtPct(v)} contentStyle={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, fontSize:12 }} />
                  <Legend wrapperStyle={{ fontSize:12 }} />
                  <Area type="monotone" dataKey="autarkie" name="Autarkiegrad" stroke={C.feed} fill={C.feed} fillOpacity={0.15} strokeWidth={2.5} />
                  <Area type="monotone" dataKey="evQuote" name="EV-Quote" stroke={C.battery} fill={C.battery} fillOpacity={0.1} strokeWidth={2.5} />
                  <ReferenceLine y={totals.autarkie} stroke={C.feed} strokeDasharray="5 5" strokeWidth={1} />
                </AreaChart>
              </ResponsiveContainer>
            </Section>

            <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
              {/* Chart 3: Kosten & Erlöse */}
              <div style={{ flex:"1 1 500px" }}>
                <Section title="Monatliche Kosten & Erlöse" icon="💶">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={computed} margin={{ top:10, right:10, left:0, bottom:0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                      <XAxis dataKey="name" tick={{ fill:C.textMuted, fontSize:12 }} />
                      <YAxis tick={{ fill:C.textMuted, fontSize:11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize:12 }} />
                      <Bar dataKey="kosten" name="Bezugskosten" fill={C.grid} radius={[4,4,0,0]} />
                      <Bar dataKey="erlos" name="Einspeiseerlös" fill={C.feed} radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Section>
              </div>

              {/* Chart 4: Pie */}
              <div style={{ flex:"1 1 340px" }}>
                <Section title="Energiefluss (Jahresverteilung)" icon="🔄">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={95}
                        dataKey="value" nameKey="name" paddingAngle={3} strokeWidth={0}>
                        {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip formatter={(v) => fmt(v) + " kWh"} contentStyle={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, fontSize:12 }} />
                      <Legend wrapperStyle={{ fontSize:12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </Section>
              </div>
            </div>

            {/* Chart 5: Speicher */}
            <Section title="Speicher — Lade- & Entladezyklen" icon="🔋">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={computed} margin={{ top:10, right:10, left:0, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="name" tick={{ fill:C.textMuted, fontSize:12 }} />
                  <YAxis tick={{ fill:C.textMuted, fontSize:11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize:12 }} />
                  <Bar dataKey="speicherLadung" name="Ladung" fill={C.battery} radius={[4,4,0,0]} />
                  <Bar dataKey="entladung" name="Entladung" fill={C.accent} radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Section>
          </>
        )}

        {/* ═══ ANLAGE TAB ═══ */}
        {tab === "anlage" && (
          <>
            <Section title="PV-Anlage" icon="☀️">
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:16 }}>
                {[
                  { label:"PV-Leistung", key:"pvKwp", unit:"kWp", step:0.1, hint:"Nennleistung deiner Module" },
                  { label:"Spez. Jahresertrag", key:"specYield", unit:"kWh/kWp", step:10, hint:"Fichtelgebirge ~950, Süd-DE ~1100" },
                  { label:"Degradation/Jahr", key:"degradation", unit:"%", step:0.1, hint:"Typisch 0,5% p.a." },
                  { label:"Anlagenalter", key:"age", unit:"Jahre", step:1, hint:"Für Ertragsberechnung" },
                ].map(p => (
                  <div key={p.key} style={{ background:C.inputBg, borderRadius:10, padding:"14px 16px" }}>
                    <div style={{ fontSize:12, color:C.textMuted, marginBottom:6 }}>{p.label}</div>
                    <NumberInput value={sys[p.key]} onChange={v => updateSys(p.key, v)} unit={p.unit} step={p.step} />
                    <div style={{ fontSize:10, color:C.textMuted, marginTop:6, fontStyle:"italic" }}>{p.hint}</div>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop:16, padding:"12px 16px", background:`linear-gradient(90deg, ${C.solarDim}33, transparent)`,
                borderRadius:10, borderLeft:`3px solid ${C.solar}`,
              }}>
                <span style={{ color:C.textMuted, fontSize:12 }}>→ Erwarteter Jahresertrag: </span>
                <span style={{ color:C.solar, fontSize:16, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>
                  {fmt(sys.pvKwp * sys.specYield * Math.pow(1 - sys.degradation/100, sys.age))} kWh
                </span>
              </div>
            </Section>

            <Section title="Batteriespeicher" icon="🔋">
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:16 }}>
                {[
                  { label:"Nutzbare Kapazität", key:"batteryKwh", unit:"kWh", step:0.1, hint:"Netto nach DoD" },
                  { label:"Roundtrip-Effizienz", key:"roundtrip", unit:"%", step:1, hint:"Typisch 88-92% LiFePO4" },
                  { label:"Zyklenkosten", key:"cycleCost", unit:"€/kWh", step:0.01, hint:"Verschleiß pro kWh" },
                ].map(p => (
                  <div key={p.key} style={{ background:C.inputBg, borderRadius:10, padding:"14px 16px" }}>
                    <div style={{ fontSize:12, color:C.textMuted, marginBottom:6 }}>{p.label}</div>
                    <NumberInput value={sys[p.key]} onChange={v => updateSys(p.key, v)} unit={p.unit} step={p.step} />
                    <div style={{ fontSize:10, color:C.textMuted, marginTop:6, fontStyle:"italic" }}>{p.hint}</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Stromtarif" icon="💶">
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:16 }}>
                {[
                  { label:"Arbeitspreis Bezug", key:"priceImport", unit:"ct/kWh", step:0.1 },
                  { label:"Grundpreis", key:"monthlyFee", unit:"€/Monat", step:0.1 },
                  { label:"Einspeisevergütung", key:"priceFeedIn", unit:"ct/kWh", step:0.1 },
                ].map(p => (
                  <div key={p.key} style={{ background:C.inputBg, borderRadius:10, padding:"14px 16px" }}>
                    <div style={{ fontSize:12, color:C.textMuted, marginBottom:6 }}>{p.label}</div>
                    <NumberInput value={sys[p.key]} onChange={v => updateSys(p.key, v)} unit={p.unit} step={p.step} />
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {/* ═══ MONATSDATEN TAB ═══ */}
        {tab === "monat" && (
          <Section title="Monatliche Eingabedaten & Berechnungen" icon="📅">
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:0, fontSize:12 }}>
                <thead>
                  <tr>
                    {["Monat","PV-Ertrag\nkWh","Verbrauch\nkWh","Speicher ↑\nkWh","Speicher ↓\nkWh","Netzbezug\nkWh","Einspeisung\nkWh","Eigenverbr.\nkWh","Autarkie\n%","EV-Quote\n%","Kosten\n€","Erlös\n€","Netto\n€"].map((h, i) => (
                      <th key={i} style={{
                        padding:"10px 8px", background:C.border, color:C.text,
                        textAlign: i === 0 ? "left" : "right", fontWeight:600,
                        borderBottom:`2px solid ${C.accent}`, whiteSpace:"pre-line", lineHeight:"1.3",
                        position: i === 0 ? "sticky" : undefined, left: i === 0 ? 0 : undefined,
                        zIndex: i === 0 ? 2 : undefined,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {computed.map((m, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : `${C.border}33` }}>
                      <td style={{ padding:"8px", fontWeight:600, color:C.text, position:"sticky", left:0, background: i % 2 === 0 ? C.card : C.cardHover, zIndex:1 }}>{m.fullName}</td>
                      <td style={{ padding:"4px 6px" }}>
                        <input type="number" value={monthly[i].pvErtrag} onChange={e => updateMonth(i, "pvErtrag", parseInt(e.target.value)||0)}
                          style={{ width:75, padding:"4px 8px", background:C.inputBg, border:`1px solid ${C.inputBorder}`, borderRadius:4, color:C.solar, fontSize:12, textAlign:"right", fontFamily:"'JetBrains Mono',monospace" }} />
                      </td>
                      <td style={{ padding:"4px 6px" }}>
                        <input type="number" value={monthly[i].verbrauch} onChange={e => updateMonth(i, "verbrauch", parseInt(e.target.value)||0)}
                          style={{ width:75, padding:"4px 8px", background:C.inputBg, border:`1px solid ${C.inputBorder}`, borderRadius:4, color:C.consumption, fontSize:12, textAlign:"right", fontFamily:"'JetBrains Mono',monospace" }} />
                      </td>
                      <td style={{ padding:"4px 6px" }}>
                        <input type="number" value={monthly[i].speicherLadung} onChange={e => updateMonth(i, "speicherLadung", parseInt(e.target.value)||0)}
                          style={{ width:75, padding:"4px 8px", background:C.inputBg, border:`1px solid ${C.inputBorder}`, borderRadius:4, color:C.battery, fontSize:12, textAlign:"right", fontFamily:"'JetBrains Mono',monospace" }} />
                      </td>
                      {[m.entladung, m.netzbezug, m.einspeisung, m.eigenverbrauch].map((v, j) => (
                        <td key={j} style={{ padding:"8px 6px", textAlign:"right", color:C.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{fmt(v)}</td>
                      ))}
                      <td style={{ padding:"8px 6px", textAlign:"right", fontWeight:600, color: m.autarkie > 0.7 ? C.feed : m.autarkie > 0.4 ? C.solar : C.grid, fontFamily:"'JetBrains Mono',monospace" }}>
                        {fmtPct(m.autarkie)}
                      </td>
                      <td style={{ padding:"8px 6px", textAlign:"right", color:C.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{fmtPct(m.evQuote)}</td>
                      <td style={{ padding:"8px 6px", textAlign:"right", color:C.grid, fontFamily:"'JetBrains Mono',monospace" }}>{fmtEur(m.kosten)}</td>
                      <td style={{ padding:"8px 6px", textAlign:"right", color:C.feed, fontFamily:"'JetBrains Mono',monospace" }}>{fmtEur(m.erlos)}</td>
                      <td style={{ padding:"8px 6px", textAlign:"right", fontWeight:600, color: m.netto > 0 ? C.grid : C.feed, fontFamily:"'JetBrains Mono',monospace" }}>{fmtEur(m.netto)}</td>
                    </tr>
                  ))}
                  {/* Totals */}
                  <tr style={{ background:C.border, fontWeight:700 }}>
                    <td style={{ padding:"10px 8px", color:C.text, position:"sticky", left:0, background:C.border, zIndex:1 }}>GESAMT</td>
                    <td style={{ padding:"10px 6px", textAlign:"right", color:C.solar, fontFamily:"'JetBrains Mono',monospace" }}>{fmt(totals.pv)}</td>
                    <td style={{ padding:"10px 6px", textAlign:"right", color:C.consumption, fontFamily:"'JetBrains Mono',monospace" }}>{fmt(totals.verb)}</td>
                    <td style={{ padding:"10px 6px", textAlign:"right", color:C.battery, fontFamily:"'JetBrains Mono',monospace" }}>{fmt(totals.laden)}</td>
                    <td style={{ padding:"10px 6px", textAlign:"right", color:C.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{fmt(totals.entladen)}</td>
                    <td style={{ padding:"10px 6px", textAlign:"right", color:C.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{fmt(totals.netz)}</td>
                    <td style={{ padding:"10px 6px", textAlign:"right", color:C.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{fmt(totals.feed)}</td>
                    <td style={{ padding:"10px 6px", textAlign:"right", color:C.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{fmt(totals.eigen)}</td>
                    <td style={{ padding:"10px 6px", textAlign:"right", color:C.feed, fontFamily:"'JetBrains Mono',monospace" }}>{fmtPct(totals.autarkie)}</td>
                    <td style={{ padding:"10px 6px", textAlign:"right", color:C.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{fmtPct(totals.evQuote)}</td>
                    <td style={{ padding:"10px 6px", textAlign:"right", color:C.grid, fontFamily:"'JetBrains Mono',monospace" }}>{fmtEur(totals.kosten)}</td>
                    <td style={{ padding:"10px 6px", textAlign:"right", color:C.feed, fontFamily:"'JetBrains Mono',monospace" }}>{fmtEur(totals.erlos)}</td>
                    <td style={{ padding:"10px 6px", textAlign:"right", color:C.grid, fontSize:14, fontFamily:"'JetBrains Mono',monospace" }}>{fmtEur(totals.netto)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ marginTop:14, fontSize:11, color:C.textMuted, fontStyle:"italic" }}>
              🔵 Colored input fields = editable · Gray values = calculated · Self-sufficiency color: 🟢 &gt;70% · 🟡 40-70% · 🔴 &lt;40%
            </div>
          </Section>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${C.border}`,
        padding: "20px 24px",
        marginTop: 20,
        background: `linear-gradient(135deg, ${C.card} 0%, #0c1528 100%)`,
      }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <BFLogo size={24} />
            <div>
              <div style={{ fontSize:13, color:C.text, fontWeight:600 }}>
                {APP_NAME}
              </div>
              <div style={{ fontSize:11, color:C.textMuted }}>
                by <a href="https://github.com/bavarian-dataforge" target="_blank" rel="noopener noreferrer"
                  style={{ color:C.accent, textDecoration:"none" }}>Florian Englmeier</a> · bavarian-dataforge
              </div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <a href="https://github.com/bavarian-dataforge/pv-energie-tracker" target="_blank" rel="noopener noreferrer"
              style={{ fontSize:11, color:C.textMuted, textDecoration:"none", display:"flex", alignItems:"center", gap:4 }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
              GitHub
            </a>
            <span style={{
              fontSize:10, color:C.textMuted, padding:"2px 8px", borderRadius:20,
              border:`1px solid ${C.border}`, fontFamily:"'JetBrains Mono',monospace",
            }}>v{APP_VERSION}</span>
            <span style={{ fontSize:10, color:C.textMuted }}>
              CC BY-NC-SA 4.0
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
