import type { RootState } from 'src/services/store';
import type { StackProps } from '@mui/material/Stack';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

// ----------------------------------------------------------------------

export function NavUpgrade({ sx, ...other }: StackProps) {
  const navigate = useNavigate();
  
  // Get user subscription data from Redux store
  const userPlan = useSelector((state: RootState) => state.user?.subscription?.plan || 'Free');
  const creditsUsed = useSelector((state: RootState) => state.user?.credits?.used || 0);
  const creditsTotal = useSelector((state: RootState) => state.user?.credits?.total || 100);
  
  // Calculate percentage of credits used
  const creditsPercentage = Math.min((creditsUsed / creditsTotal) * 100, 100);
  const creditsRemaining = creditsTotal - creditsUsed;
  
  return (
    <>
      {/* Plan and Credits Info */}
      <Box
        sx={{
          width: '100%',
          p: 2,
          mb: 2,
          borderRadius: 1,
          bgcolor: (theme) => theme.palette.background.neutral,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle2">Current Plan</Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 'bold',
              color: (theme) => userPlan === 'Free' ? theme.palette.text.primary : theme.palette.primary.main
            }}
          >
            {userPlan}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box mb={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Typography variant="body2">Credits</Typography>
            <Typography variant="body2">{creditsUsed}/{creditsTotal}</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={creditsPercentage} 
            sx={{ 
              height: 6, 
              borderRadius: 1,
              bgcolor: (theme) => theme.palette.background.paper,
              '& .MuiLinearProgress-bar': {
                bgcolor: (theme) => 
                  creditsPercentage > 90 
                    ? theme.palette.error.main 
                    : creditsPercentage > 70 
                      ? theme.palette.warning.main 
                      : theme.palette.success.main
              }
            }} 
          />
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              mt: 0.5,
              color: (theme) => 
                creditsPercentage > 90 
                  ? theme.palette.error.main 
                  : 'text.secondary'
            }}
          >
            {creditsRemaining} credits remaining
          </Typography>
        </Box>
      </Box>
      
      {/* Upgrade Button */}
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        sx={{ mb: 4, textAlign: 'center', ...sx }}
        {...other}
      >
        <Typography
          variant="h6"
          sx={(theme) => ({
            fontWeight: 'bold',
            fontSize: '1.2rem',
            color: theme.palette.text.primary,
            mb: 1,
          })}
        >
          Want to unlock more features?
        </Typography>

        <Button
          onClick={() => {
            navigate("/upgrade-license")
          }}
          variant="contained"
          color="primary"
          sx={(theme) => ({
            px: 4,
            py: 1.5,
            borderRadius: '20px',
            boxShadow: '0px 4px 15px rgba(0,0,0,0.2)',
            fontWeight: 'bold',
            textTransform: 'none',
            background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            '&:hover': {
              background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            },
          })}
        >
          Upgrade to Pro 🚀
        </Button>
      </Box>
    </>
  );
}
