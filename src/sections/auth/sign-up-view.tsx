import { useDispatch } from 'react-redux';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from '@react-oauth/google';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { useSignUpMutation, useGoogleAuthMutation } from 'src/services/apis/authApi';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { LanguageSwitcher } from 'src/components/language-switcher/LanguageSwitcher';

export function SignUpView() {
  const { t } = useTranslation();
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default', // Default avatar
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [alertMessage, setAlertMessage] = useState('');
  
  // RTK Query hook for sign up
  const [signUp, { isLoading }] = useSignUpMutation();

  // Add Google auth mutation
  const [googleAuth, { isLoading: isGoogleLoading }] = useGoogleAuthMutation();
  
  // Update loading state to include Google loading
  const loading = isLoading || isGoogleLoading;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setAlertType('error');
      setAlertMessage('Please fill in all required fields');
      setShowAlert(true);
      return;
    }
    
    try {
      // Call the sign up API
      await signUp(formData).unwrap();
      
      // Show success message
      setAlertType('success');
      setAlertMessage('Account created successfully! Redirecting to login...');
      setShowAlert(true);
      
      // Redirect to sign in page after a delay
      setTimeout(() => {
        router.push('/sign-in');
      }, 2000);
    } catch (error) {
      console.error('Sign up error:', error);
      setAlertType('error');
      setAlertMessage('Failed to create account. Please try again.');
      setShowAlert(true);
    }
  };

  const handleNavigateToSignIn = useCallback(() => {
    router.push('/sign-in');
  }, [router]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 2,
        overflow: 'auto',
        position: 'relative',
      }}
    > 
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          boxShadow: (theme) => theme.customShadows.z16,
          bgcolor: 'background.paper',
          width: { xs: '100%', sm: '600px', md: '800px', lg: '1000px' }, // Responsive width
          maxWidth: '95vw', // Ensure it doesn't overflow on small screens
          maxHeight: '90vh',
          mx: 'auto',
        }}
      >
        <Box gap={1} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 3 }}>
          <Logo />
          
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            {t('auth.signup.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('auth.signup.subtitle')}
          </Typography>
        
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            {t('auth.signup.haveAccount')}
            <Link variant="subtitle2" 
              sx={{ 
                ml: 0.5,
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                  opacity: 'revert'
                } 
              }} 
              onClick={handleNavigateToSignIn}>
              {t('auth.signin.title')}
            </Link>
          </Typography>
        </Box>

        {/* Alert for success/error messages */}
        {showAlert && (
          <Alert 
            severity={alertType} 
            sx={{ mb: 3 }}
            onClose={() => setShowAlert(false)}
          >
            {alertMessage}
          </Alert>
        )}

        {/* Updated form with simplified fields */}
        <Box 
          component="form" 
          onSubmit={handleSignUp}
          display="flex" 
          flexDirection="column" 
          gap={3} 
          sx={{ width: '100%' }}
        >
          <TextField
            fullWidth
            name="name"
            label={t('auth.signup.fullName')}
            placeholder={t('auth.signup.fullNamePlaceholder')}
            value={formData.name}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="ic:round-person" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="email"
            label={t('auth.signup.email')}
            placeholder={t('auth.signup.emailPlaceholder')}
            value={formData.email}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="ic:round-email" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="password"
            label={t('auth.signup.password')}
            placeholder="*******"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="ic:round-lock" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'ic:round-visibility' : 'ic:round-visibility-off'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="primary"
            loading={isLoading}
            sx={{ mt: 2 }}
          >
            {t('auth.signup.createAccount')}
          </LoadingButton>

          <Divider>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('auth.signup.or')}
            </Typography>
          </Divider>

          {/* Google Sign Up Button */}
          <Box sx={{ width: '100%' }}>
            <LoadingButton
              fullWidth
              size="large"
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="flat-color-icons:google" />}
              onClick={() => {
                // This will be handled by the GoogleLogin component
              }}
              sx={{
                borderColor: (theme) => theme.palette.divider,
                '&:hover': {
                  bgcolor: 'background.neutral',
                },
              }}
            >
              {t('auth.signup.signupWithGoogle')}
            </LoadingButton>
            
            {/* Google OAuth Component (hidden but functional) */}
            <Box sx={{ position: 'absolute', visibility: 'hidden' }}>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    // Call the Google auth endpoint with the token
                    googleAuth(credentialResponse.credential)
                      .unwrap()
                      .then((response) => {
                        // Show success message
                        setAlertType('success');
                        setAlertMessage('Account created successfully! Redirecting...');
                        setShowAlert(true);
                        
                        // Redirect to dashboard after a delay
                        setTimeout(() => {
                          router.push('/');
                        }, 2000);
                      })
                      .catch((error) => {
                        console.error('Google sign up error:', error);
                        setAlertType('error');
                        setAlertMessage('Failed to sign up with Google. Please try again.');
                        setShowAlert(true);
                      });
                  }
                }}
                onError={() => {
                  setAlertType('error');
                  setAlertMessage('Google sign up failed. Please try again.');
                  setShowAlert(true);
                }}
              />
            </Box>
          </Box>
          
          {/* Social login buttons can be added here */}
        </Box>
      </Box>
    </Box>
  );
}