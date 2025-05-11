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
              bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.2) : 'primary.lighter',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              boxShadow: theme.palette.mode === 'dark' ? '0 0 15px rgba(0,0,0,0.2)' : 'none'
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
                bgcolor: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.warning.main, 0.15)
                  : alpha(theme.palette.warning.main, 0.08),
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.warning.main, 0.4)
                  : alpha(theme.palette.warning.main, 0.24),
                boxShadow: theme.palette.mode === 'dark' ? '0 0 8px rgba(0,0,0,0.15)' : 'none',
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
                bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.neutral : 'background.paper',
                boxShadow: theme.palette.mode === 'dark' ? '0 0 8px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: theme.palette.mode === 'dark' ? theme.palette.primary.light : '#1a0dab',
                  fontSize: '18px',
                  mb: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {(metaTitle || title || 'Title not available').trim()}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.mode === 'dark' ? theme.palette.success.light : '#006621',
                  fontSize: '14px',
                  mb: 0.5
                }}
              >
                yourdomain.com/{(urlSlug || 'url-slug').trim()}
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
                {(metaDescription || 'Meta description not available. Add a meta description to improve your SEO.').trim()}
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
                  Meta Title
                </Typography>
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.neutral : 'background.neutral',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : 'divider',
                    boxShadow: theme.palette.mode === 'dark' ? '0 0 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  <Typography variant="body2">
                    {(metaTitle || 'Not set').trim()}
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
                    bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.neutral : 'background.neutral',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : 'divider',
                    boxShadow: theme.palette.mode === 'dark' ? '0 0 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  <Typography variant="body2">
                    {(metaDescription || 'Not set').trim()}
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
                    bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.neutral : 'background.neutral',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : 'divider',
                    boxShadow: theme.palette.mode === 'dark' ? '0 0 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  <Typography variant="body2">
                    /{(urlSlug || 'Not set').trim()}
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
