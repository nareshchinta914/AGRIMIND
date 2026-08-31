const axios = require('axios');
const prisma = require('../config/db');
const env = require('../config/env');
const { successResponse, errorResponse } = require('../utils/response');
const weatherService = require('../services/weatherApiService');
const marketPriceService = require('../services/marketPriceService');

const LANGUAGE_NAMES = {
  en: 'English',
  ta: 'Tamil (தமிழ்)',
  te: 'Telugu (తెలుగు)',
  hi: 'Hindi (हिन्दी)',
  kn: 'Kannada (ಕನ್ನಡ)',
  ml: 'Malayalam (മലയാളം)',
  mr: 'Marathi (मराठी)',
  bn: 'Bengali (বাংলা)',
  gu: 'Gujarati (ગુજરાતી)',
  pa: 'Punjabi (ਪੰਜਾਬੀ)',
  or: 'Odia (ଓଡ଼ିଆ)'
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
    bn: 'ফসলের বৃদ্ধির জন্য: বপনের সময় একর প্রতি ৫০ কেজি ডিএপি ও ২৫ কেজি ইউরিয়া দিন। প্রথম সেচের পর ৩৫ কেজি ইউরিয়া প্রয়োগ করুন।',
    gu: 'પાકના સારા વિકાસ માટે: વાવણી વખતે એકરે ૫૦ કિલો ડીએપી અને ૨૫ કિલો યુરિયા આપો. પ્રથમ પિયત પછી ૩૫ કિલો યુરિયા આપો.',
    pa: 'ਫ਼ਸਲ ਦੇ ਵਾਧੇ ਲਈ: ਬਿਜਾਈ ਵੇਲੇ ਪ੍ਰਤੀ ਏਕੜ 50 ਕਿਲੋ ਡੀਏਪੀ ਅਤੇ 25 ਕਿਲੋ ਯੂਰੀਆ ਪਾਓ। ਪਹਿਲੀ ਸਿੰਚਾਈ ਤੋਂ ਬਾਅਦ 35 ਕਿਲੋ ਯੂਰੀਆ ਦਿਓ।'
  },
  disease: {
    en: 'For leaf spots or yellowing: Spray Propiconazole 25% EC (1 ml per liter of water) or Neem Oil 10,000 ppm (3 ml/L) for organic control. Avoid water stagnation in the field to prevent root rot.',
    ta: 'இலைப்புள்ளி மற்றும் மஞ்சள் நோய்க்கு: ஒரு லிட்டர் தண்ணீரில் 1 மிலி புரோபிகோனசோல் அல்லது 3 மிலி வேப்பெண்ணெய் கரைத்து தெளிக்கவும். வயலில் நீர் தேங்காமல் பார்த்துக் கொள்ளுங்கள்.',
    te: 'ఆకుమచ్చ లేదా పసుపు తెగులు నివారణకు: లీటరు నీటికి 1 మి.లీ ప్రొపికొనజోల్ లేదా 3 మి.లీ వేప నూనె కలిపి పిచికారీ చేయండి. మడిలో నీరు నిల్వ ఉండకుండా చూడండి.',
    hi: 'पत्तियों के धब्बों या पीलेपन के लिए: 1 मिली प्रोपिकोनाज़ोल प्रति लीटर पानी या 3 मिली नीम तेल मिलाकर छिड़कें। खेत में जलभराव न होने दें।',
    kn: 'ಎಲೆ ಚುಕ್ಕೆ ಅಥವಾ ಹಳದಿ ರೋಗಕ್ಕೆ: ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 1 ಮಿಲಿ ಪ್ರೊಪಿಕೊನಾಜೋಲ್ ಅಥವಾ 3 ಮಿಲಿ ಬೇವಿನ ಎಣ್ಣೆ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ.',
    ml: 'ഇലപ്പുള്ളി രോഗത്തിന്: ഒരു ലിറ്റർ വെള്ളത്തിൽ 1 മില്ലി പ്രൊപികൊണസോൾ അല്ലെങ്കിൽ 3 മില്ലി വേപ്പെണ്ണ കലക്കി തളിക്കുക.',
    mr: 'पानावरील डागांसाठी: प्रति लिटर पाण्यात १ मिली प्रोपिकोनाझोल किंवा ३ मिली कडुनिंबाचे तेल मिसळून फवारणी करा.',
    bn: 'পাতার দাগ বা হলুদ রোগের জন্য: প্রতি লিটার জলে ১ মিলি প্রোপিকোনাজল বা ৩ মিলি নিম তেল গুলে স্প্রে করুন।',
    gu: 'પાનના ટપકા કે પીળાશ માટે: ૧ લિટર પાણીમાં ૧ મિલી પ્રોપિકોનાઝોલ અથવા ૩ મિલી લીમડાનું તેલ ભેળવી છંટકાવ કરો.',
    pa: 'ਪੱਤਿਆਂ ਦੇ ਧੱਬਿਆਂ ਜਾਂ ਪੀਲੇਪਣ ਲਈ: 1 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ 1 ਮਿਲੀਲਿਟਰ ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ ਜਾਂ 3 ਮਿਲੀਲਿਟਰ ਨਿੰਮ ਦਾ ਤੇਲ ਮਿਲਾ ਕੇ ਛਿੜਕਾਅ ਕਰੋ।'
  },
  water: {
    en: 'Irrigation recommendation: Schedule light watering during early morning hours (6:00 AM - 8:30 AM) to minimize evaporation loss. Maintain 2-3 cm standing water for paddy during tillering phase.',
    ta: 'பாசன ஆலோசனை: அதிகாலை 6:00 முதல் 8:30 மணிக்குள் பாசனம் செய்வது நீர் ஆவியாவதைத் தடுக்கும். நெல் பயிரின் தூர்கட்டும் பருவத்தில் 2-3 செ.மீ நீர் இருக்குமாறு பராமரிக்கவும்.',
    te: 'నీటిపారుదల సలహా: ఉదయం 6:00 నుండి 8:30 గంటల మధ్య నీరు పెట్టడం వలన ఆవిరి కావడం తగ్గుతుంది. పిలకల దశలో 2-3 సెం.మీ నీటిని ఉంచండి.',
    hi: 'सिंचाई सलाह: वाष्पीकरण से बचने के लिए सुबह 6:00 से 8:30 बजे के बीच सिंचाई करें। कल्ले फूटते समय धान में 2-3 सेमी पानी बनाए रखें।',
    kn: 'ನೀರಾವರಿ ಸಲಹೆ: ಬೆಳಿಗ್ಗೆ 6:00 ರಿಂದ 8:30 ರ ನಡುವೆ ನೀರು ನೀಡಿ. ಭತ್ತದ ಕವಲು ಒಡೆಯುವ ಹಂತದಲ್ಲಿ 2-3 ಸೆಂ.ಮೀ ನೀರನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಿ.',
    ml: 'നനയ്ക്കൽ ഉപദേശം: രാവിലെ 6:00 മുതൽ 8:30 വരെയുള്ള സമയത്ത് നനയ്ക്കുക. നെല്ലിൽ 2-3 സെ.മീ വെള്ളം നിലനിർത്തുക.',
    mr: 'सिंचन सल्ला: सकाळी ६:०० ते ८:३० दरम्यान पाणी द्या. भात पिकात फुटवे फुटताना २-३ सेंमी पाणी ठेवा.',
    bn: 'সেচ পরামর্শ: সকাল ৬:০০ থেকে ৮:৩০ এর মধ্যে সেচ দিন। ধানের শিষ আসার সময় ২-৩ সেমি জল ধরে রাখুন।',
    gu: 'પિયત સલાહ: સવારે ૬:૦૦ થી ૮:૩૦ વચ્ચે પિયત આપો જેથી પાણીનો બગાડ ઓછો થાય.',
    pa: 'ਸਿੰਚਾਈ ਸਲਾਹ: ਸਵੇਰੇ 6:00 ਤੋਂ 8:30 ਵਜੇ ਵਿਚਕਾਰ ਪਾਣੀ ਲਗਾਓ।'
  }
};

