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
    <Box sx={{ width: "100%", maxWidth: theme.breakpoints.values.md, mb: theme.spacing(4) }}>
      <Stack direction="row" alignItems="center" spacing={theme.spacing(1)}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step circle with number */}
            <Stack direction="row" alignItems="center">
              <Box
                sx={{
                  width: theme.spacing(3),
                  height: theme.spacing(3),
                  borderRadius: '50%',
                  backgroundColor: index <= activeStep 
                    ? theme.palette.primary.main 
                    : theme.palette.grey[200],
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: theme.typography.fontWeightBold,
                    color: theme.palette.common.white,
                    fontSize: theme.typography.pxToRem(11),
                    lineHeight: theme.typography.pxToRem(11),
                  }}
                >
                  {step.id}
                </Typography>
              </Box>

              {/* Step label */}
              <Typography
                variant="body1"
                sx={{
                  ml: theme.spacing(1),
                  fontWeight: theme.typography.fontWeightMedium,
                  color: index <= activeStep 
                    ? theme.palette.text.primary 
                    : theme.palette.text.secondary,
                  fontSize: theme.typography.pxToRem(16),
                  letterSpacing: '0.5px',
                  lineHeight: theme.typography.pxToRem(28),
                }}
              >
                {step.label}
              </Typography>
            </Stack>

            {/* Arrow between steps (except after the last step) */}
            {index < steps.length - 1 && (
              <ArrowForwardIosIcon
                sx={{
                  fontSize: theme.typography.pxToRem(13),
                  color: index < activeStep 
                    ? theme.palette.primary.main 
                    : theme.palette.text.secondary,
                  mx: theme.spacing(1),
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Stack>
    </Box>
  );
};