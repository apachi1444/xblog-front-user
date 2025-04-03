import { useState } from 'react';

import {
  Box,
  Step,
  Card,
  Stack,
  Button,
  Stepper,
  Container,
  StepLabel,
  Typography,
  CardContent,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { FormInput } from 'src/components/form/FormInput';
import { FormDropdown } from 'src/components/form/FormDropdown';

const steps = ['Basic Information', 'Choose Time', 'Confirmation'];

type BookDemoFormData = {
  fullName: string;
  email: string;
  company: string;
  teamSize: string;
  dateTime: Date | null;
  message: string;
};

type BookDemoFormErrors = Partial<Record<keyof BookDemoFormData, string>>;

const initialFormData: BookDemoFormData = {
  fullName: '',
  email: '',
  company: '',
  teamSize: '',
  dateTime: null,
  message: '',
};

export function BookDemoView() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<BookDemoFormData>(initialFormData);
  const [errors, setErrors] = useState<BookDemoFormErrors>({});

  const validateStep = (step: number): boolean => {
    const newErrors: BookDemoFormErrors = {};
    if (step === 0) {
      if (!formData.fullName) newErrors.fullName = 'Full Name is required';
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.company) newErrors.company = 'Company is required';
      if (!formData.teamSize) newErrors.teamSize = 'Team Size is required';
    } else if (step === 1) {
      if (!formData.dateTime) newErrors.dateTime = 'Date and Time is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      console.log('Form Submitted:', formData);
      setActiveStep(0);
      setFormData(initialFormData);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={3}>
                <FormInput
                  fullWidth
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                />
                <FormInput
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <FormInput
                  fullWidth
                  label="Company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  error={!!errors.company}
                  helperText={errors.company}
                />
                <FormDropdown
                  label="Team Size"
                  options={[
                    { value: "1-10", label: "1-10 employees" },
                    { value: "11-50", label: "11-50 employees" },
                    { value: "51-200", label: "51-200 employees" },
                    { value: "201+", label: "201+ employees" }
                  ]}
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value as string })}
                  error={!!errors.teamSize}
                  helperText={errors.teamSize}
                  placeholder="Select team size"
                />
              </Stack>
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={3}>
                {/* Date picker would go here */}
                <FormInput
                  fullWidth
                  multiline
                  rows={4}
                  label="Additional Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your needs and what you'd like to learn in the demo..."
                />
              </Stack>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">Demo Booking Summary</Typography>
                {Object.entries(formData).map(([key, value]) => (
                  <Box key={key}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardContent>
      <Box p={4}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Book a Demo
          </Typography>
          <Typography color="text.secondary" gutterBottom mb={4}>
            Schedule a personalized demo with our team
          </Typography>

          <Box sx={{ mb: 5 }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {renderStepContent(activeStep)}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {activeStep > 0 && <Button onClick={handleBack} color="inherit">Back</Button>}
            <Button onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext} variant="contained" color="primary">
              {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </Box>
        </Container>
      </Box>
    </DashboardContent>
  );
}
