// data.js
// This file is our "database". Instead of MySQL/Firebase, the info lives in
// plain JavaScript arrays. Each item is an object { key: value }.
// To add a new scheme, copy one block, paste it, and change the text. That's it!
//
// ⚠️ BEFORE SUBMITTING: verify every scheme/loan detail on the official site
// (linked in `link`) because rules and limits change. Keep the disclaimer on the site.

// ---------- GOVERNMENT SCHEMES ----------
// businessTypes: which kinds of business it suits ("all" = any)
// states: "all" = All India, otherwise the state name
// groups: "all", or special categories like "women", "sc-st"
const schemes = [
  {
    id: "mudra",
    name: "PM Mudra Yojana (PMMY)",
    businessTypes: ["shop", "service", "manufacturing", "artisan"],
    states: ["all"], groups: ["all"],
    summary: "Collateral-free loans for small non-farm businesses, given through banks, NBFCs and microfinance institutions.",
    eligibility: "Any Indian citizen with a business plan for a non-farm income-generating activity (manufacturing, trading, services).",
    benefits: "Shishu: up to ₹50,000 · Kishore: ₹50,000 to ₹5 lakh · Tarun: ₹5 to ₹10 lakh · Tarun Plus: up to ₹20 lakh. No collateral.",
    documents: "ID proof, address proof, business proof or plan, passport photos, bank statement.",
    apply: "Visit any bank branch, NBFC or microfinance institution, or apply on the Udyamimitra portal.",
    link: "https://www.mudra.org.in"
  },
  {
    id: "pmegp",
    name: "PMEGP (PM Employment Generation Programme)",
    businessTypes: ["manufacturing", "service", "artisan"],
    states: ["all"], groups: ["all"],
    summary: "Bank loan plus a government subsidy for setting up a NEW micro-enterprise.",
    eligibility: "Age 18+; new units only; 8th pass needed for larger projects. Run through KVIC / KVIB / DIC.",
    benefits: "Subsidy of roughly 15% to 35% of project cost (higher in rural areas and for special categories like women, SC/ST).",
    documents: "ID and address proof, project report, caste/category certificate if applicable, education proof, quotations.",
    apply: "Apply online on the KVIC PMEGP e-portal; the bank then processes the loan.",
    link: "https://www.kviconline.gov.in/pmegpeportal"
  },
  {
    id: "standup",
    name: "Stand-Up India",
    businessTypes: ["shop", "service", "manufacturing", "farm"],
    states: ["all"], groups: ["women", "sc-st"],
    summary: "Bank loans for first-time entrepreneurs who are women or from SC/ST communities.",
    eligibility: "Women and/or SC/ST entrepreneurs, age 18+, setting up a first-time (new) enterprise in manufacturing, services, trading or agri-allied activity.",
    benefits: "Composite loans between ₹10 lakh and ₹1 crore from scheduled commercial banks.",
    documents: "ID and address proof, category certificate (SC/ST), business plan, bank statements.",
    apply: "Apply through the Stand-Up India portal or directly at a bank branch.",
    link: "https://www.standupmitra.in"
  },
  {
    id: "svanidhi",
    name: "PM SVANidhi",
    businessTypes: ["vendor"],
    states: ["all"], groups: ["all"],
    summary: "Small working-capital loans for street vendors, with rewards for digital payments.",
    eligibility: "Street vendors who were vending before the scheme and have a certificate of vending / letter of recommendation from the local urban body.",
    benefits: "Collateral-free working-capital loan in stages (starting at ₹10,000 or more), interest subsidy and cashback incentives for digital transactions.",
    documents: "Vending certificate or letter of recommendation, Aadhaar, bank account.",
    apply: "Apply on the PM SVANidhi portal or at a CSC / bank.",
    link: "https://pmsvanidhi.mohua.gov.in"
  },
  {
    id: "vishwakarma",
    name: "PM Vishwakarma",
    businessTypes: ["artisan"],
    states: ["all"], groups: ["all"],
    summary: "Support for traditional artisans and craftspeople: skill training, toolkit and low-interest credit.",
    eligibility: "Artisans working with their hands and tools in one of the 18 listed traditional trades (carpenter, blacksmith, potter, tailor, etc.).",
    benefits: "Training stipend, toolkit incentive, and collateral-free loans (₹1 lakh then ₹2 lakh) at a concessional interest rate, plus digital-payment incentive.",
    documents: "Aadhaar, mobile number linked to Aadhaar, bank account details, proof of trade.",
    apply: "Register at a Common Service Centre (CSC) or on the PM Vishwakarma portal.",
    link: "https://pmvishwakarma.gov.in"
  },
  {
    id: "kcc",
    name: "Kisan Credit Card (KCC)",
    businessTypes: ["farm"],
    states: ["all"], groups: ["all"],
    summary: "Easy short-term credit for farmers for seeds, fertiliser and other farming needs; also covers dairy and fisheries.",
    eligibility: "Farmers (owners or tenant farmers), sharecroppers, self-help groups; also animal husbandry and fisheries.",
    benefits: "Revolving credit limit at a low interest rate, with an interest subvention for timely repayment, plus accident insurance cover.",
    documents: "Land records, ID and address proof, passport photos, bank account.",
    apply: "Apply at your bank, cooperative bank or Regional Rural Bank branch.",
    link: "https://www.myscheme.gov.in"
  },
  {
    id: "cgtmse",
    name: "CGTMSE (Credit Guarantee for Micro & Small Enterprises)",
    businessTypes: ["shop", "service", "manufacturing", "artisan"],
    states: ["all"], groups: ["all"],
    summary: "A government-backed guarantee so banks can lend to you without asking for collateral or a third-party guarantee.",
    eligibility: "New and existing micro and small enterprises in manufacturing or services. Not available for pure retail trade in some cases; check with your bank.",
    benefits: "Collateral-free loan cover; you do not need to pledge property for eligible loans.",
    documents: "Udyam registration, project / business details, ID and address proof, bank statements.",
    apply: "You do not apply to CGTMSE directly. Ask your bank for a CGTMSE-covered loan.",
    link: "https://www.cgtmse.in"
  },
  {
    id: "cmegp",
    name: "CMEGP (Chief Minister Employment Generation Programme)",
    businessTypes: ["manufacturing", "service", "artisan", "shop"],
    states: ["Maharashtra"], groups: ["all"],
    summary: "Maharashtra state programme that gives a margin-money subsidy on bank loans for new small businesses.",
    eligibility: "Residents of Maharashtra, age 18 to 45 (relaxation for special categories), starting a new unit.",
    benefits: "Subsidy of about 15% to 35% of project cost, linked to a bank loan.",
    documents: "Aadhaar, domicile proof, education/training proof, project report, category certificate if applicable.",
    apply: "Apply on the Maharashtra CMEGP portal; applications are processed by the District Industries Centre.",
    link: "https://www.maha-cmegp.gov.in"
  }
];

