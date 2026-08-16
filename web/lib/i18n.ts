import type {
  AudiencePolicy,
  Bi,
  CategoryId,
  CredentialType,
  Lang,
  PaymentMethod,
} from "./types";

export const DICT = {
  brand: { ar: "رتّب", en: "Rattib" },
  tagline: {
    ar: "تجارب سعودية أصيلة، يقدّمها خبراء من حيّك",
    en: "Authentic Saudi experiences, hosted by experts in your city",
  },

  // nav
  navExplore: { ar: "استكشف", en: "Explore" },
  navBookings: { ar: "حجوزاتي", en: "My bookings" },
  navExpert: { ar: "بوابة الخبير", en: "Expert portal" },
  navMarket: { ar: "السوق", en: "Market" },
  navEconomics: { ar: "الاقتصاديات", en: "Economics" },

  // auth
  signIn: { ar: "تسجيل الدخول", en: "Sign in" },
  signUp: { ar: "إنشاء حساب", en: "Create account" },
  signOut: { ar: "تسجيل الخروج", en: "Sign out" },
  authTitleIn: { ar: "أهلًا بعودتك", en: "Welcome back" },
  authTitleUp: { ar: "انضم إلى رتّب", en: "Join Rattib" },
  authSubIn: {
    ar: "سجّل دخولك لمتابعة حجوزاتك أو إدارة تجاربك.",
    en: "Sign in to follow your bookings or manage your experiences.",
  },
  authSubUp: {
    ar: "اختر نوع الحساب — يمكنك التحويل لاحقًا.",
    en: "Choose the kind of account you need — you can switch later.",
  },
  iAmCustomer: { ar: "أبحث عن تجارب", en: "I'm looking for experiences" },
  iAmCustomerNote: {
    ar: "تصفّح واحجز جلسات مع خبراء موثّقين.",
    en: "Browse and book sessions with verified experts.",
  },
  iAmExpert: { ar: "أقدّم تجارب", en: "I host experiences" },
  iAmExpertNote: {
    ar: "انشر جلساتك وأدر الحجوزات والتراخيص.",
    en: "Publish sessions and manage bookings and licences.",
  },
  verifyLaterNote: {
    ar: "يمكنك التحقق من هويتك لاحقًا من حسابك — وهو مطلوب فقط لحجز التجارب المقيّدة الحضور.",
    en: "You can verify your identity later from your account — it is only required to book audience-locked experiences.",
  },
  fullName: { ar: "الاسم الكامل", en: "Full name" },
  emailOrPhone: { ar: "البريد أو رقم الجوال", en: "Email or mobile" },
  password: { ar: "كلمة المرور", en: "Password" },
  genderField: { ar: "الجنس", en: "Gender" },
  genderWhy: {
    ar: "يُستخدم فقط للتحقق من أهلية التجارب المقيّدة الحضور، ولا يظهر لضيوف آخرين.",
    en: "Used only to check eligibility for audience-locked experiences, and never shown to other guests.",
  },
  haveAccount: { ar: "لديك حساب؟", en: "Already have an account?" },
  noAccount: { ar: "ليس لديك حساب؟", en: "No account yet?" },
  continueLabel: { ar: "متابعة", en: "Continue" },
  expertNextStep: {
    ar: "الخطوة التالية: أضف سجلك التجاري أو وثيقة العمل الحر لتتمكن من النشر.",
    en: "Next: add your CR or freelance certificate so you can publish.",
  },
  notVerified: { ar: "غير موثّق", en: "Not verified" },
  verifyNow: { ar: "وثّق هويتك", en: "Verify identity" },
  account: { ar: "الحساب", en: "Account" },
  demoModeNote: {
    ar: "وضع العرض — يمكنك التبديل بين الحسابين دون تسجيل دخول.",
    en: "Demo mode — switch between both sides without signing in.",
  },
  viewAs: { ar: "العرض بصفة", en: "Viewing as" },
  customer: { ar: "عميل", en: "Customer" },
  expert: { ar: "خبير", en: "Expert" },

  // landing
  heroTitle: { ar: "تعلّم حرفة.", en: "Learn a craft." },
  heroTitle2: { ar: "اكتشف مدينتك.", en: "Discover your city." },
  heroBody: {
    ar: "من الفخار في الدرعية إلى تحميص القهوة في العليا — احجز تجربة صغيرة مع خبير موثّق، اليوم أو هذا الأسبوع.",
    en: "From pottery in Diriyah to coffee roasting in Olaya — book a small-group session with a verified expert, today or this week.",
  },
  ctaExplore: { ar: "استكشف التجارب", en: "Explore experiences" },
  ctaHost: { ar: "قدّم تجربتك", en: "Host an experience" },
  featured: { ar: "تجارب مختارة", en: "Featured experiences" },
  todayIn: { ar: "متاح اليوم في الرياض", en: "Available today in Riyadh" },
  whyTitle: { ar: "لماذا رتّب", en: "Why Rattib" },
  why1t: { ar: "خبراء موثّقون", en: "Verified experts" },
  why1b: {
    ar: "هوية كل خبير موثّقة، ويحمل سجلًا تجاريًا أو وثيقة عمل حر، مع رخصة النشاط المطلوبة.",
    en: "Every expert has a verified identity and holds a CR or freelance certificate, plus the activity licence their category requires.",
  },
  why2t: { ar: "تجارب مخصّصة للنساء", en: "Women-only experiences" },
  why2b: {
    ar: "سياسة الحضور جزء أساسي من المنصة — للنساء فقط، للعائلات، أو مختلطة. يتم التحقق من الهوية عند الحجز.",
    en: "Audience policy is built in — women-only, families, or mixed. Identity is verified at booking.",
  },
  why3t: { ar: "حجز محمي", en: "Protected booking" },
  why3b: {
    ar: "تدفع عند الحجز، ولا يُصرف المبلغ للخبير إلا بعد إتمام التجربة. الرفض أو انتهاء المهلة يعني استرداد كامل.",
    en: "Pay at booking; funds reach the expert only after the session. A rejection or an expired request means a full refund.",
  },

  // explore
  exploreTitle: { ar: "تجارب في الرياض", en: "Experiences in Riyadh" },
  filters: { ar: "التصفية", en: "Filters" },
  category: { ar: "الفئة", en: "Category" },
  audience: { ar: "سياسة الحضور", en: "Audience" },
  allCategories: { ar: "كل الفئات", en: "All categories" },
  allAudiences: { ar: "الكل", en: "Anyone" },
  maxPrice: { ar: "أقصى سعر للمقعد", en: "Max price per seat" },
  todayOnly: { ar: "متاح اليوم فقط", en: "Available today only" },
  results: { ar: "نتيجة", en: "results" },
  noResults: {
    ar: "لا توجد تجارب مطابقة. جرّب توسيع التصفية.",
    en: "No matching experiences. Try widening your filters.",
  },
  resetFilters: { ar: "إعادة التعيين", en: "Reset" },
  mapHint: {
    ar: "اضغط على أي علامة لعرض التجربة",
    en: "Tap any pin to preview the experience",
  },

  // experience detail
  hostedBy: { ar: "يقدّمها", en: "Hosted by" },
  about: { ar: "عن التجربة", en: "About this experience" },
  whatsIncluded: { ar: "ما يشمله السعر", en: "What's included" },
  whatToBring: { ar: "ما يجب إحضاره", en: "What to bring" },
  bringNothing: {
    ar: "لا شيء — كل شيء مُجهّز",
    en: "Nothing — everything is provided",
  },
  duration: { ar: "المدة", en: "Duration" },
  seats: { ar: "المقاعد", en: "Seats" },
  minutes: { ar: "دقيقة", en: "min" },
  upTo: { ar: "حتى", en: "up to" },
  perSeat: { ar: "للمقعد", en: "per seat" },
  sar: { ar: "ريال", en: "SAR" },
  pickSlot: { ar: "اختر موعدًا", en: "Choose a time" },
  seatsLeft: { ar: "مقاعد متبقية", en: "seats left" },
  soldOut: { ar: "مكتمل", en: "Sold out" },
  reserve: { ar: "احجز", en: "Reserve" },
  policyTitle: { ar: "الشروط", en: "Terms" },
  slaLine: {
    ar: "يردّ الخبير خلال {h} ساعة، وإلا يُلغى الطلب ويُسترد المبلغ كاملًا.",
    en: "The expert responds within {h}h, otherwise the request is cancelled and fully refunded.",
  },
  cancelLine: {
    ar: "إلغاء مجاني حتى {h} ساعة قبل الموعد.",
    en: "Free cancellation up to {h}h before the session.",
  },
  minAgeLine: { ar: "العمر {n} سنة فأكثر", en: "Ages {n} and over" },
  instantBook: { ar: "تأكيد فوري", en: "Instant book" },
  requestBook: { ar: "بطلب موافقة", en: "Request to book" },
  notEligible: {
    ar: "هذه التجربة غير متاحة لحسابك الحالي.",
    en: "This experience is not available to your current account.",
  },
  switchPersona: {
    ar: "بدّل الحساب التجريبي من الأعلى لتجربتها.",
    en: "Switch the demo account above to try it.",
  },
  sessionsHosted: { ar: "جلسة مُقدّمة", en: "sessions hosted" },
  since: { ar: "يستضيف منذ", en: "Hosting since" },
  respondsIn: { ar: "يردّ عادة خلال", en: "Usually responds in" },
  identityVerified: { ar: "هوية موثّقة", en: "ID verified" },
  credentialsHeld: { ar: "التراخيص", en: "Licences held" },

  // booking
  bookingTitle: { ar: "تأكيد الحجز", en: "Confirm your booking" },
  guests: { ar: "الضيوف", en: "Guests" },
  addGuest: { ar: "إضافة ضيف", en: "Add guest" },
  remove: { ar: "حذف", en: "Remove" },
  guestName: { ar: "الاسم", en: "Name" },
  female: { ar: "أنثى", en: "Female" },
  male: { ar: "ذكر", en: "Male" },
  verifyIdentityAction: { ar: "تحقق من الهوية", en: "Verify identity" },
  verified: { ar: "موثّق", en: "Verified" },
  lockedNotice: {
    ar: "هذه تجربة مقيّدة الحضور — يجب التحقق من هوية كل ضيف.",
    en: "This experience has a locked audience — every guest must have a verified identity.",
  },
  payWith: { ar: "طريقة الدفع", en: "Pay with" },
  priceSummary: { ar: "ملخص السعر", en: "Price summary" },
  seatsX: { ar: "{n} × مقعد", en: "{n} × seat" },
  serviceFee: { ar: "رسوم الخدمة", en: "Service fee" },
  total: { ar: "الإجمالي", en: "Total" },
  vatNote: {
    ar: "شامل ضريبة القيمة المضافة ١٥٪",
    en: "Includes 15% VAT",
  },
  payNow: { ar: "ادفع واحجز", en: "Pay and reserve" },
  heldNote: {
    ar: "يُحجز المبلغ ولا يُصرف للخبير إلا بعد إتمام التجربة.",
    en: "Funds are held and released to the expert only after the session.",
  },
  bookingPlaced: { ar: "تم إرسال طلبك", en: "Request sent" },
  bookingConfirmed: { ar: "تم تأكيد حجزك", en: "Booking confirmed" },

  // bookings list
  myBookings: { ar: "حجوزاتي", en: "My bookings" },
  noBookings: {
    ar: "لا توجد حجوزات بعد. ابدأ من صفحة الاستكشاف.",
    en: "No bookings yet. Start from Explore.",
  },
  statusPending: { ar: "بانتظار الموافقة", en: "Awaiting approval" },
  statusAccepted: { ar: "مقبول", en: "Accepted" },
  statusRejected: { ar: "مرفوض", en: "Rejected" },
  statusExpired: { ar: "منتهي", en: "Expired" },
  statusCancelled: { ar: "ملغى", en: "Cancelled" },
  statusCompleted: { ar: "مكتمل", en: "Completed" },
  refunded: { ar: "تم استرداد المبلغ كاملًا", en: "Fully refunded" },
  checkinCode: { ar: "رمز الحضور", en: "Check-in code" },
  respondBy: { ar: "مهلة الرد", en: "Responds by" },
  cancelBooking: { ar: "إلغاء الحجز", en: "Cancel booking" },

  // expert portal
  expertDash: { ar: "لوحة الخبير", en: "Expert dashboard" },
  pendingRequests: { ar: "طلبات بانتظار الرد", en: "Pending requests" },
  myExperiences: { ar: "تجاربي", en: "My experiences" },
  myCredentials: { ar: "تراخيصي", en: "My licences" },
  newExperience: { ar: "تجربة جديدة", en: "New experience" },
  edit: { ar: "تعديل", en: "Edit" },
  editTitle: { ar: "تعديل التجربة", en: "Edit experience" },
  editSub: {
    ar: "التعديلات تُحفظ فورًا. المحتوى بالعربية والإنجليزية معًا.",
    en: "Changes save immediately. Content is authored in both Arabic and English.",
  },
  saveChanges: { ar: "حفظ التعديلات", en: "Save changes" },
  saved: { ar: "تم الحفظ", en: "Saved" },
  contentSection: { ar: "المحتوى", en: "Content" },
  pricingSection: { ar: "السعر والجدولة", en: "Pricing and scheduling" },
  policySection: { ar: "الحضور والشروط", en: "Audience and terms" },
  statusSection: { ar: "الحالة", en: "Status" },
  arabic: { ar: "العربية", en: "Arabic" },
  english: { ar: "الإنجليزية", en: "English" },
  taglineField: { ar: "الوصف المختصر", en: "Tagline" },
  minAgeField: { ar: "أقل عمر", en: "Minimum age" },
  cancelHoursField: { ar: "إلغاء مجاني قبل (ساعة)", en: "Free cancellation (hours before)" },
  bookingModeField: { ar: "طريقة الحجز", en: "Booking mode" },
  publishAction: { ar: "نشر", en: "Publish" },
  pauseAction: { ar: "تعليق", en: "Pause" },
  unpublishNote: {
    ar: "التجربة المعلّقة تختفي من الخريطة ولا تقبل حجوزات جديدة.",
    en: "A paused experience disappears from the map and takes no new bookings.",
  },
  cannotPublish: {
    ar: "لا يمكن النشر — التراخيص المطلوبة لهذه الفئة غير مكتملة.",
    en: "Cannot publish — the licences this category requires are incomplete.",
  },
  backToDash: { ar: "لوحة الخبير", en: "Expert dashboard" },
  earnings: { ar: "الأرباح المستحقة", en: "Pending earnings" },
  thisMonth: { ar: "هذا الشهر", en: "this month" },
  accept: { ar: "قبول", en: "Accept" },
  reject: { ar: "رفض", en: "Reject" },
  noRequests: {
    ar: "لا توجد طلبات جديدة.",
    en: "No new requests.",
  },
  timeLeft: { ar: "الوقت المتبقي للرد", en: "Time left to respond" },
  slaBreached: { ar: "انتهت المهلة", en: "SLA expired" },
  partyOf: { ar: "مجموعة من {n}", en: "Party of {n}" },

  // credentials
  credLayer1: { ar: "الطبقة ١ — الهوية الاقتصادية", en: "Layer 1 — Economic identity" },
  credLayer2: { ar: "الطبقة ٢ — رخصة النشاط", en: "Layer 2 — Activity licence" },
  credLayer1Note: {
    ar: "سجل تجاري أو وثيقة عمل حر. مطلوبة دائمًا.",
    en: "A CR or a freelance certificate. Always required.",
  },
  credLayer2Note: {
    ar: "تعتمد على فئة التجربة. تُراجَع عند النشر وتُعلَّق التجربة عند انتهاء الصلاحية.",
    en: "Depends on the category. Checked at publish time; listings auto-pause on expiry.",
  },
  expiresOn: { ar: "تنتهي في", en: "Expires" },
  addCredential: { ar: "إضافة ترخيص", en: "Add licence" },
  getFreelanceDoc: {
    ar: "استخرج وثيقة العمل الحر مجانًا من freelance.sa",
    en: "Get a free freelance certificate at freelance.sa",
  },

  // publish wizard
  publishTitle: { ar: "نشر تجربة", en: "Publish an experience" },
  step: { ar: "خطوة", en: "Step" },
  of: { ar: "من", en: "of" },
  basics: { ar: "الأساسيات", en: "Basics" },
  logistics: { ar: "التفاصيل", en: "Logistics" },
  audienceStep: { ar: "الحضور", en: "Audience" },
  reviewStep: { ar: "المراجعة", en: "Review" },
  titleField: { ar: "عنوان التجربة", en: "Experience title" },
  descField: { ar: "الوصف", en: "Description" },
  districtField: { ar: "الحي", en: "District" },
  priceField: { ar: "السعر للمقعد", en: "Price per seat" },
  durationField: { ar: "المدة بالدقائق", en: "Duration in minutes" },
  seatsField: { ar: "أقصى عدد مقاعد", en: "Max seats" },
  slaField: { ar: "مهلة الرد بالساعات", en: "Response window (hours)" },
  next: { ar: "التالي", en: "Next" },
  back: { ar: "رجوع", en: "Back" },
  submitForReview: { ar: "إرسال للمراجعة", en: "Submit for review" },
  publishBlocked: { ar: "النشر متوقّف", en: "Publishing blocked" },
  publishBlockedBody: {
    ar: "فئة «{c}» تتطلب {r}. أضف الترخيص لتتمكن من النشر.",
    en: "The “{c}” category requires {r}. Add the licence to publish.",
  },
  publishReady: {
    ar: "التراخيص مكتملة لهذه الفئة. جاهزة للمراجعة.",
    en: "Credentials complete for this category. Ready for review.",
  },
  submitted: {
    ar: "تم الإرسال للمراجعة",
    en: "Submitted for review",
  },
  gateExplainer: {
    ar: "يتم التحقق من التراخيص عند النشر لا عند التسجيل — يبني الخبير تجربته أولًا ثم يُطلب الترخيص.",
    en: "Credentials are checked at publish time, not signup — the expert builds the listing first, then the licence is required.",
  },

  // statuses of experiences
  expStatusPublished: { ar: "منشورة", en: "Published" },
  expStatusDraft: { ar: "مسودة", en: "Draft" },
  expStatusBlocked: { ar: "متوقفة — ترخيص ناقص", en: "Blocked — licence missing" },
  expStatusInReview: { ar: "قيد المراجعة", en: "In review" },
  expStatusPaused: { ar: "معلّقة", en: "Paused" },

  // market page
  marketTitle: { ar: "السوق", en: "The market" },
  marketSub: {
    ar: "لماذا الآن، ولماذا محليًا أولًا",
    en: "Why now, and why domestic-first",
  },

  // misc
  today: { ar: "اليوم", en: "Today" },
  tomorrow: { ar: "غدًا", en: "Tomorrow" },
  demoBanner: {
    ar: "نموذج تجريبي — بيانات وهمية، ولا تتم أي عمليات دفع حقيقية.",
    en: "Demo prototype — seeded data, no real payments are processed.",
  },
  backTo: { ar: "رجوع إلى", en: "Back to" },
} as const;

