import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  Step, 
  Stepper,
  StepLabel,
  Typography
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import SelectPlatform from './SelectPlatform';
import WebsiteDetails from './WebsiteDetails';

// Platform options
export const platforms = [
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
    id: 'woocommerce',
    name: 'WooCommerce',
    icon: '/assets/icons/platforms/woocommerce.svg',
    description: 'Connect your WooCommerce store',
  },
];

// Business type options
export const businessTypes = [
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

export interface StoreFormData {
  platform: string;
  name: string;
  domain: string;
  businessType: string;
  appId: string;
  appPassword: string;
  acceptTerms: boolean;
}

export default function AddStoreFlow() {
  const navigate = useNavigate();
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
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const steps = ['Select Platform', 'Website Details'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate('/stores');
    } else {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success alert
      setShowSuccessAlert(true);
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/stores');
      }, 3000);
    } catch (error) {
      console.error('Error connecting store:', error);
    }
  };

  const handleUpdateFormData = (data: Partial<StoreFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <SelectPlatform 
            selectedPlatform={formData.platform}
            onSelectPlatform={(platform) => handleUpdateFormData({ platform })}
            onNext={handleNext}
            onBack={handleBack}
            platforms={platforms}
          />
        );
      case 1:
        return (
          <WebsiteDetails 
            formData={formData}
            onUpdateFormData={handleUpdateFormData}
            onSubmit={handleSubmit}
            onBack={handleBack}
            businessTypes={businessTypes}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DashboardContent>
        <Typography variant="h4" gutterBottom>
          Add New Store
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {renderStepContent()}
    </DashboardContent>
  );
} 