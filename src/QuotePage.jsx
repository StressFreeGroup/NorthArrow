import { useState, useMemo } from 'react'
import { ArrowRight, Check, Info, AlertCircle, ChevronDown, ChevronUp, Shield, DollarSign, Truck, Users, Plus, Trash2, X } from 'lucide-react'
import rateTables from './data/rate-tables.json'
import { generateQuote } from './lib/rateEngine.js'

const C = { navy900:'#0A1628', navy800:'#0F2240', navy700:'#132D5E', navy600:'#1A3F7A', navy500:'#2558A3', navy400:'#3B7DD8', navy300:'#6FA3E8', navy200:'#A8C8F0', navy100:'#D4E4F8', navy50:'#EBF2FB', green700:'#1B6E3D', green600:'#238B4E', green500:'#2EA663', green400:'#4CC07E', green100:'#D6F0E2', green50:'#F0FAF4', purple700:'#4A2D7A', purple600:'#5E3B99', purple500:'#7349B8', purple400:'#8F6DD0', purple100:'#E6DCF5', white:'#FFFFFF', grey50:'#F7F8FA', grey100:'#F0F2F5', grey200:'#E2E6EB', grey300:'#CDD3DB', grey400:'#9CA5B2', grey500:'#6B7685', grey600:'#4A5568', grey700:'#2D3748', red600:'#DC2626', red700:'#B91C1C', red50:'#FEF2F2', amber600:'#D97706', amber50:'#FFFBEB', amber200:'#FDE68A' }
const sWrap = { maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px,4vw,40px)' }

const STATES = [
  ['CA','California'],
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

// VEHICLE CATEGORIES — towable units have no odometer
const TOWABLE_TYPES = [
  { key: 'Travel Trailer', label: 'Travel Trailer' },
  { key: 'Toy Hauler',     label: 'Toy Hauler' },
  { key: 'Fifth Wheel',    label: 'Fifth Wheel' },
  { key: 'Pop Up',         label: 'Pop Up' },
]
const DRIVEABLE_TYPES = [
  { key: 'Class A',      label: 'Class A' },
  { key: 'Class B',      label: 'Class B (Sprinter Van)' },
  { key: 'Class C',      label: 'Class C' },
  { key: 'Truck Camper', label: 'Truck Camper' },
]

const TIERS = [
  { key: 'Bronze',   label: 'Bronze',   sublabel: 'Basic',    deposit: 499, color: C.navy500,   bgAccent: C.navy50,    desc: '$15K/$30K BI · $5K PD · $2,500 ded' },
  { key: 'Silver',   label: 'Silver',   sublabel: 'Standard', deposit: 399, color: C.green600,  bgAccent: C.green50,   desc: '$100K/$300K BI · $50K PD · $2,000 ded · Roadside incl.' },
  { key: 'Gold',     label: 'Gold',     sublabel: 'Premium',  deposit: 299, color: C.purple600, bgAccent: C.purple100, desc: '$300K/$500K BI · $100K PD · $1,500 ded · SLI/PAI/PEC incl.' },
  { key: 'Platinum', label: 'Platinum', sublabel: 'Elite',    deposit: 0,   color: C.navy900,   bgAccent: C.grey100,   desc: '$1M/$2M BI · $250K PD · $500 ded · Direct adjuster · No deposit' },
]

const ADDONS = [
  {
    key: 'add_sli',
    short: 'SLI',
    label: 'Supplemental Liability',
    price: '$18/mo',
    includedIn: ['Gold','Platinum'],
    info: 'Adds an additional layer of liability protection above the base tier limits. Critical for high-value claims involving bodily injury or property damage that exceed standard policy maximums. Strongly recommended for fleets renting in high-traffic urban areas, near major events, or when renters have limited personal auto coverage.',
  },
  {
    key: 'add_personal_accident',
    short: 'PAI',
    label: 'Personal Accident Insurance',
    price: '$10/mo',
    includedIn: ['Gold','Platinum'],
    info: 'Provides medical coverage for the renter and passengers in the event of an accident during the rental period. Includes ER costs, hospitalization, and accidental death benefits. Reduces the chance of medical-related claims being filed against the host or vehicle policy.',
  },
  {
    key: 'add_personal_effects',
    short: 'PEC',
    label: 'Personal Effects Coverage',
    price: '$7/mo',
    includedIn: ['Gold','Platinum'],
    info: 'Protects the renter\'s personal belongings (electronics, clothing, gear, sports equipment) inside the RV against theft, fire, and accidental damage. Reduces friction at trip-end disputes by giving renters their own coverage path for lost items rather than blaming the host.',
  },
  {
    key: 'add_roadside',
    short: 'Roadside',
    label: 'Roadside Assistance',
    price: '$6/mo',
    includedIn: ['Silver','Gold','Platinum'],
    info: '24/7 emergency roadside service across the continental US: towing, lockout, jumpstart, fuel delivery, and tire change. Covers both mechanical breakdown and roadside emergencies. Reduces guest stress during the rental and prevents host calls at 2am.',
  },
]

const $ = (n) => n != null ? `$${Math.round(n).toLocaleString()}` : '—'

const defaultDOB = (() => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 35)
  return d.toISOString().slice(0, 10)
})()
const todayISO = new Date().toISOString().slice(0, 10)
const minDOB = '1900-01-01'

