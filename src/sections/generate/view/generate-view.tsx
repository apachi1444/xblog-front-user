import { SearchIcon } from 'lucide-react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomButton } from 'src/components/form/ExampleButton';
import { CustomStepper } from 'src/components/form/ExampleStepper';
import { useState } from 'react';

export function GenerateView() {
  const [activeStep, setActiveStep] = useState(1)
  const [searchValue, setSearchValue] = useState("")

  const steps = ["Content Setup", "Content Structuring", "Publish"]
  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Blog
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New post
        </Button>
      </Box>

      <CustomButton variant="contained" color="secondary" text="Loading Button" loading />

              <CustomButton variant="contained" color="success" text="With Icon" startIcon={<SearchIcon />} />

              <CustomStepper steps={steps} activeStep={activeStep} />

      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }} />

      <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} />
    </DashboardContent>
  );
}
