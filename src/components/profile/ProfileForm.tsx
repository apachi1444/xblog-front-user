import type { AuthUser } from 'src/types/user';

import { Edit } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Grid,
  Stack,
  Button,
  TextField,
  Typography,
} from '@mui/material';

import { useUpdateUserMutation } from 'src/services/apis/userApi';
import { profileFormSchema, type ProfileFormData } from 'src/validation/validation-forms';

import { Iconify } from 'src/components/iconify';

interface ProfileFormProps {
  userData?: AuthUser;
}

export function ProfileForm({ userData }: ProfileFormProps) {
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
      country: '',
      phone: userData?.telephone || '',
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

  return (
    <Box sx={{ p: 4 }}>
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
