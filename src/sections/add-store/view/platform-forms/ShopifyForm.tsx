import { Key, Store, ShoppingBag, Link as LinkIcon } from 'lucide-react';

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

interface ShopifyFormProps {
  formData: {
    domain: string;
    name: string;
    shopifyStore?: string;
    appId?: string;
    appPassword?: string;
  };
  onUpdateField: (field: string, value: string) => void;
  errors: Record<string, string | null>;
  setErrors: (errors: Record<string, string | null>) => void;
}

export default function ShopifyForm({ formData, onUpdateField, errors, setErrors }: ShopifyFormProps) {
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
      case 'shopifyStore':
        if (!value) error = 'Shopify store name is required';
        break;
      case 'appId':
        if (!value) error = 'App ID is required';
        break;
      case 'appPassword':
        if (!value) error = 'App Password is required';
        break;
       default:
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
        <ShoppingBag size={24} color={theme.palette.primary.main} />
        <Typography variant="h6" sx={{ ml: 1.5, fontWeight: 600 }}>
          Shopify Store Details
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
            placeholder="mystore.com"
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
            placeholder="My Shopify Store"
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
            label="Shopify Store Name"
            variant="outlined"
            value={formData.shopifyStore || ''}
            onChange={handleChange('shopifyStore')}
            error={!!errors.shopifyStore}
            helperText={errors.shopifyStore || "Your *.myshopify.com store name"}
            placeholder="mystore"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Store size={18} color={theme.palette.text.secondary} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body2" color="text.secondary">.myshopify.com</Typography>
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
            label="App ID"
            variant="outlined"
            value={formData.appId || ''}
            onChange={handleChange('appId')}
            error={!!errors.appId}
            helperText={errors.appId}
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
            label="App Password"
            variant="outlined"
            type="password"
            value={formData.appPassword || ''}
            onChange={handleChange('appPassword')}
            error={!!errors.appPassword}
            helperText={errors.appPassword}
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
      </Grid>
    </Card>
  );
}