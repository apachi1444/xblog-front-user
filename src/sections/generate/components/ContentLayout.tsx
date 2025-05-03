import type { ReactNode} from 'react';

import { useState } from 'react';

import { Box, useTheme } from '@mui/material';

import { SEODashboard } from 'src/components/generate-article/SEODashboard';

import type { Step1State } from '../generate-steps/steps/step-one-content-setup';

interface ContentLayoutProps {
  children: ReactNode;
  activeStep: number;
  state: Step1State;
}

export const ContentLayout = ({ children, activeStep, state }: ContentLayoutProps) => {
  const theme = useTheme();
  const [isSEODashboardCollapsed, setIsSEODashboardCollapsed] = useState(false);
  
  // Determine if SEO Dashboard should be visible based on the active step
  const isSEODashboardVisible = activeStep !== 1 && activeStep !== 3; // Hide in Article Settings and Publish steps

  // Handler for SEO dashboard collapse state change
  const handleSEODashboardCollapseChange = (collapsed: boolean) => {
    setIsSEODashboardCollapsed(collapsed);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        position: 'relative',
        minHeight: 'calc(100vh - 200px)', // Adjust based on your layout
      }}
    >
      {/* Content area - adjust width based on SEO dashboard visibility and collapse state */}
      <Box
        sx={{
          flexGrow: 1,
          width: isSEODashboardVisible ?
            (isSEODashboardCollapsed ? 'calc(100% - 40px)' : '70%') :
            '100%',
          transition: () => theme.transitions.create(['width'], {
            duration: theme.transitions.duration.standard,
          }),
          pr: isSEODashboardVisible && !isSEODashboardCollapsed ? 2 : 0
        }}
      >
        <Box sx={{ width: '100%' }}>
          {children}
        </Box>
      </Box>

      {/* SEO Dashboard on the right - only visible on certain steps */}
      {isSEODashboardVisible && (
        <Box
          sx={{
            width: isSEODashboardCollapsed ? '40px' : '30%',
            transition: () => theme.transitions.create(['width'], {
              duration: theme.transitions.duration.standard,
            }),
            position: isSEODashboardCollapsed ? 'absolute' : 'relative',
            right: isSEODashboardCollapsed ? 0 : 'auto',
            top: isSEODashboardCollapsed ? 0 : 'auto',
            height: isSEODashboardCollapsed ? '100%' : 'auto',
          }}
        >
          <SEODashboard
            state={state}
            defaultTab={activeStep === 0 ? 0 : 1} // Preview SEO for Step 1, Real-time Scoring for Step 3
            onCollapseChange={handleSEODashboardCollapseChange}
            isCollapsed={isSEODashboardCollapsed}
          />
        </Box>
      )}
    </Box>
  );
};
