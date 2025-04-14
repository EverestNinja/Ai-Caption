// Basic interfaces for the flyer generation
export interface FlyerFormState {
  description: string;
  companyLogo?: File | null;
  logoPreview?: string | null;
  logoPosition?: 'top-left' | 'top' | 'top-right' | 'left' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right';
}

export interface GeneratedFlyer {
  id: string;
  imageUrl: string;
}

// Error class for flyer generation
export class FlyerApiError extends Error {
  constructor(
    message: string,
    public code: string = 'API_ERROR',
    public status?: number
  ) {
    super(message);
    this.name = 'FlyerApiError';
  }
}

// Get xAI API key from environment variables
const xaiApiKey = import.meta.env.VITE_XAPI_KEY;

/**
 * Health check function to test the xAI API connection
 * @returns A promise that resolves to true if the connection is healthy
 */
export const checkXaiApiHealth = async (): Promise<boolean> => {
  if (!xaiApiKey) {
    console.error("No xAI API key found in environment variables");
    return false;
  }

  try {
    // Test connection using the same method as the HTML example
    const response = await fetch('https://api.x.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${xaiApiKey}`
      },
      body: JSON.stringify({
        model: 'grok-2-image-1212',
        prompt: "Test connection",
        n: 1,
        response_format: 'b64_json'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Health Check Error:', errorData?.error?.message || response.statusText);
      return false;
    }

    const data = await response.json();
    return data && data.data && data.data.length > 0;
  } catch (error) {
    console.error('API Health Check Error:', error);
    return false;
  }
};

/**
 * Helper function to extract base64 data from a data URL
 */
const getBase64FromDataUrl = (dataUrl: string): string => {
  if (!dataUrl) return '';
  const parts = dataUrl.split(',');
  return parts.length > 1 ? parts[1] : '';
};

/**
 * Analyzes a logo to extract its main colors and features
 * @param logoDataUrl The logo as a data URL
 * @returns A promise with the logo description
 */
const analyzeLogo = async (logoDataUrl: string): Promise<{ colors: string[], description: string }> => {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        // Create a canvas to analyze the logo
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image onto the canvas
        ctx?.drawImage(img, 0, 0);
        
        // Sample colors from different parts of the logo
        const colorSamples: string[] = [];
        const samplePoints = [
          { x: Math.floor(img.width * 0.25), y: Math.floor(img.height * 0.25) },
          { x: Math.floor(img.width * 0.75), y: Math.floor(img.height * 0.25) },
          { x: Math.floor(img.width * 0.25), y: Math.floor(img.height * 0.75) },
          { x: Math.floor(img.width * 0.75), y: Math.floor(img.height * 0.75) },
          { x: Math.floor(img.width * 0.5), y: Math.floor(img.height * 0.5) },
        ];
        
        samplePoints.forEach(point => {
          const pixelData = ctx?.getImageData(point.x, point.y, 1, 1).data;
          if (pixelData) {
            const hex = `#${pixelData[0].toString(16).padStart(2, '0')}${pixelData[1].toString(16).padStart(2, '0')}${pixelData[2].toString(16).padStart(2, '0')}`;
            if (!colorSamples.includes(hex)) {
              colorSamples.push(hex);
            }
          }
        });
        
        // Filter out near-duplicates and limit to 3 main colors
        const mainColors = colorSamples.slice(0, 3);
        
        // Determine if logo is mostly text or has imagery
        const aspectRatio = img.width / img.height;
        const isWideFormat = aspectRatio > 2.5;
        
        // Create a description based on the analysis
        let description = "a logo with ";
        if (mainColors.length > 0) {
          description += `primarily ${mainColors[0]} color`;
          if (mainColors.length > 1) {
            description += ` and ${mainColors[1]} accent`;
          }
        }
        
        if (isWideFormat) {
          description += ", primarily text-based in a horizontal format";
        } else if (aspectRatio < 0.8) {
          description += ", in a vertical/tall format";
        } else {
          description += ", with a balanced square-like format";
        }
        
        resolve({
          colors: mainColors,
          description: description
        });
      };
      
      img.onerror = () => {
        // Fallback if analysis fails
        resolve({
          colors: ['unknown'],
          description: 'a professional company logo'
        });
      };
      
      // Load the image for analysis
      img.src = logoDataUrl;
      
    } catch (error) {
      console.error('Error analyzing logo:', error);
      resolve({
        colors: ['unknown'],
        description: 'a professional company logo'
      });
    }
  });
};

/**
 * Adds a logo to the specified position of the generated image
 * @param baseImage Base64 string of the generated image
 * @param logoImage Base64 string of the logo
 * @param position Position to place the logo
 * @returns Promise with the combined image as base64 string
 */
