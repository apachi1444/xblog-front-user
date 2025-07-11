# SEO Optimization API Specification

## Overview

The SEO Optimization API provides intelligent suggestions to improve specific SEO criteria scores by analyzing current content and proposing optimized alternatives. This API integrates with the existing SEO criteria evaluation system to help users achieve maximum scores for each criterion.

## API Endpoint

```
POST /api/seo/optimize
```

## Request Body Structure

### Base Request Schema

```typescript
interface OptimizationRequest {
  // Criterion identification
  criterionId: number;
  
  // Current form data context
  currentFormData: {
    step1: Step1FormData;
    step2?: Step2FormData;
    step3?: Step3FormData;
    generatedHtml?: string;
    images?: ArticleImage[];
    toc?: ArticleToc[];
    faq?: ArticleFaq[];
  };
  
  // Target field to optimize
  targetField: {
    path: string;           // e.g., "step1.title", "step1.metaDescription"
    currentValue: string;   // Current value of the field
    fieldType: FieldType;   // Type of field being optimized
  };
  
  // Optimization context
  context: {
    language: string;       // Target language (e.g., "english", "french")
    targetAudience?: string;
    toneOfVoice?: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
  };
  
  // Optimization preferences
  preferences?: {
    preserveLength?: boolean;     // Try to maintain similar length
    preserveStyle?: boolean;      // Maintain writing style
    aggressiveness?: 'conservative' | 'moderate' | 'aggressive';
  };
}
```

### Field Types

```typescript
enum FieldType {
  TITLE = 'title',
  META_TITLE = 'metaTitle', 
  META_DESCRIPTION = 'metaDescription',
  URL_SLUG = 'urlSlug',
  CONTENT_DESCRIPTION = 'contentDescription',
  SECTION_CONTENT = 'sectionContent',
  FULL_HTML = 'fullHtml'
}
```

## Criterion-Specific Request Examples

### 1. Title Optimization (Criterion 101: Keyword in Title)

```json
{
  "criterionId": 101,
  "currentFormData": {
    "step1": {
      "title": "How to Build a Website",
      "primaryKeyword": "WordPress website builder",
      "secondaryKeywords": ["website creation", "web development"],
      "language": "english"
    }
  },
  "targetField": {
    "path": "step1.title",
    "currentValue": "How to Build a Website",
    "fieldType": "title"
  },
  "context": {
    "language": "english",
    "primaryKeyword": "WordPress website builder",
    "secondaryKeywords": ["website creation", "web development"]
  },
  "preferences": {
    "preserveLength": true,
    "aggressiveness": "moderate"
  }
}
```

### 2. Meta Description Optimization (Criterion 103)

```json
{
  "criterionId": 103,
  "currentFormData": {
    "step1": {
      "title": "WordPress Website Builder Guide",
      "metaDescription": "Learn how to build websites",
      "primaryKeyword": "WordPress website builder",
      "contentDescription": "Complete guide to building professional websites..."
    }
  },
  "targetField": {
    "path": "step1.metaDescription",
    "currentValue": "Learn how to build websites",
    "fieldType": "metaDescription"
  },
  "context": {
    "language": "english",
    "primaryKeyword": "WordPress website builder",
    "secondaryKeywords": ["website creation", "web development"]
  }
}
```

### 3. Content Length Optimization (Criterion 106)

```json
{
  "criterionId": 106,
  "currentFormData": {
    "step1": {
      "contentDescription": "Brief guide to WordPress",
      "primaryKeyword": "WordPress website builder"
    },
    "generatedHtml": "<body><h1>WordPress Guide</h1><p>Short content...</p></body>"
  },
  "targetField": {
    "path": "step1.contentDescription",
    "currentValue": "Brief guide to WordPress",
    "fieldType": "contentDescription"
  },
  "context": {
    "language": "english",
    "primaryKeyword": "WordPress website builder",
    "targetAudience": "beginners"
  },
  "preferences": {
    "aggressiveness": "aggressive"
  }
}
```

## Response Schema

```typescript
interface OptimizationResponse {
  success: boolean;
  
  // Optimization result
  optimization: {
    originalValue: string;
    optimizedValue: string;
    improvementReason: string;
    expectedScoreIncrease: number;
  };
  
  // Analysis details
  analysis: {
    currentScore: number;
    maxPossibleScore: number;
    projectedScore: number;
    issuesFound: string[];
    improvementAreas: string[];
  };
  
  // Alternative suggestions
  alternatives?: {
    value: string;
    reason: string;
    scoreImpact: number;
  }[];
  
  // Metadata
  metadata: {
    processingTime: number;
    confidence: number;        // 0-100
    criterionId: number;
    optimizationStrategy: string;
  };
}
```

## Response Examples

### Successful Title Optimization

```json
{
  "success": true,
  "optimization": {
    "originalValue": "How to Build a Website",
    "optimizedValue": "WordPress Website Builder: Complete Guide to Building Professional Sites",
    "improvementReason": "Added primary keyword at the beginning and included power words 'Complete' and 'Professional'",
    "expectedScoreIncrease": 8
  },
  "analysis": {
    "currentScore": 0,
    "maxPossibleScore": 10,
    "projectedScore": 10,
    "issuesFound": [
      "Primary keyword 'WordPress website builder' not found in title",
      "Title lacks power words",
      "Title could be more specific"
    ],
    "improvementAreas": [
      "Include primary keyword at the beginning",
      "Add power words for engagement",
      "Specify the target outcome"
    ]
  },
  "alternatives": [
    {
      "value": "WordPress Website Builder Tutorial: Step-by-Step Guide",
      "reason": "Alternative with 'Tutorial' power word",
      "scoreImpact": 9
    },
    {
      "value": "Ultimate WordPress Website Builder Guide for Beginners",
      "reason": "Targets specific audience with 'Ultimate' power word",
      "scoreImpact": 10
    }
  ],
  "metadata": {
    "processingTime": 1200,
    "confidence": 95,
    "criterionId": 101,
    "optimizationStrategy": "keyword_placement_and_power_words"
  }
}
```

