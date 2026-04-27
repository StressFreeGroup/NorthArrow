/**
 * North Arrow Rate Engine — v4 canonical
 *
 * Drop-in module for the northarrow.com quote tool.
 * Expects companion file: rate-tables.json
 *
 * Usage:
 *   import rateTables from './rate-tables.json';
 *   import { generateQuote } from './rateEngine';
 *
 *   const quote = generateQuote({
 *     rv_type: 'Travel Trailer',
 *     replacement_value: 45000,
 *     vehicle_year: 2020,
 *     vehicle_state: 'CA',
 *     coverage_tier: 'Silver',
 *     fleet_size: 3,
 *     multi_line_home: true,
 *     // ... etc
 *   }, rateTables);
 *
 * Returns:
 *   {
 *     declined: boolean,
 *     decline_reason?: string,
 *     monthly_premium: number,
 *     monthly_total: number,    // includes $33 NA fee
 *     annual_premium: number,
 *     deposit: number,
 *     first_payment: number,    // monthly_total + deposit
 *     fleet_total_monthly: number,  // monthly_total × fleet_size
 *     breakdown: { ...details for transparency... }
 *   }
 */

const CURRENT_YEAR = 2026;

function lookupBand(value, bands) {
  for (const b of bands) {
    if (value >= (b.min ?? b.min_age ?? b.min_units) &&
        value <= (b.max ?? b.max_age ?? b.max_units)) {
      return b;
    }
  }
  return null;
}