export type DictKey = keyof typeof DICT;

export function t(key: DictKey, lang: Lang, vars?: Record<string, string | number>): string {
  let s: string = DICT[key][lang];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(`{${k}}`, String(v));
    }
  }
  return s;
}

export function pick(bi: Bi, lang: Lang): string {
  return bi[lang];
}

/* ---------------------------------------------------------------- */
/* Domain label maps                                                 */
/* ---------------------------------------------------------------- */

export const CATEGORY_LABEL: Record<CategoryId, Bi> = {
  pottery: { ar: "فخار", en: "Pottery" },
  bakery: { ar: "مخبوزات", en: "Bakery" },
  sadu: { ar: "سدو", en: "Sadu weaving" },
  coffee: { ar: "قهوة", en: "Coffee" },
  calligraphy: { ar: "خط عربي", en: "Calligraphy" },
  perfume: { ar: "عطور وعود", en: "Perfume & oud" },
  poetry: { ar: "شعر نبطي", en: "Nabati poetry" },
  khoos: { ar: "خوص", en: "Palm frond" },
  tours: { ar: "جولات سياحية", en: "Guided tours" },
};

export const CATEGORY_GLYPH: Record<CategoryId, string> = {
  pottery: "🏺",
  bakery: "🥖",
  sadu: "🧶",
  coffee: "☕",
  calligraphy: "✒️",
  perfume: "🪔",
  poetry: "📜",
  khoos: "🌴",
  tours: "🧭",
};

