/**
 * North Arrow Rate Engine — v6 canonical
 *
 * Value-percentage pricing model calibrated against MBA Q132067 actuals.
 * Targets ~10% under MBA at equal/better coverage on Silver tier.
 *
 * Drop-in module for the northarrow.com quote tool.
 * Expects companion file: rate-tables.json
 *
 * Returns {declined, decline_reason?, monthly_premium, monthly_total, ...}
 */

const CURRENT_YEAR = 2026;

function calcAgeFromBirthdate(birthdate) {
  if (!birthdate) return 0;
  const dob = new Date(birthdate);
  if (isNaN(dob.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

function lookupAgeBand(age, bands) {
  for (const b of bands) {
    if (age >= b.min_age && age <= b.max_age) return b;
  }
  return null;
}

function lookupFleetBand(units, bands) {
  for (const b of bands) {
    if (units >= b.min_units && units <= b.max_units) return b;
  }
  return null;
}

export function generateQuote(input, tables) {
  const breakdown = {};

  // ── DECLINE CHECKS ──
  const ownerAge = calcAgeFromBirthdate(input.owner_birthdate);
  if (input.owner_birthdate && ownerAge < tables.MIN_OWNER_AGE) {
    return { declined: true, decline_reason: `Owner must be ${tables.MIN_OWNER_AGE} or older. Calculated age: ${ownerAge}.` };
  }
  if (input.vin_title_status === 'flood') {
    return { declined: true, decline_reason: 'Flood-titled vehicles are not eligible for coverage.' };
  }
  if (['HI','PR','GU','VI'].includes(input.vehicle_state)) {
    return { declined: true, decline_reason: 'Coverage is not available in this state or territory.' };
  }
  const vehicleAge = CURRENT_YEAR - input.vehicle_year;
  if (vehicleAge > tables.AGE_MULT.max_eligible_age) {
    return { declined: true, decline_reason: `Vehicles must be ${tables.AGE_MULT.max_eligible_age} years old or newer. This vehicle is ${vehicleAge} years old.` };
  }
  if (vehicleAge < 0) {
    return { declined: true, decline_reason: 'Vehicle year is in the future. Please verify the year.' };
  }
  if (input.prior_claims_3yr >= 3 && input.fleet_size < 5) {
    return { declined: true, decline_reason: 'Three or more prior claims with a small fleet require manual underwriting review.' };
  }

  // ── STEP 1: VALUE-BASED PREMIUM (Silver baseline) ──
  const valuePct = tables.VALUE_PCT_SILVER[input.rv_type];
  const minMonthly = tables.MIN_MONTHLY_SILVER[input.rv_type];
  if (valuePct == null || minMonthly == null) {
    return { declined: true, decline_reason: `Coverage is not yet available for ${input.rv_type}.` };
  }

  const valueBased = (input.replacement_value * valuePct) / 12;
  let silverBaseline = Math.max(valueBased, minMonthly);
  const floorApplied = valueBased < minMonthly;

  breakdown.value_pct = valuePct;
  breakdown.value_based_monthly = Math.round(valueBased * 100) / 100;
  breakdown.min_floor = minMonthly;
  breakdown.floor_applied = floorApplied;
  breakdown.silver_baseline = Math.round(silverBaseline * 100) / 100;

  // ── STEP 2: TIER MULTIPLIER ──
  const tierMult = tables.TIER_MULT[input.coverage_tier];
  if (tierMult == null) {
    return { declined: true, decline_reason: `Unknown tier: ${input.coverage_tier}.` };
  }
  let monthlyPremium = silverBaseline * tierMult;
  breakdown.tier_mult = tierMult;
  breakdown.after_tier = Math.round(monthlyPremium * 100) / 100;

  // ── STEP 3: STATE MULTIPLIER ──
  const stateMult = tables.STATE_MULT[input.vehicle_state];
  if (stateMult == null) {
    return { declined: true, decline_reason: `Coverage is not available in ${input.vehicle_state}.` };
  }
  monthlyPremium *= stateMult;
  breakdown.state_mult = stateMult;

  // ── STEP 4: AGE MULTIPLIER ──
  const ageBand = lookupAgeBand(vehicleAge, tables.AGE_MULT.bands);
  const ageMult = ageBand?.mult ?? 1.00;
  monthlyPremium *= ageMult;
  breakdown.age_mult = ageMult;
  breakdown.age_band = ageBand?.label;
  breakdown.pre_discount = Math.round(monthlyPremium);

  // ── STEP 5: DISCOUNTS ──
  const discounts = {};
  const fleetBand = lookupFleetBand(input.fleet_size || 1, tables.FLEET_DISCOUNT.bands);
  discounts.fleet_size = fleetBand?.discount ?? 0;
  discounts.premier = (input.premier_owner_pct >= 50) ? tables.OTHER_DISCOUNTS.premier_owner_pct_50plus : 0;
  discounts.tenure = (input.years_in_operation >= 3) ? tables.OTHER_DISCOUNTS.tenure_3yr_plus : 0;
  discounts.multi_line_auto = input.multi_line_auto ? tables.OTHER_DISCOUNTS.multi_line_auto : 0;
  discounts.multi_line_home = input.multi_line_home ? tables.OTHER_DISCOUNTS.multi_line_home : 0;
  discounts.multi_line_life = input.multi_line_life ? tables.OTHER_DISCOUNTS.multi_line_life : 0;
  discounts.affiliate = input.affiliate_referral ? tables.OTHER_DISCOUNTS.affiliate_referral : 0;

  let totalDiscount = Object.values(discounts).reduce((a, b) => a + b, 0);
  totalDiscount = Math.min(totalDiscount, tables.FLEET_DISCOUNT.max_stacked_discount);
  monthlyPremium *= (1 - totalDiscount);
  breakdown.discounts = discounts;
  breakdown.total_discount_pct = totalDiscount;

  // ── STEP 6: ADD-ONS ──
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

  // ── STEP 7: SURCHARGES ──
  let surchargeMult = 1.0;
  const sc = tables.SURCHARGES;
  if (input.prior_claims_3yr === 1) surchargeMult *= sc.prior_claim_1;
  else if (input.prior_claims_3yr === 2) surchargeMult *= sc.prior_claim_2;
  else if (input.prior_claims_3yr >= 3) surchargeMult *= sc.prior_claim_3plus;
  if (input.vin_title_status === 'salvage') surchargeMult *= sc.salvage_title;
  if (input.credit_score_band === '<600') surchargeMult *= sc.credit_score_below_600;
  if (!input.has_prior_commercial_insurance) surchargeMult *= sc.no_prior_commercial_insurance;
  breakdown.surcharge_mult = surchargeMult;

  // ── STEP 8: APPLY ADD-ONS + SURCHARGES, FINAL PREMIUM ──
  monthlyPremium = (monthlyPremium + addOnsTotal) * surchargeMult;
  monthlyPremium = Math.round(monthlyPremium);

  // ── STEP 9: TOTAL WITH NA FEE ──
  const monthlyTotal = monthlyPremium + tables.NA_FLAT_FEE_PER_MONTH;
  const annualPremium = monthlyTotal * 12;

  // ── STEP 10: DEPOSIT ──
  const deposit = tables.TIER_DEPOSIT[input.coverage_tier];

  return {
    declined: false,
    monthly_premium: monthlyPremium,
    monthly_fee: tables.NA_FLAT_FEE_PER_MONTH,
    monthly_total: monthlyTotal,
    annual_premium: annualPremium,
    deposit: deposit,
    first_payment: monthlyTotal + deposit,
    fleet_total_monthly: monthlyTotal * (input.fleet_size || 1),
    fleet_total_annual: annualPremium * (input.fleet_size || 1),
    fleet_total_first_payment: (monthlyTotal * (input.fleet_size || 1)) + (deposit * (input.fleet_size || 1)),
    breakdown,
  };
}

export default { generateQuote };
