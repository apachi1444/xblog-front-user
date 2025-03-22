import React from "react"

import { ChevronRight } from "lucide-react"

import { Box, styled, Typography } from "@mui/material"

// Step circle with number
const StepCircle = styled(Box)<{ active: boolean }>(({ active, theme }) => ({
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: active ? theme.palette.primary.main : "#CCCCCC",
  color: "#FFFFFF",
  fontSize: "20px",
  fontWeight: "bold",
}))

// Arrow styling
const StepArrow = styled(ChevronRight)(({ theme }) => ({
  color: "#CCCCCC",
  width: "28px",
  height: "28px",
  margin: "0 8px",
}))

// Step label styling
const StepLabel = styled(Typography)<{ active: boolean }>(({ active }) => ({
  fontSize: "18px",
  fontWeight: active ? "bold" : "normal",
  color: active ? "#000000" : "#CCCCCC",
  marginLeft: "12px",
}))

// Step container
const StepContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}))

interface SimplifiedStepperProps {
  steps: string[]
  activeStep: number
  className?: string
}

export const CustomStepper: React.FC<SimplifiedStepperProps> = ({
  steps,
  activeStep,
  className,
}) => (
    <Box 
      className={className}
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      {steps.map((label, index) => (
        <React.Fragment key={label}>
          <StepContainer>
            <StepCircle active={index === activeStep}>
              {index + 1}
            </StepCircle>
            <StepLabel active={index === activeStep}>
              {label}
            </StepLabel>
          </StepContainer>
          
          {index < steps.length - 1 && (
            <StepArrow />
          )}
        </React.Fragment>
      ))}
    </Box>
  )