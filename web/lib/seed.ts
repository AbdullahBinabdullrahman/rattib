import type { Experience, Expert, HostCredential, Slot } from "./types";

/** The demo expert whose portal you see when switching persona. */
export const DEMO_EXPERT_ID = "e1";

export const EXPERTS: Expert[] = [
  {
    id: "e1",
    name: { ar: "نورة الحربي", en: "Noura Al-Harbi" },
    initials: "NH",
    bio: {
      ar: "خزّافة من الدرعية. أعمل بالطين منذ اثني عشر عامًا، وأدرّب على الدولاب والتشكيل اليدوي في مرسمي قرب البجيري.",
      en: "A potter from Diriyah. I have worked with clay for twelve years and teach wheel-throwing and hand-building in my studio near Al Bujairi.",
    },
    gender: "female",
    district: { ar: "الدرعية", en: "Diriyah" },
    languages: ["ar", "en"],
    rating: 4.9,
    reviewCount: 187,
    sessionsHosted: 240,
    hostingSince: 2023,
    identityVerified: true,
    responseMinutes: 40,
  },
  {
    id: "e2",
    name: { ar: "سارة القحطاني", en: "Sarah Al-Qahtani" },
    initials: "SQ",
    bio: {
      ar: "من أسرة منتجة إلى مطبخ مرخّص. أعلّم المعمول والخبز السعودي بالطرق التي ورثتها عن جدتي.",
      en: "From a productive-family kitchen to a licensed one. I teach maamoul and Saudi breads the way my grandmother made them.",
    },
    gender: "female",
    district: { ar: "الصحافة", en: "Al Sahafa" },
    languages: ["ar", "en"],
    rating: 4.8,
    reviewCount: 312,
    sessionsHosted: 410,
    hostingSince: 2022,
    identityVerified: true,
    responseMinutes: 25,
  },
  {
    id: "e3",
    name: { ar: "هيا الدوسري", en: "Haya Al-Dosari" },
    initials: "HD",
    bio: {
      ar: "نسّاجة سدو معتمدة من هيئة التراث. أنقل الحرفة كما تعلّمتها في البادية، بخيوط وألوان أصلية.",
      en: "A Sadu weaver licensed by the Heritage Commission. I pass on the craft as I learned it in the badia, with original yarns and dyes.",
    },
    gender: "female",
    district: { ar: "حطين", en: "Hittin" },
    languages: ["ar"],
    rating: 5.0,
    reviewCount: 96,
    sessionsHosted: 118,
    hostingSince: 2024,
    identityVerified: true,
    responseMinutes: 90,
  },
  {
    id: "e4",
    name: { ar: "فيصل العنزي", en: "Faisal Al-Anazi" },
    initials: "FA",
    bio: {
      ar: "محمّص قهوة مختصّ. أشتغل على البن الخولاني السعودي وأشرح رحلته من المزرعة إلى الدلّة.",
      en: "A specialty coffee roaster. I work with Saudi Khawlani beans and walk you through the journey from farm to dallah.",
    },
    gender: "male",
    district: { ar: "العليا", en: "Olaya" },
    languages: ["ar", "en"],
    rating: 4.7,
    reviewCount: 421,
    sessionsHosted: 530,
    hostingSince: 2022,
    identityVerified: true,
    responseMinutes: 15,
  },
  {
    id: "e5",
    name: { ar: "عبدالرحمن الشمري", en: "Abdulrahman Al-Shammari" },
    initials: "AS",
    bio: {
      ar: "خطّاط. أدرّس أساسيات خط الثلث والديواني بالقصبة والحبر التقليدي.",
      en: "A calligrapher. I teach the foundations of Thuluth and Diwani with a reed pen and traditional ink.",
    },
    gender: "male",
    district: { ar: "المربع", en: "Al Murabba" },
    languages: ["ar", "en"],
    rating: 4.9,
    reviewCount: 143,
    sessionsHosted: 175,
    hostingSince: 2023,
    identityVerified: true,
    responseMinutes: 55,
  },
  {
    id: "e6",
    name: { ar: "لطيفة السبيعي", en: "Latifah Al-Subaie" },
    initials: "LS",
    bio: {
      ar: "مختصّة في تركيب العطور والعود. نصنع في الجلسة مزيجك الخاص وتأخذينه معك.",
      en: "A perfume and oud blender. In each session you compose your own blend and take it home.",
    },
    gender: "female",
    district: { ar: "النخيل", en: "Al Nakheel" },
    languages: ["ar", "en"],
    rating: 4.9,
    reviewCount: 208,
    sessionsHosted: 260,
    hostingSince: 2023,
    identityVerified: true,
    responseMinutes: 35,
  },
  {
    id: "e7",
    name: { ar: "سعد المطيري", en: "Saad Al-Mutairi" },
    initials: "SM",
    bio: {
      ar: "شاعر نبطي. مجلس أسبوعي للشعر والمحاورة في قصر الحكم، مفتوح للمبتدئين.",
      en: "A Nabati poet. A weekly majlis for poetry and mahawara in Qasr Al Hokm, open to beginners.",
    },
    gender: "male",
    district: { ar: "قصر الحكم", en: "Qasr Al Hokm" },
    languages: ["ar"],
    rating: 4.8,
    reviewCount: 77,
    sessionsHosted: 95,
    hostingSince: 2024,
    identityVerified: true,
    responseMinutes: 120,
  },
  {
    id: "e8",
    name: { ar: "منيرة الغامدي", en: "Munirah Al-Ghamdi" },
    initials: "MG",
    bio: {
      ar: "حرفية خوص. نصنع السلال والمهفّات من سعف النخيل، وهي حرفة من أكثر الحرف انتشارًا في المملكة.",
      en: "A palm-frond artisan. We make baskets and hand fans from date-palm fronds, one of the Kingdom's most widespread crafts.",
    },
    gender: "female",
    district: { ar: "الياسمين", en: "Al Yasmin" },
    languages: ["ar"],
    rating: 4.7,
    reviewCount: 64,
    sessionsHosted: 88,
    hostingSince: 2025,
    identityVerified: true,
    responseMinutes: 70,
  },
];

