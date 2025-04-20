import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { 
  Box, 
  Paper,
  alpha, 
  Button, 
  useTheme,
  Container,
  Typography,
  CircularProgress
} from '@mui/material';

import ShopifyForm from './platform-forms/ShopifyForm';
// Import platform-specific forms
import WordPressForm from './platform-forms/WordPressForm';
import WooCommerceForm from './platform-forms/WooCommerceForm';

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
  // Remove the isLoaded state since it's not being properly updated
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  // Add back a simple useEffect to handle any initialization if needed

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
        // Existing WooCommerce validations
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
          <WooCommerceForm 
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

  // Make sure we're actually rendering content
  return (
    <Container maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography variant="h5" gutterBottom>
            {formData.platform === 'wordpress' 
              ? 'WordPress Integration' 
              : formData.platform === 'shopify' 
                ? 'Shopify Integration' 
                : formData.platform === 'wix' 
                  ? 'WooCommerce Integration' 
                  : 'Website Details'}
          </Typography>
          
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
      </motion.div>
    </Container>
  );
}