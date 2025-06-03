import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";

// Cria o client da Thirdweb
export const client = createThirdwebClient({
  clientId: "66031374f5fd53c8f89cb5b0731ed3c2", // seu Client ID
});

// Define o contrato NFT Drop (ERC721 Drop)
export const contract = getContract({
  client,
  chain: defineChain(10143), // Monad Testnet
  address: "0x4bA83eF5F5eBa7A3690A38Dc63F9604CEF3a8cfb", // seu contrato
});
