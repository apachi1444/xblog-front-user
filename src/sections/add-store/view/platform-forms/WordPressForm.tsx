import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';

import { 
  Box, 
  Grid, 
  Checkbox,
  Typography,
  FormHelperText,
  FormControlLabel
} from '@mui/material';

import type { StoreFormData } from '..';

export default function WordPressForm() {
  const { t } = useTranslation();
  const { 
    formState: { errors },
    register,
    watch
  } = useFormContext<StoreFormData>();
  
  const acceptTerms = watch('acceptTerms');

  return (
    <Box>
      <Grid container spacing={3}>
        {/* WordPress URL */}
        <Grid item xs={12}>
          <TextFieldElement
            name="store_url"
            label={t('store.wordpress.url')}
            fullWidth
            required
            placeholder={t('store.wordpress.urlPlaceholder')}
          />
        </Grid>
        
        {/* WordPress Username */}
        <Grid item xs={12} md={6}>
          <TextFieldElement
            name="store_username"
            label={t('store.wordpress.username')}
            fullWidth
            required
            placeholder={t('store.wordpress.usernamePlaceholder')}
          />
        </Grid>
        
        {/* WordPress Password */}
        <Grid item xs={12} md={6}>
          <TextFieldElement
            name="store_password"
            label={t('store.wordpress.password')}
            type="password"
            fullWidth
            required
            placeholder={t('store.wordpress.passwordPlaceholder')}
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                {...register('acceptTerms')}
                checked={acceptTerms}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                {t('store.terms.accept')}
              </Typography>
            }
          />
          {errors.acceptTerms && (
            <FormHelperText error>
              {errors.acceptTerms.message}
            </FormHelperText>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}