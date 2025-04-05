import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export interface LogoProps {
  disabledLink?: boolean;
  sx?: object;
  variant?: 'full' | 'icon';
}

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, variant = 'full', ...other }, ref) => {
    // Use the new XBlog logo
    const logo = (
      <Box
        ref={ref}
        component="div"
        sx={{
          width: variant === 'full' ? 140 : 40,
          height: 40,
          display: 'inline-flex',
          ...sx,
        }}
        {...other}
      >
        <img 
          src={`/assets/images/${variant === 'full' ? 'logo.png' : 'logo.png'}`} 
          alt="XBlog Logo" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain' 
          }} 
        />
      </Box>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);
