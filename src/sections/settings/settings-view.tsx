"use client"

import type { RootState } from "src/services/store";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sun, Bell, Moon, Save, Globe, Trash } from "lucide-react";

import {
  Box,
  Card,
  Grid,
  Alert,
  Switch,
  Button,
  Divider,
  Snackbar,
  Container,
  Typography,
  CardContent,
  FormControlLabel,
} from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";
import { toggleDarkMode } from "src/services/slices/userDashboardSlice";

export function SettingsView() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state: RootState) => state.userDashboard.preferences);
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    articlePublished: true,
    commentReceived: true,
    weeklyDigest: true,
  });
  
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotifications({
      ...notifications,
      [event.target.name]: event.target.checked,
    });
  };
  
  const handleThemeToggle = () => {
    dispatch(toggleDarkMode());
  };
  
  const handleSaveSettings = () => {
    // Here you would save the settings to your backend
    console.log('Saving settings:', { darkMode, notifications });
    setShowSaveSuccess(true);
  };
  
  const handleClearSettings = () => {
    // Reset to defaults
    setNotifications({
      emailNotifications: true,
      pushNotifications: false,
      articlePublished: true,
      commentReceived: true,
      weeklyDigest: true,
    });
  };

  return (
    <DashboardContent>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, mt: 2 }}>
          <Typography variant="h4" gutterBottom>
            Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your account settings and preferences
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {/* Theme Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Appearance
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={darkMode} 
                      onChange={handleThemeToggle}
                      name="darkMode"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography>Dark Mode</Typography>
                      {darkMode ? 
                        <Moon size={16} style={{ marginLeft: 8 }} /> : 
                        <Sun size={16} style={{ marginLeft: 8 }} />
                      }
                    </Box>
                  }
                />
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Switch between light and dark theme for your dashboard
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Notification Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Bell size={20} />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Notifications
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={notifications.emailNotifications} 
                      onChange={handleNotificationChange}
                      name="emailNotifications"
                    />
                  }
                  label="Email Notifications"
                />
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={notifications.pushNotifications} 
                      onChange={handleNotificationChange}
                      name="pushNotifications"
                    />
                  }
                  label="Push Notifications"
                />
                
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Notification Events
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={notifications.articlePublished} 
                      onChange={handleNotificationChange}
                      name="articlePublished"
                    />
                  }
                  label="When an article is published"
                />
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={notifications.commentReceived} 
                      onChange={handleNotificationChange}
                      name="commentReceived"
                    />
                  }
                  label="When you receive a comment"
                />
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={notifications.weeklyDigest} 
                      onChange={handleNotificationChange}
                      name="weeklyDigest"
                    />
                  }
                  label="Weekly performance digest"
                />
              </CardContent>
            </Card>
          </Grid>
          
          {/* Language Settings */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Globe size={20} />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Language & Region
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Typography variant="body2" color="text.secondary">
                  Your dashboard is currently set to English (US). Language settings will be added in a future update.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<Trash size={18} />}
                onClick={handleClearSettings}
              >
                Reset to Defaults
              </Button>
              
              <Button 
                variant="contained" 
                startIcon={<Save size={18} />}
                onClick={handleSaveSettings}
              >
                Save Settings
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        {/* Success Notification */}
        <Snackbar
          open={showSaveSuccess}
          autoHideDuration={4000}
          onClose={() => setShowSaveSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setShowSaveSuccess(false)} 
            severity="success" 
            sx={{ width: '100%' }}
          >
            Settings saved successfully!
          </Alert>
        </Snackbar>
      </Container>
    </DashboardContent>
  );
}