// ---------- LOAN OPTIONS ----------
// These are INDICATIVE ranges for learning, not offers. Real rates depend on
// your bank, your profile and the date. Always check at the bank.
const loans = [
  {
    id: "mudra",
    name: "Mudra Loan",
    provider: "Banks / NBFCs / MFIs",
    amount: "Up to ₹20 lakh",
    rate: "Around 8% to 12% (varies by lender)",
    fee: "Usually nil for Shishu loans",
    tenure: "Up to 5 years",
    collateral: "None",
    bestFor: "Small shops, services, small manufacturing",
    documents: "ID, address, business proof, photos"
  },
  {
    id: "kcc",
    name: "Kisan Credit Card",
    provider: "Banks / Cooperative banks / RRBs",
    amount: "Based on land and crop",
    rate: "Around 7% (4% effective with timely repayment under subvention)",
    fee: "Low or nil",
    tenure: "Revolving; renewed yearly",
    collateral: "Usually none for smaller limits",
    bestFor: "Farmers, dairy, fisheries",
    documents: "Land records, ID, address, photos"
  },
  {
    id: "msme",
    name: "MSME Business Loan",
    provider: "Public / private sector banks",
    amount: "₹1 lakh and above",
    rate: "Around 9% to 14%",
    fee: "About 0.5% to 2% of loan",
    tenure: "1 to 7 years",
    collateral: "May be required (or covered by CGTMSE)",
    bestFor: "Established businesses needing working capital or equipment",
    documents: "Udyam registration, ITR / bank statements, ID, address"
  },
  {
    id: "mfi",
    name: "Microfinance / SHG Loan",
    provider: "Microfinance institutions, Self-Help Groups",
    amount: "₹10,000 to ₹1 lakh+",
    rate: "Often higher: around 18% to 26%",
    fee: "About 1% to 2%",
    tenure: "1 to 2 years",
    collateral: "None (group guarantee)",
    bestFor: "Very small businesses, women's groups, quick small credit",
    documents: "ID, address, group membership"
  },
  {
    id: "nbfc",
    name: "Fintech / NBFC Online Loan",
    provider: "Registered NBFCs and apps",
    amount: "₹50,000 to ₹10 lakh",
    rate: "Often higher: around 14% to 30%",
    fee: "About 2% to 5% (check carefully!)",
    tenure: "Few months to 3 years",
    collateral: "None",
    bestFor: "Fast approval when you cannot wait for a bank",
    documents: "ID, address, bank statements, selfie (KYC)"
  }
];

