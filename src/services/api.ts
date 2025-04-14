// Types
export interface FormState {
  postType: string;
  businessType: string;
  customBusinessType?: string;
  numberOfGenerations: number;
  includeHashtags: boolean;
  includeEmojis: boolean;
  captionLength: number;
  image?: File | null;
  imagePreview?: string | null;
  [key: string]: any;
}

export interface GeneratedCaption {
  id: number;
  text: string;
}

interface ApiResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}

// First, let's add a type definition for the message content
interface ChatMessage {
  role: string;
  content: string | ContentItem[];
}

interface ContentItem {
  type: string;
  text?: string;
  image_url?: {
    url: string;
  };
}

// Let's update the ApiRequest type to match our ChatMessage interface
interface ApiRequest {
  model: string;
  messages: ChatMessage[];
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
}

// Constants
const API_ENDPOINT = import.meta.env.VITE_API_BASE_URL || 'https://api.x.ai/v1/chat/completions';
const API_KEY = import.meta.env.VITE_XAPI_KEY || import.meta.env.VITE_API_KEY;
const DEFAULT_MODEL = 'grok-2-latest';
const VISION_MODEL = 'grok-2-vision-1212';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string = 'API_ERROR',
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Utility functions
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getEmojiSet = (businessType: string): string[] => {
  const emojiSets: Record<string, string[]> = {
    'restaurant': ['🍽️', '🍕', '🍔', '🥗', '🍷', '😋', '👨‍🍳', '🌟'],
    'computer-shop': ['💻', '🖥️', '📱', '🔌', '⌨️', '🖱️', '⚡', '🔧'],
    'clothing': ['👗', '👔', '👟', '🧥', '👒', '✨', '🛍️', '👕'],
    'coffee-shop': ['☕', '🍰', '🥐', '🍮', '☀️', '😊', '👨‍🍳', '🌟'],
    'custom': ['✨', '🎯', '🚀', '💫', '📈', '🙌', '💡', '🌟']
  };

  return emojiSets[businessType] || emojiSets['custom'];
};

// Function to convert image to base64
const imageToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Get the base64 string without the prefix
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const generatePrompt = (formState: FormState): string => {
  const { postType, businessType, customBusinessType, includeHashtags, includeEmojis, image, captionLength, ...fields } = formState;
  const businessTypeText = businessType === 'custom' ? customBusinessType : businessType;
  
  // Define caption length instructions with more specific word count guidance
  const lengthMap = {
    1: 'very short and concise (around 1-2 sentences, maximum 30 words total)',
    2: 'moderate length (around 2-3 sentences, between 30-60 words total)',
    3: 'detailed and comprehensive (around 4-5 sentences, between 60-100 words total)'
  };
  
  const lengthDescription = lengthMap[captionLength as keyof typeof lengthMap] || 'moderate length (around 2-3 sentences, between 30-60 words total)';
  
  // Start with image instruction if image is provided
  let prompt = '';
  if (image) {
    prompt = `PRIORITY INSTRUCTION: The uploaded image is the most important element to focus on. Generate a caption that directly describes and relates to the visual elements in this specific image. `;
  }
  
  // Add length and post type instructions
  prompt += `Create a ${lengthDescription} ${postType} social media caption for a ${businessTypeText} business. `;
  
  if (image) {
    prompt += `Make sure the caption explicitly mentions key elements visible in the image. `;
  }
  
  prompt += `IMPORTANT: The length constraint is a high priority requirement. `;
  
  // Add specific instructions based on post type
  switch (postType) {
    case 'promotional':
      prompt += `The caption should promote ${fields.product} with the offer "${fields.offer}". `;
      prompt += `Target audience: ${fields.audience}. `;
      prompt += `Call to action: ${fields.cta === 'custom' ? fields.customCta : fields.cta}. `;
      prompt += `Tone: ${fields.tone === 'custom' ? fields.customTone : fields.tone}. `;
      break;
    case 'engagement':
      prompt += `Topic: ${fields.topic}. `;
      prompt += `Tie-in: ${fields.tiein}. `;
      prompt += `Goal: ${fields.goal === 'custom' ? fields.customGoal : fields.goal}. `;
      prompt += `Tone: ${fields.tone === 'custom' ? fields.customTone : fields.tone}. `;
      break;
    case 'testimonial':
      prompt += `Customer name: ${fields.name}. `;
      prompt += `Quote: "${fields.quote}". `;
      prompt += `Product/service: ${fields.product}. `;
      prompt += `Tone: ${fields.tone === 'custom' ? fields.customTone : fields.tone}. `;
      break;
    case 'event':
      prompt += `Event name: ${fields.name}. `;
      prompt += `Date/time: ${fields.datetime}. `;
      prompt += `Location: ${fields.location}. `;
      prompt += `Call to action: ${fields.cta === 'custom' ? fields.customCta : fields.cta}. `;
      prompt += `Tone: ${fields.tone === 'custom' ? fields.customTone : fields.tone}. `;
      break;
    case 'product-launch':
      prompt += `Product: ${fields.product}. `;
      prompt += `Key feature: ${fields.feature}. `;
      prompt += `Availability: ${fields.avail}. `;
      prompt += `Call to action: ${fields.cta === 'custom' ? fields.customCta : fields.cta}. `;
      prompt += `Tone: ${fields.tone === 'custom' ? fields.customTone : fields.tone}. `;
      break;
    case 'custom':
      prompt += `Tone: ${fields.tone === 'custom' ? fields.customTone : fields.tone}. `;
      prompt += `Topic: ${fields.topic === 'custom' ? fields.customTopic : fields.topic}. `;
      prompt += `Target audience: ${fields.audience === 'custom' ? fields.customAudience : fields.audience}. `;
      prompt += `Writing style: ${fields.style === 'custom' ? fields.customStyle : fields.style}. `;
      prompt += `Call to action: ${fields.cta === 'custom' ? fields.customCta : fields.cta}. `;
      break;
  }

  // Add image description if provided
  if (fields.description) {
    prompt += `Post description: ${fields.description}. `;
  }

  // Add hashtags instruction if enabled
  if (includeHashtags) {
    prompt += 'Include relevant hashtags at the end. ';
  }

  // Add emojis instruction if enabled
  if (includeEmojis) {
    prompt += 'Use emojis to make the caption more engaging. ';
  } else {
    prompt += 'DO NOT use any emojis in the caption. Make sure the caption is completely free of emojis. ';
  }
  
  // Reiterate length constraint at the end
  prompt += `Remember to keep the caption ${lengthDescription}.`;
  
  // Final reminder about image priority if image is present
  if (image) {
    prompt += ` The caption MUST directly reference what's visible in the uploaded image.`;
  }
  
  return prompt;
};

