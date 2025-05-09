import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Chip,
  Grid,
  List,
  Modal,
  Paper,
  Table,
  Divider,
  ListItem,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Accordion,
  Typography,
  IconButton,
  ListItemIcon,
  ListItemText,
  TableContainer,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// Section content types
interface SectionLink {
  text: string;
  url: string;
}

interface SectionImage {
  url: string;
  alt: string;
  caption?: string;
}

interface SectionFaqItem {
  question: string;
  answer: string;
}

interface SectionTableData {
  headers: string[];
  rows: string[][];
}

export interface ArticleSection {
  id: string;
  title: string;
  content?: string;
  type?: 'introduction' | 'regular' | 'conclusion' | 'faq' | 'toc' | string;
  contentType?: 'paragraph' | 'bullet-list' | 'table' | 'faq' | 'image-gallery' | 'toc' | string;
  bulletPoints?: string[];
  internalLinks?: SectionLink[];
  externalLinks?: SectionLink[];
  tableData?: SectionTableData;
  faqItems?: SectionFaqItem[];
  images?: SectionImage[];
}

export interface ArticleInfo {
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  language?: string;
  targetCountry?: string;
  createdAt?: string;
  featuredImage?: {
    url: string;
    alt: string;
    caption?: string;
  };
}

interface ArticlePreviewModalProps {
  open: boolean;
  onClose: () => void;
  articleInfo: ArticleInfo;
  sections: ArticleSection[];
}