// ---------- LEARN TOPICS ----------
const topics = [
  {
    icon: "📱", title: "Digital Payments & UPI",
    intro: "UPI lets you send and receive money instantly from your phone using your bank account.",
    points: [
      "Create a UPI ID using any UPI app and your bank-linked mobile number.",
      "Scan a QR code or enter a mobile number / UPI ID to pay. Enter your UPI PIN only when SENDING money.",
      "You never need a PIN to RECEIVE money. If someone asks for your PIN to 'send' you money, it is a scam.",
      "Accepting UPI at your shop gives you a digital record of sales, which helps when you apply for a loan later."
    ]
  },
  {
    icon: "🏦", title: "Digital Banking",
    intro: "Banking from your phone saves travel time and lets you check your balance any time.",
    points: [
      "Link your mobile number to your bank account and set up the bank's official app.",
      "Use the app to check balance, see statements, and pay bills.",
      "Never share your net-banking password, card number, CVV or OTP with anyone, including 'bank staff' on calls.",
      "For help, visit your branch or a Common Service Centre (CSC)."
    ]
  },
  {
    icon: "💰", title: "Loans & Credit",
    intro: "A loan is money you borrow and repay with interest. Good loans help a business grow; careless loans cause stress.",
    points: [
      "Interest rate: the cost of borrowing. Always compare the total you will repay, not just the monthly amount.",
      "EMI: the fixed amount you pay every month. Use our EMI Calculator to check it first.",
      "Processing fee: a one-time charge by the lender. Ask about it before you sign.",
      "Borrow only what your business can comfortably repay. A common rule: EMI should be well within your monthly profit.",
      "Repaying on time builds your credit score (CIBIL), making future loans cheaper."
    ]
  },
  {
    icon: "🛡️", title: "Insurance",
    intro: "Insurance protects you and your business from big unexpected costs, for a small yearly payment (premium).",
    points: [
      "Life insurance: money for your family if something happens to you. PM Jeevan Jyoti Bima Yojana (PMJJBY) is a low-cost option.",
      "Accident insurance: PM Suraksha Bima Yojana (PMSBY) gives accident cover for a very small yearly premium.",
      "Crop insurance: PM Fasal Bima Yojana helps farmers when crops fail from weather or pests.",
      "Business insurance covers shop, stock and equipment from fire, theft and damage."
    ]
  },
  {
    icon: "🐖", title: "Savings",
    intro: "Savings are your safety net. They help you survive a slow month without taking an expensive loan.",
    points: [
      "Try to save a small fixed amount every time you earn, even ₹50 or ₹100.",
      "Keep 3 to 6 months of expenses as an emergency fund in a savings account.",
      "Recurring Deposit (RD) and Post Office schemes let you save a little every month with fixed interest.",
      "Keep business money and personal money in separate accounts."
    ]
  },
  {
    icon: "📈", title: "Investment Basics",
    intro: "Investing means putting money to work so it grows over time. Higher returns usually come with higher risk.",
    points: [
      "Risk vs return: safe options (Fixed Deposit, PPF) grow slowly; market options (mutual funds, shares) can grow faster but can also fall.",
      "Start with safe options and learn before you take risk.",
      "A SIP (Systematic Investment Plan) lets you invest a small fixed amount monthly in a mutual fund.",
      "Be careful of anyone promising 'guaranteed high returns'. That is a common fraud sign.",
      "Atal Pension Yojana can help you build a pension for old age."
    ]
  },
  {
    icon: "🧾", title: "Business Money Management",
    intro: "Knowing where your money goes is the first step to growing your business.",
    points: [
      "Write down daily sales and expenses in a notebook or free app.",
      "Know your profit: Profit = Sales − All Costs.",
      "Pay yourself a fixed salary so you do not mix business cash with personal use.",
      "Register on Udyam (free) to become eligible for many MSME benefits."
    ]
  }
];

