import {useMemo} from 'react';

import {ERC20_ABI, ERC20_BRIDGE_ABI, ETH_BRIDGE_ABI, MESSAGING_ABI} from '../abis/ethereum';
import {STARKNET_BRIDGE_ABI, STARKNET_ERC20_ABI} from '../abis/starknet';
import {useTransferData} from '../components/Features/Transfer/Transfer/Transfer.hooks';
import {ETH_BRIDGE_CONTRACT_ADDRESS, MESSAGING_CONTRACT_ADDRESS} from '../config/addresses';
import {useWallets} from '../providers/WalletsProvider/hooks';
import {getContract, getStarknetContract} from '../utils/contract';

export const useContract = (addressOrAddressMap, ABI) => {
  const {chainId} = useWallets();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !chainId) return null;
    let address;
    if (typeof addressOrAddressMap === 'string') {
      address = addressOrAddressMap;
    } else {
      address = addressOrAddressMap[chainId];
    }
    if (!address) return null;
    try {
      return getContract(address, ABI);
    } catch (ex) {
      return null;
    }
  }, [addressOrAddressMap, ABI, chainId]);
};

export const useStarknetContract = (addressOrAddressMap, ABI) => {
  const {chainId} = useWallets();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !chainId) return null;
    let address;
    if (typeof addressOrAddressMap === 'string') {
      address = addressOrAddressMap;
    } else {
      address = addressOrAddressMap[chainId];
    }
    if (!address) return null;
    try {
      return getStarknetContract(address, ABI);
    } catch (ex) {
      return null;
    }
  }, [addressOrAddressMap, ABI, chainId]);
};

export const useTokenContract = tokenAddresses => {
  const tokenContract = useEthereumTokenContract(tokenAddresses);
  const starknetTokenContract = useStarknetTokenContract(tokenAddresses);
  const {isEthereum} = useTransferData();

  return useMemo(() => (isEthereum ? tokenContract : starknetTokenContract), [isEthereum]);
};

export const useTokenBridgeContract = bridgeAddress => {
  const tokenBridgeContract = useEthereumTokenBridgeContract(bridgeAddress);
  const starknetTokenBridgeContract = useStarknetTokenBridgeContract(bridgeAddress);
  const {isEthereum} = useTransferData();

  return useMemo(
    () => (isEthereum ? tokenBridgeContract : starknetTokenBridgeContract),
    [isEthereum]
  );
};

export const useStarknetTokenContract = tokenAddresses =>
  useStarknetContract(tokenAddresses, STARKNET_ERC20_ABI);

export const useEthereumTokenContract = tokenAddresses => useContract(tokenAddresses, ERC20_ABI);

export const useEthBridgeContract = () => useContract(ETH_BRIDGE_CONTRACT_ADDRESS, ETH_BRIDGE_ABI);

export const useMessagingContract = () => useContract(MESSAGING_CONTRACT_ADDRESS, MESSAGING_ABI);

export const useStarknetTokenBridgeContract = bridgeAddress =>
  useContract(bridgeAddress, STARKNET_BRIDGE_ABI);

export const useEthereumTokenBridgeContract = bridgeAddress =>
  useContract(bridgeAddress, ERC20_BRIDGE_ABI);
