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

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

export function CreateView() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

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
      color: '#F8BBD0'
    },
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    
    // Navigate to the appropriate page based on selection
    if (optionId === 'generate') {
      // Navigate to the new route structure with 'new' as the articleId
      navigate('/generate');
    }
    // Add other navigation options as needed
  };

  const recentPrompts = [
    { id: '1', title: t('create.recentPrompts.prompt1', 'Presentation of React Native & difference between it and react native'), timestamp: t('create.timeAgo.minute', '1 minute ago') },
    { id: '2', title: t('create.recentPrompts.prompt2', 'SEO Optimization Tips for E-commerce Websites'), timestamp: t('create.timeAgo.days', '2 days ago') },
    { id: '3', title: t('create.recentPrompts.prompt3', 'How to implement authentication in Next.js applications'), timestamp: t('create.timeAgo.week', '1 week ago') },
  ];

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
                onClick={() => handleOptionSelect(option.id)}
                sx={{ 
                  height: '100%', 
                  p: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'primary.lighter',
                    transform: 'translateY(-3px)',
                    boxShadow: (theme) => theme.shadows[4],
                    '& .option-icon': {
                      transform: 'scale(1.1)',
                    }
                  }
                }}
              >
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
                    }}
                  >
                    <Iconify 
                      icon={option.icon} 
                      width={80} 
                      height={80} 
                      className="option-icon"
                      sx={{ 
                        color: option.color,
                        transition: 'transform 0.3s ease'
                      }} 
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {option.title}
                  </Typography>
                  <Typography variant="body2">
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
              onClick={() => navigate('/generate')}
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
    </DashboardContent>
  );
}