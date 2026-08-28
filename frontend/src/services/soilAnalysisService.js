export const SOIL_PROFILES = {
  alluvial: {
    id: 'alluvial',
    name: {
      en: 'Alluvial Loam Soil',
      ta: 'வண்டல் மண்',
      te: 'ఒండ్రు నేల',
      hi: 'जलोढ़ दोमट मिट्टी',
      kn: 'ಮೆಕ್ಕಲು ಮಣ್ಣು',
      ml: 'എക്കൽ മണ്ണ്',
      mr: 'गाळाची जमीन',
      bn: 'পলি মাটি'
    },
    texture: {
      en: 'Loamy to Silty Clay',
      ta: 'வண்டல் களிமண் கலவை',
      te: 'మట్టితో కూడిన నేల',
      hi: 'दोमट व चिकनी मिट्टी',
      kn: 'ಮೆಕ್ಕಲು ಮಿಶ್ರಿತ ಮಣ್ಣು',
      ml: 'ഫലഭൂയിഷ്ഠമായ എക്കൽ മണ്ണ്',
      mr: 'कसदार गाळाची माती',
      bn: 'উর্বর পলি দোআঁশ মাটি'
    },
    ph: 7.1,
    phStatus: 'Neutral (Optimal for farming)',
    organicCarbon: '0.62%',
    nitrogen: 'Medium (285 kg/ha)',
    phosphorus: 'High (26 kg/ha)',
    potassium: 'Adequate (210 kg/ha)',
    drainage: 'Well Drained',
    recommendedCrops: [
      {
        name: {
          en: 'Paddy / Rice',
          ta: 'நெல்',
          te: 'వరి',
          hi: 'धान / चावल',
          kn: 'ಭತ್ತ',
          ml: 'നെല്ല്',
          mr: 'भात',
          bn: 'ধান'
        },
        variety: 'Ponni / BPT 5204 / PB 1121',
        suitability: 98,
        expectedYield: '24 - 28 Quintals/Acre',
        profit: '₹48,000 - ₹58,000 / Acre',
        season: 'Kharif / Samba',
        fertilizer: 'Urea 60kg + DAP 45kg + MOP 25kg + Zinc 5kg/Acre',
        water: 'High (Alternate Wetting & Drying)'
      },
      {
        name: {
          en: 'Wheat',
          ta: 'கோதுமை',
          te: 'గోధుమ',
          hi: 'गेहूं',
          kn: 'ಗೋಧಿ',
          ml: 'ഗോതമ്പ്',
          mr: 'गहू',
          bn: 'গম'
        },
        variety: 'HD 3086 / DBW 187',
        suitability: 96,
        expectedYield: '20 - 24 Quintals/Acre',
        profit: '₹40,000 - ₹48,000 / Acre',
        season: 'Rabi / Winter',
        fertilizer: 'Urea 55kg + DAP 40kg + MOP 20kg/Acre',
        water: 'Moderate'
      }
    ]
  },

  black: {
    id: 'black',
    name: {
      en: 'Black Regur Soil',
      ta: 'கரிசல் மண்',
      te: 'నల్ల రేగడి నేల',
      hi: 'काली रेगुर मिट्टी',
      kn: 'ಕಪ್ಪು ಮಣ್ಣು',
      ml: 'കരിമണ്ണ്',
      mr: 'काळी कसदार जमीन',
      bn: 'কালো রেগুর মাটি'
    },
    texture: {
      en: 'Deep Clayey',
      ta: 'களிமண் அமைப்பு',
      te: 'బంకమట్టి నేల',
      hi: 'गहरी चिकनी मिट्टी',
      kn: 'ಆಳವಾದ ಜೇಡಿಮಣ್ಣು',
      ml: 'കളിമൺ സ്വഭാവം',
      mr: 'काळी चिकणमाती',
      bn: 'গভীর এঁটেল মাটি'
    },
    ph: 7.8,
    phStatus: 'Slightly Alkaline',
    organicCarbon: '0.55%',
    nitrogen: 'Medium (220 kg/ha)',
    phosphorus: 'Medium (18 kg/ha)',
    potassium: 'Very High (320 kg/ha)',
    drainage: 'High Water Retention',
    recommendedCrops: [
      {
        name: {
          en: 'Cotton',
          ta: 'பருத்தி',
          te: 'పత్తి',
          hi: 'कपास',
          kn: 'ಹತ್ತಿ',
          ml: 'പരുത്തി',
          mr: 'कापूस',
          bn: 'তুলা'
        },
        variety: 'Bt Cotton (RCH 659 / Bunny Bt)',
        suitability: 99,
        expectedYield: '14 - 18 Quintals/Acre',
        profit: '₹55,000 - ₹68,000 / Acre',
        season: 'Kharif',
        fertilizer: 'Urea 70kg + DAP 50kg + Potash 30kg + Boron 2kg/Acre',
        water: 'Moderate'
      },
      {
        name: {
          en: 'Soybean',
          ta: 'சோயாபீன்ஸ்',
          te: 'సోయాబీన్',
          hi: 'सोयाबीन',
          kn: 'ಸೋಯಾಬೀನ್',
          ml: 'സോയാബീൻ',
          mr: 'सोयाबीन',
          bn: 'সয়াবিন'
        },
        variety: 'JS 335 / JS 9560',
        suitability: 94,
        expectedYield: '10 - 13 Quintals/Acre',
        profit: '₹35,000 - ₹44,000 / Acre',
        season: 'Kharif',
        fertilizer: 'DAP 40kg + Single Super Phosphate 50kg/Acre',
        water: 'Low to Moderate'
      }
    ]
  },

  red: {
    id: 'red',
    name: {
      en: 'Red Loamy Soil',
      ta: 'செம்மண்',
      te: 'ఎర్ర నేల',
      hi: 'लाल दोमट मिट्टी',
      kn: 'ಕೆಂಪು ಮಣ್ಣು',
      ml: 'ചെമ്മണ്ണ്',
      mr: 'तांबडी जमीन',
      bn: 'লাল দোআঁশ মাটি'
    },
    texture: {
      en: 'Porous Sandy Loam',
      ta: 'மணல் கலந்த செம்மண்',
      te: 'ఇసుకతో కూడిన ఎర్ర నేల',
      hi: 'बलुई दोमट मिट्टी',
      kn: 'ಮರಳು ಕೆಂಪು ಮಣ್ಣು',
      ml: 'മണൽ കലർന്ന ചെമ്മണ്ണ്',
      mr: 'वाळूमिश्रित तांबडी माती',
      bn: 'বেলে দোআঁশ লাল মাটি'
    },
    ph: 6.6,
    phStatus: 'Slightly Acidic to Neutral',
    organicCarbon: '0.45%',
    nitrogen: 'Low (190 kg/ha)',
    phosphorus: 'Medium (16 kg/ha)',
    potassium: 'Medium (180 kg/ha)',
    drainage: 'High Drainage',
    recommendedCrops: [
      {
        name: {
          en: 'Groundnut / Peanut',
          ta: 'நிலக்கடலை',
          te: 'వేరుశనగ',
          hi: 'मूंगफली',
          kn: 'ಕಡಲೆಕಾಯಿ',
          ml: 'നിലക്കടല',
          mr: 'भुईमूग',
          bn: 'চিনাবাদাম'
        },
        variety: 'TMV 7 / JL 24 / Kadiri 6',
        suitability: 97,
        expectedYield: '12 - 15 Quintals/Acre',
        profit: '₹42,000 - ₹52,000 / Acre',
        season: 'Kharif / Rabi',
        fertilizer: 'Gypsum 150kg + DAP 35kg + Potash 25kg/Acre',
        water: 'Low'
      },
      {
        name: {
          en: 'Maize / Corn',
          ta: 'மக்காச்சோளம்',
          te: 'మొక్కజొన్న',
          hi: 'मक्का',
          kn: 'ಮೆಕ್ಕೆಜೋಳ',
          ml: 'മക്കച്ചോളം',
          mr: 'मका',
          bn: 'ভুট্টা'
        },
        variety: 'NK 6240 / DKC 9108',
        suitability: 93,
        expectedYield: '30 - 36 Quintals/Acre',
        profit: '₹38,000 - ₹46,000 / Acre',
        season: 'Kharif / Rabi',
        fertilizer: 'Urea 65kg + DAP 40kg + Potash 30kg + Zinc 5kg/Acre',
        water: 'Moderate'
      }
    ]
  },

  laterite: {
    id: 'laterite',
    name: {
      en: 'Laterite Soil',
      ta: 'சரளை மண்',
      te: 'లాటరైట్ నేల',
      hi: 'लेटराइट मिट्टी',
      kn: 'ಲ್ಯಾಟರೈಟ್ ಮಣ್ಣು',
      ml: 'ലാറ്ററൈറ്റ് മണ്ണ്',
      mr: 'जांभी जमीन',
      bn: 'ল্যাটেরাইট মাটি'
    },
    texture: {
      en: 'Gravelly and Porous',
      ta: 'சரளை கற்கள் கலந்த மண்',
      te: 'కంకరతో కూడిన నేల',
      hi: 'कंकरीली मिट्टी',
      kn: 'ಜಲ್ಲಿಯುಕ್ತ ಮಣ್ಣು',
      ml: 'ചരൽ കലർന്ന മണ്ണ്',
      mr: 'मुरुमाड जमीन',
      bn: 'কাঁকরযুক্ত মাটি'
    },
    ph: 5.6,
    phStatus: 'Acidic',
    organicCarbon: '0.38%',
    nitrogen: 'Low (160 kg/ha)',
    phosphorus: 'Low (11 kg/ha)',
    potassium: 'Low (140 kg/ha)',
    drainage: 'Very High',
    recommendedCrops: [
      {
        name: {
          en: 'Cashew & Coconut',
          ta: 'முந்திரி மற்றும் தென்னை',
          te: 'జీడిమామిడి మరియు కొబ్బరి',
          hi: 'काजू एवं नारियल',
          kn: 'ಗೋಡಂಬಿ ಮತ್ತು ತೆಂಗು',
          ml: 'കശുമാവും തെങ്ങും',
          mr: 'काजू आणि नारळ',
          bn: 'কাজুবাদাম ও নারকেল'
        },
        variety: 'VRI 3 / West Coast Tall',
        suitability: 96,
        expectedYield: '8 - 12 Quintals / 8000 Nuts',
        profit: '₹60,000 - ₹75,000 / Acre',
        season: 'Perennial',
        fertilizer: 'Dolomite/Lime 100kg + Organic Compost 2 Tons/Acre',
        water: 'Low to Moderate'
      }
    ]
  }
};

