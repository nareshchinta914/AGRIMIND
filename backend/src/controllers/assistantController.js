const axios = require('axios');
const prisma = require('../config/db');
const env = require('../config/env');
const { successResponse, errorResponse } = require('../utils/response');

const LANGUAGE_NAMES = {
  en: 'English',
  ta: 'Tamil (தமிழ்)',
  te: 'Telugu (తెలుగు)',
  hi: 'Hindi (हिन्दी)',
  kn: 'Kannada (ಕನ್ನಡ)',
  ml: 'Malayalam (മലയാളം)',
  mr: 'Marathi (मराठी)',
  bn: 'Bengali (বাংলা)'
};

// Resilient agricultural knowledge bank by topic and language
const NATIVE_ADVISORY = {
  fertilizer: {
    en: 'For optimal crop growth: Apply DAP 50 kg/acre and Urea 25 kg/acre during basal stage, followed by top-dressing with Urea (35 kg/acre) after the first irrigation. Ensure balanced NPK to promote healthy tillering and root development.',
    ta: 'பயிர் வளர்ச்சிக்கு: விதைப்பு சமயத்தில் ஏக்கருக்கு டிஏபி 50 கிலோ மற்றும் யூரியா 25 கிலோ இடவும். முதல் பாசனத்திற்குப் பிறகு 35 கிலோ யூரியா மேலுரமாக இடவும். இது ஆரோக்கியமான வேர் வளர்ச்சிக்கு உதவும்.',
    te: 'పంట ఎదుగుదలకు: విత్తే సమయంలో ఎకరానికి 50 కిలోల డీఏపీ, 25 కిలోల యూరియా వేయండి. మొదటి తడి తర్వాత 35 కిలోల యూరియా పైపాటుగా వేయండి.',
    hi: 'फसल की अच्छी वृद्धि के लिए: बुवाई के समय प्रति एकड़ 50 किलो डीएपी और 25 किलो यूरिया दें। पहली सिंचाई के बाद 35 किलो यूरिया का छिड़काव करें।',
    kn: 'ಬೆಳೆ ಬೆಳವಣಿಗೆಗೆ: ಬಿತ್ತನೆ ಸಮಯದಲ್ಲಿ ಎಕರೆಗೆ 50 ಕೆಜಿ ಡಿಎಪಿ ಮತ್ತು 25 ಕೆಜಿ ಯೂರಿಯಾ ಹಾಕಿ. ಮೊದಲ ನೀರಾವರಿ ನಂತರ 35 ಕೆಜಿ ಯೂರಿಯಾ ಮೇಲುಗೊಬ್ಬರವಾಗಿ ನೀಡಿ.',
    ml: 'വിളവളർച്ചയ്ക്ക്: നടീൽ സമയത്ത് ഏക്കറിന് 50 കിലോ ഡിഎപിയും 25 കിലോ യൂറിയയും നൽകുക. ആദ്യ നനയ്ക്ക് ശേഷം 35 കിലോ യൂറിയ നൽകുക.',
    mr: 'चांगल्या वाढीसाठी: पेरणीवेळी एकरी ५० किलो डीएपी आणि २५ किलो युरिया द्या. पहिल्या पाण्यानंतर ३५ किलो युरिया खत द्या.',
    bn: 'ফসলের বৃদ্ধির জন্য: বপনের সময় একর প্রতি ৫০ কেজি ডিএপি ও ২৫ কেজি ইউরিয়া দিন। প্রথম সেচের পর ৩৫ কেজি ইউরিয়া প্রয়োগ করুন।'
  },
  disease: {
    en: 'For leaf spots or yellowing: Spray Propiconazole 25% EC (1 ml per liter of water) or Neem Oil 10,000 ppm (3 ml/L) for organic control. Avoid water stagnation in the field to prevent root rot.',
    ta: 'இலைப்புள்ளி மற்றும் மஞ்சள் நோய்க்கு: ஒரு லிட்டர் தண்ணீரில் 1 மிலி புரோபிகோனசோல் அல்லது 3 மிலி வேப்பெண்ணெய் கரைத்து தெளிக்கவும். வயலில் நீர் தேங்காமல் பார்த்துக் கொள்ளுங்கள்.',
    te: 'ఆకుమచ్చ లేదా పసుపు తెగులు నివారణకు: లీటరు నీటికి 1 మి.లీ ప్రొపికొనజోల్ లేదా 3 మి.లీ వేప నూనె కలిపి పిచికారీ చేయండి. మడిలో నీరు నిల్వ ఉండకుండా చూడండి.',
    hi: 'पत्तियों के धब्बों या पीलेपन के लिए: 1 मिली प्रोपिकोनाज़ोल प्रति लीटर पानी या 3 मिली नीम तेल मिलाकर छिड़कें। खेत में जलभराव न होने दें।',
    kn: 'ಎಲೆ ಚುಕ್ಕೆ ಅಥವಾ ಹಳದಿ ರೋಗಕ್ಕೆ: ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 1 ಮಿಲಿ ಪ್ರೊಪಿಕೊನಾಜೋಲ್ ಅಥವಾ 3 ಮಿಲಿ ಬೇವಿನ ಎಣ್ಣೆ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ.',
    ml: 'ഇലപ്പുള്ളി രോഗത്തിന്: ഒരു ലിറ്റർ വെള്ളത്തിൽ 1 മില്ലി പ്രൊപികൊണസോൾ അല്ലെങ്കിൽ 3 മില്ലി വേപ്പെണ്ണ കലക്കി തളിക്കുക.',
    mr: 'पानावरील डागांसाठी: प्रति लिटर पाण्यात १ मिली प्रोपिकोनाझोल किंवा ३ मिली कडुनिंबाचे तेल मिसळून फवारणी करा.',
    bn: 'পাতার দাগ বা হলুদ রোগের জন্য: প্রতি লিটার জলে ১ মিলি প্রোপিকোনাজল বা ৩ মিলি নিম তেল গুলে স্প্রে করুন।'
  },
  water: {
    en: 'Irrigation recommendation: Schedule light watering during early morning hours (6:00 AM - 8:30 AM) to minimize evaporation loss. Maintain 2-3 cm standing water for paddy during tillering phase.',
    ta: 'பாசன ஆலோசனை: அதிகாலை 6:00 முதல் 8:30 மணிக்குள் பாசனம் செய்வது நீர் ஆவியாவதைத் தடுக்கும். நெல் பயிரின் தூர்கட்டும் பருவத்தில் 2-3 செ.மீ நீர் இருக்குமாறு பராமரிக்கவும்.',
    te: 'నీటిపారుదల సలహా: ఉదయం 6:00 నుండి 8:30 గంటల మధ్య నీరు పెట్టడం వలన ఆవిరి కావడం తగ్గుతుంది. పిలకల దశలో 2-3 సెం.మీ నీటిని ఉంచండి.',
    hi: 'सिंचाई सलाह: वाष्पीकरण से बचने के लिए सुबह 6:00 से 8:30 बजे के बीच सिंचाई करें। कल्ले फूटते समय धान में 2-3 सेमी पानी बनाए रखें।',
    kn: 'ನೀರಾವರಿ ಸಲಹೆ: ಬೆಳಿಗ್ಗೆ 6:00 ರಿಂದ 8:30 ರ ನಡುವೆ ನೀರು ನೀಡಿ. ಭತ್ತದ ಕವಲು ಒಡೆಯುವ ಹಂತದಲ್ಲಿ 2-3 ಸೆಂ.ಮೀ ನೀರನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಿ.',
    ml: 'നനയ്ക്കൽ ഉപദേശം: രാവിലെ 6:00 മുതൽ 8:30 വരെയുള്ള സമയത്ത് നനയ്ക്കുക. നെല്ലിൽ 2-3 സെ.മീ വെള്ളം നിലനിർത്തുക.',
    mr: 'सिंचन सल्ला: सकाळी ६:०० ते ८:३० दरम्यान पाणी द्या. भात पिकात फुटवे फुटताना २-३ सेंमी पाणी ठेवा.',
    bn: 'সেচ পরামর্শ: সকাল ৬:০০ থেকে ৮:৩০ এর মধ্যে সেচ দিন। ধানের শিষ আসার সময় ২-৩ সেমি জল ধরে রাখুন।'
  },
  market: {
    en: 'Current APMC Mandi trend: Paddy Grade A is trading at ₹2,320 - ₹2,450 per quintal with stable demand. Quality produce with moisture below 17% fetches higher prices.',
    ta: 'தற்போதைய சந்தை விலை நிலவரம்: ஏ-கிரேடு நெல் குவிண்டாலுக்கு ₹2,320 முதல் ₹2,450 வரை விற்பனையாகிறது. ஈரப்பதம் 17% குறைவாக உள்ள தானியங்களுக்கு கூடுதல் விலை கிடைக்கும்.',
    te: 'ప్రస్తుత మార్కెట్ ధరలు: ఏ-గ్రేడ్ వరి క్వింటాలుకు ₹2,320 నుండి ₹2,450 వరకు పలుకుతోంది. తేమ 17% కంటే తక్కువగా ఉన్న ధాన్యానికి మంచి ధర లభిస్తుంది.',
    hi: 'वर्तमान मंडी भाव: ए-ग्रेड धान ₹2,320 से ₹2,450 प्रति क्विंटल के भाव पर स्थिर है। 17% से कम नमी वाली फसल पर बेहतर दाम मिलता है।',
    kn: 'ಪ್ರಸ್ತುತ ಮಾರುಕಟ್ಟೆ ದರ: ಎ-ಗ್ರೇಡ್ ಭತ್ತ ಕ್ವಿಂಟಾಲ್‌ಗೆ ₹2,320 ರಿಂದ ₹2,450 ವರೆಗೆ ಮಾರಾಟವಾಗುತ್ತಿದೆ. ತೇವಾಂಶ 17% ಕ್ಕಿಂತ ಕಡಿಮೆ ಇರುವ ಬೆಳೆಗೆ ಉತ್ತಮ ಬೆಲೆ ಸಿಗುತ್ತದೆ.',
    ml: 'വിപണി നിരക്ക്: നെല്ല് ക്വിന്റലിന് ₹2,320 മുതൽ ₹2,450 വരെയാണ് ഇന്നത്തെ ശരാശരി വില.',
    mr: 'सध्याचे बाजारभाव: ए-ग्रेड धान ₹२,३२० ते ₹२,४५० प्रति क्विंटल दराने विकले जात आहे.',
    bn: 'বর্তমান বাজার দর: এ-গ্রেড ধান প্রতি কুইন্টাল ₹২,৩২০ থেকে ₹২,৪৫০ দরে বিকোচ্ছে।'
  }
};

