// loans.js — Loan Comparison Table + Loan Eligibility Pre-check
//
// Part 1 (unchanged): Renders the loan comparison table from data.js.
// Part 2 (new): Adds an eligibility pre-check form below the table.
//
// ⚠️ IMPORTANT DISCLAIMER
// All eligibility outputs are INDICATIVE ESTIMATES based on publicly
// available guidelines. This is NOT a loan approval and NOT financial advice.
// Actual eligibility depends on the lender's assessment and current policy.

// -------- Part 1: Comparison table (original logic) --------

// Build the select boxes from the loans array (data.js)
function buildSelects() {
  if (typeof loans === 'undefined') return;
  const opts = loans.map(l => `<option value="${l.id}">${l.name}</option>`).join('');
  ['c1', 'c2', 'c3'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = (i === 2 ? '<option value="">— None —</option>' : '') + opts;
    if (i === 0) el.value = loans[0]?.id || '';
    if (i === 1) el.value = loans[1]?.id || '';
  });
}

function getRow(label, field) {
  return `<tr>
    <td>${label}</td>
    ${[0,1,2].map(i => {
      const id = document.getElementById(['c1','c2','c3'][i])?.value;
      if (!id) return '<td style="color:var(--muted);font-style:italic">—</td>';
      const loan = loans.find(l => l.id === id);
      return loan ? `<td>${loan[field] || '—'}</td>` : '<td>—</td>';
    }).join('')}
  </tr>`;
}

function renderTable() {
  if (typeof loans === 'undefined') return;
  const table = document.getElementById('compare-table');
  if (!table) return;

  const c1 = document.getElementById('c1')?.value;
  const c2 = document.getElementById('c2')?.value;
  const c3 = document.getElementById('c3')?.value;

  // Build headers using selected loan names
  const headerCells = [c1, c2, c3].map(id => {
    if (!id) return '<th>—</th>';
    const loan = loans.find(l => l.id === id);
    return `<th>${loan ? loan.name : '—'}</th>`;
  }).join('');

  const fields = [
    ['Provider',    'provider'],
    ['Loan amount', 'amount'],
    ['Interest rate (indicative)', 'rate'],
    ['Processing fee', 'fee'],
    ['Loan tenure',  'tenure'],
    ['Collateral',   'collateral'],
    ['Best for',     'bestFor'],
    ['Documents',    'documents'],
  ];

  table.innerHTML = `
    <thead><tr><th>Feature</th>${headerCells}</tr></thead>
    <tbody>${fields.map(([label, field]) => getRow(label, field)).join('')}</tbody>`;
}

buildSelects();
renderTable();
['c1','c2','c3'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('change', renderTable);
});
window.addEventListener('langchange', renderTable);

// -------- Part 2: Loan Eligibility Pre-check --------
//
// Criteria used (clearly documented):
//  Shishu (Mudra):  any business, has Aadhaar + bank account → up to ₹50,000
//  Kishore (Mudra): business ≥ 1 year, income ≥ ₹5,000/mo → ₹50,000 – ₹5 lakh
//  Tarun (Mudra):   business ≥ 3 years, income ≥ ₹15,000/mo → ₹5 – ₹10 lakh
//  SVANidhi:        street vendor → ₹10,000 – ₹50,000
//  KCC:             farming → based on land / crop
//  Stand-Up India:  women / SC-ST, first business → ₹10 lakh – ₹1 crore
//  PMEGP:           new unit, age 18+ → subsidy + bank loan