/**
 * Credentials for the demo expert (e1).
 *
 * Deliberately incomplete: she holds layer 1 and the crafts licence, so
 * her pottery listings publish — but she has no tourism licence, which
 * blocks her Diriyah walking tour. The expired municipal licence shows
 * the auto-pause state.
 */
export const CREDENTIALS: HostCredential[] = [
  {
    id: "c1",
    expertId: "e1",
    type: "freelance_doc",
    layer: "identity",
    number: "FL-4471902",
    issuingBody: {
      ar: "وزارة الموارد البشرية والتنمية الاجتماعية",
      en: "Ministry of Human Resources and Social Development",
    },
    issuedAt: "2025-02-11",
    expiresAt: "2027-02-10",
    state: "verified",
  },
  {
    id: "c2",
    expertId: "e1",
    type: "abdea_craft",
    layer: "activity",
    number: "ABD-CR-20881",
    issuingBody: {
      ar: "هيئة التراث — منصة أبدع",
      en: "Heritage Commission — Abde'a platform",
    },
    issuedAt: "2025-04-02",
    expiresAt: "2027-04-01",
    state: "verified",
  },
  {
    id: "c3",
    expertId: "e1",
    type: "municipal_craft",
    layer: "activity",
    number: "BLD-77310",
    issuingBody: {
      ar: "وزارة الشؤون البلدية والقروية والإسكان",
      en: "Ministry of Municipalities and Housing",
    },
    issuedAt: "2024-06-01",
    expiresAt: "2026-06-01",
    state: "expired",
  },
];

