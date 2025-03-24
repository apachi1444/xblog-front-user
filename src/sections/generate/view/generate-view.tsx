
import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CompleteExample } from 'src/components/form/CompleteExample';

export function GenerateView() {
  const [activeStep, setActiveStep] = useState(1)
  const [searchValue, setSearchValue] = useState("")

  const steps = ["Content Setup", "Content Structuring", "Publish"]
  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Generate
        </Typography>
      </Box>

      <CompleteExample />

    </DashboardContent>
  );
}