function buildEligibilitySection() {
  const wrap = document.getElementById('eligibility-section');
  if (!wrap) return;

  wrap.innerHTML = `
  <h2 style="margin-top:44px;color:var(--navy)">🔍 Loan Eligibility Pre-check</h2>
  <p class="lead">Answer a few quick questions and we will suggest which loan type may suit you.</p>

  <div class="notice" style="margin-bottom:20px">
    <strong>⚠️ Indicative estimate only.</strong>
    These results are based on publicly available guidelines and are for awareness only.
    They are <strong>not a loan approval</strong> and <strong>not financial advice</strong>.
    Final eligibility is determined by the lender based on your actual profile.
  </div>

  <div class="card">
    <div style="display:grid;gap:18px">

      <div>
        <label for="el-biztype">What type of business do you have?</label>
        <select id="el-biztype">
          <option value="">— Select —</option>
          <option value="shop">Small shop / retail</option>
          <option value="service">Service (salon, repair, transport…)</option>
          <option value="manufacturing">Small manufacturing / food processing</option>
          <option value="artisan">Artisan / craftsperson</option>
          <option value="farm">Farming / dairy / fishery</option>
          <option value="vendor">Street vendor</option>
        </select>
        <span class="field-error" id="el-biztype-err"></span>
      </div>

      <div>
        <label for="el-age">How long has your business been running?</label>
        <select id="el-age">
          <option value="">— Select —</option>
          <option value="0">Just starting (less than 6 months)</option>
          <option value="0.5">6 – 12 months</option>
          <option value="1">1 – 3 years</option>
          <option value="3">More than 3 years</option>
        </select>
        <span class="field-error" id="el-age-err"></span>
      </div>

      <div>
        <label for="el-income">Approximate monthly business income (₹)</label>
        <input type="number" id="el-income" min="0" step="500" placeholder="e.g. 15000">
        <span class="field-error" id="el-income-err"></span>
      </div>

      <div class="form-row" style="grid-template-columns:1fr 1fr">
        <div>
          <label>Do you have an Aadhaar card?</label>
          <div style="display:flex;gap:12px;margin-top:4px">
            <label class="radio-label"><input type="radio" name="el-aadhaar" value="yes"> Yes</label>
            <label class="radio-label"><input type="radio" name="el-aadhaar" value="no">  No</label>
          </div>
        </div>
        <div>
          <label>Do you have a bank account?</label>
          <div style="display:flex;gap:12px;margin-top:4px">
            <label class="radio-label"><input type="radio" name="el-bank" value="yes"> Yes</label>
            <label class="radio-label"><input type="radio" name="el-bank" value="no">  No</label>
          </div>
        </div>
      </div>

      <div>
        <label>Special category (if applicable)</label>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:4px">
          <label class="radio-label"><input type="radio" name="el-cat" value="general" checked> None / General</label>
          <label class="radio-label"><input type="radio" name="el-cat" value="women"> Woman entrepreneur</label>
          <label class="radio-label"><input type="radio" name="el-cat" value="sc-st"> SC / ST entrepreneur</label>
        </div>
      </div>

      <button class="btn" id="el-check-btn" style="max-width:240px">Check eligibility →</button>
    </div>
  </div>

  <!-- Results box (hidden until checked) -->
  <div id="el-results" class="eligibility-results" hidden></div>`;

  document.getElementById('el-check-btn').addEventListener('click', checkEligibility);
}