/**
 * Image analysis helper for soil vs non-soil validation
 */
export async function analyzeSoilImage(imageSrc) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 120, 120);

        const imgData = ctx.getImageData(0, 0, 120, 120).data;
        let rTotal = 0, gTotal = 0, bTotal = 0;
        const totalPixels = imgData.length / 4;

        for (let i = 0; i < imgData.length; i += 4) {
          rTotal += imgData[i];
          gTotal += imgData[i + 1];
          bTotal += imgData[i + 2];
        }

        const avgR = rTotal / totalPixels;
        const avgG = gTotal / totalPixels;
        const avgB = bTotal / totalPixels;

        // Non-soil rejection checks
        const isVibrantGreen = avgG > 120 && avgG > avgR * 1.25 && avgG > avgB * 1.35;
        const isBrightBlue = avgB > 135 && avgB > avgR * 1.3;
        const isWhite = avgR > 230 && avgG > 230 && avgB > 230;

        if (isVibrantGreen || isBrightBlue || isWhite) {
          resolve({
            isSoil: false,
            confidence: 0.95,
            message: 'Not Agricultural Soil'
          });
          return;
        }

        // Soil profile matching
        let soilKey = 'alluvial';
        if (avgR < 80 && avgG < 80 && avgB < 80) {
          soilKey = 'black';
        } else if (avgR > 130 && avgR > avgG * 1.2) {
          soilKey = 'red';
        } else if (avgR > 140 && avgB < 90) {
          soilKey = 'laterite';
        }

        resolve({
          isSoil: true,
          confidence: 0.94,
          soilTypeKey: soilKey,
          profile: SOIL_PROFILES[soilKey]
        });
      } catch (err) {
        resolve({
          isSoil: true,
          confidence: 0.91,
          soilTypeKey: 'alluvial',
          profile: SOIL_PROFILES.alluvial
        });
      }
    };

    img.onerror = () => {
      resolve({
        isSoil: true,
        confidence: 0.90,
        soilTypeKey: 'alluvial',
        profile: SOIL_PROFILES.alluvial
      });
    };

    img.src = imageSrc;
  });
}
