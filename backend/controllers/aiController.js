import db from "../config/db.js";
import { generateAIResponse } from "../services/geminiService.js";

// ==========================================
// 1. GET EXPENSE SUMMARY
// ==========================================

export const getExpenseSummary = async (req, res) => {
try {
const userId = req.userId;

const [financialRows] = await db.query(
  `SELECT
    COALESCE(SUM(
      CASE WHEN LOWER(type) = 'income'
      THEN amount ELSE 0 END
    ), 0) AS totalIncome,

    COALESCE(SUM(
      CASE WHEN LOWER(type) = 'expense'
      THEN amount ELSE 0 END
    ), 0) AS totalExpenses

  FROM transactions
  WHERE userId = ?`,
  [userId]
);

const totalIncome = Number(financialRows[0].totalIncome);
const totalExpenses = Number(financialRows[0].totalExpenses);
const netProfit = totalIncome - totalExpenses;

// Crop-wise financial analysis
const [cropRows] = await db.query(
  `SELECT
    COALESCE(NULLIF(TRIM(crop), ''), 'General') AS crop,

    SUM(CASE WHEN LOWER(type) = 'expense'
    THEN amount ELSE 0 END) AS expenses,

    SUM(CASE WHEN LOWER(type) = 'income'
    THEN amount ELSE 0 END) AS income

  FROM transactions
  WHERE userId = ?
  GROUP BY COALESCE(NULLIF(TRIM(crop), ''), 'General')`,
  [userId]
);

// Expense descriptions
const [categoryRows] = await db.query(
  `SELECT
    LOWER(TRIM(name)) AS category,
    SUM(amount) AS total

  FROM transactions
  WHERE userId = ?
  AND LOWER(type) = 'expense'
  GROUP BY LOWER(TRIM(name))
  ORDER BY total DESC`,
  [userId]
);

const cropAnalysis = cropRows.map((row) => ({
  crop: row.crop,
  expenses: Number(row.expenses),
  income: Number(row.income),
  profit: Number(row.income) - Number(row.expenses),
}));

const expenseCategories = categoryRows.map((row) => ({
  category: row.category,
  amount: Number(row.total),
}));

res.status(200).json({
  success: true,

  summary: {
    totalIncome,
    totalExpenses,
    netProfit,
    profitMargin: totalIncome > 0
      ? Number(((netProfit / totalIncome) * 100).toFixed(2))
      : null,
  },

  cropAnalysis,
  expenseCategories,
});

} catch (error) {
console.error("AI Expense Summary Error:", error);

res.status(500).json({
  success: false,
  message: "Failed to generate financial summary",
});

}
};

// ==========================================
// 2. GET AI EXPENSE RECOMMENDATIONS
// ==========================================

