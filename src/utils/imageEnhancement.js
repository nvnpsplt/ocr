// Image enhancement utilities
export const enhanceImage = async (imageFile, options = {}) => {
  const {
    brightness = 1.0,
    contrast = 1.0,
    autoRotate = true,
    perspectiveCorrection = true,
    denoise = true
  } = options;

  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Apply brightness and contrast
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        // Apply brightness
        data[i] = Math.min(255, data[i] * brightness);     // Red
        data[i + 1] = Math.min(255, data[i + 1] * brightness); // Green
        data[i + 2] = Math.min(255, data[i + 2] * brightness); // Blue

        // Apply contrast
        for (let j = 0; j < 3; j++) {
          const channel = i + j;
          data[channel] = ((data[channel] / 255 - 0.5) * contrast + 0.5) * 255;
          data[channel] = Math.max(0, Math.min(255, data[channel]));
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Convert to black and white for better OCR
      ctx.globalCompositeOperation = 'saturation';
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        resolve(new File([blob], imageFile.name, { type: 'image/png' }));
      }, 'image/png');
    };

    img.src = URL.createObjectURL(imageFile);
  });
};

// Detect text orientation
export const detectOrientation = async (imageFile) => {
  // Implementation would use a computer vision library
  // For now, return a placeholder
  return 0; // degrees
};

// Auto-crop to content
export const autoCrop = async (imageFile) => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Find content boundaries
      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = 0;
      let maxY = 0;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          // Check if pixel is not white (assuming white background)
          if (data[i] < 250 || data[i + 1] < 250 || data[i + 2] < 250) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      // Add padding
      const padding = 10;
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(canvas.width, maxX + padding);
      maxY = Math.min(canvas.height, maxY + padding);

      // Create new canvas with cropped dimensions
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = maxX - minX;
      croppedCanvas.height = maxY - minY;

      // Draw cropped image
      const croppedCtx = croppedCanvas.getContext('2d');
      croppedCtx.drawImage(
        canvas,
        minX, minY, maxX - minX, maxY - minY,
        0, 0, maxX - minX, maxY - minY
      );

      croppedCanvas.toBlob((blob) => {
        resolve(new File([blob], imageFile.name, { type: 'image/png' }));
      }, 'image/png');
    };

    img.src = URL.createObjectURL(imageFile);
  });
};
