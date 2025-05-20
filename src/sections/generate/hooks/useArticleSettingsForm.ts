import { useTranslation } from 'react-i18next';



export const useArticleSettingsForm = () => {
  const { t } = useTranslation();

  // Options for dropdowns
  const articleTypeOptions = [
    { value: "how-to", label: t('article.type.howTo', "How-to guide") },
    { value: "listicle", label: t('article.type.listicle', "Listicle") },
    { value: "tutorial", label: t('article.type.tutorial', "Tutorial") },
    { value: "review", label: t('article.type.review', "Review") },
    { value: "case-study", label: t('article.type.caseStudy', "Case Study") }
  ];

  const articleSizeOptions = [
    { value: "small", label: t('article.size.small', "Small (1200 - 2400 words, 2-3 headings)") },
    { value: "medium", label: t('article.size.medium', "Medium (2400 - 3600 words, 4-5 headings)") },
    { value: "large", label: t('article.size.large', "Large (3600 - 5000 words, 6+ headings)") }
  ];

  const toneOptions = [
    { value: "friendly", label: t('article.tone.friendly', "Friendly") },
    { value: "professional", label: t('article.tone.professional', "Professional") },
    { value: "casual", label: t('article.tone.casual', "Casual") },
    { value: "formal", label: t('article.tone.formal', "Formal") },
    { value: "enthusiastic", label: t('article.tone.enthusiastic', "Enthusiastic") }
  ];

  const povOptions = [
    { value: "first-person", label: t('article.pov.firstPerson', "First Person (I, We)") },
    { value: "second-person", label: t('article.pov.secondPerson', "Second Person (You)") },
    { value: "third-person", label: t('article.pov.thirdPerson', "Third Person (He, She, They)") }
  ];

  const aiCleaningOptions = [
    { value: "no-removal", label: t('article.aiCleaning.none', "No AI Words Removal") },
    { value: "light", label: t('article.aiCleaning.light', "Light Cleaning") },
    { value: "moderate", label: t('article.aiCleaning.moderate', "Moderate Cleaning") },
    { value: "thorough", label: t('article.aiCleaning.thorough', "Thorough Cleaning") }
  ];

  const imageQualityOptions = [
    { value: "high", label: t('article.imageQuality.high', "High Quality (costs 20 tokens)") },
    { value: "optimized", label: t('article.imageQuality.optimized', "Optimized") },
    { value: "low", label: t('article.imageQuality.low', "Low Quality") }
  ];

  const imagePlacementOptions = [
    { value: "each-section", label: t('article.imagePlacement.eachSection', "Each Section") },
    { value: "after-h1", label: t('article.imagePlacement.afterH1', "After H1") },
    { value: "after-h2", label: t('article.imagePlacement.afterH2', "After H2") },
    { value: "none", label: t('article.imagePlacement.none', "None") }
  ];

  const imageStyleOptions = [
    { value: "normal", label: t('article.imageStyle.normal', "Normal") },
    { value: "cartoon", label: t('article.imageStyle.cartoon', "Cartoon") },
    { value: "anime", label: t('article.imageStyle.anime', "Anime") },
    { value: "realistic", label: t('article.imageStyle.realistic', "Realistic") },
    { value: "abstract", label: t('article.imageStyle.abstract', "Abstract") }
  ];

  const numberOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" }
  ];

  const videoNumberOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" }
  ];

  const linkingOptions = [
    { value: "none", label: t('article.linking.none', "None") },
    { value: "website1", label: t('article.linking.myWebsite', "My Website") },
    { value: "website2", label: t('article.linking.blogWebsite', "Blog Website") },
    { value: "website3", label: t('article.linking.ecommerce', "E-commerce Site") }
  ];

  const externalLinkingOptions = [
    { value: "none", label: t('article.externalLinking.none', "None") },
    { value: "wikipedia", label: t('article.externalLinking.wikipedia', "Wikipedia") },
    { value: "authority", label: t('article.externalLinking.authority', "Authority Sites") },
    { value: "news", label: t('article.externalLinking.news', "News Sources") }
  ];

  return {
    options: {
      articleTypeOptions,
      articleSizeOptions,
      toneOptions,
      povOptions,
      aiCleaningOptions,
      imageQualityOptions,
      imagePlacementOptions,
      imageStyleOptions,
      numberOptions,
      videoNumberOptions,
      linkingOptions,
      externalLinkingOptions,
    }
  };
};
