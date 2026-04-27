import { useState, useMemo } from 'react'
import { ArrowRight, Sliders, DollarSign, ChevronRight } from 'lucide-react'
import rateTables from './data/rate-tables.json'
import { generateQuote } from './lib/rateEngine.js'

const C = { navy900:'#0A1628', navy800:'#0F2240', navy700:'#132D5E', navy600:'#1A3F7A', navy500:'#2558A3', navy400:'#3B7DD8', navy300:'#6FA3E8', navy200:'#A8C8F0', navy100:'#D4E4F8', navy50:'#EBF2FB', green700:'#1B6E3D', green600:'#238B4E', green500:'#2EA663', green400:'#4CC07E', green100:'#D6F0E2', green50:'#F0FAF4', purple700:'#4A2D7A', purple600:'#5E3B99', purple500:'#7349B8', purple400:'#8F6DD0', purple100:'#E6DCF5', white:'#FFFFFF', grey50:'#F7F8FA', grey100:'#F0F2F5', grey200:'#E2E6EB', grey300:'#CDD3DB', grey400:'#9CA5B2', grey500:'#6B7685', grey600:'#4A5568', grey700:'#2D3748' }

const TIERS = [
  { key: 'Bronze',   sublabel: 'Basic',    color: C.navy500,   bgAccent: C.navy50,    desc: '$15K/$30K BI · $5K PD · $2,500 ded' },
  { key: 'Silver',   sublabel: 'Standard', color: C.green600,  bgAccent: C.green50,   desc: '$100K/$300K BI · $50K PD · $2,000 ded' },
  { key: 'Gold',     sublabel: 'Premium',  color: C.purple600, bgAccent: C.purple100, desc: '$300K/$500K BI · $100K PD · $1,500 ded' },
  { key: 'Platinum', sublabel: 'Elite',    color: C.navy900,   bgAccent: C.grey100,   desc: '$1M/$2M BI · $250K PD · $500 ded' },
]

const TOWABLE_TYPES = ['Travel Trailer', 'Toy Hauler', 'Fifth Wheel', 'Pop Up', 'Park Model', 'Truck Camper']
const DRIVABLE_TYPES = ['Class A', 'Class B', 'Class C']

const STATES = [
  ['CA','California'],['AZ','Arizona'],['CO','Colorado'],['FL','Florida'],
  ['GA','Georgia'],['NV','Nevada'],['NM','New Mexico'],['OR','Oregon'],
  ['TX','Texas'],['UT','Utah'],['WA','Washington']
]

const DEFAULT_INPUTS = {
  fleet_size: 1,
  owner_birthdate: '1985-06-15',
  odometer_miles: 25000,
  prior_claims_3yr: 0,
  vin_title_status: 'clean',
  credit_score_band: '700+',
  has_prior_commercial_insurance: true,
  multi_line_auto: false, multi_line_home: false, multi_line_life: false,
  affiliate_referral: false,
  add_sli: false, add_personal_accident: false, add_personal_effects: false, add_roadside: false,
  premier_owner_pct: 0, years_in_operation: 0,
}

const $ = (n) => n != null ? `$${Math.round(n).toLocaleString()}` : '—'

