// ui-strings.js
// Every piece of TEXT used by the website's interface (buttons, headings, labels)
// in three languages. Each key (like "nav.home") has a version in en / hi / mr.
//
// HOW IT WORKS: in the HTML, an element like
//     <h1 data-i18n="learn.h1">Learn Finance</h1>
// gets its text replaced by UI[currentLang]["learn.h1"] (see i18n.js).
//
// TO ADD A NEW TEXT: add the same key to all three blocks below.
// Keys ending in "Html" / containing tags are inserted as HTML (so <strong> and links work).
// {n}, {s} etc. are placeholders that the code fills in.

const UI = {
  // =====================================================================
  en: {
    "lang.name": "English",

    // navbar + footer
    "nav.home": "Home", "nav.learn": "Learn", "nav.schemes": "Schemes",
    "nav.calc": "EMI Calculator", "nav.loans": "Compare Loans", "nav.fraud": "Fraud Alerts",
    "footer.line1": "GramFin — financial awareness for rural entrepreneurs.",
    "footer.disc": "⚠️ GramFin is for awareness and guidance only. It is not a bank, lender, insurer or financial advisor, and it does not guarantee loan approval, insurance or returns. Scheme details can change — always confirm on the official website or at your bank branch.",

    // voice
    "voice.listen": "🔊 Listen", "voice.listenPage": "🔊 Listen to this page", "voice.stop": "⏹ Stop",
    "voice.rupees": "rupees",
    "voice.noVoice": "Your device has no {lang} voice installed. Try on an Android phone, or add the voice in your device's text-to-speech settings.",
    "voice.unsupported": "Voice is not supported in this browser. Try Chrome or Edge.",

    // home
    "title.home": "GramFin – Financial help for rural entrepreneurs",
    "home.h1": "Grow your business with <em>smart money</em> decisions",
    "home.sub": "Understand loans, government schemes, digital payments and insurance in simple language. Free, clear and made for rural entrepreneurs.",
    "home.btnSchemes": "Find schemes for me", "home.btnEmi": "Calculate my EMI",
    "home.todayH": "What do you want to do today?", "home.todaySub": "Pick one to get started.",
    "home.c1t": "Government Schemes", "home.c1d": "Tell us your business type and state. We show schemes you may be eligible for.",
    "home.c2t": "EMI Calculator", "home.c2d": "Find out your monthly loan payment and total interest before you borrow.",
    "home.c3t": "Compare Loans", "home.c3d": "See different loan types side by side: interest, documents and who they suit.",
    "home.c4t": "Learn Finance", "home.c4d": "UPI, loans, insurance, savings and investing explained simply, with quizzes.",
    "home.c5t": "Fraud Alerts", "home.c5d": "Know the common scams and how to keep your money and OTPs safe.",
    "home.howH": "How GramFin helps", "home.howSub": "Three simple steps.",
    "home.s1t": "Learn", "home.s1d": "Read short, easy lessons on money basics, no jargon.",
    "home.s2t": "Compare", "home.s2d": "Check schemes and loan options and calculate what you will pay back.",
    "home.s3t": "Decide", "home.s3d": "Take the right documents to your bank or CSC and apply with confidence.",
    "home.notice": "<strong>Please note:</strong> GramFin gives information for awareness only. We are not a bank or lender and we do not take any money or personal details. Always confirm details with the official source.",

    // learn
    "learn.h1": "📚 Learn Finance", "learn.sub": "Short, simple lessons. Tap a topic to open it.",
    "learn.quizH": "🧠 Quick quiz", "learn.quizSub": "Test what you learned.",
    "quiz.correct": "✅ Correct! ", "quiz.wrong": "❌ Not quite. ",
    "quiz.score": "Your score: {s} / {n}", "quiz.perfect": "🎉 Perfect!", "quiz.nice": "👍 Nice effort!",

    // schemes
    "schemes.h1": "🏛️ Government Scheme Finder", "schemes.sub": "Tell us about your business and we will show schemes that may suit you.",
    "f.type": "Business type", "f.state": "State", "f.group": "Special category",
    "type.all": "Any business", "type.shop": "Small shop / retail",
    "type.service": "Service (salon, repair, transport…)", "type.manufacturing": "Small manufacturing / food processing",
    "type.artisan": "Artisan / craftsperson", "type.farm": "Farming / dairy / fishery", "type.vendor": "Street vendor",
    "state.all": "All India", "state.mh": "Maharashtra", "state.other": "Other state",
    "group.all": "None / General", "group.women": "Woman entrepreneur", "group.scst": "SC / ST entrepreneur",
    "btn.show": "Show schemes", "btn.saved": "⭐ My saved schemes",
    "count.found": "Schemes found: {n}", "count.saved": "Saved schemes: {n}",
    "scheme.who": "Who can apply", "scheme.benefits": "Benefits", "scheme.docs": "Documents needed", "scheme.apply": "How to apply",
    "btn.save": "☆ Save", "btn.savedOn": "⭐ Saved", "btn.official": "Official website ↗",
    "empty.schemes": "No schemes found. Try choosing \"Any business\" or \"All India\".",

    // calculator
    "calc.h1": "🧮 EMI Calculator", "calc.sub": "See your monthly payment before you take a loan.",
    "calc.enter": "Enter loan details", "calc.amount": "Loan amount (₹)", "calc.rate": "Yearly interest rate (%)", "calc.years": "Loan period (years)",
    "calc.hint": "Results update as you type. This is an estimate. Your bank's final figure may differ slightly because of fees.",
    "calc.monthly": "Your monthly EMI", "calc.legendLoan": "Loan amount", "calc.legendInt": "Interest",
    "calc.rLoan": "Loan amount", "calc.rInt": "Total interest", "calc.rTotal": "Total repayment", "calc.rMonths": "Number of instalments",
    "calc.tip": "💡 <strong>Tip:</strong> Your EMI should be comfortably less than your monthly business profit. If it is too high, try a longer period or a smaller loan.",

    // loans
    "loans.h1": "⚖️ Compare Loan Options", "loans.sub": "Pick up to three loan types and see them side by side.",
    "loans.optA": "Option A", "loans.optB": "Option B", "loans.optC": "Option C (optional)", "loans.none": "— none —", "loans.feature": "Feature",
    "loans.notice": "⚠️ Rates and fees shown are <strong>indicative ranges for learning</strong>, not offers. Your actual rate depends on your bank, your profile and the date. Always ask for the total cost (interest + fees) and use our <a href='calculator.html'>EMI Calculator</a> before you decide.",
    "row.provider": "Provider", "row.amount": "Loan amount", "row.rate": "Interest rate", "row.fee": "Processing fee",
    "row.tenure": "Repayment period", "row.collateral": "Collateral", "row.documents": "Documents", "row.bestFor": "Best suited for",

    // fraud
    "fraud.h1": "🛡️ Fraud Alerts & Safety Tips", "fraud.sub": "Know the common scams so you can protect your money.",
    "fraud.ruleH": "🚨 Golden rule",
    "fraud.rule": "<strong>Never share your OTP, UPI PIN, card PIN, CVV or passwords with anyone.</strong> Not even someone who says they are from your bank, from the police, or from a government office.",
    "fraud.common": "Common scams", "fraud.commonSub": "Quick to read, easy to remember.", "fraud.todo": "✔ What to do:",
    "fraud.checkH": "Stay safe checklist",
    "fraud.l1": "Download banking and UPI apps only from the Play Store / App Store.",
    "fraud.l2": "Set a screen lock on your phone and keep your UPI PIN secret.",
    "fraud.l3": "Check the name shown before you confirm any UPI payment.",
    "fraud.l4": "Do not click links in unknown SMS or WhatsApp messages.",
    "fraud.l5": "Check your bank SMS alerts regularly for transactions you did not make.",
    "fraud.l6": "If you are cheated, call the cyber crime helpline <strong>1930</strong> immediately and report at <a href='https://cybercrime.gov.in' target='_blank' rel='noopener'>cybercrime.gov.in</a>."
  },

  // =====================================================================
  hi: {
    "lang.name": "हिंदी",

    "nav.home": "होम", "nav.learn": "सीखें", "nav.schemes": "योजनाएँ",
    "nav.calc": "EMI कैलकुलेटर", "nav.loans": "लोन तुलना", "nav.fraud": "धोखाधड़ी अलर्ट",
    "footer.line1": "GramFin — ग्रामीण उद्यमियों के लिए वित्तीय जागरूकता।",
    "footer.disc": "⚠️ GramFin केवल जानकारी और मार्गदर्शन के लिए है। यह बैंक, ऋणदाता, बीमा कंपनी या वित्तीय सलाहकार नहीं है, और लोन की मंज़ूरी, बीमा या मुनाफ़े की गारंटी नहीं देता। योजनाओं की जानकारी बदल सकती है — हमेशा आधिकारिक वेबसाइट या अपनी बैंक शाखा में पुष्टि करें।",

    "voice.listen": "🔊 सुनें", "voice.listenPage": "🔊 यह पेज सुनें", "voice.stop": "⏹ रोकें",
    "voice.rupees": "रुपये",
    "voice.noVoice": "आपके डिवाइस में {lang} आवाज़ इंस्टॉल नहीं है। Android फ़ोन पर आज़माएँ, या डिवाइस की टेक्स्ट-टू-स्पीच सेटिंग में आवाज़ जोड़ें।",
    "voice.unsupported": "इस ब्राउज़र में आवाज़ की सुविधा नहीं है। Chrome या Edge आज़माएँ।",

    "title.home": "GramFin – ग्रामीण उद्यमियों के लिए वित्तीय सहायता",
    "home.h1": "<em>समझदारी भरे पैसों के फ़ैसलों</em> से बढ़ाएँ अपना व्यवसाय",
    "home.sub": "लोन, सरकारी योजनाएँ, डिजिटल भुगतान और बीमा को आसान भाषा में समझें। मुफ़्त, स्पष्ट और ग्रामीण उद्यमियों के लिए बना।",
    "home.btnSchemes": "मेरे लिए योजनाएँ खोजें", "home.btnEmi": "मेरी EMI निकालें",
    "home.todayH": "आज आप क्या करना चाहते हैं?", "home.todaySub": "शुरू करने के लिए एक चुनें।",
    "home.c1t": "सरकारी योजनाएँ", "home.c1d": "अपना व्यवसाय और राज्य बताएँ। हम वे योजनाएँ दिखाएँगे जिनके आप पात्र हो सकते हैं।",
    "home.c2t": "EMI कैलकुलेटर", "home.c2d": "उधार लेने से पहले अपनी मासिक किस्त और कुल ब्याज जानें।",
    "home.c3t": "लोन की तुलना", "home.c3d": "अलग-अलग तरह के लोन आमने-सामने देखें: ब्याज, दस्तावेज़ और कौन-सा किसके लिए ठीक है।",
    "home.c4t": "वित्त सीखें", "home.c4d": "UPI, लोन, बीमा, बचत और निवेश आसान भाषा में, क्विज़ के साथ।",
    "home.c5t": "धोखाधड़ी अलर्ट", "home.c5d": "आम ठगी के तरीके जानें और अपने पैसे व OTP को सुरक्षित रखें।",
    "home.howH": "GramFin कैसे मदद करता है", "home.howSub": "तीन आसान कदम।",
    "home.s1t": "सीखें", "home.s1d": "पैसों की बुनियादी बातों पर छोटे, आसान पाठ पढ़ें, कठिन शब्दों के बिना।",
    "home.s2t": "तुलना करें", "home.s2d": "योजनाएँ और लोन के विकल्प देखें और जानें कि कितना चुकाना होगा।",
    "home.s3t": "फ़ैसला लें", "home.s3d": "सही दस्तावेज़ लेकर अपने बैंक या CSC जाएँ और भरोसे के साथ आवेदन करें।",
    "home.notice": "<strong>कृपया ध्यान दें:</strong> GramFin केवल जागरूकता के लिए जानकारी देता है। हम बैंक या ऋणदाता नहीं हैं और कोई पैसा या निजी जानकारी नहीं लेते। हमेशा आधिकारिक स्रोत से जानकारी की पुष्टि करें।",

    "learn.h1": "📚 वित्त सीखें", "learn.sub": "छोटे, आसान पाठ। खोलने के लिए किसी विषय पर टैप करें।",
    "learn.quizH": "🧠 छोटी क्विज़", "learn.quizSub": "जो सीखा उसे परखें।",
    "quiz.correct": "✅ सही! ", "quiz.wrong": "❌ ठीक नहीं। ",
    "quiz.score": "आपका स्कोर: {s} / {n}", "quiz.perfect": "🎉 बिल्कुल सही!", "quiz.nice": "👍 अच्छा प्रयास!",

    "schemes.h1": "🏛️ सरकारी योजना खोजक", "schemes.sub": "अपने व्यवसाय के बारे में बताएँ और हम आपके लिए उपयुक्त योजनाएँ दिखाएँगे।",
    "f.type": "व्यवसाय का प्रकार", "f.state": "राज्य", "f.group": "विशेष श्रेणी",
    "type.all": "कोई भी व्यवसाय", "type.shop": "छोटी दुकान / खुदरा",
    "type.service": "सेवा (सैलून, मरम्मत, परिवहन…)", "type.manufacturing": "छोटा निर्माण / खाद्य प्रसंस्करण",
    "type.artisan": "कारीगर / शिल्पकार", "type.farm": "खेती / डेयरी / मत्स्य पालन", "type.vendor": "रेहड़ी-पटरी विक्रेता",
    "state.all": "पूरा भारत", "state.mh": "महाराष्ट्र", "state.other": "अन्य राज्य",
    "group.all": "कोई नहीं / सामान्य", "group.women": "महिला उद्यमी", "group.scst": "SC / ST उद्यमी",
    "btn.show": "योजनाएँ दिखाएँ", "btn.saved": "⭐ मेरी सहेजी योजनाएँ",
    "count.found": "मिली योजनाएँ: {n}", "count.saved": "सहेजी गई योजनाएँ: {n}",
    "scheme.who": "कौन आवेदन कर सकता है", "scheme.benefits": "लाभ", "scheme.docs": "ज़रूरी दस्तावेज़", "scheme.apply": "आवेदन कैसे करें",
    "btn.save": "☆ सहेजें", "btn.savedOn": "⭐ सहेजा गया", "btn.official": "आधिकारिक वेबसाइट ↗",
    "empty.schemes": "कोई योजना नहीं मिली। \"कोई भी व्यवसाय\" या \"पूरा भारत\" चुनकर देखें।",

    "calc.h1": "🧮 EMI कैलकुलेटर", "calc.sub": "लोन लेने से पहले अपनी मासिक किस्त देखें।",
    "calc.enter": "लोन का विवरण भरें", "calc.amount": "लोन की रकम (₹)", "calc.rate": "सालाना ब्याज दर (%)", "calc.years": "लोन की अवधि (साल)",
    "calc.hint": "टाइप करते ही नतीजे बदलते हैं। यह एक अनुमान है। शुल्क के कारण बैंक की अंतिम रकम थोड़ी अलग हो सकती है।",
    "calc.monthly": "आपकी मासिक EMI", "calc.legendLoan": "लोन की रकम", "calc.legendInt": "ब्याज",
    "calc.rLoan": "लोन की रकम", "calc.rInt": "कुल ब्याज", "calc.rTotal": "कुल चुकाई जाने वाली रकम", "calc.rMonths": "किस्तों की संख्या",
    "calc.tip": "💡 <strong>सुझाव:</strong> आपकी EMI आपके मासिक व्यवसाय मुनाफ़े से आराम से कम होनी चाहिए। ज़्यादा हो तो लंबी अवधि या छोटा लोन आज़माएँ।",

    "loans.h1": "⚖️ लोन विकल्पों की तुलना", "loans.sub": "तीन तक लोन प्रकार चुनें और उन्हें आमने-सामने देखें।",
    "loans.optA": "विकल्प A", "loans.optB": "विकल्प B", "loans.optC": "विकल्प C (वैकल्पिक)", "loans.none": "— कोई नहीं —", "loans.feature": "विशेषता",
    "loans.notice": "⚠️ दिखाई गई दरें और शुल्क <strong>सीखने के लिए अनुमानित सीमाएँ</strong> हैं, कोई ऑफ़र नहीं। असली दर आपके बैंक, आपकी प्रोफ़ाइल और तारीख पर निर्भर करती है। फ़ैसले से पहले हमेशा कुल लागत (ब्याज + शुल्क) पूछें और हमारा <a href='calculator.html'>EMI कैलकुलेटर</a> इस्तेमाल करें।",
    "row.provider": "प्रदाता", "row.amount": "लोन की रकम", "row.rate": "ब्याज दर", "row.fee": "प्रोसेसिंग फीस",
    "row.tenure": "चुकाने की अवधि", "row.collateral": "गिरवी / गारंटी", "row.documents": "दस्तावेज़", "row.bestFor": "किनके लिए सबसे उपयुक्त",

    "fraud.h1": "🛡️ धोखाधड़ी अलर्ट और सुरक्षा सुझाव", "fraud.sub": "आम ठगी के तरीके जानें ताकि आप अपने पैसे सुरक्षित रख सकें।",
    "fraud.ruleH": "🚨 सुनहरा नियम",
    "fraud.rule": "<strong>अपना OTP, UPI PIN, कार्ड PIN, CVV या पासवर्ड किसी को न बताएँ।</strong> उसे भी नहीं जो खुद को आपका बैंक, पुलिस या सरकारी दफ़्तर का बताए।",
    "fraud.common": "आम ठगी के तरीके", "fraud.commonSub": "पढ़ने में आसान, याद रखने में आसान।", "fraud.todo": "✔ क्या करें:",
    "fraud.checkH": "सुरक्षित रहने की जाँच-सूची",
    "fraud.l1": "बैंकिंग और UPI ऐप केवल Play Store / App Store से डाउनलोड करें।",
    "fraud.l2": "अपने फ़ोन पर स्क्रीन लॉक लगाएँ और UPI PIN गुप्त रखें।",
    "fraud.l3": "UPI भुगतान की पुष्टि करने से पहले दिखाया गया नाम जाँचें।",
    "fraud.l4": "अनजान SMS या WhatsApp संदेशों के लिंक पर क्लिक न करें।",
    "fraud.l5": "अपने बैंक के SMS अलर्ट नियमित देखें कि कहीं ऐसा लेन-देन तो नहीं जो आपने न किया हो।",
    "fraud.l6": "अगर आपके साथ ठगी हो जाए, तो तुरंत साइबर क्राइम हेल्पलाइन <strong>1930</strong> पर कॉल करें और <a href='https://cybercrime.gov.in' target='_blank' rel='noopener'>cybercrime.gov.in</a> पर शिकायत करें।"
  },

  // =====================================================================
  mr: {
    "lang.name": "मराठी",

    "nav.home": "मुख्यपृष्ठ", "nav.learn": "शिका", "nav.schemes": "योजना",
    "nav.calc": "EMI कॅल्क्युलेटर", "nav.loans": "कर्ज तुलना", "nav.fraud": "फसवणूक सूचना",
    "footer.line1": "GramFin — ग्रामीण उद्योजकांसाठी आर्थिक जागरूकता.",
    "footer.disc": "⚠️ GramFin फक्त माहिती आणि मार्गदर्शनासाठी आहे. ही बँक, कर्जदाता, विमा कंपनी किंवा आर्थिक सल्लागार नाही आणि कर्ज मंजुरी, विमा किंवा परताव्याची हमी देत नाही. योजनांचा तपशील बदलू शकतो — नेहमी अधिकृत वेबसाइटवर किंवा तुमच्या बँक शाखेत खात्री करा.",

    "voice.listen": "🔊 ऐका", "voice.listenPage": "🔊 हे पान ऐका", "voice.stop": "⏹ थांबवा",
    "voice.rupees": "रुपये",
    "voice.noVoice": "तुमच्या डिव्हाइसमध्ये {lang} आवाज इन्स्टॉल केलेला नाही. Android फोनवर वापरून पहा, किंवा डिव्हाइसच्या टेक्स्ट-टू-स्पीच सेटिंगमध्ये आवाज जोडा.",
    "voice.unsupported": "या ब्राउझरमध्ये आवाजाची सुविधा नाही. Chrome किंवा Edge वापरून पहा.",

    "title.home": "GramFin – ग्रामीण उद्योजकांसाठी आर्थिक मदत",
    "home.h1": "<em>हुशार आर्थिक निर्णयांनी</em> वाढवा तुमचा व्यवसाय",
    "home.sub": "कर्ज, सरकारी योजना, डिजिटल पेमेंट आणि विमा सोप्या भाषेत समजून घ्या. मोफत, स्पष्ट आणि ग्रामीण उद्योजकांसाठी बनवलेले.",
    "home.btnSchemes": "माझ्यासाठी योजना शोधा", "home.btnEmi": "माझा EMI काढा",
    "home.todayH": "आज तुम्हाला काय करायचे आहे?", "home.todaySub": "सुरुवात करण्यासाठी एक निवडा.",
    "home.c1t": "सरकारी योजना", "home.c1d": "तुमचा व्यवसाय आणि राज्य सांगा. तुम्ही पात्र असू शकता अशा योजना आम्ही दाखवू.",
    "home.c2t": "EMI कॅल्क्युलेटर", "home.c2d": "कर्ज घेण्यापूर्वी तुमचा मासिक हप्ता आणि एकूण व्याज जाणून घ्या.",
    "home.c3t": "कर्जांची तुलना", "home.c3d": "वेगवेगळ्या प्रकारची कर्जे शेजारी शेजारी पहा: व्याज, कागदपत्रे आणि कोणते कोणासाठी योग्य.",
    "home.c4t": "आर्थिक शिक्षण", "home.c4d": "UPI, कर्ज, विमा, बचत आणि गुंतवणूक सोप्या भाषेत, प्रश्नमंजुषेसह.",
    "home.c5t": "फसवणूक सूचना", "home.c5d": "सामान्य फसवणुकीचे प्रकार जाणा आणि तुमचे पैसे व OTP सुरक्षित ठेवा.",
    "home.howH": "GramFin कशी मदत करते", "home.howSub": "तीन सोप्या पायऱ्या.",
    "home.s1t": "शिका", "home.s1d": "पैशांच्या मूलभूत गोष्टींवर छोटे, सोपे धडे वाचा, अवघड शब्दांशिवाय.",
    "home.s2t": "तुलना करा", "home.s2d": "योजना आणि कर्जाचे पर्याय पहा आणि किती परत करावे लागेल ते काढा.",
    "home.s3t": "निर्णय घ्या", "home.s3d": "योग्य कागदपत्रे घेऊन तुमच्या बँकेत किंवा CSC मध्ये जा आणि आत्मविश्वासाने अर्ज करा.",
    "home.notice": "<strong>कृपया लक्षात घ्या:</strong> GramFin फक्त जागरूकतेसाठी माहिती देते. आम्ही बँक किंवा कर्जदाता नाही आणि कोणतेही पैसे किंवा वैयक्तिक माहिती घेत नाही. नेहमी अधिकृत स्रोताकडून माहितीची खात्री करा.",

    "learn.h1": "📚 आर्थिक शिक्षण", "learn.sub": "छोटे, सोपे धडे. उघडण्यासाठी एखाद्या विषयावर टॅप करा.",
    "learn.quizH": "🧠 झटपट प्रश्नमंजुषा", "learn.quizSub": "तुम्ही काय शिकलात ते तपासा.",
    "quiz.correct": "✅ बरोबर! ", "quiz.wrong": "❌ बरोबर नाही. ",
    "quiz.score": "तुमचा स्कोअर: {s} / {n}", "quiz.perfect": "🎉 उत्कृष्ट!", "quiz.nice": "👍 छान प्रयत्न!",

    "schemes.h1": "🏛️ सरकारी योजना शोधक", "schemes.sub": "तुमच्या व्यवसायाबद्दल सांगा आणि आम्ही तुम्हाला योग्य ठरू शकतील अशा योजना दाखवू.",
    "f.type": "व्यवसायाचा प्रकार", "f.state": "राज्य", "f.group": "विशेष प्रवर्ग",
    "type.all": "कोणताही व्यवसाय", "type.shop": "लहान दुकान / किरकोळ",
    "type.service": "सेवा (सलून, दुरुस्ती, वाहतूक…)", "type.manufacturing": "लहान उत्पादन / अन्न प्रक्रिया",
    "type.artisan": "कारागीर / शिल्पकार", "type.farm": "शेती / दुग्धव्यवसाय / मत्स्यपालन", "type.vendor": "रस्त्यावरील विक्रेता",
    "state.all": "संपूर्ण भारत", "state.mh": "महाराष्ट्र", "state.other": "इतर राज्य",
    "group.all": "काहीही नाही / सर्वसाधारण", "group.women": "महिला उद्योजक", "group.scst": "SC / ST उद्योजक",
    "btn.show": "योजना दाखवा", "btn.saved": "⭐ माझ्या जतन केलेल्या योजना",
    "count.found": "सापडलेल्या योजना: {n}", "count.saved": "जतन केलेल्या योजना: {n}",
    "scheme.who": "कोण अर्ज करू शकते", "scheme.benefits": "फायदे", "scheme.docs": "आवश्यक कागदपत्रे", "scheme.apply": "अर्ज कसा करावा",
    "btn.save": "☆ जतन करा", "btn.savedOn": "⭐ जतन केले", "btn.official": "अधिकृत वेबसाइट ↗",
    "empty.schemes": "कोणतीही योजना सापडली नाही. \"कोणताही व्यवसाय\" किंवा \"संपूर्ण भारत\" निवडून पहा.",

    "calc.h1": "🧮 EMI कॅल्क्युलेटर", "calc.sub": "कर्ज घेण्यापूर्वी तुमचा मासिक हप्ता पहा.",
    "calc.enter": "कर्जाचा तपशील भरा", "calc.amount": "कर्जाची रक्कम (₹)", "calc.rate": "वार्षिक व्याजदर (%)", "calc.years": "कर्जाचा कालावधी (वर्षे)",
    "calc.hint": "टाइप करताच निकाल बदलतो. हा अंदाज आहे. शुल्कांमुळे बँकेची अंतिम रक्कम थोडी वेगळी असू शकते.",
    "calc.monthly": "तुमचा मासिक EMI", "calc.legendLoan": "कर्जाची रक्कम", "calc.legendInt": "व्याज",
    "calc.rLoan": "कर्जाची रक्कम", "calc.rInt": "एकूण व्याज", "calc.rTotal": "एकूण परतफेड", "calc.rMonths": "हप्त्यांची संख्या",
    "calc.tip": "💡 <strong>सूचना:</strong> तुमचा EMI तुमच्या मासिक व्यवसाय नफ्यापेक्षा सहज कमी असावा. जास्त असेल तर जास्त कालावधी किंवा लहान कर्ज वापरून पहा.",

    "loans.h1": "⚖️ कर्ज पर्यायांची तुलना", "loans.sub": "तीन पर्यंत कर्ज प्रकार निवडा आणि ते शेजारी शेजारी पहा.",
    "loans.optA": "पर्याय A", "loans.optB": "पर्याय B", "loans.optC": "पर्याय C (ऐच्छिक)", "loans.none": "— काहीही नाही —", "loans.feature": "वैशिष्ट्य",
    "loans.notice": "⚠️ दाखवलेले दर आणि शुल्क <strong>शिकण्यासाठी अंदाजे मर्यादा</strong> आहेत, ऑफर नाहीत. खरा दर तुमची बँक, तुमची प्रोफाइल आणि तारीख यावर अवलंबून असतो. निर्णयापूर्वी नेहमी एकूण खर्च (व्याज + शुल्क) विचारा आणि आमचा <a href='calculator.html'>EMI कॅल्क्युलेटर</a> वापरा.",
    "row.provider": "पुरवठादार", "row.amount": "कर्जाची रक्कम", "row.rate": "व्याजदर", "row.fee": "प्रोसेसिंग फी",
    "row.tenure": "परतफेडीचा कालावधी", "row.collateral": "तारण", "row.documents": "कागदपत्रे", "row.bestFor": "कोणासाठी सर्वोत्तम",

    "fraud.h1": "🛡️ फसवणूक सूचना आणि सुरक्षा टिप्स", "fraud.sub": "सामान्य फसवणुकीचे प्रकार जाणा म्हणजे तुम्ही तुमचे पैसे सुरक्षित ठेवू शकाल.",
    "fraud.ruleH": "🚨 सुवर्ण नियम",
    "fraud.rule": "<strong>तुमचा OTP, UPI PIN, कार्ड PIN, CVV किंवा पासवर्ड कोणालाही सांगू नका.</strong> स्वतःला तुमची बँक, पोलीस किंवा सरकारी कार्यालयाचे सांगणाऱ्यालाही नाही.",
    "fraud.common": "सामान्य फसवणुकीचे प्रकार", "fraud.commonSub": "वाचायला सोपे, लक्षात ठेवायला सोपे.", "fraud.todo": "✔ काय करावे:",
    "fraud.checkH": "सुरक्षित राहण्याची यादी",
    "fraud.l1": "बँकिंग आणि UPI ॲप्स फक्त Play Store / App Store वरून डाउनलोड करा.",
    "fraud.l2": "तुमच्या फोनला स्क्रीन लॉक लावा आणि UPI PIN गुप्त ठेवा.",
    "fraud.l3": "कोणत्याही UPI पेमेंटची खात्री करण्यापूर्वी दाखवलेले नाव तपासा.",
    "fraud.l4": "अनोळखी SMS किंवा WhatsApp संदेशांमधील लिंकवर क्लिक करू नका.",
    "fraud.l5": "तुम्ही न केलेल्या व्यवहारांसाठी तुमच्या बँकेचे SMS अलर्ट नियमित तपासा.",
    "fraud.l6": "फसवणूक झाल्यास, ताबडतोब सायबर क्राइम हेल्पलाइन <strong>1930</strong> वर कॉल करा आणि <a href='https://cybercrime.gov.in' target='_blank' rel='noopener'>cybercrime.gov.in</a> वर तक्रार नोंदवा."
  }
};
