import type { ReactNode } from 'react';

import Warning from "@mui/icons-material/Warning";
import CheckCircle from "@mui/icons-material/CheckCircle";
import HelpOutline from "@mui/icons-material/HelpOutline";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import { Box, useTheme, Typography, IconButton } from "@mui/material";

import type { ChecklistItem } from './RealTimeScoringTab';


const COLORS = {
  error: "#d81d1d",
  warning: "#ffb20d",
  success: "#2dc191",
  inactive: "#f7f7fa",
  primary: "#5969cf",
  border: "#acb9f9",
  background: "#dbdbfa",
};

interface NotificationIconProps {
  status: "error" | "warning" | "success"  | "inactive";
}

// Separate component for notification icon to improve readability
const NotificationIcon = ({ status }: NotificationIconProps): ReactNode => {
  switch (status) {
    case "error":
      return <ErrorOutline sx={{ color: "white" }} />;
    case "warning":
      return <Warning sx={{ color: "white" }} />;
    case "success":
      return <CheckCircle sx={{ color: "white" }} />;
    default:
      return <HelpOutline sx={{ color: "white" }} />;
  }
};

export function ItemSection({ id, status, text, action }: ChecklistItem) {
  const theme = useTheme();
  const color = COLORS[status];
  const icon = <NotificationIcon status={status} />;
  
  return (
    <Box
      key={id}
      sx={{
        display: "flex",
        alignItems: "center",
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
          p: 1.5,
          bgcolor: "white",
          borderRadius: "0 4px 4px 0",
          border: "1px solid #f0f0f0",
          borderLeft: "none",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: "12px",
            color: theme.palette.text.secondary,
          }}
        >
          {text}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton size="small">
            <HelpOutline sx={{ fontSize: 12 }} />
          </IconButton>
          {action && (
            <Typography
              variant="body2"
              sx={{
                ml: 1,
                fontSize: "12px",
                fontWeight: 500,
                color: theme.palette.text.primary,
              }}
            >
              {action}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}