const makeApiRequest = async (requestBody: ApiRequest): Promise<ApiResponse> => {
  if (!API_KEY) {
    throw new ApiError('API key is missing', 'AUTHENTICATION_ERROR');
  }

  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.error?.message || `API request failed with status ${response.status}`,
          'API_ERROR',
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      lastError = error as Error;
      if (error instanceof ApiError && error.status === 429) {
        // Rate limit hit, wait and retry
        await wait(RETRY_DELAY * attempt);
        continue;
      }
      break;
    }
  }

  throw new ApiError(
    lastError instanceof Error ? lastError.message : 'Network error occurred',
    'NETWORK_ERROR'
  );
};

const validateFormState = (formState: FormState): void => {
  if (!formState.postType) {
    throw new Error('Post type is required');
  }

  if (!formState.businessType) {
    throw new Error('Business type is required');
  }

  if (formState.businessType === 'custom' && !formState.customBusinessType) {
    throw new Error('Custom business type is required');
  }

  if (formState.numberOfGenerations < 1 || formState.numberOfGenerations > 5) {
    throw new Error('Number of generations must be between 1 and 5');
  }
};

// Helper function to generate relevant hashtags
const generateHashtags = (businessType: string, postType: string): string[] => {
  const businessHashtags: Record<string, string[]> = {
    'restaurant': ['#foodie', '#foodporn', '#instafood', '#yummy', '#delicious'],
    'computer-shop': ['#tech', '#gadgets', '#electronics', '#innovation', '#digital'],
    'clothing': ['#fashion', '#style', '#ootd', '#trendy', '#shoplocal'],
    'coffee-shop': ['#coffee', '#cafe', '#coffeetime', '#barista', '#coffeelover'],
    'custom': ['#business', '#success', '#entrepreneur', '#growth', '#branding']
  };

  const postTypeHashtags: Record<string, string[]> = {
    'promotional': ['#specialoffer', '#limitedtime', '#deals', '#discount', '#sale'],
    'engagement': ['#community', '#engagement', '#interaction', '#feedback', '#opinion'],
    'testimonial': ['#testimonial', '#review', '#feedback', '#satisfied', '#happycustomer'],
    'event': ['#event', '#announcement', '#comingsoon', '#savethedate', '#joinus'],
    'product-launch': ['#newproduct', '#launch', '#innovation', '#exclusive', '#firstlook']
  };

  const hashtags = [
    ...(businessHashtags[businessType] || businessHashtags['custom']),
    ...(postTypeHashtags[postType] || [])
  ];

  // Shuffle and select 3-5 hashtags
  return hashtags
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 3);
};