export const ArticlePreviewModal: React.FC<ArticlePreviewModalProps> = ({
  open,
  onClose,
  articleInfo,
  sections
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="article-preview-modal-title"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '95%', sm: '90%', md: '80%' },
        maxWidth: '1200px',
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: { xs: 2, sm: 3, md: 4 },
        overflow: 'auto',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 10, py: 1 }}>
          <Typography id="article-preview-modal-title" variant="h6" component="h2">
            {t('preview.title', 'Article Preview')}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Article Content */}
        <Box sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          {/* Featured Image */}
          {articleInfo.featuredImage && (
            <Box
              sx={{
                mb: 3,
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                maxHeight: 400,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'background.neutral'
              }}
            >
              <Box
                component="img"
                src={articleInfo.featuredImage.url}
                alt={articleInfo.featuredImage.alt}
                sx={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              {articleInfo.featuredImage.caption && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    p: 1,
                    fontSize: '0.875rem'
                  }}
                >
                  {articleInfo.featuredImage.caption}
                </Box>
              )}
            </Box>
          )}

          {/* Article Title */}
          <Typography variant="h4" gutterBottom sx={{
            fontWeight: 700,
            color: 'text.primary',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}>
            {articleInfo.title || t('preview.untitled', 'Untitled Article')}
          </Typography>

          {/* Article Meta */}
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            mb: 3,
            color: 'text.secondary'
          }}>
            {articleInfo.createdAt && (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 3, mb: { xs: 1, sm: 0 } }}>
                <Iconify icon="mdi:calendar" width={16} height={16} sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {new Date(articleInfo.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>
              </Box>
            )}

            {articleInfo.language && articleInfo.targetCountry && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Iconify icon="mdi:translate" width={16} height={16} sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {articleInfo.language.toUpperCase()} | {articleInfo.targetCountry.toUpperCase()}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Keywords */}
          {(articleInfo.primaryKeyword || (articleInfo.secondaryKeywords && articleInfo.secondaryKeywords.length > 0)) && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('preview.keywords', 'Keywords:')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {articleInfo.primaryKeyword && (
                  <Chip
                    label={articleInfo.primaryKeyword}
                    sx={{
                      bgcolor: 'success.lighter',
                      color: 'success.dark',
                      fontWeight: 'bold'
                    }}
                  />
                )}
                {articleInfo.secondaryKeywords && articleInfo.secondaryKeywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    sx={{
                      bgcolor: 'primary.lighter',
                      color: 'primary.main'
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* All Sections */}
          {sections && sections.length > 0 ? (
            sections.map((section, index) => (
              <Box key={index} sx={{ mb: 6 }}>
                {/* Section Title */}
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {section.title || `${t('preview.section', 'Section')} ${index + 1}`}
                </Typography>

                {/* Content Type Badge */}
                {(section.type || section.contentType) && (
                  <Chip
                    label={
                      section.type === 'introduction'
                        ? t('preview.introductionSection', 'Introduction')
                        : section.type === 'conclusion'
                          ? t('preview.conclusionSection', 'Conclusion')
                          : section.type === 'faq' || section.contentType === 'faq'
                            ? t('preview.faqSection', 'FAQ Section')
                            : section.type === 'toc' || section.contentType === 'toc'
                              ? t('preview.tocSection', 'Table of Contents')
                              : section.contentType === 'bullet-list'
                                ? t('preview.listSection', 'List Section')
                                : section.contentType === 'table'
                                  ? t('preview.tableSection', 'Table Section')
                                  : section.contentType === 'image-gallery'
                                    ? t('preview.imageGallery', 'Image Gallery')
                                    : section.contentType || t('preview.paragraph', 'Paragraph')
                    }
                    size="small"
                    sx={{
                      mb: 1.5,
                      bgcolor: 'background.neutral',
                      color: 'text.secondary',
                      fontWeight: 500,
                      fontSize: '0.75rem'
                    }}
                  />
                )}

                {/* Main Content - Display based on content type */}
                {section.content && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {section.content}
                    </Typography>
                  </Box>
                )}

                {/* Bullet Points - Special handling for TOC */}
                {section.bulletPoints && section.bulletPoints.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <List disablePadding>
                      {section.bulletPoints.map((point, i) => (
                        <ListItem
                          key={i}
                          sx={{
                            py: 0.5,
                            ...(section.type === 'toc' || section.contentType === 'toc') && {
                              cursor: 'pointer',
                              '&:hover': {
                                bgcolor: 'action.hover',
                                borderRadius: 1,
                              }
                            }
                          }}
                          component={section.type === 'toc' || section.contentType === 'toc' ? 'a' : 'li'}
                          href={section.type === 'toc' || section.contentType === 'toc' ? `#${point.toLowerCase().replace(/\s+/g, '-')}` : undefined}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Iconify
                              icon={section.type === 'toc' || section.contentType === 'toc'
                                ? "mdi:chevron-right"
                                : "mdi:circle-small"}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={point}
                            primaryTypographyProps={{
                              ...(section.type === 'toc' || section.contentType === 'toc') && {
                                color: 'primary.main',
                                fontWeight: 500
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Table Data */}
                {section.tableData && section.tableData.headers && section.tableData.rows && (
                  <TableContainer component={Paper} sx={{ mb: 2, overflow: 'auto' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'background.neutral' }}>
                          {section.tableData.headers.map((header, i) => (
                            <TableCell key={i} sx={{ fontWeight: 'bold' }}>
                              {header}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {section.tableData.rows.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <TableCell key={cellIndex}>{cell}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {/* Internal and External Links */}
                {((section.internalLinks && section.internalLinks.length > 0) ||
                  (section.externalLinks && section.externalLinks.length > 0)) && (
                  <Box sx={{ mb: 2, mt: 2 }}>
                    {/* Internal Links */}
                    {section.internalLinks && section.internalLinks.length > 0 && (
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {t('preview.relatedContent', 'Related Content:')}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {section.internalLinks.map((link, i) => (
                            <Box
                              key={i}
                              component="a"
                              href={link.url}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: 'primary.main',
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' }
                              }}
                            >
                              <Iconify icon="mdi:link-variant" width={16} height={16} sx={{ mr: 0.5 }} />
                              <Typography variant="body2">{link.text}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* External Links */}
                    {section.externalLinks && section.externalLinks.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          {t('preview.externalResources', 'External Resources:')}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {section.externalLinks.map((link, i) => (
                            <Box
                              key={i}
                              component="a"
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: 'primary.main',
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' }
                              }}
                            >
                              <Iconify icon="mdi:open-in-new" width={16} height={16} sx={{ mr: 0.5 }} />
                              <Typography variant="body2">{link.text}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}

                {/* FAQ Items */}
                {section.faqItems && section.faqItems.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    {section.faqItems.map((faq, i) => (
                      <Accordion key={i} sx={{ mb: 1 }}>
                        <AccordionSummary expandIcon={<Iconify icon="mdi:chevron-down" />}>
                          <Typography variant="subtitle1">{faq.question}</Typography>
                        </AccordionSummary>
                        <Divider />
                        <AccordionDetails>
                          <Typography variant="body2">{faq.answer}</Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                )}

                {/* Image Gallery */}
                {section.images && section.images.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Grid container spacing={2}>
                      {section.images.map((image, i) => (
                        <Grid item xs={12} key={i}>
                          <Box
                            sx={{
                              borderRadius: 2,
                              overflow: 'hidden',
                              position: 'relative',
                              boxShadow: (theme) => theme.customShadows?.z8 || '0 8px 16px 0 rgba(0,0,0,0.1)',
                              transition: 'transform 0.3s ease-in-out',
                              '&:hover': {
                                transform: 'scale(1.02)',
                              }
                            }}
                          >
                            <Box
                              component="img"
                              src={image.url}
                              alt={image.alt}
                              sx={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                                objectFit: 'cover',
                                aspectRatio: '16/9',
                              }}
                            />
                            {image.caption && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                                  color: 'white',
                                  p: 1,
                                  fontSize: '0.875rem'
                                }}
                              >
                                {image.caption}
                              </Box>
                            )}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Add ID for TOC navigation */}
                <Box id={section.title.toLowerCase().replace(/\s+/g, '-')} />

                {index < sections.length - 1 && <Divider sx={{ my: 3 }} />}
              </Box>
            ))
          ) : (
            <Box sx={{
              textAlign: 'center',
              color: 'text.secondary',
              my: 3,
              p: 2,
              bgcolor: 'background.neutral',
              borderRadius: 1
            }}>
              <Typography variant="body2">
                {t('preview.noSections', 'No sections have been generated yet.')}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

