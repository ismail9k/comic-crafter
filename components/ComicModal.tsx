import {
  Box,
  Card,
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
import CrossChainTokenSender from "../assets/data/CrossChainTokenSender.json";
import ERC20 from "../assets/data/ERC20.json";

import ConnectWallet from "./ConnectWallet";
import Loader from "./Loader";

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

type Address = `0x${string}`;

const amount = 500;
const destinationChainSelector = "2664363617261496610";
export default function ComicModal({ open, data, onClose }) {
  const { chain } = getNetwork();
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const { address, isConnected } = useAccount();

  const isOptimismGoerli = chain?.id === optimismGoerli.id;

  const paymentAddress = isOptimismGoerli
    ? process.env.NEXT_PUBLIC_OP_PAYEMNT_CONTRACT_ADDRESS
    : process.env.NEXT_PUBLIC_FUJI_PAYEMNT_CONTRACT_ADDRESS;

  const paymentTo = isOptimismGoerli
    ? process.env.NEXT_PUBLIC_OP_CONTRACT_ADDRESS
    : process.env.NEXT_PUBLIC_CROSS_CHAIN_CONTRACT_ADDRESS;

  const buyNFTAddress = isOptimismGoerli
    ? process.env.NEXT_PUBLIC_OP_CONTRACT_ADDRESS
    : process.env.NEXT_PUBLIC_CROSS_CHAIN_CONTRACT_ADDRESS;

  const paymentConfig = usePrepareContractWrite({
    address: paymentAddress as Address,
    abi: ERC20.abi,
    functionName: "approve",
    args: [paymentTo, amount],
  });

  const {
    config: buyNFTConfig,
    refetch,
    error: buyNFTConfigError,
  } = usePrepareContractWrite({
    address: buyNFTAddress as Address,
    abi: isOptimismGoerli ? BookPublisher.abi : CrossChainTokenSender.abi,
    functionName: isOptimismGoerli ? "buySuperNFT" : "send",
    args: isOptimismGoerli
      ? [address]
      : [
          destinationChainSelector,
          process.env.NEXT_PUBLIC_OP_CONTRACT_ADDRESS,
          process.env.NEXT_PUBLIC_FUJI_PAYEMNT_CONTRACT_ADDRESS,
          amount,
        ],
    enabled: false,
  });

  const paymentAction = useContractWrite(paymentConfig.config);
  const buyNFTAction = useContractWrite(buyNFTConfig);

  useWaitForTransaction({
    hash: paymentAction.data?.hash,
    onSuccess() {
      refetch().then(() => buyNFTAction.write?.());
    },
  });

  const {
    isLoading,
    isSuccess,
    error: buyNFTTransactionError,
  } = useWaitForTransaction({
    hash: buyNFTAction.data?.hash,
  });

  const getErrors = () => {
    return (
      paymentConfig?.error ||
      paymentAction?.error ||
      buyNFTAction?.error ||
      buyNFTTransactionError
    )?.message;
  };

  const handleOpenInfoModal = () => {
    setIsInfoModalOpen(true);
  };
  const handleCloseInfoModal = () => {
    if (isLoading) return;
    setIsInfoModalOpen(false);
  };

  const handleMinting = async () => {
    handleOpenInfoModal();
    paymentAction.write?.();
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
              href={`https://goerli-optimism.etherscan.io/tx/${data?.hash}`}
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
    if (getErrors())
      return (
        <Typography variant="h5" sx={{ fontFamily: "inherit" }}>
          Error: {getErrors()}
        </Typography>
      );
    return <Loader />;
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={backdropStyle}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              src={`/imgs/${data.img}`}
              alt={data.title}
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ fontFamily: "inherit" }}
              >
                {data.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.description}
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
    </>
  );
}
