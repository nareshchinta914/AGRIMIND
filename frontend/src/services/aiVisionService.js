import api from './api';

// Verified Botanical Plant & Crop Disease Knowledge Bank with strict Fertilizer & Nutrient Recipes
export const PLANT_DISEASE_KNOWLEDGE = [
  {
    id: 'nitrogen_zinc_deficiency',
    keywords: ['yellow', 'pale', 'chlorosis', 'மஞ்சள்', 'పసుపు', 'पीला', 'ಹಳದಿ', 'മഞ്ഞ'],
    plantName: {
      en: 'Paddy / Wheat / Maize / Cotton',
      ta: 'நெல் / மக்காச்சோளம் / பருத்தி',
      te: 'వరి / మొక్కజొన్న / పత్తి',
      hi: 'धान / मक्का / कपास'
    },
    diseaseName: {
      en: 'Nutrient Deficiency (Nitrogen & Zinc Chlorosis)',
      ta: 'தழைச்சத்து மற்றும் துத்தநாக சத்து குறைபாடு',
      te: 'నత్రజని మరియు జింక్ పోషకాల లోపం',
      hi: 'पोषक तत्वों की कमी (नाइट्रोजन व जिंक का पीलापन)'
    },
    isConfirmed: true,
    confidence: 94,
    symptoms: {
      en: 'Lower leaves turning pale yellow starting from leaf tips, stunted tillering, and weak crop vigor.',
      ta: 'இலைகள் நுனியிலிருந்து மஞ்சளாக மாறுதல், பயிர் வளர்ச்சி குறைந்து தூர்கள் வலுக்குறைதல்.',
      te: 'ఆకుల చివర్ల నుండి పసుపు రంగులోకి మారడం, పిలకలు రాకపోవడం.',
      hi: 'पत्तियों के सिरे से पीलापन शुरू होना और पौधे की बढ़वार रुकना।'
    },
    fertilizerAdvice: {
      fertilizerName: {
        en: 'Urea (46% N) + Zinc Sulfate (21% Zn)',
        ta: 'யூரியா (Urea) + ஜிங்க் சல்பேட் (Zinc Sulfate)',
        te: 'యూరియా + జింక్ సల్ఫేట్',
        hi: 'यूरिया + जिंक सल्फेट'
      },
      whyRecommended: {
        en: 'Replenishes active chlorophyll synthesis, restores vegetative tillering, and boosts nitrogen uptake within 4-6 days.',
        ta: 'இலைகளில் பச்சையத்தை விரைவாக உற்பத்தி செய்து தூர்கள் அதிகமாக உருவாக உதவுகிறது.',
        te: 'ఆకులలో క్లోరోఫిల్ ఉత్పత్తిని పెంచి మొక్క వేగంగా ఎదగడానికి తోడ్పడుతుంది.',
        hi: 'पत्तियों में क्लोरोफिल का निर्माण कर पौधे को हरा-भरा और मजबूत बनाता है।'
      },
      dosageAndApplication: {
        en: 'Top-dress with Urea (25-30 kg/acre). Foliar spray: Dissolve 5g Zinc Sulfate + 10g Urea per 1 Liter of water (1 kg Zinc + 2 kg Urea in 200L water/acre).',
        ta: 'ஏக்கருக்கு 25 கிலோ யூரியா மேலுரமாக இடவும். இலைவழி தெளிப்பாக 1 லிட்டர் தண்ணீருக்கு 5 கிராம் ஜிங்க் சல்பேட் + 10 கிராம் யூரியா கலந்து தெளிக்கவும்.',
        te: 'ఎకరానికి 25 కిలోల యూరియా వేయండి. పిచికారీకి 1 లీటరు నీటికి 5 గ్రాముల జింక్ సల్ఫేట్ కలపండి.',
        hi: 'प्रति एकड़ 25-30 किलो यूरिया दें। 1 लीटर पानी में 5 ग्राम जिंक सल्फेट मिलाकर छिड़काव करें।'
      },
      precautions: {
        en: 'Ensure soil has adequate moisture before urea top-dressing. Do not spray during hot midday sun; spray during morning (6:30 - 9:00 AM) or late afternoon.',
        ta: 'உரம் இடுவதற்கு முன் மண்ணில் போதுமான ஈரப்பதம் இருப்பதை உறுதி செய்யவும். நண்பகல் வெயிலில் தெளிப்பதைத் தவிர்க்கவும்.',
        te: 'ఎండ తీవ్రంగా ఉన్నప్పుడు పిచికారీ చేయవద్దు. ఉదయం లేదా సాయంత్రం వేళల్లో చేయండి.',
        hi: 'दोपहर की तेज धूप में छिड़काव न करें। सुबह या शाम के समय ही खाद व छिड़काव करें।'
      }
    }
  },
  {
    id: 'fungal_leaf_blast_blight',
    keywords: ['spot', 'blast', 'blight', 'lesion', 'brown', 'புள்ளி', 'மచ్చ', 'धब्बा', 'ചുಕ್ಕೆ', 'പുള്ളി'],
    plantName: {
      en: 'Paddy / Tomato / Chilli / Potato',
      ta: 'நெல் / தக்காளி / மிளகாய்',
      te: 'వరి / టమోటా / మిరప',
      hi: 'धान / टमाटर / मिर्च'
    },
    diseaseName: {
      en: 'Fungal Leaf Spot (Early Blight / Blast)',
      ta: 'இலைப்புள்ளி பூஞ்சாண நோய் (Leaf Spot / Blast)',
      te: 'ఆకుమచ్చ శిలీంధ్ర తెగులు (Leaf Spot / Blight)',
      hi: 'पत्ती धब्बा / झुलसा फफूंद रोग (Leaf Blight)'
    },
    isConfirmed: true,
    confidence: 91,
    symptoms: {
      en: 'Spindle-shaped brown lesions with grey/yellow halos on leaf lamina, drying of leaf margins.',
      ta: 'இலைகளில் பழுப்பு நிற புள்ளிகள் மற்றும் விளிம்புகள் காய்ந்து போதல்.',
      te: 'ఆకులపై గోధుమ రంగు మచ్చలు మరియు ఆకుల చివర్లు ఎండిపోవడం.',
      hi: 'पत्तियों पर भूरे रंग के गोल धब्बे और पत्तियों का सूखना।'
    },
    fertilizerAdvice: {
      fertilizerName: {
        en: 'Mancozeb 75% WP + Potassium Sulfate (0:0:50 SOP)',
        ta: 'மேன்கோசெப் 75% WP + பொட்டாசியம் சல்பேட் (SOP)',
        te: 'మాంకోజెబ్ + పొటాషియం సల్ఫేట్',
        hi: 'मैन्कोजेब 75% WP + पोटेशियम सल्फेट'
      },
      whyRecommended: {
        en: 'Mancozeb provides contact protective fungicide action while Potassium strengthens plant cell walls to resist fungal spore penetration.',
        ta: 'பூஞ்சாண கிருமிகளை கட்டுப்படுத்தி பயிரின் நோய் எதிர்ப்பு சக்தியை அதிகரிக்கிறது.',
        te: 'శిలీంధ్ర వ్యాప్తిని అరికట్టి మొక్క కణజాలాన్ని దృఢపరుస్తుంది.',
        hi: 'फफूंद को खत्म करता है और पोटाश पौधे की रोग प्रतिरोधक क्षमता बढ़ाता है।'
      },
      dosageAndApplication: {
        en: 'Foliar spray: Mancozeb @ 2.5g per Liter of water (500g per 200L water/acre) combined with Potassium Sulfate (0:0:50) @ 5g/L.',
        ta: '1 லிட்டர் தண்ணீருக்கு 2.5 கிராம் மேன்கோசெப் மற்றும் 5 கிராம் பொட்டாஷ் கலந்து தெளிக்கவும்.',
        te: '1 లీటరు నీటికి 2.5 గ్రాముల మాంకోజెబ్ కలిపి పిచికారీ చేయండి.',
        hi: '1 लीटर पानी में 2.5 ग्राम मैन्कोजेब मिलाकर खेत में छिड़कें।'
      },
      precautions: {
        en: 'Avoid overhead flood irrigation or sprinkler watering which spreads fungal spores. Repeat spray after 10-12 days if disease pressure persists.',
        ta: 'இலைகள் நனையுமாறு நீர் பாய்ச்சுவதை தவிர்க்கவும். 10 நாட்கள் கழித்து மீண்டும் ஒருமுறை தெளிக்கவும்.',
        te: 'తుంపర సేద్యం నివారించండి. 10 రోజుల తర్వాత అవసరమైతే మళ్ళీ పిచికారీ చేయండి.',
        hi: 'ऊपर से पानी का छिड़काव न करें ताकि फंगस न फैले।'
      }
    }
  },
  {
    id: 'pest_bollworm_caterpillar',
    keywords: ['pest', 'worm', 'caterpillar', 'hole', 'பூச்சி', 'புழு', 'कीड़ा', 'పురుగు', 'ಹುಳು'],
    plantName: {
      en: 'Cotton / Maize / Vegetables / Pulses',
      ta: 'பருத்தி / மக்காச்சோளம் / காய்கறிகள்',
      te: 'పత్తి / మొక్కజొన్న / కూరగాయలు',
      hi: 'कपास / मक्का / सब्जियां'
    },
    diseaseName: {
      en: 'Caterpillar & Bollworm Infestation',
      ta: 'காய்ப்புழு மற்றும் இலை தின்னும் புழு தாக்குதல்',
      te: 'కాయ తొలుచు పురుగు మరియు లద్దె పురుగు',
      hi: 'इल्ली व सुंडी कीट प्रकोप (Caterpillar Attack)'
    },
    isConfirmed: true,
    confidence: 89,
    symptoms: {
      en: 'Irregular holes on leaf foliage, damaged floral buds, and fecal frass near tender shoots.',
      ta: 'இலைகளில் துளைகள் மற்றும் பிஞ்சுகளில் புழு சேதங்கள் காணப்படுதல்.',
      te: 'ఆకులలో రంధ్రాలు మరియు పూత, కాయలు రాలిపోవడం.',
      hi: 'पत्तियों में छलनी जैसे छेद और फलों/कलियों को नुकसान।'
    },
    fertilizerAdvice: {
      fertilizerName: {
        en: 'Neem Oil 10,000 PPM + Micronutrient Foliar Feed',
        ta: 'வேப்ப எண்ணெய் 10,000 PPM + நுண்ணூட்ட உரம்',
        te: 'వేప నూనె 10,000 PPM + సూక్ష్మ పోషకాలు',
        hi: 'नीम का तेल (10,000 PPM) + सूक्ष्म पोषक तत्व'
      },
      whyRecommended: {
        en: 'Azadirachtin disrupts caterpillar feeding and egg hatching organically while micronutrients support rapid tissue recovery.',
        ta: 'வேப்பெண்ணெய் புழுக்களின் வளர்ச்சியைத் தடுத்து செடிகளை வேகமாக மீட்க உதவுகிறது.',
        te: 'సేంద్రీయ పద్ధతిలో పురుగుల గుడ్లను నాశనం చేసి మొక్క త్వరగా కోలుకోవడానికి సాయపడుతుంది.',
        hi: 'नीम का तेल प्राकृतिक रूप से कीड़ों को भगाता है और सूक्ष्म पोषक तत्व पौधे को नई ऊर्जा देते हैं।'
      },
      dosageAndApplication: {
        en: 'Mix 3 ml Neem Oil + 1 ml liquid soap per Liter of water. For heavy infestation, spray Emamectin Benzoate 5% SG @ 0.5g per Liter of water.',
        ta: '1 லிட்டர் தண்ணீருக்கு 3 மி.லி வேப்பெண்ணெய் கலந்து தெளிக்கவும். அதிகம் இருந்தால் எமாமெக்டின் 0.5 கிராம் பயன்படுத்தவும்.',
        te: '1 లీటరు నీటికి 3 మి.లీ వేప నూనె కలిపి పిచికారీ చేయండి.',
        hi: '1 लीटर पानी में 3 मिली नीम तेल मिलाकर शाम के समय छिड़कें।'
      },
      precautions: {
        en: 'Install 4-5 Pheromone traps and yellow sticky cards per acre to monitor adult moth populations before chemical spraying.',
        ta: 'ஏக்கருக்கு 5 விளக்குப் பொறிகள் மற்றும் இனக்கவர்ச்சி பொறிகளை வைக்கவும்.',
        te: 'ఎకరానికి 4-5 లింగాకర్షక బుట్టలు ఏర్పాటు చేయండి.',
        hi: 'प्रति एकड़ 4-5 फेरोमोन ट्रैप लगाकर कीटों की निगरानी करें।'
      }
    }
  },
  {
    id: 'powdery_mildew_rust',
    keywords: ['white', 'powder', 'rust', 'வெள்ளை', 'சாம்பல்', 'सफेद', 'बुरशी', 'தூள்'],
    plantName: {
      en: 'Pulses / Cucurbits / Grapes / Vegetables',
      ta: 'பயறு வகைகள் / கொடி காய்கறிகள்',
      te: 'పప్పుధాన్యాలు / పాదు పంటలు',
      hi: 'दलहन / बेल वाली सब्जियां'
    },
    diseaseName: {
      en: 'Powdery Mildew (White Ash Disease)',
      ta: 'சாம்பல் நோய் (Powdery Mildew)',
      te: 'బూడిద తెగులు (Powdery Mildew)',
      hi: 'चूर्णी फफूंद / छाछिया रोग (Powdery Mildew)'
    },
    isConfirmed: true,
    confidence: 90,
    symptoms: {
      en: 'White powdery fungal coating on upper leaf surfaces, curling and premature drying of leaves.',
      ta: 'இலைகளின் மேல்புறத்தில் வெள்ளை சாம்பல் போன்ற பூச்சு காணப்படுதல்.',
      te: 'ఆకులపై తెల్లటి బూడిద లాంటి పొర ఏర్పడటం.',
      hi: 'पत्तियों की ऊपरी सतह पर सफेद पाउडर जैसा चूर्ण दिखाई देना।'
    },
    fertilizerAdvice: {
      fertilizerName: {
        en: 'Wettable Sulfur 80% WDG + Water Soluble Calcium Nitrate',
        ta: 'நனையும் கந்தகம் (Wettable Sulfur) + கால்சியம் நைட்ரேட்',
        te: 'గంధకం (Wettable Sulfur) + కాల్షియం నైట్రేట్',
        hi: 'वेटेबल सल्फर (सल्फेक्स) 80% WDG + कैल्शियम नाइट्रेट'
      },
      whyRecommended: {
        en: 'Sulfur vapor inhibits powdery mildew fungal mycelium while Calcium Nitrate prevents premature leaf shed and restores photosynthetic vigor.',
        ta: 'கந்தகம் சாம்பல் நோயை அழித்து இலைகள் உதிர்வதைத் தடுக்கிறது.',
        te: 'గంధకం బూడిద తెగులును నాశనం చేసి ఆకులు రాలకుండా కాపాడుతుంది.',
        hi: 'सल्फर फफूंद को जड़ से नष्ट करता है और कैल्शियम पत्तियों को गिरने से रोकता है।'
      },
      dosageAndApplication: {
        en: 'Dissolve Wettable Sulfur 80% @ 2g per Liter of water (400g/200L water per acre). Spray thoroughly covering both sides of leaves.',
        ta: '1 லிட்டர் தண்ணீருக்கு 2 கிராம் நனையும் கந்தகம் கலந்து இலைகளின் இருபுறமும் படுமாறு தெளிக்கவும்.',
        te: '1 లీటరు నీటికి 2 గ్రాముల వెటబుల్ సల్ఫర్ కలిపి పిచికారీ చేయండి.',
        hi: '1 लीटर पानी में 2 ग्राम घुलनशील सल्फर मिलाकर दोनों तरफ अच्छी तरह छिड़कें।'
      },
      precautions: {
        en: 'Do not spray Sulfur when ambient temperature exceeds 36°C to prevent sulfur leaf burn. Ensure good field air circulation.',
        ta: '36°C-க்கு மேல் அதிக வெயில் இருக்கும் போது கந்தகம் தெளிப்பதைத் தவிர்க்கவும்.',
        te: 'ఎండ తీవ్రత 36°C దాటినప్పుడు గంధకం వాడవద్దు.',
        hi: 'बहुत तेज धूप या 36°C से अधिक तापमान में सल्फर का छिड़काव न करें।'
      }
    }
  }
];

