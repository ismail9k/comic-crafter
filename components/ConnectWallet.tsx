import { useContext, useEffect } from "react";
import Button from "@mui/material/Button";

import UserContext from "../store/UserContext";

function ConnectWallet() {
  const { setUser, connectWallet } = useContext(UserContext);

  useEffect(() => {
    if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")) {
      handleWalletConnect();
    }
  }, []);

  const handleWalletConnect = async () => {
    const user = await connectWallet();
    if (user) {
      setUser(user);
    }
  };

  return (
    <Button onClick={handleWalletConnect} variant="contained" size="large">
      Connect Wallet
    </Button>
  );
}

export default ConnectWallet;
