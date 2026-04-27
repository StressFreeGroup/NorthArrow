import { useState, useMemo } from 'react'
import { Calculator, ArrowRight, Check, Info, AlertCircle, ChevronDown, ChevronUp, Shield, MapPin, Calendar, DollarSign, Truck, Users } from 'lucide-react'
import rateTables from './data/rate-tables.json'
import { generateQuote } from './lib/rateEngine.js'

const C = { navy900:'#0A1628', navy800:'#0F2240', navy700:'#132D5E', navy600:'#1A3F7A', navy500:'#2558A3', navy400:'#3B7DD8', navy300:'#6FA3E8', navy200:'#A8C8F0', navy100:'#D4E4F8', navy50:'#EBF2FB', green700:'#1B6E3D', green600:'#238B4E', green500:'#2EA663', green400:'#4CC07E', green100:'#D6F0E2', green50:'#F0FAF4', purple700:'#4A2D7A', purple600:'#5E3B99', purple500:'#7349B8', purple400:'#8F6DD0', purple100:'#E6DCF5', white:'#FFFFFF', grey50:'#F7F8FA', grey100:'#F0F2F5', grey200:'#E2E6EB', grey300:'#CDD3DB', grey400:'#9CA5B2', grey500:'#6B7685', grey600:'#4A5568', grey700:'#2D3748', red600:'#DC2626', red700:'#B91C1C', red50:'#FEF2F2', amber600:'#D97706', amber50:'#FFFBEB', amber200:'#FDE68A' }
const sWrap = { maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px,4vw,40px)' }

