import type { StackProps } from '@mui/material/Stack';

import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { alpha, useTheme } from '@mui/material';

import { useGetSubscriptionDetailsQuery } from 'src/services/apis/subscriptionApi';

import { Iconify } from 'src/components/iconify';



// ----------------------------------------------------------------------

export function NavUpgrade({ sx, ...other }: StackProps) {
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: subscriptionDetails, isLoading } = useGetSubscriptionDetailsQuery();

  if (isLoading || !subscriptionDetails) {
    return null;
  }


  return (
    <>

      {/* Upgrade Button */}
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        sx={{ mb: 4, textAlign: 'center', px: 2, ...sx }}
        {...other}
      >
        <Button
          onClick={() => {
            navigate("/upgrade-license")
          }}
          variant="contained"
          size="large"
          startIcon={
            <Iconify
              icon="mdi:rocket-launch"
              width={20}
              height={20}
            />
          }
          sx={{
            width: '100%',
            py: 1.5,
            borderRadius: 3,
            fontWeight: 600,
            textTransform: 'none',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.15),
              borderColor: alpha(theme.palette.primary.main, 0.3),
              color: theme.palette.primary.dark,
              boxShadow: 'none',
              transform: 'translateY(-1px)',
            }
          }}
        >
          Upgrade Plan
        </Button>
      </Box>
    </>
  );
}
