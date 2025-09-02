/**
 * Email capture form component for homepage
 * Demonstrates how to redirect users to sign-up with pre-filled email
 */

import { z } from 'zod';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { createSignUpUrlWithEmail } from 'src/utils/redirect';

import { Iconify } from 'src/components/iconify';

// Email validation schema
const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface EmailCaptureFormProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  placeholder?: string;
  onEmailSubmit?: (email: string) => void;
}

export function EmailCaptureForm({
  title = "Start Your Content Journey",
  subtitle = "Join thousands of creators using AI to build amazing content",
  buttonText = "Get Started",
  placeholder = "Enter your email address",
  onEmailSubmit,
}: EmailCaptureFormProps) {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: EmailFormData) => {
    setIsSubmitting(true);
    
    try {
      // Optional callback for analytics or other tracking
      if (onEmailSubmit) {
        onEmailSubmit(data.email);
      }

      // Create the sign-up URL with pre-filled email
      const signUpUrl = createSignUpUrlWithEmail(data.email);
      
      // Show success message
      toast.success('Redirecting to sign-up...');
      
      // Small delay for better UX
      setTimeout(() => {
        // Redirect to sign-up page with pre-filled email
        window.location.href = signUpUrl;
      }, 500);
      
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        textAlign: 'center',
        maxWidth: 600,
        mx: 'auto',
        p: 4,
      }}
    >
      {/* Title */}
      <Typography
        variant="h3"
        sx={{
          mb: 2,
          fontWeight: 700,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {title}
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ mb: 4, fontWeight: 400 }}
      >
        {subtitle}
      </Typography>

      {/* Email Form */}
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: 'flex-start',
        }}
      >
        <TextField
          {...register('email')}
          fullWidth
          placeholder={placeholder}
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={isSubmitting}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify 
                  icon="material-symbols:mail-outline" 
                  width={20} 
                  height={20}
                  sx={{ color: 'text.secondary' }}
                />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 3,
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'background.paper',
              },
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 600,
            minWidth: { xs: '100%', sm: 'auto' },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: theme.customShadows?.primary,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.customShadows?.primary,
            },
            '&:disabled': {
              background: theme.palette.action.disabledBackground,
              transform: 'none',
            },
          }}
        >
          {isSubmitting ? 'Redirecting...' : buttonText}
        </Button>
      </Box>
    </Box>
  );
}
