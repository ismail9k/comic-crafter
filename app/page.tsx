"use client";

import { Box, Typography } from "@mui/material";

import Comics from "../components/Comics";
import HomeLinks from "../components/HomeLinks";

export default function Home() {
  return (
    <main>
      <Box sx={{ textAlign: "center", mb: 10, mt: 10 }}>
        <Typography style={comicTitleStyle}>Comic Crafter</Typography>
      </Box>

      <Comics />

      <HomeLinks />
    </main>
  );
}

const comicTitleStyle = {
  fontFamily: "inherit",
  fontSize: "100px",
  fontWeight: "bold",
  color: "var(--yellow)",
  textShadow: [-1, 2, 3, 4, 5, 6, 7, 8]
    .map((val) => `${val}px ${val}px var(--orange)`)
    .join(", "),
  letterSpacing: "4px",
  lineHeight: "1.5",
  marginBottom: "50px",
};
