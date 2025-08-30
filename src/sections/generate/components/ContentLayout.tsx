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

  const isSEODashboardVisible = activeStep !== 3;

  const handleSEODashboardCollapseChange = (collapsed: boolean) => {
    setIsSEODashboardCollapsed(collapsed);
  };

  useEffect(() => {
    if (!isSEODashboardVisible) return;

    const handleScroll = () => {
      if (!dashboardRef.current) return;

      if (initialTopOffset.current === 0) {
        const rect = dashboardRef.current.getBoundingClientRect();
        initialTopOffset.current = rect.top;
      }

      const shouldBeFixed = window.scrollY > 0;

      if (shouldBeFixed !== isFixed) {
        setIsFixed(shouldBeFixed);
      }
    };

    window.addEventListener('scroll', handleScroll);

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
        minHeight: 'calc(100vh - 200px)',
        mb: 10,
        mt: 2,
      }}
    >
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
              onCollapseChange={handleSEODashboardCollapseChange}
              isCollapsed={isSEODashboardCollapsed}
              activeStep={activeStep}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
