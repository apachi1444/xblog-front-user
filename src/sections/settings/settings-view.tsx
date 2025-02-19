"use client"

import { useState } from "react";

import {
  Box,
  Button,
  Select,
  Switch,
  Divider,
  MenuItem,
  Container,
  Typography,
  InputLabel,
  FormControl,
  FormControlLabel,
} from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";

const tabs = ["General", "Labels", "Inbox", "Accounts & Import", "Filters", "Forwarding", "Add Ons"];

export function SettingsView() {
  const [activeTab, setActiveTab] = useState("General");

  return (
    <DashboardContent>
      <Box p={6}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Settings
          </Typography>

          <Box mb={4} borderBottom={1} borderColor="divider" display="flex">
            {tabs.map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                sx={{
                  px: 2,
                  py: 1,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  borderBottom: activeTab === tab ? 2 : 0,
                  borderColor: activeTab === tab ? "primary.main" : "transparent",
                  color: activeTab === tab ? "primary.main" : "text.secondary",
                  '&:hover': { color: "text.primary" },
                }}
              >
                {tab}
              </Button>
            ))}
          </Box>

          {activeTab === "General" && (
            <Box maxWidth="md" display="flex" flexDirection="column" gap={4}>
              <FormControl fullWidth>
                <InputLabel>Display Language</InputLabel>
                <Select defaultValue="en-US">
                  <MenuItem value="en-US">English (US)</MenuItem>
                  <MenuItem value="en-UK">English (UK)</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={<Switch />}
                label="Enable input tools"
              />

              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Right-to-left editing support"
              />

              <Divider />

              <FormControl fullWidth>
                <InputLabel>Default Country Code</InputLabel>
                <Select defaultValue="it">
                  <MenuItem value="it">Italy</MenuItem>
                  <MenuItem value="us">United States</MenuItem>
                  <MenuItem value="uk">United Kingdom</MenuItem>
                  <MenuItem value="fr">France</MenuItem>
                </Select>
              </FormControl>

              <Divider />

              <FormControl fullWidth>
                <InputLabel>Conversations per page</InputLabel>
                <Select defaultValue="50">
                  <MenuItem value="25">25</MenuItem>
                  <MenuItem value="50">50</MenuItem>
                  <MenuItem value="75">75</MenuItem>
                  <MenuItem value="100">100</MenuItem>
                </Select>
              </FormControl>

              <Divider />

              <FormControl fullWidth>
                <InputLabel>Send cancellation period</InputLabel>
                <Select defaultValue="5">
                  <MenuItem value="5">5 seconds</MenuItem>
                  <MenuItem value="10">10 seconds</MenuItem>
                  <MenuItem value="20">20 seconds</MenuItem>
                  <MenuItem value="30">30 seconds</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </Container>
      </Box>
    </DashboardContent>
  );
}