class AssistantController {
  /**
   * POST /api/assistant/chat
   */
  async chat(req, res, next) {
    try {
      const { message, language = 'en', farmerContext, coords } = req.body;

      if (!message || !message.trim()) {
        return errorResponse(res, 'Message is required', 'MISSING_MESSAGE', 400);
      }

      // 1. Detect regional Indian script from text
      let scriptLang = null;
      if (/[\u0B80-\u0BFF]/.test(message)) scriptLang = 'ta'; // Tamil
      else if (/[\u0C00-\u0C7F]/.test(message)) scriptLang = 'te'; // Telugu
      else if (/[\u0D00-\u0D7F]/.test(message)) scriptLang = 'ml'; // Malayalam
      else if (/[\u0C80-\u0CFF]/.test(message)) scriptLang = 'kn'; // Kannada
      else if (/[\u0A80-\u0AFF]/.test(message)) scriptLang = 'gu'; // Gujarati
      else if (/[\u0A00-\u0A7F]/.test(message)) scriptLang = 'pa'; // Punjabi
      else if (/[\u0B00-\u0B7F]/.test(message)) scriptLang = 'or'; // Odia
      else if (/[\u0980-\u09FF]/.test(message)) scriptLang = 'bn'; // Bengali
      else if (/[\u0900-\u097F]/.test(message)) scriptLang = 'hi'; // Hindi / Marathi

      // 2. Language Determination:
      // - If regional script is in message, ALWAYS respect the script language.
      // - If message is English/Latin script:
      //     - If user explicitly selected a regional language from selector (e.g. Tamil or Telugu or Hindi or Malayalam or Kannada), use that selected language.
      //     - Otherwise use 'en' (English).
      let langCode = 'en';
      if (scriptLang) {
        langCode = scriptLang;
      } else if (language && language !== 'en') {
        langCode = language.toLowerCase().slice(0, 2);
      } else {
        langCode = 'en';
      }

      const targetLangName = LANGUAGE_NAMES[langCode] || 'English';

      const userLocation =
        req.user?.district && req.user?.state
          ? `${req.user.district}, ${req.user.state}`
          : farmerContext?.location || 'Thanjavur, Tamil Nadu';

      // 1. Fetch LIVE weather observations (using GPS coordinates if provided)
      let liveWeather = null;
      let weatherSummary = farmerContext?.weather_summary || '30°C, Partly Cloudy, 10% Rain Risk';
      try {
        liveWeather = await weatherService.getCurrentWeather(userLocation, coords?.lat, coords?.lon);
        if (liveWeather) {
          weatherSummary = `${liveWeather.temperature}°C (Feels like ${liveWeather.feelsLike}°C), ${liveWeather.condition}, Humidity: ${liveWeather.humidity}%, Wind: ${liveWeather.windSpeed}, Rain Chance: ${liveWeather.rainProbability}%, Rainfall: ${liveWeather.rainfall}mm, Spray: ${liveWeather.sprayAdvisory}`;
        }
      } catch (wErr) {
        console.warn('[AssistantController] Live weather lookup fallback:', wErr.message);
      }

      // 2. Fetch LIVE Market Price if message relates to commodity / mandi rates
      let matchedCropPrice = null;
      try {
        matchedCropPrice = await marketPriceService.getLatestPriceForCrop(message, userLocation);
      } catch (mErr) {
        console.warn('[AssistantController] Market price lookup error:', mErr.message);
      }

      let marketContextSummary = 'Official AGMARKNET Mandi Price Database available.';
      if (matchedCropPrice) {
        marketContextSummary = `OFFICIAL LIVE APMC MANDI RATE:
- Commodity: ${matchedCropPrice.commodity} (${matchedCropPrice.variety})
- Market: ${matchedCropPrice.market} (${matchedCropPrice.district}, ${matchedCropPrice.state})
- Modal Price: ₹${matchedCropPrice.modalPrice} / Quintal (₹${matchedCropPrice.pricePerKg} / kg)
- Min Price: ₹${matchedCropPrice.minPrice} / Quintal, Max Price: ₹${matchedCropPrice.maxPrice} / Quintal
- Data Date: ${matchedCropPrice.arrivalDate} (${matchedCropPrice.isToday ? "Today's Price" : 'Latest Available Market Record'})
- Source: AGMARKNET (Directorate of Marketing & Inspection, Govt of India)`;
      }

      // Build context
      const context = {
        location: liveWeather?.location || userLocation,
        current_crop: req.user?.farmerProfile?.currentCrops || farmerContext?.current_crop || 'Paddy (Rice)',
        soil_type: req.user?.farmerProfile?.soilType || farmerContext?.soil_type || 'Alluvial Soil',
        farm_size: req.user?.farmerProfile?.farmSize || farmerContext?.farm_size || 5.0,
        weather_summary: weatherSummary,
        market_summary: marketContextSummary,
        live_weather: liveWeather,
        matched_crop_price: matchedCropPrice
      };

      let reply = '';
      let suggestedActions = ['Live Mandi Rates', 'Live Weather', 'Crop Health', 'Fertilizer Guide'];

      // 1. Try Groq AI (Ultra-fast inference)
      if (env.GROQ_API_KEY) {
        try {
          const systemPrompt = `You are AGRIMIND Kisan AI, an expert agricultural advisor for Indian farmers, customers, and agribusinesses.

Real-Time Farm Context:
- Location: ${context.location}
- Crop: ${context.current_crop}
- Soil: ${context.soil_type}
- Farm Size: ${context.farm_size} Acres
- LIVE REAL-TIME WEATHER: ${context.weather_summary}
- OFFICIAL MANDI MARKET DATA: ${context.market_summary}

CRITICAL LANGUAGE & ACCURACY RULES:
1. Respond ONLY and EXCLUSIVELY in ${targetLangName} (Language code: ${langCode}).
2. Do not translate the response into English unless the user explicitly requested English (langCode === 'en').
3. Do not mix languages unless the user used mixed languages in their query.
4. If the user asks about crop prices, tomato price, mandi rates, etc., ALWAYS use the EXACT figures provided in OFFICIAL MANDI MARKET DATA (e.g. ₹${matchedCropPrice?.modalPrice || 3200}/quintal, ₹${matchedCropPrice?.pricePerKg || 32}/kg). NEVER invent or change prices. Always state the market name and the arrival date.
5. If the user asks about today's weather or rain, accurately report the LIVE REAL-TIME WEATHER data provided in the context.
6. Preserve technical names, crop names, and numerical values correctly.
7. Keep the tone warm, clear, and conversational so it sounds natural when spoken aloud by a voice assistant (2-4 concise sentences).`;

          const groqResponse = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
              model: 'openai/gpt-oss-120b',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
              ],
              temperature: 0.4,
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

Real-Time Farm Context:
- Location: ${context.location}
- Main Crop: ${context.current_crop}
- Soil: ${context.soil_type}
- Farm Size: ${context.farm_size} Acres
- LIVE REAL-TIME WEATHER: ${context.weather_summary}
- OFFICIAL MANDI MARKET DATA: ${context.market_summary}

Farmer Question: "${message}"

CRITICAL INSTRUCTIONS:
1. Respond ONLY and EXCLUSIVELY in ${targetLangName} (Language code: ${langCode}).
2. Do not translate the response into English unless the user explicitly requested English (langCode === 'en').
3. If the user asks about crop / mandi prices, strictly use the OFFICIAL MANDI MARKET DATA figures. NEVER invent or fabricate prices. Explicitly mention the mandi name and date.
4. If the user asks about the weather, accurately report the LIVE REAL-TIME WEATHER observations.
5. Preserve all prices and numbers accurately.
6. Keep the tone warm, respectful, and encouraging (3-4 concise sentences).
`.trim();

          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;
          const aiResponse = await axios.post(
            geminiUrl,
            {
              contents: [{ parts: [{ text: geminiPrompt }] }],
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 500
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

      // 3. Resilient Official Meteorological & Mandi Response Fallback if AI APIs are offline
      if (!reply) {
        const lower = message.toLowerCase();

        // Check if market price inquiry
        const isPriceQuery =
          lower.includes('price') || lower.includes('rate') || lower.includes('mandi') || lower.includes('cost') || lower.includes('sell') ||
          lower.includes('விலை') || lower.includes('சந்தை') || lower.includes('ரேட்') || lower.includes('எவ்வளவு') ||
          lower.includes('ధర') || lower.includes('మార్కెట్') || lower.includes('రేటు') || lower.includes('మండి') || lower.includes('ఎంత') ||
          lower.includes('भाव') || lower.includes('दाम') || lower.includes('मंडी') || lower.includes('रेट') || lower.includes('कितना') ||
          lower.includes('ಬೆಲೆ') || lower.includes('ದರ') || lower.includes('ಮಾರುಕಟ್ಟೆ') || lower.includes('ರೇಟು') || lower.includes('ಎಷ್ಟು') ||
          lower.includes('വില') || lower.includes('വിപണി') || lower.includes('നിരക്ക്') || lower.includes('എത്ര') ||
          lower.includes('দর') || lower.includes('দাম') || lower.includes('বাজার') || lower.includes('মান্ডি') ||
          lower.includes('ભાવ') || lower.includes('કિંમત') || lower.includes('યાર્ડ') ||
          lower.includes('ਭਾਅ') || lower.includes('ਮੰਡੀ') || lower.includes('ਰੇਟ');

        if (isPriceQuery && matchedCropPrice) {
          const p = matchedCropPrice;
          const LIVE_PRICE_REPLIES = {
            ta: `📍 ${p.market} (${p.state}) சந்தை நிலவரப்படி (${p.arrivalDate}): ${p.commodity} மாதிரியளவு விலை குவிண்டாலுக்கு ₹${p.modalPrice} (ஒரு கிலோ ₹${p.pricePerKg}). குறைந்தபட்ச விலை ₹${p.minPrice}, அதிகபட்ச விலை ₹${p.maxPrice}.`,
            te: `📍 ${p.market} (${p.state}) మార్కెట్ ప్రకారం (${p.arrivalDate}): ${p.commodity} సగటు ధర క్వింటాలుకు ₹${p.modalPrice} (కిలో ₹${p.pricePerKg}). కనిష్ట ధర ₹${p.minPrice}, గరిష్ట ధర ₹${p.maxPrice}.`,
            hi: `📍 ${p.market} (${p.state}) के आधिकारिक एगमार्कनेट आंकड़ों के अनुसार (${p.arrivalDate}): ${p.commodity} का मॉडल भाव ₹${p.modalPrice}/क्विंटल (₹${p.pricePerKg}/किलो) है। न्यूनतम भाव ₹${p.minPrice} और अधिकतम भाव ₹${p.maxPrice} रहा।`,
            kn: `📍 ${p.market} (${p.state}) ಮಾರುಕಟ್ಟೆ ದರ (${p.arrivalDate}): ${p.commodity} ಸರಾಸರಿ ಬೆಲೆ ಕ್ವಿಂಟಾಲ್‌ಗೆ ₹${p.modalPrice} (ಪ್ರತಿ ಕೆಜಿಗೆ ₹${p.pricePerKg}). ಕನಿಷ್ಠ ₹${p.minPrice}, ಗರಿಷ್ಠ ₹${p.maxPrice}.`,
            ml: `📍 ${p.market} (${p.state}) വിപണി നിരക്ക് (${p.arrivalDate}): ${p.commodity} ശരാശരി വില ക്വിന്റലിന് ₹${p.modalPrice} (കിലോയ്ക്ക് ₹${p.pricePerKg}). കുറഞ്ഞ വില ₹${p.minPrice}, കൂടിയ വില ₹${p.maxPrice}.`,
            mr: `📍 ${p.market} (${p.state}) बाजारभाव (${p.arrivalDate}): ${p.commodity} चा सरासरी भाव ₹${p.modalPrice}/क्विंटल (₹${p.pricePerKg}/किलो) आहे. किमान भाव ₹${p.minPrice}, कमाल भाव ₹${p.maxPrice}.`,
            bn: `📍 ${p.market} (${p.state}) মান্ডি দর (${p.arrivalDate}): ${p.commodity} গড় দর কুইন্টাল প্রতি ₹${p.modalPrice} (প্রতি কেজি ₹${p.pricePerKg})। সর্বনিম্ন ₹${p.minPrice}, সর্বোচ্চ ₹${p.maxPrice}।`,
            gu: `📍 ${p.market} (${p.state}) માર્કેટ યાર્ડ ભાવ (${p.arrivalDate}): ${p.commodity} નો મોડલ ભાવ ક્વિન્ટલ દીઠ ₹${p.modalPrice} (કિલો દીઠ ₹${p.pricePerKg}) છે. લઘુત્તમ ₹${p.minPrice}, મહત્તમ ₹${p.maxPrice}.`,
            pa: `📍 ${p.market} (${p.state}) ਮੰਡੀ ਭਾਅ (${p.arrivalDate}): ${p.commodity} ਦਾ ਮਾਡਲ ਭਾਅ ₹${p.modalPrice}/ਕੁਇੰਟਲ (₹${p.pricePerKg}/ਕਿਲੋ) ਹੈ। ਘੱਟੋ-ਘੱਟ ₹${p.minPrice}, ਵੱਧ ਤੋਂ ਵੱਧ ₹${p.maxPrice}।`,
            en: `📍 Official AGMARKNET rate for ${p.commodity} at ${p.market} (${p.state}) as of ${p.arrivalDate}: Modal price is ₹${p.modalPrice}/Quintal (₹${p.pricePerKg}/kg) with Min ₹${p.minPrice} and Max ₹${p.maxPrice}.`
          };

          reply = LIVE_PRICE_REPLIES[langCode] || LIVE_PRICE_REPLIES.en;
        } else {
          // Check weather inquiry
          const isWeatherQuery =
            lower.includes('weather') || lower.includes('rain') || lower.includes('temperature') || lower.includes('forecast') ||
            lower.includes('வானிலை') || lower.includes('மழை') || lower.includes('வெப்பநிலை') ||
            lower.includes('వాతావరణం') || lower.includes('వర్షం') || lower.includes('ఉష్ణోగ్రత') ||
            lower.includes('मौसम') || lower.includes('बारिश') || lower.includes('तापमान') ||
            lower.includes('हवामान') || lower.includes('पाऊस') || lower.includes('तापमान') ||
            lower.includes('ಹವಾಮಾನ') || lower.includes('ಮಳೆ') || lower.includes('ತಾಪಮಾನ') ||
            lower.includes('കാലാവസ്ഥ') || lower.includes('മഴ') || lower.includes('താപനില') ||
            lower.includes('আবহাওয়া') || lower.includes('বৃষ্টি') || lower.includes('তাপমাত্রা') ||
            lower.includes('હવામાન') || lower.includes('વરસાદ') || lower.includes('તાપમાન') ||
            lower.includes('ਮੌਸਮ') || lower.includes('ਮੀਂਹ') || lower.includes('ਤਾਪਮਾਨ');

          if (isWeatherQuery && liveWeather) {
            const temp = liveWeather.temperature;
            const cond = liveWeather.condition;
            const rain = liveWeather.rainProbability;
            const wind = liveWeather.windSpeed;
            const loc = liveWeather.location;
            const spray = liveWeather.sprayAdvisory;

            const LIVE_WEATHER_REPLIES = {
              ta: `📍 ${loc} நேரலை வானிலை நிலவரம்: தற்போதைய வெப்பநிலை ${temp}°C, வானிலை ${cond}. மழை வாய்ப்பு ${rain}% மற்றும் காற்றின் வேகம் ${wind}. ஆலோசனை: ${spray}.`,
              te: `📍 ${loc} ప్రత్యక్ష వాతావరణం: ప్రస్తుత ఉష్ణోగ్రత ${temp}°C, పరిస్థితి ${cond}. వర్ష సూచన ${rain}% మరియు గాలి వేగం ${wind}. సలహా: ${spray}.`,
              hi: `📍 ${loc} का लाइव मौसम: वर्तमान तापमान ${temp}°C है, मौसम ${cond} बना हुआ है। बारिश की संभावना ${rain}% और हवा की गति ${wind} है। सलाह: ${spray}.`,
              kn: `📍 ${loc} ಲೈವ್ ಹವಾಮಾನ: ಪ್ರಸ್ತುತ ತಾಪಮಾನ ${temp}°C, ಸ್ಥಿತಿ ${cond}. ಮಳೆಯ ಸಾಧ್ಯತೆ ${rain}% ಮತ್ತು ಗಾಳಿಯ ವೇಗ ${wind}. ಸಲಹೆ: ${spray}.`,
              ml: `📍 ${loc} തത്സമയ കാലാവസ്ഥ: ഇപ്പോഴത്തെ താപനില ${temp}°C, കാലാവസ്ഥ ${cond}. മഴ സാധ്യത ${rain}%, കാറ്റിന്റെ വേഗത ${wind}. നിർദ്ദേശം: ${spray}.`,
              mr: `📍 ${loc} थेट हवामान: सध्याचे तापमान ${temp}°C, स्थिती ${cond}. पावसाची शक्यता ${rain}% आणि वाऱ्याचा वेग ${wind}. सल्ला: ${spray}.`,
              bn: `📍 ${loc} লাইভ আবহাওয়া: বর্তমান তাপমাত্রা ${temp}°C, অবস্থা ${cond}। বৃষ্টির সম্ভাবনা ${rain}% এবং বাতাসের গতি ${wind}। পরামর্শ: ${spray}।`,
              gu: `📍 ${loc} લાઈવ હવામાન: હાલનું તાપમાન ${temp}°C છે, હવામાન ${cond} છે. વરસાદની શક્યતા ${rain}% અને પવનની ગતિ ${wind} છે. સલાહ: ${spray}.`,
              pa: `📍 ${loc} ਲਾਈਵ ਮੌਸਮ: ਮੌਜੂਦਾ ਤਾਪਮਾਨ ${temp}°C ਹੈ, ਮੌਸਮ ${cond} ਹੈ। ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ${rain}% ਅਤੇ ਹਵਾ ਦੀ ਰਫ਼ਤਾਰ ${wind} ਹੈ। ਸਲਾਹ: ${spray}.`,
              en: `📍 Live Weather for ${loc}: The current temperature is ${temp}°C (${cond}) with ${rain}% rain risk and ${wind} winds. Agricultural spray advisory: ${spray}.`
            };

            reply = LIVE_WEATHER_REPLIES[langCode] || LIVE_WEATHER_REPLIES.en;
          } else {
            let topic = 'fertilizer';
            if (
              lower.includes('water') || lower.includes('irrigation') ||
              lower.includes('தண்ணீர்') || lower.includes('பாசனம்') ||
              lower.includes('నీరు') || lower.includes('నీటిపారుదల') ||
              lower.includes('വെള്ളം') || lower.includes('നനയ്ക്കൽ') ||
              lower.includes('ನೀರು') || lower.includes('ನೀರಾವರಿ') ||
              lower.includes('પાણી') || lower.includes('પિયત') ||
              lower.includes('ਪਾਣੀ') || lower.includes('ਸਿੰਚਾਈ') ||
              lower.includes('पानी') || lower.includes('सिंचाई')
            ) {
              topic = 'water';
            } else if (
              lower.includes('disease') || lower.includes('yellow') || lower.includes('pest') || lower.includes('spot') ||
              lower.includes('நோய்') || lower.includes('மஞ்சள்') || lower.includes('பூச்சி') ||
              lower.includes('తెగులు') || lower.includes('పురుగు') ||
              lower.includes('രോഗം') || lower.includes('കീടം') ||
              lower.includes('ರೋಗ') || lower.includes('ಕೀಟ') ||
              lower.includes('રોગ') || lower.includes('જીવાત') ||
              lower.includes('ਰੋਗ') || lower.includes('ਕੀੜਾ') ||
              lower.includes('रोग') || lower.includes('कीड़ा')
            ) {
              topic = 'disease';
            }

            const advisoryMap = NATIVE_ADVISORY[topic] || NATIVE_ADVISORY.fertilizer;
            reply = advisoryMap[langCode] || advisoryMap.en;
          }
        }
      }

      // 4. Save conversation log if database is connected
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
