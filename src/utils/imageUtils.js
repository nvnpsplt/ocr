// Maximum image dimensions for optimization
const MAX_IMAGE_DIMENSION = 2048;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Compress and resize image if needed
export const optimizeImage = async (file) => {
  if (file.size <= MAX_FILE_SIZE) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > height && width > MAX_IMAGE_DIMENSION) {
        height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
        width = MAX_IMAGE_DIMENSION;
      } else if (height > MAX_IMAGE_DIMENSION) {
        width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
        height = MAX_IMAGE_DIMENSION;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          resolve(new File([blob], file.name, { type: file.type }));
        },
        file.type,
        0.8
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// Cache for processed images
const imageCache = new Map();

export const getCachedResult = (fileHash) => {
  const cached = imageCache.get(fileHash);
  if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) { // 24 hour cache
    return cached.result;
  }
  return null;
};

export const cacheResult = (fileHash, result) => {
  imageCache.set(fileHash, {
    result,
    timestamp: Date.now()
  });
};

// Generate a simple hash for the file
export const generateFileHash = async (file) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};
