import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from './config';
import { getWalletClient } from 'wagmi/actions';

// ABI for your NFT contract - replace with your actual contract ABI
const NFT_ABI = [
  "function mint() public payable",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
];

export class ContractService {
  private static instance: ContractService;
  private contract: ethers.Contract | null = null;

  private constructor() {}

  public static getInstance(): ContractService {
    if (!ContractService.instance) {
      ContractService.instance = new ContractService();
    }
    return ContractService.instance;
  }

  private async getContract(): Promise<ethers.Contract> {
    if (!this.contract) {
      const walletClient = await getWalletClient();
      if (!walletClient) {
        throw new Error('No wallet connected');
      }
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, NFT_ABI, signer);
    }
    return this.contract;
  }

  public async mintNFT(): Promise<ethers.ContractTransactionResponse> {
    try {
      const contract = await this.getContract();
      const tx = await contract.mint();
      return tx;
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  }

  public async getBalanceOf(address: string): Promise<number> {
    try {
      const contract = await this.getContract();
      const balance = await contract.balanceOf(address);
      return Number(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  public async getTokenURI(tokenId: number): Promise<string> {
    try {
      const contract = await this.getContract();
      const uri = await contract.tokenURI(tokenId);
      return uri;
    } catch (error) {
      console.error('Error getting token URI:', error);
      throw error;
    }
  }
} 