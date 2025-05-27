import type { ContainerProps } from '@mui/material';

import React, { useState } from 'react';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Card, Chip, Collapse, useTheme, IconButton, Typography, CardContent } from '@mui/material';

type FormContainerProps = ContainerProps &  {
  title: string;
  children: React.ReactNode;
  layout?: 'row' | 'column';
  isCollapsible?: boolean;
  collapsedMessage?: string; // Custom message when collapsed
}

export function FormContainer({
  sx,
  title,
  children,
  layout = 'column',
  isCollapsible = false,
  collapsedMessage = 'Click to expand and view form fields' // Default message
}: FormContainerProps) {
  const [expanded, setExpanded] = useState(true);
  const theme = useTheme();

  const toggleExpand = () => {
    if(isCollapsible){
      setExpanded(!expanded);
    }
  };

  return (
    <Card sx={{ ...sx, width: '100%', border: 0, boxShadow: 'none', mb: 3 }}>
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            position: 'relative',
            bgcolor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.02)'
              : theme.palette.grey[50],
            borderRadius: '8px',
            border: `1px solid ${theme.palette.mode === 'dark'
              ? theme.palette.grey[700]
              : theme.palette.grey[300]}`,
            pt: 4,
            pb: 2,
            px: 2,
            mt: 2.5,
            width: '100%',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 4px 12px rgba(0,0,0,0.3)'
              : '0 2px 8px rgba(0,0,0,0.05)',
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
                bgcolor: theme.palette.mode === 'dark'
                  ? theme.palette.primary.main
                  : theme.palette.primary.main,
                color: theme.palette.mode === 'dark'
                  ? theme.palette.primary.contrastText
                  : theme.palette.primary.contrastText,
                borderRadius: '20px',
                border: `1px solid ${theme.palette.mode === 'dark'
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark}`,
                fontWeight: 'bold',
                fontSize: '13px',
                letterSpacing: '0.5px',
                fontFamily: theme.typography.fontFamily,
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 2px 8px rgba(0,0,0,0.3)'
                  : 'none',
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
                bgcolor: theme.palette.mode === 'dark'
                  ? theme.palette.primary.dark
                  : theme.palette.primary.lighter,
                color: theme.palette.mode === 'dark'
                  ? theme.palette.common.white
                  : theme.palette.primary.dark,
                border: `1px solid ${theme.palette.mode === 'dark'
                  ? theme.palette.primary.main
                  : theme.palette.primary.light}`,
                width: '39px',
                height: '39px',
                zIndex: 1, // Ensure button stays above the clickable area
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 2px 8px rgba(0,0,0,0.3)'
                  : 'none'
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
                transition: 'background-color 0.2s',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.mode === 'dark'
                    ? theme.palette.primary.light
                    : theme.palette.primary.dark,
                  fontFamily: theme.typography.fontFamily,
                  fontStyle: 'italic',
                  cursor: 'pointer'
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
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </Box>
          </Collapse>
        </Box>
      </CardContent>
    </Card>
  );
}