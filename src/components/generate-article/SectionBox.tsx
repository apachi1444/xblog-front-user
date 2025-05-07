import React, { useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Box, Stack, Divider, Collapse, Typography, IconButton } from "@mui/material";

import type { SectionItem } from "./DraggableSectionList";

type Status = "Not Started" | "In Progress" | "Completed";

interface StatusStyle {
  bgcolor: string;
  color: string;
  borderColor: string;
}

interface SectionBoxProps {
  section: SectionItem;
  onEditSection?: (section: SectionItem) => void;
  onDeleteSection?: (sectionId: string) => void;
}

export const SectionBox: React.FC<SectionBoxProps> = ({
  section,
  onEditSection,
  onDeleteSection
}) => {
  const [expanded, setExpanded] = useState(false);

  const statusStyles: Record<Status, StatusStyle> = {
    "Not Started": {
      bgcolor: '#FFEBEE',
      color: '#D32F2F',
      borderColor: '#FFCDD2',
    },
    "In Progress": {
      bgcolor: '#FFF8E1',
      color: '#FFA000',
      borderColor: '#FFECB3',
    },
    "Completed": {
      bgcolor: '#E8F5E9',
      color: '#4CAF50',
      borderColor: '#C8E6C9',
    },
  };


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
          {section.description && (
            <>
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: 'text.secondary',
                  mb: 0.5,
                }}
              >
                Description:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "12px",
                  color: 'text.secondary',
                  mb: 1.5,
                }}
              >
                {section.description}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
            </>
          )}

          {section.content ? (
            <>
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
                  {section.content || 'No content available for this section.'}
                </Typography>
              </Box>

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
            </>
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
        </Box>
      </Collapse>
    </Box>
  );
};