export const getExpenseRecommendations = async (req, res) => {
try {
const userId = req.userId;

// Fetch total income and expenses
const [financialRows] = await db.query(
  `SELECT
    COALESCE(SUM(
      CASE WHEN LOWER(type) = 'income'
      THEN amount ELSE 0 END
    ), 0) AS totalIncome,

    COALESCE(SUM(
      CASE WHEN LOWER(type) = 'expense'
      THEN amount ELSE 0 END
    ), 0) AS totalExpenses

  FROM transactions
  WHERE userId = ?`,
  [userId]
);

const totalIncome = Number(financialRows[0].totalIncome);
const totalExpenses = Number(financialRows[0].totalExpenses);
const netProfit = totalIncome - totalExpenses;

// Fetch highest expenses
const [expenseRows] = await db.query(
  `SELECT
    TRIM(name) AS expenseName,
    SUM(amount) AS total
  FROM transactions
  WHERE userId = ?
  AND LOWER(type) = 'expense'
  GROUP BY LOWER(TRIM(name)), TRIM(name)
  ORDER BY total DESC
  LIMIT 5`,
  [userId]
);

// Fetch crop-wise financial data
const [cropRows] = await db.query(
  `SELECT
    COALESCE(NULLIF(TRIM(crop), ''), 'General') AS crop,

    SUM(CASE WHEN LOWER(type) = 'income'
    THEN amount ELSE 0 END) AS income,

    SUM(CASE WHEN LOWER(type) = 'expense'
    THEN amount ELSE 0 END) AS expenses

  FROM transactions
  WHERE userId = ?
  GROUP BY COALESCE(NULLIF(TRIM(crop), ''), 'General')`,
  [userId]
);

const cropAnalysis = cropRows.map((row) => ({
  crop: row.crop,
  income: Number(row.income),
  expenses: Number(row.expenses),
  profit: Number(row.income) - Number(row.expenses),
}));

const highestExpenses = expenseRows.map((row) => ({
  name: row.expenseName,
  amount: Number(row.total),
  percentage: totalExpenses > 0
    ? Number(((Number(row.total) / totalExpenses) * 100).toFixed(2))
    : 0,
}));

// Curated Cost-Saving Alternatives with Pesticide & Fertilizer Names and Market Prices
const costSavingAlternatives = [
  {
    category: "Fertilizer",
    title: "Replace DAP with SSP + Urea",
    currentPractice: "DAP (Diammonium Phosphate) ~ ₹1,350 / 50kg bag",
    recommendation: "Use Single Super Phosphate (SSP @ ₹380) + Urea (@ ₹267) to get equivalent Nitrogen & Phosphate with 11% free Sulphur",
    priceRange: "₹647 total vs ₹1,350 DAP",
    estimatedSavings: "Save approx ₹703 per bag (~52% reduction)",
    badge: "52% Cheaper",
    applicableFor: "Wheat, Chana, Mustard basal application"
  },
  {
    category: "Fertilizer",
    title: "Switch to IFFCO Nano Urea Spray",
    currentPractice: "Bagged Granular Urea ~ ₹267 / bag + ₹70 transport & application",
    recommendation: "Spray 1 bottle Nano Urea (500 ml @ ₹225) mixed in 100L water per acre during vegetative tillering (80% absorption)",
    priceRange: "₹225 / bottle",
    estimatedSavings: "Save ₹112 per bag + zero heavy transport costs",
    badge: "High Uptake",
    applicableFor: "All active crops at tillering / vegetative stage"
  },
  {
    category: "Pesticide",
    title: "Generic Emamectin Benzoate 5% SG",
    currentPractice: "Premium brand Chlorantraniliprole (Coragen) ~ ₹1,850 / 150ml",
    recommendation: "Use generic Emamectin Benzoate 5% SG @ 80g-100g per acre (₹320 - ₹360) for pod borers & armyworm",
    priceRange: "₹340 / 100g pack",
    estimatedSavings: "Save approx ₹1,510 per acre (81% cost cut)",
    badge: "81% Savings",
    applicableFor: "Chana pod borer, Soybean leaf caterpillar"
  },
  {
    category: "Bio-Pesticide",
    title: "Neem Oil 10,000 PPM (Azadirachtin)",
    currentPractice: "Repeated chemical sprays (Imidacloprid/Acetamiprid) ~ ₹700 / acre",
    recommendation: "Early spray of pure cold-pressed Neem Oil @ 3ml/L water (₹380 / 1L bottle treats 3 acres)",
    priceRange: "₹380 / Litre",
    estimatedSavings: "Save ₹450 per acre and prevents insecticide resistance",
    badge: "Eco-Friendly",
    applicableFor: "Aphids, whiteflies, thrips on young wheat & vegetables"
  },
  {
    category: "Fungicide",
    title: "Mancozeb 75% WP Broad Spectrum",
    currentPractice: "Branded combination systemic fungicides ~ ₹950 / 500g",
    recommendation: "Use generic Mancozeb 75% WP @ 2g/L (₹420 / 1kg) as protective spray against rust, blight & leaf spot",
    priceRange: "₹420 / 1kg pack",
    estimatedSavings: "Save ₹530 per kg with proven multi-site fungal protection",
    badge: "Proven Value",
    applicableFor: "Rust on wheat, leaf spots on pulses"
  }
];

// Rule-based recommendations
const recommendations = [];

if (totalExpenses === 0) {
  recommendations.push({
    type: "info",
    title: "Start tracking expenses",
    message:
      "Add your farming expenses to receive personalized expense-saving recommendations.",
  });
} else {
  if (highestExpenses.length > 0) {
    const highest = highestExpenses[0];

    recommendations.push({
      type: "expense_alert",
      title: "Review your highest expense",
      message:
        `${highest.name} accounts for ${highest.percentage}% of your recorded expenses. Compare supplier prices or switch to generic formulations to save.`,
    });
  }

  if (netProfit < 0) {
    recommendations.push({
      type: "warning",
      title: "Expenses exceed income",
      message:
        "Your recorded expenses are higher than your income. Review chemical and fertilizer purchases and identify generic alternatives.",
    });
  } else if (totalIncome > 0) {
    recommendations.push({
      type: "success",
      title: "Finances in positive profit",
      message:
        `Your recorded income exceeds expenses by ₹${netProfit.toFixed(2)}. Reinvest savings into soil health and efficient irrigation.`,
    });
  }
}

// ==========================================
// GEMINI AI INTEGRATION
// ==========================================

let aiAdvice = null;

try {
const topExpenses = highestExpenses
  .slice(0, 3)
  .map((e) => `${e.name} (₹${e.amount})`)
  .join(", ") || "fertilizers and pesticides";

const prompt = `You are an expert farm financial and agronomy advisor for Indian farmers.
Financial status: Total Income ₹${totalIncome}, Total Expenses ₹${totalExpenses}, Net Profit ₹${netProfit}.
Top expenses: ${topExpenses}.
Recommend concrete, specific fertilizer and pesticide generic brand names with realistic prices (in ₹) that will directly cut input costs.
Give exactly 3 concise bullet points (max 25 words each):
1. Specific cheaper fertilizer name with price vs expensive option.
2. Specific cheaper pesticide or fungicide name with price vs expensive option.
3. High-impact smart buying tip.
No preamble, no sign-off.`;

  aiAdvice = await generateAIResponse(prompt);

} catch (error) {
  console.error("Gemini Advice Error:", error.message);

  // Reliable expert fallback recommendations with pesticide/fertilizer names and prices
  aiAdvice = [
    "• Fertilizer Saving: Replace DAP (₹1,350/bag) with SSP (₹380) + Urea (₹267) to save ₹703/bag and supply vital 11% Sulphur.",
    "• Pesticide Saving: Use generic Emamectin Benzoate 5% SG (₹340/100g) instead of expensive branded sprays to save up to ₹1,500/acre.",
    "• Foliar Efficiency: Adopt IFFCO Nano Urea (₹225/bottle) to cut chemical nitrogen expense by 30% with 80% absorption."
  ].join("\n");
}

// ==========================================
// FINAL API RESPONSE
// ==========================================

res.status(200).json({
  success: true,

  financialOverview: {
    totalIncome,
    totalExpenses,
    netProfit,
  },

  highestExpenses,
  recommendations,
  costSavingAlternatives,
  aiAdvice,
});

} catch (error) {
console.error("AI Expense Recommendations Error:", error);

res.status(500).json({
  success: false,
  message: "Failed to generate expense recommendations",
});

}
};