// ---------- QUIZ ----------
// answer = index (starting at 0) of the correct option
const quiz = [
  {
    q: "Someone calls saying they are from the bank and asks for your OTP. What should you do?",
    options: ["Share it, they are from the bank", "Never share it and hang up", "Share only half of it"],
    answer: 1,
    why: "Banks never ask for your OTP, PIN or CVV. Anyone asking is trying to steal from you."
  },
  {
    q: "Do you need to enter your UPI PIN to RECEIVE money?",
    options: ["Yes, always", "No, only to send money", "Only for large amounts"],
    answer: 1,
    why: "A PIN is only needed to send money. A 'collect request' that asks for your PIN is a common scam."
  },
  {
    q: "What does EMI stand for?",
    options: ["Equated Monthly Instalment", "Easy Money Interest", "Extra Monthly Income"],
    answer: 0,
    why: "EMI is the fixed amount you pay every month to repay a loan with interest."
  },
  {
    q: "Which is usually riskier?",
    options: ["Fixed Deposit", "Post Office savings", "Shares in the stock market"],
    answer: 2,
    why: "Share prices go up and down. Fixed Deposits and Post Office savings are low-risk."
  }
];

// ---------- SCAMS ----------
const scams = [
  { icon: "📞", title: "Fake bank / KYC call", text: "A caller says your account will be blocked unless you 'update KYC' and share an OTP or click a link.", tip: "Hang up. Visit your branch or call the number printed on your bank card." },
  { icon: "💸", title: "UPI 'collect request' scam", text: "You are told you have won money or a refund. They send a request and ask you to enter your PIN to 'receive' it.", tip: "You never enter a PIN to receive money. Decline the request." },
  { icon: "🎁", title: "Lottery & prize messages", text: "A message says you won a prize and must pay a small fee or tax first.", tip: "Real prizes never ask for money in advance. Delete the message." },
  { icon: "📲", title: "Fake loan apps", text: "Apps promise instant loans with no documents, then charge huge hidden fees or threaten you and misuse your contacts.", tip: "Borrow only from banks and RBI-registered NBFCs. Check the lender's name on the RBI website." },
  { icon: "🔗", title: "Phishing links & fake websites", text: "SMS or WhatsApp links that look like your bank or a government scheme website and ask for details.", tip: "Do not click links from strangers. Type the official website address yourself." },
  { icon: "📈", title: "'Guaranteed returns' schemes", text: "Someone promises to double your money quickly or guarantees high monthly returns.", tip: "If it sounds too good to be true, it is. No genuine investment guarantees high returns." }
];