function checkEligibility() {
  // Read inputs
  const bizType = document.getElementById('el-biztype').value;
  const bizAge  = document.getElementById('el-age').value;
  const income  = Number(document.getElementById('el-income').value) || 0;
  const hasAadhaar = document.querySelector('input[name="el-aadhaar"]:checked')?.value;
  const hasBank    = document.querySelector('input[name="el-bank"]:checked')?.value;
  const category   = document.querySelector('input[name="el-cat"]:checked')?.value || 'general';

  // Validate
  let valid = true;
  document.getElementById('el-biztype-err').textContent = '';
  document.getElementById('el-age-err').textContent = '';
  document.getElementById('el-income-err').textContent = '';

  if (!bizType) { document.getElementById('el-biztype-err').textContent = 'Please select a business type.'; valid = false; }
  if (bizAge === '') { document.getElementById('el-age-err').textContent = 'Please select how long your business has been running.'; valid = false; }
  if (income < 0) { document.getElementById('el-income-err').textContent = 'Please enter a valid income amount.'; valid = false; }
  if (!valid) return;

  const age = Number(bizAge);

  // ---- Eligibility logic ----
  // Each recommendation has: { scheme, tier, amount, reason, link, tip }
  const recs = [];

  // PMMY Shishu — entry level, virtually any new business
  if (['shop','service','manufacturing','artisan'].includes(bizType) && hasAadhaar === 'yes' && hasBank === 'yes') {
    recs.push({
      scheme: 'PM Mudra Yojana – Shishu',
      badge:  '✅ Likely eligible',
      badgeClass: 'badge-green',
      amount: 'Up to ₹50,000',
      reason: 'You have Aadhaar and a bank account, and your business type qualifies for a collateral-free Shishu loan.',
      link:   'https://www.mudra.org.in',
      tip:    'Apply at any bank or NBFC. Take your business proof, Aadhaar and bank passbook.'
    });
  }

  // PMMY Kishore — 1+ year business, some income
  if (['shop','service','manufacturing','artisan'].includes(bizType) && age >= 1 && income >= 5000) {
    recs.push({
      scheme: 'PM Mudra Yojana – Kishore',
      badge:  '✅ Likely eligible',
      badgeClass: 'badge-green',
      amount: '₹50,000 – ₹5 lakh',
      reason: `Your business has been running for ${age >= 3 ? '3+' : '1-3'} years and your income suggests you can service the EMI.`,
      link:   'https://www.mudra.org.in',
      tip:    'Bring 6 months of bank statements and a basic business plan to your bank.'
    });
  }

  // PMMY Tarun — 3+ year business, higher income
  if (['shop','service','manufacturing','artisan'].includes(bizType) && age >= 3 && income >= 15000) {
    recs.push({
      scheme: 'PM Mudra Yojana – Tarun',
      badge:  '✅ Likely eligible',
      badgeClass: 'badge-green',
      amount: '₹5 lakh – ₹10 lakh',
      reason: 'Your business has 3+ years of history and your income level supports a larger Tarun loan.',
      link:   'https://www.mudra.org.in',
      tip:    'Bring 2 years of ITR or bank statements, Udyam registration, and a business plan.'
    });
  }

  // Street vendors — SVANidhi
  if (bizType === 'vendor') {
    recs.push({
      scheme: 'PM SVANidhi',
      badge:  '✅ Likely eligible',
      badgeClass: 'badge-green',
      amount: '₹10,000 – ₹50,000 (in stages)',
      reason: 'PM SVANidhi is specifically designed for street vendors and gives working-capital loans with digital-payment rewards.',
      link:   'https://pmsvanidhi.mohua.gov.in',
      tip:    'You will need a certificate of vending or letter from your local municipal body.'
    });
  }

  // Farmers — KCC
  if (bizType === 'farm') {
    recs.push({
      scheme: 'Kisan Credit Card (KCC)',
      badge:  '✅ Likely eligible',
      badgeClass: 'badge-green',
      amount: 'Based on land / crop (revolving credit)',
      reason: 'KCC gives low-interest revolving credit for farming, dairy and fisheries needs.',
      link:   'https://www.myscheme.gov.in',
      tip:    'Visit your nearest bank or Regional Rural Bank with land records and ID proof.'
    });
  }

  // Stand-Up India — women or SC/ST
  if (['women','sc-st'].includes(category) && age === 0 && ['shop','service','manufacturing','farm'].includes(bizType)) {
    recs.push({
      scheme: 'Stand-Up India',
      badge:  '✅ Likely eligible',
      badgeClass: 'badge-green',
      amount: '₹10 lakh – ₹1 crore',
      reason: `You are ${category === 'women' ? 'a woman' : 'an SC/ST'} entrepreneur starting a new enterprise — Stand-Up India is designed for exactly this.`,
      link:   'https://www.standupmitra.in',
      tip:    'Prepare a business plan, category certificate and ID/address proof.'
    });
  }

  // PMEGP — new unit
  if (age <= 0.5 && ['manufacturing','service','artisan'].includes(bizType)) {
    recs.push({
      scheme: 'PMEGP (PM Employment Generation Programme)',
      badge:  '⚡ Worth exploring',
      badgeClass: 'badge-amber',
      amount: 'Bank loan + 15–35% subsidy on project cost',
      reason: 'PMEGP supports new enterprises with a government subsidy on top of a bank loan. Ideal for a new manufacturing or artisan business.',
      link:   'https://www.kviconline.gov.in/pmegpeportal',
      tip:    'Apply on the KVIC PMEGP portal. Have a detailed project report ready — banks need it.'
    });
  }

  // No Aadhaar/bank account — suggest first steps
  if (hasAadhaar === 'no' || hasBank === 'no') {
    recs.push({
      scheme: 'First step: Get Aadhaar & Bank Account',
      badge:  '📋 Action needed first',
      badgeClass: 'badge-info',
      amount: '—',
      reason: 'Most government loan schemes require Aadhaar and a bank account. Getting these first will unlock access to all the schemes above.',
      link:   'https://uidai.gov.in',
      tip:    'Visit your nearest Common Service Centre (CSC) to apply for Aadhaar. Open a zero-balance Jan Dhan account at any bank.'
    });
  }

  if (!recs.length) {
    recs.push({
      scheme: 'Talk to your bank directly',
      badge:  'ℹ️ Discuss with bank',
      badgeClass: 'badge-info',
      amount: 'Depends on your profile',
      reason: 'Based on your inputs, no specific scheme matched automatically. A bank officer can do a proper assessment of your needs.',
      link:   'https://www.myscheme.gov.in',
      tip:    'The myScheme portal (myscheme.gov.in) also has a comprehensive finder tool.'
    });
  }

  // ---- Render results ----
  const resultsBox = document.getElementById('el-results');
  resultsBox.innerHTML = `
    <h3 style="margin-bottom:16px;color:var(--navy)">
      📋 ${recs.length} suggestion${recs.length !== 1 ? 's' : ''} based on your inputs
    </h3>
    ${recs.map(r => `
      <div class="eligibility-card">
        <div style="display:flex;align-items:flex-start;gap:12px;flex-wrap:wrap">
          <h4 class="elig-scheme-name">${r.scheme}</h4>
          <span class="elig-badge ${r.badgeClass}">${r.badge}</span>
        </div>
        <div class="elig-amount">Indicative loan range: <strong>${r.amount}</strong></div>
        <p class="elig-reason">${r.reason}</p>
        <div class="elig-tip">💡 <strong>Next step:</strong> ${r.tip}</div>
        <a href="${r.link}" target="_blank" rel="noopener" class="btn small" style="margin-top:12px">
          Official website →
        </a>
      </div>`).join('')}
    <div class="notice" style="margin-top:20px">
      <strong>⚠️ Remember:</strong> These are indicative estimates based on general guidelines.
      Final loan approval depends on the lender's assessment, your credit history, and current policy.
      Always verify details at the official scheme website or with your bank.
    </div>`;
  resultsBox.hidden = false;
  resultsBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Inject the eligibility section into loans.html (after the comparison table)
document.addEventListener('DOMContentLoaded', buildEligibilitySection);
