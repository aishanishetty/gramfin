// calculator.js — EMI calculator
//
// THE FORMULA (don't worry, we just type it once):
//   EMI = P × r × (1 + r)^n  /  ((1 + r)^n − 1)
//   P = loan amount, r = monthly interest rate, n = number of months

// 1) Grab the HTML elements we need, by their id.
const amountInput = document.getElementById("amount");
const rateInput   = document.getElementById("rate");
const yearsInput  = document.getElementById("years");

// 2) A function that does the maths and returns the answers.
//    Keeping it separate from the page makes it easy to test (your "unit test").
function calculateEMI(principal, yearlyRate, years) {
  const n = Math.round(years * 12);      // total months
  const r = yearlyRate / 12 / 100;       // monthly rate, e.g. 10% -> 0.00833

  if (principal <= 0 || n <= 0) return null;   // bad input -> no answer

  let emi;
  if (r === 0) {
    emi = principal / n;                 // 0% interest: just divide equally
  } else {
    const growth = Math.pow(1 + r, n);
    emi = (principal * r * growth) / (growth - 1);
  }

  const total = emi * n;
  return { emi, total, interest: total - principal, months: n };
}

// 3) Show rupees in Indian format, e.g. 1,00,000
function rupees(num) {
  return "₹" + Math.round(num).toLocaleString("en-IN");
}

// 4) Read the inputs, calculate, and write the results onto the page.
function update() {
  const result = calculateEMI(
    Number(amountInput.value),
    Number(rateInput.value),
    Number(yearsInput.value)
  );

  if (!result) {                         // handle empty / invalid input
    document.getElementById("emi").textContent = "—";
    return;
  }

  document.getElementById("emi").textContent         = rupees(result.emi);
  document.getElementById("r-principal").textContent = rupees(Number(amountInput.value));
  document.getElementById("r-interest").textContent  = rupees(result.interest);
  document.getElementById("r-total").textContent     = rupees(result.total);
  document.getElementById("r-months").textContent    = result.months;

  // The coloured bar: what share of the total is interest?
  const interestPct = (result.interest / result.total) * 100;
  document.getElementById("bar-i").style.width = interestPct + "%";
  document.getElementById("bar-p").style.width = (100 - interestPct) + "%";
}

// 5) Re-calculate every time the user types in any box, and once at the start.
[amountInput, rateInput, yearsInput].forEach(box => box.addEventListener("input", update));
update();
