import { z } from 'zod';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextFieldElement } from 'react-hook-form-mui';
import { useForm, FormProvider } from 'react-hook-form';
import { User, Lock, Globe, Link as LinkIcon } from 'lucide-react';

import { 
  Box, 
  Grid, 
  Card, 
  alpha, 
  useTheme,
  Typography,
  InputAdornment,
} from '@mui/material';

// Define Zod schema for WordPress form
const wordpressSchema = z.object({
  store_url: z.string().min(1, 'Store URL is required').url('Please enter a valid URL'),
  store_username: z.string().min(1, 'Username is required'),
  store_password: z.string().min(1, 'Password is required'),
});

// Define type from schema
type WordPressFormData = z.infer<typeof wordpressSchema>;

interface WordPressFormProps {
  formData: {
    domain: string;
    name: string;
    store_url?: string;
    store_username?: string;
    store_password?: string;
  };
  onUpdateField: (field: string, value: string) => void;
  onTestConnection?: () => Promise<boolean>;
  formRef?: React.RefObject<{ validate: () => Promise<boolean> }>;
}

export default function WordPressForm({ 
  formData, 
  onUpdateField,
  onTestConnection,
  formRef
}: WordPressFormProps) {
  const theme = useTheme();
  
  // Setup form methods with react-hook-form
  const methods = useForm<WordPressFormData>({
    resolver: zodResolver(wordpressSchema),
    defaultValues: {
      store_url: formData.store_url || '',
      store_username: formData.store_username || '',
      store_password: formData.store_password || '',
    },
    mode: 'onBlur',
  });
  
  // Handle field change and sync with parent component
  const handleFieldChange = (field: string, value: string) => {
    onUpdateField(field, value);
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
      
      <FormProvider {...methods}>
        <Grid container spacing={3}>       
          <Grid item xs={12}>
            <TextFieldElement
              name="store_url"
              label="WordPress URL"
              fullWidth
              required
              placeholder="https://example.com/store"
              onChange={(e) => handleFieldChange('store_url', e.target.value)}
              helperText="The URL of your WordPress store"
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
            <TextFieldElement
              name="store_username"
              label="WordPress Username"
              fullWidth
              required
              onChange={(e) => handleFieldChange('store_username', e.target.value)}
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
            <TextFieldElement
              name="store_password"
              label="WordPress Password"
              fullWidth
              required
              type="password"
              onChange={(e) => handleFieldChange('store_password', e.target.value)}
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
      </FormProvider>
    </Card>
  );
}