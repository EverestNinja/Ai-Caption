// Types
export interface SimpleModeFormState {
  businessType: string;
  product?: string;
  additionalDetails?: string;
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
  content: string;
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
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Error handling
export class SimpleApiError extends Error {
  constructor(
    message: string,
    public code: string = 'API_ERROR',
    public status?: number
  ) {
    super(message);
    this.name = 'SimpleApiError';
  }
}

// Utility functions
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to generate relevant hashtags for the business type
const generateHashtags = (businessType: string): string[] => {
  const defaultHashtags = ['#business', '#entrepreneur', '#success', '#growth', '#marketing'];
  
  // Define common hashtags for different business types
  const businessHashtags: Record<string, string[]> = {
    'restaurant': ['#foodie', '#instafood', '#restaurant', '#delicious', '#dining'],
    'cafe': ['#cafe', '#coffee', '#coffeetime', '#coffeelover', '#localcafe'],
    'bakery': ['#bakery', '#freshbaked', '#desserts', '#pastry', '#homemade'],
    'fitness': ['#fitness', '#workout', '#fitnessmotivation', '#gym', '#health'],
    'clothing': ['#fashion', '#style', '#clothing', '#shop', '#ootd'],
    'beauty': ['#beauty', '#skincare', '#makeup', '#selfcare', '#glam'],
    'tech': ['#tech', '#technology', '#innovation', '#digital', '#software']
  };
  
  // Check if the businessType contains any of our keywords
  const matchingTypes = Object.keys(businessHashtags).filter(type => 
    businessType.toLowerCase().includes(type.toLowerCase())
  );
  
  if (matchingTypes.length > 0) {
    // Get hashtags for all matching business types
    const relevantHashtags = matchingTypes.flatMap(type => businessHashtags[type]);
    
    // Shuffle and return 5 unique hashtags
    return Array.from(new Set(relevantHashtags))
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
  }
  
  // If no specific matches, return default hashtags
  return defaultHashtags;
};

// Helper function to generate relevant emojis for the business type
const getEmojiSet = (businessType: string): string[] => {
  const defaultEmojis = ['✨', '🚀', '💯', '👍', '🔥'];
  
  // Define common emojis for different business types
  const businessEmojis: Record<string, string[]> = {
    'restaurant': ['🍽️', '🍕', '🍔', '🥗', '🍷', '😋', '👨‍🍳', '🌟'],
    'cafe': ['☕', '🍰', '🥐', '🍮', '🥤', '😊', '👨‍🍳', '🌟'],
    'bakery': ['🍰', '🧁', '🍞', '🥖', '🍪', '🥮', '🎂', '🍩'],
    'fitness': ['💪', '🏃‍♀️', '🏋️‍♂️', '🧘‍♀️', '🥗', '🍎', '🥤', '⚡'],
    'clothing': ['👗', '👔', '👟', '🧥', '👒', '✨', '🛍️', '👕'],
    'beauty': ['💄', '💅', '👁️', '✨', '💆‍♀️', '🧖‍♀️', '🌟', '🌸'],
    'tech': ['💻', '📱', '🖥️', '⌨️', '🔌', '🌐', '🚀', '⚡']
  };
  
  // Check if the businessType contains any of our keywords
  const matchingTypes = Object.keys(businessEmojis).filter(type => 
    businessType.toLowerCase().includes(type.toLowerCase())
  );
  
  if (matchingTypes.length > 0) {
    // Get emojis for all matching business types
    const relevantEmojis = matchingTypes.flatMap(type => businessEmojis[type]);
    
    // Shuffle and return 4 unique emojis
    return Array.from(new Set(relevantEmojis))
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }
  
  // If no specific matches, return default emojis
  return defaultEmojis;
};

// Generate the prompt for the API based on simple mode form data
const generateSimplePrompt = (formState: SimpleModeFormState): string => {
  const { businessType, product, additionalDetails } = formState;
  
  let prompt = `Create a social media caption for a "${businessType}" business`;
  
  if (product) {
    prompt += ` focusing on ${product}`;
  }
  
  prompt += `. The caption should be engaging, conversational, and moderate in length (2-3 sentences, 30-60 words total).`;
  
  if (additionalDetails) {
    prompt += ` Additional context: ${additionalDetails}.`;
  }
  
  prompt += ` Include relevant hashtags at the end and use appropriate emojis to make the caption more engaging.`;
  
  return prompt;
};

// Make the API request
const makeApiRequest = async (requestBody: ApiRequest): Promise<ApiResponse> => {
  if (!API_KEY) {
    throw new SimpleApiError('API key is missing', 'AUTHENTICATION_ERROR');
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
        throw new SimpleApiError(
          errorData.error?.message || `API request failed with status ${response.status}`,
          'API_ERROR',
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      lastError = error as Error;
      if (error instanceof SimpleApiError && error.status === 429) {
        // Rate limit hit, wait and retry
        await wait(RETRY_DELAY * attempt);
        continue;
      }
      break;
    }
  }

  throw new SimpleApiError(
    lastError instanceof Error ? lastError.message : 'Network error occurred',
    'NETWORK_ERROR'
  );
};

// Validate the form data
const validateFormState = (formState: SimpleModeFormState): void => {
  if (!formState.businessType || formState.businessType.trim().length === 0) {
    throw new SimpleApiError('Business type is required', 'VALIDATION_ERROR');
  }
};

// Main function to generate captions from simple mode
export const generateSimpleCaptions = async (formState: SimpleModeFormState): Promise<GeneratedCaption[]> => {
  validateFormState(formState);
  
  try {
    // Generate the prompt for the API
    const prompt = generateSimplePrompt(formState);
    
    // Create messages for the API
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: "You are a creative social media caption generator for businesses. Create engaging, conversational captions that include relevant hashtags and emojis. Captions should be moderate in length (2-3 sentences)."
      },
      {
        role: "user",
        content: prompt
      }
    ];
    
    // Create the API request
    const requestBody: ApiRequest = {
      model: DEFAULT_MODEL,
      messages: messages,
      temperature: 0.8, // Balanced with some creativity
      max_tokens: 150,
      top_p: 0.9,
      frequency_penalty: 0.6,
      presence_penalty: 0.6,
    };
    
    // Make the API request
    const response = await makeApiRequest(requestBody);
    
    // Process the response
    if (response.choices && response.choices.length > 0) {
      let caption = response.choices[0].message.content.trim();
      
      // If the caption doesn't have hashtags or emojis, add them
      if (!caption.includes('#')) {
        const hashtags = generateHashtags(formState.businessType);
        caption = `${caption}\n\n${hashtags.join(' ')}`;
      }
      
      if (!containsEmoji(caption)) {
        const emojis = getEmojiSet(formState.businessType);
        caption = `${emojis.slice(0, 2).join(' ')} ${caption} ${emojis.slice(2, 4).join(' ')}`;
      }
      
      // Return the generated caption
      return [{
        id: 1,
        text: caption
      }];
    }
    
    throw new SimpleApiError('No caption was generated', 'NO_CONTENT');
  } catch (error) {
    console.error('Error generating simple caption:', error);
    
    if (error instanceof SimpleApiError) {
      throw error;
    }
    
    throw new SimpleApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      'GENERAL_ERROR'
    );
  }
};

// Helper function to check if a string contains emoji
function containsEmoji(str: string): boolean {
  // Regular expression to match emoji characters
  const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(str);
} 