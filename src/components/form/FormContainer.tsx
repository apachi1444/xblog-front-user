import React, { useState } from 'react';
import { Box, Card, Chip, CardContent, IconButton, Typography, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface FormContainerProps {
  title: string;
  children: React.ReactNode;
  maxWidth?: string | number;
  layout?: 'row' | 'column';
  collapsedMessage?: string; // Custom message when collapsed
}

export function FormContainer({
  title,
  children,
  maxWidth = '100%',
  layout = 'column',
  collapsedMessage = 'Click to expand and view form fields' // Default message
}: FormContainerProps) {
  const [expanded, setExpanded] = useState(true);
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

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
            width: '100%',
            cursor: 'pointer', // Add cursor pointer to indicate clickability
          }}
          onClick={toggleExpand} // Make the entire box clickable
        >
          {/* Title badge with expand/collapse button */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                },
                zIndex: 1, // Ensure chip stays above the clickable area
              }}
              onClick={(e) => e.stopPropagation()} // Prevent chip clicks from toggling
            />
            <IconButton 
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                toggleExpand();
              }}
              sx={{ 
                position: 'absolute',
                top: -20, 
                right: 18,
                bgcolor: '#cfcff9',
                color: '#5969cf',
                border: '1px solid #abb8f8',
                width: '39px',
                height: '39px',
                '&:hover': {
                  bgcolor: '#bbbdf8'
                },
                zIndex: 1, // Ensure button stays above the clickable area
              }}
            >
              {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Box>

          {/* Collapsed message when form is hidden */}
          {!expanded && (
            <Box 
              sx={{ 
                py: 2, 
                textAlign: 'center',
                '&:hover': {
                  bgcolor: 'rgba(171, 184, 248, 0.1)', // Subtle hover effect
                },
                transition: 'background-color 0.2s',
              }}
            >
              <Typography 
                variant="body2"
                sx={{ 
                  color: '#5969cf',
                  fontFamily: "'Poppins', Helvetica",
                  fontStyle: 'italic',
                  cursor: 'pointer', // Add cursor pointer to indicate clickability
                }}
              >
                {collapsedMessage}
              </Typography>
            </Box>
          )}
          
          {/* Collapsible form fields container */}
          <Collapse in={expanded} timeout="auto">
            <Box 
              sx={{
                display: 'flex',
                flexDirection: layout === 'column' ? 'column' : 'row',
                gap: 2,
                width: '100%',
              }}
              onClick={(e) => e.stopPropagation()} // Prevent form field clicks from toggling
            >
              {children}
            </Box>
          </Collapse>
        </Box>
      </CardContent>
    </Card>
  );
}