// ─────────────────────────────────────────────────────────────
// Main component — Tabs + Estimator + Sample Rates table
// ─────────────────────────────────────────────────────────────
export default function CoverageEstimator({ setPage }) {
  const [activeTab, setActiveTab] = useState('towable')

  // Default RV type for each tab
  const defaultType = activeTab === 'towable' ? 'Travel Trailer' : 'Class C'
  const availableTypes = activeTab === 'towable' ? TOWABLE_TYPES : DRIVABLE_TYPES
  const sampleType = activeTab === 'towable' ? rateTables.SAMPLE_VALUES.towable_default_type : rateTables.SAMPLE_VALUES.drivable_default_type
  const sampleValues = activeTab === 'towable' ? rateTables.SAMPLE_VALUES.towable_values : rateTables.SAMPLE_VALUES.drivable_values

  return (
    <div>
      {/* Tab toggle */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 32, background: C.white, borderRadius: 10, padding: 6, boxShadow: '0 2px 12px rgba(15,34,64,0.06)', maxWidth: 480, margin: '0 auto 32px' }}>
        <button
          onClick={() => setActiveTab('towable')}
          style={{
            flex: 1,
            padding: '14px 24px',
            background: activeTab === 'towable' ? C.green600 : 'transparent',
            color: activeTab === 'towable' ? C.white : C.grey700,
            border: 'none',
            borderRadius: 6,
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          🛻 Towable Plans
        </button>
        <button
          onClick={() => setActiveTab('drivable')}
          style={{
            flex: 1,
            padding: '14px 24px',
            background: activeTab === 'drivable' ? C.green600 : 'transparent',
            color: activeTab === 'drivable' ? C.white : C.grey700,
            border: 'none',
            borderRadius: 6,
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          🚐 Drivable Plans
        </button>
      </div>

      <p style={{ textAlign: 'center', color: C.grey600, fontSize: '0.92rem', maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.65 }}>
        {activeTab === 'towable'
          ? 'Coverage for trailers, toy haulers, fifth wheels, and other non-driveable RVs. SFR delivery rule: only towables can be delivered — driveables are pickup only.'
          : 'Coverage for self-propelled motorhomes — Class A, B, and C — including Sprinter vans and full-size diesel pushers.'
        }
      </p>

      {/* Estimator */}
      <Estimator
        key={activeTab}
        availableTypes={availableTypes}
        defaultType={defaultType}
        setPage={setPage}
      />

      {/* Sample Rates Table */}
      <SampleRatesTable
        type={sampleType}
        values={sampleValues}
        category={activeTab}
        setPage={setPage}
      />

      {/* Tier Detail Cards */}
      <TierDetailCards setPage={setPage}/>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Live estimator — user adjusts inputs, prices update
// ─────────────────────────────────────────────────────────────
function Estimator({ availableTypes, defaultType, setPage }) {
  const [rvType, setRvType] = useState(defaultType)
  const [value, setValue] = useState(defaultType.startsWith('Class') ? 40000 : 25000)
  const [year, setYear] = useState(2022)
  const [state, setState] = useState('CA')
  const [fleetSize, setFleetSize] = useState(1)

  const inputs = { ...DEFAULT_INPUTS, rv_type: rvType, replacement_value: value, vehicle_year: year, vehicle_state: state, fleet_size: fleetSize }

  const tierQuotes = useMemo(() => TIERS.map(t => ({
    ...t,
    quote: generateQuote({ ...inputs, coverage_tier: t.key }, rateTables)
  })), [rvType, value, year, state, fleetSize])

  const declined = tierQuotes.some(t => t.quote.declined)
  const declineReason = tierQuotes[0]?.quote?.decline_reason

  const labelSx = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: C.grey600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }
  const inputSx = { width: '100%', padding: '11px 12px', fontSize: '0.92rem', border: `1.5px solid ${C.grey300}`, borderRadius: 6, background: C.white, color: C.navy800, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ background: C.white, borderRadius: 12, padding: 'clamp(28px, 4vw, 40px)', marginBottom: 32, boxShadow: '0 4px 20px rgba(15,34,64,0.08)', border: `1px solid ${C.grey200}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Sliders size={22} color={C.green600}/>
        <h3 style={{ fontSize: '1.3rem', margin: 0, color: C.navy800, fontWeight: 800 }}>Live Premium Estimator</h3>
      </div>
      <p style={{ fontSize: '0.88rem', color: C.grey500, marginBottom: 24, marginTop: 0 }}>
        Adjust the inputs below to see real-time pricing across all four tiers. Rates update instantly.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.3fr)', gap: 28 }} className="estimator-grid">
        {/* Inputs */}
        <div>
          <div style={{ marginBottom: 18 }}>
            <label style={labelSx}>RV Type</label>
            <select value={rvType} onChange={e => setRvType(e.target.value)} style={inputSx}>
              {availableTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelSx}>Stated Value: <span style={{ color: C.green700, fontWeight: 800 }}>${value.toLocaleString()}</span></label>
            <input
              type="range"
              min={5000}
              max={150000}
              step={1000}
              value={value}
              onChange={e => setValue(Number(e.target.value))}
              style={{ width: '100%', accentColor: C.green600, height: 6 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: C.grey500, marginTop: 4 }}>
              <span>$5K</span><span>$75K</span><span>$150K</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
            <div>
              <label style={labelSx}>Year</label>
              <select value={year} onChange={e => setYear(Number(e.target.value))} style={inputSx}>
                {[2027,2026,2025,2024,2023,2022,2021,2020,2019,2018,2017,2016].map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label style={labelSx}>State</label>
              <select value={state} onChange={e => setState(e.target.value)} style={inputSx}>
                {STATES.map(([code, name]) => <option key={code} value={code}>{code}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={labelSx}>Fleet Size</label>
            <input
              type="number"
              value={fleetSize}
              onChange={e => setFleetSize(Math.max(1, Number(e.target.value) || 1))}
              style={inputSx}
              min={1}
              max={50}
            />
            <div style={{ fontSize: '0.74rem', color: C.grey500, marginTop: 6 }}>
              Fleet discounts apply at 3+ units (5%), 5+ (10%), 10+ (12.5%), 25+ (15%)
            </div>
          </div>
        </div>

        {/* Tier prices */}
        <div>
          <label style={labelSx}>Live Pricing (per vehicle, monthly)</label>
          {declined ? (
            <div style={{ padding: '20px 18px', background: '#FFFBEB', border: `1px solid ${C.grey200}`, borderRadius: 8, color: C.navy700, fontSize: '0.92rem', lineHeight: 1.6 }}>
              <strong>Manual review required:</strong> {declineReason}
              <br/><br/>
              <button onClick={() => { setPage('contact'); window.scrollTo(0,0) }} style={{ padding: '10px 18px', background: C.navy700, color: C.white, border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                Contact an Underwriter →
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {tierQuotes.map(t => (
                <button
                  key={t.key}
                  onClick={() => { setPage('quote'); window.scrollTo(0,0) }}
                  style={{
                    padding: '16px 14px',
                    background: C.white,
                    border: `2px solid ${t.color}`,
                    borderRadius: 8,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    position: 'relative',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = t.bgAccent }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.white }}
                >
                  <div style={{ fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.color, marginBottom: 4 }}>{t.sublabel}</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: C.navy800, marginBottom: 4 }}>{t.key}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: C.navy800, lineHeight: 1, marginBottom: 4 }}>
                    {$(t.quote.monthly_total)}<span style={{ fontSize: '0.7rem', color: C.grey500, fontWeight: 600 }}>/mo</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: C.grey500 }}>${t.quote.deposit} deposit</div>
                  {fleetSize > 1 && (
                    <div style={{ fontSize: '0.68rem', color: C.green700, fontWeight: 700, marginTop: 4 }}>
                      Fleet: {$(t.quote.fleet_total_monthly)}/mo
                    </div>
                  )}
                  <ChevronRight size={14} color={t.color} style={{ position: 'absolute', top: 16, right: 12 }}/>
                </button>
              ))}
            </div>
          )}

          {!declined && (
            <button
              onClick={() => { setPage('quote'); window.scrollTo(0,0) }}
              style={{ width: '100%', padding: '14px', background: C.green600, color: C.white, border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              Get Full Quote with Discounts <ArrowRight size={16}/>
            </button>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .estimator-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Sample Rates Table — fixed value examples × 4 tiers
// ─────────────────────────────────────────────────────────────
function SampleRatesTable({ type, values, category, setPage }) {
  // Compute all sample quotes once
  const inputs = { ...DEFAULT_INPUTS, rv_type: type, vehicle_year: 2022, vehicle_state: 'CA' }

  const rows = values.map(v => {
    const tierPrices = TIERS.map(t => {
      const q = generateQuote({ ...inputs, replacement_value: v, coverage_tier: t.key }, rateTables)
      return { tier: t.key, total: q.monthly_total, deposit: q.deposit, color: t.color }
    })
    return { value: v, tierPrices }
  })

  return (
    <div style={{ background: C.white, borderRadius: 12, overflow: 'hidden', marginBottom: 32, boxShadow: '0 4px 20px rgba(15,34,64,0.08)', border: `1px solid ${C.grey200}` }}>
      <div style={{ padding: 'clamp(20px, 3vw, 28px)', background: C.navy50, borderBottom: `1px solid ${C.grey200}` }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.green700, marginBottom: 6 }}>
          Reference Rates · {category === 'towable' ? 'Towable' : 'Drivable'}
        </div>
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: C.navy800 }}>
          {type} — Sample Pricing by Stated Value
        </h3>
        <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: C.grey600 }}>
          CA · 2022 model year · 1 unit · No multi-line discounts. Use the estimator above to customize.
        </p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem', minWidth: 580 }}>
          <thead>
            <tr style={{ background: C.grey50 }}>
              <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: '0.78rem', fontWeight: 700, color: C.grey600, letterSpacing: '0.04em', textTransform: 'uppercase', borderBottom: `2px solid ${C.grey200}` }}>Stated Value</th>
              {TIERS.map(t => (
                <th key={t.key} style={{ textAlign: 'center', padding: '14px 18px', fontSize: '0.78rem', fontWeight: 700, color: t.color, letterSpacing: '0.04em', textTransform: 'uppercase', borderBottom: `2px solid ${t.color}` }}>
                  {t.key}
                  <div style={{ fontSize: '0.66rem', color: C.grey500, fontWeight: 600, marginTop: 3, textTransform: 'none', letterSpacing: 0 }}>
                    ${TIERS.find(x => x.key === t.key) && (t.key === 'Bronze' ? 499 : t.key === 'Silver' ? 399 : t.key === 'Gold' ? 299 : 0)} deposit
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? C.white : C.grey50 }}>
                <td style={{ padding: '18px 20px', fontWeight: 700, color: C.navy800, borderBottom: `1px solid ${C.grey200}` }}>
                  ${row.value.toLocaleString()}
                </td>
                {row.tierPrices.map(p => (
                  <td key={p.tier} style={{ padding: '18px 18px', textAlign: 'center', borderBottom: `1px solid ${C.grey200}`, borderLeft: `1px solid ${C.grey200}` }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: p.color, lineHeight: 1 }}>
                      ${p.total}<span style={{ fontSize: '0.7rem', color: C.grey500, fontWeight: 600 }}>/mo</span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: '16px 24px', background: C.green50, borderTop: `1px solid ${C.green100}`, fontSize: '0.83rem', color: C.grey700, lineHeight: 1.6 }}>
        <strong style={{ color: C.green700 }}>Compared to MBA:</strong> NA Silver runs <strong>10–15% below MBA</strong> at equal or better coverage limits — and our $0 Platinum tier eliminates the per-vehicle deposit entirely.{' '}
        <span onClick={() => { setPage('quote'); window.scrollTo(0,0) }} style={{ color: C.green700, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
          Get your exact quote →
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Tier Detail Cards — 4 expanded cards with full feature lists
// ─────────────────────────────────────────────────────────────
function TierDetailCards({ setPage }) {
  const tiers = [
    {
      name: 'Bronze',
      sublabel: 'Basic',
      color: C.navy500,
      deposit: 499,
      bi: '$15K / $30K',
      pd: '$5K',
      ded: '$2,500',
      fits: 'Budget-conscious operators with low-value units who want a baseline policy.',
      includes: ['Liability (state minimums)', 'Physical damage', '$33/mo flat fee', 'Monthly cancellation'],
      addOns: ['Roadside +$6/mo', 'PAI +$10/mo', 'PEC +$7/mo', 'SLI +$18/mo'],
    },
    {
      name: 'Silver',
      sublabel: 'Standard · Most Popular',
      color: C.green600,
      popular: true,
      deposit: 399,
      bi: '$100K / $300K',
      pd: '$50K',
      ded: '$2,000',
      fits: 'Most fleet operators — strong liability limits at competitive pricing. Our recommended tier.',
      includes: ['Liability ($100K/$300K)', 'Physical damage', 'Roadside Assistance', '$33/mo flat fee'],
      addOns: ['PAI +$10/mo', 'PEC +$7/mo', 'SLI +$18/mo'],
    },
    {
      name: 'Gold',
      sublabel: 'Premium',
      color: C.purple600,
      deposit: 299,
      bi: '$300K / $500K',
      pd: '$100K',
      ded: '$1,500',
      fits: 'Serious fleets that want broader limits and bundled add-ons in one package.',
      includes: ['Liability ($300K/$500K)', 'Physical damage', 'Roadside, PAI, PEC, SLI all included', '$33/mo flat fee'],
      addOns: ['No additional add-ons needed'],
    },
    {
      name: 'Platinum',
      sublabel: 'Elite',
      color: C.navy900,
      deposit: 0,
      bi: '$1M / $2M',
      pd: '$250K',
      ded: '$500',
      fits: 'Premium fleets, festival-route operators, and risk-averse multi-state operations. $0 deposit.',
      includes: ['Liability ($1M/$2M)', 'Physical damage ($500 ded)', 'Direct adjuster service', 'All add-ons included', '$0 deposit', '$33/mo flat fee'],
      addOns: ['No additional add-ons needed'],
    },
  ]

  return (
    <div style={{ marginBottom: 8 }}>
      <h3 style={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: 800, color: C.navy800, marginBottom: 8 }}>What's in Each Tier</h3>
      <p style={{ textAlign: 'center', color: C.grey600, fontSize: '0.92rem', marginBottom: 32, maxWidth: 580, margin: '0 auto 32px', lineHeight: 1.6 }}>
        All tiers share the same $33/mo transparent service fee, monthly cancellation policy, and Shield ADW eligibility.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {tiers.map(t => (
          <div key={t.name} style={{
            background: C.white,
            border: `2px solid ${t.popular ? t.color : C.grey200}`,
            borderRadius: 10,
            padding: 24,
            position: 'relative',
            boxShadow: t.popular ? `0 6px 24px ${t.color}25` : '0 2px 12px rgba(15,34,64,0.06)',
          }}>
            {t.popular && (
              <div style={{ position: 'absolute', top: -10, right: 16, padding: '4px 10px', background: t.color, color: C.white, fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em', borderRadius: 99 }}>
                MOST POPULAR
              </div>
            )}
            <div style={{ fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.color, marginBottom: 6 }}>
              {t.sublabel}
            </div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: C.navy800, margin: '0 0 16px' }}>{t.name}</h4>

            <div style={{ background: C.grey50, padding: '12px 14px', borderRadius: 6, marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', rowGap: 6, columnGap: 10, fontSize: '0.82rem' }}>
                <span style={{ color: C.grey600 }}>Bodily Injury</span>
                <span style={{ color: C.navy800, fontWeight: 700 }}>{t.bi}</span>
                <span style={{ color: C.grey600 }}>Property Damage</span>
                <span style={{ color: C.navy800, fontWeight: 700 }}>{t.pd}</span>
                <span style={{ color: C.grey600 }}>Deductible</span>
                <span style={{ color: C.navy800, fontWeight: 700 }}>{t.ded}</span>
                <span style={{ color: C.grey600 }}>Deposit</span>
                <span style={{ color: t.color, fontWeight: 800 }}>${t.deposit}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: C.grey600, lineHeight: 1.55, marginBottom: 16 }}>{t.fits}</p>

            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: C.green700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Included</div>
            <ul style={{ margin: '0 0 16px', paddingLeft: 18, fontSize: '0.82rem', color: C.grey700, lineHeight: 1.7 }}>
              {t.includes.map((inc, i) => <li key={i}>{inc}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
