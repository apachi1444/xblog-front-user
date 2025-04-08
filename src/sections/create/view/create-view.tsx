import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

export function CreateView() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const createOptions = [
    {
      id: 'paste',
      title: 'Paste in text',
      description: 'Create from notes, an outline, or existing content',
      icon: 'mdi:content-paste',
      color: '#F8BBD0'
    },
    {
      id: 'generate',
      title: 'Generate',
      description: 'Create from a one-line prompt in a few seconds',
      icon: 'mdi:lightning-bolt',
      color: '#BBDEFB',
      popular: true
    },
    {
      id: 'import',
      title: 'Import file or URL',
      description: 'Enhance existing docs, presentations, or webpages',
      icon: 'mdi:file-import',
      color: '#D1C4E9'
    }
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    
    // Navigate to the appropriate page based on selection
    if (optionId === 'generate') {
      navigate('/generate');
    }
    // Add other navigation options as needed
  };

  const recentPrompts = [
    { id: '1', title: 'Presentation of React Native & difference between it and react native', timestamp: '1 minute ago' },
    { id: '2', title: 'SEO Optimization Tips for E-commerce Websites', timestamp: '2 days ago' },
    { id: '3', title: 'How to implement authentication in Next.js applications', timestamp: '1 week ago' },
  ];

  return (
    <DashboardContent>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Create with AI
        </Typography>
        <Typography variant="body1" color="text.secondary">
          How would you like to get started?
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
                  Popular
                </Box>
              )}
              <CardActionArea 
                onClick={() => handleOptionSelect(option.id)}
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent>
                  <Box 
                    sx={{ 
                      mb: 3, 
                      p: 3, 
                      borderRadius: 2,
                      bgcolor: `${option.color  }40`,
                      width: '100%',
                      height: 140,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Iconify icon={option.icon} width={80} height={80} sx={{ color: option.color }} />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {option.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button 
                  fullWidth 
                  variant="text" 
                  endIcon={<Iconify icon="mdi:arrow-right" />}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  Continue
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Your recent prompts
        </Typography>
        <Stack spacing={2}>
          {recentPrompts.map(prompt => (
            <Card 
              key={prompt.id} 
              sx={{ 
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' },
                cursor: 'pointer'
              }}
              onClick={() => navigate('/generate')}
            >
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1">{prompt.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Generate · {prompt.timestamp} · DRAFT
                  </Typography>
                </Box>
                <Iconify icon="mdi:chevron-right" />
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </DashboardContent>
  );
}