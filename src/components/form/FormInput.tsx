import {
  TextField,
  InputAdornment,
  TextFieldProps,
  styled
} from '@mui/material';
import { Iconify } from '../iconify';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.background.neutral,
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: theme.palette.text.primary,
    },
  },
}));

interface FormInputProps extends Omit<TextFieldProps, 'variant'> {
  icon?: string;
  placeholder?: string;
}

export function FormInput({ icon, placeholder, ...other }: FormInputProps) {
  return (
    <StyledTextField
      fullWidth
      placeholder={placeholder}
      variant="outlined"
      InputLabelProps={{ 
        shrink: true,
        sx: { 
          backgroundColor: 'transparent',
          px: 1,
        }
      }}
      InputProps={{
        startAdornment: icon ? (
          <InputAdornment position="start">
            <Iconify icon={icon} sx={{ color: 'text.secondary', width: 24, height: 24 }} />
          </InputAdornment>
        ) : null,
      }}
      {...other}
    />
  );
}