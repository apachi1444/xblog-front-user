import React from 'react';

import { Box, Grid, Button, Container, TextField, Typography } from '@mui/material';

export function SecurityForm() {
  return (
    <Container>
      <Box mb={6} boxShadow={3} borderRadius={8} p={6} bgcolor="white">
        <Typography variant="h6" gutterBottom>
          Change Password
        </Typography>
        <form noValidate autoComplete="off">
          <Box mb={4}>
            <TextField
              fullWidth
              label="Current password"
              type="password"
              id="current"
              variant="outlined"
              margin="normal"
            />
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                id="new"
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Re-enter New Password"
                type="password"
                id="confirm"
                variant="outlined"
                margin="normal"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
          >
            Change Password
          </Button>
        </form>
      </Box>

      <Box boxShadow={3} borderRadius={8} p={6} bgcolor="white">
        <Typography variant="h6" gutterBottom>
          Delete Account
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          To deactivate your account, first delete its resources. If you are the only owner of any teams, either assign another owner or deactivate the team.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 2 }}
        >
          Deactivate Account
        </Button>
      </Box>
    </Container>
  );
}
