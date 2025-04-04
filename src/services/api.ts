interface FormState {
  postType: string;
  businessType: string;
  customBusinessType?: string;
  numberOfGenerations: number;
  includeHashtags: boolean;
  includeEmojis: boolean;
  image?: File | null;
  [key: string]: any;
}

interface GeneratedCaption {
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

class ApiError extends Error {
  constructor(public status: number, message: string, public details?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;
const API_ENDPOINT = 'https://api.x.ai/v1/chat/completions';
const DEFAULT_MODEL = 'grok-2-latest';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
};

const generatePrompt = async (formState: FormState): Promise<string> => {
  const {
    postType,
    businessType,
    customBusinessType,
    includeHashtags,
    includeEmojis,
    image,
    ...customFields
  } = formState;

  let businessDescription = '';
  if (businessType === 'custom' && customBusinessType) {
    businessDescription = customBusinessType;
  } else {
    const businessTypeMap: Record<string, string> = {
      'restaurant': 'a restaurant business',
      'computer-shop': 'a computer and technology store',
      'clothing': 'a clothing and fashion business',
      'coffee-shop': 'a coffee shop and café'
    };
    businessDescription = businessTypeMap[businessType] || 'a business';
  }

  let postContext = '';
  let additionalDetails = '';

  switch (postType) {
    case 'promotional':
      postContext = `a promotional post for ${businessDescription}`;
      additionalDetails = `Product: ${customFields.product || 'products/services'}
Offer: ${customFields.offer || 'special offer'}
Target Audience: ${customFields.audience || 'customers'}
Call to Action: ${customFields.cta || 'take action'}
Tone: ${customFields.tone || 'engaging'}`;
      break;

    case 'engagement':
      postContext = `an engagement post for ${businessDescription}`;
      additionalDetails = `Question/Hook: ${customFields.topic || 'engaging question'}
Business Tie-in: ${customFields.tiein || businessDescription}
Goal: ${customFields.goal || 'engagement'}
Tone: ${customFields.tone || 'conversational'}`;
      break;

    case 'testimonial':
      postContext = `a testimonial post for ${businessDescription}`;
      additionalDetails = `Customer Name: ${customFields.name || 'customer'}
Testimonial Quote: ${customFields.quote || 'positive feedback'}
About: ${customFields.product || 'our products/services'}
Tone: ${customFields.tone || 'appreciative'}`;
      break;

    case 'event':
      postContext = `an event post for ${businessDescription}`;
      additionalDetails = `Event Name: ${customFields.name || 'special event'}
Date/Time: ${customFields.datetime || 'upcoming date'}
Location: ${customFields.location || 'our location'}
Call to Action: ${customFields.cta || 'attend'}
Tone: ${customFields.tone || 'exciting'}`;
      break;

    case 'product-launch':
      postContext = `a product launch post for ${businessDescription}`;
      additionalDetails = `New Product: ${customFields.product || 'new product'}
Key Feature: ${customFields.feature || 'standout feature'}
Availability: ${customFields.avail || 'available now'}
Call to Action: ${customFields.cta || 'purchase'}
Tone: ${customFields.tone || 'exciting'}`;
      break;

    case 'custom':
      postContext = `a custom post for ${businessDescription}`;
      const tones = customFields.tone ? customFields.tone.split(',').join(', ') : 'natural';
      const styles = customFields.style ? customFields.style.split(',').join(', ') : 'conversational';
      const ctas = customFields.cta ? customFields.cta.split(',').join(', ') : 'engage';
      
      additionalDetails = `Tone(s): ${tones}
Topic: ${customFields.topic || 'general'}
Target Audience: ${customFields.audience || 'followers'}
Writing Style(s): ${styles}
Call to Action(s): ${ctas}
Photo Description: ${customFields.photoDescription || 'visual content'}`;
      break;

    default:
      postContext = `a social media post for ${businessDescription}`;
  }

  let imagePrompt = '';
  if (image) {
    imagePrompt = `
IMAGE CONTEXT:
The post includes an image that should be referenced naturally in the caption. Imagine what this image might contain based on the post details and business type, then reference it appropriately. For example, you might say "As shown in the image..." or "This picture captures..." to create a seamless connection between the visual and text.`;
  }

  let stylizationPrompt = '';
  if (includeHashtags && includeEmojis) {
    stylizationPrompt = `
STYLING INSTRUCTIONS:
1. Emojis: Include 4-6 relevant and varied emojis strategically placed throughout the caption to enhance emotional impact. Place them at the beginning of sentences, after key points, or to highlight important elements.

2. Hashtags: Add 4-7 hashtags at the end of the caption (separated from the main text with line breaks). Include:
   - 2-3 popular industry hashtags (e.g. #${businessType.replace('-', '')} #social #marketing)
   - 1-2 branded hashtags related to ${businessDescription}
   - 1-2 specific hashtags related to the post content
   - Ensure hashtags are properly formatted with no spaces`;
  } else if (includeHashtags) {
    stylizationPrompt = `
HASHTAG INSTRUCTIONS:
Add 4-7 hashtags at the end of the caption (separated from the main text with line breaks). Include:
- 2-3 popular industry hashtags (e.g. #${businessType.replace('-', '')} #social #marketing)
- 1-2 branded hashtags related to ${businessDescription}
- 1-2 specific hashtags related to the post content
- Ensure hashtags are properly formatted with no spaces`;
  } else if (includeEmojis) {
    stylizationPrompt = `
EMOJI INSTRUCTIONS:
Include 4-6 relevant and varied emojis strategically placed throughout the caption to enhance emotional impact. Place them at the beginning of sentences, after key points, or to highlight important elements. Ensure emojis match the tone and business type.`;
  }

  const structureGuidance = `
STRUCTURE GUIDANCE:
1. Start with an attention-grabbing hook using clear, concise language
2. Follow with 1-2 sentences that provide value, context, or details
3. End with a specific call-to-action that encourages engagement
4. Use appropriate line breaks to improve readability on mobile
5. Total length should be 150-250 characters for the main content (excluding hashtags)`;

  const randomSeed = Math.floor(Math.random() * 1000);

  const prompt = `Create an engaging social media caption for ${postContext}.

POST DETAILS:
${additionalDetails}
${imagePrompt}

${stylizationPrompt}

${structureGuidance}

IMPORTANT: Use randomization seed #${randomSeed} to ensure this caption is unique and different from previous generations.

The caption should:
- Be authentic and conversational
- Have a strong opening hook
- Match the specified tone and business context
- Be optimized for social media engagement
- Sound like it was written by a professional social media manager, not AI`;

  return prompt;
};

const getSystemPrompt = (): string => {
  return `You are an expert social media content creator specializing in writing engaging captions for businesses. You have years of experience crafting high-performing content across all major platforms.

CORE STRENGTHS:
- Writing in authentic, relatable human voices
- Crafting hooks that stop users from scrolling
- Using psychological triggers that drive engagement
- Incorporating emojis and hashtags strategically
- Creating captions that convert to clicks, comments, and sales

APPROACH:
Each caption you write should feel natural, on-brand, and tailored to both the business and post type. Avoid generic marketing language, AI-sounding patterns, or overly formal tones unless specifically requested.

When adding emojis, place them strategically to enhance meaning, not randomly. When adding hashtags, include a mix of popular and niche ones for maximum discovery.

Always generate COMPLETELY UNIQUE content for each request. Never repeat formulas, patterns, or exact phrases from previous generations.`;
};

const prepareApiRequest = async (formState: FormState, temperature: number = 0.7, seed?: number): Promise<any> => {
  const prompt = await generatePrompt(formState);
  
  const request: any = {
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: getSystemPrompt()
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature,
    stream: false,
    max_tokens: 500,
    presence_penalty: 0.7,
    frequency_penalty: 0.7
  };

  if (seed !== undefined) {
    request.seed = seed;
  }

  if (formState.image) {
    try {
      const base64Image = await imageToBase64(formState.image);
      request.messages[1].content = [
        { type: "text", text: prompt },
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${base64Image}`,
            detail: "high"
          }
        }
      ];
    } catch (error) {
      console.error("Error processing image:", error);
    }
  }

  return request;
};

const makeApiRequest = async (formState: FormState, temperature: number = 0.7, retryCount: number = 0, seed?: number): Promise<ApiResponse> => {
  try {
    let adjustedTemperature = formState.postType === 'custom' 
      ? Math.min(0.9, temperature + 0.1)
      : temperature;
    
    adjustedTemperature += (Math.random() * 0.15);

    adjustedTemperature = Math.max(0.5, Math.min(0.95, adjustedTemperature));

    const requestBody = await prepareApiRequest(formState, adjustedTemperature, seed);
    
    const apiKey = import.meta.env.VITE_XAPI_KEY || import.meta.env.VITE_API_KEY;
    if (!apiKey) {
      throw new ApiError(401, 'API key is missing. Please check your environment configuration.');
    }

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      if (response.status === 429 && retryCount < MAX_RETRIES) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '1');
        await wait(retryAfter * 1000 || RETRY_DELAY);
        return makeApiRequest(formState, temperature, retryCount + 1, seed);
      }

      if (response.status === 401) {
        throw new ApiError(401, 'API authentication failed. Please check your API key.', errorData);
      }

      throw new ApiError(
        response.status,
        errorData?.error?.message || `API request failed with status ${response.status}`,
        errorData
      );
    }

    const data: ApiResponse = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(0, 'Network error. Please check your internet connection.', error);
    }
    
    throw new ApiError(500, 'An unexpected error occurred while generating captions.', error);
  }
};

const validateFormState = (formState: FormState): void => {
  if (!formState.postType) {
    throw new Error('Post type is required');
  }
  
  if (!formState.businessType) {
    throw new Error('Business type is required');
  }
  
  if (formState.businessType === 'custom' && !formState.customBusinessType) {
    throw new Error('Custom business type is required when selecting "custom" business type');
  }

  if (formState.numberOfGenerations < 1 || formState.numberOfGenerations > 5) {
    throw new Error('Number of generations must be between 1 and 5');
  }
};

export const generateCaptions = async (formState: FormState): Promise<GeneratedCaption[]> => {
  try {
    validateFormState(formState);
    
    if (formState.numberOfGenerations > 1) {
      const promises = Array.from(
        { length: formState.numberOfGenerations }, 
        async (_, index) => {
          const temperature = 0.7 + (index * 0.05);
          const seed = Date.now() + index;
          
          try {
            const data = await makeApiRequest(formState, temperature, 0, seed);
            return {
              id: index + 1,
              text: data.choices[0].message.content.trim()
            };
          } catch (error) {
            console.error(`Error generating caption ${index + 1}:`, error);
            return null;
          }
        }
      );

      const results = await Promise.all(promises);
      const successfulResults = results
        .filter((result): result is GeneratedCaption => result !== null)
        .map((result, index) => ({
          ...result!,
          id: index + 1
        }));

      if (successfulResults.length === 0) {
        throw new Error('Failed to generate any captions. Please try again.');
      }

      return successfulResults;
    }

    const seed = Date.now();
    const data = await makeApiRequest(formState, 0.7, 0, seed);
    return [{
      id: 1,
      text: data.choices[0].message.content.trim()
    }];
  } catch (error) {
    console.error('Caption generation error:', error);
    
    if (error instanceof ApiError) {
      throw new Error(error.message || 'Failed to generate captions. Please try again.');
    }
    
    throw error instanceof Error 
      ? error 
      : new Error('An unexpected error occurred during caption generation.');
  }
};

export const mockGenerateCaptions = async (formState: FormState): Promise<GeneratedCaption[]> => {
  await wait(1500);

  const postTypeEmojis: Record<string, string[]> = {
    'promotional': ['🔥', '💰', '✨', '💯', '🏷️', '🛍️'],
    'engagement': ['💬', '👋', '🤔', '👀', '🙌', '❓'],
    'testimonial': ['⭐', '🙏', '👏', '💕', '🤩', '💯'],
    'event': ['📆', '🎉', '🎊', '🎯', '✨', '📢'],
    'product-launch': ['🚀', '✨', '🆕', '💫', '📣', '🔝'],
    'custom': ['🌟', '💫', '✅', '💡', '🎯', '💪']
  };

  const businessEmojis: Record<string, string[]> = {
    'restaurant': ['🍽️', '🍕', '🍷', '🍝', '🥂', '😋'],
    'computer-shop': ['💻', '🖥️', '📱', '🔌', '⌨️', '🖱️'],
    'clothing': ['👗', '👔', '👠', '🛍️', '👕', '🧥'],
    'coffee-shop': ['☕', '🥐', '🍰', '🥤', '☀️', '🍩'],
    'custom': ['✨', '🏢', '🌟', '📊', '🤝', '🔍']
  };

  const getRandomEmojis = (emojiSet: string[], count: number) => {
    const shuffled = [...emojiSet].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const generateHashtags = (postType: string, businessType: string) => {
    const commonHashtags = ['#SocialMedia', '#Marketing', '#ContentCreation'];
    
    const businessHashtags: Record<string, string[]> = {
      'restaurant': ['#FoodLovers', '#Cuisine', '#Foodie', '#DiningExperience'],
      'computer-shop': ['#Tech', '#Gadgets', '#TechLovers', '#Innovation'],
      'clothing': ['#Fashion', '#Style', '#OOTD', '#Trendy', '#FashionLovers'],
      'coffee-shop': ['#CoffeeLover', '#CafeVibes', '#ButFirstCoffee', '#CoffeeTime'],
      'custom': ['#Business', '#Service', '#Quality', '#Solutions']
    };
    
    const postTypeHashtags: Record<string, string[]> = {
      'promotional': ['#Deal', '#SpecialOffer', '#LimitedTime', '#Sale'],
      'engagement': ['#ShareYourThoughts', '#JoinTheConversation', '#TellUs'],
      'testimonial': ['#CustomerLove', '#Testimonial', '#HappyCustomers'],
      'event': ['#SaveTheDate', '#UpcomingEvent', '#DontMissOut'],
      'product-launch': ['#NewProduct', '#JustLaunched', '#NewArrivals', '#FirstLook']
    };
    
    const business = businessHashtags[businessType] || businessHashtags['custom'];
    const postTags = postTypeHashtags[postType] || [];
    
    const allTags = [...business, ...postTags, ...commonHashtags];
    const shuffled = allTags.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 3) + 4).join(' ');
  };

  const getBusinessReference = (businessType: string, customBusinessType?: string) => {
    if (businessType === 'custom' && customBusinessType) {
      return customBusinessType;
    }
    
    const businessNames: Record<string, string[]> = {
      'restaurant': ['Our Restaurant', 'Our Kitchen', 'Our Dining Experience', 'Our Menu'],
      'computer-shop': ['Our Tech Store', 'Our Electronics Shop', 'Our Gadget Hub'],
      'clothing': ['Our Boutique', 'Our Fashion Store', 'Our Collection', 'Our Style Studio'],
      'coffee-shop': ['Our Café', 'Our Coffee Shop', 'Our Coffee House', 'Our Barista Team']
    };
    
    const options = businessNames[businessType] || ['Our Business'];
    return options[Math.floor(Math.random() * options.length)];
  };

  const generateCaption = (index: number) => {
    const postEmojis = formState.includeEmojis 
      ? getRandomEmojis(postTypeEmojis[formState.postType] || postTypeEmojis['custom'], 2)
      : [];
    const busEmojis = formState.includeEmojis
      ? getRandomEmojis(businessEmojis[formState.businessType] || businessEmojis['custom'], 2)
      : [];
    
    const emojis = formState.includeEmojis 
      ? [...postEmojis, ...busEmojis].join(' ') + ' '
      : '';
    
    const hashtags = formState.includeHashtags 
      ? '\n\n' + generateHashtags(formState.postType, formState.businessType)
      : '';
    
    const businessName = getBusinessReference(formState.businessType, formState.customBusinessType);
    
    const templates = [
      `${emojis}This is sample caption #${index} for ${businessName}! We're excited to share our latest updates with you.${formState.image ? '\n\nAs you can see in this image, we\'ve prepared something special for you.' : ''}\n\nStay tuned for more amazing content coming your way soon.${hashtags}`,
      
      `${emojis}Caption sample #${index}: ${businessName} brings you the best experience every time.\n\n${formState.image ? 'This picture perfectly captures what we\'re all about - quality and dedication.' : 'We focus on quality and dedication in everything we do.'}\n\nDon't forget to follow us for more updates!${hashtags}`,
      
      `${emojis}Welcome to sample #${index}! At ${businessName}, we believe in making every moment count.\n\n${formState.image ? 'This image shows just one example of our commitment to excellence.' : 'Our commitment to excellence sets us apart from the competition.'}\n\nWhat do you think? Let us know in the comments below!${hashtags}`,
      
      `${emojis}Sample caption #${index} coming your way from ${businessName}!\n\n${formState.image ? 'Check out this image showcasing our attention to detail and quality.' : 'Our attention to detail and quality is what makes us special.'}\n\nTag a friend who would appreciate this!${hashtags}`,
      
      `${emojis}Here's sample caption #${index}! ${businessName} is always working to bring you the best.\n\n${formState.image ? 'This image represents our dedication to serving you better every day.' : 'We're dedicated to serving you better every day.'}\n\nLike this post if you agree!${hashtags}`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  };

  return Array.from({ length: formState.numberOfGenerations }, (_, index) => ({
    id: index + 1,
    text: generateCaption(index + 1)
  }));
};

export default {
  generateCaptions,
  mockGenerateCaptions
}; 