class AssistantController {
  /**
   * POST /api/assistant/chat
   */
  async chat(req, res, next) {
    try {
      const { message, language = 'en', farmerContext } = req.body;

      if (!message || !message.trim()) {
        return errorResponse(res, 'Message is required', 'MISSING_MESSAGE', 400);
      }

      const langCode = (language || 'en').toLowerCase().slice(0, 2);
      const targetLangName = LANGUAGE_NAMES[langCode] || 'English';

      // Build context
      const context = {
        location: req.user?.district ? `${req.user.district}, ${req.user.state}` : (farmerContext?.location || 'Thanjavur, Tamil Nadu'),
        current_crop: req.user?.farmerProfile?.currentCrops || farmerContext?.current_crop || 'Paddy (Rice)',
        soil_type: req.user?.farmerProfile?.soilType || farmerContext?.soil_type || 'Alluvial Soil',
        farm_size: req.user?.farmerProfile?.farmSize || farmerContext?.farm_size || 5.0,
        weather_summary: farmerContext?.weather_summary || '31°C, Partly Cloudy'
      };

      let reply = '';
      let suggestedActions = ['Crop Health', 'Fertilizer Guide', 'Water Schedule', 'Market Rates'];

      // 1. Try Groq AI (Ultra-fast inference)
      if (env.GROQ_API_KEY) {
        try {
          const systemPrompt = `You are AGRIMIND Kisan AI, an expert agricultural advisor for Indian farmers, customers, and agribusinesses.
User Context:
- Location: ${context.location}
- Crop: ${context.current_crop}
- Soil: ${context.soil_type}
- Farm Size: ${context.farm_size} Acres
- Weather: ${context.weather_summary}

CRITICAL RULES:
1. Always respond directly in ${targetLangName} (Language code: ${langCode}).
2. Provide realistic, practical, and highly accurate agricultural solutions (NPK doses per acre, pest control, watering timings, market price trends).
3. Keep the tone warm, clear, and conversational so it sounds natural when spoken aloud by a voice assistant.
4. Keep the response to 2-4 concise, impactful sentences without unnecessary preamble.`;

          const groqResponse = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
              model: 'openai/gpt-oss-120b',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
              ],
              temperature: 0.6,
              max_tokens: 350
            },
            {
              headers: {
                Authorization: `Bearer ${env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
              },
              timeout: 6000
            }
          );

          let candidate = groqResponse.data?.choices?.[0]?.message?.content;
          if (candidate) {
            candidate = candidate.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
            if (candidate) {
              reply = candidate;
            }
          }
        } catch (groqErr) {
          console.warn('[Backend] Groq API call fallback:', groqErr.message);
        }
      }

      // 2. Try Gemini API if Groq did not respond
      if (!reply && env.GEMINI_API_KEY) {
        try {
          const geminiPrompt = `
You are AGRIMIND Kisan AI, an expert agricultural scientist and advisor for Indian farmers and agriculture stakeholders.

User Context:
- Location: ${context.location}
- Main Crop: ${context.current_crop}
- Soil: ${context.soil_type}
- Farm Size: ${context.farm_size} Acres
- Weather: ${context.weather_summary}

Farmer Question: "${message}"

CRITICAL INSTRUCTIONS:
1. Provide a realistic, highly accurate, and practical agricultural response.
2. ALWAYS respond directly in ${targetLangName} (Language code: ${langCode}).
3. Keep the tone warm, respectful, and encouraging.
4. Provide actionable guidance with exact dosages (e.g. per acre or per liter) where relevant.
5. Keep the explanation clear and conversational so it sounds natural when spoken aloud by a voice assistant.
6. Limit the response to 3-5 concise, informative sentences.
`.trim();

          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${env.GEMINI_API_KEY}`;
          const aiResponse = await axios.post(
            geminiUrl,
            {
              contents: [{ parts: [{ text: geminiPrompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600
              }
            },
            { timeout: 6000 }
          );

          const candidateText = aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.trim()) {
            reply = candidateText.trim();
          }
        } catch (geminiErr) {
          console.warn('[Backend] Gemini API call fallback:', geminiErr.message);
        }
      }

      // 2. Resilient Agricultural Knowledge Fallback if Gemini is offline
      if (!reply) {
        const lower = message.toLowerCase();
        let topic = 'fertilizer';
        if (
          lower.includes('water') || lower.includes('irrigation') ||
          lower.includes('தண்ணீர்') || lower.includes('பாசனம்') ||
          lower.includes('నీరు') || lower.includes('నీటిపారుదల') ||
          lower.includes('पानी') || lower.includes('सिंचाई')
        ) {
          topic = 'water';
        } else if (
          lower.includes('disease') || lower.includes('yellow') || lower.includes('pest') || lower.includes('spot') ||
          lower.includes('நோய்') || lower.includes('மஞ்சள்') || lower.includes('பூச்சி') ||
          lower.includes('తెగులు') || lower.includes('పురుగు') ||
          lower.includes('रोग') || lower.includes('कीड़ा')
        ) {
          topic = 'disease';
        } else if (
          lower.includes('price') || lower.includes('rate') || lower.includes('market') || lower.includes('mandi') || lower.includes('sell') ||
          lower.includes('விலை') || lower.includes('சந்தை') ||
          lower.includes('ధర') || lower.includes('మార్కెట్') ||
          lower.includes('भाव') || lower.includes('दाम')
        ) {
          topic = 'market';
        }

        const advisoryMap = NATIVE_ADVISORY[topic] || NATIVE_ADVISORY.fertilizer;
        reply = advisoryMap[langCode] || advisoryMap.en;
      }

      // 3. Save conversation log if database is connected
      if (req.user?.id) {
        try {
          await prisma.aIConversation.create({
            data: {
              userId: req.user.id,
              language: langCode,
              message,
              aiResponse: reply
            }
          });
        } catch (dbErr) {
          // Non-critical logging error
        }
      }

      return successResponse(
        res,
        {
          reply,
          language: langCode,
          audioText: reply,
          suggestedActions,
          contextUsed: context
        },
        'AI Advisory Response Generated'
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AssistantController();

