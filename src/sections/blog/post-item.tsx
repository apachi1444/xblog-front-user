import type { Article } from 'src/types/article';
import type { CardProps } from '@mui/material/Card';

import { formatDate } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { navigateToArticle } from 'src/utils/articleIdEncoder';
import { convertUTCToLocalDate } from 'src/utils/constants';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { ArticleActionsMenu } from 'src/components/article-actions-menu';

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
  const navigate = useNavigate();

  // Determine status color and icon
  const getStatusConfig = () => {
    switch (post.status) {
      case 'publish':
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
        wordBreak: 'break-word',
        hyphens: 'auto',
        maxWidth: '100%',
        ...(latestPostLarge && { typography: 'h5', height: 60 }),
        ...((latestPostLarge || latestPost) && {
          color: 'common.white',
        }),
      }}
    >
      {post.article_title}
    </Link>
  );

  // Get platform info for display
  const getPlatformInfo = () => {
    if (!post.platform) return null;

    const platformKey = post.platform.toLowerCase();
    return PLATFORM_ICONS[platformKey as keyof typeof PLATFORM_ICONS] || PLATFORM_ICONS.default;
  };

  const platformInfo = getPlatformInfo();

  // Render status badge with platform info for published articles
  const renderStatus = post.status === 'scheduled' && post.scheduled_publish_date ? (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 0.5,
      }}
    >
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
        <Chip
          size="small"
          icon={<Iconify icon={statusConfig.icon} />}
          label={statusConfig.label}
          color={statusConfig.color as any}
          sx={{
            height: 24,
            fontSize: '0.75rem',
            fontWeight: 'bold',
            '& .MuiChip-icon': { animation: 'pulse 2s infinite' },
            '@keyframes pulse': {
              '0%': { opacity: 0.6 },
              '50%': { opacity: 1 },
              '100%': { opacity: 0.6 }
            }
          }}
        />
        {/* Platform chip for scheduled articles */}
        {platformInfo && (
          <Chip
            size="small"
            icon={<Iconify icon={platformInfo.icon} />}
            label={platformInfo.name}
            sx={{
              height: 24,
              fontSize: '0.7rem',
              fontWeight: 'bold',
              bgcolor: alpha(platformInfo.color, 0.1),
              color: platformInfo.color,
              border: `1px solid ${alpha(platformInfo.color, 0.2)}`,
              '& .MuiChip-icon': {
                color: platformInfo.color,
              },
            }}
          />
        )}
      </Box>
      <Box
        sx={{
          bgcolor: alpha(theme.palette.info.main, 0.9),
          color: 'white',
          borderRadius: 1.5,
          px: 1.5,
          py: 0.75,
          backdropFilter: 'blur(8px)',
          border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
          boxShadow: `0 2px 8px ${alpha(theme.palette.info.main, 0.3)}`,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            fontSize: '0.8rem',
            lineHeight: 1.2,
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
          }}
        >
          <Iconify icon="mdi:calendar-clock" width={16} height={16} />
          {formatDate(convertUTCToLocalDate(post.scheduled_publish_date), 'MMM d • h:mm a')}
        </Typography>
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        display: 'flex',
        gap: 0.5,
        alignItems: 'center',
      }}
    >
      <Chip
        size="small"
        icon={<Iconify icon={statusConfig.icon} />}
        label={statusConfig.label}
        color={statusConfig.color as any}
        sx={{
          height: 24,
          fontSize: '0.75rem',
          fontWeight: 'bold',
        }}
      />
      {/* Platform chip for published articles */}
      {post.status === 'publish' && platformInfo && (
        <Chip
          size="small"
          icon={<Iconify icon={platformInfo.icon} />}
          label={platformInfo.name}
          sx={{
            height: 24,
            fontSize: '0.7rem',
            fontWeight: 'bold',
            bgcolor: alpha(platformInfo.color, 0.1),
            color: platformInfo.color,
            border: `1px solid ${alpha(platformInfo.color, 0.2)}`,
            '& .MuiChip-icon': {
              color: platformInfo.color,
            },
          }}
        />
      )}
    </Box>
  )

  // Render scheduled info for scheduled articles (now more subtle since date is in status)
  const renderScheduledInfo = post.status === 'scheduled' && post.scheduled_publish_date && (
    <Box
      sx={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: alpha(theme.palette.info.main, 0.1),
        color: theme.palette.info.main,
        borderRadius: 1,
        px: 1.5,
        py: 0.5,
        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
      }}
    >
      <Iconify
        icon="mdi:clock-outline"
        width={14}
        height={14}
        sx={{ mr: 0.5 }}
      />
      <Typography
        variant="caption"
        sx={{
          fontWeight: 500,
          fontSize: '0.7rem',
          textAlign: 'center',
        }}
      >
        {t('blog.scheduledFor', 'Scheduled for {{date}}', {
          date: formatDate(convertUTCToLocalDate(post.scheduled_publish_date), 'MMM d, yyyy • h:mm a')
        })}
      </Typography>
    </Box>
  );

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
        {formatDate(post.created_at , 'MMMM d, yyyy • h:mm a')}
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



  const handleCardClick = (event: React.MouseEvent) => {
    // Check if the click is coming from within a modal
    const target = event.target as Element;
    const isClickInsideModal = target.closest('[role="dialog"]') ||
                              target.closest('.MuiModal-root') ||
                              target.closest('.MuiDialog-root');

    // Check if any modal is open by looking for modal elements
    const hasOpenModal = document.querySelector('[role="dialog"]') ||
                        document.querySelector('.MuiModal-root') ||
                        document.querySelector('.MuiDialog-root');

    // If click is inside a modal, don't interfere with modal interactions
    if (isClickInsideModal) {
      return;
    }

    // Only navigate if no modals are open
    if (!hasOpenModal) {
      navigateToArticle(navigate, post.id);
    } else {
      // Prevent navigation when modals are open, but only for clicks outside the modal
      event.stopPropagation();
      event.preventDefault();
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        ...(post.status === 'draft' && {
          border: `2px solid ${alpha(theme.palette.warning.main, 0.3)}`,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[8],
            borderColor: alpha(theme.palette.warning.main, 0.6),
          },
        }),
        ...(post.status !== 'draft' && {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[10],
          },
        }),
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
        {renderScheduledInfo}
        {renderDraftCreative}

        {/* Three Dots Menu - Left Side */}
        <ArticleActionsMenu
          article={post}
          buttonSize="large"
          buttonStyle="overlay"
          position="left"
        />


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
        {renderInfo}
      </Box>
    </Card>
  );
}