// US States list (CA highlighted as Phase 1)
const STATES = [
  ['CA','California — Phase 1 Launch'],
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CO','Colorado'],
  ['CT','Connecticut'],['DE','Delaware'],['DC','District of Columbia'],['FL','Florida'],
  ['GA','Georgia'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],
  ['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],
  ['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],
  ['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],
  ['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],
  ['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],
  ['RI','Rhode Island'],['SC','South Carolina'],['SD','South Dakota'],['TN','Tennessee'],
  ['TX','Texas'],['UT','Utah'],['VT','Vermont'],['VA','Virginia'],['WA','Washington'],
  ['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming']
]

const RV_TYPES = [
  { key: 'Travel Trailer', priority: 1, label: 'Travel Trailer', target: true },
  { key: 'Toy Hauler',     priority: 2, label: 'Toy Hauler',     target: true },
  { key: 'Class B',        priority: 3, label: 'Class B (Sprinter Van)', target: true },
  { key: 'Class C',        priority: 4, label: 'Class C',        target: true },
  { key: 'Class A',        priority: 5, label: 'Class A',        target: false },
  { key: 'Fifth Wheel',    priority: 6, label: 'Fifth Wheel',    target: false },
  { key: 'Pop Up',         priority: 7, label: 'Pop Up',         target: null },
  { key: 'Truck Camper',   priority: 8, label: 'Truck Camper',   target: null },
  { key: 'Park Model',     priority: 9, label: 'Park Model',     target: null },
]

const TIERS = [
  { key: 'Bronze',   label: 'Bronze',   sublabel: 'Basic',    deposit: 499, color: C.navy500,   bgAccent: C.navy50,    desc: '$15K/$30K BI · $5K PD · $2,500 ded' },
  { key: 'Silver',   label: 'Silver',   sublabel: 'Standard', deposit: 399, color: C.green600,  bgAccent: C.green50,   desc: '$100K/$300K BI · $50K PD · $2,000 ded · Roadside incl.' },
  { key: 'Gold',     label: 'Gold',     sublabel: 'Premium',  deposit: 299, color: C.purple600, bgAccent: C.purple100, desc: '$300K/$500K BI · $100K PD · $1,500 ded · SLI/PAI/PEC incl.' },
  { key: 'Platinum', label: 'Platinum', sublabel: 'Elite',    deposit: 0,   color: C.navy900,   bgAccent: C.grey100,   desc: '$1M/$2M BI · $250K PD · $500 ded · Direct adjuster · No deposit' },
]

// Currency formatter
const $ = (n) => n != null ? `$${Math.round(n).toLocaleString()}` : '—'

export default function QuotePage({ setPage }) {
  // Form state with sensible CA-default values
  const [form, setForm] = useState({
    rv_type: 'Travel Trailer',
    replacement_value: 45000,
    vehicle_year: 2022,
    vehicle_state: 'CA',
    coverage_tier: 'Silver',
    fleet_size: 1,
    owner_age: 35,
    odometer_miles: 35000,
    prior_claims_3yr: 0,
    vin_title_status: 'clean',
    credit_score_band: '700+',
    has_prior_commercial_insurance: true,
    multi_line_auto: false,
    multi_line_home: false,
    multi_line_life: false,
    affiliate_referral: false,
    add_sli: false,
    add_personal_accident: false,
    add_personal_effects: false,
    add_roadside: false,
    premier_owner_pct: 0,
    years_in_operation: 0,
  })

  const [showBreakdown, setShowBreakdown] = useState(false)

  // Calculate live quote on every form change
  const quote = useMemo(() => generateQuote(form, rateTables), [form])

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Section card helper styles
  const cardSx = { background: C.white, borderRadius: 10, padding: 28, border: `1px solid ${C.grey200}`, boxShadow: '0 2px 12px rgba(15,34,64,0.04)', marginBottom: 24 }
  const labelSx = { display: 'block', fontSize: '0.82rem', fontWeight: 700, color: C.grey700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }
  const inputSx = { width: '100%', padding: '12px 14px', fontSize: '0.95rem', border: `1.5px solid ${C.grey300}`, borderRadius: 6, background: C.white, color: C.navy800, fontFamily: 'inherit', outline: 'none', transition: 'border 0.15s' }
  const sectionTitle = { fontSize: '1.1rem', fontWeight: 700, color: C.navy800, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }

  return (
    <div style={{ paddingTop: 78, background: C.grey50, minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{
        background: `linear-gradient(135deg, ${C.navy800} 0%, ${C.navy700} 100%)`,
        padding: 'clamp(50px,7vw,90px) 0 clamp(40px,5vw,60px)',
        color: C.white,
      }}>
        <div style={sWrap}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.green400, marginBottom: 14 }}>
            Instant Quote · No Email Required
          </div>
          <h1 style={{ color: C.white, marginBottom: 14, fontSize: 'clamp(1.8rem,4vw,2.6rem)', lineHeight: 1.15 }}>
            Build Your Quote in 60 Seconds
          </h1>
          <p style={{ color: C.navy200, fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 640 }}>
            Transparent pricing. See your monthly premium, deposit, and full breakdown as you build your quote — no signup, no email gate, no sales call required to find out the cost.
          </p>
        </div>
      </section>

      {/* Quote Builder */}
      <section style={{ padding: 'clamp(40px,5vw,60px) 0' }}>
        <div style={sWrap}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 380px', gap: 32 }} className="quote-grid">

            {/* LEFT COLUMN — FORM */}
            <div>
              {/* Section 1: Vehicle */}
              <div style={cardSx}>
                <div style={sectionTitle}><Truck size={20} color={C.green600}/>Vehicle Details</div>

                <div style={{ marginBottom: 18 }}>
                  <label style={labelSx}>RV Type</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
                    {RV_TYPES.map(t => (
                      <button
                        key={t.key}
                        onClick={() => update('rv_type', t.key)}
                        style={{
                          padding: '10px 12px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          border: `1.5px solid ${form.rv_type === t.key ? C.green600 : C.grey300}`,
                          background: form.rv_type === t.key ? C.green50 : C.white,
                          color: form.rv_type === t.key ? C.green700 : C.grey700,
                          borderRadius: 6,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s',
                          position: 'relative',
                        }}
                      >
                        {t.target === true && <span style={{ position: 'absolute', top: 4, right: 6, fontSize: '0.65rem', color: C.green600, fontWeight: 700 }}>★</span>}
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: C.grey500, marginTop: 8 }}>
                    <span style={{ color: C.green600, fontWeight: 700 }}>★</span> = preferred (lower repair cost / favorable underwriting)
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
                  <div>
                    <label style={labelSx}>Replacement Value</label>
                    <div style={{ position: 'relative' }}>
                      <DollarSign size={16} color={C.grey400} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}/>
                      <input
                        type="number"
                        value={form.replacement_value}
                        onChange={e => update('replacement_value', Number(e.target.value) || 0)}
                        style={{ ...inputSx, paddingLeft: 32 }}
                        min={5000}
                        max={2500000}
                        step={5000}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelSx}>Year</label>
                    <input
                      type="number"
                      value={form.vehicle_year}
                      onChange={e => update('vehicle_year', Number(e.target.value) || 0)}
                      style={inputSx}
                      min={1990}
                      max={2027}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelSx}>State</label>
                    <select value={form.vehicle_state} onChange={e => update('vehicle_state', e.target.value)} style={inputSx}>
                      {STATES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelSx}>Odometer</label>
                    <input
                      type="number"
                      value={form.odometer_miles}
                      onChange={e => update('odometer_miles', Number(e.target.value) || 0)}
                      style={inputSx}
                      min={0}
                      max={250000}
                      step={1000}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Coverage Tier */}
              <div style={cardSx}>
                <div style={sectionTitle}><Shield size={20} color={C.green600}/>Coverage Tier</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                  {TIERS.map(t => {
                    const isSelected = form.coverage_tier === t.key
                    return (
                      <button
                        key={t.key}
                        onClick={() => update('coverage_tier', t.key)}
                        style={{
                          padding: '16px 14px',
                          textAlign: 'left',
                          background: isSelected ? t.color : C.white,
                          color: isSelected ? C.white : C.navy800,
                          border: `2px solid ${isSelected ? t.color : C.grey300}`,
                          borderRadius: 8,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          position: 'relative',
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: isSelected ? 'rgba(255,255,255,0.85)' : t.color, marginBottom: 4 }}>
                          {t.sublabel}
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 6 }}>{t.label}</div>
                        <div style={{ fontSize: '0.72rem', lineHeight: 1.5, color: isSelected ? 'rgba(255,255,255,0.85)' : C.grey500 }}>
                          {t.desc}
                        </div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, marginTop: 10, color: isSelected ? C.white : t.color }}>
                          Deposit: ${t.deposit}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Section 3: Fleet & Operator */}
              <div style={cardSx}>
                <div style={sectionTitle}><Users size={20} color={C.green600}/>Fleet & Operator</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 18 }}>
                  <div>
                    <label style={labelSx}>Fleet Size</label>
                    <input
                      type="number"
                      value={form.fleet_size}
                      onChange={e => update('fleet_size', Math.max(1, Number(e.target.value) || 1))}
                      style={inputSx}
                      min={1}
                      max={999}
                    />
                  </div>
                  <div>
                    <label style={labelSx}>Owner Age</label>
                    <input
                      type="number"
                      value={form.owner_age}
                      onChange={e => update('owner_age', Number(e.target.value) || 0)}
                      style={inputSx}
                      min={18}
                      max={99}
                    />
                  </div>
                  <div>
                    <label style={labelSx}>Years in Operation</label>
                    <input
                      type="number"
                      value={form.years_in_operation}
                      onChange={e => update('years_in_operation', Number(e.target.value) || 0)}
                      style={inputSx}
                      min={0}
                      max={50}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelSx}>Prior Claims (3 yr)</label>
                    <select value={form.prior_claims_3yr} onChange={e => update('prior_claims_3yr', Number(e.target.value))} style={inputSx}>
                      <option value={0}>None</option>
                      <option value={1}>1 claim</option>
                      <option value={2}>2 claims</option>
                      <option value={3}>3+ claims</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelSx}>Title Status</label>
                    <select value={form.vin_title_status} onChange={e => update('vin_title_status', e.target.value)} style={inputSx}>
                      <option value="clean">Clean</option>
                      <option value="salvage">Salvage</option>
                      <option value="flood">Flood (declined)</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelSx}>Credit Score</label>
                    <select value={form.credit_score_band} onChange={e => update('credit_score_band', e.target.value)} style={inputSx}>
                      <option value="700+">700+</option>
                      <option value="600-699">600-699</option>
                      <option value="<600">Below 600</option>
                    </select>
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, padding: '10px 12px', background: C.grey50, borderRadius: 6, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.has_prior_commercial_insurance}
                    onChange={e => update('has_prior_commercial_insurance', e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: C.green600 }}
                  />
                  <span style={{ fontSize: '0.9rem', color: C.grey700 }}>I have prior commercial insurance (avoids 10% surcharge)</span>
                </label>
              </div>

              {/* Section 4: Discounts */}
              <div style={cardSx}>
                <div style={sectionTitle}><Check size={20} color={C.green600}/>Bundle Discounts (optional)</div>
                <div style={{ fontSize: '0.85rem', color: C.grey500, marginBottom: 14 }}>
                  Stack up to 30% in discounts. Multi-line bundles available through North Arrow partner agencies.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                  {[
                    ['multi_line_auto', 'Personal Auto Bundle', '5%'],
                    ['multi_line_home', 'Homeowners Bundle', '5%'],
                    ['multi_line_life', 'Life Insurance Bundle', '2.5%'],
                    ['affiliate_referral', 'Referral / P2PRVS Affiliate', '2.5%'],
                  ].map(([key, label, pct]) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: `1.5px solid ${form[key] ? C.green600 : C.grey300}`, background: form[key] ? C.green50 : C.white, borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s' }}>
                      <input
                        type="checkbox"
                        checked={form[key]}
                        onChange={e => update(key, e.target.checked)}
                        style={{ width: 18, height: 18, cursor: 'pointer', accentColor: C.green600 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: C.navy800 }}>{label}</div>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: C.green600 }}>-{pct}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section 5: Add-Ons */}
              <div style={cardSx}>
                <div style={sectionTitle}><Info size={20} color={C.green600}/>Optional Add-Ons</div>
                <div style={{ fontSize: '0.85rem', color: C.grey500, marginBottom: 14 }}>
                  Items shown below are <strong>only added</strong> if not already included in your tier. Gold/Platinum include SLI, PAI, PEC, and Roadside automatically.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                  {[
                    ['add_sli', 'Supplemental Liability (SLI)', '$18/mo', ['Gold','Platinum']],
                    ['add_personal_accident', 'Personal Accident Ins', '$10/mo', ['Gold','Platinum']],
                    ['add_personal_effects', 'Personal Effects Coverage', '$7/mo', ['Gold','Platinum']],
                    ['add_roadside', 'Roadside Assistance', '$6/mo', ['Silver','Gold','Platinum']],
                  ].map(([key, label, price, includedIn]) => {
                    const isIncluded = includedIn.includes(form.coverage_tier)
                    return (
                      <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: `1.5px solid ${isIncluded ? C.green600 : (form[key] ? C.green600 : C.grey300)}`, background: isIncluded ? C.green50 : (form[key] ? C.green50 : C.white), borderRadius: 6, cursor: isIncluded ? 'default' : 'pointer', opacity: isIncluded ? 0.85 : 1, transition: 'all 0.15s' }}>
                        {isIncluded ? (
                          <Check size={18} color={C.green600}/>
                        ) : (
                          <input
                            type="checkbox"
                            checked={form[key]}
                            onChange={e => update(key, e.target.checked)}
                            style={{ width: 18, height: 18, cursor: 'pointer', accentColor: C.green600 }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: C.navy800 }}>{label}</div>
                          <div style={{ fontSize: '0.74rem', color: isIncluded ? C.green700 : C.grey500, marginTop: 2 }}>
                            {isIncluded ? `Included in ${form.coverage_tier}` : price}
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN — STICKY QUOTE PANEL */}
            <div>
              <div style={{ position: 'sticky', top: 100, ...cardSx, padding: 0, overflow: 'hidden', marginBottom: 0 }}>
                {quote.declined ? (
                  <DeclinedPanel reason={quote.decline_reason} setPage={setPage}/>
                ) : (
                  <ApprovedPanel
                    quote={quote}
                    form={form}
                    showBreakdown={showBreakdown}
                    setShowBreakdown={setShowBreakdown}
                    setPage={setPage}
                  />
                )}
              </div>

              {/* Disclosure */}
              <div style={{ fontSize: '0.78rem', color: C.grey500, lineHeight: 1.65, marginTop: 16, padding: '0 4px' }}>
                <strong style={{ color: C.grey700 }}>Disclosure:</strong> This is an indicative quote based on the inputs provided. Final premium subject to underwriting review, vehicle inspection, and verification of driving history. Coverage subject to state availability. North Arrow is currently launching in California with expansion to NV, AZ, OR, WA in 2027.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile responsive override */}
      <style>{`
        @media (max-width: 980px) {
          .quote-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

// ───────── DECLINED PANEL ─────────
function DeclinedPanel({ reason, setPage }) {
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${C.amber600} 0%, #B85708 100%)`, padding: '28px 24px', color: C.white }}>
        <AlertCircle size={32} style={{ marginBottom: 10 }}/>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 6 }}>Manual Review Needed</div>
        <div style={{ fontSize: '0.88rem', lineHeight: 1.6, opacity: 0.94 }}>{reason}</div>
      </div>
      <div style={{ padding: 24 }}>
        <p style={{ fontSize: '0.92rem', color: C.grey700, lineHeight: 1.65, marginBottom: 18 }}>
          Some applications require additional review. Speak with one of our underwriters about whether North Arrow is a fit for your fleet.
        </p>
        <button
          onClick={() => { setPage('contact'); window.scrollTo(0, 0) }}
          style={{
            width: '100%', padding: '14px', background: C.navy700, color: C.white,
            borderRadius: 6, fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >Contact an Underwriter <ArrowRight size={16}/></button>
      </div>
    </div>
  )
}

