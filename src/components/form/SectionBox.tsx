import React from "react";

import EditIcon from "@mui/icons-material/Edit";
import { Box, Chip, Stack, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

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

  const currentStyle = statusStyles[section.status];

  return (
    <Box sx={{ width: '100%', position: "relative" }}>
      <Box
        sx={{
          width: '100%',
          bgcolor: '#F1F2F7',
          borderRadius: "5px",
          border: "0.5px solid #A0AFF8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <DragIndicatorIcon 
            sx={{ 
              width: "16px", 
              height: "16px", 
              color: '#A0AFF8',
              cursor: 'grab',
            }} 
          />
          <Typography
            sx={{
              fontFamily: "'Poppins', Helvetica",
              fontSize: "12px",
              fontWeight: 400,
              letterSpacing: "0.5px",
              lineHeight: "1.2",
              color: 'text.primary',
              flexGrow: 1,
              mr: 2,
            }}
            noWrap
          >
            {section.title}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            label={section.status}
            sx={{
              bgcolor: currentStyle.bgcolor,
              color: currentStyle.color,
              height: "25px",
              borderRadius: "20px",
              border: `1px solid ${currentStyle.borderColor}`,
              fontFamily: "'Poppins', Helvetica",
              fontWeight: 700,
              fontSize: "8px",
              letterSpacing: "0.5px",
            }}
          />
          <Stack direction="row" spacing={1}>
            {onEditSection && (
              <EditIcon 
                onClick={() => onEditSection(section)}
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
                onClick={() => onDeleteSection(section.id)}
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
    </Box>
  );
};