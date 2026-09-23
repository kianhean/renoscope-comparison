import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDown,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  FileText,
  Filter,
  Info,
  Leaf,
  Minus,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  TriangleAlert,
  X,
  Zap,
} from 'lucide-react';
import './styles.css';

// The proxy prices are the limited-basket illustration in comparison.md, not bids or all-in totals.
const DEFAULT_TILE_PRICE_PSF = 6;
const CX_TILE_CAP_PSF = 6;
const POLIBUILD_TILE_CAP_PSF = 5.80;
const quoteData = [
  {
    id: 'cx', name: 'CX Reno', short: 'CX', ref: 'CXE QT26220', date: '23 Sep 2026',
    color: '#ef7c5d', bg: '#fff1ec', base: 85530, printed: 93227.70, gap: 38690, proxy: 124220,
    tax: '9% GST included in printed total',
    verdict: 'Lowest printed total; substantial gaps',
    summary: 'The $93,227.70 total includes GST. Aircon, balcony, study enclosure and scaffold are absent; CX labels some Main Ensuite work “Bathroom” and some “Main Ensuite,” so reconcile the full scope.',
    strengths: ['Electrical allowance $4,200', '1-year workmanship warranty', 'Whole-unit vinyl overlay'],
    risks: ['Main Ensuite work is split across differently labelled lines', 'Aircon, PE and scaffolding not quoted', 'Study enclosure, shelves and balcony not quoted'],
    details: {
      'Main Ensuite': 'Quote labels some work “Bathroom” and other work “Main Ensuite”; reconcile the full one-room scope.',
      'Electrical': '$4,200: about 20 light/fan points, 20 double sockets, 20 light installs and heater switch; fixtures extra.',
      'Aircon': 'Not quoted',
      'Flooring': 'Overlay vinyl ~1,200 sqft; no full parquet restoration',
      'Carpentry': 'Approximately $39,000; study shelves not listed',
      'Payments': '10 / 40 / 40 / 10',
      'Warranty': '1 year workmanship',
    },
    notes: ['Only contractor with explicit GST in its PDF.', 'The $4,200 electrical amount is not a 20-point cap: it lists about 20 lighting points plus 20 sockets.', 'Quote: cx reno quote.pdf, pp. 1–3.'],
  },
  {
    id: 'kangseng', name: 'Kang Sheng', short: 'KS', ref: 'A260043R01', date: '23 Sep 2026',
    color: '#7385ae', bg: '#eef1fa', base: 104370, printed: 104370, gap: 20000, proxy: 124370,
    tax: 'No additional GST assumed (homeowner)',
    verdict: 'Three-zone aircon; tiles and electrical extra',
    summary: 'Includes three aircon zones, an estimated scaffold allowance and $49,420 carpentry. Every tile is excluded and electrical has no priced total. The quote’s “L3 Bathroom” and “Main Ensuite” labels both refer to the home’s only bathroom.',
    strengths: ['Main, lounge + study aircon $8,160', 'Scaffold/MEWP $6,300 estimated within quote', 'Study shelves $5,180 + extensive cabinetry'],
    risks: ['All Main Ensuite tile materials extra at selected price × measured sqft', 'Electrical and PE unpriced', 'Hidden-storage cabinet and two bi-fold doors TBC'],
    details: {
      'Main Ensuite': 'Wet-work lines say “L3 Bathroom”; fittings/carpentry say “Main Ensuite”. Both labels refer to this one room; tile supply extra.',
      'Electrical': 'Rates only; $0 in total. Concealed work: +$700–$1,600 or +40% (clauses conflict).',
      'Aircon': '$8,160 Mitsubishi: main room, lounge and study; stand included',
      'Flooring': 'Resand/patch lounge parquet; 500 sqft bedroom vinyl $4,180; self-levelling optional $1,450',
      'Carpentry': '$49,420; hidden-storage cabinet $2,850 and two ~$530 bi-folds TBC',
      'Payments': '30 / 20 / 15 / 20 / 10 / 5 (85% by carpentry start)',
      'Warranty': 'General works not stated; aircon 5-year compressor, 1-year parts/labour',
    },
    sections: [
      ['Preliminaries and removal', 13830], ['Interior fit-out', 30300],
      ['M&E (incl. $8,160 aircon)', 10820], ['Carpentry', 49420],
    ],
    notes: [
      'Use “Main Ensuite” throughout revised documentation; Kang Sheng’s source labels are “L3 Bathroom” for wet work and “Main Ensuite” for fittings/carpentry.',
      'All tile purchase is excluded: use your chosen per-sqft tile price × measured Main Ensuite floor/wall tile area (default $6/psf). 300 × 600 mm laying is assumed. PE is $0/unpriced, despite an “Estimate” line.',
      'TBC cabinet $2,850 + two bi-fold doors ~$530 each = $3,910 extra if chosen; optional levelling adds $1,450.',
      'Vinyl says 500 sqft × $8 = $4,000 but line total is $4,180: ask about the $180 difference.',
      'Signing is treated as contract acceptance; cancellation clause says 30%. Owner pays utilities during works. Valid 14 days.',
      'Quote: kangseng.pdf, pp. 1–6.',
    ],
  },
  {
    id: 'polibuild', name: 'Polibuild', short: 'PB', ref: 'Q1/08/26/PB/WT', date: '11 Aug 2026',
    color: '#4f9c93', bg: '#eaf7f4', base: 121128, printed: 121128, gap: 21750, proxy: 142878,
    tax: 'No additional GST assumed (homeowner)',
    verdict: 'Balcony, study floor and two-zone aircon',
    summary: 'Includes Main Ensuite wet works, balcony, study flooring/shelves, two-room aircon and two months of scaffold. Electrical and PE remain unpriced or excluded.',
    strengths: ['Balcony hack and tiling', 'Aircon $8,140 incl. removal', '12-month defects liability period'],
    risks: ['All electrical lines $0', 'PE endorsement excluded', 'Dated 11 Aug; request current pricing'],
    details: {
      'Main Ensuite': 'Hacking, tiling, waterproofing and plumbing quoted',
      'Electrical': 'Per-point rates only; $0 in total; light fixtures TBC',
      'Aircon': '$7,760 master + study, plus $380 cassette removal; bracket/pump/isolator optional',
      'Flooring': 'Polish timber; vinyl in master and study; self-levelling included',
      'Carpentry': '$53,070 incl. $4,410 study shelves and $6,000 storage 1 & 2 (not a new access opening)',
      'Payments': '20 / 30 / 25 / 20 / 5',
      'Warranty': '12-month defects liability period',
    },
    notes: ['Tile retail cap is $5.80/psf; a selection above this may add the difference per Main Ensuite/balcony tile sqft if tile supply is included at that cap. Confirm the mechanism.', 'Certified scaffold $6,000 for two months; $1,300 haulage is not Essenwoods’ lorry-crane service.', 'An optional 10% coordination fee applies to third-party items, not the whole quote.', 'No expiry stated, but the 11 Aug price should be refreshed.', 'Quote: polibuild.pdf, pp. 1–5.'],
  },
  {
    id: 'essenwoods', name: 'Essenwoods', short: 'EW', ref: 'Quotation 8888', date: '19 Sep 2026',
    color: '#c69a46', bg: '#fff7e6', base: 162750, printed: 162750, gap: 21640, proxy: 184390,
    tax: 'No additional GST assumed (homeowner)',
    verdict: 'Detailed Main Ensuite and glazed study design',
    summary: 'Prices detailed Main Ensuite works, balcony, glazed study enclosure and PE endorsement. Aircon, scaffold and electrical totals remain outside the printed price.',
    strengths: ['Glazed study enclosure $7,000', 'PE endorsement $3,000', 'Detailed Main Ensuite and balcony work'],
    risks: ['Aircon and scaffold not priced', 'Electrical rates only; no study shelves', '$8,000 bedroom storage estimated'],
    details: {
      'Main Ensuite': 'Hacking, 600 × 600 mm tile laying, waterproofing and cabinetry',
      'Electrical': 'Per-point rates only; no priced total; lighting fixtures excluded',
      'Aircon': 'Not quoted; direct contractor appointment envisaged',
      'Flooring': 'Revarnish lounge parquet; bedroom vinyl; no explicit study floor',
      'Carpentry': 'Approximately $58,000 incl. $8,000 provisional bedroom storage; no study shelves',
      'Payments': '10 / 40 / 30 / 15 / 5 (printed in page footers)',
      'Warranty': 'Not stated',
    },
    notes: ['$4,250 hidden storage is a new opening and door/frame, not cabinetry.', '$7,000 lorry-crane haulage is included; further crane, boom lift and scaffold are to be discussed.', 'PE $3,000 excludes drawings; sanitary installation beyond listed work may be extra. Valid one month.', 'Quote: essenwoods.pdf, pp. 1–4.'],
  },
];

