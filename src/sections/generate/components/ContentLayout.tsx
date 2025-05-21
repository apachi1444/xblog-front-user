import type { ReactNode} from 'react';

import { useRef, useState, useEffect } from 'react';

import { Box, useTheme } from '@mui/material';

import { SEODashboard } from 'src/components/generate-article/SEODashboard';


interface ContentLayoutProps {
  isGeneratingMeta: boolean;
  onGenerateMeta: () => Promise<
    {
        metaTitle: string;
        metaDescription: string;
        urlSlug: string;
      }

  >;
  children: ReactNode;
  activeStep: number;
}

export const ContentLayout = ({ children, activeStep, isGeneratingMeta, onGenerateMeta }: ContentLayoutProps) => {
  const theme = useTheme();
  const [isSEODashboardCollapsed, setIsSEODashboardCollapsed] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const initialTopOffset = useRef<number>(0);

  // Determine if SEO Dashboard should be visible based on the active step
  const isSEODashboardVisible = activeStep !== 1 && activeStep !== 3; // Hide in Article Settings and Publish steps

  // Handler for SEO dashboard collapse state change
  const handleSEODashboardCollapseChange = (collapsed: boolean) => {
    setIsSEODashboardCollapsed(collapsed);
  };

  // Set up scroll event listener to fix the SEO dashboard when scrolling
  useEffect(() => {
    if (!isSEODashboardVisible) return;

    const handleScroll = () => {
      if (!dashboardRef.current) return;

      // If we haven't stored the initial offset yet, do it now
      if (initialTopOffset.current === 0) {
        const rect = dashboardRef.current.getBoundingClientRect();
        initialTopOffset.current = rect.top;
      }

      // Check if we've scrolled at all
      const shouldBeFixed = window.scrollY > 0;

      if (shouldBeFixed !== isFixed) {
        setIsFixed(shouldBeFixed);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Initial check
    handleScroll();

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isSEODashboardVisible, isFixed]);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        position: 'relative',
        minHeight: 'calc(100vh - 200px)', // Adjust based on your layout
        mb: 10, // Add bottom margin to prevent content from being hidden by the bottom navigation
        mt: 2, // Add top margin for better spacing from the stepper
      }}
    >
      {/* Main content container - always takes full width */}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          position: 'relative',
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
            ref={dashboardRef}
            sx={{
              width: isSEODashboardCollapsed ? '40px' : '30%',
              transition: () => theme.transitions.create(['width'], {
                duration: theme.transitions.duration.standard,
              }),
              position: isFixed ? 'sticky' : 'relative',
              top: isFixed ? '80px' : 'auto',
              marginTop: isFixed ? 2 : 0,
              height: 'calc(100vh - 120px)', // Always use fixed height for consistency
              alignSelf: 'flex-start',
              zIndex: isFixed ? 10 : 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <SEODashboard
              isGeneratingMeta={isGeneratingMeta}
              onGenerateMeta={onGenerateMeta}
              defaultTab={activeStep === 0 ? 0 : 1} // Preview SEO for Step 1, Real-time Scoring for Step 3
              onCollapseChange={handleSEODashboardCollapseChange}
              isCollapsed={isSEODashboardCollapsed}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
