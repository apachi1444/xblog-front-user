import { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

// This component is used to test the error boundary
export function TestErrorComponent() {
  const theme = useTheme();
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    // This will trigger the error boundary
    throw new Error('This is a test error from TestErrorComponent');
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          maxWidth: 500,
          mx: 'auto',
          boxShadow: theme.customShadows.z16,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Error Boundary Test
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Click the button below to trigger an error and test the error boundary.
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={() => setShouldError(true)}
          sx={{ px: 3 }}
        >
          Trigger Error
        </Button>
      </Paper>
    </Box>
  );
}
