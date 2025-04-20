import { Key, Lock, Server, ShoppingCart, Link as LinkIcon } from 'lucide-react';

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

interface WixFormProps {
  formData: {
    domain: string;
    name: string;
    adminUrl?: string;
    consumerKey?: string;
    consumerSecret?: string;
  };
  onUpdateField: (field: string, value: string) => void;
  errors: Record<string, string | null>;
  setErrors: (errors: Record<string, string | null>) => void;
}

export default function WixForm({ formData, onUpdateField, errors, setErrors }: WixFormProps) {
  const theme = useTheme();
  
  const validateField = (field: string, value: string) => {
    let error = null;
    
    switch (field) {
      case 'domain':
        if (!value) error = 'Website URL is required';
        break;
      case 'name':
        if (!value) error = 'Website name is required';
        else if (value.length < 3) error = 'Name must be at least 3 characters';
        break;
      case 'adminUrl':
        if (!value) error = 'Admin URL is required';
        break;
      case 'consumerKey':
        if (!value) error = 'Consumer Key is required';
        break;
      case 'consumerSecret':
        if (!value) error = 'Consumer Secret is required';
        break;
        default :
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
        <ShoppingCart size={24} color={theme.palette.primary.main} />
        <Typography variant="h6" sx={{ ml: 1.5, fontWeight: 600 }}>
          Wix Store Details
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Website URL"
            variant="outlined"
            value={formData.domain || ''}
            onChange={handleChange('domain')}
            error={!!errors.domain}
            helperText={errors.domain}
            placeholder="example.com"
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
            label="Website Name"
            variant="outlined"
            value={formData.name || ''}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            placeholder="My Wix Store"
            InputProps={{
              sx: {
                borderRadius: 1.5,
                '&.Mui-focused': {
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              }
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Admin URL"
            variant="outlined"
            value={formData.adminUrl || ''}
            onChange={handleChange('adminUrl')}
            error={!!errors.adminUrl}
            helperText={errors.adminUrl || "Usually ends with /wp-admin"}
            placeholder="https://example.com/wp-admin"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Server size={18} color={theme.palette.text.secondary} />
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
            label="Consumer Key"
            variant="outlined"
            value={formData.consumerKey || ''}
            onChange={handleChange('consumerKey')}
            error={!!errors.consumerKey}
            helperText={errors.consumerKey}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Key size={18} color={theme.palette.text.secondary} />
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
            label="Consumer Secret"
            variant="outlined"
            type="password"
            value={formData.consumerSecret || ''}
            onChange={handleChange('consumerSecret')}
            error={!!errors.consumerSecret}
            helperText={errors.consumerSecret}
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