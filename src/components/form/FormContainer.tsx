import React, { useState } from 'react';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Card, Chip, Collapse, useTheme, IconButton, Typography, CardContent } from '@mui/material';

interface FormContainerProps {
  title: string;
  children: React.ReactNode;
  maxWidth?: string | number;
  layout?: 'row' | 'column';
  isCollapsible?: boolean;
  collapsedMessage?: string; // Custom message when collapsed
}

export function FormContainer({
  title,
  children,
  maxWidth = '100%',
  layout = 'column',
  isCollapsible = false,
  collapsedMessage = 'Click to expand and view form fields' // Default message
}: FormContainerProps) {
  const [expanded, setExpanded] = useState(true);
  const theme = useTheme();
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ width: '100%', maxWidth, border: 0, boxShadow: 'none', mb: 3 }}>
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            position: 'relative',
            bgcolor: theme.palette.background.neutral || '#F1F2F7',
            borderRadius: '8px',
            borderColor: theme.palette.primary.lighter || '#A0AFF8',
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
                bgcolor: theme.palette.primary.lighter || '#cfcff9',
                color: theme.palette.primary.dark || '#5969cf',
                borderRadius: '20px',
                border: `1px solid ${theme.palette.primary.light || '#abb8f8'}`,
                fontWeight: 'bold',
                fontSize: '13px',
                letterSpacing: '0.5px',
                fontFamily: theme.typography.fontFamily,
                '& .MuiChip-label': {
                  px: 1
                },
                zIndex: 1, // Ensure chip stays above the clickable area
              }}
              onClick={(e) => e.stopPropagation()} // Prevent chip clicks from toggling
            />
            
            { isCollapsible && ( 
            <IconButton 
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                toggleExpand();
              }}
              sx={{ 
                position: 'absolute',
                top: -20, 
                right: 18,
                bgcolor: theme.palette.primary.lighter || '#cfcff9',
                color: theme.palette.primary.dark || '#5969cf',
                border: `1px solid ${theme.palette.primary.light || '#abb8f8'}`,
                width: '39px',
                height: '39px',
                '&:hover': {
                  bgcolor: theme.palette.primary.light || '#bbbdf8'
                },
                zIndex: 1, // Ensure button stays above the clickable area
              }}
            >
              {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>)}
          </Box>

          {/* Collapsed message when form is hidden */}
          {!expanded && (
            <Box 
              sx={{ 
                py: 2, 
                textAlign: 'center',
                '&:hover': {
                  bgcolor: `${theme.palette.primary.lighter}20` || 'rgba(171, 184, 248, 0.1)', // Subtle hover effect with opacity
                },
                transition: 'background-color 0.2s',
              }}
            >
              <Typography 
                variant="body2"
                sx={{ 
                  color: theme.palette.primary.dark || '#5969cf',
                  fontFamily: theme.typography.fontFamily,
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