// ==========================================
// 2B. GET PESTICIDE & FERTILIZER MARKET PRICES
// ==========================================

export const getPesticidePrices = async (req, res) => {
  try {
    const pesticides = [
      {
        name: "Generic Chlorpyrifos 20% EC",
        category: "Pesticide",
        use: "Termite & Stem Borer Control",
        priceRange: "₹480 - ₹540",
        pack: "1 Litre",
        cheaperAlternative: "Generic equivalent to branded Dursban (save ₹600/L)",
        savings: "Save 55%"
      },
      {
        name: "Emamectin Benzoate 5% SG",
        category: "Pesticide",
        use: "Pod Borer & Caterpillars (Chana, Soybean)",
        priceRange: "₹310 - ₹360",
        pack: "100 Grams",
        cheaperAlternative: "Low-cost alternative to Coragen / Flubendiamide",
        savings: "Save 75%"
      },
      {
        name: "Neem Oil 10,000 PPM (Azadirachtin)",
        category: "Bio-Pesticide",
        use: "Aphids, Whiteflies & Sucking Pests",
        priceRange: "₹360 - ₹420",
        pack: "1 Litre",
        cheaperAlternative: "Replaces chemical Imidacloprid, prevents resistance",
        savings: "Save 40%"
      },
      {
        name: "Single Super Phosphate (SSP)",
        category: "Fertilizer",
        use: "Phosphorus + 11% Sulphur for Wheat, Mustard & Pulses",
        priceRange: "₹360 - ₹400",
        pack: "50 kg Bag",
        cheaperAlternative: "Combine with Urea to substitute DAP at half the cost",
        savings: "Save ₹700/bag"
      },
      {
        name: "IFFCO Nano Urea Liquid",
        category: "Fertilizer",
        use: "Foliar Nitrogen (80% plant absorption)",
        priceRange: "₹220 - ₹240",
        pack: "500 ml Bottle",
        cheaperAlternative: "Replaces 1 full 45kg bag of conventional granular urea",
        savings: "Save ₹100/bag"
      },
      {
        name: "Mancozeb 75% WP",
        category: "Fungicide",
        use: "Blight, Rust & Alternaria Leaf Spot",
        priceRange: "₹390 - ₹450",
        pack: "1 kg",
        cheaperAlternative: "Protective broad-spectrum fungicide at economical cost",
        savings: "Save 45%"
      },
      {
        name: "Muriate of Potash (MOP 0:0:60)",
        category: "Fertilizer",
        use: "Kernel & Grain Filling, Drought Tolerance",
        priceRange: "₹1,650 - ₹1,750",
        pack: "50 kg Bag",
        cheaperAlternative: "Direct cooperative purchase saves dealer margins",
        savings: "Save ₹250/bag"
      },
      {
        name: "Trichoderma Viride Bio-Fungicide",
        category: "Bio-Control",
        use: "Seed Treatment & Root Rot / Damping-off Prevention",
        priceRange: "₹140 - ₹180",
        pack: "1 kg",
        cheaperAlternative: "Natural soil bio-agent protecting seed germination",
        savings: "Save 70%"
      }
    ];

    res.status(200).json({
      success: true,
      pesticides,
    });
  } catch (error) {
    console.error("Pesticide Prices Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load input prices.",
    });
  }
};

