import { alpha , useTheme } from '@mui/material/styles';
import { Box , Stack, Button, Typography, CardContent, CircularProgress } from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface PreviewSEOTabProps {
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  urlSlug?: string;
  onGenerateMeta?: () => void;
  isGeneratingMeta? : boolean;
  isGenerateDisabled? : boolean;
}

export function PreviewSEOTab({
  title,
  metaTitle,
  metaDescription,
  urlSlug,
  onGenerateMeta,
  isGeneratingMeta,
  isGenerateDisabled
}: PreviewSEOTabProps) {
  const theme = useTheme();

  return (
    <CardContent sx={{ p: 2 }}>
      {/* If meta information is not generated yet, show empty state */}
      {!metaTitle && !metaDescription && !urlSlug ? (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
            textAlign: 'center'
          }}
        >
          {/* Empty state content */}
          <Box 
            sx={{ 
              width: 120, 
              height: 120, 
              borderRadius: '50%',
              bgcolor: 'primary.lighter',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <Iconify 
              icon="eva:alert-triangle-outline" 
              width={48} 
              height={48} 
              sx={{ color: 'primary.main' }} 
            />
          </Box>
          
          <Typography variant="h6" sx={{ mb: 1 }}>
            You have to generate the SEO Meta information to see the full preview!
          </Typography>

          {isGenerateDisabled && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: 1,
                bgcolor: () => alpha(theme.palette.warning.main, 0.08),
                border: '1px solid',
                borderColor: () => alpha(theme.palette.warning.main, 0.24),
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'warning.dark',
                  gap: 1,
                }}
              >
                <Iconify icon="eva:info-fill" width={16} height={16} />
                Please fill in the required fields:
              </Typography>
              <Box
                component="ul"
                sx={{
                  mt: 1,
                  mb: 0,
                  pl: 2,
                  listStyle: 'none',
                }}
              >
                {['Target Country', 'Language', 'Primary Keyword', 'Secondary Keywords'].map((field) => (
                  <Box
                    component="li"
                    key={field}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'warning.dark',
                      fontSize: '0.75rem',
                      '&:before': {
                        content: '"•"',
                        color: 'warning.dark',
                      },
                    }}
                  >
                    {field}
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ 
              borderRadius: 28,
              px: 3
            }}
            disabled={isGenerateDisabled}
            onClick={onGenerateMeta}
            startIcon={
              isGeneratingMeta ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Iconify icon="eva:flash-fill" width={16} />
              )
            }
          >
            {isGeneratingMeta ? 'Generating...' : 'Generate now!'}
          </Button>
        </Box>
      ) : (
        // Show SEO preview when meta information is available
        <Box sx={{ width: '100%' }}>
          {/* Google Search Result Preview */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              Google Search Result Preview
            </Typography>
            
            <Box 
              sx={{ 
                p: 2, 
                border: '1px solid', 
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper'
              }}
            >
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: '#1a0dab', 
                  fontSize: '18px',
                  mb: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {metaTitle || title || 'Title not available'}
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#006621', 
                  fontSize: '14px',
                  mb: 0.5 
                }}
              >
                yourdomain.com/{urlSlug || 'url-slug'}
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '14px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {metaDescription || 'Meta description not available. Add a meta description to improve your SEO.'}
              </Typography>
            </Box>
          </Box>
          
          {/* SEO Metadata Summary */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              SEO Metadata
            </Typography>
            
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Title
                </Typography>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    bgcolor: 'background.neutral',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="body2">
                    {title || 'Not set'}
                  </Typography>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Meta Title
                </Typography>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    bgcolor: 'background.neutral',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="body2">
                    {metaTitle || 'Not set'}
                  </Typography>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Meta Description
                </Typography>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    bgcolor: 'background.neutral',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="body2">
                    {metaDescription || 'Not set'}
                  </Typography>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  URL Slug
                </Typography>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    bgcolor: 'background.neutral',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="body2">
                    /{urlSlug || 'Not set'}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Box>
      )}
    </CardContent>
  );
}
