import { useState } from 'react';
import {
  Box,
  Step,
  Modal,
  Fade,
  Card,
  Grid,
  Button,
  Stepper,
  TextField,
  Typography,
  StepLabel,
  Checkbox,
  FormControlLabel,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Iconify } from 'src/components/iconify';

// Platform options
const platforms = [
  {
    id: 'wordpress',
    name: 'WordPress',
    icon: '/assets/icons/platforms/wordpress.svg',
    description: 'Connect your WordPress site',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    icon: '/assets/icons/platforms/shopify.svg',
    description: 'Connect your Shopify store',
  },
  {
    id: 'wix',
    name: 'Wix',
    icon: '/assets/icons/platforms/wix.svg',
    description: 'Connect your Wix store',
  },
];

// Business type options
const businessTypes = [
  'E-commerce',
  'Blog',
  'Technology',
  'Health & Wellness',
  'Finance',
  'Education',
  'Entertainment',
  'Food & Beverage',
  'Travel',
  'Other',
];

interface AddStoreModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface StoreFormData {
  platform: string;
  name: string;
  domain: string;
  businessType: string;
  appId: string;
  appPassword: string;
  acceptTerms: boolean;
}

export default function AddStoreModal({ open, onClose, onSuccess }: AddStoreModalProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<StoreFormData>({
    platform: '',
    name: '',
    domain: '',
    businessType: '',
    appId: '',
    appPassword: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlatformSelect = (platformId: string) => {
    setFormData({ ...formData, platform: platformId });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value, checked } = e.target as HTMLInputElement;
    
    if (name === 'acceptTerms') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name as string]: value });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.platform) {
        newErrors.platform = 'Please select a platform';
      }
    } else if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Website name is required';
      }
      if (!formData.domain.trim()) {
        newErrors.domain = 'Domain name is required';
      } else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.domain)) {
        newErrors.domain = 'Please enter a valid domain';
      }
      if (!formData.businessType) {
        newErrors.businessType = 'Business type is required';
      }
      if (!formData.appId.trim()) {
        newErrors.appId = 'Application ID is required';
      }
      if (!formData.appPassword.trim()) {
        newErrors.appPassword = 'Application password is required';
      }
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'You must accept the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(activeStep)) {
      setIsSubmitting(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Handle successful submission
        setIsSubmitting(false);
        onSuccess();
        
        // Reset form and close modal
        setFormData({
          platform: '',
          name: '',
          domain: '',
          businessType: '',
          appId: '',
          appPassword: '',
          acceptTerms: false,
        });
        setActiveStep(0);
        onClose();
      } catch (error) {
        setIsSubmitting(false);
        console.error('Error connecting store:', error);
      }
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ py: 3 }}>
            <Typography variant="h6" align="center" sx={{ mb: 3 }}>
              Select your platform
            </Typography>
            
            <Grid container spacing={3} justifyContent="center" sx={{ mb: 3 }}>
              {platforms.map((platform) => (
                <Grid item xs={12} sm={4} key={platform.id}>
                  <Card
                    onClick={() => handlePlatformSelect(platform.id)}
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      border: formData.platform === platform.id ? '2px solid' : '1px solid',
                      borderColor: formData.platform === platform.id ? 'primary.main' : 'divider',
                      boxShadow: formData.platform === platform.id ? 3 : 0,
                      '&:hover': {
                        boxShadow: 2,
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={platform.icon}
                      alt={platform.name}
                      sx={{
                        width: 64,
                        height: 64,
                        mb: 2,
                        opacity: formData.platform === platform.id ? 1 : 0.7,
                      }}
                    />
                    <Typography variant="subtitle1" fontWeight="bold">
                      {platform.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {platform.description}
                    </Typography>
                    
                    {formData.platform === platform.id && (
                      <Box
                        sx={{
                          mt: 2,
                          width: 24,
                          height: 24,
                          display: 'flex',
                          borderRadius: '50%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                        }}
                      >
                        <Check size={16} />
                      </Box>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {errors.platform && (
              <Typography color="error" variant="body2" align="center" sx={{ mb: 2 }}>
                {errors.platform}
              </Typography>
            )}
          </Box>
        );
        
      case 1:
        return (
          <Box sx={{ py: 3 }}>
            <Typography variant="h6" align="center" sx={{ mb: 3 }}>
              Enter your website details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Website Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Domain Name"
                  name="domain"
                  placeholder="example.com"
                  value={formData.domain}
                  onChange={handleInputChange}
                  error={!!errors.domain}
                  helperText={errors.domain}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Business Type"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  error={!!errors.businessType}
                  helperText={errors.businessType}
                >
                  {businessTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Application ID"
                  name="appId"
                  value={formData.appId}
                  onChange={handleInputChange}
                  error={!!errors.appId}
                  helperText={errors.appId}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Application Password"
                  name="appPassword"
                  type="password"
                  value={formData.appPassword}
                  onChange={handleInputChange}
                  error={!!errors.appPassword}
                  helperText={errors.appPassword}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                    />
                  }
                  label="I accept the terms and conditions"
                />
                {errors.acceptTerms && (
                  <FormHelperText error>{errors.acceptTerms}</FormHelperText>
                )}
              </Grid>
            </Grid>
          </Box>
        );
        
      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      aria-labelledby="add-store-modal-title"
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 600 },
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            overflow: 'auto',
          }}
        >
          <Typography id="add-store-modal-title" variant="h5" component="h2" sx={{ mb: 3 }}>
            Add New Store
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Select Platform</StepLabel>
            </Step>
            <Step>
              <StepLabel>Website Details</StepLabel>
            </Step>
          </Stepper>
          
          {renderStepContent()}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={activeStep === 0 ? onClose : handleBack}
              startIcon={activeStep === 0 ? null : <ChevronLeft size={16} />}
            >
              {activeStep === 0 ? 'Cancel' : 'Previous'}
            </Button>
            
            <Button
              variant="contained"
              onClick={activeStep === 1 ? handleSubmit : handleNext}
              endIcon={activeStep === 1 ? null : <ChevronRight size={16} />}
              disabled={isSubmitting}
            >
              {activeStep === 1 ? (
                isSubmitting ? 'Connecting...' : 'Connect Store'
              ) : (
                'Next'
              )}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
} 