// ==========================================
// HELPER: RULE-BASED AGRONOMIC FALLBACK ADVICE
// ==========================================

function generateRuleBasedCropAdvice(crop, cropAge, growthStage, userQuery = "") {
  const cropName = crop?.crop || "Crop";
  const variety = crop?.variety ? ` (${crop.variety})` : "";
  const soil = crop?.soil_type || "cultivated soil";
  const irrigation = crop?.irrigation_type || "scheduled irrigation";
  const stage = growthStage || "Growing";

  const q = (userQuery || "").toLowerCase().trim();

  // If farmer asked a specific question, provide meaningful advice in short (max 2-3 bullets)
  if (q) {
    if (q.includes("water") || q.includes("irrigat") || q.includes("paani") || q.includes("sinchai")) {
      return [
        `💧 Irrigation Schedule: Keep ${soil} evenly moist without waterlogging. At ${stage} stage, irrigate every 8-10 days.`,
        `⏰ Critical Timing: Apply watering during early morning or evening hours to avoid thermal shock and evaporation loss.`,
        `🌾 Stage Note: Avoid heavy inundation; light and frequent watering optimizes root respiration.`
      ].join("\n");
    }

    if (q.includes("fertiliz") || q.includes("khad") || q.includes("nutrient") || q.includes("urea") || q.includes("dap") || q.includes("dose")) {
      return [
        `🧪 Recommended Dose: For ${cropName} in ${stage}, top-dress with 25-30 kg/acre Urea or spray 1 bottle IFFCO Nano Urea (500 ml/acre) mixed in 100L water.`,
        `🌱 Micronutrient Boost: Add Zinc Sulphate (0.5%) if leaves show pale striping.`,
        `💡 Money Saver: Nano Urea costs only ₹225/bottle and achieves 80% plant absorption compared to bagged urea.`
      ].join("\n");
    }

    if (q.includes("yellow") || q.includes("pale") || q.includes("peela")) {
      return [
        `⚠️ Diagnosis: Yellowing in ${stage} usually signals Nitrogen deficiency or root hypoxia from excess water.`,
        `🩺 Action Step: Spray 1.5% Urea solution (15g per Litre water) plus 2g/L Zinc Sulphate on foliage.`,
        `🚜 Drainage: Ensure field ditches allow excess standing water to drain quickly.`
      ].join("\n");
    }

    if (q.includes("pest") || q.includes("insect") || q.includes("keeda") || q.includes("bug") || q.includes("worm") || q.includes("borer") || q.includes("caterpillar")) {
      return [
        `🐛 Pest Control: For caterpillar/pod borer attacks, spray generic Emamectin Benzoate 5% SG @ 80g/acre (₹340) in 150L water.`,
        `🛡️ Preventive: Spray Neem Oil 10,000 PPM @ 3ml/L water against sucking aphids and whiteflies.`,
        `⏱️ Timing: Spray during calm late-afternoon hours for maximum contact effectiveness.`
      ].join("\n");
    }

    if (q.includes("flower") || q.includes("drop") || q.includes("phool")) {
      return [
        `🌸 Bloom Protection: Avoid severe drought or excess flooding during flowering as sudden moisture shifts trigger blossom drop.`,
        `🧪 Foliar Spray: Spray 0:52:34 (MKP) @ 5g/L water or Planofix (Alpha NAA) @ 1 ml per 4.5 Litres of water to anchor buds.`,
        `🐝 Pollinators: Refrain from applying harsh chemical insecticides in the morning when bees are active.`
      ].join("\n");
    }

    if (q.includes("harvest") || q.includes("katai") || q.includes("mandi") || q.includes("ready")) {
      return [
        `🌾 Harvest Readiness: Ready when 85% of leaves and pods turn golden-brown and grain moisture drops below 14%.`,
        `🛑 Pre-Harvest Halt: Stop all irrigation 7-10 days before harvesting to allow uniform maturity.`,
        `🚜 Post-Harvest: Sun-dry thoroughly for 2-3 days before bagging or sending to Mandi.`
      ].join("\n");
    }

    // Default question response
    return [
      `🌱 Expert Guidance: For ${cropName}${variety} in ${stage} (${cropAge} days old):`,
      `• Maintain balanced soil moisture with ${irrigation} and scout lower leaf canopies twice weekly.`,
      `• For optimal vigor, top-dress balanced nutrients and apply 3ml/L Neem oil as an eco-friendly barrier.`
    ].join("\n");
  }

  // Standard Stage-based advice (when no specific question is asked)
  const tips = [];
  if (stage === "Sowing day" || cropAge <= 7) {
    tips.push(`🌱 Sowing & Germination: Seed depth 3-5 cm with uniform spacing for ${cropName}${variety}. Keep upper seedbed moist for rapid emergence.`);
    tips.push(`💧 Irrigation: Light initial watering immediately after sowing. Prevent water stagnation in ${soil}.`);
    tips.push(`🛡️ Protection: Seed treatment with Trichoderma viride (4g/kg seed) prevents damping-off.`);
  } else if (stage === "Sprouted" || cropAge <= 20) {
    tips.push(`🌱 Early Sprout Care: Thin weak seedlings to ensure optimal plant population. Perform light shallow weeding.`);
    tips.push(`💧 Critical Watering: First irrigation around Day 18-21 establishes strong crown root anchorage.`);
    tips.push(`🧪 Starter Nutrition: Apply light Nitrogen top-dress or bio-fertilizer to accelerate foliage development.`);
  } else if (stage === "Vegetative growth") {
    tips.push(`🌿 Vegetative Vigor: Top-dress with Urea or spray Nano Urea (₹225/bottle) during tillering/branching.`);
    tips.push(`💧 Moisture: Scheduled watering every 8-10 days based on soil moisture depth.`);
    tips.push(`🛡️ Pest Scouting: Inspect weekly for aphids and leaf-eating caterpillars; apply Neem oil 3ml/L early.`);
  } else if (stage === "Flowering") {
    tips.push(`🌸 Flowering Care: Maintain consistent moisture; avoid moisture stress to prevent blossom drop.`);
    tips.push(`🧪 Nutrient Boost: Apply foliar spray of 0:52:34 or MOP to promote heavy pod/grain setting.`);
    tips.push(`🛡️ Protection: Avoid chemical insecticides during morning pollination hours.`);
  } else {
    tips.push(`🌾 Harvest Period: Harvest when grains harden and foliage turns golden-yellow.`);
    tips.push(`💧 Pre-Harvest: Stop watering 7-10 days before harvest for dry, clean field entry.`);
    tips.push(`🚜 Grain Care: Sun-dry harvested produce to 12% moisture before storage or Mandi sale.`);
  }

  return tips.join("\n\n");
}

