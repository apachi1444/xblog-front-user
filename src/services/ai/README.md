# AI Content Generation Service

This module provides a flexible, extensible AI-powered content generation service for creating SEO-optimized content.

## Architecture

The architecture is designed to be modular and extensible, allowing for easy integration of different AI models:

```
services/ai/
├── types.ts             # Type definitions and interfaces
├── gemini.ts            # Google Gemini AI implementation
├── factory.ts           # Factory for creating AI model instances
├── contentGeneration.ts # Content generation service
├── settings.json        # SEO best practices and settings
└── index.ts             # Main exports and default instances
```

## Features

- **Model Agnostic**: The architecture supports multiple AI models through a common interface
- **SEO Optimization**: Built-in SEO best practices for different content types
- **Structured Content**: Generate structured content with consistent formats
- **Mock Support**: Fallback to mock implementations when API keys aren't available
- **Scoring**: Automatic scoring of generated content based on SEO best practices

## Usage

### Basic Usage

```typescript
import { contentGenerationService } from 'src/services/ai/contentGeneration';

// Generate a title
const titleResult = await contentGenerationService.generateTitle('digital marketing', {
  language: 'en',
  targetCountry: 'US'
});

console.log(titleResult.title); // "10 Essential Digital Marketing Strategies for 2023"
console.log(titleResult.score); // 85
```

### Using Different AI Models

```typescript
import { AIModelFactoryImpl } from 'src/services/ai/factory';
import { ContentGenerationService } from 'src/services/ai/contentGeneration';

// Create a factory
const factory = new AIModelFactoryImpl();

// Create a specific AI model
const geminiModel = factory.createModel('gemini', {
  apiKey: 'your-api-key',
  modelVersion: 'gemini-pro'
});

// Create a content generation service with this model
const customContentService = new ContentGenerationService({
  aiService: geminiModel
});

// Use the service
const result = await customContentService.generateMeta(
  'Digital Marketing Guide', 
  'SEO optimization'
);
```

## API Reference

### Content Generation Service

The `ContentGenerationService` provides methods for generating different types of content:

- `generateTitle(primaryKeyword, options)`: Generate an SEO-optimized title
- `generateMeta(title, primaryKeyword, options)`: Generate meta title, description, and URL slug
- `generateKeywords(primaryKeyword, options)`: Generate related keywords
- `generateSections(title, keyword, secondaryKeywords, options)`: Generate content outline with sections
- `generateImages(title, description, options)`: Generate image placeholders (mock implementation)
- `regenerateContent(type, data, options)`: Regenerate specific content with higher variation

### AI Model Interface

All AI model implementations must implement the `AIModelService` interface:

- `generateText(prompt, params)`: Generate text based on a prompt
- `generateStructuredContent(prompt, format, params)`: Generate structured content (JSON)
- `getModelInfo()`: Get information about the model

## Configuration

The SEO best practices and settings are defined in `settings.json`. This file contains guidelines for:

- Title optimization
- Meta information (title, description, URL slug)
- Keyword selection
- Content structure
- General SEO best practices

## Mock Implementation

When API keys aren't available or for testing purposes, the system automatically falls back to a mock implementation that simulates AI responses.

## Adding New AI Models

To add a new AI model:

1. Create a new implementation of the `AIModelService` interface
2. Add the model to the factory in `factory.ts`
3. Update the model selection logic as needed

## Environment Variables

- `REACT_APP_GEMINI_API_KEY`: API key for Google's Gemini AI model
