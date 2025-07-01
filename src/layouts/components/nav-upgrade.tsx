import type { StackProps } from '@mui/material/Stack';

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { varAlpha } from 'src/theme/styles/utils';


// ----------------------------------------------------------------------

export function NavUpgrade({ sx, ...other }: StackProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <>      
      
      {/* Upgrade Button */}
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        sx={{ mb: 4, textAlign: 'center', ...sx }}
        {...other}
      >
        <Button
          onClick={() => {
            navigate("/upgrade-license")
          }}
          variant="contained"
          sx={(theme) => ({
            px: 4,
            py: 1.5,
            borderRadius: '20px',
            boxShadow: '0px 3px 10px rgba(0,0,0,0.15)',
            fontWeight: 600,
            textTransform: 'none',
            background: `linear-gradient(to right, ${varAlpha(theme.palette.primary.mainChannel, 0.7)}, ${varAlpha(theme.palette.primary.darkChannel, 0.7)})`,
            color: theme.palette.primary.contrastText,
            opacity: 0.85,
            '&:hover': {
              background: `linear-gradient(to right, ${varAlpha(theme.palette.primary.darkChannel, 0.8)}, ${varAlpha(theme.palette.primary.mainChannel, 0.8)})`,
              opacity: 0.95,
            },
          })}
        >
          {t('upgrade.upgradeToPro', 'Upgrade to Pro 🚀')}
        </Button>
      </Box>
    </>
  );
}