const comparisonRows = [
  { group: 'Price & tax', label: 'Printed quote total', key: 'printed', money: true },
  { group: 'Price & tax', label: 'Limited-basket additions', key: 'gap', money: true },
  { group: 'Price & tax', label: 'Limited-basket base', key: 'proxy', money: true },
  { group: 'Price & tax', label: 'Illustrative payable proxy', key: 'payable', money: true },
  { group: 'Price & tax', label: 'Tile price assumption', values: { cx: 'Allowance up to $6/psf; higher selections may cost extra', kangseng: 'All tile materials extra at selected $/psf', polibuild: 'Potential upgrade above $5.80/psf cap', essenwoods: 'Tile-supply allowance unclear' }, diff: true },
  { group: 'Price & tax', label: 'GST on printed quote', key: 'tax', diff: true },
  { group: 'Main Ensuite · only bathroom', label: 'Wet-work scope', values: { cx: 'Lines labelled “Bathroom” + “Main Ensuite”; confirm full scope', kangseng: 'Lines labelled “L3 Bathroom” + “Main Ensuite”; one room', polibuild: 'Main Ensuite wet works quoted', essenwoods: 'Main Ensuite wet works quoted' }, statuses: { cx: 'partial', kangseng: 'included', polibuild: 'included', essenwoods: 'included' }, diff: true },
  { group: 'Main Ensuite · only bathroom', label: 'Tile supply', values: { cx: 'Up to $6/psf indicated', kangseng: 'All tile purchases excluded; VO', polibuild: 'Up to $5.80/psf indicated; confirm', essenwoods: '600 × 600 mm; confirm allowance' }, statuses: { cx: 'partial', kangseng: 'excluded', polibuild: 'partial', essenwoods: 'unknown' }, diff: true },
  { group: 'Scope', label: 'Study enclosure', values: { cx: 'No separate glass enclosure', kangseng: 'Full gypsum wall + glass door; no glass panel', polibuild: 'No glass enclosure', essenwoods: 'Half-wall + clear glass + frosted door $7,000' }, statuses: { cx: 'excluded', kangseng: 'partial', polibuild: 'excluded', essenwoods: 'included' }, diff: true },
  { group: 'Scope', label: 'Study shelves / floor', values: { cx: 'No shelves; whole-unit vinyl proposed', kangseng: '$5,180 shelves; floor not explicit', polibuild: '$4,410 shelves + floor included', essenwoods: 'No shelves or explicit study floor' }, statuses: { cx: 'partial', kangseng: 'partial', polibuild: 'included', essenwoods: 'excluded' }, diff: true },
  { group: 'Scope', label: 'Hidden-storage access', values: { cx: 'Not quoted', kangseng: 'Two curved doors; opening unconfirmed', polibuild: 'Storage cabinets; opening unquoted', essenwoods: 'New opening + door/frame $4,250' }, statuses: { cx: 'excluded', kangseng: 'unknown', polibuild: 'partial', essenwoods: 'included' }, diff: true },
  { group: 'Scope', label: 'Hidden-storage cabinet', values: { cx: 'Not quoted', kangseng: '$2,850 TBC; not in total', polibuild: 'Storage 1 & 2 quoted; exact position to confirm', essenwoods: 'Not in $4,250 access line' }, statuses: { cx: 'excluded', kangseng: 'unknown', polibuild: 'unknown', essenwoods: 'excluded' }, diff: true },
  { group: 'Scope', label: 'Aircon', key: 'details.Aircon', statuses: { cx: 'excluded', kangseng: 'included', polibuild: 'included', essenwoods: 'excluded' }, diff: true },
  { group: 'Scope', label: 'Scaffold / lifting', values: { cx: 'Not quoted', kangseng: '$6,300 estimate within quote; duration TBC', polibuild: '$6,000 certified, two months', essenwoods: 'Scaffold extra; $7,000 lorry crane included' }, statuses: { cx: 'excluded', kangseng: 'partial', polibuild: 'included', essenwoods: 'unknown' }, diff: true },
  { group: 'Scope', label: 'Balcony hack + floor', values: { cx: 'Not quoted', kangseng: 'Not quoted', polibuild: 'Included', essenwoods: 'Included $7,000' }, statuses: { cx: 'excluded', kangseng: 'excluded', polibuild: 'included', essenwoods: 'included' }, diff: true },
  { group: 'Scope', label: 'PE endorsement', values: { cx: 'Not quoted', kangseng: 'Unpriced; excluded by terms', polibuild: 'Excluded', essenwoods: '$3,000 included; drawings excluded' }, statuses: { cx: 'excluded', kangseng: 'unknown', polibuild: 'excluded', essenwoods: 'partial' }, diff: true },
  { group: 'Scope', label: 'Electrical', key: 'details.Electrical', statuses: { cx: 'partial', kangseng: 'unknown', polibuild: 'unknown', essenwoods: 'unknown' }, diff: true },
  { group: 'Finishes', label: 'Flooring approach', key: 'details.Flooring', diff: true },
  { group: 'Finishes', label: 'Carpentry', key: 'details.Carpentry', diff: true },
  { group: 'Terms', label: 'Payments (%)', key: 'details.Payments', diff: true },
  { group: 'Terms', label: 'General-work warranty', key: 'details.Warranty', statuses: { cx: 'included', kangseng: 'unknown', polibuild: 'included', essenwoods: 'unknown' }, diff: true },
  { group: 'Terms', label: 'Quote date', key: 'date' },
];