const addLogoToImage = async (
  baseImage: string, 
  logoImage: string, 
  position: FlyerFormState['logoPosition'] = 'top-right'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Create base image
      const img = new Image();
      img.onload = () => {
        // Set canvas size to match base image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the base image
        ctx?.drawImage(img, 0, 0);
        
        // Create and draw logo
        const logo = new Image();
        logo.onload = () => {
          // Calculate logo size (15% of the canvas width, maintaining aspect ratio)
          const logoWidth = canvas.width * 0.15;
          const logoHeight = (logo.height / logo.width) * logoWidth;
          
          // Padding as percentage of canvas
          const padding = canvas.width * 0.03; // 3% padding
          
          // Calculate position based on the selection
          let x: number, y: number;
          
          switch (position) {
            case 'top-left':
              x = padding;
              y = padding;
              break;
            case 'top':
              x = (canvas.width - logoWidth) / 2;
              y = padding;
              break;
            case 'top-right':
              x = canvas.width - logoWidth - padding;
              y = padding;
              break;
            case 'left':
              x = padding;
              y = (canvas.height - logoHeight) / 2;
              break;
            case 'right':
              x = canvas.width - logoWidth - padding;
              y = (canvas.height - logoHeight) / 2;
              break;
            case 'bottom-left':
              x = padding;
              y = canvas.height - logoHeight - padding;
              break;
            case 'bottom':
              x = (canvas.width - logoWidth) / 2;
              y = canvas.height - logoHeight - padding;
              break;
            case 'bottom-right':
              x = canvas.width - logoWidth - padding;
              y = canvas.height - logoHeight - padding;
              break;
            default:
              // Default to top-right if position is not recognized
              x = canvas.width - logoWidth - padding;
              y = padding;
          }
          
          // Draw logo at the calculated position
          ctx?.drawImage(logo, x, y, logoWidth, logoHeight);
          
          // Return the combined image
          resolve(canvas.toDataURL('image/jpeg'));
        };
        
        // Handle logo loading error
        logo.onerror = () => {
          reject(new Error('Failed to load logo image'));
        };
        
        // Set logo source (base64)
        logo.src = logoImage;
      };
      
      // Handle base image loading error
      img.onerror = () => {
        reject(new Error('Failed to load base image'));
      };
      
      // Set base image source (base64)
      img.src = baseImage;
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generates a flyer using xAI's image generation API
 * 
 * @param formState The form data containing the description and optional logo
 * @returns A promise with the generated flyer information
 */
export const generateFlyer = async (formState: FlyerFormState): Promise<GeneratedFlyer> => {
  if (!formState.description || formState.description.trim().length < 10) {
    throw new FlyerApiError('Please provide a detailed description of at least 10 characters', 'VALIDATION_ERROR');
  }
  
  if (!xaiApiKey) {
    throw new FlyerApiError('API key is required to generate flyers', 'API_KEY_MISSING');
  }
  
  try {
    // Generate the flyer with xAI using the user's description
    console.log('Generating flyer with xAI...');
    
    const response = await fetch('https://api.x.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${xaiApiKey}`
      },
      body: JSON.stringify({
        model: 'grok-2-image-1212',
        prompt: formState.description,
        n: 1,
        response_format: 'b64_json'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new FlyerApiError(
        errorData?.error?.message || `Request failed with status ${response.status}`,
        'API_ERROR',
        response.status
      );
    }

    const data = await response.json();
    
    if (!data.data || !data.data[0] || !data.data[0].b64_json) {
      throw new FlyerApiError('No image generated', 'API_ERROR');
    }
    
    // Convert base64 to a data URL
    let imageUrl = `data:image/jpeg;base64,${data.data[0].b64_json}`;
    
    // Add the logo to the image if one was provided
    if (formState.logoPreview) {
      try {
        console.log(`Adding logo to ${formState.logoPosition || 'top-right'} of flyer...`);
        imageUrl = await addLogoToImage(
          imageUrl, 
          formState.logoPreview, 
          formState.logoPosition
        );
      } catch (logoError) {
        console.error('Error adding logo overlay:', logoError);
        // Continue with the original image if logo overlay fails
      }
    }
    
    return {
      id: Date.now().toString(),
      imageUrl: imageUrl
    };
  } catch (error: any) {
    console.error('Error generating flyer:', error);
    
    if (error instanceof FlyerApiError) {
      throw error;
    }
    
    throw new FlyerApiError(error.message || 'An unexpected error occurred', 'GENERAL_ERROR');
  }
};