export const EXPERIENCES: Experience[] = [
  {
    id: "x1",
    expertId: "e1",
    title: { ar: "الفخار على الدولاب", en: "Pottery on the wheel" },
    tagline: {
      ar: "شكّلي أول قطعة لك من الطين",
      en: "Throw your first piece in clay",
    },
    description: {
      ar: "جلسة عملية على دولاب الخزف في مرسمي بالدرعية. نبدأ بتوسيط الطين وننتهي بقطعتين جاهزتين للحرق، وأتولى أنا الحرق والتزجيج ثم نسلّمك القطع بعد أسبوعين. لا تحتاجين أي خبرة سابقة.",
      en: "A hands-on session at the wheel in my Diriyah studio. We start with centring the clay and finish with two pieces ready for firing; I glaze and fire them and hand them back two weeks later. No previous experience needed.",
    },
    category: "pottery",
    district: { ar: "الدرعية", en: "Diriyah" },
    lat: 24.7336,
    lon: 46.575,
    durationMin: 150,
    seatsMin: 2,
    seatsMax: 6,
    pricePerSeat: 320,
    audiencePolicy: "women_only",
    minAge: 14,
    toolsProvided: [
      { ar: "الطين والأدوات", en: "Clay and tools" },
      { ar: "مريول وقفازات", en: "Apron and gloves" },
      { ar: "الحرق والتزجيج", en: "Firing and glazing" },
      { ar: "قهوة وتمر", en: "Qahwa and dates" },
    ],
    toolsRequired: [
      { ar: "ملابس لا تهمّك", en: "Clothes you don't mind staining" },
    ],
    responseSlaHours: 6,
    freeCancelHours: 24,
    bookingMode: "request",
    status: "published",
  },
  {
    id: "x2",
    expertId: "e1",
    title: { ar: "أمسية الفخار", en: "Evening pottery" },
    tagline: {
      ar: "تشكيل يدوي بعد المغرب",
      en: "Hand-building after sunset",
    },
    description: {
      ar: "جلسة مسائية هادئة للتشكيل اليدوي دون دولاب — نصنع أكوابًا وأطباقًا صغيرة بأسلوب القرص والشرائح. مناسبة للمجموعات والأصدقاء.",
      en: "A quiet evening of hand-building without the wheel — pinch and slab cups and small dishes. Good for friends and small groups.",
    },
    category: "pottery",
    district: { ar: "الدرعية", en: "Diriyah" },
    lat: 24.7365,
    lon: 46.5792,
    durationMin: 120,
    seatsMin: 2,
    seatsMax: 8,
    pricePerSeat: 280,
    audiencePolicy: "mixed",
    minAge: 12,
    toolsProvided: [
      { ar: "الطين والأدوات", en: "Clay and tools" },
      { ar: "الحرق", en: "Firing" },
      { ar: "شاي وقهوة", en: "Tea and qahwa" },
    ],
    toolsRequired: [],
    responseSlaHours: 6,
    freeCancelHours: 24,
    bookingMode: "instant",
    status: "published",
  },
  {
    /**
     * Deliberately blocked. Guided heritage walking tours sit at the heavy
     * end of the Ministry of Tourism regime, and this expert holds only a
     * crafts licence — so the listing cannot go live. Demonstrates the
     * publish-time credential gate.
     */
    id: "x3",
    expertId: "e1",
    title: {
      ar: "جولة في الطريف التاريخي",
      en: "At-Turaif heritage walk",
    },
    tagline: {
      ar: "مسار مشي مع شرح تاريخي",
      en: "A guided walk through the old town",
    },
    description: {
      ar: "جولة مشي في حي الطريف مع شرح لتاريخ الدرعية والعمارة النجدية.",
      en: "A walking tour of the At-Turaif district with commentary on Diriyah's history and Najdi architecture.",
    },
    category: "tours",
    district: { ar: "الدرعية", en: "Diriyah" },
    lat: 24.7339,
    lon: 46.5721,
    durationMin: 90,
    seatsMin: 4,
    seatsMax: 15,
    pricePerSeat: 180,
    audiencePolicy: "mixed",
    minAge: 8,
    toolsProvided: [{ ar: "مرشد", en: "Guide" }],
    toolsRequired: [{ ar: "حذاء مريح", en: "Comfortable shoes" }],
    responseSlaHours: 12,
    freeCancelHours: 48,
    bookingMode: "request",
    status: "blocked",
    blockedOn: "mt_tourism",
  },
  {
    id: "x4",
    expertId: "e2",
    title: { ar: "المعمول وحلويات العيد", en: "Maamoul and Eid sweets" },
    tagline: {
      ar: "من العجين إلى القالب",
      en: "From the dough to the mould",
    },
    description: {
      ar: "نصنع المعمول بالتمر والفستق من البداية، ونتعلّم أسرار العجينة الهشّة واستخدام القوالب الخشبية. تأخذين معك علبة كاملة.",
      en: "We make date and pistachio maamoul from scratch, learn the secrets of a tender dough, and work with wooden moulds. You take a full box home.",
    },
    category: "bakery",
    district: { ar: "الصحافة", en: "Al Sahafa" },
    lat: 24.795,
    lon: 46.642,
    durationMin: 180,
    seatsMin: 3,
    seatsMax: 8,
    pricePerSeat: 250,
    audiencePolicy: "women_only",
    minAge: 16,
    toolsProvided: [
      { ar: "كل المكوّنات", en: "All ingredients" },
      { ar: "قوالب خشبية", en: "Wooden moulds" },
      { ar: "علبة لأخذ الإنتاج", en: "A box to take your batch home" },
    ],
    toolsRequired: [],
    responseSlaHours: 4,
    freeCancelHours: 24,
    bookingMode: "request",
    status: "published",
  },
  {
    id: "x5",
    expertId: "e2",
    title: { ar: "خبز التنور والعيش السعودي", en: "Tannour bread and Saudi loaves" },
    tagline: {
      ar: "خبز على الحجر الساخن",
      en: "Baking on hot stone",
    },
    description: {
      ar: "جلسة عائلية نعجن فيها ونخبز على التنّور مباشرة. الأطفال من سن ٨ سنوات مرحّب بهم مع ذويهم.",
      en: "A family session: we knead and bake straight onto the tannour. Children from age 8 are welcome with a parent.",
    },
    category: "bakery",
    district: { ar: "الصحافة", en: "Al Sahafa" },
    lat: 24.7982,
    lon: 46.6461,
    durationMin: 150,
    seatsMin: 4,
    seatsMax: 10,
    pricePerSeat: 290,
    audiencePolicy: "families_only",
    minAge: 8,
    toolsProvided: [
      { ar: "كل المكوّنات", en: "All ingredients" },
      { ar: "مريول", en: "Apron" },
      { ar: "وجبة إفطار", en: "A breakfast spread" },
    ],
    toolsRequired: [],
    responseSlaHours: 4,
    freeCancelHours: 24,
    bookingMode: "instant",
    status: "published",
  },
  {
    id: "x6",
    expertId: "e3",
    title: { ar: "أساسيات نسج السدو", en: "Sadu weaving foundations" },
    tagline: {
      ar: "حرفة البادية على النول",
      en: "The badia's craft, on the loom",
    },
    description: {
      ar: "نتعلّم النول الأرضي والرموز التقليدية للسدو ودلالاتها. تخرجين بقطعة نسيج صغيرة من صنعك وبفهم لأصل كل رمز.",
      en: "We work the ground loom and learn the traditional Sadu motifs and what they mean. You leave with a small woven piece and an understanding of where each symbol comes from.",
    },
    category: "sadu",
    district: { ar: "حطين", en: "Hittin" },
    lat: 24.748,
    lon: 46.603,
    durationMin: 180,
    seatsMin: 2,
    seatsMax: 5,
    pricePerSeat: 380,
    audiencePolicy: "women_only",
    minAge: 16,
    toolsProvided: [
      { ar: "النول والخيوط", en: "Loom and yarn" },
      { ar: "القطعة النهائية", en: "Your finished piece" },
      { ar: "ضيافة", en: "Refreshments" },
    ],
    toolsRequired: [],
    responseSlaHours: 12,
    freeCancelHours: 48,
    bookingMode: "request",
    status: "published",
  },
  {
    id: "x7",
    expertId: "e4",
    title: { ar: "تحميص القهوة السعودية", en: "Roasting Saudi coffee" },
    tagline: {
      ar: "من البن الخولاني إلى الدلّة",
      en: "From Khawlani bean to dallah",
    },
    description: {
      ar: "نحمّص البن الخولاني على المحماس، ونطحن ونضيف الهيل والزعفران، ثم نصبّ في الدلّة. تأخذ معك ١٥٠ جرام من تحميصك.",
      en: "We roast Khawlani beans on the mihmas, grind, add cardamom and saffron, then pour from the dallah. You take home 150g of your own roast.",
    },
    category: "coffee",
    district: { ar: "العليا", en: "Olaya" },
    lat: 24.693,
    lon: 46.685,
    durationMin: 120,
    seatsMin: 2,
    seatsMax: 10,
    pricePerSeat: 220,
    audiencePolicy: "mixed",
    minAge: 12,
    toolsProvided: [
      { ar: "البن والمحماس", en: "Beans and roasting pan" },
      { ar: "١٥٠ جرام من تحميصك", en: "150g of your roast" },
      { ar: "تمر مع القهوة", en: "Dates with the coffee" },
    ],
    toolsRequired: [],
    responseSlaHours: 3,
    freeCancelHours: 12,
    bookingMode: "instant",
    status: "published",
  },
  {
    id: "x8",
    expertId: "e4",
    title: { ar: "تذوّق البن الخولاني", en: "Khawlani coffee cupping" },
    tagline: {
      ar: "جلسة تذوّق قصيرة",
      en: "A short cupping session",
    },
    description: {
      ar: "جلسة تذوّق مقارنة بين ثلاث مزارع خولانية من جازان، مع شرح لتاريخ البن الخولاني المدرج في قائمة اليونسكو.",
      en: "A comparative cupping across three Khawlani farms in Jazan, with the story of a coffee that sits on the UNESCO heritage list.",
    },
    category: "coffee",
    district: { ar: "العليا", en: "Olaya" },
    lat: 24.6961,
    lon: 46.6882,
    durationMin: 90,
    seatsMin: 4,
    seatsMax: 12,
    pricePerSeat: 180,
    audiencePolicy: "mixed",
    minAge: 14,
    toolsProvided: [{ ar: "ثلاث عيّنات", en: "Three samples" }],
    toolsRequired: [],
    responseSlaHours: 3,
    freeCancelHours: 12,
    bookingMode: "instant",
    status: "published",
  },
  {
    id: "x9",
    expertId: "e5",
    title: { ar: "الخط العربي — الثلث", en: "Arabic calligraphy — Thuluth" },
    tagline: {
      ar: "القصبة والحبر والقياس",
      en: "Reed, ink and proportion",
    },
    description: {
      ar: "نبدأ ببري القصبة، ثم قواعد النقطة والقياس في خط الثلث، وننهي الجلسة بكتابة اسمك بخطك.",
      en: "We start by cutting the reed pen, move through the dot-and-proportion rules of Thuluth, and finish by writing your own name.",
    },
    category: "calligraphy",
    district: { ar: "المربع", en: "Al Murabba" },
    lat: 24.648,
    lon: 46.71,
    durationMin: 120,
    seatsMin: 2,
    seatsMax: 8,
    pricePerSeat: 240,
    audiencePolicy: "mixed",
    minAge: 14,
    toolsProvided: [
      { ar: "قصبة وحبر وورق", en: "Reed pen, ink and paper" },
      { ar: "لوحتك النهائية", en: "Your finished piece" },
    ],
    toolsRequired: [],
    responseSlaHours: 8,
    freeCancelHours: 24,
    bookingMode: "request",
    status: "published",
  },
  {
    id: "x10",
    expertId: "e6",
    title: { ar: "تركيب العطر والعود", en: "Oud and perfume blending" },
    tagline: {
      ar: "اصنعي مزيجك الخاص",
      en: "Compose a blend that is yours",
    },
    description: {
      ar: "نتعرّف على أنواع العود ودهن العود والزيوت العطرية، ثم تركّبين عطرك الخاص في قارورة ٣٠ مل تأخذينها معك باسمك.",
      en: "We work through oud grades, dahn al-oud and essential oils, then you compose your own 30ml bottle and take it home under your own name.",
    },
    category: "perfume",
    district: { ar: "النخيل", en: "Al Nakheel" },
    lat: 24.73,
    lon: 46.652,
    durationMin: 150,
    seatsMin: 2,
    seatsMax: 6,
    pricePerSeat: 450,
    audiencePolicy: "women_only",
    minAge: 18,
    toolsProvided: [
      { ar: "الزيوت ودهن العود", en: "Oils and dahn al-oud" },
      { ar: "قارورة ٣٠ مل", en: "A 30ml bottle" },
      { ar: "بطاقة بالتركيبة", en: "A card with your formula" },
    ],
    toolsRequired: [],
    responseSlaHours: 6,
    freeCancelHours: 48,
    bookingMode: "request",
    status: "published",
  },
  {
    id: "x11",
    expertId: "e7",
    title: { ar: "مجلس الشعر النبطي", en: "Nabati poetry majlis" },
    tagline: {
      ar: "محاورة وإلقاء كل خميس",
      en: "Mahawara and recital, every Thursday",
    },
    description: {
      ar: "مجلس أسبوعي للشعر النبطي: نقرأ من عيون الشعر، ونتدرّب على الوزن والقافية، ثم محاورة مفتوحة. مناسب للمبتدئين.",
      en: "A weekly Nabati poetry majlis: we read from the classics, work on metre and rhyme, then open the floor for mahawara. Beginners welcome.",
    },
    category: "poetry",
    district: { ar: "قصر الحكم", en: "Qasr Al Hokm" },
    lat: 24.63,
    lon: 46.713,
    durationMin: 120,
    seatsMin: 4,
    seatsMax: 14,
    pricePerSeat: 150,
    audiencePolicy: "men_only",
    minAge: 16,
    toolsProvided: [
      { ar: "قهوة وتمر", en: "Qahwa and dates" },
      { ar: "كرّاسة الجلسة", en: "Session booklet" },
    ],
    toolsRequired: [],
    responseSlaHours: 12,
    freeCancelHours: 12,
    bookingMode: "instant",
    status: "published",
  },
  {
    id: "x12",
    expertId: "e8",
    title: { ar: "حرفة الخوص", en: "Palm frond weaving" },
    tagline: {
      ar: "سلال ومهفّات من سعف النخيل",
      en: "Baskets and fans from date-palm fronds",
    },
    description: {
      ar: "جلسة عائلية نتعلّم فيها تجهيز السعف وضفره، ونصنع مهفّة أو سلة صغيرة. حرفة الخوص من أوسع الحرف انتشارًا في المملكة.",
      en: "A family session on preparing and plaiting fronds to make a hand fan or a small basket — one of the most widespread crafts in the Kingdom.",
    },
    category: "khoos",
    district: { ar: "الياسمين", en: "Al Yasmin" },
    lat: 24.82,
    lon: 46.63,
    durationMin: 120,
    seatsMin: 3,
    seatsMax: 10,
    pricePerSeat: 200,
    audiencePolicy: "families_only",
    minAge: 7,
    toolsProvided: [
      { ar: "السعف والأدوات", en: "Fronds and tools" },
      { ar: "قطعتك النهائية", en: "Your finished piece" },
    ],
    toolsRequired: [],
    responseSlaHours: 8,
    freeCancelHours: 24,
    bookingMode: "request",
    status: "published",
  },
  {
    id: "x13",
    expertId: "e5",
    title: { ar: "الخط الديواني للمبتدئين", en: "Diwani script for beginners" },
    tagline: { ar: "انحناءات ومرونة", en: "Curves and flourish" },
    description: {
      ar: "مدخل إلى الخط الديواني، وهو أكثر الخطوط مرونة وانسيابية. جلسة قصيرة مناسبة لمن جرّب الثلث من قبل أو لم يجرّب.",
      en: "An introduction to Diwani, the most fluid of the scripts. A short session, whether or not you have tried Thuluth before.",
    },
    category: "calligraphy",
    district: { ar: "المربع", en: "Al Murabba" },
    lat: 24.6512,
    lon: 46.7062,
    durationMin: 90,
    seatsMin: 2,
    seatsMax: 8,
    pricePerSeat: 190,
    audiencePolicy: "mixed",
    minAge: 12,
    toolsProvided: [{ ar: "قصبة وحبر وورق", en: "Reed pen, ink and paper" }],
    toolsRequired: [],
    responseSlaHours: 8,
    freeCancelHours: 24,
    bookingMode: "instant",
    status: "published",
  },
];

