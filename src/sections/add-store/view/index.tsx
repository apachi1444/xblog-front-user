import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DashboardContent } from 'src/layouts/dashboard';
import { useConnectWordPressMutation } from 'src/services/apis/integrations/wordpressApi';

import { FormStepper } from 'src/components/stepper/FormStepper';

import SelectPlatform from './SelectPlatform';
import WebsiteDetails from './WebsiteDetails';

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
    id: 'wix',
    name: 'Wix',
    icon: '/assets/icons/platforms/wix.svg',
    description: 'Connect your Wix store',
  },
];
export interface StoreFormData {
  platform: string;
  name: string;
  domain: string;
  businessType: string;
  appId: string;
  appPassword: string;
  acceptTerms: boolean;
  // Additional platform-specific fields
  adminUrl?: string;
  apiKey?: string;
  apiSecret?: string;
  shopifyStore?: string;
  consumerKey?: string;
  consumerSecret?: string;
  // New WordPress fields
  store_url?: string;
  store_username?: string;
  store_password?: string;
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // WordPress API mutation hook
  const [connectWordPress] = useConnectWordPressMutation();

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
      setIsLoading(true);
      setError(null);      
      
      if (formData.platform === 'wordpress') {
        // Use the WordPress API
        const response = await connectWordPress({
          store_url: formData.store_url || '',
          store_username: formData.store_username || '',
          store_password: formData.store_password || '',
          name: formData.name,
          domain: formData.domain,
        }).unwrap();
        
        // Handle successful response
        console.log('WordPress store connected:', response);
      } else {
        // Handle other platforms (existing code)
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      // Show success alert
      setShowSuccessAlert(true);
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/stores');
      }, 3000);
    } catch (errore) {
      console.error('Error connecting store:', error);
      setError('Failed to connect store. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
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
            isLoading={isLoading}
            error={null}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DashboardContent>
      <FormStepper
        steps={['Content Setup', 'Content Structuring']}
        activeStep={activeStep}
      />
      
      {renderStepContent()}
    </DashboardContent>
  );
}