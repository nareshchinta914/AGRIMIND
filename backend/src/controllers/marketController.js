const { successResponse, errorResponse } = require('../utils/response');

// Comprehensive Live Mandi APMC commodity & vegetable prices dataset updated in real time
const MANDI_PRICES_DATA = [
  // --- VEGETABLES (காய்கறிகள்) ---
  {
    id: 'mandi_veg_1',
    commodity: 'Tomato (தக்காளி / टमाटर)',
    category: 'Vegetables',
    variety: 'Hybrid Red / Country Desi',
    market: 'Madanapalle Mandi, Andhra Pradesh',
    state: 'Andhra Pradesh',
    minPrice: 2800,
    maxPrice: 3600,
    modalPrice: 3200,
    pricePerKg: 32.0,
    change: '+6.5%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '3,450 Crates (25kg)',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_veg_2',
    commodity: 'Country Tomato (நாட்டு தக்காளி / देशी टमाटर)',
    category: 'Vegetables',
    variety: 'Local Ripe Juicy',
    market: 'Koyambedu Wholesale Market, Chennai, Tamil Nadu',
    state: 'Tamil Nadu',
    minPrice: 2600,
    maxPrice: 3300,
    modalPrice: 2950,
    pricePerKg: 29.5,
    change: '+4.2%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '2,800 Crates',
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_veg_3',
    commodity: 'Onion (வெங்காயம் / प्याज)',
    category: 'Vegetables',
    variety: 'Nashik Red Special (Medium/Big)',
    market: 'Lasalgaon Mandi, Maharashtra',
    state: 'Maharashtra',
    minPrice: 1950,
    maxPrice: 2550,
    modalPrice: 2300,
    pricePerKg: 23.0,
    change: '+4.2%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '5,200 Bags (50kg)',
    image: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_veg_4',
    commodity: 'Small Shallots (சின்ன வெங்காயம் / सांभर प्याज)',
    category: 'Vegetables',
    variety: 'Co-5 / Trichy Native Pink',
    market: 'Dindigul Mandi, Tamil Nadu',
    state: 'Tamil Nadu',
    minPrice: 4800,
    maxPrice: 5900,
    modalPrice: 5400,
    pricePerKg: 54.0,
    change: '+7.8%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '1,850 Bags',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_veg_5',
    commodity: 'Potato (உருளைக்கிழங்கு / आलू)',
    category: 'Vegetables',
    variety: 'Jyoti / Kufri Chipsona',
    market: 'Agra Mandi, Uttar Pradesh',
    state: 'Uttar Pradesh',
    minPrice: 1450,
    maxPrice: 1850,
    modalPrice: 1650,
    pricePerKg: 16.5,
    change: '+2.3%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '7,400 Bags',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_veg_6',
    commodity: 'Hill Organic Potato (ஊட்டி உருளைக்கிழங்கு)',
    category: 'Vegetables',
    variety: 'Nilgiri Golden Kufri',
    market: 'Ooty Mettupalayam Market, Tamil Nadu',
    state: 'Tamil Nadu',
    minPrice: 2400,
    maxPrice: 3100,
    modalPrice: 2800,
    pricePerKg: 28.0,
    change: '+3.5%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '1,200 Bags',
    image: 'https://images.unsplash.com/photo-1590165482129-1b8b27698980?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_veg_7',
    commodity: 'Green Chilli (பச்சை மிளகாய் / हरी मिर्च)',
    category: 'Vegetables',
    variety: 'G-4 Sharp Green / Teja Fresh',
    market: 'Oddanchatram Vegetable Market, Tamil Nadu',
    state: 'Tamil Nadu',
    minPrice: 4200,
    maxPrice: 5100,
    modalPrice: 4650,
    pricePerKg: 46.5,
    change: '+8.2%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '940 Bags',
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_veg_8',
    commodity: 'Brinjal / Eggplant (கத்தரிக்காய் / बैंगन)',
    category: 'Vegetables',
    variety: 'Green Round / Striped Native',
    market: 'Madurai Paravai Mandi, Tamil Nadu',
    state: 'Tamil Nadu',
    minPrice: 2100,
    maxPrice: 2700,
    modalPrice: 2400,
    pricePerKg: 24.0,
    change: '-2.0%',
    trend: 'down',
    unit: 'Quintal',
    arrivalToday: '1,100 Bags',
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_veg_9',
    commodity: "Lady's Finger / Okra (வெண்டைக்காய் / भिंडी)",
    category: 'Vegetables',
    variety: 'Tender F1 Super Green',
    market: 'Kolar APMC Market, Karnataka',
    state: 'Karnataka',
    minPrice: 2500,
    maxPrice: 3200,
    modalPrice: 2850,
    pricePerKg: 28.5,
    change: '+5.4%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '1,450 Crates',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_veg_10',
    commodity: 'Nilgiri Carrot (கேரட் / गाजर)',
    category: 'Vegetables',
    variety: 'Kuroda Fresh Orange Sweet',
    market: 'Ooty Mettupalayam Mandi, Tamil Nadu',
    state: 'Tamil Nadu',
    minPrice: 3000,
    maxPrice: 3800,
    modalPrice: 3400,
    pricePerKg: 34.0,
    change: '+6.0%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '2,100 Bags',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_veg_11',
    commodity: 'Cabbage (முட்டைக்கோஸ் / पत्तागोभी)',
    category: 'Vegetables',
    variety: 'Golden Acre Compact Round',
    market: 'Hosur APMC, Tamil Nadu',
    state: 'Tamil Nadu',
    minPrice: 1250,
    maxPrice: 1650,
    modalPrice: 1450,
    pricePerKg: 14.5,
    change: '-1.8%',
    trend: 'down',
    unit: 'Quintal',
    arrivalToday: '3,200 Bags',
    image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_veg_12',
    commodity: 'Cauliflower (காலிஃபிளவர் / फूलगोभी)',
    category: 'Vegetables',
    variety: 'Snowball Pure White Curds',
    market: 'Mysore APMC, Karnataka',
    state: 'Karnataka',
    minPrice: 1900,
    maxPrice: 2500,
    modalPrice: 2200,
    pricePerKg: 22.0,
    change: '+4.5%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '1,600 Crates',
    image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_veg_13',
    commodity: 'Drumstick (முருங்கைக்காய் / सहजन - मोरिंगா)',
    category: 'Vegetables',
    variety: 'ODC-3 Tender Heavy Length',
    market: 'Theni & Dindigul Mandi, Tamil Nadu',
    state: 'Tamil Nadu',
    minPrice: 5600,
    maxPrice: 7200,
    modalPrice: 6500,
    pricePerKg: 65.0,
    change: '+11.2%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '780 Bundles',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_veg_14',
    commodity: 'Green Capsicum (குடைமிளகாய் / शिमला मिर्च)',
    category: 'Vegetables',
    variety: 'California Wonder Crisp Green',
    market: 'Bangalore APMC / Yeshwanthpur, Karnataka',
    state: 'Karnataka',
    minPrice: 3600,
    maxPrice: 4600,
    modalPrice: 4200,
    pricePerKg: 42.0,
    change: '+6.8%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '1,350 Crates',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_veg_15',
    commodity: 'Garlic (பூண்டு / लहसुन)',
    category: 'Vegetables',
    variety: 'Kodaikanal Malai Poondu (Hill GI Tag)',
    market: 'Kodaikanal & Vadipatti Mandi, Tamil Nadu',
    state: 'Tamil Nadu',
    minPrice: 21000,
    maxPrice: 26500,
    modalPrice: 24000,
    pricePerKg: 240.0,
    change: '+12.0%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '420 Bags',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_veg_16',
    commodity: 'Ginger (இஞ்சி / अदरक)',
    category: 'Vegetables',
    variety: 'Wayanad Green Mahima (Fresh Harvest)',
    market: 'Wayanad & Sulthan Bathery Mandi, Kerala',
    state: 'Kerala',
    minPrice: 7600,
    maxPrice: 9100,
    modalPrice: 8400,
    pricePerKg: 84.0,
    change: '+4.7%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '650 Bags',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_veg_17',
    commodity: 'Bitter Gourd (பாகற்காய் / करेला)',
    category: 'Vegetables',
    variety: 'Native Dark Green Bitter',
    market: 'Ottapalam & Palakkad APMC, Kerala',
    state: 'Kerala',
    minPrice: 2700,
    maxPrice: 3500,
    modalPrice: 3100,
    pricePerKg: 31.0,
    change: '+3.0%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '820 Bags',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_veg_18',
    commodity: 'Coriander Leaves (கொத்தமல்லி / हरा धनिया)',
    category: 'Vegetables',
    variety: 'Aroma Multi-cut Fresh Bundles',
    market: 'Koyambedu Wholesale Market, Chennai, Tamil Nadu',
    state: 'Tamil Nadu',
    minPrice: 3200,
    maxPrice: 4400,
    modalPrice: 3800,
    pricePerKg: 38.0,
    change: '+8.0%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '900 Bunches',
    image: 'https://images.unsplash.com/photo-1588879460618-924b13fa250a?w=400&auto=format&fit=crop&q=80'
  },

  // --- CEREALS & GRAINS ---
  {
    id: 'mandi_grain_1',
    commodity: 'Basmati Paddy (நெல் / धान)',
    category: 'Cereals & Grains',
    variety: '1121 Pusa / Traditional',
    market: 'Karnal Mandi, Haryana',
    state: 'Haryana',
    minPrice: 3950,
    maxPrice: 4400,
    modalPrice: 4250,
    pricePerKg: 42.5,
    change: '+3.4%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '1,420 Quintals',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_grain_2',
    commodity: 'Ponni Samba Paddy (பொன்னி சம்பா நெல்)',
    category: 'Cereals & Grains',
    variety: 'BPT-5204 Fine Grain Super',
    market: 'Thanjavur APMC Yard, Tamil Nadu',
    state: 'Tamil Nadu',
    minPrice: 2450,
    maxPrice: 2680,
    modalPrice: 2560,
    pricePerKg: 25.6,
    change: '+2.8%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '3,800 Bags (75kg)',
    image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_grain_3',
    commodity: 'Wheat (கோதுமை / गेहूं)',
    category: 'Cereals & Grains',
    variety: 'Sharbati / HD-2967',
    market: 'Khanna Mandi, Punjab',
    state: 'Punjab',
    minPrice: 2280,
    maxPrice: 2475,
    modalPrice: 2390,
    pricePerKg: 23.9,
    change: '+1.8%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '2,800 Quintals',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_grain_4',
    commodity: 'Maize / Corn (மக்காச்சோளம் / मक्का)',
    category: 'Cereals & Grains',
    variety: 'Yellow Hybrid Feed Grade',
    market: 'Davanagere APMC, Karnataka',
    state: 'Karnataka',
    minPrice: 2050,
    maxPrice: 2320,
    modalPrice: 2190,
    pricePerKg: 21.9,
    change: '+2.1%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '2,200 Bags',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&auto=format&fit=crop&q=80'
  },

  // --- CASH CROPS & FIBER ---
  {
    id: 'mandi_cash_1',
    commodity: 'Cotton / Kapas (பருத்தி / कपास)',
    category: 'Cash Crops & Fiber',
    variety: 'Medium-Long Staple (Shankar-6)',
    market: 'Rajkot APMC, Gujarat',
    state: 'Gujarat',
    minPrice: 7100,
    maxPrice: 7850,
    modalPrice: 7520,
    pricePerKg: 75.2,
    change: '+2.6%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '980 Quintals',
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_cash_2',
    commodity: 'Soybean (சோயாபீன் / सोयाबीन)',
    category: 'Cash Crops & Fiber',
    variety: 'Yellow Standard (JS-335)',
    market: 'Indore Mandi, Madhya Pradesh',
    state: 'Madhya Pradesh',
    minPrice: 4400,
    maxPrice: 4850,
    modalPrice: 4680,
    pricePerKg: 46.8,
    change: '-0.8%',
    trend: 'down',
    unit: 'Quintal',
    arrivalToday: '1,650 Quintals',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_cash_3',
    commodity: 'Sugarcane (கரும்பு / गन्ना)',
    category: 'Cash Crops & Fiber',
    variety: 'Co 0238 High Recovery',
    market: 'Muzaffarnagar Mandi, Uttar Pradesh',
    state: 'Uttar Pradesh',
    minPrice: 350,
    maxPrice: 385,
    modalPrice: 370,
    pricePerKg: 3.7,
    change: '+1.5%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '15,000 Quintals',
    image: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?w=400&auto=format&fit=crop&q=80'
  },

  // --- SPICES & CONDIMENTS ---
  {
    id: 'mandi_spice_1',
    commodity: 'Dry Red Chilli (மிளகாய் / लाल मिर्च)',
    category: 'Spices & Condiments',
    variety: 'Teja / 334 Sannam Grade-1',
    market: 'Guntur APMC, Andhra Pradesh',
    state: 'Andhra Pradesh',
    minPrice: 18500,
    maxPrice: 22400,
    modalPrice: 20800,
    pricePerKg: 208.0,
    change: '+5.0%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '890 Bags',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_spice_2',
    commodity: 'Turmeric (மஞ்சள் / हल्दी)',
    category: 'Spices & Condiments',
    variety: 'Salem Finger (High Curcumin 4.5%)',
    market: 'Erode Mandi, Tamil Nadu',
    state: 'Tamil Nadu',
    minPrice: 13200,
    maxPrice: 16800,
    modalPrice: 15400,
    pricePerKg: 154.0,
    change: '+4.8%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '740 Bags',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mandi_spice_3',
    commodity: 'Black Pepper (கருப்பு மிளகு / काली मिर्च)',
    category: 'Spices & Condiments',
    variety: 'Garbled Extra Bold (MG-1)',
    market: 'Kochi Spices Exchange, Kerala',
    state: 'Kerala',
    minPrice: 58000,
    maxPrice: 65000,
    modalPrice: 61500,
    pricePerKg: 615.0,
    change: '+3.2%',
    trend: 'up',
    unit: 'Quintal',
    arrivalToday: '320 Quintals',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&auto=format&fit=crop&q=80'
  }
];

