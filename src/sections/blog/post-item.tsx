import type { Article } from 'src/types/article';
import type { CardProps } from '@mui/material/Card';

import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { fDate } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

// Legacy type kept for backward compatibility
export type PostItemProps = {
  id: string;
  title: string;
  description: string;
  slug?: string;
  coverImage: string; // Changed from coverUrl
  status?: 'published' | 'draft' | 'scheduled';
  createdAt: string; // Changed from postedAt
  updatedAt?: string;
  publishedAt?: string | null;
  author: {
    id?: string;
    name: string;
    avatar: string; // Changed from avatarUrl
  };
  storeId?: string;
  keywords?: {
    primary: string;
    secondary?: string[];
  };
  meta?: {
    title: string;
    description: string;
    url: string;
  };
};

// Platform icons mapping
const PLATFORM_ICONS = {
  wordpress: { icon: 'mdi:wordpress', color: '#21759b', name: 'WordPress' },
  medium: { icon: 'mdi:medium', color: '#00ab6c', name: 'Medium' },
  ghost: { icon: 'simple-icons:ghost', color: '#15171a', name: 'Ghost' },
  webflow: { icon: 'simple-icons:webflow', color: '#4353ff', name: 'Webflow' },
  shopify: { icon: 'mdi:shopify', color: '#7ab55c', name: 'Shopify' },
  wix: { icon: 'simple-icons:wix', color: '#0c6efc', name: 'Wix' },
  squarespace: { icon: 'simple-icons:squarespace', color: '#000000', name: 'Squarespace' },
  default: { icon: 'mdi:web', color: '#6e7681', name: 'Website' }
};

const getPlatformIcons = (post: Article) => {
  if (post.status !== 'published') return [];

  // Use the platform from the API response
  if (post.platform && post.platform !== 'string') {
    return [post.platform];
  }

  // Fallback to default if no platform specified
  return ['default'];
};