const priorityOptions = [
  { id: 'price', label: 'Lowest printed price', quoteId: 'cx', title: 'Start with CX’s $93,227.70 incl. GST', summary: 'It is the lowest printed obligation, but several major works are missing. CX labels some Main Ensuite items “Bathroom” and others “Main Ensuite”; reconcile the included work.', caveat: 'No balcony, aircon, scaffold, study enclosure or PE in the quoted total.' },
  { id: 'aircon', label: 'Three-zone aircon', quoteId: 'kangseng', title: 'Examine Kang Sheng’s bundled aircon', summary: 'The $104,370 quote includes three zones, $49,420 carpentry and estimated scaffolding. Its “L3 Bathroom” and “Main Ensuite” lines refer to the one bathroom.', caveat: 'Add tile materials at your chosen $/psf; electrical and PE remain unpriced.' },
  { id: 'scope', label: 'Balcony + study floor', quoteId: 'polibuild', title: 'Examine Polibuild’s priced mid-scope', summary: 'Main Ensuite works, balcony, study shelves/floor, two-room aircon and two months of scaffold are in its $121,128 quote.', caveat: 'Refresh the August price and get fixed electrical and PE costs.' },
  { id: 'design', label: 'Main Ensuite + study glass', quoteId: 'essenwoods', title: 'Examine Essenwoods’ detailed design', summary: 'Its $162,750 proposal covers detailed Main Ensuite works, a glazed study and balcony, with PE endorsement.', caveat: 'Aircon, scaffold, study shelving and electrical totals are still missing.' },
];

const askQuestions = [
  'Use Main Ensuite as the only bathroom name; reconcile CX’s differently labelled lines and Kang Sheng’s “L3 Bathroom” lines',
  'Measure Main Ensuite walls + floor and balcony floor tile sqft; price Kang Sheng’s tiles and any uplift above CX/Polibuild caps',
  'Request a point-by-point fixed electrical total, fixtures, concealment, AC isolators and testing',
  'Price the same study enclosure, shelving and floor layout across all four proposals',
  'Separate hidden-storage opening/door costs from cabinet and bi-fold-door costs',
  'Confirm final payable totals (no additional GST assumed for three quotes), PE drawings, permits, scaffold duration and TBC items',
  'Agree defects warranty, variation orders, payment milestones and handover conditions in writing',
];

