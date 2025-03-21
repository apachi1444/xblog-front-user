import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

import { 
  Box, 
  Grid, 
  Button, 
  MenuItem, 
  Checkbox, 
  TextField,
  Typography,
  FormHelperText,
  FormControlLabel,
  CircularProgress
} from '@mui/material';

import type { StoreFormData} from './index';

interface WebsiteDetailsProps {
  formData: StoreFormData;
  businessTypes : string[];
  onUpdateFormData: (data: Partial<StoreFormData>) => void;
  onSubmit: () => Promise<void>;
  onBack: () => void;
}

export default function WebsiteDetails({ 
  formData, 
  onUpdateFormData, 
  businessTypes,
  onSubmit, 
  onBack 
}: WebsiteDetailsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value, checked } = e.target as HTMLInputElement;
    
    if (name === 'acceptTerms') {
      onUpdateFormData({ [name]: checked });
    } else {
      onUpdateFormData({ [name as string]: value });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      await onSubmit();
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
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
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          startIcon={<ChevronLeft size={16} />}
        >
          Previous
        </Button>
        
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Connecting...' : 'Connect Store'}
        </Button>
      </Box>
    </Box>
  );
} 