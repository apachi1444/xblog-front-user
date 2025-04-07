import { Box, useTheme, Typography, useMediaQuery, Stepper, Step, StepLabel, styled } from '@mui/material';
import { Iconify } from '../iconify';

interface FormStepperProps {
  steps: string[];
  activeStep: number;
  title?: string;
}

// Custom styling for the stepper
const CustomStepper = styled(Stepper)(({ theme }) => ({
  width: "100%",
  "& .MuiStepConnector-line": {
    height: 2,
  },
  "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line, .MuiStepConnector-root.Mui-completed .MuiStepConnector-line":
    {
      backgroundColor: theme.palette.primary.main,
    },
  "& .MuiStepConnector-root": {
    top: 12,
  },
}));

// Custom styling for the step icon
const CustomStepIconRoot = styled("div")<{ ownerState: { completed?: boolean; active?: boolean } }>(
  ({ theme, ownerState }) => ({
    backgroundColor: ownerState.active || ownerState.completed ? theme.palette.primary.main : theme.palette.grey[300],
    zIndex: 1,
    color: "#fff",
    width: 24,
    height: 24,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  }),
);

// Custom step icon component
function CustomStepIcon(props: {
  active: boolean;
  completed: boolean;
  icon: React.ReactNode;
}) {
  const { active, completed, icon } = props;

  return (
    <CustomStepIconRoot ownerState={{ completed, active }}>
      {completed || active ? (
        <Iconify icon="eva:checkmark-fill" sx={{ width: 16, height: 16 }} />
      ) : (
        <Typography variant="caption" sx={{ color: '#fff' }}>
          {icon}
        </Typography>
      )}
    </CustomStepIconRoot>
  );
}

// Custom step label styling
const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
  "& .MuiStepLabel-label": {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 500,
  },
  "& .MuiStepLabel-label.Mui-active": {
    color: theme.palette.primary.main,
  },
  "& .MuiStepLabel-label.Mui-completed": {
    color: theme.palette.primary.main,
  },
}));

export function FormStepper({ steps, activeStep, title }: FormStepperProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      mb: 5, 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {title && (
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            textAlign: 'center',
            fontWeight: 600,
            mb: 3
          }}
        >
          {title}
        </Typography>
      )}
      
      <Box sx={{ width: '100%', maxWidth: 800, px: 2 }}>
        <CustomStepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};

            // Mark steps as completed if they're before the active step
            if (index < activeStep) {
              stepProps.completed = true;
            }

            return (
              <Step key={label} {...stepProps}>
                <CustomStepLabel
                  StepIconComponent={(iconProps) =>
                    CustomStepIcon({
                      ...iconProps,
                      active: index === activeStep,
                      completed: index < activeStep,
                    })
                  }
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: index <= activeStep ? theme.palette.primary.main : theme.palette.text.secondary,
                      fontWeight: index <= activeStep ? 500 : 400,
                    }}
                  >
                    {label}
                  </Typography>
                </CustomStepLabel>
              </Step>
            );
          })}
        </CustomStepper>
      </Box>
    </Box>
  );
}