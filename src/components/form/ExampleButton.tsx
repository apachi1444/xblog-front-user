import type React from "react"
import { Button, type ButtonProps, CircularProgress, styled } from "@mui/material"

// Extended button styling
const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: "none",
  padding: "8px 16px",
  fontWeight: 500,
  "&.MuiButton-sizeLarge": {
    padding: "12px 24px",
  },
  "&.MuiButton-sizeSmall": {
    padding: "4px 10px",
  },
}))

export interface CustomButtonProps extends Omit<ButtonProps, "startIcon" | "endIcon"> {
  text: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  loading?: boolean
  loadingPosition?: "start" | "end" | "center"
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  startIcon,
  endIcon,
  loading = false,
  loadingPosition = "center",
  disabled,
  children,
  ...rest
}) => {
  // Determine if button should be disabled
  const isDisabled = disabled || loading

  // Determine icon placement with loading spinner
  const startIconElement =
    loading && loadingPosition === "start" ? <CircularProgress size={20} color="inherit" /> : startIcon

  const endIconElement = loading && loadingPosition === "end" ? <CircularProgress size={20} color="inherit" /> : endIcon

  return (
    <StyledButton disabled={isDisabled} startIcon={startIconElement} endIcon={endIconElement} {...rest}>
      {loading && loadingPosition === "center" ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null}
      {children || text}
    </StyledButton>
  )
}
