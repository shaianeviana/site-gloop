import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://testnet-rpc.monad.xyz");

export interface Attribute {
    trait_type: string;
    value: string;
}

export interface Metadata {
    name: string;
    image: string;
    attributes: Attribute[];
}

export async function getMetadataFromTokenId(tokenId: number): Promise<Metadata | null> {
    const tokenIdPlusOne = tokenId + 1;
    const url = `https://bafybeigge2cxozi7lasv3i5whhafo32ikd7zzpvzysjve6cgirus3bgsju.ipfs.w3s.link/Gloop${tokenIdPlusOne}`;
  
    try {
      const res = await fetch(url);
      const metadata: Metadata = await res.json();
      return metadata;
    } catch (err) {
      console.error("Erro ao buscar metadados:", err);
      return null;
    }
}

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