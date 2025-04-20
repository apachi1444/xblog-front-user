import { Globe, Link as LinkIcon, User, Lock } from 'lucide-react';

import { 
  Box, 
  Grid, 
  Card, 
  alpha, 
  useTheme,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';

interface WordPressFormProps {
  formData: {
    domain: string;
    name: string;
    store_url?: string;
    store_username?: string;
    store_password?: string;
  };
  onUpdateField: (field: string, value: string) => void;
  errors: Record<string, string | null>;
  setErrors: (errors: Record<string, string | null>) => void;
}

export default function WordPressForm({ formData, onUpdateField, errors, setErrors }: WordPressFormProps) {
  const theme = useTheme();
  
  const validateField = (field: string, value: string) => {
    let error = null;
    
    switch (field) {
      case 'store_url':
        if (!value) error = 'Store URL is required';
        break;
      case 'store_username':
        if (!value) error = 'Username is required';
        break;
      case 'store_password':
        if (!value) error = 'Password is required';
        break;
       default:
        return false;
    }
    
    setErrors({ ...errors, [field]: error });
    return !error;
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    onUpdateField(field, value);
    if (errors[field]) validateField(field, value);
  };

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: 'none',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: alpha(theme.palette.background.default, 0.5),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Globe size={24} color={theme.palette.primary.main} />
        <Typography variant="h6" sx={{ ml: 1.5, fontWeight: 600 }}>
          WordPress Website Details
        </Typography>
      </Box>
      
      <Grid container spacing={3}>       
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Store URL"
            variant="outlined"
            value={formData.store_url || ''}
            onChange={handleChange('store_url')}
            error={!!errors.store_url}
            helperText={errors.store_url || "The URL of your WordPress store"}
            placeholder="https://example.com/store"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon size={18} color={theme.palette.text.secondary} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 1.5,
                '&.Mui-focused': {
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              }
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Store Username"
            variant="outlined"
            value={formData.store_username || ''}
            onChange={handleChange('store_username')}
            error={!!errors.store_username}
            helperText={errors.store_username}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <User size={18} color={theme.palette.text.secondary} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 1.5,
                '&.Mui-focused': {
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              }
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Store Password"
            variant="outlined"
            type="password"
            value={formData.store_password || ''}
            onChange={handleChange('store_password')}
            error={!!errors.store_password}
            helperText={errors.store_password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={18} color={theme.palette.text.secondary} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 1.5,
                '&.Mui-focused': {
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              }
            }}
          />
        </Grid>
      </Grid>
    </Card>
  );
}