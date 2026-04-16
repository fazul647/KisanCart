const express = require("express");
const axios = require("axios");
const router = express.Router();
const Chat = require("../models/Chat");
const cropKnowledge = require("../data/cropKnowledge");
const qaDataset = require("../data/qaDataset"); // 🔥 NEW

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;
    const lowerMsg = message.toLowerCase();

    await Chat.create({
      userId,
      sender: "user",
      message,
    });

    // ========================
    // 🔹 Language Detection
    // ========================
    let lang = "en";
    let languageInstruction = "Reply in English.";

    if (/[\u0C00-\u0C7F]/.test(message)) {
      lang = "te";
      languageInstruction = "Reply completely in Telugu.";
    } else if (/[\u0900-\u097F]/.test(message)) {
      lang = "hi";
      languageInstruction = "Reply completely in Hindi.";
    }

    // ========================
    // 🔹 General Questions (NEW 🔥)
    // ========================
    if (/rainy|monsoon|వాన|बरसात/i.test(lowerMsg)) {
      const replies = {
        en: "Recommended crops: paddy, maize, soybean, millets.",
        te: "వానాకాలంలో పండే పంటలు: వరి, మొక్కజొన్న, సోయాబీన్.",
        hi: "बरसात में उगने वाली फसलें: धान, मक्का, सोयाबीन।"
      };

      const reply = replies[lang];

      await Chat.create({ userId, sender: "bot", message: reply });
      return res.json({ reply });
    }

    // ========================
    // 🔹 Q&A Dataset
    // ========================
    for (let item of qaDataset) {
      if (item.keywords.some(k => lowerMsg.includes(k))) {
        let reply = item.answer[lang] || item.answer.en;

        await Chat.create({ userId, sender: "bot", message: reply });
        return res.json({ reply });
      }
    }

    // ========================
    // 🔹 Crop Detection
    // ========================
    const cropAliases = {
      paddy: ["paddy", "rice", "వరి", "धान"],
      maize: ["maize", "corn", "మొక్కజొన్న", "मक्का"],
      wheat: ["wheat", "గోధుమ", "गेहूं"],
      tomato: ["tomato", "టమాట", "टमाटर"],
      cotton: ["cotton", "పత్తి", "कपास"]
    };

    let detectedCrop = null;

    for (const crop in cropAliases) {
      if (cropAliases[crop].some(alias => lowerMsg.includes(alias))) {
        detectedCrop = crop;
        break;
      }
    }

    // ========================
    // 🔹 General Crop Info (NEW 🔥)
    // ========================
    const isGeneralInfo = /about|tell|information|గురించి|के बारे में/i.test(lowerMsg);

    if (detectedCrop && isGeneralInfo) {
      const replies = {
        en: `${detectedCrop} is an important crop. Ask about fertilizer, pests, or irrigation.`,
        te: `${detectedCrop} ఒక ముఖ్యమైన పంట. ఎరువులు, కీటకాలు గురించి అడగండి.`,
        hi: `${detectedCrop} एक महत्वपूर्ण फसल है। उर्वरक, कीट के बारे में पूछें।`
      };

      const reply = replies[lang];

      await Chat.create({ userId, sender: "bot", message: reply });
      return res.json({ reply });
    }

    // ========================
    // 🔹 Intent Detection
    // ========================
    const isFertilizer = /fertilizer|nutrient|manure|urea|dap|ఎరువు|खाद/i.test(lowerMsg);
    const isPest = /pest|insect|disease|hopper|bug|కీటకం|कीट/i.test(lowerMsg);
    const isIrrigation = /water|irrigation|watering|నీరు|पानी/i.test(lowerMsg);

    function getReply(crop, type, lang) {
      return cropKnowledge[crop]?.[type]?.[lang] || null;
    }

    // ========================
    // 🔹 Deterministic Logic
    // ========================
    if (detectedCrop && isFertilizer) {
      const reply = getReply(detectedCrop, "fertilizer", lang) || "Data not available.";
      await Chat.create({ userId, sender: "bot", message: reply });
      return res.json({ reply });
    }

    if (detectedCrop && isPest) {
      const reply = getReply(detectedCrop, "pests", lang) || "Data not available.";
      await Chat.create({ userId, sender: "bot", message: reply });
      return res.json({ reply });
    }

    if (detectedCrop && isIrrigation) {
      const reply = getReply(detectedCrop, "irrigation", lang) || "Data not available.";
      await Chat.create({ userId, sender: "bot", message: reply });
      return res.json({ reply });
    }
    // ========================
// 🔹 Crop Only Query (NEW 🔥)
// ========================
if (detectedCrop && !isFertilizer && !isPest && !isIrrigation) {
  const replies = {
    en: `${detectedCrop} is a major crop. You can ask about fertilizer, pests, or irrigation.`,
    te: `${detectedCrop === "paddy" ? "వరి" : detectedCrop} ఒక ముఖ్యమైన పంట. ఎరువులు, కీటకాలు లేదా నీటిపారుదల గురించి అడగండి.`,
    hi: `${detectedCrop === "paddy" ? "धान" : detectedCrop} एक महत्वपूर्ण फसल है। उर्वरक, कीट या सिंचाई के बारे में पूछें।`
  };

  const reply = replies[lang];

  await Chat.create({ userId, sender: "bot", message: reply });
  return res.json({ reply });
}

    // ========================
    // 🔹 Better Unknown Handling
    // ========================
    const unknownReplies = {
      en: "Please ask about crops, fertilizer, pests, irrigation, or seasons.",
      te: "దయచేసి పంటలు, ఎరువులు, కీటకాలు లేదా వాతావరణం గురించి అడగండి.",
      hi: "कृपया फसल, खाद, कीट या मौसम के बारे में पूछें।"
    };

    if (!detectedCrop) {
      const reply = unknownReplies[lang];
      await Chat.create({ userId, sender: "bot", message: reply });
      return res.json({ reply });
    }

    // ========================
    // 🔹 AI Fallback
    // ========================
    const response = await axios.post(
      "https://api.sambanova.ai/v1/chat/completions",
      {
        model: "gpt-oss-120b",
        max_tokens: 200,
        messages: [
          {
            role: "system",
            content: `
You are KisanCart AI, an expert agriculture assistant.

${languageInstruction}

Rules:
- Max 5 short sentences
- Farmer-friendly
- Practical advice
`
          },
          { role: "user", content: message }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SAMBANOVA_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const botReply = response.data.choices[0].message.content || "Sorry, I couldn't understand.";

    await Chat.create({
      userId,
      sender: "bot",
      message: botReply
    });

    res.json({ reply: botReply });

  } catch (error) {
    console.log("Hybrid AI Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Server error"
    });
  }
});

module.exports = router;