const newVehicle = (overrides = {}) => ({
  id: Math.random().toString(36).slice(2, 10),
  rv_category: 'towable',
  rv_type: 'Travel Trailer',
  replacement_value: 35000,
  vehicle_year: 2022,
  vehicle_state: 'CA',
  odometer_miles: 0,
  coverage_tier: 'Silver',
  add_sli: false,
  add_personal_accident: false,
  add_personal_effects: false,
  add_roadside: false,
  ...overrides,
})

export default function QuotePage({ setPage }) {
  const [form, setForm] = useState({
    vehicles: [newVehicle()],
    owner_birthdate: defaultDOB,
    years_in_operation: 0,
    prior_claims_3yr: 0,
    vin_title_status: 'clean',
    credit_score_band: '700+',
    has_prior_commercial_insurance: true,
    multi_line_auto: false,
    multi_line_home: false,
    multi_line_life: false,
    referral_source: '',
    referral_source_other: '',
  })

  const [showBreakdown, setShowBreakdown] = useState(false)

  const vehicleQuotes = useMemo(() => form.vehicles.map(v => {
    const inputs = {
      owner_birthdate: form.owner_birthdate,
      years_in_operation: form.years_in_operation,
      prior_claims_3yr: form.prior_claims_3yr,
      vin_title_status: form.vin_title_status,
      credit_score_band: form.credit_score_band,
      has_prior_commercial_insurance: form.has_prior_commercial_insurance,
      multi_line_auto: form.multi_line_auto,
      multi_line_home: form.multi_line_home,
      multi_line_life: form.multi_line_life,
      affiliate_referral: false,
      premier_owner_pct: 0,
      rv_type: v.rv_type,
      replacement_value: v.replacement_value,
      vehicle_year: v.vehicle_year,
      vehicle_state: v.vehicle_state,
      odometer_miles: v.rv_category === 'towable' ? 0 : v.odometer_miles,
      coverage_tier: v.coverage_tier,
      add_sli: v.add_sli,
      add_personal_accident: v.add_personal_accident,
      add_personal_effects: v.add_personal_effects,
      add_roadside: v.add_roadside,
      fleet_size: form.vehicles.length,
    }
    return { ...v, quote: generateQuote(inputs, rateTables) }
  }), [form])

  const summary = useMemo(() => {
    const declined = vehicleQuotes.filter(v => v.quote.declined)
    const approved = vehicleQuotes.filter(v => !v.quote.declined)
    return {
      declined,
      approved,
      anyDeclined: declined.length > 0,
      allDeclined: approved.length === 0 && declined.length > 0,
      totalMonthly: approved.reduce((s, v) => s + (v.quote.monthly_total || 0), 0),
      totalAnnual:  approved.reduce((s, v) => s + (v.quote.annual_premium || 0), 0),
      totalDeposit: approved.reduce((s, v) => s + (v.quote.deposit || 0), 0),
      totalFirst:   approved.reduce((s, v) => s + (v.quote.first_payment || 0), 0),
    }
  }, [vehicleQuotes])

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const updateVehicle = (id, k, v) => setForm(f => ({
    ...f,
    vehicles: f.vehicles.map(veh => veh.id === id ? { ...veh, [k]: v } : veh)
  }))
  const addVehicle = () => {
    const last = form.vehicles[form.vehicles.length - 1]
    setForm(f => ({ ...f, vehicles: [...f.vehicles, newVehicle({ vehicle_state: last.vehicle_state })] }))
  }
  const removeVehicle = (id) => setForm(f => ({
    ...f,
    vehicles: f.vehicles.filter(v => v.id !== id)
  }))

  const cardSx = { background: C.white, borderRadius: 10, padding: 28, border: `1px solid ${C.grey200}`, boxShadow: '0 2px 12px rgba(15,34,64,0.04)', marginBottom: 24 }
  const labelSx = { display: 'block', fontSize: '0.82rem', fontWeight: 700, color: C.grey700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }
  const inputSx = { width: '100%', padding: '12px 14px', fontSize: '0.95rem', border: `1.5px solid ${C.grey300}`, borderRadius: 6, background: C.white, color: C.navy800, fontFamily: 'inherit', outline: 'none', transition: 'border 0.15s', boxSizing: 'border-box' }
  const sectionTitle = { fontSize: '1.1rem', fontWeight: 700, color: C.navy800, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }

  return (
    <div style={{ paddingTop: 78, background: C.grey50, minHeight: '100vh' }}>
      <section style={{
        background: `linear-gradient(135deg, ${C.navy800} 0%, ${C.navy700} 100%)`,
        padding: 'clamp(50px,7vw,90px) 0 clamp(40px,5vw,60px)',
        color: C.white,
      }}>
        <div style={sWrap}>
          {/* Two-step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', background: 'rgba(76,192,126,0.15)', border: `1px solid ${C.green400}`, borderRadius: 99 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: C.green500, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800 }}>1</div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: C.green400, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Get Quote</span>
            </div>
            <div style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.25)' }}/>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 99, opacity: 0.6 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800 }}>2</div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Submit Application</span>
            </div>
          </div>
          <h1 style={{ color: C.white, marginBottom: 14, fontSize: 'clamp(1.8rem,4vw,2.6rem)', lineHeight: 1.15 }}>
            Step 1 — Build Your Quote
          </h1>
          <p style={{ color: C.navy200, fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 720 }}>
            Add each vehicle and pick coverage to see live pricing. No email gate, no commitment — this is your pricing preview. When you're ready to bind coverage, your quote carries forward into the formal application automatically.
          </p>
        </div>
      </section>

      <section style={{ padding: 'clamp(40px,5vw,60px) 0' }}>
        <div style={sWrap}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 380px', gap: 32 }} className="quote-grid">

            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{ ...sectionTitle, marginBottom: 0 }}>
                    <Truck size={20} color={C.green600}/>Your Fleet ({form.vehicles.length} {form.vehicles.length === 1 ? 'vehicle' : 'vehicles'})
                  </div>
                </div>

                {form.vehicles.map((v, idx) => (
                  <VehicleCard
                    key={v.id}
                    vehicle={v}
                    index={idx}
                    canRemove={form.vehicles.length > 1}
                    onChange={(k, val) => updateVehicle(v.id, k, val)}
                    onRemove={() => removeVehicle(v.id)}
                    quote={vehicleQuotes[idx]?.quote}
                    cardSx={cardSx}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />
                ))}

                <button
                  onClick={addVehicle}
                  style={{
                    width: '100%',
                    padding: '20px',
                    background: C.white,
                    border: `2px dashed ${C.green500}`,
                    borderRadius: 10,
                    cursor: 'pointer',
                    color: C.green700,
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.green50; e.currentTarget.style.borderColor = C.green600 }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.white; e.currentTarget.style.borderColor = C.green500 }}
                >
                  <Plus size={18}/>Add Another Vehicle
                </button>

                <div style={{ fontSize: '0.78rem', color: C.grey500, lineHeight: 1.6, marginTop: 14, padding: '0 4px' }}>
                  Most fleets contain different vehicle types and values — add each one individually for accurate quoting. Fleet discounts apply automatically: <strong>3-4 units 5% · 5-10 units 6% · 11-24 units 8% · 25-49 units 10% · 50+ units 15%.</strong>
                </div>
              </div>

              <div style={cardSx}>
                <div style={sectionTitle}><Users size={20} color={C.green600}/>Fleet Operator Information</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
                  <div>
                    <label style={labelSx}>Owner Date of Birth</label>
                    <input
                      type="date"
                      value={form.owner_birthdate}
                      onChange={e => update('owner_birthdate', e.target.value)}
                      style={inputSx}
                      min={minDOB}
                      max={todayISO}
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

              {/* BUNDLE DISCOUNTS — table-row layout with HR dividers, NO card grid */}
              <div style={cardSx}>
                <div style={sectionTitle}><Check size={20} color={C.green600}/>Bundle Discounts (optional)</div>
                <div style={{ fontSize: '0.85rem', color: C.grey500, marginBottom: 18 }}>
                  Each multi-line policy you bring saves 1% off premium. Stack all three for 3% off.
                </div>
                <div style={{ background: C.grey50, borderRadius: 8, overflow: 'hidden' }}>
                  {[
                    ['multi_line_auto', 'Personal Auto', 'Existing personal auto policy with another carrier', '1% off'],
                    ['multi_line_home', 'Homeowners',    'Existing home or condo insurance policy',          '1% off'],
                    ['multi_line_life', 'Life Insurance', 'Existing term or whole life insurance policy',     '1% off'],
                  ].map(([key, label, desc, badge], i, arr) => (
                    <label key={key} style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '16px 18px',
                      borderBottom: i < arr.length - 1 ? `1px solid ${C.grey200}` : 'none',
                      cursor: 'pointer',
                      background: form[key] ? C.green50 : 'transparent',
                      transition: 'background 0.15s',
                    }}>
                      <input
                        type="checkbox"
                        checked={form[key]}
                        onChange={e => update(key, e.target.checked)}
                        style={{ width: 20, height: 20, cursor: 'pointer', accentColor: C.green600, flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: C.navy800 }}>{label}</div>
                        <div style={{ fontSize: '0.8rem', color: C.grey500, marginTop: 2 }}>{desc}</div>
                      </div>
                      <div style={{
                        flexShrink: 0,
                        padding: '6px 12px',
                        background: form[key] ? C.green600 : C.white,
                        color: form[key] ? C.white : C.green700,
                        border: `1.5px solid ${C.green600}`,
                        borderRadius: 99,
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                      }}>{badge}</div>
                    </label>
                  ))}
                </div>
              </div>

              {/* REFERRAL SOURCE — tracking only, NOT a discount */}
              <div style={cardSx}>
                <div style={sectionTitle}><Info size={20} color={C.green600}/>How did you hear about us?</div>
                <div style={{ fontSize: '0.85rem', color: C.grey500, marginBottom: 14 }}>
                  Helps us know which channels are working. This does not affect your quote.
                </div>
                <select
                  value={form.referral_source}
                  onChange={e => update('referral_source', e.target.value)}
                  style={inputSx}
                >
                  <option value="">Select a referral source…</option>
                  <option value="google">Google</option>
                  <option value="ai_search">AI search (ChatGPT, Claude, etc.)</option>
                  <option value="stress_free_rvs">Stress Free RVs</option>
                  <option value="p2prvs">P2PRVS</option>
                  <option value="other">Not listed (specify below)</option>
                  <option value="prefer_not_to_say">None — prefer not to say</option>
                </select>
                {form.referral_source === 'other' && (
                  <div style={{ marginTop: 14 }}>
                    <label style={{ ...labelSx, fontSize: '0.78rem' }}>Please specify</label>
                    <input
                      type="text"
                      value={form.referral_source_other}
                      onChange={e => update('referral_source_other', e.target.value)}
                      placeholder="e.g., a friend, a podcast, an industry event…"
                      style={inputSx}
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <div style={{ position: 'sticky', top: 100, ...cardSx, padding: 0, overflow: 'hidden', marginBottom: 0 }}>
                {summary.allDeclined ? (
                  <DeclinedPanel reason={summary.declined[0]?.quote?.decline_reason} setPage={setPage}/>
                ) : (
                  <FleetQuotePanel
                    summary={summary}
                    vehicleQuotes={vehicleQuotes}
                    form={form}
                    showBreakdown={showBreakdown}
                    setShowBreakdown={setShowBreakdown}
                    setPage={setPage}
                  />
                )}
              </div>

              {/* DRAFT QUOTE DISCLAIMER — prominent, full color-blocked */}
              <div style={{ marginTop: 16, padding: '18px 20px', background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <AlertCircle size={16} color="#92400E"/>
                  <strong style={{ color: '#92400E', fontSize: '0.82rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>This is a Draft Quote — Not a Binding Offer</strong>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#78350F', lineHeight: 1.6 }}>
                  Pricing shown is a preliminary estimate based on the inputs you've provided. North Arrow is not bound to these rates. Final premium and final eligibility are determined during underwriting review and may adjust based on factors not captured at this stage — including vehicle inspection, motor vehicle reports (MVR), insurance loss history, business credit, and verification of declared values, mileage, and driving records.
                </div>
              </div>

              {/* Standard disclosure */}
              <div style={{ fontSize: '0.74rem', color: C.grey500, lineHeight: 1.6, marginTop: 12, padding: '0 4px' }}>
                Coverage is subject to state availability. Quote inputs are not stored on our servers. Quote ID is generated only upon binding. By continuing to the application, you agree this preliminary draft does not create any obligation on the part of North Arrow Commercial Insurance Services to bind coverage at the rates shown.
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 980px) {
          .quote-grid { grid-template-columns: 1fr !important; }
          .quote-grid > div:last-child > div:first-child { position: static !important; }
        }
      `}</style>
    </div>
  )
}

function VehicleCard({ vehicle, index, canRemove, onChange, onRemove, quote, cardSx, labelSx, inputSx }) {
  const [openInfo, setOpenInfo] = useState(null)
  const v = vehicle
  const isTowable = v.rv_category === 'towable'
  const types = isTowable ? TOWABLE_TYPES : DRIVEABLE_TYPES

  const switchCategory = (newCat) => {
    onChange('rv_category', newCat)
    const validTypes = newCat === 'towable' ? TOWABLE_TYPES : DRIVEABLE_TYPES
    const stillValid = validTypes.find(t => t.key === v.rv_type)
    if (!stillValid) onChange('rv_type', validTypes[0].key)
    if (newCat === 'towable') onChange('odometer_miles', 0)
  }

  return (
    <div style={{ ...cardSx, position: 'relative', borderLeft: `4px solid ${C.green500}`, paddingLeft: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, paddingBottom: 16, borderBottom: `1px solid ${C.grey200}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: C.green600, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.92rem' }}>
            {index + 1}
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: C.navy800, lineHeight: 1.2 }}>
              Vehicle #{index + 1}
            </div>
            <div style={{ fontSize: '0.82rem', color: C.grey500, marginTop: 2 }}>
              {v.vehicle_year} {v.rv_type} · {v.vehicle_state}
              {quote && !quote.declined && <span style={{ color: C.green700, fontWeight: 700 }}> · {$(quote.monthly_total)}/mo</span>}
              {quote?.declined && <span style={{ color: C.amber600, fontWeight: 700 }}> · Manual review needed</span>}
            </div>
          </div>
        </div>
        {canRemove && (
          <button
            onClick={onRemove}
            style={{
              padding: '8px 12px',
              background: 'transparent',
              border: `1px solid ${C.grey300}`,
              borderRadius: 6,
              cursor: 'pointer',
              color: C.grey600,
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.red50; e.currentTarget.style.borderColor = C.red600; e.currentTarget.style.color = C.red600 }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.grey300; e.currentTarget.style.color = C.grey600 }}
          >
            <Trash2 size={14}/>Remove
          </button>
        )}
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={labelSx}>Vehicle Category</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, background: C.grey100, borderRadius: 8, padding: 4 }}>
          {[
            { key: 'towable',   label: 'Towable',   sub: 'Trailer · 5th Wheel · Pop Up' },
            { key: 'driveable', label: 'Driveable', sub: 'Class A · B · C · Truck Camper' },
          ].map(c => (
            <button
              key={c.key}
              onClick={() => switchCategory(c.key)}
              style={{
                padding: '12px 16px',
                background: v.rv_category === c.key ? C.white : 'transparent',
                color: v.rv_category === c.key ? C.green700 : C.grey600,
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.92rem',
                textAlign: 'center',
                transition: 'all 0.15s',
                boxShadow: v.rv_category === c.key ? '0 2px 6px rgba(15,34,64,0.08)' : 'none',
              }}
            >
              <div>{c.label}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 500, color: v.rv_category === c.key ? C.grey500 : C.grey400, marginTop: 2 }}>{c.sub}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={labelSx}>RV Type</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
          {types.map(t => (
            <button
              key={t.key}
              onClick={() => onChange('rv_type', t.key)}
              style={{
                padding: '10px 12px',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: `1.5px solid ${v.rv_type === t.key ? C.green600 : C.grey300}`,
                background: v.rv_type === t.key ? C.green50 : C.white,
                color: v.rv_type === t.key ? C.green700 : C.grey700,
                borderRadius: 6,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
        <div>
          <label style={labelSx}>Stated Value</label>
          <div style={{ position: 'relative' }}>
            <DollarSign size={16} color={C.grey400} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}/>
            <input
              type="number"
              value={v.replacement_value}
              onChange={e => onChange('replacement_value', Number(e.target.value) || 0)}
              style={{ ...inputSx, paddingLeft: 32 }}
              min={5000}
              max={2500000}
              step={500}
            />
          </div>
        </div>
        <div>
          <label style={labelSx}>Year</label>
          <input
            type="number"
            value={v.vehicle_year}
            onChange={e => onChange('vehicle_year', Number(e.target.value) || 0)}
            style={inputSx}
            min={2016}
            max={2027}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div>
          <label style={labelSx}>State</label>
          <select value={v.vehicle_state} onChange={e => onChange('vehicle_state', e.target.value)} style={inputSx}>
            {STATES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
        </div>
        <div>
          <label style={{ ...labelSx, color: isTowable ? C.grey400 : C.grey700 }}>
            Odometer {isTowable && <span style={{ textTransform: 'none', fontWeight: 500, color: C.grey400, letterSpacing: 0 }}> — N/A for towable</span>}
          </label>
          <input
            type="number"
            value={isTowable ? '' : v.odometer_miles}
            onChange={e => onChange('odometer_miles', Number(e.target.value) || 0)}
            disabled={isTowable}
            placeholder={isTowable ? 'Not applicable' : 'Miles'}
            style={{ ...inputSx, opacity: isTowable ? 0.5 : 1, cursor: isTowable ? 'not-allowed' : 'text', background: isTowable ? C.grey100 : C.white }}
            min={0}
            max={250000}
            step={1000}
          />
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={labelSx}>Coverage Tier (this vehicle)</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {TIERS.map(t => {
            const isSelected = v.coverage_tier === t.key
            return (
              <button
                key={t.key}
                onClick={() => onChange('coverage_tier', t.key)}
                style={{
                  padding: '16px 16px',
                  textAlign: 'left',
                  background: isSelected ? t.color : C.white,
                  color: isSelected ? C.white : C.navy800,
                  border: `2px solid ${isSelected ? t.color : C.grey300}`,
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  position: 'relative',
                  minHeight: 130,
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: isSelected ? 'rgba(255,255,255,0.85)' : t.color, marginBottom: 4 }}>
                  {t.sublabel}
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 8, lineHeight: 1.1 }}>{t.label}</div>
                <div style={{ fontSize: '0.74rem', lineHeight: 1.5, color: isSelected ? 'rgba(255,255,255,0.85)' : C.grey500 }}>
                  {t.desc}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, marginTop: 10, color: isSelected ? C.white : t.color }}>
                  Deposit: ${t.deposit}
                </div>
                {isSelected && <Check size={16} style={{ position: 'absolute', top: 14, right: 14 }}/>}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label style={labelSx}>Optional Add-Ons (this vehicle)</label>
        <div style={{ fontSize: '0.78rem', color: C.grey500, marginBottom: 12, lineHeight: 1.55 }}>
          Tier-included items show a checkmark. Click <Info size={12} style={{ display: 'inline', verticalAlign: -2 }}/> for details.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="addons-grid">
          {ADDONS.map(addon => {
            const isIncluded = addon.includedIn.includes(v.coverage_tier)
            const checked = v[addon.key]
            const showInfo = openInfo === addon.key
            return (
              <div key={addon.key} style={{ position: 'relative' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '12px 14px',
                    border: `1.5px solid ${isIncluded ? C.green600 : (checked ? C.green600 : C.grey300)}`,
                    background: isIncluded ? C.green50 : (checked ? C.green50 : C.white),
                    borderRadius: 6,
                    opacity: isIncluded ? 0.95 : 1,
                    transition: 'all 0.15s',
                  }}
                >
                  {isIncluded ? (
                    <Check size={18} color={C.green600} style={{ marginTop: 2, flexShrink: 0 }}/>
                  ) : (
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={e => onChange(addon.key, e.target.checked)}
                      style={{ width: 18, height: 18, cursor: 'pointer', accentColor: C.green600, marginTop: 2, flexShrink: 0 }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 600, color: C.navy800 }}>{addon.label}</span>
                      <button
                        onClick={() => setOpenInfo(showInfo ? null : addon.key)}
                        aria-label={`Info about ${addon.label}`}
                        style={{
                          width: 20, height: 20, padding: 0,
                          border: `1px solid ${showInfo ? C.green600 : C.grey300}`,
                          background: showInfo ? C.green600 : C.white,
                          color: showInfo ? C.white : C.grey500,
                          borderRadius: '50%', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.15s',
                        }}
                      >
                        <Info size={11}/>
                      </button>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: isIncluded ? C.green700 : C.grey500, marginTop: 2 }}>
                      {isIncluded ? `Included in ${v.coverage_tier}` : addon.price}
                    </div>
                  </div>
                </div>

                {showInfo && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    background: C.navy800,
                    color: C.white,
                    padding: '14px 16px',
                    borderRadius: 8,
                    boxShadow: '0 8px 24px rgba(15,34,64,0.25)',
                    zIndex: 10,
                    fontSize: '0.82rem',
                    lineHeight: 1.6,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                      <strong style={{ color: C.green400, fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{addon.short} · {addon.price}</strong>
                      <button
                        onClick={() => setOpenInfo(null)}
                        aria-label="Close"
                        style={{ background: 'transparent', border: 'none', color: C.navy300, cursor: 'pointer', padding: 0, display: 'flex' }}
                      >
                        <X size={14}/>
                      </button>
                    </div>
                    <div>{addon.info}</div>
                    <div style={{ position: 'absolute', top: -6, left: 24, width: 12, height: 12, background: C.navy800, transform: 'rotate(45deg)' }}/>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .addons-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function FleetQuotePanel({ summary, vehicleQuotes, form, showBreakdown, setShowBreakdown, setPage }) {
  const fleetCount = vehicleQuotes.length
  const approvedCount = summary.approved.length

  const continueToApplication = () => {
    // Save quote data to sessionStorage so the Application form can pre-populate
    try {
      const quoteData = {
        timestamp: Date.now(),
        vehicles: form.vehicles,
        operator: {
          owner_birthdate: form.owner_birthdate,
          years_in_operation: form.years_in_operation,
          prior_claims_3yr: form.prior_claims_3yr,
          vin_title_status: form.vin_title_status,
          credit_score_band: form.credit_score_band,
          has_prior_commercial_insurance: form.has_prior_commercial_insurance,
        },
        bundles: {
          multi_line_auto: form.multi_line_auto,
          multi_line_home: form.multi_line_home,
          multi_line_life: form.multi_line_life,
        },
        referral: {
          source: form.referral_source,
          source_other: form.referral_source_other,
        },
        summary: {
          totalMonthly: summary.totalMonthly,
          totalAnnual: summary.totalAnnual,
          totalDeposit: summary.totalDeposit,
          totalFirst: summary.totalFirst,
        },
      }
      sessionStorage.setItem('na_quote_data', JSON.stringify(quoteData))
    } catch (e) {
      // sessionStorage might be disabled — non-fatal, application will start blank
      console.warn('Could not save quote to sessionStorage:', e)
    }
    setPage('apply')
    window.scrollTo(0, 0)
  }

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${C.green700} 0%, ${C.green600} 100%)`, padding: '20px 24px', color: C.white, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.85 }}>
            Your Fleet Quote
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 4, fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.12em' }}>
            <Info size={9}/>DRAFT
          </div>
        </div>
        <div style={{ fontSize: '0.88rem', opacity: 0.92 }}>
          {fleetCount} {fleetCount === 1 ? 'vehicle' : 'vehicles'}{summary.anyDeclined && ` · ${summary.declined.length} need${summary.declined.length === 1 ? 's' : ''} review`}
        </div>
      </div>

      <div style={{ padding: '32px 24px 20px', textAlign: 'center', borderBottom: `1px solid ${C.grey200}` }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.grey500, marginBottom: 8 }}>
          Total Fleet Monthly
        </div>
        <div style={{ fontSize: '3.4rem', fontWeight: 800, color: C.navy800, lineHeight: 1, marginBottom: 4 }}>
          {$(summary.totalMonthly)}<span style={{ fontSize: '1rem', fontWeight: 600, color: C.grey500 }}>/mo</span>
        </div>
        {approvedCount > 1 && (
          <div style={{ fontSize: '0.85rem', color: C.grey500 }}>
            avg {$(summary.totalMonthly / approvedCount)}/vehicle
          </div>
        )}
      </div>

      <div style={{ padding: '20px 24px' }}>
        {[
          ['Annual Total', $(summary.totalAnnual)],
          ['Binding Deposits (one-time)', $(summary.totalDeposit)],
          ['First Payment (today)', $(summary.totalFirst)],
        ].map(([label, val]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.9rem' }}>
            <span style={{ color: C.grey600 }}>{label}</span>
            <span style={{ color: C.navy800, fontWeight: 700 }}>{val}</span>
          </div>
        ))}

        {summary.anyDeclined && (
          <div style={{ marginTop: 14, padding: 14, background: C.amber50, borderRadius: 6, border: `1px solid ${C.amber200}` }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.amber600, marginBottom: 6 }}>
              Manual Review Required
            </div>
            <div style={{ fontSize: '0.82rem', color: C.grey700, lineHeight: 1.55 }}>
              {summary.declined.length} {summary.declined.length === 1 ? 'vehicle requires' : 'vehicles require'} underwriter review. The total above reflects only vehicles that quoted instantly.
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setShowBreakdown(b => !b)}
        style={{
          width: '100%', padding: '14px 24px',
          background: 'transparent', color: C.grey700,
          border: 'none', borderTop: `1px solid ${C.grey200}`, borderBottom: showBreakdown ? `1px solid ${C.grey200}` : 'none',
          cursor: 'pointer', fontSize: '0.86rem', fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <span>Per-Vehicle Breakdown</span>
        {showBreakdown ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
      </button>

      {showBreakdown && (
        <div style={{ padding: '14px 24px 18px', background: C.grey50 }}>
          {vehicleQuotes.map((v, i) => (
            <div key={v.id} style={{ padding: '10px 0', borderBottom: i < vehicleQuotes.length - 1 ? `1px solid ${C.grey200}` : 'none', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <span style={{ color: C.navy800, fontWeight: 700 }}>#{i+1} {v.rv_type}</span>
                <span style={{ color: v.quote.declined ? C.amber600 : C.navy800, fontWeight: 700 }}>
                  {v.quote.declined ? 'Review' : `${$(v.quote.monthly_total)}/mo`}
                </span>
              </div>
              <div style={{ color: C.grey500, fontSize: '0.76rem' }}>
                {v.coverage_tier} · {v.vehicle_state} · ${v.replacement_value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: '18px 24px 24px' }}>
        <button
          onClick={continueToApplication}
          style={{
            width: '100%', padding: '14px',
            background: C.green600, color: C.white,
            borderRadius: 6, fontWeight: 700, fontSize: '0.95rem',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = C.green700}
          onMouseLeave={e => e.currentTarget.style.background = C.green600}
        >
          Continue to Application <ArrowRight size={16}/>
        </button>
        <div style={{ fontSize: '0.74rem', color: C.grey500, textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>
          Your draft selections carry forward — final pricing set at underwriting.
        </div>
      </div>
    </div>
  )
}

function DeclinedPanel({ reason, setPage }) {
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${C.amber600} 0%, #B85708 100%)`, padding: '28px 24px', color: C.white }}>
        <AlertCircle size={32} style={{ marginBottom: 10 }}/>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 6 }}>Manual Review Needed</div>
        <div style={{ fontSize: '0.88rem', lineHeight: 1.6, opacity: 0.94 }}>{reason || 'One or more inputs require underwriter review before we can quote.'}</div>
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
