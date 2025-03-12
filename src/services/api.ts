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
  
  // Base context for different post types
  const postTypeContext: { [key: string]: string } = {
    'actionable': 'motivational and action-oriented content that inspires people to take specific steps',
    'inspiring': 'uplifting and thought-provoking content that touches hearts and minds',
    'promotional': 'engaging promotional content that highlights value without being too salesy',
    'reels': 'fun and trendy short-form video content that captures attention quickly',
    'stories': 'casual and authentic moments that connect with followers in real-time'
  };

  // Tone-specific instructions
  const toneInstructions: { [key: string]: string } = {
    fun: "Make it super entertaining and relatable! Use clever wordplay, current trends, or funny observations. Think of it as chatting with a friend who always makes you laugh.",
    poetic: "Create a lyrical and artistic caption that paints a picture with words. Use metaphors and beautiful language that resonates emotionally.",
    casual: "Keep it conversational and down-to-earth, like you're sharing thoughts with close friends. Be authentic and relatable.",
    informative: "Share insights in an engaging way, mixing expertise with accessibility. Make complex ideas easy to understand while maintaining interest.",
    formal: "Maintain professionalism while being engaging. Think sophisticated yet approachable, like a respected mentor.",
    witty: "Craft a clever and sharp caption that shows intellectual humor. Think subtle wordplay and smart observations that make people think and smile."
  };

  const selectedContext = postTypeContext[postType.toLowerCase()] || postType;
  const selectedTone = toneInstructions[captionTone.toLowerCase()] || 'Keep the tone natural and engaging';

  let prompt = `Create an authentic Instagram caption for ${selectedContext}. ${selectedTone}\n\nThe post is about: ${postDescription}\n\n`;
  
  // More natural hashtag instructions
  if (useHashtags) {
    prompt += 'Include 3-5 highly relevant hashtags that real Instagram users would use. Mix both popular and niche hashtags for better reach. Place them naturally - either integrated into the caption or at the end.\n\n';
  }
  
  // More natural emoji instructions
  if (useEmojis) {
    prompt += 'Sprinkle 2-3 relevant emojis throughout the caption where they feel natural and enhance the message. Use them to emphasize emotions or key points, not just as decorations.\n\n';
  }

  prompt += `Additional guidelines:
- Keep it authentic and conversational (150-220 characters)
- Create a hook that grabs attention in the first line
- Include a call-to-action or question to boost engagement
- Match the writing style of successful ${postType.toLowerCase()} posts
- Make it sound like a real person, not AI-generated
- Consider current social media trends and language`;
  
  return prompt;
};

const makeAPIRequest = async (params: GenerationRequest, temperature: number = 0.7, retryCount: number = 0): Promise<XAIResponse> => {
  try {
    // Dynamic temperature adjustment based on tone and generation count
    let adjustedTemperature = temperature;
    const toneTemperatures: { [key: string]: number } = {
      fun: 0.85,
      poetic: 0.8,
      casual: 0.75,
      informative: 0.65,
      formal: 0.6,
      witty: 0.8
    };
    
    adjustedTemperature = toneTemperatures[params.captionTone.toLowerCase()] || temperature;
    
    // Add some randomness for multiple generations
    if (params.generationCount > 1) {
      adjustedTemperature += Math.random() * 0.15; // Add up to 0.15 randomness
    }
    
    // Ensure temperature stays within valid range
    adjustedTemperature = Math.max(0.5, Math.min(1.0, adjustedTemperature));

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
            content: `You are an expert Instagram content creator who understands modern social media trends and user behavior. Your specialty is writing captions that feel authentic, engaging, and perfectly suited to each post type.

Key Principles:
1. Write like a real person - use natural language, current slang (when appropriate), and conversational tone
2. Understand post context - adapt your style to match the post type and audience expectations
3. Create emotional connections - use storytelling and relatable experiences
4. Drive engagement - include hooks, questions, or calls-to-action
5. Stay current - reference relevant trends and cultural moments
6. Be platform-native - write in a way that feels natural for Instagram

Style Guidelines:
- Vary sentence structure and length for natural flow
- Use line breaks strategically for readability
- Include personal touches and authentic voice
- Balance professionalism with relatability
- Adapt hashtag and emoji usage to feel organic
- Create memorable, shareable content

Remember: Each caption should feel like it was written by a savvy social media user who understands their audience and the platform.`
          },
          {
            role: "user",
            content: generatePrompt(params)
          }
        ],
        temperature: adjustedTemperature,
        stream: false,
        max_tokens: 350, // Increased for more natural responses
        presence_penalty: 0.6, // Encourage more diverse responses
        frequency_penalty: 0.7 // Reduce repetition
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