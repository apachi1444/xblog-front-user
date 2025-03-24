import type { StackProps } from '@mui/material/Stack';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';


// ----------------------------------------------------------------------

export function NavUpgrade({ sx, ...other }: StackProps) {
  const navigate = useNavigate()
  return (
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
    // Remove href and target attributes to prevent opening in new tab
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


  );
}
