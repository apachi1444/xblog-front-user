import { z } from 'zod';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextFieldElement } from 'react-hook-form-mui';
import { useForm, FormProvider } from 'react-hook-form';
import { 
  Mail, 
  Users, 
  Calendar, 
  Building, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

import {
  Box,
  Step,
  Stack,
  alpha,
  Paper,
  Button,
  Dialog,
  Stepper,
  Tooltip,
  useTheme,
  Container,
  StepLabel,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { FormDropdown } from 'src/components/generate-article/FormDropdown';

// Demo video URL
const DEMO_VIDEO = 'https://www.youtube.com/embed/example-demo-video';

// Form validation schema
const bookDemoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  company: z.string().min(1, 'Company name is required'),
  teamSize: z.string().min(1, 'Team size is required'),
  dateTime: z.string(),
  message: z.string(),
});

type BookDemoFormData = z.infer<typeof bookDemoSchema>;

export function BookDemoView() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);

  
const methods = useForm<BookDemoFormData>({
  resolver: zodResolver(bookDemoSchema),
  defaultValues: {
    fullName: '',
    email: '',
    company: '',
    teamSize: '',
    dateTime: '',
    message: '',
  },
  mode: 'onChange',
});

  const {
    handleSubmit,
    trigger,
    formState: { errors },
    watch,
  } = methods;
  
  const steps = [
    t('demo.steps.basicInfo'),
    t('demo.steps.chooseTime'),
    t('demo.steps.confirmation')
  ];
  
  const stepValidationFields = {
    0: ['fullName', 'email', 'company', 'teamSize'] as const,
    1: ['dateTime'] as const,
    2: [] as const
  };
  
  // Watch the fields needed for validation
  const watchedFields = watch();
  
  const isStepValid = (step: number) => {
    const fieldsToCheck = stepValidationFields[step as keyof typeof stepValidationFields];
    
    // If no fields to validate, step is valid
    if (fieldsToCheck.length === 0) return true;
    
    return fieldsToCheck.every(field => {
      const value = watchedFields[field];
      const hasError = errors[field];
      return value && !hasError;
    });
  };
  
  const handleNext = async () => {
    // Get fields to validate for current step
    const fieldsToValidate = stepValidationFields[activeStep as keyof typeof stepValidationFields];
    
    // Validate fields for current step
    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      
      // Only proceed if validation passes
      if (!isValid) {
        return;
      }
    }
    
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async (data: BookDemoFormData) => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setActiveStep(2);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <TextFieldElement
              name="fullName"
              label={t('demo.form.fullName')}
              fullWidth
              required
              InputProps={{
                startAdornment: <Users size={18} style={{ marginRight: 8, opacity: 0.7 }} />,
              }}
            />
            <TextFieldElement
              name="email"
              label={t('demo.form.email')}
              type="email"
              fullWidth
              required
              InputProps={{
                startAdornment: <Mail size={18} style={{ marginRight: 8, opacity: 0.7 }} />,
              }}
            />
            <TextFieldElement
              name="company"
              label={t('demo.form.company')}
              fullWidth
              required
              InputProps={{
                startAdornment: <Building size={18} style={{ marginRight: 8, opacity: 0.7 }} />,
              }}
            />
            <FormDropdown
              name="teamSize"
              label={t('demo.form.teamSize')}
              options={[
                { value: "1-10", label: t('demo.form.teamSizeOptions.small') },
                { value: "11-50", label: t('demo.form.teamSizeOptions.medium') },
                { value: "51-200", label: t('demo.form.teamSizeOptions.large') },
                { value: "201+", label: t('demo.form.teamSizeOptions.enterprise') }
              ]}
              placeholder={t('demo.form.teamSizePlaceholder')}
              required
            />
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            <TextFieldElement
              name="dateTime"
              label={t('demo.form.dateTime')}
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: <Calendar size={18} style={{ marginRight: 8, opacity: 0.7 }} />,
              }}
            />
            <TextFieldElement
              name="message"
              label={t('demo.form.message')}
              fullWidth
              multiline
              rows={4}
              placeholder={t('demo.form.messagePlaceholder')}
            />
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              {t('demo.confirmation.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('demo.confirmation.message')}
            </Typography>
            <Box sx={{ 
              p: 2, 
              borderRadius: 1, 
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                {t('demo.confirmation.nextSteps')}
              </Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                <li>{t('demo.confirmation.step1')}</li>
                <li>{t('demo.confirmation.step2')}</li>
                <li>{t('demo.confirmation.step3')}</li>
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              onClick={() => setActiveStep(0)}
              sx={{ mt: 2 }}
            >
              {t('demo.confirmation.bookAnother')}
            </Button>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardContent>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('demo.title')}
          </Typography>
          
          <Typography color="text.secondary" gutterBottom mb={4}>
            {t('demo.subtitle')}
          </Typography>

          <Box sx={{ mb: 5 }}>
            <Stepper 
              activeStep={activeStep}
              alternativeLabel
              sx={{
                '& .MuiStepLabel-root': {
                  color: theme.palette.text.secondary,
                },
                '& .MuiStepLabel-active': {
                  color: theme.palette.primary.main,
                },
                '& .MuiStepIcon-root.Mui-active': {
                  color: theme.palette.primary.main,
                },
                '& .MuiStepIcon-root.Mui-completed': {
                  color: theme.palette.success.main,
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

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
                boxShadow: theme.shadows[1],
              }}
            >
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {renderStepContent(activeStep)}
                  
                  {activeStep !== 2 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                      {activeStep > 0 ? (
                        <Button
                          variant="outlined"
                          onClick={handleBack}
                          startIcon={<ChevronLeft size={16} />}
                          disabled={isSubmitting}
                          sx={{
                            borderRadius: 1.5,
                            px: 3,
                            py: 1,
                            fontWeight: 600,
                          }}
                        >
                          {t('demo.buttons.back')}
                        </Button>
                      ) : (
                        <Box /> // Empty box for spacing
                      )}
                      
                      {activeStep === 1 ? (
                        <Button
                          variant="contained"
                          type="submit"
                          disabled={isSubmitting}
                          sx={{
                            borderRadius: 1.5,
                            px: 3,
                            py: 1,
                            fontWeight: 600,
                          }}
                        >
                          {isSubmitting ? (
                            <>
                              <CircularProgress size={20} sx={{ mr: 1 }} />
                              {t('demo.buttons.submitting')}
                            </>
                          ) : (
                            t('demo.buttons.submit')
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={() => {
                            handleNext();
                          }}
                          endIcon={<ChevronRight size={16} />}
                          sx={{
                            borderRadius: 1.5,
                            px: 3,
                            py: 1,
                            fontWeight: 600,
                          }}
                        >
                          {t('demo.buttons.next')}
                        </Button>
                      )}
                    </Box>
                  )}
                </form>
              </FormProvider>
            </Paper>

            {/* Video Section - Visible alongside the form */}
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
                boxShadow: theme.shadows[1],
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('demo.video.title')}
                </Typography>
                
                <Tooltip title={t('demo.video.watchFullScreen')}>
                  <IconButton 
                    color="primary" 
                    onClick={() => setVideoDialogOpen(true)}
                  >
                    <HelpCircle size={20} />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%', mb: 2 }}>
                <iframe
                  src={DEMO_VIDEO}
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
                  title={t('demo.video.title')}
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                {t('demo.video.description')}
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('demo.benefits.title')}
                </Typography>
                <Stack spacing={1.5}>
                  {[1, 2, 3].map((item) => (
                    <Box 
                      key={item} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 24, 
                          height: 24, 
                          borderRadius: '50%', 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1.5,
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {item}
                      </Box>
                      <Typography variant="body2">
                        {t(`demo.benefits.benefit${item}`)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
              
              {/* Mobile-only button to open full-screen video */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setVideoDialogOpen(true)}
                  startIcon={<HelpCircle size={16} />}
                  fullWidth
                >
                  {t('demo.video.watchButton')}
                </Button>
              </Box>
            </Paper>
          </Box>
        </motion.div>

        {/* Video Dialog - For full-screen viewing */}
        <Dialog
          open={videoDialogOpen}
          onClose={() => setVideoDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {t('demo.video.dialogTitle')}
            </Typography>
            <IconButton onClick={() => setVideoDialogOpen(false)} size="small">
              <Box component="span" sx={{ fontSize: '1.5rem' }}>&times;</Box>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
              <iframe
                src={DEMO_VIDEO}
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
                title={t('demo.video.title')}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {t('demo.video.dialogDescription')}
            </Typography>
          </DialogContent>
        </Dialog>
      </Container>
    </DashboardContent>
  );
}