// ==========================================
// 3. AI CROP CARE ADVISOR
// ==========================================

export const getCropCareAdvice = async (req, res) => {
  try {
    const userId = req.userId;
    const cropId = req.body?.cropId || req.query?.cropId;
    const userQuery = req.body?.question || req.body?.symptoms || req.query?.question || req.query?.symptoms || "";

    let crop = null;

    if (cropId) {
      // Fetch specific crop details
      const [rows] = await db.query(
        `SELECT
          c.id,
          c.crop,
          c.area,
          c.date,
          c.soil_type,
          c.variety,
          c.irrigation_type,
          u.state,
          u.district,
          u.location,
          ci.season,
          ci.sprout_day,
          ci.vegetative_day,
          ci.flowering_day,
          ci.harvest_day,
          ci.irrigation_days
        FROM crops c
        JOIN users u ON c.userId = u.id
        LEFT JOIN crop_info ci
          ON LOWER(TRIM(c.crop)) = LOWER(TRIM(ci.crop_name))
        WHERE c.id = ? AND c.userId = ?`,
        [cropId, userId]
      );

      if (rows.length > 0) {
        crop = rows[0];
      }
    }

    // If no crop found with specific ID or no cropId provided, pick the user's latest crop
    if (!crop) {
      const [defaultRows] = await db.query(
        `SELECT
          c.id,
          c.crop,
          c.area,
          c.date,
          c.soil_type,
          c.variety,
          c.irrigation_type,
          u.state,
          u.district,
          u.location,
          ci.season,
          ci.sprout_day,
          ci.vegetative_day,
          ci.flowering_day,
          ci.harvest_day,
          ci.irrigation_days
        FROM crops c
        JOIN users u ON c.userId = u.id
        LEFT JOIN crop_info ci
          ON LOWER(TRIM(c.crop)) = LOWER(TRIM(ci.crop_name))
        WHERE c.userId = ?
        ORDER BY c.id DESC
        LIMIT 1`,
        [userId]
      );

      if (defaultRows.length > 0) {
        crop = defaultRows[0];
      }
    }

    // If farmer has not added any crops yet
    if (!crop) {
      return res.status(200).json({
        success: true,
        crop: null,
        aiAdvice: "No crops added yet. Add your crop in the 'Add Crop' section to receive personalized Gemini AI guidance for your soil, irrigation schedule, and pest prevention.",
        isFallback: false,
      });
    }

    // Calculate crop age
    const sowingDate = crop.date ? new Date(crop.date) : new Date();
    const today = new Date();

    const cropAge = Math.max(
      0,
      Math.floor(
        (today.setHours(0, 0, 0, 0) - sowingDate.setHours(0, 0, 0, 0)) /
          (1000 * 60 * 60 * 24)
      )
    );

    // Determine approximate growth stage
    let growthStage = "Vegetative growth";

    if (crop.harvest_day && cropAge >= crop.harvest_day) {
      growthStage = "Expected harvest period";
    } else if (crop.flowering_day && cropAge >= crop.flowering_day) {
      growthStage = "Flowering";
    } else if (crop.vegetative_day && cropAge >= crop.vegetative_day) {
      growthStage = "Vegetative growth";
    } else if (crop.sprout_day && cropAge >= crop.sprout_day) {
      growthStage = "Sprouted";
    } else if (cropAge === 0) {
      growthStage = "Sowing day";
    }

    let prompt = "";
    const isSpecificQuestion = Boolean(userQuery && userQuery.trim());

    if (isSpecificQuestion) {
      prompt = `
You are FarmFriend, an intelligent Krishi Vigyan Kendra agricultural expert advising an Indian farmer.
The farmer is asking a specific question: "${userQuery.trim()}"

CROP DETAILS:
- Crop: ${crop.crop} ${crop.variety ? "(" + crop.variety + ")" : ""}
- Age: ${cropAge} days (Current Stage: ${growthStage})
- Soil: ${crop.soil_type || "Black/Loamy soil"}
- Irrigation: ${crop.irrigation_type || "Scheduled watering"}
- Location: ${[crop.district, crop.state].filter(Boolean).join(", ") || "India"}

REQUIREMENTS:
- Give MEANINGFUL ADVICE IN SHORT (maximum 50-65 words total).
- Exactly 2-3 direct, practical bullet points.
- Include specific medicine/fertilizer name, exact dosage (e.g. g/L or ml/L), or exact action step.
- No pleasantries, no "Hello farmer", no introductory or closing fluff.
`;
    } else {
      prompt = `
You are FarmFriend, an intelligent agricultural expert assistant helping Indian farmers.
Write 3 direct, practical recommendations for the farmer without any meta-commentary, introductory remarks, or fluff.

CROP: ${crop.crop} ${crop.variety ? "(" + crop.variety + ")" : ""}
AGE: ${cropAge} days (Stage: ${growthStage})
AREA: ${crop.area}
SOIL: ${crop.soil_type || "Loamy soil"}
IRRIGATION: ${crop.irrigation_type || "Scheduled watering"}
LOCATION: ${[crop.district, crop.state].filter(Boolean).join(", ") || "India"}

FORMAT:
💧 Irrigation: [1 concise sentence on watering]
🧪 Nutrition: [1 concise sentence on fertilizer dose]
🛡️ Pest Protection: [1 concise sentence on prevention]
`;
    }

    let aiAdvice = null;
    let isFallback = false;

    try {
      aiAdvice = await generateAIResponse(prompt);
    } catch (aiErr) {
      console.warn("Gemini AI API call failed, generating expert agronomic advice:", aiErr.message);
      aiAdvice = generateRuleBasedCropAdvice(crop, cropAge, growthStage, userQuery);
      isFallback = true;
    }

    res.status(200).json({
      success: true,
      crop: {
        id: crop.id,
        name: crop.crop,
        variety: crop.variety,
        area: crop.area,
        sowingDate: crop.date,
        age: cropAge,
        growthStage,
        soilType: crop.soil_type,
        irrigationType: crop.irrigation_type,
      },
      location: {
        village: crop.location,
        district: crop.district,
        state: crop.state,
      },
      userQuery: userQuery.trim(),
      aiAdvice,
      isFallback,
    });

  } catch (error) {
    console.error("AI Crop Care Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate crop care advice.",
    });
  }
};

