export const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export const DISTRICT_MAP = {
  "Tamil Nadu": ["Thanjavur", "Coimbatore", "Madurai", "Salem", "Erode", "Tiruchirappalli", "Dindigul", "Vellore"],
  "Telangana": ["Warangal", "Karimnagar", "Nalgonda", "Nizamabad", "Khammam", "Ranga Reddy", "Medak"],
  "Andhra Pradesh": ["Guntur", "Krishna", "Kurnool", "Anantapur", "East Godavari", "West Godavari", "Chittoor"],
  "Punjab": ["Ludhiana", "Amritsar", "Bathinda", "Jalandhar", "Patiala", "Sangrur", "Firozpur"],
  "Haryana": ["Karnal", "Hisar", "Ambala", "Rohtak", "Sirsa", "Kurukshetra", "Sonipat"],
  "Maharashtra": ["Nashik", "Pune", "Nagpur", "Aurangabad", "Solapur", "Kolhapur", "Ahmednagar", "Amravati"],
  "Karnataka": ["Belagavi", "Dharwad", "Mysuru", "Shivamogga", "Tumakuru", "Mandya", "Hassan"],
  "Kerala": ["Palakkad", "Wayanad", "Idukki", "Thrissur", "Kottayam", "Alappuzha"],
  "West Bengal": ["Burdwan", "Hooghly", "Murshidabad", "Nadia", "Bankura", "Birbhum"],
  "Uttar Pradesh": ["Varanasi", "Lucknow", "Agra", "Meerut", "Prayagraj", "Bareilly", "Gorakhpur", "Aligarh"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Ujjain", "Jabalpur", "Gwalior", "Sagar", "Dewas"],
  "Gujarat": ["Rajkot", "Surat", "Ahmedabad", "Vadodara", "Junagadh", "Mehsana", "Bhavnagar"]
};

export const SOIL_TYPES = [
  { id: 'alluvial', name: 'Alluvial Soil (வண்டல் மண் / जलोढ़)', suitableFor: ['Rice', 'Wheat', 'Sugarcane', 'Cotton', 'Jute'] },
  { id: 'black', name: 'Black Cotton Soil (கரிசல் மண் / काली मिट्टी)', suitableFor: ['Cotton', 'Soybean', 'Wheat', 'Jowar', 'Sunflower'] },
  { id: 'red', name: 'Red & Yellow Soil (செம்மண் / लाल मिट्टी)', suitableFor: ['Groundnut', 'Millets', 'Pulses', 'Tobacco', 'Potato'] },
  { id: 'laterite', name: 'Laterite Soil (சரளை மண் / लैटेराइट)', suitableFor: ['Tea', 'Coffee', 'Cashew', 'Rubber', 'Coconut'] },
  { id: 'sandy_loam', name: 'Sandy Loam (மணல் கலந்த மண் / बलुई दोमट)', suitableFor: ['Mustard', 'Bajra', 'Barley', 'Vegetables', 'Maize'] },
  { id: 'clayey', name: 'Clayey Loam (களிமண் / चिकनी मिट्टी)', suitableFor: ['Paddy', 'Wheat', 'Gram', 'Lentils'] }
];

export const SEASONS = [
  { id: 'kharif', name: 'Kharif (Monsoon: Jun - Oct)', description: 'Rice, Maize, Cotton, Soybean, Groundnut' },
  { id: 'rabi', name: 'Rabi (Winter: Oct - Mar)', description: 'Wheat, Mustard, Gram, Barley, Peas' },
  { id: 'zaid', name: 'Zaid (Summer: Mar - Jun)', description: 'Watermelon, Cucumber, Vegetables, Fodder' }
];

export const CROP_CATEGORIES = [
  "Cereals & Grains",
  "Pulses & Lentils",
  "Oilseeds",
  "Cash Crops",
  "Vegetables & Fruits",
  "Spices"
];

// 8 Primary Indian Languages for Farmer Accessibility
export const LANGUAGES = [
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechCode: 'ta-IN', greeting: 'வணக்கம்! 👋', speakPrompt: 'பேசுங்கள்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechCode: 'te-IN', greeting: 'నమస్కారం! 👋', speakPrompt: 'మాట్లాడండి' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechCode: 'hi-IN', greeting: 'नमस्ते! 👋', speakPrompt: 'बोलिए' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechCode: 'kn-IN', greeting: 'ನಮಸ್ಕಾರ! 👋', speakPrompt: 'ಮಾತನಾಡಿ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speechCode: 'ml-IN', greeting: 'നമസ്കാരം! 👋', speakPrompt: 'സംസാരിക്കൂ' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechCode: 'mr-IN', greeting: 'नमस्कार! 👋', speakPrompt: 'बोला' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechCode: 'bn-IN', greeting: 'নমস্কার! 👋', speakPrompt: 'বলুন' },
  { code: 'en', name: 'English', nativeName: 'English', speechCode: 'en-IN', greeting: 'Hello Farmer! 👋', speakPrompt: 'Speak Now' }
];
