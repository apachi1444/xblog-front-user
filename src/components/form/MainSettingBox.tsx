import React from "react";

import { Box, Paper, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const MainSettingsBox = () => (
    <Box sx={{ width: "100%", maxWidth: 1095 }}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          height: 39,
          backgroundColor: "#e4e7f5",
          borderRadius: "5px",
          border: "0.5px solid #5969cf",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px"
        }}
      >
        <Typography
          sx={{
            fontFamily: "Poppins, Helvetica",
            fontWeight: 500,
            color: "#1f384c",
            fontSize: "12px",
            letterSpacing: "0.5px",
            lineHeight: "23px"
          }}
        >
          Main Settings
        </Typography>
        <KeyboardArrowDownIcon
          sx={{
            width: 12,
            height: 12,
            color: "#1f384c"
          }}
        />
      </Paper>
    </Box>
  );

export default MainSettingsBox;