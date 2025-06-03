import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, User, Edit } from 'lucide-react';

import {
  Box,
  Grid,
  Button,
  Avatar,
  TextField,
  Typography,
  useTheme,
  alpha,
  IconButton,
  Stack,
} from '@mui/material';

import { profileFormSchema, type ProfileFormData } from 'src/validation/validation-forms';
import { useUpdateUserMutation } from 'src/services/apis/userApi';
import type { AuthUser } from 'src/types/user';

import { Iconify } from 'src/components/iconify';

interface ProfileFormProps {
  userData?: AuthUser;
}

export function ProfileForm({ userData }: ProfileFormProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userData?.name || '',
      email: userData?.email || '',
      company: '',
      country: '',
      phone: userData?.telephone || '',
      birthday: '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateUser({
        name: data.name,
        telephone: data.phone,
      }).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const handleImageUpload = () => {
    // TODO: Implement image upload functionality
    console.log('Image upload functionality to be implemented');
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Profile Picture Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <User size={20} />
          {t('profile.picture.title', 'Profile Picture')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Avatar
              src={userData?.avatar}
              alt={userData?.name || 'User'}
              sx={{
                width: 120,
                height: 120,
                border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 4px 20px rgba(0,0,0,0.3)'
                  : '0 4px 20px rgba(0,0,0,0.1)',
              }}
            >
              {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <IconButton
              onClick={handleImageUpload}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: theme.palette.primary.main,
                color: 'white',
                width: 36,
                height: 36,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              <Upload size={18} />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('profile.picture.description', 'Upload/Change Your Profile Image')}
          </Typography>
          <Button
            variant="outlined"
            onClick={handleImageUpload}
            startIcon={<Upload size={16} />}
            sx={{ borderRadius: 2 }}
          >
            {t('profile.picture.upload', 'Upload Avatar')}
          </Button>
        </Box>
      </Box>

      {/* Account Details Section */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Edit size={20} />
            {t('profile.details.title', 'Account Details')}
          </Typography>
          {!isEditing && (
            <Button
              variant="outlined"
              onClick={() => setIsEditing(true)}
              startIcon={<Iconify icon="solar:pen-bold" />}
              sx={{ borderRadius: 2 }}
            >
              {t('profile.details.edit', 'Edit')}
            </Button>
          )}
        </Box>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t('profile.details.name', 'Full Name')}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t('profile.details.email', 'Email Address')}
                      disabled
                      error={!!errors.email}
                      helperText={errors.email?.message || t('profile.details.emailNote', 'Email cannot be changed')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t('profile.details.phone', 'Phone Number')}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="company"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t('profile.details.company', 'Company')}
                      error={!!errors.company}
                      helperText={errors.company?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={!isDirty || isUpdating}
                startIcon={<Iconify icon="solar:check-circle-bold" />}
                sx={{ borderRadius: 2 }}
              >
                {isUpdating ? t('profile.details.saving', 'Saving...') : t('profile.details.save', 'Save Changes')}
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
                startIcon={<Iconify icon="solar:close-circle-bold" />}
                sx={{ borderRadius: 2 }}
              >
                {t('profile.details.cancel', 'Cancel')}
              </Button>
            </Stack>
          </form>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('profile.details.name', 'Full Name')}
                </Typography>
                <Typography variant="h6">
                  {userData?.name || t('profile.details.notProvided', 'Not provided')}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('profile.details.email', 'Email Address')}
                </Typography>
                <Typography variant="h6">
                  {userData?.email || t('profile.details.notProvided', 'Not provided')}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('profile.details.phone', 'Phone Number')}
                </Typography>
                <Typography variant="h6">
                  {userData?.telephone || t('profile.details.notProvided', 'Not provided')}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('profile.details.memberSince', 'Member Since')}
                </Typography>
                <Typography variant="h6">
                  {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : t('profile.details.notProvided', 'Not provided')}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
}
