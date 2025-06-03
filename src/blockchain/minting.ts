import { ContractService } from './contract';

export class MintingService {
  private static instance: MintingService;
  private contractService: ContractService;

  private constructor() {
    this.contractService = ContractService.getInstance();
  }

  public static getInstance(): MintingService {
    if (!MintingService.instance) {
      MintingService.instance = new MintingService();
    }
    return MintingService.instance;
  }

  public async mintNFT() {
    try {
      const tx = await this.contractService.mintNFT();
      return tx;
    } catch (error) {
      console.error('Error in minting service:', error);
      throw error;
    }
  }

  public async getBalanceOf(address: string): Promise<number> {
    try {
      return await this.contractService.getBalanceOf(address);
    } catch (error) {
      console.error('Error getting balance in minting service:', error);
      throw error;
    }
  }

  public async getTokenURI(tokenId: number): Promise<string> {
    try {
      return await this.contractService.getTokenURI(tokenId);
    } catch (error) {
      console.error('Error getting token URI in minting service:', error);
      throw error;
    }
  }
} 