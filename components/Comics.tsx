import comics from "../assets/data/comics.json";
import font from "../styles/theme/font";

import {
  Grid,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Modal,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { useState } from "react";

function excerpt(description) {
  const maxLength = 100;
  return description.length > maxLength
    ? description.substring(0, maxLength) + "..."
    : description;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: "500px",
  boxShadow: 24,
  overflowY: "auto",
  maxHeight: "100vh",
};

export default function Comics({ onClick }) {
  const [open, setOpen] = useState(false);
  const [selectedComic, setSelectedComic] = useState(comics[0]);
  const handleOpen = (comic) => {
    setSelectedComic(comic);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleMinting = () => {
    // TODO
  };

  return (
    <Box>
      <Grid container spacing={3} justifyContent="center" alignItems="stretch">
        {comics.map((c, indx) => (
          <Grid item key={indx} xs={3} md={4}>
            <Card onClick={() => handleOpen(c)}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="500"
                  src={`/imgs/${c.img}`}
                  alt={c.title}
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    className={font.className}
                  >
                    {c.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {excerpt(c.description)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={style}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              src={`/imgs/${selectedComic.img}`}
              alt={selectedComic.title}
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                className={font.className}
              >
                {selectedComic.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedComic.description}
              </Typography>
            </CardContent>

            <CardActions>
              <Button
                style={{ marginInlineStart: "auto" }}
                onClick={handleMinting}
                variant="contained"
                size="large"
              >
                Mint NFT
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Modal>
    </Box>
  );
}
