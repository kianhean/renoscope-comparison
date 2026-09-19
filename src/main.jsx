import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  FileText,
  Filter,
  Flame,
  Info,
  Leaf,
  Minus,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  Star,
  ThumbsUp,
  TriangleAlert,
  X,
  Zap,
} from 'lucide-react';
import './styles.css';

const quoteData = [
  {
    id: 'cx',
    name: 'CX Reno',
    short: 'CX',
    ref: 'CXE QT26220',
    date: '23 Sep 2026',
    category: 'Value',
    color: '#ef7c5d',
    bg: '#fff1ec',
    quoted: 85530,
    final: 135400,
    delta: 'Lowest normalized total',
    rating: 3.8,
    votes: 12,
    verdict: 'Lowest cost, most self-coordination',
    summary: 'The leanest quote. Great if you are comfortable coordinating the gaps yourself.',
    strengths: ['Lowest adjusted total', '1 yr workmanship warranty', 'Straightforward payment plan'],
    risks: ['Electrical capped / install-only', 'Aircon, PE and scaffolding excluded', 'No balcony or study glass'],
    details: {
      coverage: '1 bathroom · 1200 sft overlay vinyl',
      aircon: 'Excluded',
      electrical: '~$4,200 priced, capped at ~20 points',
      carpentry: '~$39k approximate',
      flooring: 'Overlay vinyl whole unit',
      payment: '10 / 40 / 40 / 10',
      warranty: '1 year workmanship',
    },
  },
  {
    id: 'polibuild',
    name: 'Polibuild',
    short: 'PB',
    ref: 'Q1/08/26/PB/WT',
    date: '11 Aug 2026',
    category: 'Turnkey',
    color: '#4f9c93',
    bg: '#eaf7f4',
    quoted: 121128,
    final: 142878,
    delta: '+6% vs CX',
    rating: 4.6,
    votes: 28,
    verdict: 'Best mid-value / turnkey option',
    summary: 'The practical middle ground: aircon and scaffolding included, but electrical remains a big unknown.',
    strengths: ['Aircon system 2 included', 'Scaffolding included for 2 months', '12 month DLP'],
    risks: ['Electrical lines are all $0', 'PE endorsement excluded', 'Quote is ~6 weeks old'],
    details: {
      coverage: '1 ensuite · balcony · partial study',
      aircon: 'Included · Mitsubishi system 2',
      electrical: 'Rates only; total unpriced ($0 lines)',
      carpentry: '~$53k approximate',
      flooring: 'Polish timber + master/study vinyl',
      payment: '20 / 30 / 25 / 20 / 5',
      warranty: '12 month defects liability period',
    },
  },
  {
    id: 'essenwoods',
    name: 'Essenwoods',
    short: 'EW',
    ref: 'Quote dated 19/9/26',
    date: '19 Sep 2026',
    category: 'Premium',
    color: '#c69a46',
    bg: '#fff7e6',
    quoted: 162750,
    final: 184390,
    delta: '+36% vs CX',
    rating: 4.2,
    votes: 19,
    verdict: 'Most complete, highest premium',
    summary: 'The most hands-off brief with the richest material spec, but several allowances are still provisional.',
    strengths: ['Full study glass wall + door', 'PE endorsement included', 'Most extensive carpentry scope'],
    risks: ['Electrical total not stated', 'Aircon excluded', 'No stated warranty or payment terms'],
    details: {
      coverage: '1 main ensuite · balcony · full study',
      aircon: 'Excluded · appoint separately (~$7–8k)',
      electrical: 'Per-point rates only; fixture supply excluded',
      carpentry: '~$58k approximate',
      flooring: 'Revarnish parquet + master vinyl',
      payment: 'Not stated',
      warranty: 'Not stated',
    },
  },
];

