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