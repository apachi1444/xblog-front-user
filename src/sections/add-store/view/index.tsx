import { z } from 'zod';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import { DashboardContent } from 'src/layouts/dashboard';
import { useConnectWordPressMutation } from 'src/services/apis/integrations/wordpressApi';

import { FormStepper } from 'src/components/stepper/FormStepper';

import SelectPlatform from './SelectPlatform';
import WebsiteDetails from './WebsiteDetails';
import { SuccessAnimation } from './SuccessAnimation';

// Test mode for bypassing API errors (disabled in production)
const TEST_MODE = false;

export const platformCategories = {
  websites: [
    {
      id: 'wordpress',
      name: 'WordPress',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/WordPress_blue_logo.svg/512px-WordPress_blue_logo.svg.png',
      description: 'Connect your WordPress site',
      category: 'websites',
      enabled: true
    },
    {
      id: 'shopify',
      name: 'Shopify',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/512px-Shopify_logo_2018.svg.png',
      description: 'Coming soon - Connect your Shopify store',
      category: 'websites',
      enabled: false
    },
    {
      id: 'wix',
      name: 'Wix',
      icon: '/assets/images/wix.png',
      description: 'Coming soon - Connect your Wix store',
      category: 'websites',
      enabled: false
    },
    {
      id: 'ebay',
      name: 'eBay',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/512px-EBay_logo.svg.png',
      description: 'Coming soon - Connect your eBay store',
      category: 'websites',
      enabled: false
    },
    {
      id: 'custom',
      name: 'Custom Website',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/512px-HTML5_logo_and_wordmark.svg.png',
      description: 'Coming soon - Connect your custom website',
      category: 'websites',
      enabled: false
    }
  ],
  socialMedia: [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/512px-LinkedIn_logo_initials.png',
      description: 'Coming soon - Share content on LinkedIn',
      category: 'socialMedia',
      enabled: false
    },
    {
      id: 'reddit',
      name: 'Reddit',
      icon: 'https://cdn.worldvectorlogo.com/logos/reddit-4.svg',
      description: 'Coming soon - Post to Reddit communities',
      category: 'socialMedia',
      enabled: false
    },
    {
      id: 'quora',
      name: 'Quora',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Quora_logo_2015.svg/512px-Quora_logo_2015.svg.png',
      description: 'Coming soon - Answer questions on Quora',
      category: 'socialMedia',
      enabled: false
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      icon: '/assets/images/x.png',
      description: 'Coming soon - Post to X (formerly Twitter)',
      category: 'socialMedia',
      enabled: false
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/512px-Instagram_icon.png',
      description: 'Coming soon - Share on Instagram',
      category: 'socialMedia',
      enabled: false
    }
  ]
};

// Flatten all platforms for backward compatibility
export const platforms = [...platformCategories.websites, ...platformCategories.socialMedia];

// Create a schema for form validation
const storeFormSchema = z.object({
  platform: z.string().min(1, "Please select a platform").refine(
    (val) => {
      const platform = platforms.find(p => p.id === val);
      return platform?.enabled === true;
    },
    {
      message: "Selected platform is not available yet. Only WordPress is currently supported.",
    }
  ),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
  
  // WordPress specific fields with validation
  store_url: z.string().min(1, "WordPress URL is required")
    .url("Please enter a valid URL"),
  store_username: z.string().min(1, "WordPress username is required"),
  store_password: z.string().min(1, "Application password is required"),
  
  // Shopify specific fields
  shopifyStore: z.string().optional(),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  
  // Wix specific fields
  adminUrl: z.string().optional(),
  consumerKey: z.string().optional(),
  consumerSecret: z.string().optional(),
});

// Create a type from the schema
export type StoreFormData = z.infer<typeof storeFormSchema>;

