// The "data chaos" windows: a spreadsheet, a CSV export, a mail thread and a database query.
// Shared by scene 1 (close-up cuts, then scattered) and scene 2 (they become data sources).
import React from 'react';
import {C, F} from '../kit';

export const WW = 640, WH = 400;

const Chrome: React.FC<{title: string; icon: string; tint: string; children: React.ReactNode}> = ({title, icon, tint, children}) => (
  <div style={{width: WW, height: WH, boxSizing: 'border-box', borderRadius: 14, overflow: 'hidden', background: '#fff', border: `1px solid ${C.line}`, boxShadow: '0 40px 90px -30px rgb(0 0 0 / 0.65)', fontFamily: F.sans}}>
    <div style={{height: 44, background: C.frost, borderBottom: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px'}}>
      <div style={{display: 'flex', gap: 7}}>{[0, 1, 2].map((i) => <span key={i} style={{width: 11, height: 11, borderRadius: '50%', background: '#c9d4df'}} />)}</div>
      <span style={{marginLeft: 8, width: 22, height: 22, borderRadius: 5, background: tint, color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono}}>{icon}</span>
      <span style={{fontFamily: F.mono, fontSize: 16, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{title}</span>
    </div>
    <div style={{position: 'relative', height: WH - 44}}>{children}</div>
  </div>
);

const Tag: React.FC<{children: React.ReactNode; x: number; y: number; show: number}> = ({children, x, y, show}) => (
  <div style={{position: 'absolute', left: x, top: y, opacity: show, transform: `scale(${0.7 + 0.3 * show})`, transformOrigin: 'left center', fontFamily: F.mono, fontSize: 15, fontWeight: 500, color: C.danger, background: '#fdecea', border: '1px solid #f3b8b1', padding: '4px 10px', borderRadius: 999, whiteSpace: 'nowrap'}}>{children}</div>
);

// ---------- 1. spreadsheet ----------
const SHEET = [
  ['Konto', 'Jan', 'Feb', 'Mar', 'Q1 i alt'],
  ['Omsætning', '3.412', '3.598', '3.904', '10.914'],
  ['Vareforbrug', '-2.081', '-2.244', '-2.390', '#REF!'],
  ['Dækningsbidrag', '1.331', '1.354', '1.514', '#REF!'],
  ['Lønninger', '-612', '-618', '-?', '-1.230'],
  ['Omsætning (rettet)', '3.398', '3.598', '3.911', '10.907'],
  ['Note: se ark 7', '', '', '', ''],
];
export const Spreadsheet: React.FC<{tag?: number}> = ({tag = 0}) => (
  <Chrome title="Budget_2026_v4_FINAL (2).xlsx" icon="X" tint="#2f7d55">
    <div style={{display: 'grid', gridTemplateColumns: '40px 180px repeat(4, 1fr)', fontSize: 16, fontVariantNumeric: 'tabular-nums'}}>
      {['', 'A', 'B', 'C', 'D', 'E'].map((h, i) => <div key={i} style={{background: C.frost, borderRight: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, color: C.muted, textAlign: 'center', padding: '5px 0', fontSize: 14}}>{h}</div>)}
      {SHEET.map((row, r) => (
        <React.Fragment key={r}>
          <div style={{background: C.frost, borderRight: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, color: C.muted, textAlign: 'center', padding: '9px 0', fontSize: 14}}>{r + 1}</div>
          {row.map((c, i) => (
            <div key={i} style={{borderRight: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, padding: '9px 10px', textAlign: i ? 'right' : 'left', whiteSpace: 'nowrap', overflow: 'hidden', fontWeight: r === 0 ? 600 : 400, color: c.includes('#') || c.includes('?') ? C.danger : C.ink, background: r === 5 ? '#fff6d6' : c.includes('#') ? '#fdecea' : '#fff'}}>{c}</div>
          ))}
        </React.Fragment>
      ))}
    </div>
    <Tag x={360} y={300} show={tag}>To versioner af omsætningen</Tag>
  </Chrome>
);

// ---------- 2. CSV export from the ERP ----------
const CSV = [
  'Debitornr;Navn;Saldo;Forfald',
  '10482;Hansen A/S;184.220,00;14-11-2026',
  '10482;HANSEN APS;184.220,00;14-11-2026',
  '10517;Nordtrafik ApS;62.100,50;',
  '10533;Fjord Foods A/S;-1.240,00;30-10-2026',
  '10541;Bech & Co;"98.400";01-12-2026',
  '10541;Bech og Co.;98400;01.12.26',
];
export const CsvExport: React.FC<{tag?: number}> = ({tag = 0}) => (
  <Chrome title="Debitorposter_eksport_ERP.csv" icon="≡" tint="#5b6b7d">
    <div style={{padding: '16px 20px', fontFamily: F.mono, fontSize: 17, lineHeight: 1.85, color: C.ink, whiteSpace: 'pre'}}>
      {CSV.map((l, i) => <div key={i} style={{color: i === 0 ? C.muted : C.ink, background: i === 2 || i === 6 ? '#fdecea' : undefined, margin: '0 -8px', padding: '0 8px'}}>{l}</div>)}
    </div>
    <Tag x={380} y={300} show={tag}>Dubletter</Tag>
  </Chrome>
);

// ---------- 3. mail thread with attachments ----------
export const MailThread: React.FC<{tag?: number}> = ({tag = 0}) => (
  <Chrome title="Indbakke" icon="@" tint="#3d6fa8">
    <div style={{padding: '18px 22px'}}>
      <div style={{fontWeight: 650, fontSize: 22, color: C.ink}}>SV: VS: SV: Tal til bestyrelsesmødet</div>
      <div style={{fontSize: 15, color: C.muted, marginTop: 6}}>Fra: Økonomi · Til: Ledelsen · 7 svar</div>
      <div style={{fontSize: 17, color: C.ink, marginTop: 16, lineHeight: 1.5}}>Hej, jeg har rettet tallene igen. Brug venligst den nyeste fil – den anden er forkert. Salg har en tredje version…</div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18}}>
        {['Salg_Q3_rettet.xlsx', 'Salg_Q3_rettet_NY.xlsx', 'Salg_Q3_endelig_v2.xlsx'].map((f) => (
          <div key={f} style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: F.mono, fontSize: 15, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 8, padding: '7px 12px', width: 'fit-content'}}>
            <span style={{width: 16, height: 16, borderRadius: 3, background: '#2f7d55'}} />{f}
          </div>
        ))}
      </div>
    </div>
    <Tag x={400} y={250} show={tag}>Hvilken er den rigtige?</Tag>
  </Chrome>
);

