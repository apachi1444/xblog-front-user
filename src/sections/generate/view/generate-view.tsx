

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { GeneratingView } from 'src/components/form/GeneratingView';

export function GenerateView() {
  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Generate
        </Typography>
      </Box>

      <GeneratingView />

    </DashboardContent>
  );
}
