import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  isConnected: boolean;
  isConnecting: boolean;
  walletAddress: string;
  shortAddress: string;
  isRightNetwork: boolean;
  isMetaMaskAvailable: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToRitual: () => Promise<void>;
  purchaseItem: (
    itemPrice: string,
    itemName: string
  ) => Promise<{ txHash: string }>;
}

const RITUAL_CHAIN_ID = '0x7BB';
const RITUAL_NETWORK_CONFIG = {
  chainId: RITUAL_CHAIN_ID,
  chainName: 'Ritual',
  nativeCurrency: { name: 'RITUAL', symbol: 'RITUAL', decimals: 18 },
  rpcUrls: ['https://rpc.ritualfoundation.org'],
  blockExplorerUrls: ['https://explorer.ritualfoundation.org'],
};

const FEE_RECIPIENT = '0xd06bC18129a8be9af885E7E63B1B95FB19c261b3';
const STORAGE_KEY = 'nexora_wallet';

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const shortenAddress = (addr: string) =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRightNetwork, setIsRightNetwork] = useState(false);
  const [isMetaMaskAvailable] = useState(
    typeof window !== 'undefined' && !!window.ethereum?.isMetaMask
  );

  const checkNetwork = useCallback(async () => {
    if (!window.ethereum) return false;
    try {
      const chainId = (await window.ethereum.request({ method: 'eth_chainId' })) as string;
      const correct = chainId?.toLowerCase() === RITUAL_CHAIN_ID.toLowerCase();
      setIsRightNetwork(correct);
      return correct;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && window.ethereum) {
      setWalletAddress(saved);
      checkNetwork();
    }
  }, [checkNetwork]);

  useEffect(() => {
    if (!window.ethereum) return;
    const eth = window.ethereum;

    const handleAccountsChanged = (accounts: string[]) => {
      if (!accounts || accounts.length === 0) {
        setWalletAddress('');
        localStorage.removeItem(STORAGE_KEY);
      } else {
        setWalletAddress(accounts[0]);
        localStorage.setItem(STORAGE_KEY, accounts[0]);
      }
    };

    const handleChainChanged = () => {
      checkNetwork();
    };

    eth.on?.('accountsChanged', handleAccountsChanged);
    eth.on?.('chainChanged', handleChainChanged);

    return () => {
      eth.removeListener?.('accountsChanged', handleAccountsChanged);
      eth.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [checkNetwork]);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }
    setIsConnecting(true);
    try {
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        localStorage.setItem(STORAGE_KEY, accounts[0]);
        await checkNetwork();
      }
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [checkNetwork]);

  const disconnectWallet = useCallback(() => {
    setWalletAddress('');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const switchToRitual = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: RITUAL_CHAIN_ID }],
      });
      await checkNetwork();
    } catch (err: any) {
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [RITUAL_NETWORK_CONFIG],
          });
          await checkNetwork();
        } catch (addErr) {
          console.error('Failed to add Ritual network:', addErr);
        }
      } else {
        console.error('Failed to switch network:', err);
      }
    }
  }, [checkNetwork]);

  const purchaseItem = useCallback(
    async (itemPrice: string, _itemName: string) => {
      if (!window.ethereum) throw new Error('MetaMask is not installed.');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: FEE_RECIPIENT,
        value: ethers.parseEther(itemPrice),
      });
      await tx.wait();
      return { txHash: tx.hash };
    },
    []
  );

  const isConnected = !!walletAddress;

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isConnecting,
        walletAddress,
        shortAddress: shortenAddress(walletAddress),
        isRightNetwork,
        isMetaMaskAvailable,
        connectWallet,
        disconnectWallet,
        switchToRitual,
        purchaseItem,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
