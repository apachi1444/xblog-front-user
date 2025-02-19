import { useState } from 'react';

import Pagination from '@mui/material/Pagination';
import { Box, Button, Divider, Container, Typography } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { ProfileForm } from 'src/components/profile/ProfileForm';
import { SecurityForm } from 'src/components/profile/SecurityForm';
import { NotificationsForm } from 'src/components/profile/NotificationForm';


// ----------------------------------------------------------------------

export function ProfileView() {
  
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <DashboardContent>
      
       <Box display="flex" alignItems="center" mb={5}>
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
              Account
            </Typography>

            <Box mb={6}>
              <Divider />
              <Box display="flex" borderBottom={1} borderColor="divider">
                {["Profile", "Billing", "Security", "Notifications"].map((tab) => (
                  <Button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    sx={{
                      borderBottom: activeTab === tab.toLowerCase() ? 2 : 0,
                      borderColor: activeTab === tab.toLowerCase() ? 'primary.main' : 'transparent',
                      color: activeTab === tab.toLowerCase() ? 'primary.main' : 'text.secondary',
                      textTransform: 'none',
                      fontWeight: 'medium',
                      fontSize: 'small',
                      pb: 1,
                      mr: 3,
                    }}
                  >
                    {tab}
                  </Button>
                ))}
              </Box>
            </Box>

            <Box>
              {activeTab === "profile" && <ProfileForm />}
              {activeTab === "billing" && <Typography color="textSecondary">Billing settings coming soon...</Typography>}
              {activeTab === "security" && <SecurityForm />}
              {activeTab === "notifications" && <NotificationsForm />}
            </Box>
          </Container>
        </Box>

      {/*
      
      
      <Grid container spacing={3}>
        {_posts.map((post, index) => {
          const latestPostLarge = index === 0;
          const latestPost = index === 1 || index === 2;

          return (
            <Grid key={post.id} xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}>
              <PostItem post={post} latestPost={latestPost} latestPostLarge={latestPostLarge} />
            </Grid>
          );
        })}
      </Grid>
      */}

      <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} />
    </DashboardContent>
  );
}