// ───────── APPROVED PANEL ─────────
function ApprovedPanel({ quote, form, showBreakdown, setShowBreakdown, setPage }) {
  const tier = TIERS.find(t => t.key === form.coverage_tier)

  return (
    <div>
      {/* Tier banner */}
      <div style={{ background: `linear-gradient(135deg, ${tier.color} 0%, ${tier.color}DD 100%)`, padding: '20px 24px', color: C.white }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.85, marginBottom: 4 }}>
          Your Quote · {tier.label} Tier
        </div>
        <div style={{ fontSize: '0.88rem', opacity: 0.92 }}>
          {form.fleet_size} {form.fleet_size === 1 ? 'unit' : 'units'} · {form.rv_type} · {form.vehicle_state}
        </div>
      </div>

      {/* Headline price */}
      <div style={{ padding: '32px 24px 20px', textAlign: 'center', borderBottom: `1px solid ${C.grey200}` }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.grey500, marginBottom: 8 }}>
          Per-Vehicle Monthly
        </div>
        <div style={{ fontSize: '3.4rem', fontWeight: 800, color: C.navy800, lineHeight: 1, marginBottom: 4 }}>
          {$(quote.monthly_total)}<span style={{ fontSize: '1rem', fontWeight: 600, color: C.grey500 }}>/mo</span>
        </div>
        <div style={{ fontSize: '0.85rem', color: C.grey500 }}>
          {$(quote.monthly_premium)} premium + ${quote.monthly_fee} NA service fee
        </div>
      </div>

      {/* Detail line items */}
      <div style={{ padding: '20px 24px' }}>
        {[
          ['Annual Premium (per vehicle)', $(quote.annual_premium)],
          ['Binding Deposit (one-time)', $(quote.deposit)],
          ['First Payment Due', $(quote.first_payment)],
        ].map(([label, val]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.9rem' }}>
            <span style={{ color: C.grey600 }}>{label}</span>
            <span style={{ color: C.navy800, fontWeight: 700 }}>{val}</span>
          </div>
        ))}

        {form.fleet_size > 1 && (
          <div style={{ marginTop: 14, padding: 14, background: C.green50, borderRadius: 6, border: `1px solid ${C.green100}` }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.green700, marginBottom: 6 }}>
              Fleet Total ({form.fleet_size} units)
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: 4 }}>
              <span style={{ color: C.grey600 }}>Monthly</span>
              <span style={{ color: C.navy800, fontWeight: 700 }}>{$(quote.fleet_total_monthly)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
              <span style={{ color: C.grey600 }}>Annual</span>
              <span style={{ color: C.navy800, fontWeight: 700 }}>{$(quote.fleet_total_annual)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Toggle breakdown */}
      <button
        onClick={() => setShowBreakdown(b => !b)}
        style={{ width: '100%', padding: '12px 24px', background: C.grey50, color: C.grey700, border: 'none', borderTop: `1px solid ${C.grey200}`, borderBottom: showBreakdown ? `1px solid ${C.grey200}` : 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
      >
        {showBreakdown ? 'Hide' : 'Show'} calculation breakdown
        {showBreakdown ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
      </button>

      {showBreakdown && (
        <div style={{ padding: '16px 24px', background: C.grey50, fontSize: '0.82rem' }}>
          {[
            ['Base rate', $(quote.breakdown.base_rate)],
            ['× Value multiplier', `× ${quote.breakdown.value_mult.toFixed(2)}`],
            ['× State multiplier', `× ${quote.breakdown.state_mult.toFixed(2)}`],
            ['× Age multiplier', `× ${quote.breakdown.age_mult.toFixed(2)}`],
            ['Subtotal (pre-discount)', $(quote.breakdown.pre_discount_monthly)],
            ['Discount applied', `-${(quote.breakdown.total_discount_pct * 100).toFixed(1)}%`],
            ['Surcharge multiplier', `× ${quote.breakdown.surcharge_mult.toFixed(2)}`],
            ['+ NA service fee', `+ $33`],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: C.grey600 }}>
              <span>{label}</span>
              <span style={{ fontFamily: 'ui-monospace, monospace', color: C.navy800 }}>{val}</span>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div style={{ padding: 24, borderTop: `1px solid ${C.grey200}` }}>
        <button
          onClick={() => { setPage('apply'); window.scrollTo(0, 0) }}
          style={{
            width: '100%', padding: '15px 20px',
            background: C.green600, color: C.white,
            borderRadius: 6, fontWeight: 700, fontSize: '0.95rem',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >Continue to Application <ArrowRight size={17}/></button>
        <button
          onClick={() => { setPage('contact'); window.scrollTo(0, 0) }}
          style={{
            width: '100%', padding: '12px 20px', marginTop: 10,
            background: 'transparent', color: C.navy700,
            border: `1.5px solid ${C.navy700}`, borderRadius: 6,
            fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
          }}
        >Talk to an Agent</button>
      </div>
    </div>
  )
}
