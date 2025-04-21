import { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';

import { 
  Box, 
  Paper,
  alpha, 
  Button, 
  Dialog,
  Tooltip,
  useTheme,
  Container,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  CircularProgress
} from '@mui/material';

import WixForm from './platform-forms/WixForm';
import ShopifyForm from './platform-forms/ShopifyForm';
import WordPressForm from './platform-forms/WordPressForm';

// Video mapping for each platform
const PLATFORM_VIDEOS = {
  wordpress: 'https://www.youtube.com/embed/example-wordpress',
  shopify: 'https://www.youtube.com/embed/example-shopify',
  wix: 'https://www.youtube.com/embed/example-wix',
};

interface WebsiteDetailsProps {
  formData: {
    platform: string;
    name: string;
    domain: string;
    [key: string]: any;
  };
  onUpdateFormData: (data: Record<string, any>) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function WebsiteDetails({
  formData,
  onUpdateFormData,
  onSubmit,
  onBack,
  isLoading = false,
  error = null,
}: WebsiteDetailsProps) {
  const theme = useTheme();
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);

  const handleUpdateField = (field: string, value: string) => {
    onUpdateFormData({ ...formData, [field]: value });
  };

  // Update the validateForm function to include the new fields
  const validateForm = () => {
    const newErrors: Record<string, string | null> = {};
    let isValid = true;
    // Platform-specific validations
    switch (formData.platform) {
      case 'wordpress':
        if (!formData.store_url) {
          newErrors.store_url = 'Store URL is required';
          isValid = false;
        }
        if (!formData.store_username) {
          newErrors.store_username = 'Store username is required';
          isValid = false;
        }
        if (!formData.store_password) {
          newErrors.store_password = 'Store password is required';
          isValid = false;
        }
        break;
        
      case 'shopify':
        // Existing Shopify validations
        if (!formData.shopifyStore) {
          newErrors.shopifyStore = 'Shopify store name is required';
          isValid = false;
        }
        if (!formData.appId) {
          newErrors.appId = 'App ID is required';
          isValid = false;
        }
        if (!formData.appPassword) {
          newErrors.appPassword = 'App Password is required';
          isValid = false;
        }
        break;
        
      case 'wix':
        if (!formData.adminUrl) {
          newErrors.adminUrl = 'Admin URL is required';
          isValid = false;
        }
        if (!formData.consumerKey) {
          newErrors.consumerKey = 'Consumer Key is required';
          isValid = false;
        }
        if (!formData.consumerSecret) {
          newErrors.consumerSecret = 'Consumer Secret is required';
          isValid = false;
        }
        break;
      default:
        return false;
  }
  
  setErrors(newErrors);
  return isValid;
};

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  const renderPlatformForm = () => {
    switch (formData.platform) {
      case 'wordpress':
        return (
          <WordPressForm 
            formData={formData} 
            onUpdateField={handleUpdateField} 
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 'shopify':
        return (
          <ShopifyForm 
            formData={formData} 
            onUpdateField={handleUpdateField} 
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 'wix':
        return (
          <WixForm 
            formData={formData} 
            onUpdateField={handleUpdateField} 
            errors={errors}
            setErrors={setErrors}
          />
        );
      default:
        return (
          <Typography color="error" variant="body1" align="center">
            Please select a platform first
          </Typography>
        );
    }
  };

  // Get the appropriate video URL based on the selected platform
  const getVideoUrl = () => PLATFORM_VIDEOS[formData.platform as keyof typeof PLATFORM_VIDEOS] || '';

  // Make sure we're actually rendering content
  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Form Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              flex: '1 1 60%',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">
                {formData.platform === 'wordpress' 
                  ? 'WordPress Integration' 
                  : formData.platform === 'shopify' 
                    ? 'Shopify Integration' 
                    : formData.platform === 'wix' 
                      ? 'Wix Integration' 
                      : 'Website Details'}
              </Typography>
              
              <Tooltip title="Watch integration guide">
                <IconButton 
                  color="primary" 
                  onClick={() => setVideoDialogOpen(true)}
                  disabled={!formData.platform}
                >
                  <HelpCircle size={20} />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Please provide the details for your {formData.platform} website.
            </Typography>
            
            {renderPlatformForm()}
            
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={onBack}
                startIcon={<ChevronLeft size={16} />}
                disabled={isLoading}
              >
                Back
              </Button>
              
              <Button
                variant="contained"
                onClick={handleSubmit}
                endIcon={isLoading ? null : <ChevronRight size={16} />}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Connecting...
                  </>
                ) : (
                  'Connect Store'
                )}
              </Button>
            </Box>
          </Paper>

          {/* Video Guide Section - Visible alongside the form */}
          {formData.platform && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                flex: '1 1 40%',
                display: { xs: 'none', md: 'block' }, // Hide on mobile, show on desktop
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Integration Guide
              </Typography>
              
              <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%', mb: 2 }}>
                <iframe
                  src={getVideoUrl()}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${formData.platform} Integration Guide`}
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                This video shows how to find and set up the required credentials for your {formData.platform} store integration.
              </Typography>
              
              {/* Mobile-only button to open full-screen video */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setVideoDialogOpen(true)}
                  startIcon={<HelpCircle size={16} />}
                  fullWidth
                >
                  Watch Integration Guide
                </Button>
              </Box>
            </Paper>
          )}
        </Box>
      </motion.div>

      {/* Video Guide Dialog - For full-screen viewing */}
      <Dialog
        open={videoDialogOpen}
        onClose={() => setVideoDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            How to Connect Your {formData.platform === 'wordpress' 
              ? 'WordPress' 
              : formData.platform === 'shopify' 
                ? 'Shopify' 
                : formData.platform === 'wix' 
                  ? 'Wix' 
                  : ''} Store
          </Typography>
          <IconButton onClick={() => setVideoDialogOpen(false)} size="small">
            <Box component="span" sx={{ fontSize: '1.5rem' }}>&times;</Box>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
            <iframe
              src={getVideoUrl()}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '8px',
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${formData.platform} Integration Guide`}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Follow this guide to find and set up the required credentials for your {formData.platform} store integration.
          </Typography>
        </DialogContent>
      </Dialog>
    </Container>
  );
}