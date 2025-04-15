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

// Import platform-specific forms
import WordPressForm from './platform-forms/WordPressForm';
import ShopifyForm from './platform-forms/ShopifyForm';
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleUpdateField = (field: string, value: string) => {
    onUpdateFormData({ ...formData, [field]: value });
  };

  const validateForm = () => {
    const newErrors: Record<string, string | null> = {};
    let isValid = true;

    // Common validations
    if (!formData.domain) {
      newErrors.domain = 'Website URL is required';
      isValid = false;
    }
    
    if (!formData.name) {
      newErrors.name = 'Website name is required';
      isValid = false;
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
      isValid = false;
    }

    // Platform-specific validations
    switch (formData.platform) {
      case 'wordpress':
        if (!formData.adminUrl) {
          newErrors.adminUrl = 'Admin URL is required';
          isValid = false;
        }
        if (!formData.apiKey) {
          newErrors.apiKey = 'API Key is required';
          isValid = false;
        }
        if (!formData.apiSecret) {
          newErrors.apiSecret = 'API Secret is required';
          isValid = false;
        }
        break;
        
      case 'shopify':
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
        
      case 'woocommerce':
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
      case 'woocommerce':
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

  return (
    <Container maxWidth="md" component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.5 }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: theme.palette.background.paper,
          boxShadow: theme.shadows[1],
          mb: 4
        }}
      >
        <Typography 
          variant="h4" 
          align="center" 
          sx={{ 
            mb: 1,
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {formData.platform === 'wordpress' ? 'WordPress' : 
           formData.platform === 'shopify' ? 'Shopify' : 
           formData.platform === 'woocommerce' ? 'WooCommerce' : 
           'Website'} Details
        </Typography>
        
        <Typography 
          variant="body1" 
          align="center" 
          color="text.secondary" 
          sx={{ mb: 4 }}
        >
          Enter your {formData.platform} website information to continue
        </Typography>

        {renderPlatformForm()}
        
        {error && (
          <Typography 
            color="error" 
            variant="body2" 
            sx={{ 
              mt: 3,
              p: 1.5,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.error.main, 0.1),
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            }}
          >
            {error}
          </Typography>
        )}
        
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 4,
            pt: 3,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Button
            variant="outlined"
            onClick={onBack}
            startIcon={<ChevronLeft size={18} />}
            size="large"
            sx={{
              borderRadius: 1.5,
              px: 3,
              py: 1,
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: theme.shadows[1],
              },
            }}
          >
            Back
          </Button>
          
          <Button
            variant="contained"
            onClick={handleSubmit}
            endIcon={isLoading ? null : <ChevronRight size={18} />}
            disabled={isLoading}
            size="large"
            sx={{
              borderRadius: 1.5,
              px: 3,
              py: 1,
              fontWeight: 600,
              background: !isLoading
                ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                : undefined,
              boxShadow: !isLoading ? theme.shadows[3] : 'none',
              '&:hover': {
                boxShadow: !isLoading ? theme.shadows[5] : 'none',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Connecting...
              </Box>
            ) : (
              'Connect Store'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}