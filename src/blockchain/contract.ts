import { contract } from '../../public/lib/thirdweb';

// ABI for your NFT contract - replace with your actual contract ABI
const NFT_ABI = [
  "function mint() public payable",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
];

export class ContractService {
  private static instance: ContractService;

  private constructor() {}

  public static getInstance(): ContractService {
    if (!ContractService.instance) {
      ContractService.instance = new ContractService();
    }
    return ContractService.instance;
  }

  // Debug: logar as chaves do contrato e do erc721
  public async debugContract() {
    try {
      console.log('Contract:', contract);
      console.log('Contract keys:', Object.keys(contract));
      if ((contract as any).erc721) {
        console.log('erc721 keys:', Object.keys((contract as any).erc721));
      } else {
        console.error('contract.erc721 NÃO está disponível!');
      }
    } catch (error) {
      console.error('Erro ao debugar o contrato:', error);
    }
  }

  // Buscar todos os NFTs da coleção
  public async getAllNFTs() {
    try {
      const nfts = await (contract as any).erc721.getAll();
      console.log(nfts);
      return nfts;
    } catch (error) {
      console.error('Erro ao buscar NFTs:', error);
      throw error;
    }
  }

  // Mintar NFT usando claimTo (NFT Drop)
  public async claimTo(address: string, quantity: number) {
    try {
      if (!(contract as any).erc721 || !(contract as any).erc721.claimTo) {
        throw new Error('Método claimTo não está disponível em contract.erc721!');
      }
      const tx = await (contract as any).erc721.claimTo(address, quantity);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Erro ao mintar NFT (claimTo):', error);
      throw error;
    }
  }

  public async getBalanceOf(address: string): Promise<number> {
    try {
      const balance = await (contract as any).erc721.balanceOf(address);
      return Number(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  public async getTokenURI(tokenId: number): Promise<string> {
    try {
      const uri = await (contract as any).erc721.tokenURI(tokenId);
      return uri;
    } catch (error) {
      console.error('Error getting token URI:', error);
      throw error;
    }
  }
} 