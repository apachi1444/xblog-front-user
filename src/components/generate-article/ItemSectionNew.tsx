
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

import { useTheme } from "@mui/material/styles";
import SettingsIcon from '@mui/icons-material/Settings';
// MUI icons
// MUI components
import {
  Box,
  Button,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/material";

import {useCriteriaEvaluation} from "src/sections/generate/hooks/useCriteriaEvaluation";

// Types
import type { CriterionStatus } from "../../types/criteria.types";

// Constants
const COLORS = {
  error: "#f44336",
  warning: "#ffb20d",
  success: "#2dc191",
  inactive: "#f7f7fa",
  pending: "#9e9e9e",
  optimize: "#0288d1",
  fix: "#f44336"
};

// Helper component for notification icon
function NotificationIcon({ status }: { status: string }) {
  switch (status) {
    case "error":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 5V8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 11.5V11.51" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "warning":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 5V8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 11.5V11.51" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "success":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.6667 7.38668V8.00001C14.6659 9.43763 14.2003 10.8365 13.3396 11.9879C12.4788 13.1393 11.2689 13.9817 9.89023 14.3893C8.51158 14.7969 7.03817 14.7479 5.68964 14.2497C4.34111 13.7515 3.18975 12.8307 2.40729 11.6247C1.62482 10.4187 1.25317 8.99205 1.34776 7.55755C1.44235 6.12305 1.99812 4.75756 2.93217 3.66473C3.86621 2.57189 5.12866 1.81027 6.5308 1.49344C7.93294 1.17662 9.40016 1.32157 10.7133 1.90668" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14.6667 2.66669L8 9.34002L6 7.34002" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "pending":
      // New SVG for pending status - hourglass icon
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2V4.67C12 5.24 11.76 5.8 11.34 6.2L9.34 8L11.34 9.8C11.76 10.2 12 10.76 12 11.33V14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 2V4.67C4 5.24 4.24 5.8 4.66 6.2L6.66 8L4.66 9.8C4.24 10.2 4 10.76 4 11.33V14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 2H4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 14H4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 5V8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 11.5V11.51" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
  }
}

interface ItemSectionNewProps {
  id: number;
  status: CriterionStatus;
  text: string;
  score: number;
  tooltip?: string;
  onImprove: (id: number) => void;
  onAdvancedOptimize: (id: number) => void;
  isHighlighted?: boolean;
}

export function ItemSectionNew({
  id,
  status,
  text,
  score,
  tooltip,
  onImprove,
  onAdvancedOptimize,
  isHighlighted = false,
}: ItemSectionNewProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  // Animation for highlighting
  const [highlight, setHighlight] = useState(isHighlighted);

  // Effect to handle highlighting animation
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (isHighlighted) {
      setHighlight(true);
      const timer = setTimeout(() => {
        setHighlight(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);

  const {getCriterionById} = useCriteriaEvaluation()

  // Get criterion details
  const criterion = getCriterionById(id);

  // Helper function to get criterion icon
  const getCriterionIcon = () => {
    const iconColor = status === 'success' ? COLORS.success :
                     status === 'warning' ? COLORS.warning :
                     status === 'error' ? COLORS.error :
                     COLORS.pending;

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: iconColor,
          flexShrink: 0
        }}
      >
        <NotificationIcon status={status} />
      </Box>
    );
  };

  // Use custom tooltip if provided, otherwise use criterion evaluation message or default
  const tooltipText = tooltip ||
    (criterion && status === "success" ? t(criterion.evaluationStatus.success) :
     criterion && status === "error" ? t(criterion.evaluationStatus.error) :
     criterion && status === "warning" && criterion.evaluationStatus.warning ? t(criterion.evaluationStatus.warning) :
     status === "error" ? "This item needs attention to improve your SEO score" :
     status === "warning" ? "This item could be improved for better SEO" :
     status === "success" ? "This item is optimized for SEO" : "");

  // Determine if this is a pending item (waiting for input)
  const isPending = status === "pending";

  return (
    <Box
      sx={{
        py: 1.5,
        px: 2,
        mb: 1,
        borderRadius: 1,
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
        display: 'flex',
        alignItems: 'flex-start', // Changed from 'center' to 'flex-start' to align with the top of content
        justifyContent: 'space-between',
        transition: 'all 0.2s ease-in-out',
        opacity: isPending ? 0.7 : 1,
        animation: highlight ? 'pulse 2s' : 'none',
        '@keyframes pulse': {
          '0%': {
            boxShadow: '0 0 0 0 rgba(89, 105, 207, 0.7)'
          },
          '70%': {
            boxShadow: '0 0 0 10px rgba(89, 105, 207, 0)'
          },
          '100%': {
            boxShadow: '0 0 0 0 rgba(89, 105, 207, 0)'
          }
        },
        transform: highlight ? 'scale(1.02)' : 'scale(1)',
        borderLeft: status === 'success' ? `3px solid ${COLORS.success}` :
                   status === 'warning' ? `3px solid ${COLORS.warning}` :
                   status === 'error' ? `3px solid ${COLORS.error}` :
                   `3px solid ${COLORS.pending}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            bgcolor: status === 'success' ? 'transparent' :
                    status === 'warning' ? 'transparent' :
                    status === 'error' ? 'rgba(244, 67, 54, 0.1)' :
                    'transparent',
            mt: 0.5, // Add a small top margin to align with the text
          }}
        >
          {getCriterionIcon()}
        </Box>

        <Tooltip
          title={tooltipText}
          placement="top"
          arrow
          disableHoverListener={tooltipText === ""}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: isPending ? theme.palette.text.secondary : theme.palette.text.primary,
                fontStyle: isPending ? "italic" : "normal",
                cursor: tooltipText ? 'help' : 'default'
              }}
            >
              {isPending ? `${text} (waiting for input)` : text}
            </Typography>

            {/* Status message */}
            {!isPending && tooltipText && (
              <Typography
                variant="caption"
                sx={{
                  color: status === 'success' ? COLORS.success :
                         status === 'warning' ? COLORS.warning :
                         status === 'error' ? COLORS.error :
                         theme.palette.text.secondary,
                  mt: 0.5,
                  fontSize: '0.75rem',
                  opacity: 0.9
                }}
              >
                {tooltipText}
              </Typography>
            )}
          </Box>
        </Tooltip>

        {isPending && (
          <Box
            sx={{
              ml: 1,
              px: 1,
              py: 0.25,
              borderRadius: 1,
              bgcolor: 'rgba(158, 158, 158, 0.1)',
              fontSize: '0.75rem'
            }}
          >
            Waiting
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        {/* Advanced optimization button - hidden but still accessible for functionality */}
        {status !== 'success' && !isPending && (
          <Box sx={{ display: 'none' }}>
            <IconButton
              size="small"
              onClick={() => onAdvancedOptimize(id)}
              disabled={isPending}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {/* Fix button */}
        {status === 'error' && !isPending && (
          <Button
            variant="contained"
            size="small"
            onClick={() => onImprove(id)}
            sx={{
              bgcolor: COLORS.fix,
              color: '#fff',
              textTransform: 'none',
              px: 2,
              py: 0.5,
              minWidth: 'auto',
              fontSize: '0.75rem',
              '&:hover': {
                bgcolor: 'rgba(244, 67, 54, 0.8)',
              }
            }}
          >
            Optimize
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default ItemSectionNew;
