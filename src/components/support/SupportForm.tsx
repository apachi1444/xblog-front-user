import type { UseFormReturn } from 'react-hook-form';

import { useTranslation } from 'react-i18next';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

import {
  Box,
  alpha,
  Button,
  useTheme,
  TextField,
  CircularProgress,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { SupportFormData } from './SupportModal';

interface SupportFormProps {
  methods: UseFormReturn<SupportFormData>;
  onSubmit: (data: SupportFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function SupportForm({ methods, onSubmit, isSubmitting }: SupportFormProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const {
    register,
    formState: { errors },
    watch,
  } = methods;

  const watchedValues = watch();
  const isFormValid = !Object.keys(errors).length && 
    watchedValues.email && 
    watchedValues.subject && 
    watchedValues.message;

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : '#ffffff',
      }}
    >
      <FormContainer formContext={methods} onSuccess={onSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Email Field */}
          <TextFieldElement
            {...register('email')}
            name="email"
            label={t('support.form.email', 'Email Address')}
            placeholder={t('support.form.emailPlaceholder', 'Enter your email address')}
            fullWidth
            required
            disabled={isSubmitting}
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                  <Iconify 
                    icon="material-symbols:mail-outline" 
                    width={20} 
                    height={20} 
                    sx={{ color: 'text.secondary' }} 
                  />
                </Box>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                },
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: 2,
                    borderColor: theme.palette.primary.main,
                  },
                },
              },
            }}
          />

          {/* Subject Field */}
          <TextFieldElement
            {...register('subject')}
            name="subject"
            label={t('support.form.subject', 'Subject')}
            placeholder={t('support.form.subjectPlaceholder', 'Brief description of your issue')}
            fullWidth
            required
            disabled={isSubmitting}
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                  <Iconify 
                    icon="material-symbols:subject" 
                    width={20} 
                    height={20} 
                    sx={{ color: 'text.secondary' }} 
                  />
                </Box>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                },
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: 2,
                    borderColor: theme.palette.primary.main,
                  },
                },
              },
            }}
          />

          {/* Message Field */}
          <TextField
            {...register('message')}
            name="message"
            label={t('support.form.message', 'Message')}
            placeholder={t('support.form.messagePlaceholder', 'Please describe your issue in detail...')}
            multiline
            rows={6}
            fullWidth
            required
            disabled={isSubmitting}
            error={!!errors.message}
            helperText={errors.message?.message}
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1, mt: 1, display: 'flex', alignItems: 'flex-start' }}>
                  <Iconify 
                    icon="material-symbols:chat-bubble-outline" 
                    width={20} 
                    height={20} 
                    sx={{ color: 'text.secondary' }} 
                  />
                </Box>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                },
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: 2,
                    borderColor: theme.palette.primary.main,
                  },
                },
              },
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={!isFormValid || isSubmitting}
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
              },
              '&:disabled': {
                background: theme.palette.action.disabledBackground,
                color: theme.palette.action.disabled,
                boxShadow: 'none',
                transform: 'none',
              },
            }}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Iconify icon="material-symbols:send" width={20} height={20} />
              )
            }
          >
            {isSubmitting 
              ? t('support.form.submitting', 'Sending...') 
              : t('support.form.submit', 'Send Support Request')
            }
          </Button>
        </Box>
      </FormContainer>
    </Box>
  );
}
