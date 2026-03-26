import React, { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── DEMO DATA ────────────────────────────────────────────────────────────────
const WEEKS = ["S1","S2","S3","S4","S5","S6"];
const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Juin"];

const DEMO = {
  ventes: {
    weekly: [
      { label:"S1", ca:4200, commandes:38, panier:110, taux:2.4, retours:3, marge:42 },
      { label:"S2", ca:5100, commandes:46, panier:110, taux:2.8, retours:2, marge:44 },
      { label:"S3", ca:4800, commandes:43, panier:111, taux:2.6, retours:4, marge:43 },
      { label:"S4", ca:6300, commandes:57, panier:110, taux:3.1, retours:2, marge:46 },
      { label:"S5", ca:5900, commandes:53, panier:111, taux:2.9, retours:3, marge:45 },
      { label:"S6", ca:7100, commandes:64, panier:110, taux:3.4, retours:1, marge:48 },
    ],
    monthly: [
      { label:"Jan", ca:18200, commandes:165, panier:110, taux:2.5, retours:12, marge:43 },
      { label:"Fév", ca:20400, commandes:185, panier:110, taux:2.7, retours:10, marge:44 },
      { label:"Mar", ca:22100, commandes:200, panier:110, taux:2.9, retours:9, marge:45 },
      { label:"Avr", ca:19800, commandes:179, panier:110, taux:2.6, retours:11, marge:44 },
      { label:"Mai", ca:24500, commandes:222, panier:110, taux:3.1, retours:8, marge:47 },
      { label:"Juin", ca:28100, commandes:255, panier:110, taux:3.5, retours:6, marge:49 },
    ],
    kpis: [
      { key:"ca", label:"Chiffre d'affaires", unit:"€", icon:"💶", chartKey:"ca" },
      { key:"commandes", label:"Commandes", unit:"", icon:"📦", chartKey:"commandes" },
      { key:"panier", label:"Panier moyen", unit:"€", icon:"🛒", chartKey:"panier" },
      { key:"taux", label:"Taux conversion", unit:"%", icon:"🎯", chartKey:"taux" },
      { key:"retours", label:"Retours", unit:"", icon:"↩️", chartKey:"retours" },
      { key:"marge", label:"Marge brute", unit:"%", icon:"📊", chartKey:"marge" },
    ],
  },
  pub: {
    weekly: [
      { label:"S1", depenses:820, cpc:0.92, ctr:2.1, roas:5.1, impressions:89000, conversions:31 },
      { label:"S2", depenses:940, cpc:0.88, ctr:2.3, roas:5.4, impressions:106000, conversions:37 },
      { label:"S3", depenses:870, cpc:0.90, ctr:2.2, roas:5.5, impressions:96000, conversions:34 },
      { label:"S4", depenses:1100, cpc:0.85, ctr:2.5, roas:5.7, impressions:129000, conversions:46 },
      { label:"S5", depenses:1020, cpc:0.87, ctr:2.4, roas:5.8, impressions:117000, conversions:43 },
      { label:"S6", depenses:1250, cpc:0.82, ctr:2.7, roas:5.7, impressions:152000, conversions:52 },
    ],
    monthly: [
      { label:"Jan", depenses:3400, cpc:0.94, ctr:2.0, roas:5.3, impressions:361000, conversions:128 },
      { label:"Fév", depenses:3900, cpc:0.91, ctr:2.2, roas:5.2, impressions:428000, conversions:145 },
      { label:"Mar", depenses:4200, cpc:0.88, ctr:2.3, roas:5.3, impressions:477000, conversions:159 },
      { label:"Avr", depenses:3800, cpc:0.90, ctr:2.1, roas:5.2, impressions:422000, conversions:143 },
      { label:"Mai", depenses:4600, cpc:0.86, ctr:2.5, roas:5.3, impressions:534000, conversions:178 },
      { label:"Juin", depenses:5100, cpc:0.83, ctr:2.7, roas:5.5, impressions:614000, conversions:204 },
    ],
    kpis: [
      { key:"depenses", label:"Dépenses pub", unit:"€", icon:"💸", chartKey:"depenses" },
      { key:"cpc", label:"Coût par clic", unit:"€", icon:"🖱️", chartKey:"cpc" },
      { key:"ctr", label:"Taux de clic", unit:"%", icon:"📌", chartKey:"ctr" },
      { key:"roas", label:"ROAS", unit:"x", icon:"📈", chartKey:"roas" },
      { key:"impressions", label:"Impressions", unit:"", icon:"👁️", chartKey:"impressions" },
      { key:"conversions", label:"Conversions", unit:"", icon:"✅", chartKey:"conversions" },
    ],
  },
  reseaux: {
    weekly: [
      { label:"S1", abonnes:12400, reach:48000, engagement:3.2, stories:14, posts:5, partages:210 },
      { label:"S2", abonnes:12680, reach:54000, engagement:3.5, stories:16, posts:6, partages:245 },
      { label:"S3", abonnes:12950, reach:51000, engagement:3.3, stories:15, posts:5, partages:228 },
      { label:"S4", abonnes:13300, reach:62000, engagement:3.8, stories:18, posts:7, partages:290 },
      { label:"S5", abonnes:13700, reach:59000, engagement:3.6, stories:17, posts:6, partages:271 },
      { label:"S6", abonnes:14200, reach:71000, engagement:4.1, stories:19, posts:8, partages:330 },
    ],
    monthly: [
      { label:"Jan", abonnes:11200, reach:194000, engagement:3.1, stories:55, posts:20, partages:820 },
      { label:"Fév", abonnes:11800, reach:218000, engagement:3.3, stories:62, posts:23, partages:940 },
      { label:"Mar", abonnes:12400, reach:236000, engagement:3.4, stories:66, posts:24, partages:1010 },
      { label:"Avr", abonnes:12800, reach:221000, engagement:3.2, stories:60, posts:22, partages:960 },
      { label:"Mai", abonnes:13500, reach:258000, engagement:3.7, stories:70, posts:26, partages:1120 },
      { label:"Juin", abonnes:14200, reach:296000, engagement:4.1, stories:78, posts:29, partages:1310 },
    ],
    kpis: [
      { key:"abonnes", label:"Abonnés", unit:"", icon:"👥", chartKey:"abonnes" },
      { key:"reach", label:"Portée", unit:"", icon:"📡", chartKey:"reach" },
      { key:"engagement", label:"Taux d'engagement", unit:"%", icon:"❤️", chartKey:"engagement" },
      { key:"stories", label:"Stories publiées", unit:"", icon:"📸", chartKey:"stories" },
      { key:"posts", label:"Posts publiés", unit:"", icon:"🖼️", chartKey:"posts" },
      { key:"partages", label:"Partages", unit:"", icon:"🔁", chartKey:"partages" },
    ],
  },
  emails: {
    weekly: [
      { label:"S1", envoyes:4200, ouvertures:31.2, clics:4.8, desabonnements:0.3, revenus:1200, sequences:2 },
      { label:"S2", envoyes:4500, ouvertures:33.1, clics:5.2, desabonnements:0.2, revenus:1480, sequences:3 },
      { label:"S3", envoyes:4300, ouvertures:32.0, clics:5.0, desabonnements:0.3, revenus:1320, sequences:2 },
      { label:"S4", envoyes:4800, ouvertures:35.4, clics:5.8, desabonnements:0.2, revenus:1760, sequences:3 },
      { label:"S5", envoyes:4600, ouvertures:34.2, clics:5.5, desabonnements:0.2, revenus:1620, sequences:3 },
      { label:"S6", envoyes:5100, ouvertures:37.1, clics:6.2, desabonnements:0.1, revenus:2050, sequences:4 },
    ],
    monthly: [
      { label:"Jan", envoyes:17800, ouvertures:30.5, clics:4.6, desabonnements:0.3, revenus:4900, sequences:8 },
      { label:"Fév", envoyes:19200, ouvertures:32.1, clics:4.9, desabonnements:0.3, revenus:5600, sequences:9 },
      { label:"Mar", envoyes:20100, ouvertures:33.4, clics:5.2, desabonnements:0.2, revenus:6200, sequences:10 },
      { label:"Avr", envoyes:18900, ouvertures:31.8, clics:5.0, desabonnements:0.2, revenus:5800, sequences:9 },
      { label:"Mai", envoyes:21400, ouvertures:34.9, clics:5.6, desabonnements:0.2, revenus:7100, sequences:11 },
      { label:"Juin", envoyes:24100, ouvertures:37.2, clics:6.3, desabonnements:0.1, revenus:8400, sequences:13 },
    ],
    kpis: [
      { key:"envoyes", label:"Emails envoyés", unit:"", icon:"📤", chartKey:"envoyes" },
      { key:"ouvertures", label:"Taux d'ouverture", unit:"%", icon:"📬", chartKey:"ouvertures" },
      { key:"clics", label:"Taux de clic", unit:"%", icon:"🔗", chartKey:"clics" },
      { key:"desabonnements", label:"Désabonnements", unit:"%", icon:"🚫", chartKey:"desabonnements" },
      { key:"revenus", label:"Revenus email", unit:"€", icon:"💰", chartKey:"revenus" },
      { key:"sequences", label:"Séquences actives", unit:"", icon:"⚙️", chartKey:"sequences" },
    ],
  },
  lancements: {
    weekly: [
      { label:"S1", prospects:320, inscrits:45, ventes:12, ca:4800, panier:400, taux:26.7 },
      { label:"S2", prospects:380, inscrits:52, ventes:15, ca:6000, panier:400, taux:28.8 },
      { label:"S3", prospects:340, inscrits:48, ventes:13, ca:5200, panier:400, taux:27.1 },
      { label:"S4", prospects:460, inscrits:63, ventes:19, ca:7600, panier:400, taux:30.2 },
      { label:"S5", prospects:420, inscrits:58, ventes:17, ca:6800, panier:400, taux:29.3 },
      { label:"S6", prospects:520, inscrits:72, ventes:23, ca:9200, panier:400, taux:31.9 },
    ],
    monthly: [
      { label:"Jan", prospects:1280, inscrits:180, ventes:48, ca:19200, panier:400, taux:26.7 },
      { label:"Fév", prospects:1480, inscrits:208, ventes:57, ca:22800, panier:400, taux:27.4 },
      { label:"Mar", prospects:1600, inscrits:225, ventes:63, ca:25200, panier:400, taux:28.0 },
      { label:"Avr", prospects:1420, inscrits:200, ventes:55, ca:22000, panier:400, taux:27.5 },
      { label:"Mai", prospects:1780, inscrits:250, ventes:72, ca:28800, panier:400, taux:28.8 },
      { label:"Juin", prospects:2040, inscrits:288, ventes:87, ca:34800, panier:400, taux:30.2 },
    ],
    kpis: [
      { key:"prospects", label:"Prospects", unit:"", icon:"🎯", chartKey:"prospects" },
      { key:"inscrits", label:"Inscrits waitlist", unit:"", icon:"📋", chartKey:"inscrits" },
      { key:"ventes", label:"Ventes", unit:"", icon:"🏆", chartKey:"ventes" },
      { key:"ca", label:"CA lancement", unit:"€", icon:"🚀", chartKey:"ca" },
      { key:"panier", label:"Panier moyen", unit:"€", icon:"💳", chartKey:"panier" },
      { key:"taux", label:"Taux conversion", unit:"%", icon:"📊", chartKey:"taux" },
    ],
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (val, unit) => {
  if (unit === "€") {
    if (val >= 1000) return `${(val/1000).toFixed(1)}k€`;
    return `${val}€`;
  }
  if (unit === "%") return `${val}%`;
  if (unit === "x") return `${val}x`;
  if (!unit && val >= 1000000) return `${(val/1000000).toFixed(1)}M`;
  if (!unit && val >= 1000) return `${(val/1000).toFixed(0)}k`;
  return `${val}`;
};

const getTrend = (data, key, idx) => {
  if (idx === 0) return null;
  const curr = data[idx][key];
  const prev = data[idx - 1][key];
  if (!prev) return null;
  return (((curr - prev) / prev) * 100).toFixed(1);
};

const getHealthScore = (mode, period) => {
  const scores = { weekly: [68, 72, 70, 78, 76, 84], monthly: [70, 73, 75, 74, 79, 84] };
  return scores[mode][period] ?? 80;
};

// ─── PARSE CSV ────────────────────────────────────────────────────────────────
const parseCSV = (text) => {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return null;
  const headers = lines[0].split(",").map(h => h.trim().replace(/"/g,""));
  return lines.slice(1).map(line => {
    const vals = line.split(",").map(v => v.trim().replace(/"/g,""));
    return Object.fromEntries(headers.map((h,i) => [h, vals[i]]));
  });
};

// ─── TABS CONFIG ──────────────────────────────────────────────────────────────
const TABS = [
  { id:"ventes",   label:"💰",  name:"Ventes" },
  { id:"pub",      label:"📣",  name:"Pub" },
  { id:"reseaux",  label:"📱",  name:"Réseaux" },
  { id:"emails",   label:"📧",  name:"Emails" },
  { id:"lancements",label:"🚀", name:"Lancements" },
  { id:"ia",       label:"🤖",  name:"IA" },
];

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#0D1120", border:"1px solid #FF8C4230", borderRadius:8, padding:"8px 12px" }}>
      <p style={{ color:"#FF8C42", fontSize:12, margin:"0 0 4px" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color:"#E2E8F0", fontSize:13, margin:0 }}>
          {fmt(p.value, "")}
        </p>
      ))}
    </div>
  );
};

// ─── KPI CARD ─────────────────────────────────────────────────────────────────
const KpiCard = ({ kpi, value, trend, unit }) => {
  const trendNum = parseFloat(trend);
  const isPos = trendNum > 0;
  const isNeg = trendNum < 0;
  return (
    <div style={{
      background:"#0D1120",
      borderRadius:14,
      padding:"14px 16px",
      border:"1px solid #1E2640",
      position:"relative",
      overflow:"hidden",
    }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background: "linear-gradient(90deg, #FF8C4240, transparent)" }} />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <span style={{ fontSize:22 }}>{kpi.icon}</span>
        {trend !== null && (
          <span style={{
            fontSize:11,
            fontWeight:700,
            color: isPos ? "#FF8C42" : isNeg ? "#FF6B6B" : "#64748B",
            background: isPos ? "#FF8C4215" : isNeg ? "#FF6B6B15" : "#64748B15",
            padding:"2px 7px",
            borderRadius:20,
          }}>
            {isPos ? "▲" : isNeg ? "▼" : "─"} {Math.abs(trendNum)}%
          </span>
        )}
      </div>
      <div style={{ marginTop:10 }}>
        <div style={{ fontSize:22, fontWeight:800, color:"#F1F5F9", letterSpacing:"-0.5px", fontFamily:"'DM Mono', monospace" }}>
          {fmt(value, unit)}
        </div>
        <div style={{ fontSize:11, color:"#64748B", marginTop:3, fontWeight:500 }}>
          {kpi.label}
        </div>
      </div>
    </div>
  );
};

// ─── HEALTH RING ──────────────────────────────────────────────────────────────
const HealthRing = ({ score }) => {
  const r = 18, c = 2 * Math.PI * r;
  const pct = score / 100;
  const col = score >= 75 ? "#FF8C42" : score >= 50 ? "#FCD34D" : "#FF6B6B";
  return (
    <div style={{ position:"relative", width:46, height:46 }}>
      <svg width={46} height={46} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={23} cy={23} r={r} fill="none" stroke="#1E2640" strokeWidth={3} />
        <circle cx={23} cy={23} r={r} fill="none" stroke={col} strokeWidth={3}
          strokeDasharray={`${c * pct} ${c * (1-pct)}`}
          strokeLinecap="round"
          style={{ transition:"stroke-dasharray 1s ease" }}
        />
      </svg>
      <div style={{
        position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:11, fontWeight:800, color:"#F1F5F9", fontFamily:"'DM Mono', monospace",
      }}>
        {score}
      </div>
    </div>
  );
};

// ─── IA TAB ───────────────────────────────────────────────────────────────────
const IATab = ({ mode, period, csvData }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const buildContext = () => {
    let ctx = `Tu es une assistante virtuelle experte en e-commerce. Analyse ces données KPI de la boutique FlowBoard.\n\n`;
    ctx += `Période actuelle : ${mode === "weekly" ? "Semaine" : "Mois"} ${period + 1}\n\n`;
    Object.entries(DEMO).forEach(([tab, data]) => {
      const d = data[mode === "weekly" ? "weekly" : "monthly"];
      ctx += `=== ${tab.toUpperCase()} ===\n`;
      ctx += JSON.stringify(d[period]) + "\n";
    });
    if (csvData?.length) {
      ctx += `\n=== DONNÉES CSV IMPORTÉES ===\n`;
      ctx += JSON.stringify(csvData.slice(0, 5));
    }
    ctx += `\n\nDonne une analyse concise (5-7 points) avec des recommandations actionables. Utilise des emojis. Sois direct et pragmatique.`;
    return ctx;
  };

  const analyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          messages:[{ role:"user", content: buildContext() }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "Aucune réponse";
      setResult(text);
    } catch(e) {
      setError("Erreur lors de l'analyse. Vérifiez votre connexion.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding:"0 16px 24px" }}>
      <div style={{
        background:"#0D1120", border:"1px solid #FF8C4230", borderRadius:16,
        padding:20, marginBottom:16, textAlign:"center",
      }}>
        <div style={{ fontSize:40, marginBottom:8 }}>🤖</div>
        <div style={{ color:"#F1F5F9", fontWeight:700, fontSize:16, marginBottom:6 }}>Analyse IA</div>
        <div style={{ color:"#64748B", fontSize:13, lineHeight:1.5, marginBottom:20 }}>
          Claude analyse vos KPIs et génère des recommandations personnalisées pour cette période.
        </div>
        <button
          onClick={analyze}
          disabled={loading}
          style={{
            background: loading ? "#1E2640" : "linear-gradient(135deg, #FF8C42, #E06A1A)",
            color: loading ? "#64748B" : "#07090F",
            border:"none", borderRadius:12, padding:"13px 32px",
            fontSize:14, fontWeight:800, cursor: loading ? "not-allowed" : "pointer",
            transition:"all 0.2s", width:"100%",
            letterSpacing:"0.3px",
          }}
        >
          {loading ? "⏳ Analyse en cours..." : "⚡ Analyser mes KPIs"}
        </button>
      </div>

      {error && (
        <div style={{ background:"#FF6B6B15", border:"1px solid #FF6B6B40", borderRadius:12, padding:16, color:"#FF6B6B", fontSize:13 }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{
          background:"#0D1120", border:"1px solid #FF8C4230", borderRadius:16, padding:20,
          animation:"fadeIn 0.4s ease",
        }}>
          <div style={{ color:"#FF8C42", fontWeight:700, fontSize:14, marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
            <span>✨</span> Analyse FlowBoard
          </div>
          <div style={{
            color:"#CBD5E1", fontSize:13.5, lineHeight:1.7, whiteSpace:"pre-wrap",
            fontFamily:"inherit",
          }}>
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState("weekly");      // weekly | monthly
  const [period, setPeriod] = useState(5);          // 0-5 index
  const [tab, setTab] = useState("ventes");
  const [csvData, setCsvData] = useState(null);
  const [csvStatus, setCsvStatus] = useState("loading"); // loading | ok | error

  const maxPeriod = mode === "weekly" ? 5 : 5;
  const labels = mode === "weekly" ? WEEKS : MONTHS;

  // Fetch CSV on mount
  useEffect(() => {
    const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vThsNioRmX5xVw-ThB1An0oTn0yvq-rHTLTqDZglfBVu4Lt3nitUZGTyT1LdhDIIw/pub?output=csv";
    fetch(CSV_URL)
      .then(r => r.text())
      .then(text => {
        const parsed = parseCSV(text);
        setCsvData(parsed);
        setCsvStatus("ok");
      })
      .catch(() => setCsvStatus("error"));
  }, []);

  const health = getHealthScore(mode, period);
  const currentTabData = DEMO[tab];

  const renderKpiTab = () => {
    const data = currentTabData[mode === "weekly" ? "weekly" : "monthly"];
    const kpis = currentTabData.kpis;
    const current = data[period];
    const chartKey = kpis[0].chartKey;

    return (
      <div style={{ padding:"0 16px 24px" }}>
        {/* KPI Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
          {kpis.map(kpi => (
            <KpiCard
              key={kpi.key}
              kpi={kpi}
              value={current[kpi.key]}
              trend={getTrend(data, kpi.key, period)}
              unit={kpi.unit}
            />
          ))}
        </div>

        {/* Chart */}
        <div style={{
          background:"#0D1120", borderRadius:16, padding:"16px 8px 8px",
          border:"1px solid #1E2640",
        }}>
          <div style={{ color:"#64748B", fontSize:11, fontWeight:600, paddingLeft:8, marginBottom:12, textTransform:"uppercase", letterSpacing:"0.8px" }}>
            {kpis[0].label} — Évolution
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={data} margin={{ top:0, right:8, left:-20, bottom:0 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF8C42" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF8C42" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2640" />
              <XAxis dataKey="label" tick={{ fill:"#64748B", fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:"#64748B", fontSize:10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={chartKey}
                stroke="#FF8C42"
                strokeWidth={2.5}
                fill="url(#grad)"
                dot={{ fill:"#FF8C42", strokeWidth:0, r:3 }}
                activeDot={{ r:5, fill:"#FF8C42", stroke:"#07090F", strokeWidth:2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight:"100vh",
      background:"#07090F",
      fontFamily:"'DM Sans', 'Inter', sans-serif",
      maxWidth:430,
      margin:"0 auto",
      position:"relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div style={{
        position:"sticky", top:0, zIndex:100,
        background:"#07090Fee",
        backdropFilter:"blur(12px)",
        borderBottom:"1px solid #1E2640",
        padding:"12px 16px",
      }}>
        {/* Row 1: Logo + Health + Client */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:18, fontWeight:900, color:"#FF8C42", letterSpacing:"-0.5px" }}>Flow</span>
              <span style={{ fontSize:18, fontWeight:900, color:"#F1F5F9", letterSpacing:"-0.5px" }}>Board</span>
              {csvStatus === "ok" && <span style={{ fontSize:9, background:"#FF8C4220", color:"#FF8C42", padding:"2px 6px", borderRadius:10, fontWeight:600 }}>CSV ✓</span>}
              {csvStatus === "loading" && <span style={{ fontSize:9, color:"#64748B", animation:"pulse 1.5s infinite" }}>sync...</span>}
            </div>
            <div style={{ fontSize:11, color:"#64748B", marginTop:1 }}>Boutique Élégance</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:9, color:"#64748B", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.5px" }}>Santé</div>
              <div style={{ fontSize:9, color: health >= 75 ? "#FF8C42" : health >= 50 ? "#FCD34D" : "#FF6B6B", fontWeight:700 }}>
                {health >= 75 ? "Excellent" : health >= 50 ? "Correct" : "Attention"}
              </div>
            </div>
            <HealthRing score={health} />
          </div>
        </div>

        {/* Row 2: Mode toggle + Period nav */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          {/* Mode toggle */}
          <div style={{ display:"flex", background:"#0D1120", borderRadius:10, padding:3, border:"1px solid #1E2640" }}>
            {["weekly","monthly"].map(m => (
              <button key={m} onClick={() => { setMode(m); setPeriod(5); }}
                style={{
                  background: mode === m ? "#FF8C42" : "transparent",
                  color: mode === m ? "#07090F" : "#64748B",
                  border:"none", borderRadius:8, padding:"5px 12px",
                  fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.2s",
                }}>
                {m === "weekly" ? "Semaine" : "Mois"}
              </button>
            ))}
          </div>

          {/* Period nav */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button
              onClick={() => setPeriod(p => Math.max(0, p - 1))}
              disabled={period === 0}
              style={{
                background:"#0D1120", border:"1px solid #1E2640", color: period === 0 ? "#2A3555" : "#94A3B8",
                borderRadius:8, width:30, height:30, cursor: period === 0 ? "default" : "pointer",
                fontSize:16, display:"flex", alignItems:"center", justifyContent:"center",
              }}>
              ‹
            </button>
            <div style={{
              background:"#0D1120", border:"1px solid #1E2640", borderRadius:8,
              padding:"4px 12px", minWidth:54, textAlign:"center",
              color:"#FF8C42", fontSize:13, fontWeight:700, fontFamily:"'DM Mono', monospace",
            }}>
              {labels[period]}
            </div>
            <button
              onClick={() => setPeriod(p => Math.min(maxPeriod, p + 1))}
              disabled={period === maxPeriod}
              style={{
                background:"#0D1120", border:"1px solid #1E2640", color: period === maxPeriod ? "#2A3555" : "#94A3B8",
                borderRadius:8, width:30, height:30, cursor: period === maxPeriod ? "default" : "pointer",
                fontSize:16, display:"flex", alignItems:"center", justifyContent:"center",
              }}>
              ›
            </button>
          </div>
        </div>
      </div>

      {/* ── TABS ───────────────────────────────────────────────── */}
      <div style={{
        display:"flex", overflowX:"auto", padding:"12px 16px 0",
        gap:8, scrollbarWidth:"none",
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              flex:"0 0 auto",
              background: tab === t.id ? "#FF8C42" : "#0D1120",
              color: tab === t.id ? "#07090F" : "#64748B",
              border: `1px solid ${tab === t.id ? "#FF8C42" : "#1E2640"}`,
              borderRadius:10, padding:"7px 14px",
              fontSize:13, fontWeight:700, cursor:"pointer",
              transition:"all 0.2s", display:"flex", alignItems:"center", gap:5,
              whiteSpace:"nowrap",
            }}>
            <span>{t.label}</span>
            <span style={{ fontSize:11 }}>{t.name}</span>
          </button>
        ))}
      </div>

      {/* ── CONTENT ────────────────────────────────────────────── */}
      <div style={{ paddingTop:16, animation:"fadeIn 0.3s ease" }} key={`${tab}-${mode}-${period}`}>
        {tab === "ia"
          ? <IATab mode={mode} period={period} csvData={csvData} />
          : renderKpiTab()
        }
      </div>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <div style={{ textAlign:"center", padding:"8px 16px 24px", color:"#2A3555", fontSize:11 }}>
        FlowBoard · Assistante Virtuelle Pro
      </div>
    </div>
  );
}
