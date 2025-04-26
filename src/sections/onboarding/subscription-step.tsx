import { useSelector } from 'react-redux';

import { Card, Grid, Typography, CardContent } from '@mui/material';

import { selectAvailablePlans } from 'src/services/slices/auth/authSlice';

// Inside your component
const SubscriptionStep = () => {
  // Get plans from the store
  const availablePlans = useSelector(selectAvailablePlans);
  
  // If no plans are available, you can use a fallback
  const plans = availablePlans.length > 0 ? availablePlans : [
    {
      id: "free-plan",
      name: "Free (Monthly)",
      price: 0,
      url: "free"
    },
    {
      id: "starter-plan",
      name: "Starter (Monthly)",
      price: 29,
      url: "starter"
    }
  ];
  
  return (
    // Render your subscription options using the plans data
    <Grid container spacing={3}>
      {plans.map((plan) => (
        <Grid item xs={12} md={4} key={plan.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{plan.name}</Typography>
              <Typography variant="h4">${plan.price}</Typography>
              {/* Render other plan details */}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};