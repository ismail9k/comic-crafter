import React from "react";

const UserContext = React.createContext({
  user: false,
  setUser: (user: any) => {},
  connectWallet: () => {},
});

export default UserContext;