export function generateQuote(input, tables) {
  const breakdown = {};

  // ── DECLINE CHECKS ──
  if (input.owner_age < 25) {
    return { declined: true, decline_reason: 'Owner must be 25 or older.' };
  }
  if (input.vin_title_status === 'flood') {
    return { declined: true, decline_reason: 'Flood-titled vehicles not eligible.' };
  }
  if (['HI','PR','GU','VI'].includes(input.vehicle_state)) {
    return { declined: true, decline_reason: 'Coverage not available in this state/territory.' };
  }
  const vehicleAge = CURRENT_YEAR - input.vehicle_year;
  if (vehicleAge >= 11) {
    return { declined: true, decline_reason: 'Vehicles must be under 10 years old (per program exclusion).' };
  }
  if (input.prior_claims_3yr >= 3 && input.fleet_size < 5) {
    return { declined: true, decline_reason: 'Three or more prior claims and small fleet — manual review required.' };
  }

  // ── STEP 1: TIER BASE RATE ──
  const tierRates = tables.TIER_RATE[input.coverage_tier];
  if (!tierRates || tierRates[input.rv_type] === null || tierRates[input.rv_type] === undefined) {
    return { declined: true, decline_reason: `${input.coverage_tier} tier not available for ${input.rv_type}.` };
  }
  const baseRate = tierRates[input.rv_type];
  breakdown.base_rate = baseRate;

  // ── STEP 2: VALUE MULTIPLIER ──
  const valueBand = lookupBand(input.replacement_value, tables.VALUE_MULT.bands);
  const valueMult = valueBand?.mult ?? 1.00;
  breakdown.value_mult = valueMult;
  breakdown.value_band = valueBand?.label;

  // ── STEP 3: STATE MULTIPLIER ──
  const stateMult = tables.STATE_MULT[input.vehicle_state] ?? 1.00;
  breakdown.state_mult = stateMult;

  // ── STEP 4: AGE MULTIPLIER ──
  const ageBand = lookupBand(vehicleAge, tables.AGE_MULT.bands);
  const ageMult = ageBand?.mult ?? 1.00;
  breakdown.age_mult = ageMult;
  breakdown.age_band = ageBand?.label;

  // ── STEP 5: PRE-DISCOUNT MONTHLY PREMIUM ──
  let monthlyPremium = baseRate * valueMult * stateMult * ageMult;
  breakdown.pre_discount_monthly = Math.round(monthlyPremium);

  // ── STEP 6: DISCOUNTS ──
  const discounts = {};
  const fleetBand = lookupBand(input.fleet_size, tables.FLEET_DISCOUNT.bands);
  discounts.fleet_size = fleetBand?.discount ?? 0;

  discounts.premier      = (input.premier_owner_pct >= 50) ? tables.OTHER_DISCOUNTS.premier_owner_pct_50plus : 0;
  discounts.tenure       = (input.years_in_operation >= 3)  ? tables.OTHER_DISCOUNTS.tenure_3yr_plus           : 0;
  discounts.multi_line_auto = input.multi_line_auto ? tables.OTHER_DISCOUNTS.multi_line_auto : 0;
  discounts.multi_line_home = input.multi_line_home ? tables.OTHER_DISCOUNTS.multi_line_home : 0;
  discounts.multi_line_life = input.multi_line_life ? tables.OTHER_DISCOUNTS.multi_line_life : 0;
  discounts.affiliate    = input.affiliate_referral ? tables.OTHER_DISCOUNTS.affiliate_referral : 0;

  let totalDiscount = Object.values(discounts).reduce((a, b) => a + b, 0);
  totalDiscount = Math.min(totalDiscount, tables.FLEET_DISCOUNT.max_stacked_discount);
  breakdown.discounts = discounts;
  breakdown.total_discount_pct = totalDiscount;

  monthlyPremium = monthlyPremium * (1 - totalDiscount);

  // ── STEP 7: ADD-ONS ──
  let addOnsTotal = 0;
  const addOnSelected = {};
  const tier = input.coverage_tier;
  const ao = tables.ADD_ONS;
  if (input.add_sli && !ao.sli_supplemental_liability.included_in.includes(tier)) {
    addOnSelected.sli = ao.sli_supplemental_liability.price_mo; addOnsTotal += addOnSelected.sli;
  }
  if (input.add_personal_accident && !ao.personal_accident_insurance.included_in.includes(tier)) {
    addOnSelected.pai = ao.personal_accident_insurance.price_mo; addOnsTotal += addOnSelected.pai;
  }
  if (input.add_personal_effects && !ao.personal_effects_coverage.included_in.includes(tier)) {
    addOnSelected.pec = ao.personal_effects_coverage.price_mo; addOnsTotal += addOnSelected.pec;
  }
  if (input.add_roadside && !ao.roadside_assistance.included_in.includes(tier)) {
    addOnSelected.road = ao.roadside_assistance.price_mo; addOnsTotal += addOnSelected.road;
  }
  breakdown.add_ons = addOnSelected;
  breakdown.add_ons_total_mo = addOnsTotal;

  // ── STEP 8: SURCHARGES ──
  let surchargeMult = 1.0;
  const sc = tables.SURCHARGES;
  if (input.prior_claims_3yr === 1) surchargeMult *= sc.prior_claim_1;
  else if (input.prior_claims_3yr === 2) surchargeMult *= sc.prior_claim_2;
  else if (input.prior_claims_3yr >= 3) surchargeMult *= sc.prior_claim_3plus;
  if (input.vin_title_status === 'salvage') surchargeMult *= sc.salvage_title;
  if (input.credit_score_band === '<600') surchargeMult *= sc.credit_score_below_600;
  if (!input.has_prior_commercial_insurance) surchargeMult *= sc.no_prior_commercial_insurance;
  breakdown.surcharge_mult = surchargeMult;

  // ── STEP 9: APPLY ADD-ONS + SURCHARGES ──
  monthlyPremium = (monthlyPremium + addOnsTotal) * surchargeMult;
  monthlyPremium = Math.round(monthlyPremium);

  // ── STEP 10: TOTAL WITH NA FEE ──
  const monthlyTotal = monthlyPremium + tables.NA_FLAT_FEE_PER_MONTH;
  const annualPremium = monthlyTotal * 12;

  // ── STEP 11: DEPOSIT ──
  const deposit = tables.TIER_DEPOSIT[input.coverage_tier];

  // ── RETURN ──
  return {
    declined: false,
    monthly_premium: monthlyPremium,
    monthly_fee: tables.NA_FLAT_FEE_PER_MONTH,
    monthly_total: monthlyTotal,
    annual_premium: annualPremium,
    deposit: deposit,
    first_payment: monthlyTotal + deposit,
    fleet_total_monthly: monthlyTotal * input.fleet_size,
    fleet_total_annual: annualPremium * input.fleet_size,
    fleet_total_first_payment: (monthlyTotal * input.fleet_size) + (deposit * input.fleet_size),
    breakdown,
  };
}

export default { generateQuote };