export function PostItem({
  sx,
  post,
  latestPost,
  latestPostLarge,
  ...other
}: CardProps & {
  post: Article;
  latestPost: boolean;
  latestPostLarge: boolean;
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  // Get platform icons for this post
  const platforms = getPlatformIcons(post);

  // Determine status color and icon
  const getStatusConfig = () => {
    switch (post.status) {
      case 'published':
        return {
          color: 'success',
          icon: 'mdi:check-circle',
          label: t('blog.published', 'Published')
        };
      case 'draft':
        return {
          color: 'warning',
          icon: 'mdi:file-document-outline',
          label: t('blog.draft', 'Draft')
        };
      case 'scheduled':
        return {
          color: 'info',
          icon: 'mdi:clock-outline',
          label: t('blog.scheduled', 'Scheduled')
        };
      default:
        return {
          color: 'default',
          icon: 'mdi:help-circle-outline',
          label: t('blog.unknown', 'Unknown')
        };
    }
  };

  const statusConfig = getStatusConfig();


  const renderTitle = (
    <Link
      color="inherit"
      variant="subtitle2"
      underline="hover"
      sx={{
        height: 44,
        overflow: 'hidden',
        WebkitLineClamp: 2,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        ...(latestPostLarge && { typography: 'h5', height: 60 }),
        ...((latestPostLarge || latestPost) && {
          color: 'common.white',
        }),
      }}
    >
      {post.title}
    </Link>
  );

  // Render status badge
  const renderStatus = (
    <Chip
      size="small"
      icon={<Iconify icon={statusConfig.icon} />}
      label={statusConfig.label}
      color={statusConfig.color as any}
      sx={{
        height: 24,
        fontSize: '0.75rem',
        fontWeight: 'bold',
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        ...(post.status === 'scheduled' && {
          '& .MuiChip-icon': { animation: 'pulse 2s infinite' },
          '@keyframes pulse': {
            '0%': { opacity: 0.6 },
            '50%': { opacity: 1 },
            '100%': { opacity: 0.6 }
          }
        })
      }}
    />
  );

  // Render platform icons for published posts
  const renderPlatforms = (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
        display: 'flex',
        gap: 0.5,
      }}
    >
      {platforms.map((platform) => {
        const { icon, color, name } = PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS] || PLATFORM_ICONS.default;
        return (
          <Tooltip key={platform} title={name} arrow>
            <Box
              sx={{
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                backgroundColor: alpha(color, 0.9),
                color: '#fff',
                boxShadow: `0 2px 4px ${alpha(color, 0.4)}`,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
            >
              <Iconify icon={icon} width={16} height={16} />
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );

  // Render scheduled info (disabled for now since scheduledAt is not in API)
  const renderScheduledInfo = null;

  // Render draft creative element
  const renderDraftCreative = post.status === 'draft' && (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 80,
        height: 80,
        overflow: 'hidden',
        zIndex: 9,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -5,
          right: -5,
          width: 120,
          height: 36,
          backgroundColor: theme.palette.warning.main,
          transform: 'rotate(45deg)',
          transformOrigin: 'bottom right',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: `0 2px 4px ${alpha(theme.palette.warning.main, 0.4)}`,
        }}
      >
        <Typography variant="caption" sx={{ color: '#fff', fontWeight: 'bold', fontSize: '0.65rem' }}>
          {t('blog.inProgress', 'IN PROGRESS')}
        </Typography>
      </Box>
    </Box>
  );

  const renderInfo = (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{
        mt: 2,
        color: 'text.secondary',
        ...((latestPostLarge || latestPost) && {
          color: 'common.white',
          opacity: 0.64,
        }),
      }}
    >
      {/* Platform */}
      <Chip
        size="small"
        label={post.platform}
        sx={{
          height: 20,
          fontSize: '0.65rem',
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
          '& .MuiChip-label': { px: 1 }
        }}
      />
    </Stack>
  );

  const renderCover = post.featured_media ? (
    <Box
      component="img"
      alt={post.title}
      src={post.featured_media}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  ) : (
    <Box
      sx={{
        top: 0,
        width: 1,
        height: 1,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: alpha(theme.palette.grey[500], 0.12),
        border: `2px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
      }}
    >
      <Stack alignItems="center" spacing={1}>
        <Iconify
          icon="mdi:image-off-outline"
          width={48}
          height={48}
          sx={{
            color: theme.palette.grey[500],
            opacity: 0.6
          }}
        />
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.grey[600],
            fontWeight: 500,
            textAlign: 'center'
          }}
        >
          {t('blog.imageNotSet', 'Image not set')}
        </Typography>
      </Stack>
    </Box>
  );

  const renderDate = (
    <Box
      sx={{
        mb: 2,
        display: 'inline-flex',
        alignItems: 'center',
        px: 2,
        py: 1,
        borderRadius: 2,
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
        ...((latestPostLarge || latestPost) && {
          backgroundColor: alpha(theme.palette.common.white, 0.12),
          border: `1px solid ${alpha(theme.palette.common.white, 0.16)}`,
        }),
      }}
    >
      <Iconify
        icon="mdi:calendar-outline"
        width={16}
        height={16}
        sx={{
          mr: 1,
          color: theme.palette.primary.main,
          ...((latestPostLarge || latestPost) && {
            color: 'common.white',
          }),
        }}
      />
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          color: theme.palette.primary.main,
          ...((latestPostLarge || latestPost) && {
            color: 'common.white',
          }),
        }}
      >
        {fDate(post.created_at)}
      </Typography>
    </Box>
  );

  const renderShape = (
    <SvgColor
      width={88}
      height={36}
      src="/assets/icons/shape-avatar.svg"
      sx={{
        left: 0,
        zIndex: 9,
        bottom: -16,
        position: 'absolute',
        color: 'background.paper',
        ...((latestPostLarge || latestPost) && { display: 'none' }),
      }}
    />
  );

  // Render a short excerpt of the content
  const renderExcerpt = (
    <Typography
      variant="body2"
      sx={{
        mt: 1,
        color: 'text.secondary',
        height: 40,
        overflow: 'hidden',
        WebkitLineClamp: 2,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        ...((latestPostLarge || latestPost) && {
          color: 'common.white',
          opacity: 0.8,
        }),
      }}
    >
      {post.content}
    </Typography>
  );

  return (
    <Card
      sx={{
        position: 'relative',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[10],
        },
        ...sx
      }}
      {...other}
    >
      <Box
        sx={() => ({
          position: 'relative',
          pt: 'calc(100% * 3 / 4)',
          ...((latestPostLarge || latestPost) && {
            pt: 'calc(100% * 4 / 3)',
            '&:after': {
              top: 0,
              content: "''",
              width: '100%',
              height: '100%',
              position: 'absolute',
              bgcolor: varAlpha(theme.palette.grey['900Channel'], 0.72),
            },
          }),
          ...(latestPostLarge && {
            pt: {
              xs: 'calc(100% * 4 / 3)',
              sm: 'calc(100% * 3 / 4.66)',
            },
          }),
        })}
      >
        {renderShape}
        {renderCover}
        {renderStatus}
        {platforms.length > 0 && renderPlatforms}
        {renderScheduledInfo}
        {renderDraftCreative}
      </Box>

      <Box
        sx={() => ({
          p: theme.spacing(4, 3, 3, 3),
          ...((latestPostLarge || latestPost) && {
            width: 1,
            bottom: 0,
            position: 'absolute',
          }),
        })}
      >
        {renderDate}
        {renderTitle}
        {renderExcerpt}
        {renderInfo}
      </Box>
    </Card>
  );
}
