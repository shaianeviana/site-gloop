import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://testnet-rpc.monad.xyz");

export async function getClaimedTokenId(txHash: string) {
    const txReceipt = await provider.getTransactionReceipt(txHash);
  
    if (!txReceipt) {
      throw new Error("Transação não encontrada");
    }
  
    // Event signature do ERC721 Transfer
    const transferEventSig = ethers.id("Transfer(address,address,uint256)");
  
    for (const log of txReceipt.logs) {
      if (log.topics[0] === transferEventSig) {
        const from = ethers.getAddress(ethers.zeroPadValue(ethers.stripZerosLeft(log.topics[1]), 20));
        const to = ethers.getAddress(ethers.zeroPadValue(ethers.stripZerosLeft(log.topics[2]), 20));
        const tokenId = ethers.toBigInt(log.topics[3]).toString();
  
        console.log(`NFT transferido de ${from} para ${to} com tokenId ${tokenId}`);
        return tokenId;
      }
    }
  
    throw new Error("Nenhum evento Transfer encontrado");
  }