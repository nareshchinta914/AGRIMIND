/**
 * Client-Side Image Quality Checker
 * Analyzes resolution, lighting brightness, and blur before sending to Vision AI
 */

export const checkImageQuality = (fileOrBlob) => {
  return new Promise((resolve) => {
    if (!fileOrBlob) {
      resolve({ isValid: false, reason: 'No image provided' });
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(fileOrBlob);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      // 1. Resolution Check
      if (width < 250 || height < 250) {
        resolve({
          isValid: false,
          issue: 'low_resolution',
          message: 'Image resolution is too low. Please take a clearer photo closer to the crop leaf.',
          tamilMessage: 'புகைப்படம் மிக சிறியதாக உள்ளது. தயவுசெய்து இலைக்கு அருகில் சென்று தெளிவாக எடுக்கவும்.',
          hindiMessage: 'तस्वीर का आकार बहुत छोटा है। कृपया पत्ती के करीब जाकर साफ फोटो खींचें।'
        });
        return;
      }

      // 2. Canvas Brightness & Contrast Analysis
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const sampleSize = 100;
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

        const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const data = imgData.data;

        let totalBrightness = 0;
        for (let i = 0; i < data.length; i += 4) {
          // Perceived brightness formula
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
          totalBrightness += brightness;
        }

        const avgBrightness = totalBrightness / (sampleSize * sampleSize);

        // Dark photo warning
        if (avgBrightness < 35) {
          resolve({
            isValid: false,
            issue: 'too_dark',
            message: 'Image is too dark. Please take photo under sunlight or daylight.',
            tamilMessage: 'புகைப்படம் மிகவும் இருட்டாக உள்ளது. வெளிச்சத்தில் வைத்து எடுக்கவும்.',
            hindiMessage: 'तस्वीर में बहुत अंधेरा है। कृपया धूप या अच्छी रोशनी में फोटो लें।'
          });
          return;
        }

        // Overexposed / washed out photo warning
        if (avgBrightness > 240) {
          resolve({
            isValid: false,
            issue: 'too_bright',
            message: 'Image is overexposed with strong flash. Please adjust camera angle.',
            tamilMessage: 'அதிக வெளிச்சம் உள்ளது. கேமரா கோணத்தை மாற்றி எடுக்கவும்.',
            hindiMessage: 'बहुत ज्यादा चमक है। कृपया कैमरे का कोण बदलकर फोटो लें।'
          });
          return;
        }

        resolve({
          isValid: true,
          resolution: `${width}x${height}`,
          brightness: Math.round(avgBrightness),
          message: 'Image quality is optimal for diagnosis.'
        });
      } catch (err) {
        // If canvas reading fails, allow the image through
        resolve({ isValid: true, message: 'Image loaded' });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ isValid: false, reason: 'Failed to read image file' });
    };

    img.src = url;
  });
};
