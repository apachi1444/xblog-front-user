import { Check, ChevronRight } from 'lucide-react';

import { Box, Grid, Card, Button, Typography } from '@mui/material';

interface SelectPlatformProps {
  platforms: { id: string; name: string; icon: string; description: string }[];
  selectedPlatform: string;
  onSelectPlatform: (platform: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SelectPlatform({ 
  selectedPlatform, 
  onSelectPlatform, 
  onNext, 
  onBack,
  platforms
}: SelectPlatformProps) {
  const handleNext = () => {
    if (selectedPlatform) {
      onNext();
    }
  };

  return (
    <Box>
      <Typography variant="h6" align="center" sx={{ mb: 3 }}>
        Select your platform
      </Typography>
      
      <Grid container spacing={3} justifyContent="center" sx={{ mb: 5 }}>
        {platforms.map((platform) => (
          <Grid item xs={12} sm={4} key={platform.id}>
            <Card
              onClick={() => onSelectPlatform(platform.id)}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                border: selectedPlatform === platform.id ? '2px solid' : '1px solid',
                borderColor: selectedPlatform === platform.id ? 'primary.main' : 'divider',
                boxShadow: selectedPlatform === platform.id ? 3 : 0,
                '&:hover': {
                  boxShadow: 2,
                },
              }}
            >
              <Box
                component="img"
                src={platform.icon}
                alt={platform.name}
                sx={{
                  width: 64,
                  height: 64,
                  mb: 2,
                  opacity: selectedPlatform === platform.id ? 1 : 0.7,
                }}
              />
              <Typography variant="subtitle1" fontWeight="bold">
                {platform.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                {platform.description}
              </Typography>
              
              {selectedPlatform === platform.id && (
                <Box
                  sx={{
                    mt: 2,
                    width: 24,
                    height: 24,
                    display: 'flex',
                    borderRadius: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  <Check size={16} />
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {!selectedPlatform && (
        <Typography color="error" variant="body2" align="center" sx={{ mb: 2 }}>
          Please select a platform to continue
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onBack}
        >
          Back to Stores
        </Button>
        
        <Button
          variant="contained"
          onClick={handleNext}
          endIcon={<ChevronRight size={16} />}
          disabled={!selectedPlatform}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
} 