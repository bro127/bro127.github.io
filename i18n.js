/* ==========================================================================
   BKHAWK — bilingual layer
   English is the default. Amharic is one tap away and persists in localStorage.
   Every public string lives here; markup carries data-i18n keys.
   ========================================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "bkhawk_lang";
  var DEFAULT_LANG = "en";
  var SUPPORTED = ["am", "en"];

  var DICT = {
    en: {
      /* Brand + navigation */
      "brand.tag": "Certification Studio",
      "meta.title.landing": "BKHAWK — Certification Studio",
      "meta.title.app": "BKHAWK — Intake & Status",
      "nav.process": "Process",
      "nav.tracks": "Tracks",
      "nav.standards": "Standards",
      "nav.faq": "FAQ",
      "nav.admin": "Admin",
      "nav.enter": "Open portal",
      "nav.home": "Home",
      "nav.intake": "Intake",
      "nav.status": "Status",
      "nav.language": "Language",
      "a11y.skip": "Skip to content",

      /* Landing hero */
      "hero.chip.name": "Udacity Global Chapters · Ethiopia",
      "hero.chip.tag": "Intake open",
      "hero.title.a": "Four Udacity tracks.",
      "hero.title.b": "One quiet pipeline.",
      "hero.lead":
        "BKHAWK completes all four Ethiopia Global Chapters tracks for you — then hands back <strong>clean, uncropped A4 landscape PDFs</strong> with live verification links. Free to submit. The 50 ETB lands only when your certificates are ready.",
      "hero.cta.start": "Start intake",
      "hero.cta.status": "Check a submission",
      "hero.note": "Free intake · 50 ETB at claim · Telebirr or @nameofbless",

      "chat.title": "Certification Studio",
      "chat.online": "Reviewer online",
      "chat.user": "“All four tracks, please — uncropped landscape PDFs.”",
      "chat.intro": "On it. Here’s what leaves the bench:",
      "chat.input": "Describe your certification run…",
      "chat.send": "Start intake",
      "pill.a4": "A4 landscape",
      "pill.scale": "Scale 0.82",
      "pill.verified": "Verified links",
      "pill.pay": "Pay at claim",

      /* Stats strip */
      "stats.tracks.num": "04",
      "stats.tracks.label": "Tracks completed",
      "stats.free.num": "Free",
      "stats.free.label": "Intake, no deposit",
      "stats.fee.num": "50 ETB",
      "stats.fee.label": "Only at claim",
      "stats.paper.num": "A4",
      "stats.paper.label": "Landscape, uncropped",

      /* Process */
      "process.eyebrow": "The pipeline",
      "process.title": "Careful by design.",
      "process.sub":
        "No deposit to start, no forms to chase. Four deliberate stages — and the fee arrives only when the work is done.",
      "process.s1.title": "Intake — free",
      "process.s1.body":
        "Share the certificate name, account email and the tracks you need. No payment, no sign-in, no deposit.",
      "process.s2.title": "Review & solve",
      "process.s2.body":
        "A reviewer checks the intake, then the solver completes your tracks with credentials held in escrow.",
      "process.s3.title": "Approval",
      "process.s3.body":
        "Your status page flips to Approved. Only now does the 50 ETB claim open — the password and files stay sealed.",
      "process.s4.title": "Pay & claim",
      "process.s4.body":
        "Pay via Telebirr, or verify manually through <a class=\"inline-link\" href=\"https://t.me/nameofbless\" target=\"_blank\" rel=\"noopener\">@nameofbless</a>. Then the new password and PDFs release.",

      /* Tracks */
      "tracks.eyebrow": "Official curriculum",
      "tracks.title": "Four tracks, covered <em>end to end.</em>",
      "tracks.sub":
        "Every Ethiopia Global Chapters track, completed with the same standard of care — and the same clean paperwork.",
      "tracks.programming.body":
        "Python syntax, control flow, functions, and the data structures that follow you into every codebase after.",
      "tracks.android.body":
        "Kotlin architecture, layouts, ViewModels, and state that behaves the way the screen promises it will.",
      "tracks.ai.body":
        "Machine-learning workflows, model behaviour, and the practical shape of generative AI in real work.",
      "tracks.data.body":
        "SQL joins, aggregation, and analytics you can stand behind when someone asks where the number came from.",
      "tracks.programming.tag1": "Python",
      "tracks.programming.tag2": "Logic",
      "tracks.programming.tag3": "Data structures",
      "tracks.android.tag1": "Kotlin",
      "tracks.android.tag2": "Layouts",
      "tracks.android.tag3": "ViewModel",
      "tracks.ai.tag1": "ML workflows",
      "tracks.ai.tag2": "GenAI",
      "tracks.ai.tag3": "Evaluation",
      "tracks.data.tag1": "SQL",
      "tracks.data.tag2": "Analysis",
      "tracks.data.tag3": "Reporting",

      /* Standards */
      "standards.eyebrow": "Precision standards",
      "standards.title": "Built to the <em>millimetre.</em>",
      "standards.sub":
        "Certificate files are treated like documents, not screenshots. Every edge, every link, every page — exact.",
      "standards.escrow.eyebrow": "Escrow by default",
      "standards.escrow.title": "Nothing unlocks early.",
      "standards.escrow.body":
        "Credentials are sealed the moment intake lands. The files and the new password stay locked through review and solving — then open together, only after the 50 ETB claim clears.",
      "vault.1": "Intake received",
      "vault.2": "Credentials sealed",
      "vault.3": "Tracks approved",
      "vault.4": "Payment verified",
      "vault.5": "Package released",
      "standards.landscape.title": "Landscape, uncropped.",
      "standards.landscape.body":
        "Every certificate renders to exact one-page A4 landscape with the <code>scale 0.82</code> engine — no clipped borders, no cut names, no missing verification links.",
      "standards.verify.title": "Live verification.",
      "standards.verify.body":
        "Each credential carries its own <code>confirm.udacity.com/lp/…</code> link, ready for anyone who asks — employers included.",
      "standards.package.title": "The full package.",
      "standards.package.body":
        "Individual certificate PDFs plus one ZIP archive, assembled at release. Everything stays downloadable from your status page — no expiry games.",
      "standards.package.bundled": "All four, bundled",
      "cert.name.sample": "Bruk Getachew",
      "cert.kicker": "Udacity · Global Chapters",
      "cert.caption": "Certificate of Completion",
      "cert.meta": "Programming Fundamentals · 2026",

      /* FAQ */
      "faq.eyebrow": "Questions, answered",
      "faq.title": "The fine print, plainly.",
      "faq.q1": "When exactly do I pay the 50 ETB?",
      "faq.a1":
        "After your intake is reviewed and the tracks are approved — never before. The claim panel opens on your status page at that point, and the password plus certificates stay sealed until the payment is verified.",
      "faq.q2": "How do I pay, and what if I don’t have a reference?",
      "faq.a2":
        "Pay 50 ETB through Telebirr to the accepter number on this page, then paste the transaction reference into the claim panel. If you paid cash or can’t find the reference, message <a class=\"inline-link\" href=\"https://t.me/nameofbless\" target=\"_blank\" rel=\"noopener\">@nameofbless</a> on Telegram for manual verification.",
      "faq.q3": "Do I need a Google account or a sign-in?",
      "faq.a3":
        "No. Identity is your BK-XXXXXX submission ID — keep it private, because it opens your status, your claim and your downloads. There is no Google sign-in anywhere in the flow.",
      "faq.q4": "What exactly gets delivered after release?",
      "faq.a4":
        "Four individual certificate PDFs — one per track — plus a ZIP archive, and the new Udacity password for the account. Every file is one-page A4 landscape, uncropped, with its verification link intact.",
      "faq.q5": "How long does review take?",
      "faq.a5":
        "Most intakes are reviewed and solved the same day. Your status panel shows each stage — Pending, In progress, Approved, Payment under review, Released — so you always know where things stand.",
      "faq.q6": "Can someone verify the certificate?",
      "faq.a6":
        "Every certificate carries a live <code>confirm.udacity.com/lp/…</code> link. Anyone holding the file can open that link and confirm the credential directly with Udacity.",

      /* Closing call to action */
      "cta.title": "Start free. Pay only when it’s done.",
      "cta.sub": "Intake takes a minute. Your BK ID is the only key you need.",
      "cta.button": "Open the portal",

      /* Footer */
      "footer.tagline":
        "A quiet certification pipeline for Udacity Global Chapters Ethiopia. Four tracks, one fee at claim, documents done properly.",
      "footer.explore": "Explore",
      "footer.portal": "Portal",
      "footer.contact": "Contact",
      "footer.home": "Home",
      "footer.receiver": "Receiver · BKHAWK",
      "footer.place": "Dessie, Ethiopia",
      "footer.rights": "© 2026 BKHAWK Hacking",
      "footer.made": "Built quietly · delivered exactly",

      /* Application page */
      "app.eyebrow": "Intake & escrow",
      "app.title": "Tell us who’s <em>graduating.</em>",
      "app.sub":
        "One free form. The 50 ETB only appears after approval, right before you claim the password and files.",
      "app.point1": "Free to submit — no deposit, no payment up front.",
      "app.point2": "Your BK ID is your identity — no Google sign-in needed.",
      "app.point3": "Four tracks by default — untick any you don’t need.",
      "app.point4":
        "Manual payment checks handled by <a href=\"https://t.me/nameofbless\" target=\"_blank\" rel=\"noopener\" class=\"inline-link\">@nameofbless</a>.",
      "app.pay.label": "Payment &middot; due after approval",
      "app.pay.receiver": "BKHAWK",
      "app.pay.note":
        "Receiver: BKHAWK. Pay only once your status says Approved. No reference yet? Message <a href=\"https://t.me/nameofbless\" target=\"_blank\" rel=\"noopener\" class=\"inline-link\">@nameofbless</a>.",
      "app.copy": "Copy",

      "form.badge": "01 — Intake",
      "form.title": "Candidate intake",
      "form.sub": "Every field is required unless marked optional. No payment here.",
      "form.name": "Full name",
      "form.name.hint": "— exactly as it should appear on the certificate",
      "form.name.ph": "e.g. Bruk Getachew",
      "form.email": "Udacity account email",
      "form.password": "Udacity password",
      "form.password.hint": "— sealed on arrival",
      "form.phone": "Phone number",
      "form.tracks": "Certification tracks",
      "track.programming": "Programming Fundamentals",
      "track.android": "Android Developer",
      "track.ai": "AI Fundamentals",
      "track.data": "Data Fundamentals",
      "form.nopay.title": "No payment now.",
      "form.nopay.body":
        "When review approves your run, your status page opens the 50 ETB claim — Telebirr, or manual verification through <a href=\"https://t.me/nameofbless\" target=\"_blank\" rel=\"noopener\" class=\"inline-link\">@nameofbless</a>.",
      "form.submit": "Submit for review",
      "form.submitting": "Sending securely…",
      "form.submitted": "✓ Submitted",
      "form.fineprint":
        "You’ll receive a BK-XXXXXX ID immediately. That ID is your key — no account sign-in required.",

      "stage.title": "Status: Pending review",
      "stage.body":
        "Your credentials are stored and sealed. A reviewer is checking the intake now — nothing is due yet.",
      "meta.id": "Submission ID",
      "meta.submitted": "Submitted",
      "meta.candidate": "Candidate",
      "meta.payment": "Payment",
      "meta.payment.value": "50 ETB · after approval",
      "meta.tracks": "Tracks",
      "meta.reference": "Payment reference",
      "meta.notes": "Reviewer notes",
      "step.submitted": "Submitted",
      "step.review": "Review",
      "step.approved": "Approved",
      "step.claim": "Claim",
      "btn.copyId": "Copy ID",
      "btn.openStatus": "Open status",

      "status.eyebrow": "Track your submission",
      "status.title": "Where’s my certificate?",
      "status.sub":
        "Enter the ID you received at intake to follow the stage — and to claim the password and files once approved.",
      "status.placeholder": "BK-XXXXXX",
      "status.check": "Check status",
      "status.tip1": "Your ID is a six-character code that starts with BK-.",
      "status.tip2": "The payment panel appears by itself once the status flips to Approved.",
      "status.tip3": "The released password and files show up on this same page.",
      "status.help.title": "Need a hand?",
      "status.help.body":
        "If you lost the ID or a payment is stuck, message <a href=\"https://t.me/nameofbless\" target=\"_blank\" rel=\"noopener\" class=\"inline-link\">@nameofbless</a> on Telegram.",
      "status.querying": "Querying the status database…",
      "status.notfound": "Submission not found",
      "status.notfoundbody":
        "No submission matches <span class=\"mono\">{id}</span>. Check the spelling, or start an intake.",
      "status.error": "Error",

      /* Live stages */
      "badge.pending": "Pending review",
      "badge.running": "In progress",
      "badge.approved": "Approved — payment due",
      "badge.payreview": "Payment under review",
      "badge.released": "Released",
      "badge.failed": "Failed",

      "claim.eyebrow": "Payment due · after approval",
      "claim.copy":
        "Your tracks are approved. Pay <strong>{fee} Birr</strong> through Telebirr to the accepter below, then submit the transaction reference. The new password and certificates release once it is verified.",
      "claim.reference": "Telebirr reference or receipt link",
      "claim.submit": "Submit reference",
      "claim.sending": "Sending…",
      "claim.manual":
        "No reference, or paid another way? Message <a class=\"inline-link\" href=\"https://t.me/nameofbless\" target=\"_blank\" rel=\"noopener\">@nameofbless</a> on Telegram for manual verification.",
      "claim.ok": "Reference received — awaiting confirmation.",
      "claim.short": "Enter the Telebirr reference or receipt link first.",
      "claim.verifiedNote":
        "Reference <strong>{ref}</strong> is being verified. The package releases as soon as it clears — ping <a class=\"inline-link\" href=\"https://t.me/nameofbless\" target=\"_blank\" rel=\"noopener\">@nameofbless</a> if it has been a while.",

      "release.title": "Package released",
      "release.unlocked": "Unlocked",
      "release.newPassword": "New Udacity password",
      "release.password": "Udacity password",
      "release.account": "Account",
      "release.copy": "Copy",
      "release.rotated":
        "The account password was rotated when the run was approved — sign in with the password above.",
      "release.same":
        "Password rotation was skipped for this run — use the account password above and change it after signing in.",
      "release.certs": "Certificate package",
      "release.download.pdf": "Download PDF",
      "release.download.zip": "Download ZIP",
      "release.verify": "Verify",
      "release.empty":
        "No files are attached yet. Message <a class=\"inline-link\" href=\"https://t.me/nameofbless\" target=\"_blank\" rel=\"noopener\">@nameofbless</a> and they will be generated for this submission.",

      "note.pending":
        "Intake received and queued for review. Payment has not opened yet — you will see the 50 ETB claim here once the tracks are approved.",
      "note.running":
        "The solver is running through your tracks now. Nothing is due until the run is approved.",
      "note.failed":
        "This run needs attention. Message <a class=\"inline-link\" href=\"https://t.me/nameofbless\" target=\"_blank\" rel=\"noopener\">@nameofbless</a> with your submission ID and the reviewer will pick it up.",

      "toast.copied": "{value} copied",
      "toast.copyFail": "Copy failed — select the value manually.",
      "toast.noId": "No submission ID yet.",
      "toast.noActive": "No active submission found.",
      "toast.needFields": "Complete name, email, password and phone first.",
      "toast.needTrack": "Select at least one certification track.",
      "toast.submitted": "Submission received — nothing due yet.",
      "toast.approved": "Tracks approved — the 50 ETB claim is open.",
      "toast.released": "Payment verified — package released.",
      "toast.failed": "Automation reported a failure. Contact the reviewer.",
      "toast.needRef": "Enter the Telebirr reference or receipt link first.",
      "toast.noPassword": "Password is not available yet.",
      "toast.enterId": "Enter a submission ID first."
    },

    am: {
      "brand.tag": "ሴርቲፊኬሽን ስቱዲዮ",
      "nav.process": "ፕሮሰስ",
      "nav.tracks": "ትራኮች",
      "nav.standards": "ስታንዳርዶች",
      "nav.faq": "FAQ",
      "nav.admin": "አድሚን",
      "nav.enter": "ፖርታል ክፈት",
      "nav.home": "ሆም",
      "nav.intake": "ኢንቴክ",
      "nav.status": "ስታተስ",
      "nav.language": "ቋንቋ",
      "hero.chip.name": "Udacity Global Chapters · Ethiopia",
      "hero.chip.tag": "ኢንቴክ ክፍት ነው",
      "hero.title.a": "አራት የUdacity ትራኮች።",
      "hero.title.b": "አንድ ጸጥ ያለ ፓይፕላይን።",
      "hero.lead": "BKHAWK አራቱንም የEthiopia Global Chapters ትራኮች ይሰራልሃል — ከዛም ከነ አክቲቭ ቨሪፊኬሽን ሊንካቸው <strong>ንጹህ፣ ሳይቆራረጡ የተዘጋጁ A4 landscape PDF</strong>ዎችን ያስረክብሃል። ስብሚት ማድረግ ፍሪ ነው፤ 50 ETB የሚከፈለው ሴርቲፊኬቶችህ ሲደርሱ ብቻ ነው።",
      "hero.cta.start": "ኢንቴክ ጀምር",
      "hero.cta.status": "ሱብሚሽን ቼክ አድርግ",
      "hero.note": "ፍሪ ኢንቴክ · 50 ETB ለመቀበል · በTelebirr ወይም @nameofbless",
      "chat.title": "ሴርቲፊኬሽን ስቱዲዮ",
      "chat.online": "ሪቪውወር ኦንላይን ነው",
      "chat.user": "“አራቱንም ትራኮች እባክህ — ሳይቆራረጡ በlandscape PDF።”",
      "chat.intro": "አለሁልህ፤ የሚዘጋጅልህ ይሄ ነው:",
      "chat.input": "ስለ ሴርቲፊኬሽንህ ጻፍ…",
      "chat.send": "ኢንቴክ ጀምር",
      "pill.a4": "A4 landscape",
      "pill.scale": "Scale 0.82",
      "pill.verified": "ቨሪፋይድ ሊንኮች",
      "pill.pay": "ሲደርስ ክፈል",
      "stats.tracks.num": "04",
      "stats.tracks.label": "የተጠናቀቁ ትራኮች",
      "stats.free.num": "ፍሪ",
      "stats.free.label": "ኢንቴክ፣ ቅድመ ክፍያ የለም",
      "stats.fee.num": "50 ETB",
      "stats.fee.label": "ሲደርስ ብቻ የሚከፈል",
      "stats.paper.num": "A4",
      "stats.paper.label": "Landscape፣ ሳይቆራረጥ",
      "process.eyebrow": "ፓይፕላይኑ",
      "process.title": "በጥንቃቄ የተሰራ።",
      "process.sub": "ለመጀመር ቅድመ ክፍያ የለም፣ ብዙ ፎርም መሙላትም አይጠበቅብህም። አራት የታሰበባቸው ስቴፖች ብቻ — ክፍያውም ስራው ሲያልቅ ነው።",
      "process.s1.title": "ኢንቴክ — ፍሪ",
      "process.s1.body": "ሴርቲፊኬቱ ላይ የሚወጣውን ስም፣ የአካውንትህን ኢሜይል እና የምትፈልጋቸውን ትራኮች አስገባ። ክፍያ፣ ሳይን-ኢን ወይም ቅድመ ክፍያ የለም።",
      "process.s2.title": "ሪቪው እና ሶልቭ",
      "process.s2.body": "ሪቪውወሩ ኢንቴክህን ቼክ ያደርጋል፣ ከዛም የገቡት መረጃዎች በescrow ተጠብቀው ትራኮችህ ይሰሩልሃል።",
      "process.s3.title": "አፕሮቫል",
      "process.s3.body": "የስታተስ ገጽህ ወደ Approved ይቀየራል። የ50 ETB ክሌይም ክፍት የሚሆነው አሁን ነው — ፓስወርዱ እና ፋይሎቹ እንደታሸጉ ይቆያሉ።",
      "process.s4.title": "ክፈል እና ተረከብ",
      "process.s4.body": "በTelebirr ክፈል፣ ወይም በ<a class=\"inline-link\" href=\"https://t.me/nameofbless\" target=\"_blank\" rel=\"noopener\">@nameofbless</a> በኩል ማኑዋል ቨሪፋይ አድርግ። ከዛም አዲሱ ፓስወርድ እና PDFዎቹ ሪሊዝ ይደረጋሉ።",
      "tracks.eyebrow": "ኦፊሴላዊ ካሪኩለም",
      "tracks.title": "አራቱም ትራኮች፣ <em>ከዳር እስከ ዳር የተሟሉ።</em>",
      "tracks.sub": "እያንዳንዱ የEthiopia Global Chapters ትራክ በተመሳሳይ ከፍተኛ ጥራት እና ንጹህ ዶክመንት ተሰርቶ ይደርሳል።",
      "tracks.programming.body": "የPython syntax፣ control flow፣ functions እና ወደፊት በማንኛውም ኮድ ውስጥ የሚያስፈልጉህ data structures።",
      "tracks.android.body": "የKotlin architecture፣ layouts፣ ViewModels እና ስክሪን ላይ በትክክል የሚሰራ state።",
      "tracks.ai.body": "የMachine-learning workflows፣ የሞዴል ባህሪ እና በገሃዱ ስራ ላይ የgenerative AI አጠቃቀም።",
      "tracks.data.body": "የSQL joins፣ aggregation እና ቁጥሩ ከየት መጣ ስትባል በልበ ሙሉነት የምታሳየው analytics።",
      "tracks.programming.tag1": "Python",
      "tracks.programming.tag2": "Logic",
      "tracks.programming.tag3": "Data structures",
      "tracks.android.tag1": "Kotlin",
      "tracks.android.tag2": "Layouts",
      "tracks.android.tag3": "ViewModel",
      "tracks.ai.tag1": "ML workflows",
      "tracks.ai.tag2": "GenAI",
      "tracks.ai.tag3": "Evaluation",
      "tracks.data.tag1": "SQL",
      "tracks.data.tag2": "Analysis",
      "tracks.data.tag3": "Reporting",
      "standards.eyebrow": "የጥራት ስታንዳርድ",
      "standards.title": "እስከ <em>ሚሊሜትር</em> ጥንቃቄ የተሰራ።",
      "standards.sub": "የሴርቲፊኬት ፋይሎች እንደ ትክክለኛ ዶክመንት እንጂ እንደ ስክሪንሽት አይቆጠሩም። እያንዳንዱ ጠርዝ፣ እያንዳንዱ ሊንክ እና ገጽ — ትክክለኛ ነው።",
      "standards.escrow.eyebrow": "ሁሌም በEscrow የተጠበቀ",
      "standards.escrow.title": "ቀድሞ የሚከፈት ነገር የለም።",
      "standards.escrow.body": "ኢንቴክ እንደገባ መረጃዎችህ ወዲያውኑ ይታሸጋሉ። ፋይሎቹ እና አዲሱ ፓስወርድ በሪቪው እና በስራው ሂደት ተቆልፈው ይቆያሉ — የሚከፈቱትም የ50 ETB ክፍያ ከተረጋገጠ በኋላ በአንድ ላይ ብቻ ነው።",
      "vault.1": "ኢንቴክ ደርሷል",
      "vault.2": "መረጃዎች ታሽገዋል",
      "vault.3": "ትራኮች አፕሮቭ ተደርገዋል",
      "vault.4": "ክፍያ ተረጋግጧል",
      "vault.5": "ፓኬጁ ሪሊዝ ተደርጓል",
      "standards.landscape.title": "Landscape፣ ሳይቆራረጥ።",
      "standards.landscape.body": "እያንዳንዱ ሴርቲፊኬት በ<code>scale 0.82</code> ኢንጂን አንድ ሙሉ ገጽ A4 landscape ሆኖ ይወጣል — የተቆረጠ ጠርዝ፣ ያልተሟላ ስም ወይም የቀረ ቨሪፊኬሽን ሊንክ የለም።",
      "standards.verify.title": "ላይቭ ቨሪፊኬሽን።",
      "standards.verify.body": "እያንዳንዱ ሴርቲፊኬት የራሱ <code>confirm.udacity.com/lp/…</code> ሊንክ አለው፣ ቀጣሪዎችን ጨምሮ ማንም ሰው በቀላሉ ቼክ ማድረግ ይችላል።",
      "standards.package.title": "ሙሉ ፓኬጁ።",
      "standards.package.body": "የየብቻ ሴርቲፊኬት PDFዎች እና አንድ ላይ የተጠቃለለ ZIP ፋይል ሪሊዝ ሲደረግ ይዘጋጃል። ከስታተስ ገጽህ ሁሌም ዳውንሎድ ማድረግ ትችላለህ — ምንም ኤክስፓየሪ የለም።",
      "standards.package.bundled": "አራቱም በአንድ ላይ",
      "cert.name.sample": "Bruk Getachew",
      "cert.kicker": "Udacity · Global Chapters",
      "cert.caption": "Certificate of Completion",
      "cert.meta": "Programming Fundamentals · 2026",
      "faq.eyebrow": "የተለመዱ ጥያቄዎች",
      "faq.title": "ዝርዝሩን በቀላሉ።",
      "faq.q1": "50 ETB በትክክል መቼ ነው የምከፍለው?",
      "faq.a1": "ኢንቴክህ ሪቪው ተደርጎ ትራኮቹ አፕሮቭ ከተደረጉ በኋላ — በጭራሽ ከዚያ በፊት አይደለም። በዛን ሰዓት በስታተስ ገጽህ ላይ የክሌይም ፓነሉ ይከፈታል፤ ክፍያው ቨሪፋይ እስኪሆን ድረስ ግን ፓስወርዱ እና ሴርቲፊኬቶቹ እንደታሸጉ ይቆያሉ።",
      "faq.q2": "እንዴት ነው የምከፍለው? ሪፈረንስ ከሌለኝስ?",
      "faq.a2": "በዚህ ገጽ ላይ ባለው የTelebirr ቁጥር 50 ETB ክፈልና የትራንዛክሽን ሪፈረንሱን ክሌይም ፓነሉ ላይ ፔስት አድርግ። በካሽ ከከፈልክ ወይም ሪፈረንሱ ካልተገኘ፣ ለማኑዋል ቨሪፊኬሽን በTelegram ለ<a class=\"inline-link\" href=\"https://t.me/nameofbless\" target=\"_blank\" rel=\"noopener\">@nameofbless</a> መልእክት ላክ።",
      "faq.q3": "የGoogle አካውንት ወይም ሳይን-ኢን ያስፈልገኛል?",
      "faq.a3": "አያስፈልግም። መለያህ የBK-XXXXXX ሱብሚሽን IDህ ነው — ለማንም እንዳታጋራው፣ ምክንያቱም ስታተስህን፣ ክሌይምህን እና ዳውንሎድህን የሚከፍተው እሱ ነው። ሲስተሙ ውስጥ የGoogle ሳይን-ኢን በጭራሽ የለም።",
      "faq.q4": "ሪሊዝ ከተደረገ በኋላ በትክክል ምን ምን ይደርሰኛል?",
      "faq.a4": "አራት የየብቻ ሴርቲፊኬት PDFዎች — ለእያንዳንዱ ትራክ አንድ — ፕላስ አንድ የZIP ፋይል እና ለአካውንቱ አዲሱ የUdacity ፓስወርድ። እያንዳንዱ ፋይል ሳይቆራረጥ፣ ከነ ቨሪፊኬሽን ሊንኩ በአንድ ገጽ A4 landscape የተዘጋጀ ነው።",
      "faq.q5": "ሪቪው ምን ያህል ጊዜ ይወስዳል?",
      "faq.a5": "አብዛኛዎቹ ኢንቴኮች በዕለቱ ሪቪው ተደርገው ያልቃሉ። የስታተስ ፓነልህ እያንዳንዱን ስቴጅ — Pending፣ In progress፣ Approved፣ Payment under review፣ Released — ስለሚያሳይህ የየት እንደደረሰ ሁሌም ታውቃለህ።",
      "faq.q6": "ሴርቲፊኬቱን ሰው ቨሪፋይ ማድረግ ይችላል?",
      "faq.a6": "እያንዳንዱ ሴርቲፊኬት ላይቭ <code>confirm.udacity.com/lp/…</code> ሊንክ አለው። ፋይሉ በእጁ ያለ ማንኛውም ሰው ሊንኩን ከፍቶ በቀጥታ ከUdacity ማረጋገጥ ይችላል።",
      "cta.title": "በነጻ ጀምር። ስራው ሲያልቅ ብቻ ክፈል።",
      "cta.sub": "ኢንቴክ አንድ ደቂቃ ነው የሚወስደው። የሚያስፈልግህ ብቸኛው ቁልፍ የBK IDህ ነው።",
      "cta.button": "ፖርታሉን ክፈት",
      "footer.tagline": "ለUdacity Global Chapters Ethiopia የተዘጋጀ ፈጣንና ጸጥ ያለ የሴርቲፊኬሽን ፓይፕላይን። አራት ትራኮች፣ ሲደርስ የሚከፈል አንድ ክፍያ፣ በትክክል የተሰሩ ዶክመንቶች።",
      "footer.explore": "ተመልከት",
      "footer.portal": "ፖርታል",
      "footer.contact": "ኮንታክት",
      "footer.home": "ሆም",
      "footer.receiver": "ተቀባይ · BKHAWK",
      "footer.place": "Dessie, Ethiopia",
      "footer.rights": "© 2026 BKHAWK Hacking",
      "footer.made": "በጥንቃቄ የተሰራ · በትክክል የሚደርስ",
      "app.eyebrow": "ኢንቴክ እና Escrow",
      "app.title": "ማን እንደሚመረቅ <em>ንገረን።</em>",
      "app.sub": "አንድ ነጻ ፎርም ብቻ። የ50 ETB ክፍያ የሚመጣው አፕሮቭ ከተደረገ በኋላ፣ ፓስወርዱን እና ፋይሎቹን ከመረከብህ በፊት ነው።",
      "app.point1": "ስብሚት ማድረግ ፍሪ ነው — ምንም ቅድመ ክፍያ የለም።",
      "app.point2": "የBK IDህ መለያህ ነው — ምንም የGoogle ሳይን-ኢን አያስፈልግም።",
      "app.point3": "በነባሪ አራቱም ትራኮች ተመርጠዋል — የማትፈልገውን አንቲክ አድርገው።",
      "app.point4": "የማኑዋል ክፍያ ቼክ በ<a href=\"https://t.me/nameofbless\" target=\"_blank\" rel=\"noopener\" class=\"inline-link\">@nameofbless</a> በኩል ይስተናገዳል።",
      "app.pay.label": "ክፍያ &middot; ከአፕሮቫል በኋላ የሚከፈል",
      "app.pay.receiver": "BKHAWK",
      "app.pay.note": "ተቀባይ: BKHAWK። ስታተስህ Approved ሲል ብቻ ክፈል። እስካሁን ሪፈረንስ የለህም? ለ<a href=\"https://t.me/nameofbless\" target=\"_blank\" rel=\"noopener\" class=\"inline-link\">@nameofbless</a> መልእክት ላክ።",
      "app.copy": "ኮፒ",
      "form.badge": "01 — ኢንቴክ",
      "form.title": "የተማሪ ኢንቴክ",
      "form.sub": "ኦፕሽናል ካልተባለ በስተቀር ሁሉም ክፍት ቦታ መሞላት አለበት። እዚህ ምንም ክፍያ የለም።",
      "form.name": "ሙሉ ስም",
      "form.name.hint": "— ሴርቲፊኬቱ ላይ እንዲወጣ በምትፈልገው መልኩ",
      "form.name.ph": "ለምሳሌ Bruk Getachew",
      "form.email": "የUdacity አካውንት ኢሜይል",
      "form.password": "የUdacity ፓስወርድ",
      "form.password.hint": "— እንደገባ ወዲያውኑ ይታሸጋል",
      "form.phone": "ስልክ ቁጥር",
      "form.tracks": "የሴርቲፊኬሽን ትራኮች",
      "track.programming": "Programming Fundamentals",
      "track.android": "Android Developer",
      "track.ai": "AI Fundamentals",
      "track.data": "Data Fundamentals",
      "form.nopay.title": "አሁን ምንም ክፍያ የለም።",
      "form.nopay.body": "በሪቪው አፕሮቭ ሲደረግ የስታተስ ገጽህ የ50 ETB ክሌይም ይከፍታል — በTelebirr ወይም በ<a href=\"https://t.me/nameofbless\" target=\"_blank\" rel=\"noopener\" class=\"inline-link\">@nameofbless</a> በማኑዋል ቨሪፊኬሽን።",
      "form.submit": "ለሪቪው ስብሚት አድርግ",
      "form.submitting": "በጥንቃቄ እየተላከ ነው…",
      "form.submitted": "✓ ስብሚት ተደርጓል",
      "form.fineprint": "ወዲያውኑ የBK-XXXXXX ID ይደርስሃል። ያ ID ቁልፍህ ነው — ምንም የአካውንት ሳይን-ኢን አያስፈልግም።",
      "stage.title": "ስታተስ: ሪቪው በመጠበቅ ላይ",
      "stage.body": "መረጃዎችህ ተቀምጠው ታሽገዋል። ሪቪውወሩ ኢንቴክህን አሁን እየፈተሸ ነው — አሁን የሚከፈል ነገር የለም።",
      "meta.id": "የሱብሚሽን ID",
      "meta.submitted": "ስብሚት የተደረገበት",
      "meta.candidate": "ተማሪ",
      "meta.payment": "ክፍያ",
      "meta.payment.value": "50 ETB · ከአፕሮቫል በኋላ",
      "meta.tracks": "ትራኮች",
      "meta.reference": "የክፍያ ሪፈረንስ",
      "meta.notes": "የሪቪውወር ማስታወሻዎች",
      "step.submitted": "ስብሚት ተደርጓል",
      "step.review": "ሪቪው",
      "step.approved": "አፕሮቭድ",
      "step.claim": "ክሌይም",
      "btn.copyId": "ID ኮፒ አድርግ",
      "btn.openStatus": "ስታተስ ክፈት",
      "status.eyebrow": "ሱብሚሽንህን ተከታተል",
      "status.title": "ሴርቲፊኬቴ የት ደረሰ?",
      "status.sub": "ስቴጁን ለመከታተል — እና አፕሮቭ ሲሆን ፓስወርዱንና ፋይሎቹን ለመረከብ በኢንቴክ ያገኘኸውን ID አስገባ።",
      "status.placeholder": "BK-XXXXXX",
      "status.check": "ስታተስ ቼክ አድርግ",
      "status.tip1": "የአንተ ID በBK- የሚጀምር የስድስት ሆሄያት ኮድ ነው።",
      "status.tip2": "ስታተሱ ወደ Approved ሲቀየር የክፍያ ፓነሉ ራሱ ይመጣል።",
      "status.tip3": "ሪሊዝ የተደረገው ፓስወርድ እና ፋይሎች እዚሁ ገጽ ላይ ይታያሉ።",
      "status.help.title": "እገዛ ትፈልጋለህ?",
      "status.help.body": "ID ከጠፋብህ ወይም ክፍያ ከተስተጓጎለ፣ በTelegram ለ<a href=\"https://t.me/nameofbless\" target=\"_blank\" rel=\"noopener\" class=\"inline-link\">@nameofbless</a> መልእክት ላክ።",
      "status.querying": "የስታተስ ዳታቤዙን ቼክ እያደረገ ነው…",
      "status.notfound": "ሱብሚሽኑ አልተገኘም",
      "status.notfoundbody": "ከ<span class=\"mono\">{id}</span> ጋር የሚዛመድ ሱብሚሽን አልተገኘም። አጻጻፉን ቼክ አድርግ፣ ወይም አዲስ ኢንቴክ ጀምር።",
      "status.error": "ኤረር",
      "badge.pending": "ሪቪው በመጠበቅ ላይ",
      "badge.running": "በሂደት ላይ",
      "badge.approved": "አፕሮቭድ — ክፍያ ይጠበቃል",
      "badge.payreview": "ክፍያው በሪቪው ላይ",
      "badge.released": "ሪሊዝ ተደርጓል",
      "badge.failed": "አልተሳካም",
      "claim.eyebrow": "ክፍያ ይጠበቃል · ከአፕሮቫል በኋላ",
      "claim.copy": "ትራኮችህ አፕሮቭ ተደርገዋል። ከታች ባለው ቁጥር በTelebirr <strong>{fee} ብር</strong> ክፈልና የትራንዛክሽን ሪፈረንሱን ስብሚት አድርግ። ቨሪፋይ እንደተደረገ አዲሱ ፓስወርድ እና ሴርቲፊኬቶቹ ሪሊዝ ይደረጋሉ።",
      "claim.reference": "የTelebirr ሪፈረንስ ወይም የደረሰኝ ሊንክ",
      "claim.submit": "ሪፈረንስ ስብሚት አድርግ",
      "claim.sending": "እየላከ ነው…",
      "claim.manual": "ሪፈረንስ የለህም ወይስ በሌላ መንገድ ነው የከፈልከው? ለማኑዋል ቨሪፊኬሽን በTelegram ለ<a class=\"inline-link\" href=\"https://t.me/nameofbless\" target=\"_blank\" rel=\"noopener\">@nameofbless</a> መልእክት ላክ።",
      "claim.ok": "ሪፈረንሱ ደርሷል — ማረጋገጫ በመጠበቅ ላይ።",
      "claim.short": "በቅድሚያ የTelebirr ሪፈረንሱን ወይም የደረሰኝ ሊንኩን አስገባ።",
      "claim.verifiedNote": "ሪፈረንስ <strong>{ref}</strong> እየተጣራ ነው። ልክ እንዳለቀ ፓኬጁ ሪሊዝ ይደረጋል — ከዘገየ ለ<a class=\"inline-link\" href=\"https://t.me/nameofbless\" target=\"_blank\" rel=\"noopener\">@nameofbless</a> ፒንግ አድርግ።",
      "release.title": "ፓኬጁ ሪሊዝ ተደርጓል",
      "release.unlocked": "ተከፍቷል",
      "release.newPassword": "አዲሱ የUdacity ፓስወርድ",
      "release.password": "የUdacity ፓስወርድ",
      "release.account": "አካውንት",
      "release.copy": "ኮፒ",
      "release.rotated": "ስራው አፕሮቭ ሲደረግ የአካውንቱ ፓስወርድ ተቀይሯል — ከላይ ባለው ፓስወርድ ሳይን-ኢን አድርግ።",
      "release.same": "ለዚህኛው ስራ የፓስወርድ ቅያሬው ታልፏል — ከላይ ያለውን የአካውንት ፓስወርድ ተጠቀምና ከገባህ በኋላ ቀይረው።",
      "release.certs": "የሴርቲፊኬት ፓኬጅ",
      "release.download.pdf": "PDF ዳውንሎድ አድርግ",
      "release.download.zip": "ZIP ዳውንሎድ አድርግ",
      "release.verify": "ቨሪፋይ",
      "release.empty": "እስካሁን የተያያዘ ፋይል የለም። ለ<a class=\"inline-link\" href=\"https://t.me/nameofbless\" target=\"_blank\" rel=\"noopener\">@nameofbless</a> መልእክት ላክ፣ ለዚህ ሱብሚሽን ፋይሎቹ ይዘጋጁልሃል።",
      "note.pending": "ኢንቴክህ ደርሶ ለሪቪው ተሰልፏል። ክፍያው ገና አልተከፈተም — ትራኮቹ አፕሮቭ እንደሆኑ የ50 ETB ክሌይሙን እዚሁ ታገኘዋለህ።",
      "note.running": "ትራኮችህ አሁን እየተሰሩልህ ነው። ስራው አፕሮቭ እስኪሆን ድረስ ምንም የሚከፈል ነገር የለም።",
      "note.failed": "ይሄ ስራ ትኩረት ይፈልጋል። የሱብሚሽን IDህን ይዘህ ለ<a class=\"inline-link\" href=\"https://t.me/nameofbless\" target=\"_blank\" rel=\"noopener\">@nameofbless</a> መልእክት ላክ፣ ሪቪውወሩ ያየዋል።",
      "toast.copied": "{value} ኮፒ ተደርጓል",
      "toast.copyFail": "ኮፒ ማድረግ አልተሳካም — ጽሁፉን በማኑዋል መርጠህ ኮፒ አድርግ።",
      "toast.noId": "እስካሁን ምንም የሱብሚሽን ID የለም።",
      "toast.noActive": "ምንም አክቲቭ ሱብሚሽን አልተገኘም።",
      "toast.needFields": "መጀመሪያ ስም፣ ኢሜይል፣ ፓስወርድ እና ስልክ ቁጥር አስገባ።",
      "toast.needTrack": "ቢያንስ አንድ የሴርቲፊኬሽን ትራክ ምረጥ።",
      "toast.submitted": "ሱብሚሽን ደርሷል — አሁን የሚከፈል ነገር የለም።",
      "toast.approved": "ትራኮች አፕሮቭ ተደርገዋል — የ50 ETB ክሌይም ተከፍቷል።",
      "toast.released": "ክፍያ ተረጋግጧል — ፓኬጁ ሪሊዝ ተደርጓል።",
      "toast.failed": "በአውቶሜሽኑ ላይ ችግር ተፈጥሯል። ሪቪውወሩን አናግር።",
      "toast.needRef": "በቅድሚያ የTelebirr ሪፈረንሱን ወይም የደረሰኝ ሊንኩን አስገባ።",
      "toast.noPassword": "ፓስወርዱ እስካሁን አልደረሰም።",
      "toast.enterId": "በቅድሚያ የሱብሚሽን ID አስገባ።",
      "a11y.skip": "ወደ ዋናው ይለፉ",
      "meta.title.landing": "BKHAWK — ሰርቲፊኬት ስቱዲዮ",
      "meta.title.app": "BKHAWK — ኢንቴክ እና ስታተስ"
    }
  };

  function safeGetLang() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    } catch (e) {}
    return DEFAULT_LANG;
  }

  var current = safeGetLang();

  function dict(lang) {
    return DICT[lang] || DICT[DEFAULT_LANG];
  }

  /** Look up one key, falling back to English, then to the key itself. */
  function t(key, vars) {
    var pack = dict(current);
    var value = pack[key];
    if (value == null) value = DICT.en[key];
    if (value == null) return key;
    if (vars) {
      Object.keys(vars).forEach(function (name) {
        value = value.split("{" + name + "}").join(String(vars[name]));
      });
    }
    return value;
  }

  function apply(lang) {
    var pack = dict(lang);

    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var value = pack[el.dataset.i18n];
      if (value == null) value = DICT.en[el.dataset.i18n];
      if (value != null) el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var value = pack[el.dataset.i18nHtml];
      if (value == null) value = DICT.en[el.dataset.i18nHtml];
      if (value != null) el.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var value = pack[el.dataset.i18nPh];
      if (value == null) value = DICT.en[el.dataset.i18nPh];
      if (value != null) el.setAttribute("placeholder", value);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var value = pack[el.dataset.i18nAria];
      if (value == null) value = DICT.en[el.dataset.i18nAria];
      if (value != null) el.setAttribute("aria-label", value);
    });

    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      var value = pack[el.dataset.i18nTitle];
      if (value == null) value = DICT.en[el.dataset.i18nTitle];
      if (value != null) document.title = value;
    });

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      var active = btn.dataset.lang === lang;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    current = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
    apply(lang);
    window.dispatchEvent(new CustomEvent("bkhawk:langchange", { detail: { lang: lang } }));
  }

  function getLang() {
    return current;
  }

  window.BK = {
    t: t,
    getLang: getLang,
    setLang: setLang,
    apply: apply,
    languages: SUPPORTED.slice(),
    defaultLanguage: DEFAULT_LANG
  };

  // Apply as soon as the parse reaches this script (placed at the end of body).
  apply(current);

  document.addEventListener("DOMContentLoaded", function () {
    apply(current);
    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.dataset.lang);
      });
    });
  });
})();