export const AUDIENCE_LABEL: Record<AudiencePolicy, Bi> = {
  mixed: { ar: "للجميع", en: "Open to all" },
  women_only: { ar: "للنساء فقط", en: "Women only" },
  men_only: { ar: "للرجال فقط", en: "Men only" },
  families_only: { ar: "للعائلات", en: "Families" },
  private_buyout: { ar: "حجز خاص", en: "Private buyout" },
};

export const CREDENTIAL_LABEL: Record<CredentialType, Bi> = {
  cr: { ar: "سجل تجاري", en: "Commercial Registration" },
  freelance_doc: { ar: "وثيقة عمل حر", en: "Freelance certificate" },
  abdea_craft: { ar: "رخصة حرفي — أبدع", en: "Crafts practitioner — Abde'a" },
  municipal_craft: { ar: "رخصة حرفية بلدية", en: "Municipal craft licence" },
  food_health: { ar: "شهادة صحية وغذائية", en: "Food & health permit" },
  mt_tourism: { ar: "رخصة سياحية", en: "Tourism licence" },
  tour_guide: { ar: "رخصة مرشد سياحي", en: "Tourist guide licence" },
};

export const PAYMENT_LABEL: Record<PaymentMethod, Bi> = {
  mada: { ar: "مدى", en: "mada" },
  applepay: { ar: "Apple Pay", en: "Apple Pay" },
  stcpay: { ar: "STC Pay", en: "STC Pay" },
  tabby: { ar: "تابي — قسّمها", en: "Tabby — split it" },
};
