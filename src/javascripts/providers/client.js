import React from "react";

const ClientContext = React.createContext(undefined);

// eslint-disable-next-line react/prop-types
const ClientProvider = ({ client, children }) => {
  return (
    <ClientContext.Provider value={{ client }}>
      {children}
    </ClientContext.Provider>
  );
};

const useClient = () => {
  const context = React.useContext(ClientContext);
  if (context === undefined) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};

export { ClientProvider, useClient };
