import React from 'react';

import {
  Box, Grid, Button, Avatar, Container, TextField, Typography
} from '@mui/material';

export function ProfileForm() {
  return (
    <Container>
      <Box mb={6} boxShadow={3} borderRadius={8} p={6} bgcolor="white">
        <Typography variant="h6" gutterBottom>
          Profile Picture
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Avatar
            src="/placeholder.svg"
            alt="Profile"
            sx={{ width: 128, height: 128, mb: 2 }}
          />
          <Typography variant="body2" color="textSecondary">
            Upload/Change Your Profile Image
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Upload Avatar
          </Button>
        </Box>
      </Box>

      <Box boxShadow={3} borderRadius={8} p={6} bgcolor="white">
        <Typography variant="h6" gutterBottom>
          Edit Account Details
        </Typography>
        <form noValidate autoComplete="off">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                id="name"
                variant="outlined"
                placeholder="JWT User"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email address"
                id="email"
                variant="outlined"
                placeholder="name@example.com"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company"
                id="company"
                variant="outlined"
                placeholder="Materially Inc."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Country"
                id="country"
                variant="outlined"
                placeholder="USA"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone number"
                id="phone"
                variant="outlined"
                placeholder="4578-420-410"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Birthday"
                id="birthday"
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
          >
            Change Details
          </Button>
        </form>
      </Box>
    </Container>
  );
}
