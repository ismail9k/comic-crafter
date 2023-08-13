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
import { getNetwork } from "@wagmi/core";
import { useState } from "react";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { optimismGoerli } from "wagmi/chains";

import BookPublisher from "../assets/data/BookPublisher.json";
import comics from "../assets/data/comics.json";
import ERC20 from "../assets/data/ERC20.json";

import ConnectWallet from "./ConnectWallet";
import Loader from "./Loader";

function excerpt(description) {
  const maxLength = 100;
  return description.length > maxLength
    ? description.substring(0, maxLength) + "..."
    : description;
}

const backdropStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: "500px",
  boxShadow: 24,
  overflowY: "auto",
  maxHeight: "100vh",
};

export default function Comics() {
  const { chain } = getNetwork();
  const [isComicModalOpen, setIsComicModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedComic, setSelectedComic] = useState(comics[0]);
  const { address, isConnected } = useAccount();
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: BookPublisher.abi,
    functionName: "buySuperNFT",
    args: [address],
  });

  const { write, data, error, isError } = useContractWrite(config);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    isLoading,
    isSuccess,
    isError: isTransError,
    error: transError,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  const paymentTo = optimismGoerli.id
    ? (process.env.NEXT_PUBLIC_OP_CONTRACT_ADDRESS as `0x${string}`)
    : (process.env.NEXT_PUBLIC_CROSS_CHAIN_CONTRACT_ADDRESS as `0x${string}`);

  const paymentTokenAddress =
    chain?.id == optimismGoerli.id
      ? (process.env.NEXT_PUBLIC_OP_PAYEMNT_CONTRACT_ADDRESS as `0x${string}`)
      : (process.env
          .NEXT_PUBLIC_FUJI_PAYEMNT_CONTRACT_ADDRESS as `0x${string}`);

  const paymentFunctionName =
    chain?.id == optimismGoerli.id ? "approve" : "transfer";

  const { config: paymentConfig } = usePrepareContractWrite({
    address: paymentTokenAddress,
    abi: ERC20.abi,
    functionName: paymentFunctionName,
    args: [paymentTo, 500],
  });
  const { write: writePayment } = useContractWrite(paymentConfig);

  const handleOpenComicModal = (comic) => {
    setSelectedComic(comic);
    setIsComicModalOpen(true);
  };
  const handleCloseComicModal = () => {
    setIsComicModalOpen(false);
  };
  const handleOpenInfoModal = () => {
    setIsInfoModalOpen(true);
  };
  const handleCloseInfoModal = () => {
    if (isLoading) return;
    setIsInfoModalOpen(false);
  };

  const handleMinting = async () => {
    // if (![optimismGoerli.id, avalancheFuji.id].includes(chain?.id)) {
    //   await connector?.connect({ chainId: optimismGoerli.id });
    // }

    await writePayment?.();
    handleOpenInfoModal();
    write?.();
  };

  function renderContent() {
    if (isLoading) return <Loader />;
    if (isSuccess)
      return (
        <>
          <Typography variant="h2" sx={{ fontFamily: "inherit", mb: 2 }}>
            Successfully minted your NFT!
          </Typography>
          <Box sx={{ display: "flex", gap: 10 }}>
            <Button
              variant="outlined"
              size="large"
              href={`https://goerli-optimism.etherscan.io//tx/${data?.hash}`}
              target="_blank"
            >
              Etherscan
            </Button>
            <Button variant="outlined" size="large" href={`/user`}>
              View
            </Button>
          </Box>
        </>
      );
    if (isPrepareError || isError || isTransError)
      return (
        <Typography variant="h5" sx={{ fontFamily: "inherit" }}>
          Error: {(prepareError || error || transError)?.message}
        </Typography>
      );
    return <Loader />;
  }

  return (
    <Box>
      <Grid container spacing={3} justifyContent="center" alignItems="stretch">
        {comics.map((c, indx) => (
          <Grid item key={indx} xs={12} md={4}>
            <Card onClick={() => handleOpenComicModal(c)}>
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
                    sx={{ fontFamily: "inherit" }}
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
        open={isComicModalOpen}
        onClose={handleCloseComicModal}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={backdropStyle}>
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
                sx={{ fontFamily: "inherit" }}
              >
                {selectedComic.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedComic.description}
              </Typography>
            </CardContent>

            <CardActions sx={{ justifyContent: "flex-end" }}>
              {isConnected ? (
                <Button
                  onClick={handleMinting}
                  variant="contained"
                  size="large"
                >
                  Mint NFT
                </Button>
              ) : (
                <ConnectWallet />
              )}
            </CardActions>
          </Card>
        </Box>
      </Modal>

      <Modal
        open={isInfoModalOpen}
        onClose={handleCloseInfoModal}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={backdropStyle}>
          <Box
            sx={{
              p: 5,
              width: "100%",
              background: "var(--yellow)",
              color: "#000",
            }}
          >
            {renderContent()}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
