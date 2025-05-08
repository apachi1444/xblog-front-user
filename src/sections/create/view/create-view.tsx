import type { ArticleInfo, ArticleSection } from 'src/components/article-preview/ArticlePreviewModal';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';

import { generateFeaturedImage } from 'src/utils/aiGeneration';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { ArticlePreviewModal } from 'src/components/article-preview/ArticlePreviewModal';

// Define interface for prompt items
interface PromptItem {
  id: string;
  title: string;
  timestamp: string;
  articleInfo?: ArticleInfo;
  sections?: ArticleSection[];
}

export function CreateView() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);

  const createOptions = [
    {
      id: 'generate',
      title: t('create.options.generate.title', 'Generate'),
      description: t('create.options.generate.description', 'Create from a one-line prompt in a few seconds'),
      icon: 'mdi:lightning-bolt',
      color: '#BBDEFB',
      popular: true
    },
    {
      id: 'template',
      title: t('create.options.template.title', 'Use Built In Template'),
      description: t('create.options.template.description', 'Create an article from an existing template'),
      icon: 'mdi:content-paste',
      color: '#F8BBD0',
      locked: true,
      comingSoon: true
    },
  ];

  const handleOptionSelect = (optionId: string, isLocked: boolean = false) => {
    // Don't do anything if the option is locked
    if (isLocked) return;

    setSelectedOption(optionId);

    // Navigate to the appropriate page based on selection
    if (optionId === 'generate') {
      // Navigate to the new route structure with 'new' as the articleId
      navigate('/generate');
    }
    // Add other navigation options as needed
  };

  // Mock data for recent prompts with article sections
  const recentPrompts: PromptItem[] = [
    {
      id: '1',
      title: t('create.recentPrompts.prompt1', 'Presentation of React Native & difference between it and react native'),
      timestamp: t('create.timeAgo.minute', '1 minute ago'),
      articleInfo: {
        title: 'React Native vs React: Understanding the Key Differences',
        metaTitle: 'React Native vs React: Complete Comparison Guide',
        metaDescription: 'Learn the key differences between React Native and React, their use cases, advantages, and limitations in this comprehensive guide.',
        primaryKeyword: 'React Native vs React',
        secondaryKeywords: ['mobile development', 'web development', 'JavaScript frameworks', 'cross-platform'],
        language: 'en',
        targetCountry: 'US',
        createdAt: new Date().toISOString(),
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1170&auto=format&fit=crop',
          alt: 'React Native vs React comparison - mobile and web development',
          caption: 'Understanding the differences between React and React Native frameworks'
        }
      },
      sections: [
        {
          id: '1-1',
          title: 'Introduction to React and React Native',
          type: 'introduction',
          contentType: 'paragraph',
          content: 'React and React Native are two powerful technologies developed by Facebook that have revolutionized the way developers build user interfaces. While they share a name and some core principles, they serve different purposes and have distinct characteristics. This article explores the key differences between React and React Native, helping you understand when to use each technology and how they complement each other in the modern development ecosystem.'
        },
        {
          id: '1-2',
          title: 'What is React?',
          type: 'regular',
          contentType: 'paragraph',
          content: 'React (also known as React.js or ReactJS) is a JavaScript library for building user interfaces for web applications. Released in 2013, React introduced a component-based architecture and a virtual DOM (Document Object Model) that significantly improved the way developers build and maintain UI components. React focuses on the view layer of applications and is typically used alongside other libraries for state management and routing.'
        },
        {
          id: '1-3',
          title: 'What is React Native?',
          type: 'regular',
          contentType: 'paragraph',
          content: 'React Native is a framework for building native mobile applications using JavaScript and React. Released in 2015, React Native allows developers to use React\'s component-based approach to create mobile apps that run natively on iOS and Android platforms. Instead of rendering to a browser\'s DOM, React Native components render to native platform UI components, providing a truly native experience.'
        },
        {
          id: '1-4',
          title: 'Key Differences Between React and React Native',
          type: 'regular',
          contentType: 'bullet-list',
          bulletPoints: [
            'Platform Target: React is for web applications, while React Native is for mobile applications',
            'Rendering: React renders to the browser DOM, React Native renders to native mobile components',
            'DOM Manipulation: React uses a virtual DOM for web, React Native has no DOM',
            'Styling: React uses CSS, React Native uses a JavaScript-based styling system',
            'Navigation: React typically uses React Router, React Native has its own navigation libraries',
            'Components: React uses web components (div, span, etc.), React Native uses native components (View, Text, etc.)'
          ]
        },
        {
          id: '1-5',
          title: 'When to Use React vs React Native',
          type: 'regular',
          contentType: 'table',
          tableData: {
            headers: ['Factor', 'React', 'React Native'],
            rows: [
              ['Target Platform', 'Web browsers', 'iOS and Android devices'],
              ['Development Focus', 'Web applications and websites', 'Mobile applications'],
              ['Performance Needs', 'Web performance', 'Native mobile performance'],
              ['Access to Native Features', 'Limited (requires additional APIs)', 'Full access to native device features'],
              ['Team Expertise', 'Web development skills', 'Mobile and web development skills']
            ]
          }
        },
        {
          id: '1-6',
          title: 'Common Questions About React and React Native',
          type: 'faq',
          contentType: 'faq',
          faqItems: [
            {
              question: 'Can I reuse code between React and React Native?',
              answer: 'Yes, business logic and state management code can often be shared between React and React Native applications. UI components typically need to be platform-specific, but libraries like React Native Web can help bridge the gap.'
            },
            {
              question: 'Is React Native truly "native"?',
              answer: 'Yes, React Native applications are truly native. Unlike hybrid approaches, React Native doesn\'t use WebViews. Instead, it renders native components using the host platform\'s standard rendering APIs through a JavaScript bridge.'
            },
            {
              question: 'Do I need to know native mobile development to use React Native?',
              answer: 'Not necessarily. While knowledge of native mobile development can be helpful for advanced customization, many developers can build complete React Native applications with just JavaScript and React knowledge.'
            }
          ]
        },
        {
          id: '1-7',
          title: 'Conclusion',
          type: 'conclusion',
          contentType: 'paragraph',
          content: 'Both React and React Native have their place in modern application development. React excels at building dynamic web interfaces, while React Native brings the power of React\'s component model to native mobile development. Understanding the differences and similarities between these technologies allows developers to make informed decisions about which tool is right for their specific project needs. As the React ecosystem continues to evolve, the line between web and mobile development becomes increasingly blurred, offering exciting possibilities for cross-platform development.'
        }
      ]
    },
    {
      id: '2',
      title: t('create.recentPrompts.prompt2', 'SEO Optimization Tips for E-commerce Websites'),
      timestamp: t('create.timeAgo.days', '2 days ago'),
      articleInfo: {
        title: 'Essential SEO Optimization Tips for E-commerce Websites',
        metaTitle: '10 Proven SEO Optimization Tips for E-commerce Success',
        metaDescription: 'Boost your e-commerce website\'s visibility with these essential SEO optimization tips. Learn how to improve rankings, drive traffic, and increase sales.',
        primaryKeyword: 'e-commerce SEO optimization',
        secondaryKeywords: ['product page SEO', 'e-commerce keyword research', 'online store optimization'],
        language: 'en',
        targetCountry: 'US',
        createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1170&auto=format&fit=crop',
          alt: 'E-commerce SEO optimization concept with laptop and analytics',
          caption: 'Boost your online store visibility with proven SEO strategies'
        }
      },
      sections: [
        {
          id: '2-1',
          title: 'Introduction to E-commerce SEO',
          type: 'introduction',
          contentType: 'paragraph',
          content: 'Search Engine Optimization (SEO) is crucial for e-commerce websites looking to increase visibility, drive traffic, and boost sales. With millions of online stores competing for attention, implementing effective SEO strategies can make the difference between thriving and merely surviving in the digital marketplace. This guide explores essential SEO optimization tips specifically tailored for e-commerce websites.'
        },
        {
          id: '2-2',
          title: 'Keyword Research for E-commerce',
          type: 'regular',
          contentType: 'paragraph',
          content: 'Effective keyword research forms the foundation of e-commerce SEO success. Focus on product-specific keywords, long-tail phrases that indicate purchase intent, and terms related to your specific niche. Tools like SEMrush, Ahrefs, and Google Keyword Planner can help identify valuable keywords with high search volume and manageable competition. Remember to consider seasonal trends and shopping patterns when developing your keyword strategy.'
        },
        {
          id: '2-3',
          title: 'Product Page Optimization',
          type: 'regular',
          contentType: 'bullet-list',
          bulletPoints: [
            'Create unique, detailed product descriptions (avoid manufacturer copies)',
            'Use primary keywords naturally in product titles and descriptions',
            'Implement structured data markup for rich snippets',
            'Optimize product images with descriptive file names and alt text',
            'Include customer reviews and ratings',
            'Ensure fast loading times for product pages',
            'Create logical URL structures that include keywords'
          ]
        }
      ]
    },
    {
      id: '3',
      title: t('create.recentPrompts.prompt3', 'How to implement authentication in Next.js applications'),
      timestamp: t('create.timeAgo.week', '1 week ago'),
      articleInfo: {
        title: 'Implementing Authentication in Next.js Applications: A Complete Guide',
        metaTitle: 'Next.js Authentication: Implementation Guide & Best Practices',
        metaDescription: 'Learn how to implement secure authentication in Next.js applications using various strategies including JWT, OAuth, and NextAuth.js with practical code examples.',
        primaryKeyword: 'Next.js authentication',
        secondaryKeywords: ['NextAuth.js', 'JWT authentication', 'OAuth implementation', 'Next.js security'],
        language: 'en',
        targetCountry: 'US',
        createdAt: new Date(Date.now() - 7*24*60*60*1000).toISOString(),
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1170&auto=format&fit=crop',
          alt: 'Next.js authentication implementation with secure login screen',
          caption: 'Secure your Next.js applications with robust authentication strategies'
        }
      },
      sections: [
        {
          id: '3-1',
          title: 'Introduction to Authentication in Next.js',
          type: 'introduction',
          contentType: 'paragraph',
          content: 'Authentication is a critical aspect of modern web applications, ensuring that users are who they claim to be and protecting sensitive data and functionality. Next.js, as a powerful React framework, offers several approaches to implementing authentication. This guide explores various authentication strategies for Next.js applications, from building custom solutions to leveraging specialized libraries like NextAuth.js.'
        },
        {
          id: '3-2',
          title: 'Authentication Approaches for Next.js',
          type: 'regular',
          contentType: 'bullet-list',
          bulletPoints: [
            'JWT (JSON Web Tokens) based authentication',
            'Session-based authentication',
            'OAuth and social login integration',
            'Magic links and passwordless authentication',
            'NextAuth.js library implementation',
            'Custom authentication solutions'
          ]
        }
      ]
    }
  ];

  // Function to handle opening the preview modal
  const handleOpenPreviewModal = async (prompt: PromptItem) => {
    // If the prompt doesn't have a featuredImage, generate one
    if (prompt.articleInfo && !prompt.articleInfo.featuredImage) {
      try {
        // Show loading state
        setSelectedPrompt(prompt);
        setPreviewModalOpen(true);

        // Generate a featured image using the Stability AI API
        const featuredImage = await generateFeaturedImage(
          prompt.articleInfo.title,
          prompt.articleInfo.primaryKeyword || '',
          prompt.articleInfo.targetCountry,
          prompt.articleInfo.secondaryKeywords
        );

        // Update the prompt with the generated image
        const updatedPrompt = {
          ...prompt,
          articleInfo: {
            ...prompt.articleInfo,
            featuredImage
          }
        };

        // Update the selected prompt
        setSelectedPrompt(updatedPrompt);
      } catch (error) {
        console.error('Error generating featured image:', error);
        // Still show the modal even if image generation fails
        setSelectedPrompt(prompt);
        setPreviewModalOpen(true);
      }
    } else {
      // If the prompt already has a featuredImage, just show the modal
      setSelectedPrompt(prompt);
      setPreviewModalOpen(true);
    }
  };

  return (
    <DashboardContent>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          {t('create.heading', 'Create with AI')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('create.subheading', 'How would you like to get started?')}
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center" sx={{ mb: 8 }}>
        {createOptions.map((option) => (
          <Grid key={option.id} xs={12} sm={4}>
            <Card
              sx={{
                height: '100%',
                bgcolor: option.id === selectedOption ? 'action.selected' : 'background.paper',
                position: 'relative',
                overflow: 'visible'
              }}
            >
              {option.popular && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -10,
                    right: 16,
                    bgcolor: 'success.main',
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    zIndex: 1,
                  }}
                >
                  {t('create.popular', 'Popular')}
                </Box>
              )}
              <CardActionArea
                onClick={() => handleOptionSelect(option.id, option.locked)}
                disabled={option.locked}
                sx={{
                  height: '100%',
                  p: 2,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&:hover': {
                    bgcolor: option.locked ? 'transparent' : 'primary.lighter',
                    transform: option.locked ? 'none' : 'translateY(-3px)',
                    boxShadow: option.locked ? 'none' : (theme) => theme.shadows[4],
                    '& .option-icon': {
                      transform: option.locked ? 'none' : 'scale(1.1)',
                    }
                  }
                }}
              >
                {/* Coming Soon Overlay */}
                {option.locked && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0, 0, 0, 0.6)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                      borderRadius: 1,
                    }}
                  >
                    <Iconify
                      icon="mdi:lock"
                      width={40}
                      height={40}
                      sx={{ color: 'white', mb: 1 }}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        px: 2
                      }}
                    >
                      {t('create.comingSoon', 'Coming Soon')}
                    </Typography>
                  </Box>
                )}

                <CardContent>
                  <Box
                    sx={{
                      mb: 3,
                      p: 3,
                      borderRadius: 2,
                      bgcolor: `${option.color}40`,
                      width: '100%',
                      height: 140,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      filter: option.locked ? 'grayscale(0.8)' : 'none',
                    }}
                  >
                    <Iconify
                      icon={option.icon}
                      width={80}
                      height={80}
                      className="option-icon"
                      sx={{
                        color: option.color,
                        transition: 'transform 0.3s ease',
                        opacity: option.locked ? 0.7 : 1
                      }}
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ opacity: option.locked ? 0.7 : 1 }}>
                    {option.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: option.locked ? 0.7 : 1 }}>
                    {option.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {t('create.recentPromptsHeading', 'Your recent prompts')}
        </Typography>
        <Stack spacing={2}>
          {recentPrompts.map(prompt => (
            <Card
              key={prompt.id}
              sx={{
                bgcolor: 'background.paper',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'primary.lighter',
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => theme.shadows[4]
                },
                cursor: 'pointer'
              }}
              onClick={() => handleOpenPreviewModal(prompt)}
            >
              <CardContent sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  '& .chevron-icon': {
                    transform: 'translateX(4px)',
                  }
                }
              }}>
                <Box>
                  <Typography variant="subtitle1">{prompt.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('create.generateLabel', 'Generate')} · {prompt.timestamp} · {t('create.draftLabel', 'DRAFT')}
                  </Typography>
                </Box>
                <Iconify
                  icon="mdi:chevron-right"
                  className="chevron-icon"
                  sx={{ transition: 'transform 0.3s ease' }}
                />
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Article Preview Modal */}
      {selectedPrompt && (
        <ArticlePreviewModal
          open={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          articleInfo={selectedPrompt.articleInfo || { title: selectedPrompt.title }}
          sections={selectedPrompt.sections || []}
        />
      )}
    </DashboardContent>
  );
}