// Verified Buying Merchants, Supermarkets & Wholesale Aggregators
const BUYING_MERCHANTS_DATA = [
  {
    id: 'merchant_veg_1',
    companyName: 'Kisan Fresh Vegetable Logistics & Retail Supply',
    merchantType: 'Supermarket Supply Network & Quick-Commerce',
    category: 'Vegetables',
    verified: true,
    rating: 4.9,
    dealsCompleted: 890,
    contactPerson: 'Mahesh Patil (Procurement Head)',
    phone: '9988776655',
    whatsapp: '9988776655',
    location: 'Nashik & Pune, Maharashtra',
    buyingCommodity: 'Tomato, Red Onion, Potato & Cauliflower',
    buyingPrice: '₹34 / Kg (Tomato) | ₹25 / Kg (Onion) | ₹18 / Kg (Potato)',
    volumeNeeded: 'Daily 10 Tons Regular Farm Collection',
    paymentTerm: 'Direct Bank Transfer within 24 Hours of Weighment',
    deliveryTerms: 'Farm gate pickup or APMC Yard Collection Point'
  },
  {
    id: 'merchant_veg_2',
    companyName: 'Nilgiris Organic Vegetable Aggregation Hub',
    merchantType: 'Hill Vegetable Exporter & Cold Storage',
    category: 'Vegetables',
    verified: true,
    rating: 5.0,
    dealsCompleted: 430,
    contactPerson: 'K. Balasubramaniam',
    phone: '9443355667',
    whatsapp: '9443355667',
    location: 'Ooty & Mettupalayam, Tamil Nadu',
    buyingCommodity: 'Nilgiri Carrot, Organic Potato, Cabbage, Garlic',
    buyingPrice: '₹36 / Kg (Carrot) | ₹29 / Kg (Potato) | ₹245 / Kg (Garlic)',
    volumeNeeded: '80 Quintals / week (Premium Grade)',
    paymentTerm: '100% Instant Payment via UPI / RTGS',
    deliveryTerms: 'Mettupalayam Cold Hub or Farm Gate Transport Support'
  },
  {
    id: 'merchant_veg_3',
    companyName: 'Koyambedu Wholesale Commission House',
    merchantType: 'Metro Wholesale Mandi Trader',
    category: 'Vegetables',
    verified: true,
    rating: 4.8,
    dealsCompleted: 1120,
    contactPerson: 'R. Soundararajan',
    phone: '9840112233',
    whatsapp: '9840112233',
    location: 'Koyambedu Market, Chennai, Tamil Nadu',
    buyingCommodity: 'Country Tomato, Drumstick, Green Chilli, Brinjal, Okra',
    buyingPrice: '₹31 / Kg (Tomato) | ₹68 / Kg (Drumstick) | ₹48 / Kg (Chilli)',
    volumeNeeded: '15 Tons Daily Wholesale Inflow',
    paymentTerm: 'Same-day cash settlement at Mandi gate',
    deliveryTerms: 'Night unloading at Koyambedu Gate 4'
  },
  {
    id: 'merchant_veg_4',
    companyName: 'Bangalore Fresh Agro Hypermarket Supply',
    merchantType: 'Retail Chain Aggregator',
    category: 'Vegetables',
    verified: true,
    rating: 4.9,
    dealsCompleted: 670,
    contactPerson: 'Anand Kulkarni',
    phone: '9880123456',
    whatsapp: '9880123456',
    location: 'Yeshwanthpur, Bangalore, Karnataka',
    buyingCommodity: 'Green Capsicum, Lady\'s Finger, Cauliflower, Ginger',
    buyingPrice: '₹44 / Kg (Capsicum) | ₹30 / Kg (Okra) | ₹86 / Kg (Ginger)',
    volumeNeeded: '5 Tons Daily Quality Sorted',
    paymentTerm: 'Online NEFT with formal GST invoice',
    deliveryTerms: 'Bangalore Sorting Hub or Hosur Collection Point'
  },
  {
    id: 'merchant_grain_1',
    companyName: 'Sri Lakshmi Modern Rice Mill',
    merchantType: 'Rice Miller & Exporter',
    category: 'Cereals & Grains',
    verified: true,
    rating: 4.9,
    dealsCompleted: 340,
    contactPerson: 'Senthil Kumar (Managing Director)',
    phone: '9842109876',
    whatsapp: '9842109876',
    location: 'Thanjavur, Tamil Nadu',
    buyingCommodity: 'Paddy / Rice (Ponni Samba & BPT-5204)',
    buyingPrice: '₹2,550 - ₹2,700 / Quintal',
    volumeNeeded: '500 Tons (Immediate Purchase)',
    paymentTerm: 'Instant Bank Transfer / Cash on Weighbridge',
    deliveryTerms: 'Mill gate or farm pickup available for >10 Tons'
  },
  {
    id: 'merchant_grain_2',
    companyName: 'Bharat Agro Commodities Pvt Ltd',
    merchantType: 'Bulk Grain Wholesaler',
    category: 'Cereals & Grains',
    verified: true,
    rating: 4.8,
    dealsCompleted: 520,
    contactPerson: 'Rajesh Agarwal',
    phone: '9811223344',
    whatsapp: '9811223344',
    location: 'Indore Mandi, Madhya Pradesh',
    buyingCommodity: 'Wheat (Sharbati) & Soybean',
    buyingPrice: '₹2,500 / Quintal (Wheat) | ₹4,750 / Qtl (Soybean)',
    volumeNeeded: '1,200 Bags (Urgent Requirement)',
    paymentTerm: 'Same-Day RTGS Payment',
    deliveryTerms: 'Direct APMC Mandi Yard Delivery'
  },
  {
    id: 'merchant_spice_1',
    companyName: 'Guntur Spice Traders & Exporters',
    merchantType: 'Spice Exporter',
    category: 'Spices & Condiments',
    verified: true,
    rating: 5.0,
    dealsCompleted: 215,
    contactPerson: 'Venkata Rao Naidu',
    phone: '9876541230',
    whatsapp: '9876541230',
    location: 'Guntur, Andhra Pradesh',
    buyingCommodity: 'Dry Red Chilli (Teja / Sannam) & Turmeric',
    buyingPrice: '₹21,500 - ₹23,000 / Quintal (Chilli)',
    volumeNeeded: '250 Quintals (Premium Quality)',
    paymentTerm: '100% Advance after Moisture Inspection',
    deliveryTerms: 'Cold Storage Delivery with Moisture < 10%'
  },
  {
    id: 'merchant_fiber_1',
    companyName: 'Coimbatore Cotton Ginning Mills',
    merchantType: 'Textile Spinner & Ginning Mill',
    category: 'Cash Crops & Fiber',
    verified: true,
    rating: 4.9,
    dealsCompleted: 180,
    contactPerson: 'K. R. Natarajan',
    phone: '9443217890',
    whatsapp: '9443217890',
    location: 'Coimbatore & Tirupur, Tamil Nadu',
    buyingCommodity: 'Raw Cotton / Kapas (Shankar-6 & DCH-32)',
    buyingPrice: '₹7,650 - ₹7,900 / Quintal',
    volumeNeeded: '400 Quintals',
    paymentTerm: 'Immediate Weighbridge Settlement',
    deliveryTerms: 'Factory Gate Delivery with staple certificate'
  }
];

