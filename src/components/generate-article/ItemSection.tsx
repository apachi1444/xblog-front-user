import type { ChecklistItem } from "src/utils/seoScoring";

import { Box, Button, Tooltip, useTheme, Typography } from "@mui/material";

// Constants
const COLORS = {
  error: "#d81d1d",
  warning: "#ffb20d",
  success: "#2dc191",
  inactive: "#f7f7fa",
  pending: "#9e9e9e", // Changed to a more distinct gray
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

interface ItemSectionProps extends ChecklistItem {
  onActionClick?: (item: ChecklistItem) => void;
}

export function ItemSection({ id, status, text, action, onActionClick }: ItemSectionProps) {
  const theme = useTheme();
  const color = COLORS[status];
  const icon = <NotificationIcon status={status} />;
  
  const handleActionClick = () => {
    if (onActionClick) {
      onActionClick({ id, status, text, action });
    }
  };
  
  // Determine if this is a pending item (waiting for input)
  const isPending = status === "pending";
  
  // Get appropriate text and tooltip based on status
  const displayText = isPending ? `${text} (waiting for input)` : text;
  const tooltipText = isPending ? "This check is waiting for you to fill in required fields" : "";
  
  return (
    <Box
      key={id}
      sx={{
        display: "flex",
        alignItems: "center",
        opacity: isPending ? 0.7 : 1, // Reduce opacity for pending items
        mb: 1, // Add margin bottom for spacing between items
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 36,
          height: 36,
          bgcolor: color,
          borderRadius: "4px 0 0 4px",
        }}
      >
        {icon}
      </Box>
      <Tooltip title={tooltipText} placement="top" arrow disableHoverListener={!isPending}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
            p: 1.5,
            bgcolor: isPending ? "#f5f5f5" : "white", // Light gray background for pending items
            borderRadius: "0 4px 4px 0",
            border: `1px solid ${isPending ? "#e0e0e0" : "#f0f0f0"}`,
            borderStyle: isPending ? "dashed" : "solid", // Dashed border for pending items
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: isPending ? theme.palette.text.secondary : theme.palette.text.primary,
              fontStyle: isPending ? "italic" : "normal", // Italic text for pending items
            }}
          >
            {displayText}
          </Typography>
          
          {action && (
            <Button
              variant={isPending ? "text" : "outlined"}
              size="small"
              color={status === "error" ? "error" : status === "warning" ? "warning" : "primary"}
              onClick={handleActionClick}
              disabled={isPending}
              sx={{
                minWidth: "auto",
                ml: 1,
                borderRadius: "4px",
                textTransform: "none",
                px: 1.5,
                py: 0.25,
              }}
            >
              {isPending ? "Waiting" : action}
            </Button>
          )}
        </Box>
      </Tooltip>
    </Box>
  );
}