export const generateCaptions = async (formState: FormState): Promise<GeneratedCaption[]> => {
  validateFormState(formState);
  
  const captions: GeneratedCaption[] = [];
  
  // Different temperature settings for each generation
  const temperatureSettings = {
    1: 0.7,  // Balanced and professional
    2: 0.9,  // More creative and varied
    3: 0.8,  // Balanced with some creativity
    4: 0.95, // Very creative and unique
    5: 0.85  // Balanced with high engagement
  };

  // Different prompt styles for each generation
  const promptStyles = {
    1: "Write a professional and polished caption that maintains a strong brand voice while strictly adhering to the specified caption length.",
    2: "Create a creative and engaging caption that stands out from typical social media posts without exceeding the requested word count.",
    3: "Generate a conversational and relatable caption that connects with the audience while keeping within the specified length constraints.",
    4: "Craft a unique and memorable caption that uses creative wordplay and storytelling, but be careful not to exceed the specified word limit.",
    5: "Write an attention-grabbing caption that encourages high engagement and interaction while maintaining the exact requested length."
  };

  // Different tone modifiers for each generation
  const toneModifiers = {
    1: "professional and authoritative",
    2: "creative and innovative",
    3: "friendly and conversational",
    4: "unique and memorable",
    5: "engaging and interactive"
  };

  for (let i = 0; i < formState.numberOfGenerations; i++) {
    const generationNumber = i + 1;
    const temperature = temperatureSettings[generationNumber as keyof typeof temperatureSettings];
    const promptStyle = promptStyles[generationNumber as keyof typeof promptStyles];
    const toneModifier = toneModifiers[generationNumber as keyof typeof toneModifiers];
    
    // Modify the prompt with generation-specific style
    const modifiedPrompt = `${generatePrompt(formState)}\n\n${promptStyle}\nTone should be ${toneModifier}.`;
    
    // Inside generateCaptions function, update the system message to prioritize image
    // Create base messages array for the API request
    const systemMessage = formState.image 
      ? "You are a visual-focused social media caption generator that prioritizes describing the uploaded image content. Focus primarily on what's visible in the image while following length requirements. Generate engaging, image-specific captions."
      : "You are a creative social media caption generator that strictly follows length requirements. Generate engaging, unique captions that match the exact length specifications provided by the user. Be concise and precise with your word count.";
    
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: systemMessage
      },
      {
        role: "user",
        content: modifiedPrompt
      }
    ];

    try {
      // Select the appropriate model based on whether an image is included
      const modelToUse = formState.image ? VISION_MODEL : DEFAULT_MODEL;
      
      // If an image is provided, process it and include in the API request
      if (formState.image) {
        try {
          const imageBase64 = await imageToBase64(formState.image);
          
          // Add image content to the messages
          messages.push({
            role: "user",
            content: [
              { type: "text", text: "Here is the image to reference for the caption:" },
              {
                type: "image_url", 
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          });
        } catch (error) {
          console.error("Error processing image:", error);
          throw new Error(`Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      const requestBody = {
        model: modelToUse,
        messages: messages,
        temperature: temperature,
        max_tokens: 200, // Increased token limit to accommodate image descriptions
        top_p: 0.9,
        frequency_penalty: 0.7,
        presence_penalty: 0.7,
      };

      const response = await makeApiRequest(requestBody);
      
      if (response.choices && response.choices.length > 0) {
        let caption = response.choices[0].message.content.trim();
        
        // Only add emojis if explicitly enabled
        if (formState.includeEmojis) {
          const emojiSet = getEmojiSet(formState.businessType);
          const randomEmojis = [...emojiSet]
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.floor(Math.random() * 2) + 2);
          
          // Add emojis at the beginning and end
          caption = `${randomEmojis.join(' ')} ${caption} ${randomEmojis.sort(() => 0.5 - Math.random()).join(' ')}`;
        }
        
        // Only add hashtags if explicitly enabled
        if (formState.includeHashtags) {
          const hashtags = generateHashtags(formState.businessType, formState.postType);
          caption = `${caption}\n\n${hashtags.join(' ')}`;
        }
        
        captions.push({
          id: generationNumber,
          text: caption
        });
      }
    } catch (error) {
      console.error(`Error generating caption ${generationNumber}:`, error);
      throw error;
    }
  }

  return captions;
}; 