import type { StackProps } from '@mui/material/Stack';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import { Popover } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useGetSubscriptionDetailsQuery } from 'src/services/apis/subscriptionApi';

import { useRegenerateManager } from 'src/sections/generate/hooks/useRegenerateManager';


// ----------------------------------------------------------------------

export function NavUpgrade({ sx, ...other }: StackProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { data: subscriptionDetails, isLoading } = useGetSubscriptionDetailsQuery();
  const { regenerationsAvailable, regenerationsTotal } = useRegenerateManager();

  if (isLoading || !subscriptionDetails) {
    return null;
  }

  const articlesUsed = subscriptionDetails.articles_created || 0;
  const articlesTotal = subscriptionDetails.articles_limit || 100;
  const websitesUsed = subscriptionDetails.connected_websites || 0;
  const websitesTotal = subscriptionDetails.websites_limit || 5;
  const regenerationsUsed = regenerationsTotal - regenerationsAvailable;

  // Calculate overall usage percentage (average of all resources)
  const articlesPercentage = Math.min((articlesUsed / articlesTotal) * 100, 100);
  const websitesPercentage = Math.min((websitesUsed / websitesTotal) * 100, 100);
  const regenerationsPercentage = Math.min((regenerationsUsed / regenerationsTotal) * 100, 100);

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {/* Simple Usage Container */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Box
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            p: 2.5,
            borderRadius: 2.5,
            bgcolor: alpha(theme.palette.info.main, 0.15),
            border: `1px solid ${alpha(theme.palette.info.main, 0.15)}`,
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              bgcolor: alpha(theme.palette.success.main, 0.8),
              borderColor: alpha(theme.palette.success.main, 0.25),
              transform: 'translateY(-1px)',
            }
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.success.main, textAlign: 'center' }}>
            Usage Overview
          </Typography>
        </Box>

        {/* Enhanced Usage Popover */}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleMouseLeave}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          disableRestoreFocus
          sx={{
            pointerEvents: 'none',
            '& .MuiPopover-paper': {
              pointerEvents: 'auto',
              mt: -1,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              boxShadow: `0 8px 24px ${alpha(theme.palette.grey[500], 0.12)}`,
            },
          }}
        >
          <Box sx={{ p: 3, minWidth: 240 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: 'text.primary' }}>
              Usage Details
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Articles */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Articles
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                    {articlesTotal - articlesUsed}/{articlesTotal}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Typography variant="h6" sx={{
                    fontWeight: 700,
                    color: articlesPercentage > 80 ? theme.palette.error.main :
                           articlesPercentage > 60 ? theme.palette.warning.main :
                           theme.palette.success.main,
                  }}>
                    {articlesTotal - articlesUsed}
                  </Typography>
                  <Typography variant="body2" sx={{
                    color: articlesPercentage > 80 ? theme.palette.error.main :
                           articlesPercentage > 60 ? theme.palette.warning.main :
                           theme.palette.success.main,
                    fontWeight: 600
                  }}>
                    ({Math.round(100 - articlesPercentage)}%)
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.grey[300], 0.3),
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${Math.min(articlesPercentage, 100)}%`,
                      bgcolor: articlesPercentage > 80 ? theme.palette.error.main :
                               articlesPercentage > 60 ? theme.palette.warning.main :
                               theme.palette.success.main,
                      borderRadius: 3,
                      transition: 'width 0.3s ease-in-out',
                    }}
                  />
                </Box>
              </Box>

              {/* Websites */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Websites
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                    {websitesTotal - websitesUsed}/{websitesTotal}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Typography variant="h6" sx={{
                    fontWeight: 700,
                    color: websitesPercentage > 80 ? theme.palette.error.main :
                           websitesPercentage > 60 ? theme.palette.warning.main :
                           theme.palette.success.main,
                  }}>
                    {websitesTotal - websitesUsed}
                  </Typography>
                  <Typography variant="body2" sx={{
                    color: websitesPercentage > 80 ? theme.palette.error.main :
                           websitesPercentage > 60 ? theme.palette.warning.main :
                           theme.palette.success.main,
                    fontWeight: 600
                  }}>
                    ({Math.round(100 - websitesPercentage)}%)
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.grey[300], 0.3),
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${Math.min(websitesPercentage, 100)}%`,
                      bgcolor: websitesPercentage > 80 ? theme.palette.error.main :
                               websitesPercentage > 60 ? theme.palette.warning.main :
                               theme.palette.success.main,
                      borderRadius: 3,
                      transition: 'width 0.3s ease-in-out',
                    }}
                  />
                </Box>
              </Box>

              {/* Regenerations */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Regenerations
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                    {regenerationsAvailable}/{regenerationsTotal}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Typography variant="h6" sx={{
                    fontWeight: 700,
                    color: regenerationsPercentage > 80 ? theme.palette.error.main :
                           regenerationsPercentage > 60 ? theme.palette.warning.main :
                           theme.palette.success.main,
                  }}>
                    {regenerationsAvailable}
                  </Typography>
                  <Typography variant="body2" sx={{
                    color: regenerationsPercentage > 80 ? theme.palette.error.main :
                           regenerationsPercentage > 60 ? theme.palette.warning.main :
                           theme.palette.success.main,
                    fontWeight: 600
                  }}>
                    ({Math.round(100 - regenerationsPercentage)}%)
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.grey[300], 0.3),
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${Math.min(regenerationsPercentage, 100)}%`,
                      bgcolor: regenerationsPercentage > 80 ? theme.palette.error.main :
                               regenerationsPercentage > 60 ? theme.palette.warning.main :
                               theme.palette.success.main,
                      borderRadius: 3,
                      transition: 'width 0.3s ease-in-out',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Popover>
      </Box>

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
