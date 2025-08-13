import type { IconButtonProps } from '@mui/material/IconButton';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import { Divider } from '@mui/material';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';

// Router import removed as we're using direct navigation
import { useThemeMode } from 'src/hooks/useThemeMode';

import { getStatusColors } from 'src/utils/subscriptionStatusUtils';

import { _myAccount } from 'src/_mock';
import { logout } from 'src/services/slices/auth/authSlice';
import { selectAuthUser } from 'src/services/slices/auth/selectors';
import { selectSubscriptionDetails } from 'src/services/slices/subscription/subscriptionSlice';
import { useGetSubscriptionPlansQuery, useGetSubscriptionDetailsQuery } from 'src/services/apis/subscriptionApi';

import { Iconify } from 'src/components/iconify';
import { SupportButton } from 'src/components/support';
import { LanguageSwitcher } from 'src/components/language/language-switcher';


// ----------------------------------------------------------------------

export type AccountPopoverProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

export function AccountPopover({ data = [], sx, ...other }: AccountPopoverProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeMode();

  const user = useSelector(selectAuthUser);
  const subscriptionDetails = useSelector(selectSubscriptionDetails);
  const { data: subscriptionData } = useGetSubscriptionDetailsQuery();
  const { data: availablePlans = [] } = useGetSubscriptionPlansQuery();

  let currentPlan = null;

  if (subscriptionData?.plan_id && availablePlans.length > 0) {
    // First try: Match by plan_id
    currentPlan = availablePlans.find(plan => plan.id === subscriptionData.plan_id || plan.id === String(subscriptionData.plan_id));

    // Second try: If no match by ID, try matching by name
    if (!currentPlan && subscriptionData.subscription_name) {
      currentPlan = availablePlans.find(plan =>
        plan.name.toLowerCase() === subscriptionData.subscription_name.toLowerCase()
      );
    
    }
  }

  // Simple state for popover
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Enhanced open handler with proper anchor element handling
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    // Prevent default behavior to avoid any navigation
    event.preventDefault();
    event.stopPropagation();

    // Set the anchor element to the current target (the avatar button)
    setAnchorEl(event.currentTarget);
  };

  console.log('🔍 Subscription Data Debug:', {
    subscriptionData,
    status: subscriptionData?.status,
    hasStatus: !!subscriptionData?.status,
    statusType: typeof subscriptionData?.status
  });
  
  // Close handler is now directly using setAnchorEl(null) where needed

  // Handle menu item click with improved navigation and proper closing
  const handleClickItem = (path: string) => {
    // First close the popover
    setAnchorEl(null);

    // Force immediate closing of the popover
    document.body.click();

    // Navigate after a very short delay to ensure popover is closed
    setTimeout(() => {
      // Use direct navigation to ensure proper routing
      window.location.href = path;
    }, 10);
  };

  // Handle logout with improved navigation and proper closing
  const handleLogOut = () => {
    // First close the popover
    setAnchorEl(null);

    // Force immediate closing of the popover
    document.body.click();

    // Navigate after a very short delay to ensure popover is closed
    setTimeout(() => {
      // Dispatch logout action (this will handle all storage cleanup)
      dispatch(logout());

      // Use direct navigation for more reliable routing
      window.location.href = '/sign-in';
    }, 10);
  };

  // Handle theme toggle
  const handleToggleTheme = () => {
    toggleTheme();
  };

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 1200, // Higher z-index for the container
      }}
    >
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          width: 40,
          height: 40,
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          ...sx,
        }}
        {...other}
      >
        <Avatar
          src={user?.avatar?.includes('http') ? user?.avatar : _myAccount.photoURL}
          alt={_myAccount.displayName}
          sx={{
            width: 40,
            height: 40,
          }}
        />
        
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        disableRestoreFocus // Prevents focus issues that can cause reopening
        disableScrollLock // Prevents scroll issues
        disablePortal={false} // Use portal for better positioning
        keepMounted={false} // Don't keep in DOM when closed
        slotProps={{
          paper: {
            sx: {
              width: 240,
              maxHeight: '85vh',
              mt: 1.5,
              overflow: 'hidden',
              boxShadow: theme.customShadows.z16,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.grey[500], 0.08)}`,
              bgcolor: theme.palette.background.paper,
              zIndex: 1300, // Higher z-index to ensure it appears above other elements
            },
          },
        }}
      >
        {/* User Info Section */}
        <Box
          sx={{
            p: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar
              src={user?.avatar?.includes('http') ? user?.avatar : _myAccount.photoURL}
              alt={_myAccount.displayName}
              sx={{ width: 36, height: 36, mr: 1.5 }}
            />
            <Box>
              <Typography variant="subtitle2" noWrap>
                {user?.name || _myAccount?.displayName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                {user?.email || _myAccount?.email}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap'
            }}
          >
            {/* Plan Name with Icon */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                bgcolor: subscriptionDetails?.subscription_name?.toLowerCase().includes('free')
                  ? 'rgba(156, 163, 175, 0.1)'
                  : 'rgba(79, 70, 229, 0.1)',
                border: `1px solid ${subscriptionDetails?.subscription_name?.toLowerCase().includes('free')
                  ? 'rgba(156, 163, 175, 0.2)'
                  : 'rgba(79, 70, 229, 0.2)'}`,
              }}
            >
              <Iconify
                icon={subscriptionDetails?.subscription_name?.toLowerCase().includes('free')
                  ? 'mdi:gift-outline'
                  : subscriptionDetails?.subscription_name?.toLowerCase().includes('enterprise')
                    ? 'mdi:crown'
                    : subscriptionDetails?.subscription_name?.toLowerCase().includes('pro')
                      ? 'mdi:diamond'
                      : 'mdi:rocket-launch'
                }
                width={16}
                height={16}
                sx={{
                  color: subscriptionDetails?.subscription_name?.toLowerCase().includes('free')
                    ? 'text.secondary'
                    : 'primary.main'
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: subscriptionDetails?.subscription_name?.toLowerCase().includes('free')
                    ? 'text.secondary'
                    : 'primary.main',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                {currentPlan?.name || subscriptionData?.subscription_name || 'Free'}
              </Typography>
            </Box>

            {/* Subscription Status */}
            {(() => {
              // Show status if available, or debug info if not
              const status = subscriptionData?.status || 'unknown';
              const statusColors = getStatusColors(status);
              const statusText = status;

              return (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 1.5,
                    bgcolor: statusColors.background,
                    border: `1px solid ${statusColors.border}`,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: statusColors.dot
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: statusColors.text,
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      textTransform: 'capitalize'
                    }}
                  >
                    {statusText}
                  </Typography>
                </Box>
              );
            })()}
          </Box>
        </Box>

        {/* Menu Items */}
        <MenuList disablePadding>
          <MenuItem
            onClick={() => handleClickItem('/profile')}
            sx={{
              py: 1.5,
              px: 2.5,
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify
                icon="mdi:account-outline"
                sx={{
                  width: 20,
                  height: 20,
                  mr: 1,
                  color: 'text.secondary'
                }}
              />
              <Typography variant="body2">{t('account.profile', 'Profile')}</Typography>
            </Box>
          </MenuItem>

          <MenuItem
            onClick={() => handleClickItem('/settings')}
            sx={{
              py: 1.5,
              px: 2.5,
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify
                icon="mdi:settings-outline"
                sx={{
                  width: 20,
                  height: 20,
                  mr: 1,
                  color: 'text.secondary'
                }}
              />
              <Typography variant="body2">{t('account.settings', 'Settings')}</Typography>
            </Box>
          </MenuItem>

          <MenuItem
            onClick={() => handleClickItem('/stores')}
            sx={{
              py: 1.5,
              px: 2.5,
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify
                icon="mdi:storefront-outline"
                sx={{
                  width: 20,
                  height: 20,
                  mr: 1,
                  color: 'text.secondary'
                }}
              />
              <Typography variant="body2">{t('account.myWebsites', 'My websites')}</Typography>
            </Box>
          </MenuItem>

          <MenuItem
            onClick={handleLogOut}
            sx={{
              py: 1.5,
              px: 2.5,
              borderRadius: 1.5,
              mx: 1,
              mb: 1,
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              bgcolor: alpha(theme.palette.error.main, 0.05),
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.1),
                borderColor: alpha(theme.palette.error.main, 0.3),
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify
                icon="mdi:logout"
                sx={{
                  width: 20,
                  height: 20,
                  mr: 1,
                  color: 'error.main'
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: 'error.main',
                  fontWeight: 600
                }}
              >
                {t('account.signOut', 'Sign Out')}
              </Typography>
            </Box>
          </MenuItem>
        </MenuList>

        <Divider sx={{ my: 0.5 }} />

        {/* Preferences Section */}
        <Box sx={{ px: 2.5, pt: 1.5, pb: 1 }}>
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              color: 'text.secondary',
              fontWeight: 'medium',
              fontSize: '0.75rem',
              mb: 1
            }}
          >
            {t('account.preferences', 'Preferences')}
          </Typography>
        </Box>

        {/* Language Switcher */}
        <Box
          sx={{
            px: 2.5,
            pb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="body2">{t('account.language', 'Language')}</Typography>
          <LanguageSwitcher />
        </Box>

        {/* Support Button */}
        <Box
          sx={{
            px: 2.5,
            pb: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="body2">{t('account.support', 'Support')}</Typography>
          <SupportButton />
        </Box>

        {/* Theme Toggle */}
        <Box
          sx={{
            px: 2.5,
            pb: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="body2">{t('account.theme', 'Theme')}</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              onClick={handleToggleTheme}
              sx={{
                p: 0.5,
                color: !isDarkMode ? theme.palette.primary.main : 'text.secondary',
                bgcolor: !isDarkMode ? 'rgba(79, 70, 229, 0.08)' : 'transparent'
              }}
            >
              <Iconify icon="mdi:desktop-mac" width={18} height={18} />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleToggleTheme}
              sx={{
                p: 0.5,
                color: !isDarkMode ? 'text.secondary' : theme.palette.primary.main,
                bgcolor: !isDarkMode ? 'transparent' : 'rgba(79, 70, 229, 0.08)'
              }}
            >
              <Iconify icon="mdi:weather-sunny" width={18} height={18} />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleToggleTheme}
              sx={{
                p: 0.5,
                color: isDarkMode ? theme.palette.primary.main : 'text.secondary',
                bgcolor: isDarkMode ? alpha(theme.palette.primary.main, 0.08) : 'transparent'
              }}
            >
              <Iconify icon="mdi:weather-night" width={18} height={18} />
            </IconButton>
          </Box>
        </Box>



        {/* Upgrade Plan Button */}
        <Box sx={{ p: 2, pt: 1 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleClickItem('/upgrade-license')}
            startIcon={
              <Iconify
                icon="mdi:rocket-launch"
                width={18}
                height={18}
              />
            }
            sx={{
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
              textTransform: 'none',
              bgcolor: 'rgba(79, 70, 229, 0.1)',
              color: 'primary.main',
              border: `1px solid rgba(79, 70, 229, 0.2)`,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: 'rgba(79, 70, 229, 0.15)',
                borderColor: 'rgba(79, 70, 229, 0.3)',
                color: 'primary.dark',
                boxShadow: 'none',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {t('account.upgradePlan', 'Upgrade Plan')}
          </Button>
        </Box>
      </Popover>
    </Box>
  );
}
