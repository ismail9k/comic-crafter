import { ethers } from "ethers";
import { useState } from "react";

import giftNFT from "../assets/contracts/GiftNFT.json";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import InputBase from "@mui/material/InputBase";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import TwitterIcon from "@mui/icons-material/Twitter";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
const ENV = process.env.NEXT_PUBLIC_ENV;

const isDev = ENV !== "production";

function MintNFT({ currentImg }) {
  const [address, setAddress] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("minting...");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [infoModalStatus, setInfoModalStatus] = useState(false);
  const [network, setNetwork] = useState("");

  const [tokenId, setTokenId] = useState(0);

  async function mintNFT(address, url, title) {
    try {
      const { signer } = window;
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        giftNFT.abi,
        signer
      );

      console.log("Going to pop wallet now to pay gas...");
      let nftTxn = await connectedContract.makeGiftNFT(address, url, title);

      setLoadingMessage("Mining... please wait.");
      setLoadingStatus(true);
      await nftTxn.wait();

      setLoadingMessage(
        "Mining finished successfully. Please hold on while generating the NFT info"
      );
      setLoadingStatus(true);

      connectedContract.on("NewGiftNFTMinted", (from, tokenId) => {
        setLoadingStatus(false);
        setTokenId(tokenId.toNumber());
        setInfoModalStatus(true);
      });

      console.log(
        `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
      );
    } catch (error) {
      setLoadingStatus(false);
      console.log(error);
    }
  }

  function handleSetInputAddress(e) {
    const value = e.target.value;
    setAddress(value);
  }

  const handleNetworkChange = (event) => {
    setNetwork(event.target.value);
  };

  function handleButtonClick() {
    mintNFT(address, currentImg.url, currentImg.name);
  }

  function getNftURL() {
    return `https://${isDev ? "testnets." : ""}opensea.io/assets/${
      !isDev ? "matic/" : ""
    }${CONTRACT_ADDRESS}/${tokenId}`;
  }

  return (
    <>
      <Box sx={{ minWidth: 500 }}>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 500,
          }}
        >
          <FormControl sx={{ flex: 1 }}>
            <InputLabel id="network-select-label">Network</InputLabel>
            <Select
              labelId="network-select-label"
              id="network-select"
              value={network}
              label="Network"
              onChange={handleNetworkChange}
            >
              <MenuItem value="">Network</MenuItem>
              <MenuItem value="polygon">Polygon</MenuItem>
              <MenuItem value="cardano" disabled>
                Cardano (coming soon)
              </MenuItem>
              <MenuItem value="ethereum" disabled>
                Ethereum (coming soon)
              </MenuItem>
            </Select>
          </FormControl>

          <InputBase
            sx={{ ml: 1, flex: 2 }}
            value={address}
            onInput={handleSetInputAddress}
            placeholder="Receiver Address"
          />
          <Button onClick={handleButtonClick} startIcon={<RocketLaunchIcon />}>
            Send Greeting
          </Button>
        </Paper>
      </Box>

      <Backdrop
        id="loadingBackdrop"
        open={loadingStatus}
        onClose={() => setLoadingStatus(false)}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress color="inherit" />
          <p>{loadingMessage}</p>
        </Stack>
      </Backdrop>
      <Modal
        id="infoModal"
        open={infoModalStatus}
        onClose={() => setInfoModalStatus(false)}
      >
        <Box sx={style}>
          <p>
            Hey there! We have minted your NFT. It may be blank right now. It
            can take a max of 10 min to show up on OpenSea.
          </p>
          <Stack direction="row" spacing={2}>
            <Button
              href={getNftURL()}
              target="_blank"
              rel="noreferrer"
              startIcon={<ImageSearchIcon />}
            >
              Check your NFT
            </Button>

            <Button
              target="_blank"
              variant="contained"
              href={`
            http://twitter.com/share?text=I've created this awesome NFT gift using: ${DOMAIN} &url=${getNftURL()}&hashtags=nfts,polygon,gifts
            `}
              rel="noreferrer"
              startIcon={<TwitterIcon />}
            >
              Share on Twitter
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}

export default MintNFT;