const money = (value) => {
  const rounded = Math.round((value + Number.EPSILON) * 100) / 100;
  return `$${rounded.toLocaleString('en-SG', { minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2, maximumFractionDigits: 2 })}`;
};
const valueFor = (row, quote) => row.values?.[quote.id] ?? (row.money
  ? `${money(quote[row.key])}${row.key === 'proxy' ? quote.proxySuffix ?? '' : row.key === 'payable' ? quote.payableSuffix ?? '' : ''}`
  : row.key.split('.').reduce((value, key) => value?.[key], quote));

function StatusMark({ status }) {
  if (status === 'included') return <Check size={14} aria-hidden="true" />;
  if (status === 'partial') return <Minus size={14} aria-hidden="true" />;
  if (status === 'excluded') return <X size={14} aria-hidden="true" />;
  if (status === 'unknown') return <CircleHelp size={14} aria-hidden="true" />;
  return null;
}

function App() {
  const [selected, setSelected] = useState(quoteData.map((quote) => quote.id));
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const [expanded, setExpanded] = useState('kangseng');
  const [checkedQuestions, setCheckedQuestions] = useState([]);
  const [priority, setPriority] = useState('aircon');
  const [tilePrice, setTilePrice] = useState(String(DEFAULT_TILE_PRICE_PSF));
  const [mainEnsuiteTileArea, setMainEnsuiteTileArea] = useState('');
  const [balconyTileArea, setBalconyTileArea] = useState('');

  // No square footage is stated in the PDFs. Empty fields leave the proxy at its minimum.
  const chosenTilePrice = tilePrice === '' ? DEFAULT_TILE_PRICE_PSF : Number(tilePrice);
  const mainEnsuiteTileSqft = mainEnsuiteTileArea === '' ? 0 : Number(mainEnsuiteTileArea);
  const balconySqft = balconyTileArea === '' ? 0 : Number(balconyTileArea);
  const cxUpgradeRate = Math.max(0, chosenTilePrice - CX_TILE_CAP_PSF);
  const polibuildUpgradeRate = Math.max(0, chosenTilePrice - POLIBUILD_TILE_CAP_PSF);
  const modeledQuotes = quoteData.map((quote) => {
    const tileAddition = quote.id === 'cx' ? cxUpgradeRate * mainEnsuiteTileSqft
      : quote.id === 'kangseng' ? chosenTilePrice * mainEnsuiteTileSqft
        : quote.id === 'polibuild' ? polibuildUpgradeRate * (mainEnsuiteTileSqft + balconySqft) : 0;
    const rate = quote.id === 'cx' ? cxUpgradeRate : quote.id === 'kangseng' ? chosenTilePrice : quote.id === 'polibuild' ? polibuildUpgradeRate : 0;
    const missingArea = quote.id === 'polibuild' ? mainEnsuiteTileArea === '' && balconyTileArea === '' ? '(B+A)' : mainEnsuiteTileArea === '' ? 'B' : balconyTileArea === '' ? 'A' : '' : mainEnsuiteTileArea === '' ? 'B' : '';
    const proxySuffix = rate > 0 && missingArea ? ` + ${money(rate)}×${missingArea}` : '';
    const proxy = quote.proxy + tileAddition;
    const payableSuffix = quote.id === 'cx' && proxySuffix ? ` + 1.09×(${proxySuffix.trim().slice(2)})` : proxySuffix;
    return { ...quote, gap: quote.gap + tileAddition, proxy, payable: quote.id === 'cx' ? Math.round(proxy * 1.09 * 100) / 100 : proxy, proxySuffix, payableSuffix };
  });
  const cxTileTopup = cxUpgradeRate * mainEnsuiteTileSqft;
  const kangTileCost = chosenTilePrice * mainEnsuiteTileSqft;
  const polibuildTileTopup = polibuildUpgradeRate * (mainEnsuiteTileSqft + balconySqft);

  const visibleQuotes = useMemo(() => modeledQuotes.filter((quote) => {
    const query = search.toLowerCase();
    const comparisonText = comparisonRows.map((row) => `${row.label} ${valueFor(row, quote)}`).join(' ');
    return (activeTab === 'All' || quote.short === activeTab) && (!query || [quote.name, quote.ref, quote.verdict, quote.summary, ...quote.strengths, ...quote.risks, comparisonText].join(' ').toLowerCase().includes(query));
  }), [activeTab, search, tilePrice, mainEnsuiteTileArea, balconyTileArea]);

  const comparedQuotes = modeledQuotes.filter((quote) => selected.includes(quote.id));
  const activePriority = priorityOptions.find((option) => option.id === priority);
  const focusQuote = quoteData.find((quote) => quote.id === activePriority.quoteId);
  const comparisonGroups = comparisonRows.reduce((groups, row) => {
    const last = groups[groups.length - 1];
    if (!last || last.group !== row.group) groups.push({ group: row.group, rows: [row] });
    else last.rows.push(row);
    return groups;
  }, []);

  const toggleQuote = (id) => setSelected((current) => current.includes(id)
    ? current.length === 1 ? current : current.filter((item) => item !== id)
    : [...current, id]);
  const toggleQuestion = (index) => setCheckedQuestions((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="RenoScope home"><span className="brand-mark"><Sparkles size={16} strokeWidth={2.5} /></span><span>reno<span>scope</span></span></a>
        <div className="topbar-project"><span>PROJECT 01</span><b>Renovation quote review</b></div>
        <nav className="topnav" aria-label="Main navigation"><a href="#comparison">Compare</a><a href="#scope">Scope audit</a><a href="#decision">Decision notes</a></nav>
        <button className="export-button" type="button" onClick={() => window.print()} aria-label="Print comparison"><FileText size={15} /> Export view</button>
      </header>

      <main id="top">
        <section className="hero section-wrap">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> RENOVATION INTELLIGENCE <span className="eyebrow-line" /> 23 SEP 2026</div>
            <h1>A clearer way<br /><em>to choose.</em></h1>
            <p className="hero-intro">Four quotes, different scope boundaries. Compare what is actually priced, what remains uncertain and what to ask before signing.</p>
            <div className="hero-actions"><a href="#comparison" className="primary-button">Explore the comparison <ArrowDown size={16} /></a><span className="updated-note"><span className="live-dot" /> Updated from 4 contractor quotes</span></div>
          </div>
          <div className="hero-insight">
            <div className="insight-top"><span>NEW QUOTE · KANG SHENG</span><Info size={18} /></div>
            <div className="insight-choice"><span className="choice-number">04</span><div><strong>$104,370</strong><span>Printed total · no extra GST assumed</span></div><ArrowUpRight size={18} /></div>
            <div className="insight-divider" />
            <div className="insight-metric"><span>Aircon included</span><strong>3 zones</strong></div>
            <ul className="insight-list"><li>Scaffold $6,300 estimate is within the price</li><li>Tile material extra at your selected $/sqft</li><li>One bathroom: Main Ensuite (quote labels include “L3 Bathroom”)</li></ul>
          </div>
        </section>

        <section className="stats-strip section-wrap" aria-label="Project summary">
          <div className="stat"><span className="stat-icon"><BarChart3 size={17} /></span><div><b>4</b><span>quotes reviewed</span></div></div>
          <div className="stat"><span className="stat-icon"><Zap size={17} /></span><div><b>3</b><span>electrical totals unpriced</span></div></div>
          <div className="stat"><span className="stat-icon"><ShieldAlert size={17} /></span><div><b>3</b><span>quotes with no extra GST assumed</span></div></div>
          <div className="stat highlight-stat"><span className="stat-icon"><Leaf size={17} /></span><div><b>$7,500</b><span>electrical planning allowance</span></div></div>
        </section>

        <section className="workspace section-wrap" id="comparison">
          <div className="section-heading"><div><div className="section-kicker">01 / SIDE BY SIDE</div><h2>Compare the quote.<br /><em>See the gaps.</em></h2></div><p>Printed totals and a limited priced-gap model are shown separately. CX has quoted GST; for the other three, this comparison assumes no additional GST is payable.</p></div>
          <div className="decision-lens" aria-labelledby="decision-lens-title">
            <div className="lens-controls"><span className="section-kicker">CHOOSE AN ANGLE TO INVESTIGATE</span><h3 id="decision-lens-title">Which scope matters most?</h3><div className="priority-options">{priorityOptions.map((option) => <button key={option.id} type="button" className={priority === option.id ? 'active' : ''} onClick={() => setPriority(option.id)} aria-pressed={priority === option.id}><ClipboardCheck size={17} /><span>{option.label}</span></button>)}</div></div>
            <div className="lens-result" style={{ '--result-color': focusQuote.color, '--result-bg': focusQuote.bg }}><div className="lens-result-head"><span className="vendor-avatar">{focusQuote.short}</span><span>QUOTE TO EXAMINE · NOT A RECOMMENDATION</span></div><h3>{activePriority.title}</h3><p>{activePriority.summary}</p><div className="lens-caveat"><TriangleAlert size={16} /><span>{activePriority.caveat}</span></div></div>
          </div>
          <div className="filter-bar">
            <label className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a contractor or criterion..." aria-label="Search quotes and criteria" /></label>
            <div className="filter-pills" aria-label="Filter contractor cards">{['All', ...quoteData.map((quote) => quote.short)].map((tab) => <button key={tab} type="button" className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)} aria-pressed={activeTab === tab}>{tab}</button>)}</div>
            <button className={`difference-toggle ${differencesOnly ? 'on' : ''}`} type="button" onClick={() => setDifferencesOnly(!differencesOnly)} aria-pressed={differencesOnly}><span className="toggle-track"><span /></span> Differences only</button>
          </div>
          <div className="selection-row"><span><Filter size={14} /> Comparing <b>{selected.length} of {quoteData.length}</b> quotes</span><div className="selected-chips">{comparedQuotes.map((quote) => <button key={quote.id} type="button" style={{ '--chip-color': quote.color }} onClick={() => toggleQuote(quote.id)} aria-label={`Remove ${quote.name} from comparison`}>{quote.short}<X size={12} /></button>)}<span className="selection-hint">Use the card buttons to add or remove a quote</span></div></div>

          <div className="quote-cards" aria-label="Quote selection">
            {visibleQuotes.map((quote) => <article className={`quote-card ${selected.includes(quote.id) ? 'selected' : ''}`} key={quote.id}>
              <div className="quote-card-head"><div className="vendor-avatar" style={{ background: quote.bg, color: quote.color }}>{quote.short}</div><div><h3>{quote.name}</h3><span>{quote.ref}</span></div><button className="check-button" type="button" onClick={() => toggleQuote(quote.id)} aria-pressed={selected.includes(quote.id)} aria-label={`${selected.includes(quote.id) ? 'Remove' : 'Add'} ${quote.name} ${selected.includes(quote.id) ? 'from' : 'to'} comparison`}>{selected.includes(quote.id) ? <Check size={15} /> : <Plus size={16} />}</button></div>
              <div className="quote-number"><span>Printed quote<small>{quote.tax}</small></span><strong>{money(quote.printed)}</strong></div>
              <div className="quote-tag" style={{ color: quote.color, background: quote.bg }}>+{money(quote.gap)} modelled additions</div>
              <p>{quote.summary}</p><div className="card-proxy">Illustrative payable proxy <b>{money(quote.payable)}{quote.payableSuffix}</b></div>
            </article>)}
            {!visibleQuotes.length && <div className="empty-state"><CircleHelp size={24} /><b>No quotes match that search</b><span>Try a different contractor or search term.</span></div>}
          </div>

          <div className="normalized-panel">
            <div className="panel-label"><span className="section-kicker">LIMITED-BASKET MODEL</span><Info size={15} aria-hidden="true" /></div>
            <div className="normalized-intro"><div><h3>Priced gaps, not full parity.</h3><p>Modelled payable amounts: CX at 9% GST; no additional GST assumed for the other three. Change tile price and measured areas below.</p></div><div className="normalized-note"><TriangleAlert size={15} /><span>Not binding contractor offers</span></div></div>
            <div className="tile-calculator"><div><strong>Main Ensuite tile-material estimate</strong><p>The Main Ensuite is the only bathroom. The PDFs give no measured tile area. Leave an area blank to show its outstanding formula. Default material price is $6/sqft.</p></div><label>Tile price ($/sqft)<input type="number" min="0" step="any" inputMode="decimal" value={tilePrice} onChange={(event) => { if (event.target.value === '' || (Number.isFinite(Number(event.target.value)) && Number(event.target.value) >= 0)) setTilePrice(event.target.value); }} placeholder="Default 6" /></label><label>Main Ensuite floor + walls (sqft)<input type="number" min="0" step="any" inputMode="decimal" value={mainEnsuiteTileArea} onChange={(event) => { if (event.target.value === '' || (Number.isFinite(Number(event.target.value)) && Number(event.target.value) >= 0)) setMainEnsuiteTileArea(event.target.value); }} placeholder="Enter area" /></label><label>Balcony floor (sqft)<input type="number" min="0" step="any" inputMode="decimal" value={balconyTileArea} onChange={(event) => { if (event.target.value === '' || (Number.isFinite(Number(event.target.value)) && Number(event.target.value) >= 0)) setBalconyTileArea(event.target.value); }} placeholder="Enter area" /></label></div>
            <div className="tile-results"><span>Kang Sheng excluded tiles: <strong>{mainEnsuiteTileArea === '' ? `${money(chosenTilePrice)} × Main Ensuite sqft` : `+${money(kangTileCost)}`}</strong></span><span>CX above $6 cap: <strong>{cxUpgradeRate === 0 ? 'No modelled uplift' : mainEnsuiteTileArea === '' ? `${money(cxUpgradeRate)} × Main Ensuite sqft` : `+${money(cxTileTopup)}`}</strong></span><span>Polibuild above $5.80 cap (subject to confirmation): <strong>{polibuildUpgradeRate === 0 ? 'No modelled uplift' : `+${money(polibuildTileTopup)}${modeledQuotes[2].proxySuffix}`}</strong></span><span>Essenwoods’ tile-supply allowance remains unclear.</span></div>
            <div className="normalized-chart">{modeledQuotes.map((quote) => <div className="chart-row" key={quote.id}><div className="chart-name"><span className="chart-dot" style={{ background: quote.color }} />{quote.name}</div><div className="chart-track"><div className="chart-fill" style={{ width: `${Math.min(100, (quote.payable / Math.max(...modeledQuotes.map((item) => item.payable))) * 100)}%`, background: quote.color }}><span>{money(quote.payable)}{quote.proxySuffix ? '+' : ''}</span></div></div><span className="chart-delta">+{money(quote.gap)} gaps</span></div>)}</div>
            <div className="model-note"><strong>What this model assumes:</strong> CX starts from its $85,530 pre-GST base and applies 9% GST to the whole illustrative basket (its printed $93,227.70 already includes GST). Kang Sheng, Polibuild and Essenwoods start from their printed sums and <strong>no additional GST is assumed payable</strong>, per the homeowner; this is not proof of registration status. Gap allowances are $7,500 electrical, $8,140 two-room aircon/removal, $3,000 PE, $6,000 scaffold, $7,000 glazed study, $4,250 new hidden-storage access/door and $7,000 balcony where not already covered. Kang Sheng gets just a <strong>$2,500 minimum study-glass allowance</strong> and <strong>$0 for unresolved hidden-access work</strong>; it already includes three-zone aircon and $6,300 estimated scaffold. Entered tile costs use your chosen $/sqft: Kang Sheng pays the full amount; CX and Polibuild may pay only the amount above their respective $6 and $5.80 caps. Below a cap, no refund is assumed. Tile wastage/delivery, Kang Sheng’s TBC cabinets/doors, study redesign and concealment remain excluded.</div>
          </div>

          <div className="compare-table-wrap"><div className="table-heading"><div><span className="section-kicker">LIVE COMPARISON</span><h3>Scope, terms & inclusions</h3></div><span className="table-note"><Info size={13} /> Status refers to the listed scope, not overall quality</span></div>
            <div className="status-legend" aria-label="Comparison status legend"><span><i className="status-included"><Check size={12} /></i> Quoted</span><span><i className="status-partial"><Minus size={12} /></i> Partial</span><span><i className="status-excluded"><X size={12} /></i> Not quoted</span><span><i className="status-unknown"><CircleHelp size={12} /></i> Needs confirmation</span></div>
            <div className="compare-table" role="table" style={{ '--quote-count': comparedQuotes.length }}>
              <div className="table-row table-header" role="row"><div role="columnheader">Criteria</div>{comparedQuotes.map((quote) => <div role="columnheader" key={quote.id}><span className="table-avatar" style={{ background: quote.bg, color: quote.color }}>{quote.short}</span><span>{quote.name}</span><small>{quote.date}</small></div>)}</div>
              {comparisonGroups.map((group) => { const rows = group.rows.filter((row) => (!differencesOnly || row.diff) && (!search || [row.label, ...comparedQuotes.map((quote) => valueFor(row, quote))].join(' ').toLowerCase().includes(search.toLowerCase()))); if (!rows.length) return null; return <div key={group.group} className="table-group" role="rowgroup"><div className="group-label">{group.group}</div>{rows.map((row) => <div className="table-row" role="row" key={row.label}><div role="cell">{row.label}</div>{comparedQuotes.map((quote) => { const status = row.statuses?.[quote.id]; return <div role="cell" key={quote.id} className={`comparison-cell ${status ? `cell-${status}` : ''}`}><span className="cell-value">{status && <i className={`status-${status}`}><StatusMark status={status} /></i>}<span>{row.money ? <strong className="table-price">{valueFor(row, quote)}</strong> : valueFor(row, quote)}</span></span></div>; })}</div>)}</div>; })}
              {differencesOnly && <div className="diff-note"><Info size={15} /> Showing {comparisonRows.filter((row) => row.diff).length} flagged criteria. Turn off the toggle to see every row.</div>}
            </div>
          </div>
        </section>

        <section className="scope-section section-wrap" id="scope"><div className="section-heading compact-heading"><div><div className="section-kicker">02 / DEEP DIVE</div><h2>What is hiding<br /><em>between the lines?</em></h2></div><p>Open each quote for the included work, exclusions and contract terms behind the headline.</p></div>
          <div className="accordion-list">{quoteData.map((quote, index) => <article className={`accordion-item ${expanded === quote.id ? 'open' : ''}`} key={quote.id}>
            <button className="accordion-trigger" type="button" onClick={() => setExpanded(expanded === quote.id ? '' : quote.id)} aria-expanded={expanded === quote.id}><span className="accordion-index">0{index + 1}</span><span className="accordion-vendor"><span className="mini-dot" style={{ background: quote.color }} />{quote.name}</span><span className="accordion-verdict">{quote.verdict}</span><span className="accordion-total">{money(quote.printed)}</span><ChevronDown size={18} className="chevron" /></button>
            {expanded === quote.id && <div className="accordion-content"><div className="detail-summary"><div className="detail-source"><span>PRINTED QUOTE</span><strong>{money(quote.printed)}</strong><small>{quote.tax}</small></div><div><p>{quote.summary}</p><div className="strength-tags">{quote.strengths.map((strength) => <span key={strength}><Check size={12} />{strength}</span>)}</div></div></div>
              {quote.sections && <div className="section-breakdown"><strong>Kang Sheng’s $104,370 includes</strong><div>{quote.sections.map(([name, amount]) => <span key={name}>{name}<b>{money(amount)}</b></span>)}</div></div>}
              <div className="detail-grid">{Object.entries(quote.details).map(([key, value]) => <div key={key}><span>{key}</span><b className={/not quoted|excluded|not stated|unpriced|confirm|tbc|extra/i.test(value) ? 'detail-warning' : ''}>{value}</b></div>)}</div>
              <div className="risk-row"><TriangleAlert size={15} /><span><b>Watch-outs:</b> {quote.risks.join(' · ')}</span></div><ul className="quote-notes">{quote.notes.map((note) => <li key={note}>{note}</li>)}</ul>
            </div>}
          </article>)}</div>
        </section>

        <section className="decision-section section-wrap" id="decision"><div className="decision-card"><div className="decision-copy"><div className="section-kicker">03 / DECISION NOTES</div><h2>The honest<br /><em>takeaway.</em></h2><p><strong>There is one bathroom: the Main Ensuite.</strong> The quote PDFs use different labels (“L3 Bathroom,” “Bathroom,” “Ensuite bathroom” and “Main Ensuite”), now standardized here to Main Ensuite. The remaining comparison is about each contractor’s included work, tile supply, hidden access, study layout and payable total.</p><div className="recommendation"><span className="rec-icon"><Sparkles size={17} /></span><div><span>NEXT STEP</span><strong>Request revised, room-by-room fixed quotes.</strong><small>Use the checklist to close the largest cost and scope gaps.</small></div></div></div><div className="questions"><div className="questions-head"><span>FOLLOW-UP CHECKLIST</span><b>{checkedQuestions.length}/{askQuestions.length} complete</b></div>{askQuestions.map((question, index) => <button className={`question ${checkedQuestions.includes(index) ? 'done' : ''}`} type="button" key={question} onClick={() => toggleQuestion(index)} aria-pressed={checkedQuestions.includes(index)}><span className="question-check">{checkedQuestions.includes(index) && <Check size={13} />}</span><span>{question}</span><ArrowUpRight size={15} /></button>)}</div></div></section>
      </main>
      <section className="print-report" aria-label="A4 quote comparison report">
        <header className="print-report-header"><div><span>RENOSCOPE / COMPARISON REPORT</span><h1>Four renovation quotes</h1><p>Updated 23 Sep 2026 · Singapore dollars · Based on contractor PDFs and homeowner clarification</p></div><strong>01 / 02</strong></header>
        <p className="print-lead"><strong>Room-name standard:</strong> The home has one bathroom, called the <strong>Main Ensuite</strong> throughout this report. Source quote labels vary: Kang Sheng “L3 Bathroom”/“Main Ensuite”, CX “Bathroom”/“Main Ensuite”, Polibuild “Ensuite bathroom” and Essenwoods “Main ensuite”. Scope differences below refer to this one room. Kang Sheng’s tile supply and electrical are not in its printed total. No additional GST is assumed for Kang Sheng, Polibuild or Essenwoods.</p>
        <h2>Price snapshot</h2>
        <table className="print-table print-prices"><thead><tr><th>Contractor</th><th>Printed quote</th><th>Modelled additions*</th><th>Payable proxy*</th><th>Tax assumption</th></tr></thead><tbody>{modeledQuotes.map((quote) => <tr key={quote.id}><th scope="row">{quote.name}</th><td>{money(quote.printed)}</td><td>+{money(quote.gap)}</td><td><strong>{money(quote.payable)}{quote.payableSuffix}</strong></td><td>{quote.id === 'cx' ? '9% applied' : 'No extra GST'}</td></tr>)}</tbody></table>
        <p className="print-caption">*Proxies are planning illustrations, not bids. CX applies 9% GST to its $85,530 pre-GST base plus modelled additions; no additional GST is assumed for the other three (homeowner assumption, not a registration finding). Blank tile areas remain formulas, not zero-cost tiles.</p>
        <h2>Tile material scenario</h2>
        <div className="print-tile"><div><span>Selected tile price</span><b>{money(chosenTilePrice)} / sqft</b></div><div><span>Main Ensuite floor + walls (B)</span><b>{mainEnsuiteTileArea === '' ? 'Not measured' : `${mainEnsuiteTileArea} sqft`}</b></div><div><span>Balcony floor (A)</span><b>{balconyTileArea === '' ? 'Not measured' : `${balconyTileArea} sqft`}</b></div></div>
        <p className="print-caption">Kang Sheng: full material price × B {mainEnsuiteTileArea === '' ? '(area missing)' : `= +${money(kangTileCost)}`}. CX: {cxUpgradeRate > 0 ? `+${money(cxUpgradeRate)} × B above its $6 cap, then 9% GST if purchased through CX` : 'within its $6 cap; no tile uplift assumed'}. Polibuild: +{money(polibuildUpgradeRate)} × (B+A) above its $5.80 cap, subject to tile-supply confirmation. No credit below a cap; Essenwoods’ material allowance is unclear. Delivery, wastage and tile-size changes are not modelled.</p>
        <h2>Scope snapshot</h2>
        <table className="print-table print-scope"><thead><tr><th>Work</th>{quoteData.map((quote) => <th key={quote.id}>{quote.name}</th>)}</tr></thead><tbody>{comparisonRows.filter((row) => ['Wet-work scope', 'Tile supply', 'Study enclosure', 'Study shelves / floor', 'Hidden-storage access', 'Aircon', 'Scaffold / lifting', 'Balcony hack + floor', 'PE endorsement'].includes(row.label)).map((row) => <tr key={row.label}><th scope="row">{row.label}</th>{quoteData.map((quote) => <td key={quote.id}>{valueFor(row, quote)}</td>)}</tr>)}</tbody></table>
        <div className="print-followup"><div className="print-part-label">02 / 02</div><h2>What the limited model still misses</h2><ul><li>Kang Sheng’s $2,500 study glass is only a minimum: wall redesign and access need pricing; its hidden cabinet $2,850 and two ~$530 bi-folds are TBC. Its $6,300 scaffold is estimated within the quote.</li><li>Polibuild’s $4,410 study shelves and flooring are priced, but study glazing and PE are not. Essenwoods has the glass study but no shelves, aircon or priced scaffold. Hidden-storage access is not a cabinet.</li><li>Electrical $7,500 is a planning allowance, not a take-off. Fixtures, sanitary ware, approvals and exact flooring can change costs; request written revisions.</li></ul>
          <p>Electrical: CX prices $4,200; the other three give rates without a priced total. General warranty: CX 1 year, Polibuild 12-month defects liability; Kang Sheng and Essenwoods do not state a general-work period (Kang Sheng lists a separate aircon warranty).</p>
          <h2>Follow-up checklist</h2><ol>{askQuestions.map((question) => <li key={question}>{question}</li>)}</ol>
          <p className="print-sources">Sources: CXE QT26220 (23 Sep), Kang Sheng A260043R01 (23 Sep), Polibuild Q1/08/26/PB/WT (11 Aug), Essenwoods quotation 8888 (19 Sep). Detailed analysis: local `comparison.md`. This printout records the inputs shown above; quote totals remain subject to contractor confirmation.</p>
        </div>
      </section>
      <footer className="footer section-wrap"><div className="brand"><span className="brand-mark"><Sparkles size={14} /></span><span>reno<span>scope</span></span></div><span>Updated 23 Sep 2026 · Source: 4 contractor quotes and homeowner clarification</span><a href="#top">Back to top <ArrowUpRight size={14} /></a></footer>
    </div>
  );
}

export default App;

createRoot(document.getElementById('root')).render(<App />);