export default function AddStoreFlow() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [integrationSuccess, setIntegrationSuccess] = useState(false);
  const [integrationError, setIntegrationError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // API mutation hooks
  const [connectWordPress , {isLoading : isWordPressLoading}] = useConnectWordPressMutation();

  const isLoading = isWordPressLoading

  const methods = useForm<StoreFormData>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      platform: 'other',
      acceptTerms: false,
    },
    mode: 'onChange',
  });

  const { watch, setValue, trigger } = methods;
  const selectedPlatform = watch('platform');

  const steps = [
    'Select Platform',
    'Store Details'
  ];

  const handleNext = async () => {
    // Validate current step before proceeding
    if (activeStep === 0) {
      const isValid = await trigger('platform');
      if (!isValid) return;
    }
    
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate('/stores');
    } else {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  // Centralized submit handler for all platforms
  const handleSubmit = async (data: StoreFormData) => {
    try {
      switch (data.platform) {
        case 'wordpress':
          await handleWordPressConnection(data);
          break;
        case 'shopify':
          await handleShopifyConnection(data);
          break;
        case 'wix':
          await handleWixConnection(data);
          break;
        case 'other':
        default:
          throw new Error('Please select a valid platform');
      }
      setTimeout(() => {
        setIntegrationSuccess(true);
        navigate('/stores');
      }, 3000);
    } catch (error: any) {
      console.error('Integration failed:', error);

      // Extract error message for display in modal
      let displayErrorMessage = 'Failed to connect. Please try again.';
      if (error?.data?.detail) {
        displayErrorMessage = error.data.detail;
      } else if (error?.message) {
        displayErrorMessage = error.message;
      }

      // Set error message and show error animation
      setErrorMessage(displayErrorMessage);
      setIntegrationError(true);

      // Hide error animation after 3 seconds
      setTimeout(() => {
        setIntegrationError(false);
        setErrorMessage('');
      }, 3000);

      // Don't navigate to success page on error
      // The user should fix the issue and try again
    }
  };

  // Platform-specific connection handlers
  const handleWordPressConnection = async (data: StoreFormData) => {
    try {
      await connectWordPress({
        store_url: data.store_url || '',
        store_username: data.store_username || '',
        store_password: data.store_password || '',
      }).unwrap();

      // Only show success if API call actually succeeded
      toast.success('Store connected successfully!');
    } catch (error: any) {
      // Log the actual error for debugging
      console.error('WordPress connection failed:', error);

      // Only use TEST_MODE for development, not for API errors
      if (TEST_MODE && process.env.NODE_ENV === 'development') {
        console.warn('TEST_MODE: Simulating success despite API error');
        setIntegrationSuccess(true);
        toast.success('Store connected successfully! (Test Mode)');
      } else {
        // Handle specific backend error messages (following auth pattern)
        let errorMessage = 'Failed to connect to WordPress. Please check your credentials and try again.';

        if (error?.data?.detail) {
          // Use the specific error message from the backend
          errorMessage = error.data.detail;
        } else if (error?.status) {
          // Handle specific HTTP status codes with custom messages
          switch (error.status) {
            case 400:
              if (error?.data?.detail === 'Store already connected') {
                errorMessage = 'This WordPress site is already connected to your account.';
              } else {
                errorMessage = 'Invalid request. Please check your WordPress site details.';
              }
              break;
            case 403:
              if (error?.data?.detail === "You've reached your connected website limit. Upgrade to continue.") {
                errorMessage = "You've reached your connected website limit. Upgrade your plan to connect more websites.";
              } else if (error?.data?.detail === 'Invalid credentials for WordPress') {
                errorMessage = 'Invalid WordPress credentials. Please check your username and password.';
              } else {
                errorMessage = 'Access denied. Please check your WordPress credentials and permissions.';
              }
              break;
            case 404:
              errorMessage = 'WordPress site not found. Please check the URL and try again.';
              break;
            case 500:
              errorMessage = 'Server error occurred. Please try again later.';
              break;
            default:
              errorMessage = error?.message || 'Failed to connect to WordPress. Please try again.';
          }
        } else if (error?.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage);
        throw error; // Re-throw to trigger the error animation in handleSubmit
      }
    }
  };

  const handleShopifyConnection = async (data: StoreFormData) => {};

  const handleWixConnection = async (data: StoreFormData) => {};

  // Handle platform selection
  const handlePlatformSelect = (platform: string) => {
    // Find the platform and check if it's enabled
    const selectedPlatformData = platforms.find(p => p.id === platform);
    if (selectedPlatformData?.enabled) {
      setValue('platform', platform);
    } else {
      toast.error('This platform is not available yet. Only WordPress is currently supported.');
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <SelectPlatform 
            selectedPlatform={selectedPlatform}
            onSelectPlatform={handlePlatformSelect}
            onNext={handleNext}
            onBack={handleBack}
            platforms={platforms}
          />
        );
      case 1:
        return (
          <WebsiteDetails
            onSubmit={methods.handleSubmit(handleSubmit)}
            onBack={handleBack}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DashboardContent>
      <FormStepper
        steps={steps}
        activeStep={activeStep}
      />
      
      <FormProvider {...methods}>
        {renderStepContent()}
      </FormProvider>
      
      <SuccessAnimation
        integrationSuccess={integrationSuccess}
        integrationError={integrationError}
        errorMessage={errorMessage}
      />
    </DashboardContent>
  );
}