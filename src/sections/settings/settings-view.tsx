import { useState } from "react";
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Stack,
  Switch,
  Button,
  Divider,
  Container,
  Typography,
  CardContent,
  FormControlLabel,
} from "@mui/material";

import { useThemeMode } from "src/hooks/useThemeMode";

import { DashboardContent } from "src/layouts/dashboard";

import { Iconify } from 'src/components/iconify';

export function SettingsView() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useThemeMode();

  // Settings state
  const [settings, setSettings] = useState({
    // Core settings
    darkMode: isDarkMode,
    emailUpdates: true,

    // Content preferences
    defaultLanguage: 'en',
    autoSave: true,
    autoSaveInterval: 30, // seconds

    // AI preferences
    aiTone: 'professional',
    aiCreativity: 7, // 1-10 scale

    // SEO preferences
    autoSeoOptimization: true,
    focusKeywordReminders: true,

    // Publishing preferences
    defaultVisibility: 'draft',
    enableAnalytics: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically save to API
    toast.success(t('settings.saved', 'Settings saved successfully!'));
  };

  return (
    <DashboardContent>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 4, mt: 2 }}>
          <Typography variant="h4" gutterBottom>
            {t('settings.title', 'Settings')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('settings.subtitle', 'Customize your content creation experience')}
          </Typography>
        </Box>

        {/* Single Settings Container */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: theme.customShadows?.card,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={4}>

              {/* Appearance Section */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Iconify
                    icon={isDarkMode ? 'solar:moon-bold' : 'solar:sun-bold'}
                    width={24}
                    sx={{ color: 'primary.main', mr: 2 }}
                  />
                  <Typography variant="h6">
                    {t('settings.appearance.title', 'Appearance')}
                  </Typography>
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.darkMode}
                      onChange={(e) => {
                        handleSettingChange('darkMode', e.target.checked);
                        toggleTheme();
                      }}
                      sx={{
                        '& .MuiSwitch-thumb': {
                          backgroundColor: settings.darkMode ? '#1976d2' : '#ffa726',
                        }
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">
                        {t('settings.appearance.darkMode', 'Dark Mode')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('settings.appearance.darkModeDesc', 'Switch between light and dark theme')}
                      </Typography>
                    </Box>
                  }
                  sx={{ alignItems: 'flex-start', ml: 0 }}
                />
              </Box>

              <Divider />

              {/* Communication Section */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Iconify
                    icon="solar:letter-bold"
                    width={24}
                    sx={{ color: 'primary.main', mr: 2 }}
                  />
                  <Typography variant="h6">
                    {t('settings.communication.title', 'Communication')}
                  </Typography>
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailUpdates}
                      onChange={(e) => handleSettingChange('emailUpdates', e.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">
                        {t('settings.communication.emailUpdates', 'Email Updates')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('settings.communication.emailUpdatesDesc', 'Receive updates about new features and improvements')}
                      </Typography>
                    </Box>
                  }
                  sx={{ alignItems: 'flex-start', ml: 0 }}
                />
              </Box>

              <Divider />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSaveSettings}
                  startIcon={<Iconify icon="solar:diskette-bold" width={18} />}
                  sx={{
                    px: 4,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: theme.customShadows?.primary,
                  }}
                >
                  {t('settings.save', 'Save Settings')}
                </Button>
              </Box>

            </Stack>
          </CardContent>
        </Card>
      </Container>
    </DashboardContent>
  );
}
