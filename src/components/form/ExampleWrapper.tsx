import type React from "react"

import { Box, Paper, styled, Divider, Typography, type PaperProps } from "@mui/material"

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
}))

export interface FormWrapperProps extends Omit<PaperProps, "title"> {
  title?: string
  subtitle?: string
  headerAction?: React.ReactNode
  footerAction?: React.ReactNode
  showDivider?: boolean
  maxWidth?: number | string
}

const FormWrapper: React.FC<FormWrapperProps> = ({
  title,
  subtitle,
  headerAction,
  footerAction,
  showDivider = true,
  maxWidth = "auto",
  children,
  ...rest
}) => (
    <StyledPaper {...rest} sx={{ maxWidth, ...rest.sx }}>
      {(title || headerAction) && (
        <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            {title && <Typography variant="h6">{title}</Typography>}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {headerAction && <Box>{headerAction}</Box>}
        </Box>
      )}

      {showDivider && (title || headerAction) && <Divider sx={{ mb: 3 }} />}

      <Box>{children}</Box>

      {footerAction && (
        <>
          {showDivider && <Divider sx={{ mt: 3, mb: 2 }} />}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>{footerAction}</Box>
        </>
      )}
    </StyledPaper>
  )

export default FormWrapper

