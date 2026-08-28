const express = require('express');
const router = express.Router();

/**
 * POST /api/assistant/voice
 * Processes voice queries and returns localized agronomy answers with audio script
 */
router.post('/voice', async (req, res) => {
  try {
    const { query, language = 'ta', userContext = {} } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Voice query is required' });
    }

    // Agronomy Knowledge matching for Indian regional languages
    let replyText = '';
    let spokenText = '';

    const lower = query.toLowerCase();
    if (lower.includes('rain') || lower.includes('மழை') || lower.includes('बारिश')) {
      replyText = 'Tomorrow there is a 75% chance of light rain in your district. Hold off chemical spraying.';
      spokenText = language === 'ta'
        ? 'உங்கள் மாவட்டத்தில் நாளை லேசான மழை பெய்ய வாய்ப்புள்ளது. மருந்து தெளிப்பதை ஒத்திவைக்கவும்.'
        : replyText;
    } else if (lower.includes('fertilizer') || lower.includes('உரம்') || lower.includes('खाद')) {
      replyText = 'For paddy at vegetative stage: Apply 25kg Urea + 15kg Potash per acre.';
      spokenText = language === 'ta'
        ? 'நெற்பயிருக்கு ஏக்கருக்கு 25 கிலோ யூரியா மற்றும் 15 கிலோ பொட்டாஷ் உரமிடவும்.'
        : replyText;
    } else {
      replyText = `Based on your farm location, maintain optimum soil moisture and monitor for pest eggs under leaf blades.`;
      spokenText = language === 'ta'
        ? 'உங்கள் பயிருக்கு தேவையான அளவு நீர் பாசனம் செய்யவும் மற்றும் இலைகளின் அடியில் பூச்சி முட்டைகள் உள்ளதா என பார்க்கவும்.'
        : replyText;
    }

    res.json({
      success: true,
      query,
      language,
      reply: replyText,
      spokenText: spokenText,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Voice assistant error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * POST /api/assistant/chat
 */
router.post('/chat', async (req, res) => {
  const { message, language = 'ta' } = req.body;
  res.json({
    reply: `AGRIMIND recommendation for: "${message}"`,
    language,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