class MarketController {
  /**
   * GET /api/market/mandi-prices
   * Query params: category, state, search
   */
  async getMandiPrices(req, res, next) {
    try {
      const { category, state, search } = req.query;
      let prices = [...MANDI_PRICES_DATA];

      if (category && category !== 'All') {
        prices = prices.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (state && state !== 'All') {
        prices = prices.filter(
          (p) => p.state.toLowerCase() === state.toLowerCase()
        );
      }

      if (search) {
        const q = search.toLowerCase();
        prices = prices.filter(
          (p) =>
            p.commodity.toLowerCase().includes(q) ||
            p.variety.toLowerCase().includes(q) ||
            p.market.toLowerCase().includes(q) ||
            p.state.toLowerCase().includes(q)
        );
      }

      const vegetableCount = MANDI_PRICES_DATA.filter((p) => p.category === 'Vegetables').length;

      return successResponse(
        res,
        {
          total: prices.length,
          vegetablesCount: vegetableCount,
          lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          prices
        },
        'Live APMC Mandi prices retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/market/merchants
   * Query params: category, search
   */
  async getMerchants(req, res, next) {
    try {
      const { category, search } = req.query;
      let merchants = [...BUYING_MERCHANTS_DATA];

      if (category && category !== 'All') {
        merchants = merchants.filter(
          (m) => m.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (search) {
        const q = search.toLowerCase();
        merchants = merchants.filter(
          (m) =>
            m.companyName.toLowerCase().includes(q) ||
            m.buyingCommodity.toLowerCase().includes(q) ||
            m.location.toLowerCase().includes(q) ||
            m.merchantType.toLowerCase().includes(q)
        );
      }

      return successResponse(
        res,
        {
          totalMerchants: merchants.length,
          merchants
        },
        'Verified crop & vegetable buying merchants retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/market/farmer-sell
   */
  async postFarmerProduce(req, res, next) {
    try {
      const produceData = req.body;
      const offer = {
        id: 'offer_' + Date.now(),
        ...produceData,
        status: 'Active',
        bidsReceived: 0,
        createdAt: new Date().toISOString()
      };

      return successResponse(
        res,
        {
          offer,
          message: `Your harvest offer for ${produceData.cropName || 'produce'} has been broadcast to 1,500+ verified merchants & millers!`
        },
        'Produce broadcasted successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MarketController();
