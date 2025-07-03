import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';

import {
  Box,
  Grid,
  Stack,
  Tooltip,
  Checkbox,
  Typography,
  IconButton,
  FormHelperText,
  FormControlLabel
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

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
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {t('store.wordpress.url', 'WordPress URL')} *
              </Typography>
              <Tooltip
                title={
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      {t('store.wordpress.urlInfo.title', 'WordPress Site URL')}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {t('store.wordpress.urlInfo.description', 'Enter the complete URL of your WordPress website (e.g., https://yoursite.com)')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                      {t('store.wordpress.urlInfo.requirements', 'Requirements:')}
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mt: 0.5, mb: 0 }}>
                      <Typography component="li" variant="body2">
                        {t('store.wordpress.urlInfo.req1', 'Must include https:// or http://')}
                      </Typography>
                      <Typography component="li" variant="body2">
                        {t('store.wordpress.urlInfo.req2', 'Should be your main domain')}
                      </Typography>
                      <Typography component="li" variant="body2">
                        {t('store.wordpress.urlInfo.req3', 'Must be accessible online')}
                      </Typography>
                    </Box>
                  </Box>
                }
                arrow
                placement="top"
                sx={{ maxWidth: 350 }}
              >
                <IconButton size="small" sx={{ color: 'info.main' }}>
                  <Iconify icon="eva:info-outline" width={18} height={18} />
                </IconButton>
              </Tooltip>
            </Stack>
            <TextFieldElement
              name="store_url"
              fullWidth
              required
              placeholder={t('store.wordpress.urlPlaceholder', 'https://yoursite.com')}
              sx={{ '& .MuiInputLabel-root': { display: 'none' } }}
            />
          </Stack>
        </Grid>
        
        {/* WordPress Username */}
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {t('store.wordpress.username', 'WordPress Username')} *
              </Typography>
              <Tooltip
                title={
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      {t('store.wordpress.usernameInfo.title', 'WordPress Admin Username')}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {t('store.wordpress.usernameInfo.description', 'Enter the username you use to log into your WordPress admin dashboard.')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                      {t('store.wordpress.usernameInfo.tips', 'Tips:')}
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mt: 0.5, mb: 0 }}>
                      <Typography component="li" variant="body2">
                        {t('store.wordpress.usernameInfo.tip1', 'Use your admin account username')}
                      </Typography>
                      <Typography component="li" variant="body2">
                        {t('store.wordpress.usernameInfo.tip2', 'Must have publishing permissions')}
                      </Typography>
                      <Typography component="li" variant="body2">
                        {t('store.wordpress.usernameInfo.tip3', 'Case-sensitive')}
                      </Typography>
                    </Box>
                  </Box>
                }
                arrow
                placement="top"
                sx={{ maxWidth: 350 }}
              >
                <IconButton size="small" sx={{ color: 'info.main' }}>
                  <Iconify icon="eva:info-outline" width={18} height={18} />
                </IconButton>
              </Tooltip>
            </Stack>
            <TextFieldElement
              name="store_username"
              fullWidth
              required
              placeholder={t('store.wordpress.usernamePlaceholder', 'Enter your WordPress username')}
              sx={{ '& .MuiInputLabel-root': { display: 'none' } }}
            />
          </Stack>
        </Grid>
        
        {/* WordPress Password */}
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {t('store.wordpress.password', 'Application Password')} *
              </Typography>
              <Tooltip
                title={
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      {t('store.wordpress.appPasswordInfo.title', 'What is an Application Password?')}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {t('store.wordpress.appPasswordInfo.description', 'Application passwords are special passwords that allow secure access to your WordPress site without using your main login password.')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {t('store.wordpress.appPasswordInfo.benefits', 'Benefits:')}
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mt: 0.5, mb: 0 }}>
                      <Typography component="li" variant="body2">
                        {t('store.wordpress.appPasswordInfo.benefit1', 'More secure than regular passwords')}
                      </Typography>
                      <Typography component="li" variant="body2">
                        {t('store.wordpress.appPasswordInfo.benefit2', 'Can be revoked anytime')}
                      </Typography>
                      <Typography component="li" variant="body2">
                        {t('store.wordpress.appPasswordInfo.benefit3', 'Keeps your main password safe')}
                      </Typography>
                    </Box>
                  </Box>
                }
                arrow
                placement="top"
                sx={{ maxWidth: 350 }}
              >
                <IconButton size="small" sx={{ color: 'info.main' }}>
                  <Iconify icon="eva:info-outline" width={18} height={18} />
                </IconButton>
              </Tooltip>
            </Stack>
            <TextFieldElement
              name="store_password"
              type="password"
              fullWidth
              required
              placeholder={t('store.wordpress.passwordPlaceholder', 'Enter your WordPress application password')}
              sx={{ '& .MuiInputLabel-root': { display: 'none' } }}
            />
          </Stack>
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