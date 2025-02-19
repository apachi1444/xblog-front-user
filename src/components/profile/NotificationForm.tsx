import { Box, Button, Checkbox, Container, FormGroup, Typography, FormControlLabel } from '@mui/material';

export function NotificationsForm() {
  return (
    <Container>
      <Box mb={6} boxShadow={3} borderRadius={8} p={6} bgcolor="white">
        <Typography variant="h6" gutterBottom>
          Subscription Preference Center
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          I would like to receive:
        </Typography>
        <FormGroup>
          {[
            "Product Announcements and Updates",
            "Events and Meetups",
            "User Research Surveys",
            "Hatch Startup Program",
          ].map((item, index) => (
            <FormControlLabel
              key={index}
              control={<Checkbox defaultChecked={index < 3} color="primary" />}
              label={item}
            />
          ))}
        </FormGroup>
      </Box>

      <Box boxShadow={3} borderRadius={8} p={6} bgcolor="white">
        <Typography variant="h6" gutterBottom>
          Opt me out instead
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Unsubscribe me from all of the above"
          />
        </FormGroup>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Update My Preferences
        </Button>
      </Box>
    </Container>
  );
}