// ---------- 4. database query ----------
export const DbQuery: React.FC<{tag?: number}> = ({tag = 0}) => (
  <Chrome title="Forespørgsel – salgsdatabase" icon="DB" tint="#6a4fa0">
    <div style={{padding: '16px 20px', fontFamily: F.mono, fontSize: 17, color: C.ink, borderBottom: `1px solid ${C.line}`}}>
      <span style={{color: '#3d6fa8'}}>SELECT</span> * <span style={{color: '#3d6fa8'}}>FROM</span> dbo.Salg_gammel<br />
      <span style={{color: '#3d6fa8'}}>WHERE</span> Aar = 2026 <span style={{color: C.muted}}>-- spørg Lars</span>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', fontSize: 15, fontFamily: F.mono}}>
      {['OrdreID', 'KundeID', 'Beløb', 'Dato', '55821', '10482', '12450', 'NULL', '55822', 'NULL', '8 120', '2026-11-03', '55823', '10533', '-310', '03/11/26', '55824', '10541', '98400', '2026-11-04'].map((c, i) => (
        <div key={i} style={{padding: '7px 14px', borderBottom: `1px solid ${C.frost}`, color: i < 4 ? C.muted : c === 'NULL' ? C.danger : C.ink, fontWeight: i < 4 ? 600 : 400}}>{c}</div>
      ))}
    </div>
    <div style={{position: 'absolute', left: 20, bottom: 16, fontFamily: F.mono, fontSize: 14, color: C.muted}}>Forespørgsel kørte i 00:04:12</div>
    <Tag x={380} y={268} show={tag}>Manglende værdier</Tag>
  </Chrome>
);

export const WINDOWS = [Spreadsheet, CsvExport, MailThread, DbQuery];
/** Where the four windows float once the camera pulls back (scene 1 end / scene 2 start): x, y (top-left at scale 1), rotation, scale */
export const SCATTER: {x: number; y: number; r: number; s: number}[] = [
  {x: 1000, y: 70, r: -4, s: 0.62},
  {x: 1330, y: 300, r: 5, s: 0.58},
  {x: 960, y: 520, r: 3, s: 0.6},
  {x: 1320, y: 690, r: -5, s: 0.56},
];