const comparisonRows = [
  { group: 'Price & coverage', label: 'Adjusted final', key: 'final', type: 'money' },
  { group: 'Price & coverage', label: 'Quoted base', key: 'quoted', type: 'money' },
  { group: 'Price & coverage', label: 'Normalized gap fill', values: { cx: '+$38,690', polibuild: '+$21,750', essenwoods: '+$21,640' } },
  { group: 'Scope', label: 'Study room', values: { cx: 'No', polibuild: 'Partial', essenwoods: 'Full glass wall' }, diff: true },
  { group: 'Scope', label: 'Aircon', key: 'details.aircon', diff: true },
  { group: 'Scope', label: 'Scaffolding', values: { cx: 'No', polibuild: 'Included · $6,000', essenwoods: 'Discussed separately' }, diff: true },
  { group: 'Scope', label: 'Electrical', key: 'details.electrical', diff: true },
  { group: 'Finishes', label: 'Flooring approach', key: 'details.flooring', diff: true },
  { group: 'Finishes', label: 'Carpentry total', key: 'details.carpentry' },
  { group: 'Terms', label: 'Warranty', key: 'details.warranty', diff: true },
  { group: 'Terms', label: 'Payment schedule', key: 'details.payment', diff: true },
];

const tabs = ['All', 'Value', 'Turnkey', 'Premium'];
const askQuestions = [
  'Price the electrical works fully, including point count and light fittings',
  'Confirm whether PE endorsement is required and included',
  'Provide warranty length and payment schedule',
  'Confirm if provisional / estimated items are fixed or site-measured',
];

const money = (value) => `$${value.toLocaleString('en-SG')}`;

function valueFor(row, quote) {
  if (row.values) return row.values[quote.id];
  if (row.key === 'final' || row.key === 'quoted') return money(quote[row.key]);
  return row.key.split('.').reduce((value, key) => value?.[key], quote);
}

