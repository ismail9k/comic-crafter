"use client";

import styles from "./page.module.css";
import Comics from "../components/Comics";
import { Box, Typography } from "@mui/material";

const links = [
  {
    title: "About",
    link: "/about",
    description:
      "Explore detailed information about the project, its mission, and vision.",
  },
  {
    title: "Team",
    link: "/team",
    description:
      "Meet the creative minds and dedicated professionals behind the project.",
  },
  {
    title: "Feedback",
    link: "/feedback",
    description:
      "Share your thoughts and insights to help us improve and grow.",
  },
  {
    title: "NFTs",
    link: "/nfts",
    description:
      "Discover our unique collection of NFTs and learn how to get involved.",
  },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <Box>
        <Typography style={comicTitleStyle}>Comic Crafter</Typography>
      </Box>

      <Comics onClick={() => {}} />

      <div className={styles.grid}>
        {links.map((link) => (
          <a key={link.title} href={link.link} className={styles.card}>
            <h2>
              {link.title} <span>-&gt;</span>
            </h2>
            <p>{link.description}</p>
          </a>
        ))}
      </div>
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
