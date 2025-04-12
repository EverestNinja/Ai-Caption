// Types
export interface FormState {
  postType: string;
  businessType: string;
  customBusinessType?: string;
  numberOfGenerations: number;
  includeHashtags: boolean;
  includeEmojis: boolean;
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

interface ApiRequest {
  model: string;
  messages: { role: string; content: string; }[];
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

const getBusinessDescription = (businessType: string, customBusinessType?: string): string => {
  if (businessType === 'custom' && customBusinessType) {
    return customBusinessType;
  }

  const businessDescriptions: Record<string, string> = {
    'restaurant': 'a restaurant business',
    'computer-shop': 'a computer and technology store',
    'clothing': 'a clothing and fashion business',
    'coffee-shop': 'a coffee shop and café'
  };

  return businessDescriptions[businessType] || 'a business';
};

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

const generatePrompt = (formState: FormState): string => {
  const {
    postType,
    businessType,
    customBusinessType,
    includeHashtags,
    includeEmojis,
    ...customFields
  } = formState;

  const businessDescription = getBusinessDescription(businessType, customBusinessType);
  let prompt = `Create an engaging social media caption for ${businessDescription}. `;

  // Add post type specific details
  switch (postType) {
    case 'promotional':
      prompt += `This is a promotional post highlighting ${customFields.product || 'our products/services'}. `;
      prompt += `Special offer: ${customFields.offer || 'exclusive deal'}. `;
      prompt += `Target audience: ${customFields.audience || 'our valued customers'}. `;
      break;

    case 'engagement':
      prompt += `This is an engagement post asking: "${customFields.topic || 'thought-provoking question'}" `;
      prompt += `related to ${customFields.tiein || businessDescription}. `;
      break;

    case 'testimonial':
      prompt += `This is a testimonial post from ${customFields.name || 'a satisfied customer'}. `;
      prompt += `Their feedback: "${customFields.quote || 'positive experience'}" `;
      break;

    case 'event':
      prompt += `This is an event announcement for ${customFields.name || 'our upcoming event'}. `;
      prompt += `Date/Time: ${customFields.datetime || 'specific date and time'}. `;
      prompt += `Location: ${customFields.location || 'event location'}. `;
      break;

    case 'product-launch':
      prompt += `This is a product launch announcement for ${customFields.product || 'our new product'}. `;
      prompt += `Key features: ${customFields.feature || 'standout features'}. `;
      break;
  }

  // Add styling instructions
  if (includeHashtags) {
    prompt += `Include 3-5 relevant hashtags at the end. `;
  }

  if (includeEmojis) {
    prompt += `Use 2-3 relevant emojis to enhance the message. `;
  }

  // Add tone and style
  prompt += `Tone: ${customFields.tone || 'professional and engaging'}. `;
  prompt += `Style: ${customFields.style || 'conversational and authentic'}. `;

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
    1: "Write a professional and polished caption that maintains a strong brand voice.",
    2: "Create a creative and engaging caption that stands out from typical social media posts.",
    3: "Generate a conversational and relatable caption that connects with the audience.",
    4: "Craft a unique and memorable caption that uses creative wordplay and storytelling.",
    5: "Write an attention-grabbing caption that encourages high engagement and interaction."
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
    
    const requestBody = {
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a creative social media caption generator. Generate engaging, unique captions that stand out."
        },
        {
          role: "user",
          content: modifiedPrompt
        }
      ],
      temperature: temperature,
      max_tokens: 150,
      top_p: 0.9,
      frequency_penalty: 0.7,
      presence_penalty: 0.7,
    };

    try {
      const response = await makeApiRequest(requestBody);
      
      if (response.choices && response.choices.length > 0) {
        let caption = response.choices[0].message.content.trim();
        
        // Add emojis if enabled
        if (formState.includeEmojis) {
          const emojiSet = getEmojiSet(formState.businessType);
          const randomEmojis = [...emojiSet]
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.floor(Math.random() * 2) + 2);
          
          // Add emojis at the beginning and end
          caption = `${randomEmojis.join(' ')} ${caption} ${randomEmojis.sort(() => 0.5 - Math.random()).join(' ')}`;
        }
        
        // Add hashtags if enabled
        if (formState.includeHashtags) {
          const hashtags = generateHashtags(formState.businessType, formState.postType);
          caption = `${caption}\n\n${hashtags}`;
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