function App() {
  const [selected, setSelected] = useState(['cx', 'polibuild', 'essenwoods']);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const [expanded, setExpanded] = useState('polibuild');
  const [votes, setVotes] = useState(Object.fromEntries(quoteData.map((quote) => [quote.id, quote.votes])));
  const [ratings, setRatings] = useState(Object.fromEntries(quoteData.map((quote) => [quote.id, quote.rating])));
  const [checkedQuestions, setCheckedQuestions] = useState([]);

  const visibleQuotes = useMemo(() => quoteData.filter((quote) => {
    const matchesTab = activeTab === 'All' || quote.category === activeTab;
    const query = search.toLowerCase();
    const matchesSearch = !query || [quote.name, quote.category, quote.verdict, quote.summary].join(' ').toLowerCase().includes(query);
    return matchesTab && matchesSearch;
  }), [activeTab, search]);

  const comparedQuotes = quoteData.filter((quote) => selected.includes(quote.id));
  const comparisonGroups = comparisonRows.reduce((groups, row) => {
    const last = groups[groups.length - 1];
    if (!last || last.group !== row.group) groups.push({ group: row.group, rows: [row] });
    else last.rows.push(row);
    return groups;
  }, []);

  const toggleQuote = (id) => {
    setSelected((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : current.length < 4 ? [...current, id] : current);
  };

  const toggleQuestion = (index) => {
    setCheckedQuestions((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="RenoScope home">
          <span className="brand-mark"><Sparkles size={16} strokeWidth={2.5} /></span>
          <span>reno<span>scope</span></span>
        </a>
        <div className="topbar-project"><span>PROJECT 01</span><b>Renovation quote review</b></div>
        <nav className="topnav" aria-label="Main navigation">
          <a href="#comparison">Compare</a>
          <a href="#scope">Scope audit</a>
          <a href="#decision">Decision notes</a>
        </nav>
        <button className="export-button" type="button" onClick={() => window.print()}><FileText size={15} /> Export view</button>
      </header>

      <main id="top">
        <section className="hero section-wrap">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> RENOVATION INTELLIGENCE <span className="eyebrow-line" /> 19 SEP 2026</div>
            <h1>A clearer way<br /><em>to choose.</em></h1>
            <p className="hero-intro">Three renovation quotes. One normalized finish line. See what each contractor really includes before you commit.</p>
            <div className="hero-actions">
              <a href="#comparison" className="primary-button">Explore the comparison <ArrowDown size={16} /></a>
              <span className="updated-note"><span className="live-dot" /> Updated from 3 quote documents</span>
            </div>
          </div>
          <div className="hero-insight">
            <div className="insight-top"><span>THE SHORTLIST</span><BadgeCheck size={18} /></div>
            <div className="insight-choice"><span className="choice-number">01</span><div><strong>Polibuild</strong><span>Best mid-value / turnkey</span></div><ArrowUpRight size={18} /></div>
            <div className="insight-divider" />
            <div className="insight-metric"><span>Normalized final</span><strong>$142,878</strong></div>
            <div className="insight-bar"><i style={{ width: '77%' }} /><i style={{ width: '92%' }} /><i style={{ width: '100%' }} /></div>
            <div className="insight-legend"><span><i className="dot-cx" /> CX Reno <b>$135k</b></span><span><i className="dot-pb" /> Polibuild <b>$143k</b></span><span><i className="dot-ew" /> Essenwoods <b>$184k</b></span></div>
          </div>
        </section>

        <section className="stats-strip section-wrap" aria-label="Project summary">
          <div className="stat"><span className="stat-icon"><BarChart3 size={17} /></span><div><b>3</b><span>quotes reviewed</span></div></div>
          <div className="stat"><span className="stat-icon"><Zap size={17} /></span><div><b>$49,390</b><span>largest scope gap</span></div></div>
          <div className="stat"><span className="stat-icon"><ShieldAlert size={17} /></span><div><b>9%</b><span>GST applies to CX only</span></div></div>
          <div className="stat highlight-stat"><span className="stat-icon"><Leaf size={17} /></span><div><b>+6%</b><span>Polibuild vs cheapest</span></div><ArrowUpRight size={16} /></div>
        </section>

        <section className="workspace section-wrap" id="comparison">
          <div className="section-heading">
            <div><div className="section-kicker">01 / SIDE BY SIDE</div><h2>Compare the real<br /><em>finish line.</em></h2></div>
            <p>Headline prices are not like-for-like. Every adjusted total below fills the missing scope so you can compare the same renovation brief.</p>
          </div>
          <div className="filter-bar">
            <label className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search quotes, scope, risks..." /><kbd>⌘ K</kbd></label>
            <div className="filter-pills" role="tablist" aria-label="Quote categories">
              {tabs.map((tab) => <button key={tab} type="button" className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}{tab !== 'All' && <span>{quoteData.filter((quote) => quote.category === tab).length}</span>}</button>)}
            </div>
            <button className={`difference-toggle ${differencesOnly ? 'on' : ''}`} type="button" onClick={() => setDifferencesOnly(!differencesOnly)} aria-pressed={differencesOnly}><span className="toggle-track"><span /></span> Differences only</button>
          </div>

          <div className="selection-row"><span><Filter size={14} /> Comparing <b>{selected.length} of 4</b> quotes</span><div className="selected-chips">{comparedQuotes.map((quote) => <button key={quote.id} type="button" style={{ '--chip-color': quote.color }} onClick={() => toggleQuote(quote.id)}>{quote.short}<X size={12} /></button>)}{selected.length < 4 && <span className="selection-hint">Select up to 4</span>}</div></div>

          <div className="quote-cards" aria-label="Quote selection">
            {visibleQuotes.map((quote) => <article className={`quote-card ${selected.includes(quote.id) ? 'selected' : ''}`} key={quote.id}>
              <div className="quote-card-head"><div className="vendor-avatar" style={{ background: quote.bg, color: quote.color }}>{quote.short}</div><div><h3>{quote.name}</h3><span>{quote.ref}</span></div><button className="check-button" type="button" onClick={() => toggleQuote(quote.id)} aria-label={`${selected.includes(quote.id) ? 'Remove' : 'Add'} ${quote.name}`}>{selected.includes(quote.id) ? <Check size={15} /> : <Plus size={16} />}</button></div>
              <div className="quote-number"><span>Quoted base</span><strong>{money(quote.quoted)}</strong></div>
              <div className="quote-rating"><span className="stars">{[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" aria-label={`Rate ${quote.name} ${star} stars`} onClick={() => setRatings((current) => ({ ...current, [quote.id]: star }))}><Star size={13} fill={star <= ratings[quote.id] ? 'currentColor' : 'none'} /></button>)}</span><b>{ratings[quote.id].toFixed(1)}</b><span className="rating-count">({votes[quote.id]})</span></div>
              <div className="quote-tag" style={{ color: quote.color, background: quote.bg }}>{quote.category} <span>·</span> {quote.delta}</div>
              <p>{quote.summary}</p>
              <button className="vote-button" type="button" onClick={() => setVotes((current) => ({ ...current, [quote.id]: current[quote.id] + 1 }))}><ThumbsUp size={14} fill={votes[quote.id] > quote.votes ? 'currentColor' : 'none'} /> Useful <b>{votes[quote.id]}</b></button>
            </article>)}
            {!visibleQuotes.length && <div className="empty-state"><CircleHelp size={24} /><b>No quotes match that search</b><span>Try a different category or search term.</span></div>}
          </div>

          <div className="normalized-panel">
            <div className="panel-label"><span className="section-kicker">NORMALIZED TOTALS</span><button className="help-icon" title="Adjusted final includes the estimated cost to fill each quote's scope gaps."><Info size={15} /></button></div>
            <div className="normalized-intro"><div><h3>Same brief. Better signal.</h3><p>Adjusted final includes the estimated cost to fill each quote's missing scope.</p></div><div className="normalized-note"><Sparkles size={15} /><span>Cheapest does not mean most complete</span></div></div>
            <div className="normalized-chart">
              {quoteData.map((quote) => <div className="chart-row" key={quote.id}><div className="chart-name"><span className="chart-dot" style={{ background: quote.color }} />{quote.name}<small>{quote.id === 'cx' ? 'most self-managed' : quote.id === 'polibuild' ? 'best middle ground' : 'premium scope'}</small></div><div className="chart-track"><div className="chart-fill" style={{ width: `${(quote.final / 184390) * 100}%`, background: quote.color }}><span>{money(quote.final)}</span></div></div><span className="chart-delta">{quote.id === 'cx' ? 'baseline' : quote.delta}</span></div>)}
            </div>
          </div>

          <div className="compare-table-wrap">
            <div className="table-heading"><div><span className="section-kicker">LIVE COMPARISON</span><h3>Scope, terms & inclusions</h3></div><span className="table-note"><span className="warning-dot" /> amber cells need a follow-up</span></div>
            <div className="compare-table" role="table">
              <div className="table-row table-header" role="row"><div role="columnheader">Criteria</div>{comparedQuotes.map((quote) => <div role="columnheader" key={quote.id}><span className="table-avatar" style={{ background: quote.bg, color: quote.color }}>{quote.short}</span><span>{quote.name}</span><small>{quote.date}</small></div>)}</div>
              {comparisonGroups.map((group) => <div key={group.group} className="table-group"><div className="group-label">{group.group}</div>{group.rows.filter((row) => !differencesOnly || row.diff).map((row) => <div className="table-row" role="row" key={row.label}><div role="cell">{row.label}{row.diff && <span className="row-alert">!</span>}</div>{comparedQuotes.map((quote) => <div role="cell" key={quote.id} className={row.diff ? 'needs-check' : ''}>{row.label === 'Adjusted final' && <strong className="table-price">{valueFor(row, quote)}</strong>}{row.label !== 'Adjusted final' && valueFor(row, quote)}</div>)}</div>)}</div>)}
              {differencesOnly && <div className="diff-note"><Info size={15} /> Showing {comparisonRows.filter((row) => row.diff).length} flagged criteria only. Turn off the toggle to see all rows.</div>}
            </div>
          </div>
        </section>

        <section className="scope-section section-wrap" id="scope">
          <div className="section-heading compact-heading"><div><div className="section-kicker">02 / DEEP DIVE</div><h2>What is hiding<br /><em>between the lines?</em></h2></div><p>Open each quote to inspect the details that a single total cannot tell you.</p></div>
          <div className="accordion-list">
            {quoteData.map((quote, index) => <article className={`accordion-item ${expanded === quote.id ? 'open' : ''}`} key={quote.id}>
              <button className="accordion-trigger" type="button" onClick={() => setExpanded(expanded === quote.id ? '' : quote.id)} aria-expanded={expanded === quote.id}><span className="accordion-index">0{index + 1}</span><span className="accordion-vendor"><span className="mini-dot" style={{ background: quote.color }} />{quote.name}</span><span className="accordion-verdict">{quote.verdict}</span><span className="accordion-total">{money(quote.final)}</span><ChevronDown size={18} className="chevron" /></button>
              {expanded === quote.id && <div className="accordion-content"><div className="detail-summary"><div className="detail-score"><span>COMMUNITY SIGNAL</span><strong>{ratings[quote.id].toFixed(1)}<small>/ 5</small></strong><div className="small-stars">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={12} fill={star <= ratings[quote.id] ? 'currentColor' : 'none'} />)}</div></div><div><p>{quote.summary}</p><div className="strength-tags">{quote.strengths.map((strength) => <span key={strength}><Check size={12} />{strength}</span>)}</div></div></div><div className="detail-grid">{Object.entries(quote.details).map(([key, value]) => <div key={key}><span>{key.replace(/([A-Z])/g, ' $1')}</span><b className={value.toLowerCase().includes('unpriced') || value.toLowerCase().includes('excluded') || value.toLowerCase().includes('not stated') ? 'detail-warning' : ''}>{value}</b></div>)}</div><div className="risk-row"><TriangleAlert size={15} /><span><b>Watch-outs:</b> {quote.risks.join(' · ')}</span></div></div>}
            </article>)}
          </div>
        </section>

        <section className="decision-section section-wrap" id="decision">
          <div className="decision-card"><div className="decision-copy"><div className="section-kicker">03 / DECISION NOTES</div><h2>The honest<br /><em>takeaway.</em></h2><p>Normalized, the ranking is <strong>CX Reno → Polibuild → Essenwoods.</strong> CX and Polibuild are close enough that certainty on electrical and PE could change the winner.</p><div className="recommendation"><span className="rec-icon"><Sparkles size={17} /></span><div><span>OUR READ</span><strong>Polibuild is the sensible shortlist.</strong><small>Ask for a fully priced electrical schedule before signing.</small></div></div></div><div className="questions"><div className="questions-head"><span>FOLLOW-UP CHECKLIST</span><b>{checkedQuestions.length}/{askQuestions.length} complete</b></div>{askQuestions.map((question, index) => <button className={`question ${checkedQuestions.includes(index) ? 'done' : ''}`} type="button" key={question} onClick={() => toggleQuestion(index)}><span className="question-check">{checkedQuestions.includes(index) && <Check size={13} />}</span><span>{question}</span><ArrowUpRight size={15} /></button>)}</div></div>
        </section>
      </main>
      <footer className="footer section-wrap"><div className="brand"><span className="brand-mark"><Sparkles size={14} /></span><span>reno<span>scope</span></span></div><span>Prepared for a residential renovation · Source: 3 contractor quotes</span><a href="#top">Back to top <ArrowUpRight size={14} /></a></footer>
    </div>
  );
}

export default App;

createRoot(document.getElementById('root')).render(<App />);