## Criterion-Specific Optimization Strategies

### Content-Based Criteria (201, 202, 401, 402, 403)

For criteria that analyze generated HTML content:

```json
{
  "criterionId": 202,
  "currentFormData": {
    "generatedHtml": "<body>...</body>",
    "step1": {
      "primaryKeyword": "WordPress website builder"
    }
  },
  "targetField": {
    "path": "generatedHtml",
    "currentValue": "<body>...</body>",
    "fieldType": "fullHtml"
  },
  "context": {
    "optimizationType": "keyword_density",
    "targetDensity": "1.5-2.5%",
    "primaryKeyword": "WordPress website builder"
  }
}
```

### Link-Based Criteria (204, 205, 206)

```json
{
  "criterionId": 204,
  "currentFormData": {
    "generatedHtml": "<body>...</body>",
    "step2": {
      "externalLinks": []
    }
  },
  "targetField": {
    "path": "generatedHtml",
    "currentValue": "<body>...</body>",
    "fieldType": "fullHtml"
  },
  "context": {
    "optimizationType": "external_links",
    "suggestedLinkCount": "2-3",
    "topicRelevance": "high"
  }
}
```

## Error Handling

```typescript
interface OptimizationError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  suggestions?: string[];
}
```

### Error Codes

- `INVALID_CRITERION`: Unknown criterion ID
- `INSUFFICIENT_CONTEXT`: Missing required context data
- `OPTIMIZATION_FAILED`: AI failed to generate optimization
- `QUOTA_EXCEEDED`: API quota limit reached
- `INVALID_FIELD_PATH`: Target field path is invalid

## Implementation Considerations

### 1. AI Model Integration
- Use advanced language models (GPT-4, Claude) for content optimization
- Implement criterion-specific prompts for each optimization type
- Include context about SEO best practices in prompts

### 2. Caching Strategy
- Cache optimization results for identical inputs
- Implement user-specific optimization history
- Cache criterion analysis patterns

### 3. Rate Limiting
- Implement per-user rate limits
- Different limits for different criterion types
- Premium users get higher limits

### 4. Quality Assurance
- Validate optimized content against criterion requirements
- Ensure optimizations don't break other criteria
- Implement confidence scoring for suggestions

### 5. Monitoring & Analytics
- Track optimization success rates per criterion
- Monitor user acceptance of suggestions
- A/B test different optimization strategies

## Integration with Frontend

The frontend optimization modal would call this API and display:

1. **Current Analysis**: Show why the current value fails
2. **Optimization Preview**: Display the suggested improvement
3. **Impact Prediction**: Show expected score increase
4. **Alternative Options**: Present multiple optimization choices
5. **Apply/Reject**: Allow users to accept or decline suggestions

This API design provides comprehensive SEO optimization capabilities while maintaining flexibility for different criterion types and user preferences.

## Advanced Features

### 1. Batch Optimization

For optimizing multiple criteria simultaneously:

```json
{
  "type": "batch",
  "criterionIds": [101, 102, 103],
  "currentFormData": { ... },
  "optimizationGoals": {
    "priorityOrder": ["title", "metaTitle", "metaDescription"],
    "maxChanges": 3,
    "preserveUserIntent": true
  }
}
```

### 2. Content-Aware Optimization

For HTML content optimization that considers the entire document structure:

```json
{
  "criterionId": 202,
  "contentAnalysis": {
    "currentKeywordDensity": 0.5,
    "targetDensity": 2.0,
    "contentSections": [
      {
        "type": "introduction",
        "wordCount": 150,
        "keywordCount": 0
      },
      {
        "type": "body",
        "wordCount": 800,
        "keywordCount": 4
      }
    ]
  },
  "optimizationStrategy": "natural_keyword_integration"
}
```

### 3. Real-time Validation

The API should validate optimizations against all criteria to ensure improvements don't negatively impact other scores:

```json
{
  "validation": {
    "checkAllCriteria": true,
    "preventRegressions": true,
    "minimumOverallScore": 75
  }
}
```

### 4. Learning & Personalization

Track user preferences and optimization acceptance rates:

```json
{
  "userPreferences": {
    "userId": "user123",
    "preferredStyle": "professional",
    "acceptanceHistory": {
      "titleOptimizations": 0.85,
      "metaOptimizations": 0.92
    }
  }
}
```

## Security & Privacy

### 1. Data Protection
- Encrypt all content in transit and at rest
- Implement data retention policies
- Allow users to delete optimization history

### 2. Content Filtering
- Validate input content for malicious code
- Sanitize HTML content before processing
- Implement content moderation for inappropriate material

### 3. API Security
- Require authentication tokens
- Implement request signing
- Rate limiting per user/IP

## Performance Optimization

### 1. Response Time Targets
- Simple optimizations (title, meta): < 2 seconds
- Content optimizations: < 5 seconds
- Batch optimizations: < 10 seconds

### 2. Scalability
- Horizontal scaling for AI processing
- Queue system for heavy optimizations
- CDN for caching common optimizations

### 3. Fallback Strategies
- Rule-based optimizations when AI fails
- Cached suggestions for common patterns
- Graceful degradation during high load

This comprehensive API specification ensures robust, scalable, and user-friendly SEO optimization capabilities.
