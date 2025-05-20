import type { ArticleSection } from "src/sections/generate/schemas";

import React, { useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  Box,
  Chip,
  Stack,
  Divider,
  Collapse,
  IconButton,
  Typography
} from "@mui/material";

interface SectionBoxProps {
  section: ArticleSection;
  onEditSection?: (section: ArticleSection) => void;
  onDeleteSection?: (sectionId: string) => void;
}

export const SectionBox: React.FC<SectionBoxProps> = ({
  section,
  onEditSection,
  onDeleteSection
}) => {
  const [expanded, setExpanded] = useState(false);


  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <Box sx={{ width: '100%', position: "relative" }}>
      <Box
        sx={{
          width: '100%',
          bgcolor: '#F1F2F7',
          borderRadius: expanded ? "5px 5px 0 0" : "5px",
          border: "0.5px solid #A0AFF8",
          borderBottom: expanded ? 0 : "0.5px solid #A0AFF8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: '#E8EAFB',
          },
        }}
        onClick={handleToggleExpand}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
          <DragIndicatorIcon
            sx={{
              width: "16px",
              height: "16px",
              color: '#A0AFF8',
              cursor: 'grab',
            }}
            onMouseDown={(e) => e.stopPropagation()} // Prevent expand toggle when dragging
          />
          <Typography
            sx={{
              fontFamily: "'Poppins', Helvetica",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.5px",
              lineHeight: "1.2",
              color: 'text.primary',
              flexGrow: 1,
              mr: 2,
            }}
          >
            {section.title}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">

          <IconButton
            size="small"
            onClick={handleToggleExpand}
            sx={{ p: 0.5 }}
          >
            {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>

          <Stack direction="row" spacing={1}>
            {onEditSection && (
              <EditIcon
                onClick={(e) => {
                  e.stopPropagation(); // Prevent expand toggle
                  onEditSection(section);
                }}
                sx={{
                  width: "18px",
                  height: "18px",
                  color: '#5969cf',
                  cursor: 'pointer',
                }}
              />
            )}
            {onDeleteSection && (
              <DeleteOutlineIcon
                onClick={(e) => {
                  e.stopPropagation(); // Prevent expand toggle
                  onDeleteSection(section.id);
                }}
                sx={{
                  width: "20px",
                  height: "20px",
                  color: '#D32F2F',
                  cursor: 'pointer',
                }}
              />
            )}
          </Stack>
        </Stack>
      </Box>

      {/* Collapsible content preview */}
      <Collapse in={expanded}>
        <Box
          sx={{
            width: '100%',
            bgcolor: '#FFFFFF',
            borderRadius: "0 0 5px 5px",
            border: "0.5px solid #A0AFF8",
            borderTop: 0,
            p: 2,
          }}
        >
          {/* Content Type Badge */}
          {section.contentType && (
            <>
              <Box sx={{ display: 'flex', mb: 1.5 }}>
                <Chip
                  label={
                    section.type === 'faq'
                      ? 'FAQ Section'
                      : section.contentType === 'bullet-list'
                        ? 'List Section'
                        : section.contentType === 'table'
                          ? 'Table Section'
                          : section.contentType === 'image-gallery'
                            ? 'Image Gallery'
                            : section.contentType || 'Paragraph'
                  }
                  size="small"
                  sx={{
                    bgcolor: 'background.neutral',
                    color: 'text.secondary',
                    fontWeight: 500,
                    fontSize: '0.75rem'
                  }}
                />
              </Box>
              <Divider sx={{ my: 1.5 }} />
            </>
          )}

          <Typography
            variant="subtitle2"
            sx={{
              fontSize: "11px",
              fontWeight: 600,
              color: 'text.secondary',
              mb: 0.5,
            }}
          >
            Content Preview:
          </Typography>

          {/* Display content based on type */}
          {section.contentType === 'bullet-list' && section.bulletPoints && section.bulletPoints.length > 0 ? (
            <Box
              sx={{
                mb: 1,
                p: 1.5,
                borderRadius: 1,
                bgcolor: 'background.neutral',
                maxHeight: '300px',
                overflow: 'auto'
              }}
            >
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {section.bulletPoints.slice(0, 3).map((point, index) => (
                  <li key={index} style={{ marginBottom: '8px' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: 'text.primary',
                        lineHeight: 1.6,
                      }}
                    >
                      {point}
                    </Typography>
                  </li>
                ))}
                {section.bulletPoints.length > 3 && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                    + {section.bulletPoints.length - 3} more items
                  </Typography>
                )}
              </ul>
            </Box>
          ) : section.contentType === 'faq' && section.faqItems && section.faqItems.length > 0 ? (
            <Box
              sx={{
                mb: 1,
                p: 1.5,
                borderRadius: 1,
                bgcolor: 'background.neutral',
                maxHeight: '300px',
                overflow: 'auto'
              }}
            >
              {section.faqItems.slice(0, 2).map((faq, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: 'text.primary',
                      mb: 0.5,
                    }}
                  >
                    Q: {faq.question}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "13px",
                      color: 'text.secondary',
                      lineHeight: 1.6,
                    }}
                  >
                    A: {faq.answer.length > 100 ? `${faq.answer.substring(0, 100)}...` : faq.answer}
                  </Typography>
                </Box>
              ))}
              {section.faqItems.length > 2 && (
                <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                  + {section.faqItems.length - 2} more FAQ items
                </Typography>
              )}
            </Box>
          ) : section.content ? (
            <Box
              sx={{
                mb: 1,
                p: 1.5,
                borderRadius: 1,
                bgcolor: 'background.neutral',
                maxHeight: '300px',
                overflow: 'auto'
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: "13px",
                  color: 'text.primary',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                }}
              >
                {section.content.length > 300
                  ? `${section.content.substring(0, 300)}...`
                  : section.content || 'No content available for this section.'}
              </Typography>
            </Box>
          ) : (
            <Typography
              variant="body2"
              sx={{
                fontSize: "12px",
                color: 'text.secondary',
                fontStyle: 'italic',
              }}
            >
              No content has been added to this section yet. Click the edit button to add content.
            </Typography>
          )}

          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Typography
              variant="caption"
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                fontWeight: 500,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onEditSection) onEditSection(section);
              }}
            >
              Edit full content
            </Typography>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};