/* ------------------------------------------------------------------ */
/* Slot generation — Gregorian, Asia/Riyadh, no Hijri anywhere         */
/* ------------------------------------------------------------------ */

const RIYADH_OFFSET_MS = 3 * 60 * 60 * 1000;

/** Midnight in Riyadh, `offsetDays` from today, as a UTC instant. */
function riyadhMidnight(offsetDays: number, now: Date): Date {
  const wall = new Date(now.getTime() + RIYADH_OFFSET_MS);
  const ms = Date.UTC(
    wall.getUTCFullYear(),
    wall.getUTCMonth(),
    wall.getUTCDate() + offsetDays,
  );
  return new Date(ms - RIYADH_OFFSET_MS);
}

function riyadhInstant(offsetDays: number, hour: number, now: Date): Date {
  return new Date(riyadhMidnight(offsetDays, now).getTime() + hour * 3600_000);
}

/** Hours each category tends to run at, so the demo reads plausibly. */
const HOURS: Record<string, number[]> = {
  pottery: [10, 17, 20],
  bakery: [9, 16, 19],
  sadu: [10, 16],
  coffee: [11, 17, 20, 21],
  calligraphy: [17, 19],
  perfume: [11, 18],
  poetry: [20, 21],
  khoos: [10, 17],
  tours: [8, 16],
};

