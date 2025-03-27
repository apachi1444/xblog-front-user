import React from 'react';
import { Box, Card, Chip, CardContent } from '@mui/material';

interface FormContainerProps {
  title: string;
  children: React.ReactNode;
  maxWidth?: string | number;
  layout?: 'row' | 'column'; // Add layout option
}

export function FormContainer({ 
  title, 
  children, 
  maxWidth = '100%', // Changed from '800px' to '100%' to fill available space
  layout = 'column' // Changed default to column layout
}: FormContainerProps) {
  return (
    <Card sx={{ width: '100%', maxWidth, border: 0, boxShadow: 'none', mb: 3 }}>
      <CardContent sx={{ p: 0 }}>
        <Box 
          sx={{ 
            position: 'relative',
            bgcolor: '#F1F2F7', 
            borderRadius: '8px',
            borderColor: '#A0AFF8',
            pt: 4,
            pb: 2,
            px: 2,
            mt: 2.5,
            width: '100%', // Ensure full width
          }} 
        >
          {/* Title badge */}
          <Chip
            label={title}
            sx={{
              position: 'absolute',
              top: -20,
              left: 18,
              height: '39px',
              px: 2,
              py: 1.5,
              bgcolor: '#cfcff9',
              color: '#5969cf',
              borderRadius: '20px',
              border: '1px solid #abb8f8',
              fontWeight: 'bold',
              fontSize: '13px',
              letterSpacing: '0.5px',
              fontFamily: "'Poppins', Helvetica",
              '& .MuiChip-label': {
                px: 1
              }
            }}
          />

          {/* Form fields container with proper spacing */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: layout === 'column' ? 'column' : 'row',
            gap: 2,
            width: '100%' // Ensure full width
          }}>
            {children}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}