// ==========================================
// 4. AI AGRICULTURAL WEATHER ADVISOR
// ==========================================

export const getWeatherCropAdvisory = async (req, res) => {
  try {
    const userId = req.userId;
    const { weather } = req.body || {};

    // Retrieve farmer's active crops
    const [crops] = await db.query(
      `SELECT crop, area, date, soil_type, variety FROM crops WHERE userId = ?`,
      [userId]
    );

    // Retrieve farmer profile location
    const [users] = await db.query(
      `SELECT state, district, location FROM users WHERE id = ?`,
      [userId]
    );

    const userLoc = users[0] || {};
    const cropNames = crops.map((c) => c.crop + (c.variety ? ` (${c.variety})` : "")).join(", ") || "General crops";

    const temp = Number(weather?.current?.temperature_2m ?? 26);
    const humidity = Number(weather?.current?.relative_humidity_2m ?? 50);
    const windSpeed = Number(weather?.current?.wind_speed_10m ?? 7.5);
    const rainProb = Number(weather?.daily?.precipitation_probability_max?.[0] ?? 0);
    const rainSum = Number(weather?.daily?.precipitation_sum?.[0] ?? 0);
    const weatherDesc = weather?.description || "Clear Sky";

    // 1. Spray window assessment
    // Wind < 4.2 m/s (~15 km/h) is optimal, rain < 20%, temp between 12 and 33
    const isWindLow = windSpeed <= 4.2;
    const isRainLow = rainProb < 20 && rainSum < 1;
    const isTempMild = temp >= 12 && temp <= 33;

    let sprayStatus = "Optimal Window";
    let sprayLevel = "success";
    let sprayReason = "Low wind and zero rain risk make early morning (7-10 AM) ideal for foliar spraying.";

    if (!isRainLow) {
      sprayStatus = "High Rain Risk";
      sprayLevel = "danger";
      sprayReason = `${rainProb}% chance of rain (~${rainSum} mm). Precipitation will wash off sprays—postpone chemical applications.`;
    } else if (!isWindLow) {
      sprayStatus = "Drift Caution";
      sprayLevel = "warning";
      sprayReason = `Wind gusts (${windSpeed} m/s) increase drift risk to neighboring areas. Spray only during calm morning hours.`;
    } else if (!isTempMild) {
      sprayStatus = "Thermal Caution";
      sprayLevel = "warning";
      sprayReason = `High temperature (${Math.round(temp)}°C) can cause rapid droplet evaporation or scorch delicate foliage.`;
    }

    // 2. Irrigation assessment
    let irrigationStatus = "Scheduled Watering";
    let irrigationLevel = "info";
    let irrigationReason = "Normal evaporative loss. Irrigate according to standard crop schedule.";

    if (rainProb >= 50 || rainSum >= 5) {
      irrigationStatus = "Hold Irrigation";
      irrigationLevel = "success";
      irrigationReason = `Expected rain (${rainProb}% chance, ~${rainSum} mm) will replenish root zone naturally. Save water and power.`;
    } else if (humidity < 40 && temp > 28) {
      irrigationStatus = "Irrigation Priority";
      irrigationLevel = "warning";
      irrigationReason = "Dry atmospheric conditions accelerate soil evapotranspiration. Check moisture at root depth.";
    }

    // 3. Fungal / Disease Risk
    let diseaseStatus = "Low Risk";
    let diseaseLevel = "success";
    let diseaseReason = "Dry foliage and moderate humidity inhibit fungal spore propagation.";

    if (humidity >= 75 && temp >= 20 && temp <= 32) {
      diseaseStatus = "High Alert";
      diseaseLevel = "danger";
      diseaseReason = `High relative humidity (${humidity}%) and warm temperatures favor blast, rust, and downy mildew outbreaks.`;
    } else if (humidity >= 65) {
      diseaseStatus = "Moderate Watch";
      diseaseLevel = "warning";
      diseaseReason = "Higher morning condensation. Scout dense crop foliage regularly for early leaf spots.";
    }

    // Prompt for Gemini AI
    const prompt = `
You are FarmFriend, an intelligent agricultural meteorologist helping Indian farmers.
Write 3-4 concise, highly practical farming recommendations based on today's weather.

WEATHER CONDITIONS:
Location: ${weather?.city || userLoc.district || "Central India"}
Condition: ${weatherDesc}
Temperature: ${Math.round(temp)}°C
Humidity: ${humidity}%
Wind Speed: ${windSpeed} m/s
Rain Probability: ${rainProb}% (Rain Volume: ${rainSum} mm)
Farmer's Active Crops: ${cropNames}

FORMAT YOUR ANSWER AS FOLLOWS (no preamble, no headers, no fluff):
💧 Irrigation Decision: [1-2 sentences on watering for ${cropNames} under these conditions]

🧪 Spraying Window: [1-2 sentences on suitability for pesticides/fertilizers today]

🛡️ Field Protection & Disease: [1-2 sentences on disease or pest risks for ${cropNames}]
`;

    let aiAdvisory = null;
    let isFallback = false;

    try {
      aiAdvisory = await generateAIResponse(prompt);
    } catch (err) {
      console.warn("Gemini Weather Advice failed, using expert rules:", err.message);
      isFallback = true;
      aiAdvisory = [
        `💧 Irrigation Decision: ${irrigationReason}`,
        `🧪 Spraying Window: ${sprayReason}`,
        `🛡️ Field Protection & Disease: ${diseaseReason} Monitor ${cropNames} for microclimate shifts.`
      ].join("\n\n");
    }

    res.status(200).json({
      success: true,
      indicators: {
        spray: { status: sprayStatus, level: sprayLevel, reason: sprayReason },
        irrigation: { status: irrigationStatus, level: irrigationLevel, reason: irrigationReason },
        disease: { status: diseaseStatus, level: diseaseLevel, reason: diseaseReason },
      },
      aiAdvisory,
      isFallback,
    });

  } catch (error) {
    console.error("AI Weather Advisory Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate weather advisory.",
    });
  }
};

