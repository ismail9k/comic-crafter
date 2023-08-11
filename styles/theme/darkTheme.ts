"use client";
import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "font-family": "inherit",
          color: "#fff",
        },
        contained: {
          background:
            "linear-gradient(30deg, var(--yellow) 10%, var(--orange) 90%)",
          color: "#000",
          fontWeight: "bold",
          transition: "all 200ms ease",
          ":hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 2px -2px 5px rgba(0, 0, 0, 0.2)",
          },
        },
      },
    },
  },
});

export default darkTheme;
