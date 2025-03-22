import { Box, Typography } from '@mui/material';

interface FormSectionProps {
  title?: string;
  children: React.ReactNode;
  spacing?: number;
}

export function FormSection({ title, children, spacing = 3 }: FormSectionProps) {
  return (
    <Box>
      {title && (
        <Typography variant="h6" sx={{ mb: 3 }}>
          {title}
        </Typography>
      )}
      <Box
        display="flex"
        flexDirection="column"
        gap={spacing}
      >
        {children}
      </Box>
    </Box>
  );
}