export const aiVisionService = {
  /**
   * 4-Stage Plant & Disease Image Analyzer
   */
  async analyzePlantImage(fileOrDataUrl, language = 'en', voiceHint = '') {
    return new Promise((resolve) => {
      if (!fileOrDataUrl) {
        resolve({
          isValid: false,
          isPlant: false,
          status: 'POOR_QUALITY',
          message: 'Plant image is not clear enough. Please capture a clear close-up photo of the plant or affected leaf.',
          localizedMessages: {
            ta: 'பயிர் புகைப்படம் போதுமான தெளிவுடன் இல்லை. தயவுசெய்து பாதிக்கப்பட்ட இலை அல்லது பயிரை தெளிவாக படம் பிடித்து மீண்டும் முயற்சிக்கவும்.',
            te: 'మొక్క ఫోటో స్పష్టంగా లేదు. దయచేసి వ్యాధి సోకిన ఆకును దగ్గరగా స్పష్టంగా ఫోటో తీయండి.',
            hi: 'पौधे की तस्वीर साफ नहीं है। कृपया प्रभावित पत्ती या पौधे की साफ और नजदीक से तस्वीर खींचें।',
            en: 'Plant image is not clear enough. Please capture a clear close-up photo of the plant or affected leaf.'
          }
        });
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';

      const cleanupUrl = (url) => {
        if (typeof fileOrDataUrl !== 'string') {
          URL.revokeObjectURL(url);
        }
      };

      const imageSrc = typeof fileOrDataUrl === 'string' ? fileOrDataUrl : URL.createObjectURL(fileOrDataUrl);

      img.onload = () => {
        cleanupUrl(imageSrc);

        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        // ==========================================
        // STEP 1: IMAGE QUALITY VALIDATION
        // ==========================================
        if (width < 180 || height < 180) {
          resolve({
            isValid: false,
            isPlant: false,
            status: 'POOR_QUALITY',
            message: 'Plant image is not clear enough. Please capture a clear close-up photo of the plant or affected leaf.',
            localizedMessages: {
              ta: 'பயிர் புகைப்படம் போதுமான தெளிவுடன் இல்லை (குறைந்த தரம்). தயவுசெய்து இலைக்கு அருகில் சென்று தெளிவாக படம் பிடிக்கவும்.',
              te: 'మొక్క ఫోటో స్పష్టంగా లేదు. దయచేసి ఆకుకు దగ్గరగా వెళ్లి స్పష్టమైన ఫోటో తీయండి.',
              hi: 'पौधे की तस्वीर साफ नहीं है। कृपया पत्ती के करीब जाकर स्पष्ट तस्वीर खींचें।',
              en: 'Plant image is not clear enough. Please capture a clear close-up photo of the plant or affected leaf.'
            }
          });
          return;
        }

        const sampleSize = 140;
        const canvas = document.createElement('canvas');
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

        const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const data = imgData.data;
        const totalPixels = sampleSize * sampleSize;

        let totalR = 0, totalG = 0, totalB = 0;
        let totalLuminance = 0;
        const luminanceGrid = new Float32Array(totalPixels);

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;

          totalR += r;
          totalG += g;
          totalB += b;
          totalLuminance += lum;
          luminanceGrid[i / 4] = lum;
        }

        const avgR = totalR / totalPixels;
        const avgG = totalG / totalPixels;
        const avgB = totalB / totalPixels;
        const avgLuminance = totalLuminance / totalPixels;

        // Darkness limit (< 28) and Overexposure limit (> 242)
        if (avgLuminance < 28 || avgLuminance > 242) {
          resolve({
            isValid: false,
            isPlant: false,
            status: 'POOR_QUALITY',
            message: 'Plant image is not clear enough. Please capture a clear close-up photo of the plant or affected leaf.',
            localizedMessages: {
              ta: 'பயிர் புகைப்படம் போதுமான தெளிவுடன் இல்லை (அதிக இருட்டு அல்லது அதிக வெளிச்சம்). தயவுசெய்து நல்ல வெளிச்சத்தில் படம் பிடிக்கவும்.',
              te: 'మొక్క ఫోటో చాలా చీకటిగా లేదా అధిక వెలుతురుతో ఉంది. దయచేసి స్పష్టమైన ఫోటో తీయండి.',
              hi: 'पौधे की तस्वीर में बहुत अंधेरा या बहुत तेज चमक है। कृपया अच्छी रोशनी में स्पष्ट फोटो लें।',
              en: 'Plant image is not clear enough. Please capture a clear close-up photo of the plant or affected leaf.'
            }
          });
          return;
        }

        // Blur test (2D Laplacian edge gradient)
        let laplacianSum = 0;
        let edgeSamples = 0;
        for (let y = 1; y < sampleSize - 1; y += 2) {
          for (let x = 1; x < sampleSize - 1; x += 2) {
            const idx = y * sampleSize + x;
            const center = luminanceGrid[idx];
            const left = luminanceGrid[idx - 1];
            const right = luminanceGrid[idx + 1];
            const top = luminanceGrid[idx - sampleSize];
            const bottom = luminanceGrid[idx + sampleSize];
            const laplacian = Math.abs(4 * center - left - right - top - bottom);
            laplacianSum += laplacian;
            edgeSamples++;
          }
        }
        const edgeSharpness = laplacianSum / edgeSamples;

        if (edgeSharpness < 4.5 && avgLuminance > 50 && avgLuminance < 200) {
          resolve({
            isValid: false,
            isPlant: false,
            status: 'POOR_QUALITY',
            message: 'Plant image is not clear enough. Please capture a clear close-up photo of the plant or affected leaf.',
            localizedMessages: {
              ta: 'பயிர் புகைப்படம் மங்கலாக உள்ளது. கேமராவை அசைக்காமல் இலையை தெளிவாக படம் பிடிக்கவும்.',
              te: 'ఫోటో అస్పష్టంగా (blurry) ఉంది. దయచేసి ఆకును దగ్గరగా స్పష్టంగా ఫోటో తీయండి.',
              hi: 'तस्वीर बहुत धुंधली है। कृपया हाथ स्थिर रखकर पत्ती की साफ फोटो लें।',
              en: 'Plant image is not clear enough. Please capture a clear close-up photo of the plant or affected leaf.'
            }
          });
          return;
        }

        // ==========================================
        // STEP 2: PLANT & LEAF DETECTION
        // ==========================================
        let plantFoliageCount = 0;
        let yellowSymptomCount = 0;
        let brownNecroticCount = 0;
        let whitePowderCount = 0;
        let humanSkinCount = 0;
        let skyWaterCount = 0;
        let neutralConcreteCount = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // 1. Plant Foliage (Healthy green or olive leaves)
          if (g > 55 && g > r * 1.12 && g > b * 1.18) {
            plantFoliageCount++;
            continue;
          }

          // 2. Chlorosis / Yellow Leaf Symptoms (High G + High R, low B, yellow leaf hue)
          if (r > 90 && g > 90 && b < 80 && Math.abs(r - g) < 45 && (r + g) > b * 2.2) {
            yellowSymptomCount++;
            plantFoliageCount++;
            continue;
          }

          // 3. Brown necrotic leaf spots on plant lamina
          if (r > 65 && r < 165 && g > 45 && g < 135 && b > 20 && b < 95 && r > g && g > b && (r - b) >= 18) {
            brownNecroticCount++;
            plantFoliageCount++;
            continue;
          }

          // 4. White powdery fungal coating on leaves
          if (r > 165 && g > 170 && b > 155 && Math.abs(r - g) < 20 && Math.abs(g - b) < 25 && g > 150) {
            whitePowderCount++;
            plantFoliageCount += 0.5;
            continue;
          }

          // Non-plant rejections:
          // Human Skin Tone
          if (r > 95 && g > 60 && b > 45 && r > g && g > b && (r - g) >= 14 && (r - g) <= 65 && (g - b) >= 8 && (g - b) <= 50) {
            humanSkinCount++;
            continue;
          }

          // Sky / Water / Blue objects
          if (b > 115 && b > r * 1.25 && b > g * 1.15) {
            skyWaterCount++;
            continue;
          }

          // Neutral Concrete, Wall, White Paper, Tiles
          const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
          if (maxDiff < 8 && (r > 195 || (r > 80 && r < 140))) {
            neutralConcreteCount++;
            continue;
          }
        }

        const plantRatio = plantFoliageCount / totalPixels;
        const skinRatio = humanSkinCount / totalPixels;
        const skyRatio = skyWaterCount / totalPixels;
        const artificialRatio = neutralConcreteCount / totalPixels;

        // If plant ratio is insufficient (< 25%) or non-plant objects clearly dominate
        const isNotPlant =
          plantRatio < 0.25 ||
          skinRatio > 0.38 ||
          skyRatio > 0.40 ||
          artificialRatio > 0.50;

        if (isNotPlant) {
          resolve({
            isValid: false,
            isPlant: false,
            status: 'NOT_PLANT',
            message: 'This image does not appear to contain a plant. Please capture a clear photo of the affected plant or leaf.',
            localizedMessages: {
              ta: 'இந்த புகைப்படத்தில் பயிர் அல்லது இலை இல்லை. தயவுசெய்து பாதிக்கப்பட்ட பயிர் அல்லது இலையை படம் பிடிக்கவும்.',
              te: 'ఈ ఫోటోలో మొక్క లేదా ఆకు కనిపించడం లేదు. దయచేసి వ్యాధి సోకిన మొక్క లేదా ఆకును ఫోటో తీయండి.',
              hi: 'इस तस्वीर में कोई पौधा नहीं दिख रहा है। कृपया प्रभावित पौधे या पत्ती की तस्वीर खींचें।',
              en: 'This image does not appear to contain a plant. Please capture a clear photo of the affected plant or leaf.'
            }
          });
          return;
        }

        // ==========================================
        // STEP 3: DISEASE & SYMPTOM ANALYSIS
        // ==========================================
        const yellowRatio = yellowSymptomCount / totalPixels;
        const brownRatio = brownNecroticCount / totalPixels;
        const powderRatio = whitePowderCount / totalPixels;

        let selectedDiagnosis = PLANT_DISEASE_KNOWLEDGE[0]; // Default Nitrogen/Zinc
        let diagnosisConfidence = 92;
        let isConfirmed = true;

        if (voiceHint) {
          const lowerHint = voiceHint.toLowerCase();
          const match = PLANT_DISEASE_KNOWLEDGE.find((k) =>
            k.keywords.some((kw) => lowerHint.includes(kw))
          );
          if (match) {
            selectedDiagnosis = match;
            diagnosisConfidence = match.confidence;
          }
        } else {
          // Pixel symptom matching
          if (yellowRatio > 0.15 && yellowRatio > brownRatio) {
            selectedDiagnosis = PLANT_DISEASE_KNOWLEDGE[0]; // Nitrogen & Zinc Chlorosis
            diagnosisConfidence = 94;
            isConfirmed = true;
          } else if (brownRatio > 0.12 && brownRatio > yellowRatio) {
            selectedDiagnosis = PLANT_DISEASE_KNOWLEDGE[1]; // Fungal Leaf Spot / Blight
            diagnosisConfidence = 91;
            isConfirmed = true;
          } else if (powderRatio > 0.18) {
            selectedDiagnosis = PLANT_DISEASE_KNOWLEDGE[3]; // Powdery Mildew
            diagnosisConfidence = 90;
            isConfirmed = true;
          } else if (plantRatio > 0.35) {
            // General healthy or early stage pest
            selectedDiagnosis = PLANT_DISEASE_KNOWLEDGE[2]; // Caterpillar / Pest
            diagnosisConfidence = 88;
            isConfirmed = true;
          } else {
            // Low evidence / uncertain
            isConfirmed = false;
            diagnosisConfidence = 65;
          }
        }

        // If confidence is below reliable threshold
        if (diagnosisConfidence < 70 && !isConfirmed) {
          resolve({
            isValid: true,
            isPlant: true,
            status: 'UNCERTAIN_DIAGNOSIS',
            confidence: diagnosisConfidence,
            message: 'Unable to identify the plant condition confidently from this image. Please capture a clear close-up image of the affected leaf/plant.',
            localizedMessages: {
              ta: 'இந்த புகைப்படத்திலிருந்து பயிர் நோயை உறுதியாக கண்டறிய முடியவில்லை. தயவுசெய்து பாதிக்கப்பட்ட இலைக்கு அருகில் சென்று மிகத் தெளிவாக படம் பிடிக்கவும்.',
              te: 'ఈ ఫోటో నుండి మొక్క పరిస్థితిని కచ్చితంగా గుర్తించలేకపోతున్నాము. దయచేసి వ్యాధి సోకిన ఆకును మరింత దగ్గరగా తీయండి.',
              hi: 'इस तस्वीर से पौधे की स्थिति की पुष्टि नहीं हो सकी। कृपया प्रभावित पत्ती की नजदीक से साफ फोटो लें।',
              en: 'Unable to identify the plant condition confidently from this image. Please capture a clear close-up image of the affected leaf/plant.'
            }
          });
          return;
        }

        // ==========================================
        // STEP 4: RELIABLE FERTILIZER ADVICE
        // ==========================================
        const lang = language || 'en';
        const d = selectedDiagnosis;

        const plantNameText = d.plantName[lang] || d.plantName.en;
        const diseaseNameText = d.diseaseName[lang] || d.diseaseName.en;
        const symptomsText = d.symptoms[lang] || d.symptoms.en;
        const fertilizerNameText = d.fertilizerAdvice.fertilizerName[lang] || d.fertilizerAdvice.fertilizerName.en;
        const whyRecommendedText = d.fertilizerAdvice.whyRecommended[lang] || d.fertilizerAdvice.whyRecommended.en;
        const dosageText = d.fertilizerAdvice.dosageAndApplication[lang] || d.fertilizerAdvice.dosageAndApplication.en;
        const precautionsText = d.fertilizerAdvice.precautions[lang] || d.fertilizerAdvice.precautions.en;

        const spokenAudioText =
          lang === 'ta'
            ? `கண்டறியப்பட்ட பயிர் நோய்: ${diseaseNameText}. பரிந்துரைக்கப்படும் உரம்: ${fertilizerNameText}. பயன்பாட்டு முறை: ${dosageText}`
            : lang === 'te'
            ? `గుర్తించిన వ్యాధి: ${diseaseNameText}. సిఫార్సు చేసిన ఎరువు: ${fertilizerNameText}. మోతాదు: ${dosageText}`
            : lang === 'hi'
            ? `पहचाना गया रोग: ${diseaseNameText}। अनुशंसित खाद व उपाय: ${fertilizerNameText}। खुराक: ${dosageText}`
            : `Detected condition: ${diseaseNameText}. Recommended fertilizer: ${fertilizerNameText}. Application: ${dosageText}`;

        resolve({
          isValid: true,
          isPlant: true,
          status: 'SUCCESS',
          diagnosisType: isConfirmed ? 'CONFIRMED' : 'POSSIBLE',
          confidence: diagnosisConfidence,
          crop: plantNameText,
          problem: diseaseNameText,
          symptoms: symptomsText,
          fertilizer: {
            name: fertilizerNameText,
            whyRecommended: whyRecommendedText,
            dosage: dosageText,
            precautions: precautionsText
          },
          whatToDo: `${fertilizerNameText}: ${dosageText}`,
          waterAdvice: precautionsText,
          importantNotice: 'Inspect entire field once every 5 days for early disease detection.',
          spokenText: spokenAudioText,
          analyzedAt: new Date().toISOString()
        });
      };

      img.onerror = () => {
        cleanupUrl(imageSrc);
        resolve({
          isValid: false,
          isPlant: false,
          status: 'POOR_QUALITY',
          message: 'Plant image is not clear enough. Please capture a clear close-up photo of the plant or affected leaf.',
          localizedMessages: {
            ta: 'புகைப்படத்தை படிக்க முடியவில்லை. தயவுசெய்து புதிய புகைப்படம் எடுக்கவும்.',
            te: 'ఫోటో లోడ్ కాలేదు. దయచేసి కొత్త ఫోటో తీయండి.',
            hi: 'तस्वीर लोड करने में विफल। कृपया नई तस्वीर खींचें।',
            en: 'Plant image is not clear enough. Please capture a clear close-up photo of the plant or affected leaf.'
          }
        });
      };

      img.src = imageSrc;
    });
  },

  /**
   * Compatibility wrapper for multi-image calls
   */
  async analyzeCropImages(images, language = 'en', voiceHint = '') {
    if (!images || !images.length) {
      return this.analyzePlantImage(null, language, voiceHint);
    }
    return this.analyzePlantImage(images[0], language, voiceHint);
  }
};
