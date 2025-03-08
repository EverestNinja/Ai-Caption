interface GenerationRequest {
  postType: string;
  captionTone: string;
  generationCount: number;
  useHashtags: boolean;
  useEmojis: boolean;
  postDescription: string;
}

interface GeneratedCaption {
  id: number;
  text: string;
}

interface XAIResponse {
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

class APIError extends Error {
  constructor(public status: number, message: string, public details?: any) {
    super(message);
    this.name = 'APIError';
  }
}

const MAX_RETRIES = 2;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generatePrompt = (params: GenerationRequest): string => {
  const { postType, captionTone, postDescription, useHashtags, useEmojis } = params;
  
  let prompt = '';
  
  // Special handling for Fun tone
  if (captionTone.toLowerCase() === 'fun') {
    prompt = `Generate a super entertaining and humorous Instagram caption that will make people laugh! The caption should be witty, playful, and include clever wordplay or puns if possible. This is for a ${postType.toLowerCase()} post about: ${postDescription}.`;
  } else {
    prompt = `Generate an engaging Instagram caption for a ${postType.toLowerCase()} post with a ${captionTone.toLowerCase()} tone. The post is about: ${postDescription}.`;
  }
  
  // More explicit instructions about hashtags
  prompt += useHashtags 
    ? ' You MUST include exactly 3-5 relevant hashtags at the end of the caption.'
    : ' Do NOT include any hashtags in the caption.';
  
  // More explicit instructions about emojis
  prompt += useEmojis 
    ? ' You MUST include 2-3 relevant emojis naturally placed throughout the caption.'
    : ' Do NOT include any emojis in the caption.';

  prompt += ' The caption should be concise (150-220 characters) and engaging, following Instagram best practices.';
  
  return prompt;
};

const makeAPIRequest = async (params: GenerationRequest, temperature: number = 0.7, retryCount: number = 0): Promise<XAIResponse> => {
  try {
    // Increase temperature for fun tone to get more creative results
    if (params.captionTone.toLowerCase() === 'fun') {
      temperature = Math.min(temperature + 0.2, 1.0); // Increase temperature but cap at 1.0
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_XAPI_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-2-latest",
        messages: [
          {
            role: "system",
            content: `You are an expert Instagram caption writer with an amazing sense of humor. Create engaging, authentic captions that drive engagement.
            
${params.captionTone.toLowerCase() === 'fun' ? `When writing fun captions:
1. Use clever wordplay and puns
2. Include humorous observations
3. Be playful and light-hearted
4. Use conversational language
5. Create relatable humor
6. Add unexpected twists
7. Keep it positive and entertaining` : ''}

Important Rules:
1. ONLY include hashtags if explicitly requested
2. ONLY include emojis if explicitly requested
3. Focus on brevity and emotional connection
4. Keep the tone consistent throughout
5. Follow the user's instructions exactly regarding hashtags and emojis
6. Never add extra elements that weren't requested`
          },
          {
            role: "user",
            content: generatePrompt(params)
          }
        ],
        temperature,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      // Handle rate limiting
      if (response.status === 429 && retryCount < MAX_RETRIES) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '1');
        await wait(retryAfter * 1000);
        return makeAPIRequest(params, temperature, retryCount + 1);
      }

      // Handle token expiration
      if (response.status === 401) {
        throw new APIError(401, 'API key has expired or is invalid. Please check your API key.', errorData);
      }

      throw new APIError(
        response.status,
        errorData?.error?.message || `API request failed with status ${response.status}`,
        errorData
      );
    }

    const data: XAIResponse = await response.json();
    
    // Validate response structure
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, 'Network error. Please check your internet connection.', error);
    }
    throw new APIError(500, 'An unexpected error occurred while generating captions.', error);
  }
};

const validateGenerationParams = (params: GenerationRequest): void => {
  if (!params.postType || !params.captionTone || !params.postDescription) {
    throw new Error('Missing required parameters: postType, captionTone, and postDescription are required');
  }
  if (params.generationCount < 1 || params.generationCount > 5) {
    throw new Error('Generation count must be between 1 and 5');
  }
  if (params.postDescription.length < 10) {
    throw new Error('Post description must be at least 10 characters long');
  }
};

export const generateCaptions = async (params: GenerationRequest): Promise<GeneratedCaption[]> => {
  try {
    console.log('Generating captions with params:', params);
    validateGenerationParams(params);

    if (params.generationCount > 1) {
      const promises = Array.from({ length: params.generationCount }, async (_, index) => {
        const temperature = 0.7 + (index * 0.1); // Increase temperature for variety
        const data = await makeAPIRequest(params, temperature);
        
        return {
          id: index + 1,
          text: data.choices[0].message.content.trim()
        };
      });

      const results = await Promise.allSettled(promises);
      const successfulResults = results
        .filter((result): result is PromiseFulfilledResult<GeneratedCaption> => result.status === 'fulfilled')
        .map(result => result.value);

      if (successfulResults.length === 0) {
        throw new Error('Failed to generate any captions. Please try again.');
      }

      return successfulResults;
    }

    // Single generation
    const data = await makeAPIRequest(params);
    return [{
      id: 1,
      text: data.choices[0].message.content.trim()
    }];
  } catch (error) {
    console.error('Generation Error:', error);
    
    if (error instanceof APIError) {
      // Enhance error message based on status code
      switch (error.status) {
        case 401:
          throw new Error('Authentication failed. Please check your API key.');
        case 429:
          throw new Error('Too many requests. Please try again in a few moments.');
        case 503:
          throw new Error('Service temporarily unavailable. Please try again later.');
        default:
          throw new Error(error.message || 'Failed to generate captions. Please try again.');
      }
    }
    
    throw error instanceof Error ? error : new Error('An unexpected error occurred.');
  }
};

export const mockGenerateCaptions = async (params: GenerationRequest): Promise<GeneratedCaption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Generate mock captions based on the parameters
  return Array.from({ length: params.generationCount }, (_, index) => ({
    id: index + 1,
    text: generateMockCaption(params, index + 1),
  }));
};

const generateMockCaption = (params: GenerationRequest, index: number): string => {
  const { postType, captionTone, postDescription, useHashtags, useEmojis } = params;
  
  const emojis = useEmojis ? getEmojisForType(postType) : '';
  const hashtags = useHashtags ? getHashtagsForType(postType) : '';
  
  return `${emojis} Caption ${index} for your ${postType.toLowerCase()} post with a ${captionTone.toLowerCase()} tone:\n\n${postDescription}\n\n${hashtags}`;
};

const getEmojisForType = (postType: string): string => {
  const emojiMap: { [key: string]: string } = {
    'Actionable': '💪 🎯',
    'Inspiring': '✨ 💫',
    'Promotional': '🚀 💎',
    'Reels': '🎬 🎵',
    'Stories': '📱 ⭐',
  };
  return emojiMap[postType] || '🌟 ✨';
};

const getHashtagsForType = (postType: string): string => {
  const hashtagMap: { [key: string]: string[] } = {
    'Actionable': ['#motivation', '#goals', '#success'],
    'Inspiring': ['#inspiration', '#mindset', '#positivity'],
    'Promotional': ['#offer', '#limited', '#exclusive'],
    'Reels': ['#reels', '#trending', '#viral'],
    'Stories': ['#story', '#lifestyle', '#daily'],
  };
  
  const commonHashtags = ['#instagram', '#social', '#content'];
  const typeHashtags = hashtagMap[postType] || [];
  
  return [...typeHashtags, ...commonHashtags].join(' ');
}; 