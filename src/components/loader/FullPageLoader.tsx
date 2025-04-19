import { Box, CircularProgress, useTheme } from "@mui/material";

type FullPageLoaderProps = {
  open: boolean;
};

export function FullPageLoader({ open }: FullPageLoaderProps) {
  const theme = useTheme();
  
  if (!open) return null;
  
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.8)' 
          : 'rgba(0, 0, 0, 0.7)',
        zIndex: theme.zIndex.drawer + 1,
        borderRadius: 1,
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
}