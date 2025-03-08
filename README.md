# Instagram Caption Generator

![Tech Stack](https://img.shields.io/badge/Tech%20Stack-React%20%7C%20Vite%20%7C%20TypeScript-blue)
![License](https://img.shields.io/badge/License-MIT-green)

An AI-powered Instagram Caption Generator that creates engaging, customized captions for your posts. Built with React and Vite for optimal performance.

## 🚀 Features

- **Multiple Post Types**
  - Actionable
  - Inspiring
  - Promotional
  - Reels
  - Stories

- **Customizable Tones**
  - Fun
  - Poetic
  - Casual
  - Informative
  - Formal
  - Witty

- **Additional Options**
  - Hashtag Generation
  - Emoji Integration
  - Character Length Control (50-100 characters)

## 🛠️ Tech Stack

- React 18
- Vite
- TypeScript
- Material-UI
- AI Integration

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/EverestNinja/Ai-Caption.git
```

2. Install dependencies:
```bash
cd Ai-Caption
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
```env
VITE_API_KEY=your_api_key_here
VITE_API_URL=your_api_url_here
```

4. Start the development server:
```bash
npm run dev
```

## ⚙️ Environment Setup

### Required Environment Variables

Create a `.env` file in the root directory with these variables:

```env
# API Configuration
VITE_API_KEY=your_api_key_here
VITE_API_URL=your_api_url_here

# Optional Configuration
VITE_MAX_RETRIES=3
VITE_TIMEOUT=30000
```

### How to Get API Keys

1. Sign up at [API Provider]
2. Go to Dashboard → API Keys
3. Generate a new API key
4. Copy the key to your `.env` file

### Environment Files

- `.env`: Default environment variables
- `.env.local`: Local overrides (git ignored)
- `.env.production`: Production settings
- `.env.development`: Development settings

## 💡 Usage

1. Select your post type
2. Choose your preferred tone
3. Enter a brief description (minimum 5 characters)
4. Toggle hashtags and emojis as needed
5. Click Generate to create your caption

## 🔧 Troubleshooting

Common issues and solutions:

1. **API Key Issues**
   - Verify your API key in the `.env` file
   - Check if the key has proper permissions
   - Ensure the key is active and not expired

2. **Build Errors**
   - Run `npm clean-install` to refresh dependencies
   - Check if all environment variables are set
   - Clear browser cache and reload

3. **Generation Failures**
   - Verify your internet connection
   - Check API rate limits
   - Ensure description meets minimum requirements

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Developer

Built with ❤️ by [Tech.Everest](https://github.com/EverestNinja)

## 🔗 Links

- [Repository](https://github.com/EverestNinja/Ai-Caption)
- [Issues](https://github.com/EverestNinja/Ai-Caption/issues)

---
