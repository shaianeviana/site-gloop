import { MONAD_TESTNET, SUPPORTED_CHAINS } from './config';

declare global {
  interface Window {
    ethereum?: any;
    phantom?: any;
    backpack?: any;
  }
}

export type WalletType = 'metamask' | 'phantom' | 'backpack';

export class WalletService {
  private static instance: WalletService;
  private provider: any;
  private walletType: WalletType | null = null;

  private constructor() {}

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  private getProvider(walletType: WalletType): any {
    switch (walletType) {
      case 'metamask': {
        // Garantir que não é Phantom ou Backpack se estiverem sobrescrevendo window.ethereum
        if (window.ethereum && window.ethereum.isMetaMask && !window.ethereum.isPhantom && !window.ethereum.isBackpack) {
          return window.ethereum;
        }
        // Alguns navegadores podem ter múltiplos providers
        if (window.ethereum?.providers) {
          const metamaskProvider = window.ethereum.providers.find((p: any) => p.isMetaMask);
          if (metamaskProvider) return metamaskProvider;
        }
        return null;
      }
      case 'phantom': {
        // Phantom EVM provider
        if (window.phantom?.ethereum && window.phantom.ethereum.isPhantom) {
          return window.phantom.ethereum;
        }
        // Alguns navegadores podem ter múltiplos providers
        if (window.ethereum?.providers) {
          const phantomProvider = window.ethereum.providers.find((p: any) => p.isPhantom);
          if (phantomProvider) return phantomProvider;
        }
        return null;
      }
      case 'backpack': {
        // Backpack EVM provider
        if (window.backpack?.ethereum && window.backpack.ethereum.isBackpack) {
          return window.backpack.ethereum;
        }
        // Alguns navegadores podem ter múltiplos providers
        if (window.ethereum?.providers) {
          const backpackProvider = window.ethereum.providers.find((p: any) => p.isBackpack);
          if (backpackProvider) return backpackProvider;
        }
        return null;
      }
      default:
        return null;
    }
  }

  public async connectWallet(walletType: WalletType): Promise<string> {
    this.walletType = walletType;
    this.provider = this.getProvider(walletType);

    if (!this.provider) {
      throw new Error(`A carteira ${walletType.charAt(0).toUpperCase() + walletType.slice(1)} não suporta EVM/Monad Testnet neste navegador. Por favor, use MetaMask.`);
    }

    // Verifica se a carteira suporta EVM e a Monad Testnet
    if (typeof this.provider.request !== 'function') {
      throw new Error(`A carteira ${walletType.charAt(0).toUpperCase() + walletType.slice(1)} não suporta EVM/Monad Testnet neste navegador. Por favor, use MetaMask.`);
    }

    try {
      let accounts: string[] = [];
      switch (walletType) {
        case 'metamask':
          accounts = await this.provider.request({ method: 'eth_requestAccounts' });
          await this.switchToMonadTestnet();
          break;
        case 'phantom':
        case 'backpack':
          accounts = await this.provider.request({ method: 'eth_requestAccounts' });
          await this.switchToMonadTestnet();
          break;
      }
      return accounts[0];
    } catch (error: any) {
      if (error.code === -32002) {
        throw new Error('Solicitação de conexão já pendente. Verifique sua carteira.');
      }
      if (error.message && error.message.includes('Unsupported network')) {
        throw new Error('A carteira está em uma rede não suportada. Certifique-se de estar na Monad Testnet.');
      }
      throw error;
    }
  }

  public async switchToMonadTestnet(): Promise<void> {
    if (!this.provider) {
      throw new Error('No provider available');
    }
    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MONAD_TESTNET.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await this.provider.request({
            method: 'wallet_addEthereumChain',
            params: [MONAD_TESTNET],
          });
        } catch (addError) {
          console.error('Error adding Monad Testnet:', addError);
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  }

  public async getConnectedAddress(): Promise<string | null> {
    if (!this.provider) return null;
    try {
      let accounts: string[] = [];
      accounts = await this.provider.request({ method: 'eth_accounts' });
      return accounts[0] || null;
    } catch (error) {
      console.error('Error getting connected address:', error);
      return null;
    }
  }

  public async getChainId(): Promise<string> {
    if (!this.provider) throw new Error('No provider available');
    try {
      return await this.provider.request({ method: 'eth_chainId' });
    } catch (error) {
      console.error('Error getting chain ID:', error);
      throw error;
    }
  }

  public isConnected(): boolean {
    if (!this.provider) return false;
    return typeof this.provider.isConnected === 'function' ? this.provider.isConnected() : false;
  }

  public onAccountsChanged(callback: (accounts: string[]) => void): void {
    if (!this.provider) return;
    this.provider.on('accountsChanged', callback);
  }

  public onChainChanged(callback: (chainId: string) => void): void {
    if (!this.provider) return;
    this.provider.on('chainChanged', callback);
  }

  public removeListeners(): void {
    if (!this.provider) return;
    if (typeof this.provider.removeAllListeners === 'function') {
      this.provider.removeAllListeners();
    }
  }

  public getWalletType(): WalletType | null {
    return this.walletType;
  }

  public async disconnectWallet(): Promise<void> {
    if (!this.provider) {
      this.walletType = null;
      return;
    }
    try {
      switch (this.walletType) {
        case 'phantom':
          if (typeof this.provider.disconnect === 'function') {
            await this.provider.disconnect();
          }
          break;
        case 'backpack':
          if (typeof this.provider.disconnect === 'function') {
            await this.provider.disconnect();
          }
          break;
        // MetaMask não possui método oficial de disconnect
        case 'metamask':
        default:
          break;
      }
    } catch (e) {
      // Ignorar erros de disconnect
    }
    this.provider = null;
    this.walletType = null;
  }
} 