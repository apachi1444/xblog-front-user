import React from "react";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

interface StepperComponentProps {
  steps: { id: number; label: string }[];
  activeStep: number;
}

export const StepperComponent = ({ steps, activeStep }: StepperComponentProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", mb: theme.spacing(4), mt: 2 }}>
      <Box sx={{ position: "relative", display: "flex", justifyContent: "space-between" }}>
        {/* Progress bar */}
        <Box
          sx={{
            position: "absolute",
            top: theme.spacing(2),
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: theme.palette.grey[200],
            zIndex: 0,
          }}
        />
        
        {/* Active progress */}
        <Box
          sx={{
            position: "absolute",
            top: theme.spacing(2),
            left: 0,
            width: `${(activeStep / (steps.length - 1)) * 100}%`,
            height: 2,
            backgroundColor: theme.palette.primary.main,
            zIndex: 1,
            transition: "width 0.5s ease-in-out",
          }}
        />

        {/* Steps */}
        {steps.map((step, index) => (
          <Box
            key={step.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 2,
              position: "relative",
              width: `${100 / steps.length}%`,
            }}
          >
            {/* Step circle */}
            <Box
              sx={{
                width: theme.spacing(4),
                height: theme.spacing(4),
                borderRadius: "50%",
                backgroundColor: 
                  index < activeStep 
                    ? theme.palette.primary.main 
                    : index === activeStep 
                      ? theme.palette.primary.main 
                      : theme.palette.grey[200],
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: `2px solid ${
                  index <= activeStep 
                    ? theme.palette.primary.main 
                    : theme.palette.grey[200]
                }`,
              }}
            >
              {index < activeStep ? (
                <CheckIcon sx={{ color: theme.palette.common.white, fontSize: 16 }} />
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: theme.typography.fontWeightBold,
                    color: index === activeStep ? theme.palette.common.white : theme.palette.text.secondary,
                    fontSize: theme.typography.pxToRem(14),
                  }}
                >
                  {step.id}
                </Typography>
              )}
            </Box>

            {/* Step label */}
            <Typography
              variant="body2"
              sx={{
                mt: theme.spacing(1),
                fontWeight: index <= activeStep ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular,
                color: index <= activeStep ? theme.palette.text.primary : theme.palette.text.secondary,
                textAlign: "center",
              }}
            >
              {step.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};