"use client"

import { useState } from "react"
import { Eye, Check, Filter, Download } from "lucide-react"

import {
  Box,
  Card,
  Chip,
  Input,
  Table,
  Button,
  TableRow,
  Container,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CardHeader,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material"

import { DashboardContent } from "src/layouts/dashboard"

const plans = [
  {
    name: "Starter Plan",
    price: "10.00",
    period: "/month",
    tag: "FREE",
    tagColor: "warning",
    features: [
      "Manage up to 1,000 contacts",
      "Basic customer management tools",
      "Task and workflow automation",
      "Integration with third-party apps (limited)",
      "Customizable dashboards",
    ],
    current: true,
  },
  {
    name: "Growth Plan",
    price: "79.00",
    period: "/month",
    tag: "PRO",
    tagColor: "primary",
    features: [
      "Manage up to 10,000 contacts",
      "Advanced customer management",
      "Full workflow automation",
      "Real-time reporting and analytics",
      "Collaborative team features",
    ],
    highlight: true,
  },
  {
    name: "Enterprise Plan",
    price: "Custom",
    period: "/month",
    tag: "ADVANCE",
    tagColor: "success",
    features: [
      "Unlimited contacts and data storage",
      "Custom workflow and automation setups",
      "Dedicated account manager",
      "Advanced analytics and reporting",
      "Full API access and custom integrations",
    ],
  },
]

const billingHistory = [
  {
    planName: "Starter Plan - Jun 2024",
    amount: "10.00",
    purchaseDate: "2024-06-01",
    endDate: "2024-06-31",
    status: "Processing",
  },
  {
    planName: "Growth Plan - May 2024",
    amount: "79.00",
    purchaseDate: "2024-05-01",
    endDate: "2024-05-31",
    status: "Success",
  },
]

export function UpgradeLicenseView() {
  const [billingCycle, setBillingCycle] = useState("monthly")

  return (
    <DashboardContent>
      <Box p={4}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <div>
              <Typography variant="h4">Billing & Subscription</Typography>
              <Typography color="textSecondary">
                Keep track of your subscription details, update your billing info, and manage payments.
              </Typography>
            </div>
            <ToggleButtonGroup
              value={billingCycle}
              exclusive
              onChange={(e, value) => value && setBillingCycle(value)}
            >
              <ToggleButton value="monthly">Monthly</ToggleButton>
              <ToggleButton value="yearly">Yearly</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box display="grid" gridTemplateColumns={{ md: "repeat(3, 1fr)" }} gap={3} mb={4}>
            {plans.map((plan) => (
              <Card key={plan.name} variant="outlined">
                <CardHeader
                  title={plan.name}
                />
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    ${plan.price} <Typography component="span">{plan.period}</Typography>
                  </Typography>
                  <ul>
                    {plan.features.map((feature) => (
                      <li key={feature} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Check size={16} color="green" /> {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <Box p={2}>
                  <Button fullWidth variant={plan.current ? "outlined" : "contained"}>
                    {plan.current ? "Current Plan" : "Upgrade Plan"}
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>

          <Box border={1} borderColor="divider" borderRadius={2}>
            <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Billing History</Typography>
              <Box display="flex" gap={1}>
                <Input placeholder="Search..." />
                <Button startIcon={<Filter />} variant="outlined" size="small">
                  Filter
                </Button>
                <Button startIcon={<Download />} variant="outlined" size="small">
                  Export
                </Button>
              </Box>
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Plan Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Purchase Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billingHistory.map((item) => (
                  <TableRow key={item.planName}>
                    <TableCell>{item.planName}</TableCell>
                    <TableCell>${item.amount}</TableCell>
                    <TableCell>{item.purchaseDate}</TableCell>
                    <TableCell>{item.endDate}</TableCell>
                    <TableCell>
                      <Chip label={item.status} color={item.status === "Success" ? "success" : "warning"} size="small" />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" startIcon={<Download />} />
                      <Button size="small" variant="outlined" startIcon={<Eye />} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Container>
      </Box>
    </DashboardContent>
  )
}
