// Types
type PostType = 'promotional' | 'engagement' | 'testimonial' | 'event' | 'product-launch' | 'custom';
type BusinessType = 'restaurant' | 'computer-shop' | 'clothing' | 'coffee-shop' | 'custom';

interface FormField {
  id: string;
  label: string;
  placeholder?: string;
  type?: 'select' | 'multiline';
  options?: { value: string; label: string; }[];
  required?: boolean;
  tooltip?: string;
  multiline?: boolean;
  rows?: number;
  dependsOn?: { field: string; value: string; };
}

// Form field definitions
export const POST_TYPES: Array<{ value: PostType; label: string }> = [
  { value: 'promotional', label: 'Promotional Post' },
  { value: 'engagement', label: 'Engagement Post' },
  { value: 'testimonial', label: 'Testimonial Post' },
  { value: 'event', label: 'Event Post' },
  { value: 'product-launch', label: 'Product Launch Post' },
  { value: 'custom', label: 'Custom Post' }
];

export const BUSINESS_TYPES: Array<{ value: BusinessType; label: string }> = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'computer-shop', label: 'Computer Shop' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'coffee-shop', label: 'Coffee Shop' },
  { value: 'custom', label: 'Custom Business' }
];

export const FORM_FIELDS: { [key in PostType]: FormField[] } = {
  promotional: [
    { 
      id: 'product', 
      label: "What Are You Selling?", 
      placeholder: "e.g., Handmade Candles",
      tooltip: "Enter the product or service you want to promote"
    },
    { 
      id: 'offer', 
      label: "What's the Deal?", 
      placeholder: "e.g., Buy 2, Get 1 Free",
      tooltip: "Describe your special offer or promotion"
    },
    { 
      id: 'audience', 
      label: "Who's It For?", 
      placeholder: "e.g., Candle Lovers",
      tooltip: "Specify your target audience"
    },
    { 
      id: 'cta', 
      label: "What Should They Do?",
      type: 'select',
      options: [
        { value: 'Shop Now', label: 'Shop Now' },
        { value: 'Grab It', label: 'Grab It' },
        { value: 'Claim Deal', label: 'Claim Deal' },
        { value: 'Check It Out', label: 'Check It Out' },
        { value: 'custom', label: 'Custom CTA' }
      ],
      tooltip: "Choose a call-to-action for your post"
    },
    {
      id: 'customCta',
      label: 'Enter Custom CTA',
      placeholder: 'e.g., Limited Time Offer, Act Fast',
      tooltip: 'Enter your custom call to action',
      required: false,
      dependsOn: { field: 'cta', value: 'custom' }
    },
    {
      id: 'tone',
      label: "How Should It Sound?",
      type: 'select',
      options: [
        { value: 'exciting', label: 'Exciting' },
        { value: 'urgent', label: 'Urgent' },
        { value: 'friendly', label: 'Friendly' },
        { value: 'custom', label: 'Custom Tone' }
      ],
      tooltip: "Select the tone for your promotional message"
    },
    {
      id: 'customTone',
      label: 'Enter Custom Tone',
      placeholder: 'e.g., Mysterious, Energetic, Bold',
      tooltip: 'Describe your custom tone',
      required: false,
      dependsOn: { field: 'tone', value: 'custom' }
    },
    { 
      id: 'description', 
      label: "Describe Your Post", 
      placeholder: "e.g., Promoting our new summer collection with a special discount",
      tooltip: "Describe your post in at least 3 words",
      required: true,
      multiline: true,
      rows: 3
    }
  ],
  engagement: [
    { id: 'topic', label: "What's Your Question or Hook?", placeholder: "e.g., What's your go-to snack?" },
    { id: 'tiein', label: "How's It Tied to Your Business?", placeholder: "e.g., Our Bakery" },
    {
      id: 'goal',
      label: "What's Your Goal?",
      type: 'select',
      options: [
        { value: 'comments', label: 'Get Comments' },
        { value: 'chat', label: 'Start a Chat' },
        { value: 'shares', label: 'Get Shares' },
        { value: 'custom', label: 'Custom Goal' }
      ]
    },
    {
      id: 'customGoal',
      label: 'Enter Custom Goal',
      placeholder: 'e.g., Gather Testimonials, Build Community',
      tooltip: 'Describe your custom engagement goal',
      required: false,
      dependsOn: { field: 'goal', value: 'custom' }
    },
    {
      id: 'tone',
      label: "How Should It Feel?",
      type: 'select',
      options: [
        { value: 'casual', label: 'Casual' },
        { value: 'fun', label: 'Fun' },
        { value: 'curious', label: 'Curious' },
        { value: 'custom', label: 'Custom Tone' }
      ]
    },
    {
      id: 'customTone',
      label: 'Enter Custom Tone',
      placeholder: 'e.g., Thoughtful, Provocative, Intriguing',
      tooltip: 'Describe your custom tone',
      required: false,
      dependsOn: { field: 'tone', value: 'custom' }
    },
    { 
      id: 'description', 
      label: "Describe Your Post", 
      placeholder: "e.g., Asking customers about their favorite menu items",
      tooltip: "Describe your post in at least 3 words",
      required: true,
      multiline: true,
      rows: 3
    }
  ],
  testimonial: [
    { id: 'name', label: "Customer's Name", placeholder: "e.g., Mike R." },
    { id: 'quote', label: "What Did They Say?", placeholder: "e.g., Best service ever!", multiline: true },
    { id: 'product', label: "What's It About?", placeholder: "e.g., Our Cleaning Service" },
    {
      id: 'tone',
      label: "How Should It Feel?",
      type: 'select',
      options: [
        { value: 'happy', label: 'Happy' },
        { value: 'thankful', label: 'Thankful' },
        { value: 'real', label: 'Real' },
        { value: 'custom', label: 'Custom Tone' }
      ]
    },
    {
      id: 'customTone',
      label: 'Enter Custom Tone',
      placeholder: 'e.g., Emotional, Inspirational, Genuine',
      tooltip: 'Describe your custom tone',
      required: false,
      dependsOn: { field: 'tone', value: 'custom' }
    },
    { 
      id: 'description', 
      label: "Describe Your Post", 
      placeholder: "e.g., Sharing a customer's positive experience with our service",
      tooltip: "Describe your post in at least 3 words",
      required: true,
      multiline: true,
      rows: 3
    }
  ],
  event: [
    { id: 'name', label: "What's the Event?", placeholder: "e.g., Holiday Sale" },
    { id: 'datetime', label: "When Is It?", placeholder: "e.g., Dec 15, 10 AM-4 PM" },
    { id: 'location', label: "Where's It Happening?", placeholder: "e.g., Our Store or Online" },
    {
      id: 'cta',
      label: "What Should They Do?",
      type: 'select',
      options: [
        { value: 'Join Us', label: 'Join Us' },
        { value: 'RSVP Now', label: 'RSVP Now' },
        { value: 'Don\'t Miss Out', label: 'Don\'t Miss Out' },
        { value: 'custom', label: 'Custom CTA' }
      ]
    },
    {
      id: 'customCta',
      label: 'Enter Custom CTA',
      placeholder: 'e.g., Secure Your Spot, Register Today',
      tooltip: 'Enter your custom call to action',
      required: false,
      dependsOn: { field: 'cta', value: 'custom' }
    },
    {
      id: 'tone',
      label: "How Should It Sound?",
      type: 'select',
      options: [
        { value: 'exciting', label: 'Exciting' },
        { value: 'welcoming', label: 'Welcoming' },
        { value: 'urgent', label: 'Urgent' },
        { value: 'custom', label: 'Custom Tone' }
      ]
    },
    {
      id: 'customTone',
      label: 'Enter Custom Tone',
      placeholder: 'e.g., Exclusive, Celebratory, Prestigious',
      tooltip: 'Describe your custom tone',
      required: false,
      dependsOn: { field: 'tone', value: 'custom' }
    },
    { 
      id: 'description', 
      label: "Describe Your Post", 
      placeholder: "e.g., Announcing our annual summer sale event",
      tooltip: "Describe your post in at least 3 words",
      required: true,
      multiline: true,
      rows: 3
    }
  ],
  'product-launch': [
    { id: 'product', label: "What's the New Product?", placeholder: "e.g., Eco-Friendly Mug" },
    { id: 'feature', label: "What Makes It Special?", placeholder: "e.g., Keeps Drinks Hot for 12 Hours" },
    { id: 'avail', label: "When Can They Get It?", placeholder: "e.g., Available Now" },
    {
      id: 'cta',
      label: "What Should They Do?",
      type: 'select',
      options: [
        { value: 'Shop Now', label: 'Shop Now' },
        { value: 'Get Yours', label: 'Get Yours' },
        { value: 'Learn More', label: 'Learn More' },
        { value: 'custom', label: 'Custom CTA' }
      ]
    },
    {
      id: 'customCta',
      label: 'Enter Custom CTA',
      placeholder: 'e.g., Pre-Order Today, Be The First',
      tooltip: 'Enter your custom call to action',
      required: false,
      dependsOn: { field: 'cta', value: 'custom' }
    },
    {
      id: 'tone',
      label: "How Should It Sound?",
      type: 'select',
      options: [
        { value: 'exciting', label: 'Exciting' },
        { value: 'bold', label: 'Bold' },
        { value: 'friendly', label: 'Friendly' },
        { value: 'custom', label: 'Custom Tone' }
      ]
    },
    {
      id: 'customTone',
      label: 'Enter Custom Tone',
      placeholder: 'e.g., Innovative, Futuristic, Revolutionary',
      tooltip: 'Describe your custom tone',
      required: false,
      dependsOn: { field: 'tone', value: 'custom' }
    },
    { 
      id: 'description', 
      label: "Describe Your Post", 
      placeholder: "e.g., Introducing our new eco-friendly product line",
      tooltip: "Describe your post in at least 3 words",
      required: true,
      multiline: true,
      rows: 3
    }
  ],
  custom: [
    {
      id: 'tone',
      label: 'Select Tone',
      type: 'select',
      options: [
        { value: 'funny', label: 'Funny' },
        { value: 'sarcastic', label: 'Sarcastic' },
        { value: 'professional', label: 'Professional' },
        { value: 'inspirational', label: 'Inspirational' },
        { value: 'romantic', label: 'Romantic' },
        { value: 'custom', label: 'Custom Tone' }
      ],
      tooltip: 'Choose a tone for your caption',
      multiline: false
    },
    {
      id: 'customTone',
      label: 'Enter Custom Tone',
      placeholder: 'e.g., Mysterious, Energetic, Bold',
      tooltip: 'Describe your custom tone',
      required: false,
      dependsOn: { field: 'tone', value: 'custom' }
    },
    {
      id: 'topic',
      label: 'Select Topic',
      type: 'select',
      options: [
        { value: 'fitness', label: 'Fitness' },
        { value: 'travel', label: 'Travel' },
        { value: 'business', label: 'Business' },
        { value: 'love', label: 'Love' },
        { value: 'gaming', label: 'Gaming' },
        { value: 'custom', label: 'Custom Topic' }
      ],
      tooltip: 'Choose the main topic for your caption'
    },
    {
      id: 'customTopic',
      label: 'Enter Custom Topic',
      placeholder: 'e.g., Sustainability, Education, Photography',
      tooltip: 'Describe your custom topic',
      required: false,
      dependsOn: { field: 'topic', value: 'custom' }
    },
    {
      id: 'audience',
      label: 'Target Audience',
      type: 'select',
      options: [
        { value: 'general', label: 'General' },
        { value: 'millennials', label: 'Millennials' },
        { value: 'genz', label: 'Gen Z' },
        { value: 'professionals', label: 'Professionals' },
        { value: 'custom', label: 'Custom Audience' }
      ],
      tooltip: 'Select your target audience'
    },
    {
      id: 'customAudience',
      label: 'Enter Custom Audience',
      placeholder: 'e.g., Parents, Dog Owners, Tech Enthusiasts',
      tooltip: 'Describe your custom audience',
      required: false,
      dependsOn: { field: 'audience', value: 'custom' }
    },
    {
      id: 'style',
      label: 'Select Writing Style',
      type: 'select',
      options: [
        { value: 'casual', label: 'Casual' },
        { value: 'poetic', label: 'Poetic' },
        { value: 'witty', label: 'Witty' },
        { value: 'storytelling', label: 'Storytelling' },
        { value: 'corporate', label: 'Corporate' },
        { value: 'custom', label: 'Custom Style' }
      ],
      tooltip: 'Choose a writing style',
      multiline: false
    },
    {
      id: 'customStyle',
      label: 'Enter Custom Style',
      placeholder: 'e.g., Minimalist, Technical, Philosophical',
      tooltip: 'Describe your custom writing style',
      required: false,
      dependsOn: { field: 'style', value: 'custom' }
    },
    {
      id: 'cta',
      label: 'Select Call to Action',
      type: 'select',
      options: [
        { value: 'shop-now', label: 'Shop Now' },
        { value: 'tag-friend', label: 'Tag a Friend' },
        { value: 'comment-below', label: 'Comment Below' },
        { value: 'swipe-up', label: 'Swipe Up' },
        { value: 'custom', label: 'Custom CTA' }
      ],
      tooltip: 'Choose a call to action',
      multiline: false
    },
    {
      id: 'customCta',
      label: 'Enter Custom CTA',
      placeholder: 'e.g., Join our community, Try for free',
      tooltip: 'Enter your custom call to action',
      required: false,
      dependsOn: { field: 'cta', value: 'custom' }
    },
    { 
      id: 'description', 
      label: "Describe Your Post", 
      placeholder: "e.g., Creating a fun and engaging post for our followers",
      tooltip: "Describe your post in at least 3 words",
      required: true,
      multiline: true,
      rows: 3
    }
  ]
}; 