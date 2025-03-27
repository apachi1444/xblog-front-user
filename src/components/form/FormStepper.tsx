import React from "react";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface StepperComponentProps {
  steps: { id: number; label: string }[];
  activeStep: number;
}

export const StepperComponent = ({ steps, activeStep }: StepperComponentProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%", maxWidth: 700, mb: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step circle with number */}
            <Stack direction="row" alignItems="center">
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: index <= activeStep ? theme.palette.primary.main : "#E5E7EB",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    color: "white",
                    fontSize: 11,
                    lineHeight: "11px",
                  }}
                >
                  {step.id}
                </Typography>
              </Box>

              {/* Step label */}
              <Typography
                variant="body1"
                sx={{
                  ml: 1,
                  fontWeight: 500,
                  color: index <= activeStep ? theme.palette.text.primary : "#9CA3AF",
                  fontSize: 16,
                  letterSpacing: "0.5px",
                  lineHeight: "28px",
                }}
              >
                {step.label}
              </Typography>
            </Stack>

            {/* Arrow between steps (except after the last step) */}
            {index < steps.length - 1 && (
              <ArrowForwardIosIcon
                sx={{
                  fontSize: 13,
                  color: index < activeStep ? theme.palette.primary.main : "#9CA3AF",
                  mx: 1,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Stack>
    </Box>
  );
};