/**
 * Builds slots across the next week. Today's slots are only kept if they
 * are still at least 90 minutes away, so the demo never shows a bookable
 * session in the past.
 */
export function buildSlots(now: Date = new Date()): Slot[] {
  const slots: Slot[] = [];
  const minLead = now.getTime() + 90 * 60_000;

  for (const exp of EXPERIENCES) {
    if (exp.status !== "published") continue;
    const hours = HOURS[exp.category] ?? [10, 18];
    let n = 0;

    for (let day = 0; day <= 6; day++) {
      for (const hour of hours) {
        const at = riyadhInstant(day, hour, now);
        if (at.getTime() < minLead) continue;
        // Thin out later days so the near term looks busiest.
        if (day > 1 && (day + hour) % 2 !== 0) continue;
        if (n >= 7) break;

        // Vary occupancy so the listings feel lived-in.
        const seed = (exp.id.charCodeAt(1) + day * 7 + hour) % 5;
        const taken = day === 0 ? Math.min(seed + 1, exp.seatsMax - 1) : seed;

        slots.push({
          id: `${exp.id}-s${n}`,
          experienceId: exp.id,
          startsAt: at.toISOString(),
          seatsTotal: exp.seatsMax,
          seatsTaken: Math.max(0, Math.min(taken, exp.seatsMax)),
        });
        n++;
      }
      if (n >= 7) break;
    }
  }
  return slots.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
